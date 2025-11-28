import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    // We return null to handle graceful degradation or UI error messages
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMarketingCaption = async (productName: string, price: string, cta: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Erro: Chave de API não configurada.";

  try {
    const prompt = `
      Crie uma legenda curta, emocionante e persuasiva para o Instagram Stories vendendo um ${productName}.
      O preço é ${price}. A chamada para ação é "${cta}".
      Use emojis. O tom deve ser urgente e animado (estilo Black Friday).
      Máximo de 3 linhas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a legenda.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao gerar legenda. Tente novamente.";
  }
};

export const generateTechSpecs = async (productName: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Erro: Chave de API não configurada.";

  try {
    const prompt = `
      Liste 4 especificações técnicas principais do smartphone ${productName} de forma resumida com emojis (bullets).
      Exemplo:
      * 📸 Câmera 50MP
      * 🔋 Bateria 5000mAh
      Não inclua introdução, apenas a lista.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar especificações.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao gerar ficha técnica.";
  }
};