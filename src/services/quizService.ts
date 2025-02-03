import { axiosInstance } from "../utils/axiosInstance";
import { Quiz } from "../utils/models";

export const createQuiz = (quizRequest: {
    title: string;
    courseId?: number;
    questions: {
        title: string;
        questionTypeId: number;
        answers: {
            title: string;
            isCorrect: boolean;
        }[];
    }[];
}) => axiosInstance.post<Quiz>("/quizzes", quizRequest);

export const getAllQuizzes = () => {
    return axiosInstance.get<Quiz[]>("/quizzes");
};

export const getQuizById = (id: number) => {
    return axiosInstance.get<Quiz>(`/quizzes/${id}`);
};

export const updateQuiz = (quizRequest: {
    title: string | null;
    courseId: number;
    questions: {
        title: string;
        questionTypeId: number;
        answers: {
            title: string;
            isCorrect: boolean;
        }[] | null;
    }[];
}, id: number) => {
    return axiosInstance.put<Quiz>(`/quizzes/${id}`, quizRequest);
};

export const deleteAllQuizzes = () => {
    return axiosInstance.delete("/quizzes");
};

export const deleteQuiz = (id: number) => {
    return axiosInstance.delete(`/quizzes/${id}`);
};

export const getQuizByCourseId = (id: number) => {
    return axiosInstance.get<Quiz>(`/quizzes/course/${id}`);
};

export const deleteQuizByCourseId = (id: number) => {
    return axiosInstance.delete(`/quizzes/course/${id}`);
};