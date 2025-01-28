import { useEffect, useRef, useState } from "react";
import logoutIcon from "../assets/logout.png"
import { useNavigate } from "react-router";
import { User } from "../utils/models";
import { getLoggedInUser } from "../services";
import { Footer, Header } from "../components";
import { ViewProfile } from "../components/ViewProfile";
import { EditMyProfile } from "../components/EditMyProfile";
import { MyQuizResults } from "../components/student/MyQuizResults";

export enum MyProfileState {
    VIEW,
    EDIT,
    QUIZ_RESULTS
}

export const MyProfile = () => {
    let [profileState, setProfileState] = useState<MyProfileState>(MyProfileState.VIEW);

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
    }, []);

    useEffect(() => {
        render()
    }, [profileState])

    let [user, setUser] = useState<User>();
    let popupRef = useRef<HTMLDivElement>(null);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const logout = () => {

    }

    const render = () => {
        if(profileState === MyProfileState.VIEW) {
            return (
                <div>
                    <ViewProfile user={user}></ViewProfile>
                </div>
            )
        } else if(profileState === MyProfileState.EDIT) {
            return (
                <div>
                    <EditMyProfile user={user} setUser={setUser}></EditMyProfile>
                </div>
            )
        } else {
            return (
                // <div>
                    <MyQuizResults user={user!}></MyQuizResults>
                /* </div> */
            )
        }
    }

    return (<>
        <Header user={user}></Header>
        <div className="my-profile-container">
            <div className="subheader">
                <span className="subtitle">My Profile</span>
                <div className="nav-bar">
                    <span className={(profileState === MyProfileState.VIEW ? 'active' : '')} onClick={() => setProfileState(MyProfileState.VIEW)}>View</span>
                    <span className={(profileState === MyProfileState.EDIT ? 'active' : '')} onClick={() => setProfileState(MyProfileState.EDIT)}>Edit</span>
                    <span className={(profileState === MyProfileState.QUIZ_RESULTS ? 'active' : '')} onClick={() => setProfileState(MyProfileState.QUIZ_RESULTS)}>Quiz Results</span>
                    <img src={logoutIcon} onClick={logout}/>
                </div>
            </div>
            {
            render()
            }
        </div>
        <Footer/>
    </>);
}