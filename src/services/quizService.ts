import { axiosInstance } from "../utils/axiosInstance";

export const createQuiz = (quiz: {
    title: string,
    courseId: number
}) => axiosInstance.post("/quizzes", quiz);

export const getAllQuizzes = () => axiosInstance.get("/quizzes");

export const getQuizById = (id: number) => axiosInstance.get(`/quizzes/${id}`);

export const updateQuiz = (quiz: {
    id: number,
    title: string | null,
    courseId: number | null
}) => axiosInstance.put("/quizzes", quiz);

export const deleteAllQuizzes = () => axiosInstance.delete("/quizzes");

export const deleteQuiz = (id: number) => axiosInstance.delete(`/quizzes/${id}`);

export const getQuizzesByCourseId = (id: number) => axiosInstance.get(`/quizzes/course/${id}`);

export const deleteQuizzesByCourseId = (id: number) => axiosInstance.delete(`/quizzes/course/${id}`);