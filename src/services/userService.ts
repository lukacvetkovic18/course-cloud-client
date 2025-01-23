import { axiosInstance } from "../utils/axiosInstance";

export const loginUser = (user: {
    email: string,
    password: string
}) => axiosInstance.post("/users/login", user);

export const registerUser = (user: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: Date,
    gender: string,
    isActive: boolean,
    userRoleIds: number[]
}) => axiosInstance.post("/users/register", user);

export const createUser = (user: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: Date,
    gender: string,
    isActive: boolean,
    userRoleIds: number[]
}) => axiosInstance.post("/users", user);

export const getLoggedInUser = () => axiosInstance.get("/users/logged-in");

export const getAllUsers = () => axiosInstance.get("/users");

export const getUserById = (id: number) => axiosInstance.get(`/users/${id}`);

export const updateUser = (user: {
    id: number,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    dateOfBirth: Date | null,
    gender: string | null,
    address: string | null,
    isActive: boolean | null,
    profilePicture: string | null,
    phoneNumber: string | null,
    instagram: string | null,
    linkedIn: string | null,
    userRoleIds: number[] | null
}) => axiosInstance.put("/users", user);

export const deleteAllUsers = () => axiosInstance.delete("/users");

export const deleteUser = (id: number) => axiosInstance.delete(`/users/${id}`);

export const getUserRoles = () => axiosInstance.get("/users/roles");

export const getUsersByRole = (role: string) => axiosInstance.get(`/users/role/${role}`);

export const getInstructorSearchResults = (query: string) => axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}`);