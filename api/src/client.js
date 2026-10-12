import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
    timeout: 60_000,
    maxRetries: 1,
})

const systemInstruction = `
Você é um engenheiro químico sênior especialista em produção de etanol (de cana-de-açúcar e milho). 
Sua função é gerenciar os dados do projeto do usuário, responder dúvidas técnicas sobre moagem, fermentação, destilação e rendimento, e gerar relatórios estruturados quando solicitado.
Mantenha um tom profissional, preciso e focado na indústria sucroenergética.

DIRETRIZES DE FORMATAÇÃO DE TEXTO:
1. Responda de forma objetiva e resumida utilizando os dados em tempo real fornecidos do sistema de monitoramento.
2. Caso o usuário solicite ou o estado crítico do processo exija, elabore um relatório técnico detalhado sobre o monitoramento atual.
3. REGRA DE FORMATAÇÃO ESTRITA: NUNCA utilize asteriscos duplos ("**") para negrito. Em vez disso, envolva obrigatoriamente qualquer termo de destaque ou título usando tags HTML <strong> (ex: <strong>Temperatura crítica</strong>).
4. Estruture suas respostas utilizando quebras de linha claras, listas em tópicos e seções organizadas para garantir uma leitura fluida e confortável em painéis e relatórios.
`;

export default async function ClientOpenai({ message, history = [] , context = {} }) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY não definida no .env");
    }

    console.log(context)

    try {
        const contextString = `
        [ESTADO ATUAL DO EQUIPAMENTO / COLUNA DE DESTILAÇÃO]
        - Temperatura do Destilador: ${context.temperaturaDestilador ?? 'N/D'} °C
        - Temperatura do Resfriador: ${context.temperaturaResfriador ?? 'N/D'} °C
        - Pressão da Mangueira: ${context.pressaoMangueira ?? 'N/D'} bar
        - Nível: ${context.nivel ?? 'N/D'} %
        - Aquecimento: ${context.aquecimento ? 'Ligado' : 'Desligado'}
        - Resfriamento: ${context.resfriamento ? 'Ligado' : 'Desligado'}
        - Operando: ${context.operando ? 'Sim' : 'Não'}
        `.trim();

        const messages = [
            { role: "system", content: systemInstruction },
            
            // Mapeia o histórico caso venha no formato [{ role, content }, ...]
            ...(Array.isArray(history) ? history : []),
            
            // Adiciona o contexto técnico e a mensagem atual combinados na mensagem do usuário
            { 
                role: "user", 
                content: `${contextString}\n\nPergunta/Comando do Operador: ${message}` 
            }
        ];

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-120b", // Substituído pelo modelo ativo na Groq
            messages: messages,
            temperature: 0.7,
            max_tokens: 4096,
        })

        const responseMessage = completion.choices[0]?.message.content;
        
        return responseMessage;
    } catch (err) {
        console.error("Erro Groq:", err.status, err.message)
        throw err
    }
}