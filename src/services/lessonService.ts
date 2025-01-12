import { axiosInstance } from "../utils/axiosInstance";

export const createLesson = (lesson: {
    courseId: number,
    title: string,
    content: string,
    lessonOrder: number
}) => axiosInstance.post("/lessons", lesson);

export const createEmptyLesson = (lesson: {
    courseId: number
}) => axiosInstance.post("/lessons/empty", lesson);

export const getAllLessons = () => axiosInstance.get("/lessons");

export const getLessonById = (id: number) => axiosInstance.get(`/lessons/${id}`);

export const updateLesson = (lesson: {
    id: number,
    courseId: number | null,
    title: string | null,
    content: string | null,
    lessonOrder: number | null
}) => axiosInstance.put("/lessons", lesson);

export const deleteAllLessons = () => axiosInstance.delete("/lessons");

export const deleteLesson = (id: number) => axiosInstance.delete(`/lessons/${id}`);

export const getLessonsByCourseId = (id: number) => axiosInstance.get(`/lessons/course/${id}`);