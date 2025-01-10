import { axiosInstance } from "../utils/axiosInstance";

export const createAnswer = (answer: {
    title: string,
    questionId: number
}) => axiosInstance.post("/answers", answer);

export const getAllAnswers = () => axiosInstance.get("/answers");

export const getAnswerById = (id: number) => axiosInstance.get(`/answers/${id}`);

export const updateAnswer = (answer: {
    id: number,
    title: string | null,
    questionId: number | null
}) => axiosInstance.put("/answers", answer);

export const deleteAllAnswers = () => axiosInstance.delete("/answers");

export const deleteAnswer = (id: number) => axiosInstance.delete(`/answers/${id}`);