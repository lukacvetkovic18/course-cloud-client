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
    address: string | null,
    isActive: boolean,
    profilePicture: string | null,
    phoneNumber: string | null,
    instagram: string | null,
    linkedIn: string | null,
    userRoleIds: number[],
    slug: string | null
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
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    password?: string | null,
    dateOfBirth: Date | null,
    gender: string | null,
    address: string | null,
    isActive: boolean | null,
    profilePicture: string | null,
    phoneNumber: string | null,
    instagram: string | null,
    linkedIn: string | null,
    userRoleIds: number[],
    slug: string | null
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
    image: string | null,
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
    title: string | null,
    shortDescription: string | null,
    description: string | null,
    isActive: boolean | null,
    image: string | null,
    ownerId: number | null
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
    if (lesson.files) {
        lesson.files.forEach(fileRequest => {
            formData.append('files', fileRequest.file);  // Append each file individually with the same field name
        });
    }

    // Log formData entries to verify files are added correctly
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
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
    return axiosInstance.put<Quiz>(`/admin/quizzes/${id}`, quizRequest);
};

export const deleteAllQuizzes = () => {
    return axiosInstance.delete('/admin/quizzes');
};

export const deleteQuiz = (id: number) => {
    return axiosInstance.delete(`/admin/quizzes/${id}`);
};