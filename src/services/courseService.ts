import { axiosInstance } from "../utils/axiosInstance";
import { Course, User } from "../utils/models";

export const createCourse = (course: {
    title: string,
    shortDescription: string,
    description: string,
    isActive: boolean,
    image: string,
}) => axiosInstance.post("/courses", course);

export const createEmptyCourse = () => axiosInstance.post("/courses/empty");

export const createCourseWithDetails = (courseData: {
    title: string,
    shortDescription: string,
    description: string,
    isActive: boolean,
    image: string,
    lessons: {
        title: string;
        content: string;
        lessonOrder: number;
        files: {
            name: string;
            type: string;
            data: string;  // Base64-encoded content
        }[];
    }[];
    quiz: {
        title: string;
        questions: {
            title: string;
            questionTypeId: number;
            answers: {
                title: string;
                isCorrect: boolean;
            }[];
        }[];
    };
}) => axiosInstance.post("/courses/bulk-create", courseData);

export const getAllCourses = () => axiosInstance.get("/courses");

export const getCourseById = (id: number) => axiosInstance.get(`/courses/${id}`);

export const updateCourse = (course: {
    id: number,
    title: string | null,
    shortDescription: string | null,
    description: string | null,
    isActive: boolean | null,
    image: string | null,
}) => axiosInstance.put("/courses", course);

export const deleteAllCourses = () => axiosInstance.delete("/courses");

export const deleteCourse = (id: number) => axiosInstance.delete(`/courses/${id}`);

export const getInstructorCourses = (id: number) => axiosInstance.get(`/courses/instructor/${id}`);

export const getMyCourses = () => axiosInstance.get("/courses/instructor/logged-in");

export const getMyEnrolledCourses = () => axiosInstance.get<Course[]>("/courses/student/logged-in");

export const isUserEnrolledInCourse = (id: number) => axiosInstance.get(`/courses/is-enrolled/${id}`);

export const isUserOwnerOfCourse = (id: number) => axiosInstance.get(`/courses/is-instructor/${id}`);

export const getOwnerOfCourse = (id: number) => axiosInstance.get(`/courses/owner/${id}`);

export const getStudentsInCourse = (id: number) => axiosInstance.get<User[]>(`/courses/students/${id}`);

export const getCourseSearchResults = (query: string) => axiosInstance.get(`/courses/search?query=${encodeURIComponent(query)}`);

export const getRandomCourses = () => axiosInstance.get<Course[]>(`/courses/random`);