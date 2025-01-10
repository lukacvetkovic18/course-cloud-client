import { axiosInstance } from "../utils/axiosInstance";

export const createCourse = (course: {
    title: string,
    description: string,
    isActive: boolean,
    duration: number
}) => axiosInstance.post("/courses", course);

export const getAllCourses = () => axiosInstance.get("/courses");

export const getCourseById = (id: number) => axiosInstance.get(`/courses/${id}`);

export const updateCourse = (course: {
    id: number,
    title: string | null,
    description: string | null,
    isActive: boolean | null,
    duration: number | null
}) => axiosInstance.put("/courses", course);

export const deleteAllCourses = () => axiosInstance.delete("/courses");

export const deleteCourse = (id: number) => axiosInstance.delete(`/courses/${id}`);

export const getInstructorCourses = (id: number) => axiosInstance.get(`/courses/instructor/${id}`);

export const getMyCourses = () => axiosInstance.get("/courses/instructor/logged-in");

export const isUserEnrolledInCourse = (id: number) => axiosInstance.get(`/courses/is-enrolled/${id}`);

export const isUserOwnerOfCourse = (id: number) => axiosInstance.get(`/courses/is-instructor/${id}`);

export const getOwnerOfCourse = (id: number) => axiosInstance.get(`/courses/owner/${id}`);

// axios.post("http://localhost:8080/api/users/login", {
//     email: "mgkhj@mail.com",
//     password: "test"
// }).then((response) => {
//     localStorage.setItem('token', response.data.token);
    