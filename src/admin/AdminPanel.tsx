import { useEffect, useState } from "react";
import { User } from "../utils/models";
import { getLoggedInUser } from "../services";
import { useNavigate } from "react-router";
import { Header } from "./Header";
import { ManageCourses } from "./panelStates/ManageCourses";

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

    const render = () => {
        if(adminPanelState === AdminPanelState.COURSES) {
            return (
                <ManageCourses/>
            )
        // } else if(adminPanelState === AdminPanelState.EDIT) {
        //     return (
        //         <div>
        //             <EditMyProfile user={user} setUser={setUser}></EditMyProfile>
        //         </div>
        //     )
        // } else {
        //     return (
        //         // <div>
        //             <MyQuizResults user={user!}></MyQuizResults>
        //         /* </div> */
        //     )
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