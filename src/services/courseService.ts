import { axiosInstance } from "../utils/axiosInstance";

export const createCourse = (course: {
    title: string,
    shortDescription: string,
    description: string,
    isActive: boolean,
    image: string,
}) => axiosInstance.post("/courses", course);

export const createEmptyCourse = () => axiosInstance.post("/courses/empty");

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

export const isUserEnrolledInCourse = (id: number) => axiosInstance.get(`/courses/is-enrolled/${id}`);

export const isUserOwnerOfCourse = (id: number) => axiosInstance.get(`/courses/is-instructor/${id}`);

export const getOwnerOfCourse = (id: number) => axiosInstance.get(`/courses/owner/${id}`);

export const getCourseSearchResults = (query: string) => axiosInstance.get(`/courses/search?query=${encodeURIComponent(query)}`);