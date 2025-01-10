import { useEffect, useRef, useState } from "react";
import example from "../assets/blank-profile-picture.png"
import instagramIcon from "../assets/instagram-icon.png"
import linkedInIcon from "../assets/linkedin-icon.png"
import emailIcon from "../assets/email-icon.png"
import phoneIcon from "../assets/phone-icon.png"
import locationIcon from "../assets/location-icon.png"
import dobIcon from "../assets/dob-icon.png"
import genderIcon from "../assets/gender-icon.png"
import { useNavigate, useParams } from "react-router";
import { Course, User } from "../utils/models";
import { getInstructorCourses, getLoggedInUser, getUserById } from "../services";
import { CourseCard, CoursePopup, Footer, Header } from "../components";
import { ViewProfile } from "../components/ViewProfile";
import { EditMyProfile } from "../components/EditMyProfile";

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
                <div>
                    <span>QUIZ RESULTS</span>
                </div>
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
                </div>
            </div>
            {
            render()
            }
        </div>
        <Footer/>
    </>);
}