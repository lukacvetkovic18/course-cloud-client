import { axiosInstance } from "../utils/axiosInstance";

export const createQuizAttempt = (userId: number, quizId: number, selectedAnswerIds: Record<number, number[]>, textAnswers: Record<number, string>) => {
    return axiosInstance.post('/api/quiz-attempts', {
        userId,
        quizId,
        selectedAnswerIds,
        textAnswers
    });
  };