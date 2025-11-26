import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLeaseAdvice = async (prompt: string, contextData: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API 키 설정을 확인해주세요.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        당신은 한국의 전문적인 부동산 임대 관리 비서입니다.
        사용자의 요청에 따라 정중하고 전문적인 톤으로 답변하세요.
        
        [현재 상황 데이터]
        ${contextData}

        [사용자 요청]
        ${prompt}
      `,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text || "응답을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 서비스 연결 중 오류가 발생했습니다.";
  }
};

export const draftNoticeMessage = async (tenantName: string, amount: number, type: string, daysOverdue: number): Promise<string> => {
    const ai = getClient();
    if (!ai) return "API 키 설정을 확인해주세요.";

    const prompt = `
      임차인 ${tenantName}님에게 보낼 ${type} 미납 안내 문자를 작성해주세요.
      미납 금액은 ${amount.toLocaleString()}원 이며, 납부 예정일로부터 ${daysOverdue}일 지났습니다.
      정중하지만 단호하게 납부를 요청하는 톤으로 작성해주세요. 3가지 다른 버전(부드러움, 표준, 단호함)을 제안해주세요.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "메시지를 생성할 수 없습니다.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "AI 서비스 오류 발생.";
    }
}