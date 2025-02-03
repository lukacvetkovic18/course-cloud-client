import { useEffect, useState } from "react";
import { User } from "../utils/models";
import { getLoggedInUser } from "../services";
import { useNavigate } from "react-router";
import { Header } from "./Header";
import { ManageCourses } from "./panelStates/ManageCourses";
import { ManageLessons } from "./panelStates/ManageLessons";
import { ManageQuizzes } from "./panelStates/ManageQuizzes";
import { ManageUsers } from "./panelStates/ManageUsers";
import { isUserAdmin } from "../services/userService";

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
        loadIsAdmin();
    }, [])

    const loadIsAdmin = () => {
        isUserAdmin().then(res => {
            if(!res.data){
                navigate("/home")
            }
        })
    }

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const render = () => {
        if(adminPanelState === AdminPanelState.USERS) {
            return (
                <ManageUsers/>
            )
        } else if(adminPanelState === AdminPanelState.COURSES) {
            return (
                <ManageCourses/>
            )
        } else if(adminPanelState === AdminPanelState.LESSONS) {
            return (
                <ManageLessons/>
            )
        } else {
            return (
                <ManageQuizzes/>
            )
        }
    }
 
    return (<>
        {user && <Header user={user} adminPanelState={adminPanelState} setAdminPanelState={setAdminPanelState}></Header>}
        <div className="admin-panel-container">
        {
            render()
        }
        </div>
    </>);
}