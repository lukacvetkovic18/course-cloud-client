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
export const getFile = (id: number) => {
    return axiosInstance.get(`/files/${id}`, { responseType: 'blob' });
};