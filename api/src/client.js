import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'

const ai = new GoogleGenAI({});

// 1. Defina o contexto do seu especialista e do projeto
const systemInstruction = `
Você é um engenheiro químico sênior especialista em produção de etanol (de cana-de-açúcar e milho).
Sua função é gerenciar os dados do projeto do usuário, responder dúvidas técnicas sobre moagem, fermentação, destilação e rendimento, e gerar relatórios estruturados quando solicitado.
Mantenha um tom profissional, preciso e focado na indústria sucroenergética.
`;

export default async function ClientGemini(prompt) {
    // 2. Passe as instruções do sistema junto com a requisição
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.2, // Temperatura mais baixa para respostas mais precisas e técnicas
        },
        contents: prompt,
    });
    return response.text    
}