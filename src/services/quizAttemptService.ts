import { axiosInstance } from "../utils/axiosInstance";
import { QuizAttempt, QuizAttemptAnswer } from "../utils/models";

export const createQuizAttempt = (userId: number, quizId: number, selectedAnswerIds: Record<number, number[]>, textAnswers: Record<number, string>) => {
    return axiosInstance.post('/quiz-attempts', {
        userId,
        quizId,
        selectedAnswerIds,
        textAnswers
    });
};

export const getQuizAttemptByQuizAndUser = (quizId: number, userId: number) => {
    return axiosInstance.get<QuizAttempt>(`/quiz-attempts/quiz/${quizId}/user/${userId}`);
};

export const getQuizAttemptAnswersByQuizAttempt = (quizAttemptId: number) => {
    return axiosInstance.get<QuizAttemptAnswer[]>(`/quiz-attempts/${quizAttemptId}`);
};

export const getUserAttempts = (userId: number) => {
    return axiosInstance.get<QuizAttempt[]>(`/quiz-attempts/user/${userId}`);
};

export const getQuizAttemptsByCourseId = (courseId: number) => {
    return axiosInstance.get<QuizAttempt[]>(`/quiz-attempts/course/${courseId}`);
};
