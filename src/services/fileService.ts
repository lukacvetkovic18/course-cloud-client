import { axiosInstance } from "../utils/axiosInstance";

export const uploadFile = (file: any, lessonId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('lessonId', lessonId.toString());

    return axiosInstance.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const downloadFile = (id: number) => {
    return axiosInstance.get(`/files/download/${id}`, { responseType: 'blob' });
};

export const deleteFile = (id: number) => axiosInstance.delete(`/files/${id}`);

export const getFilesByLessonId = (id: number) => axiosInstance.get(`/files/lesson/${id}`);

export const deleteFilesByLessonId = (id: number) => axiosInstance.delete(`/files/lesson/${id}`);

export const getFilesByLessonIds = (ids: number[]) => axiosInstance.post(`/files/lessons/files`, ids);