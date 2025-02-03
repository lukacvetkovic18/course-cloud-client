import { axiosInstance } from "../utils/axiosInstance";
import { Lesson } from "../utils/models";

export const createLesson = (lesson: {
    courseId: number,
    title: string,
    files: {
        file: File
    }[]
}) => {
    const formData = new FormData();
    formData.append('courseId', lesson.courseId.toString());
    formData.append('title', lesson.title);
    if (lesson.files) {
        lesson.files.forEach(fileRequest => {
            formData.append('files', fileRequest.file);
        });
    }

    return axiosInstance.post<Lesson>("/lessons", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const createEmptyLesson = (lesson: {
    courseId: number
}) => axiosInstance.post("/lessons/empty", lesson);

export const getAllLessons = () => {
    return axiosInstance.get<Lesson[]>("/lessons");
};

export const getLessonById = (id: number) => {
    return axiosInstance.get<Lesson>(`/lessons/${id}`);
};

export const updateLesson = (lesson: {
    id: number;
    courseId: number | null;
    title: string | null;
    files: {
        file: File
    }[] | null
}) => {
    const formData = new FormData();
    formData.append('id', lesson.id.toString());
    if (lesson.courseId) formData.append('courseId', lesson.courseId.toString());
    if (lesson.title) formData.append('title', lesson.title);
    if (lesson.files) {
        lesson.files.forEach(fileRequest => {
            formData.append('files', fileRequest.file);  // Append each file individually with the same field name
        });
    }

    // Log formData entries to verify files are added correctly
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    return axiosInstance.put<Lesson>("/lessons", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteAllLessons = () => {
    return axiosInstance.delete("/lessons");
};

export const deleteLesson = (id: number) => {
    return axiosInstance.delete(`/lessons/${id}`);
};

export const getLessonsByCourseId = (id: number) => {
    return axiosInstance.get<Lesson[]>(`/lessons/course/${id}`);
};