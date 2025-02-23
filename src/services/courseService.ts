import { axiosInstance } from "../utils/axiosInstance";
import { Course, Enrollment, User } from "../utils/models";

export const createCourse = (course: {
    title: string,
    shortDescription: string,
    description: string,
    isActive: boolean,
    image: string | null,
}) => axiosInstance.post<Course>("/courses", course);

export const createEmptyCourse = () => axiosInstance.post("/courses/empty");

// export const createCourseWithDetails = (courseData: {
//     title: string,
//     shortDescription: string,
//     description: string,
//     isActive: boolean,
//     image: string,
//     lessons: {
//         title: string;
//         content: string;
//         lessonOrder: number;
//         files: {
//             name: string;
//             type: string;
//             data: string;  // Base64-encoded content
//         }[];
//     }[];
//     quiz: {
//         title: string;
//         questions: {
//             title: string;
//             questionTypeId: number;
//             answers: {
//                 title: string;
//                 isCorrect: boolean;
//             }[];
//         }[];
//     };
// }) => axiosInstance.post("/courses/bulk-create", courseData);

export const getAllCourses = () => axiosInstance.get<Course[]>("/courses");

export const getCourseById = (id: number) => axiosInstance.get<Course>(`/courses/${id}`);

export const updateCourse = (course: {
    id: number,
    title: string | null,
    shortDescription: string | null,
    description: string | null,
    isActive: boolean | null,
    image: string | null,
}) => axiosInstance.put<Course>("/courses", course);

export const deleteAllCourses = () => axiosInstance.delete<void>("/courses");

export const deleteCourse = (id: number) => axiosInstance.delete<void>(`/courses/${id}`);

export const getInstructorCourses = (id: number) => axiosInstance.get<Course[]>(`/courses/instructor/${id}`);

export const getMyCourses = () => axiosInstance.get<Course[]>("/courses/instructor/logged-in");

export const getMyEnrolledCourses = () => axiosInstance.get<Course[]>("/courses/student/logged-in");

export const isUserEnrolledInCourse = (id: number) => axiosInstance.get<boolean>(`/courses/is-enrolled/${id}`);

export const isUserOwnerOfCourse = (id: number) => axiosInstance.get<boolean>(`/courses/is-instructor/${id}`);

export const getOwnerOfCourse = (id: number) => axiosInstance.get<User>(`/courses/owner/${id}`);

export const getStudentsInCourse = (id: number) => axiosInstance.get<User[]>(`/courses/students/${id}`);

export const getCourseSearchResults = (query: string) => axiosInstance.get<Course[]>(`/courses/search?query=${encodeURIComponent(query)}`);

export const getRandomCourses = () => axiosInstance.get<Course[]>(`/courses/random`);

export const getCoursesWithoutQuiz = () => axiosInstance.get<Course[]>("/courses/without-quiz");

export const getCourseBySlug = (slug: string) => axiosInstance.get<Course>(`/courses/slug/${slug}`);

export const enrollToCourse = (courseId: number) => axiosInstance.post<Enrollment>(`/enrollments/course/${courseId}`);

export const removeEnrollmentToCourse = (courseId: number) => axiosInstance.delete<void>(`/enrollments/course/${courseId}`);