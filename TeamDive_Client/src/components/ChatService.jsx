import axios from "axios";



export const askChatbot = async (input) => {
    try {
        
        const response = await axios.post("/api/chat/ask", { 
            text: input,
        });

        return response.data.reply || "서버에서 응답이 없습니다.";
    } catch (error) {
        console.error("챗봇 에러 : ", error);
        return "챗봇 응답을 가져오는 중 오류가 발생했습니다.";
    }
};
