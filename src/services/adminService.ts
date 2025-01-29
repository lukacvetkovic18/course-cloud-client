import { axiosInstance } from "../utils/axiosInstance";
import { Course, Lesson, Quiz, User } from "../utils/models";

// USERS

export const createUser = (user: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: Date,
    gender: string,
    address?: string,
    isActive: string,
    profilePicture?: string,
    phoneNumber?: string,
    instagram?: string,
    linkedIn?: string,
    userRoleIds: number[],
    slug?: string
}) => {
    return axiosInstance.post<User>('/admin/users', user);
};

export const getAllUsers = () => {
    return axiosInstance.get<User[]>('/admin/users');
};

export const getUserById = (id: number) => {
    return axiosInstance.get<User>(`/admin/users/${id}`);
};

export const updateUser = (user: {
    id: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    dateOfBirth?: Date,
    gender?: string,
    address?: string,
    isActive?: string,
    profilePicture?: string,
    phoneNumber?: string,
    instagram?: string,
    linkedIn?: string,
    userRoleIds?: number[],
    slug?: string
}) => {
    return axiosInstance.put<User>('/admin/users', user);
};

export const deleteAllUsers = () => {
    return axiosInstance.delete('/admin/users');
};

export const deleteUser = (id: number) => {
    return axiosInstance.delete(`/admin/users/${id}`);
};

// COURSES

export const createCourse = (course: {
    title: string,
    shortDescription: string,
    description: string,
    isActive: boolean,
    image?: string,
    ownerId: number
}) => {
    return axiosInstance.post<Course>('/admin/courses', course);
};

export const getAllCourses = () => {
    return axiosInstance.get<Course[]>('/admin/courses');
};

export const getCourseById = (id: number) => {
    return axiosInstance.get<Course>(`/admin/courses/${id}`);
};

export const updateCourse = (course: {
    id: number,
    title?: string,
    shortDescription?: string,
    description?: string,
    isActive?: boolean,
    image?: string,
    ownerId?: number
}) => {
    return axiosInstance.put<Course>('/admin/courses', course);
};

export const deleteAllCourses = () => {
    return axiosInstance.delete('/admin/courses');
};

export const deleteCourse = (id: number) => {
    return axiosInstance.delete(`/admin/courses/${id}`);
};

// LESSONS

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
    lesson.files.forEach((fileRequest, index) => {
        formData.append(`files[${index}]`, fileRequest.file);
    });
    return axiosInstance.post<Lesson>('/admin/lessons', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getAllLessons = () => {
    return axiosInstance.get<Lesson[]>('/admin/lessons');
};

export const getLessonById = (id: number) => {
    return axiosInstance.get<Lesson>(`/admin/lessons/${id}`);
};

export const updateLesson = (lesson: {
    id: number;
    courseId?: number;
    title?: string;
    files?: {
        file: File
    }[]
}) => {
    const formData = new FormData();
    formData.append('id', lesson.id.toString());
    if (lesson.courseId) formData.append('courseId', lesson.courseId.toString());
    if (lesson.title) formData.append('title', lesson.title);
    if (lesson.files) {
        lesson.files.forEach((fileRequest, index) => {
            formData.append(`files[${index}]`, fileRequest.file);
        });
    }
    return axiosInstance.put<Lesson>('/admin/lessons', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteAllLessons = () => {
    return axiosInstance.delete('/admin/lessons');
};

export const deleteLesson = (id: number) => {
    return axiosInstance.delete(`/admin/lessons/${id}`);
};

// QUIZZES

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
}) => {
    return axiosInstance.post<Quiz>('/admin/quizzes', quizRequest);
};

export const getAllQuizzes = () => {
    return axiosInstance.get<Quiz[]>('/admin/quizzes');
};

export const getQuizById = (id: number) => {
    return axiosInstance.get<Quiz>(`/admin/quizzes/${id}`);
};

export const updateQuiz = (quizRequest: {
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
}, id: number) => {
    return axiosInstance.put<Quiz>(`/admin/quizzes/${id}`, quizRequest);
};

export const deleteAllQuizzes = () => {
    return axiosInstance.delete('/admin/quizzes');
};

export const deleteQuiz = (id: number) => {
    return axiosInstance.delete(`/admin/quizzes/${id}`);
};