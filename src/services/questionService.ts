import { axiosInstance } from "../utils/axiosInstance";

export const createQuestion = (question: {
    title: string,
    questionTypeId: number,
    quizId: number
}) => axiosInstance.post("/questions", question);

export const getAllQuestions = () => axiosInstance.get("/questions");

export const getQuestionById = (id: number) => axiosInstance.get(`/questions/${id}`);

export const updateQuestion = (question: {
    id: number,
    title: string | null,
    questionTypeId: number | null,
    quizId: number | null
}) => axiosInstance.put("/questions", question);

export const deleteAllQuestions = () => axiosInstance.delete("/questions");

export const deleteQuestion = (id: number) => axiosInstance.delete(`/questions/${id}`);

export const getQuestionsByQuizId = (id: number) => axiosInstance.get(`/questions/quiz/${id}`);

export const deleteQuestionsByQuizId = (id: number) => axiosInstance.delete(`/questions/quiz/${id}`);

export const getAllQuestionTypes = () => axiosInstance.get("/questions/types");

export const updateQuestionWithAnswers = (question: {
    id: number,
    title: string,
    questionTypeId: number,
    answers: [{
        id: number,
        title: string,
        isCorrect: boolean
    }]
}) => axiosInstance.put("/questions/update-with-answers", question);