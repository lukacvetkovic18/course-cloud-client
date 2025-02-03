import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Course, User } from "../utils/models";
import { getLoggedInUser, isUserOwnerOfCourse } from "../services";
import { Footer, Header } from "../components";
import { ViewCourseComponent } from "../components/ViewCourseComponent";
import { EditCourseComponent } from "../components/instructor/EditCourseComponent";
import { CourseEnrollments } from "../components/instructor/CourseEnrollments";
import { getCourseBySlug } from "../services/courseService";

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

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        if(slug) {
            loadCourse(slug);
        } else {
            navigate("/courses");
        }
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

    const loadCourse = (courseSlug: string) => {
        getCourseBySlug(courseSlug).then(res => {
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
                    <ViewCourseComponent course={course!} isOwner={isOwner}></ViewCourseComponent>
            )
        } else if(courseState === CourseState.EDIT) {
            return (
                    <EditCourseComponent course={course!} setCourse={setCourse}></EditCourseComponent>
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