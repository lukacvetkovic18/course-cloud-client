import { useEffect, useState } from "react";
import { Course, User } from "../utils/models";
import { getLoggedInUser, getAllCourses } from "../services";
import { useNavigate } from "react-router";
import { Header } from "./Header";

export enum AdminPanelState {
    USERS,
    COURSES,
    QUIZZES,
    LESSONS
}

export const AdminPanel = () => {
    const navigate = useNavigate();

    let [user, setUser] = useState<User>();
    let [adminPanelState, setAdminPanelState] = useState<AdminPanelState>(AdminPanelState.USERS);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
    }, [])

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }
 
    return (<>
        {user && <Header user={user} adminPanelState={adminPanelState} setAdminPanelState={setAdminPanelState}></Header>}
        <div className="home-container">
            <span className="subtitle">Reccomended courses</span>
            <div className="cards-container">
            {
            }
            </div>
        </div>
    </>);
}