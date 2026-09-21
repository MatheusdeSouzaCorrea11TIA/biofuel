import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const systemInstruction = `
Você é um engenheiro químico sênior especialista em produção de etanol (de cana-de-açúcar e milho).
Sua função é gerenciar os dados do projeto do usuário, responder dúvidas técnicas sobre moagem, fermentação, destilação e rendimento, e gerar relatórios estruturados quando solicitado.
Mantenha um tom profissional, preciso e focado na indústria sucroenergética.
`;

export default async function ClientGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("A variável GEMINI_API_KEY não está definida no ambiente ou no arquivo .env");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Uso da Interactions API recomendada pela Google
    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
        system_instruction: systemInstruction
    });

    console.log(interaction.output_text);

    // Retorna a saída correta da interação
    return interaction.output_text;
}