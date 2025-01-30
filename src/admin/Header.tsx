import { useState } from "react";
import "../styles"
import blank  from "../assets/blank-profile-picture.png"
import userIcon from "../assets/user-header-icon.png"
import { useNavigate } from "react-router";
import { User } from "../utils/models";
import { AdminPanelState } from "./AdminPanel";

interface HeaderProps {
    user: User;
    adminPanelState: AdminPanelState;
    setAdminPanelState: React.Dispatch<React.SetStateAction<AdminPanelState>>;
}

export const Header = ({user, adminPanelState, setAdminPanelState}: HeaderProps) => {
    const navigate = useNavigate();

    return (<>
        <div className="header-container">
            <div className="left">
                <span className="title">CourseCloud</span>
                <span>ADMIN PANEL</span>
                <div className="nav-bar">
                    <span className={(adminPanelState === AdminPanelState.USERS ? 'active' : '')} onClick={() => setAdminPanelState(AdminPanelState.USERS)}>USERS</span>
                    <span className={(adminPanelState === AdminPanelState.COURSES ? 'active' : '')} onClick={() => setAdminPanelState(AdminPanelState.COURSES)}>COURSES</span>
                    <span className={(adminPanelState === AdminPanelState.LESSONS ? 'active' : '')} onClick={() => setAdminPanelState(AdminPanelState.LESSONS)}>LESSONS</span>
                    <span className={(adminPanelState === AdminPanelState.QUIZZES ? 'active' : '')} onClick={() => setAdminPanelState(AdminPanelState.QUIZZES)}>QUIZZES</span>
                </div>
            </div>
            <div className="right">
                <img src={userIcon} className="profile-picture" onClick={() => navigate("/home")}/>
                <span className="user-name">{user.firstName}</span>
                <img src={user.profilePicture || blank} className="profile-picture" onClick={() => navigate("/my-profile")}/>
            </div>
        </div>
        </>);
}