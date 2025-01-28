import { useEffect, useRef, useState } from "react";
import example from "../assets/blank-profile-picture.png"
import instagramIcon from "../assets/instagram-icon.png"
import linkedInIcon from "../assets/linkedin-icon.png"
import emailIcon from "../assets/email-icon.png"
import phoneIcon from "../assets/phone-icon.png"
import locationIcon from "../assets/location-icon.png"
import dobIcon from "../assets/dob-icon.png"
import genderIcon from "../assets/gender-icon.png"
import logoutIcon from "../assets/logout.png"
import { useNavigate, useParams } from "react-router";
import { Course, User } from "../utils/models";
import { getCourseById, getInstructorCourses, getLoggedInUser, getUserById, isUserOwnerOfCourse } from "../services";
import { CourseCard, CoursePopup, Footer, Header } from "../components";
import { ViewProfile } from "../components/ViewProfile";
import { EditMyProfile } from "../components/EditMyProfile";
import { ViewCourseComponent } from "../components/ViewCourseComponent";
import { EditCourseComponent } from "../components/instructor/EditCourseComponent";
import { CourseEnrollments } from "../components/instructor/CourseEnrollments";

export enum CourseState {
    VIEW,
    EDIT,
    VIEW_STUDENTS
}

export const ViewCourse = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    
    let [courseState, setCourseState] = useState<CourseState>(CourseState.VIEW);
    let [user, setUser] = useState<User>();
    let [course, setCourse] = useState<Course>();
    let [isOwner, setIsOwner] = useState<boolean>(false);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadCourse(parseInt(slug!));
        loadUser();
    }, [slug]);
    
    useEffect(() => {
        render()
    }, [courseState])
    
    useEffect(() => {
        loadIsUserOwnerOfCourse();
    }, [course])

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadCourse = (courseId: number) => {
        getCourseById(courseId).then(res => {
            setCourse(res.data);
        })
    }

    const loadIsUserOwnerOfCourse = () => {
        if(course) {
            isUserOwnerOfCourse(course.id).then(res => {
                setIsOwner(res.data);
                console.log(isOwner);
            })
        }
    }

    const render = () => {
        if(courseState === CourseState.VIEW) {
            return (
                <div>
                    <ViewCourseComponent course={course} isOwner={isOwner}></ViewCourseComponent>
                </div>
            )
        } else if(courseState === CourseState.EDIT) {
            return (
                <div>
                    <EditCourseComponent course={course} setCourse={setCourse}></EditCourseComponent>
                </div>
            )
        } else {
            return (
                    <CourseEnrollments course={course!}></CourseEnrollments>
            )
        }
    }

    return (<>
        <Header user={user}></Header>
        <div className="my-profile-container">
            <div className="subheader">
                <span className="subtitle">Course Overview</span>
                { isOwner && <div className="nav-bar">
                    <span className={(courseState === CourseState.VIEW ? 'active' : '')} onClick={() => setCourseState(CourseState.VIEW)}>View</span>
                    <span className={(courseState === CourseState.EDIT ? 'active' : '')} onClick={() => setCourseState(CourseState.EDIT)}>Edit</span>
                    <span className={(courseState === CourseState.VIEW_STUDENTS ? 'active' : '')} onClick={() => setCourseState(CourseState.VIEW_STUDENTS)}>View Enrollments</span>
                </div>}
            </div>
            { course &&
            render()
            }
        </div>
        <Footer/>
    </>);
}