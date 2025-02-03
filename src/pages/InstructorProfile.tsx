import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Course, User } from "../utils/models";
import { getInstructorCourses, getLoggedInUser } from "../services";
import { CourseCard, CoursePopup, Footer, Header } from "../components";
import { ViewProfile } from "../components/ViewProfile";
import { getUserBySlug } from "../services/userService";

export const InstructorProfile = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        if(slug) {
            loadInstructor(slug);
        } else {
            navigate("/instructors");
        }
        loadUser();
    }, [slug]);

    let [user, setUser] = useState<User>();
    let [instructor, setInstructor] = useState<User>();
    let [courses, setCourses] = useState<Course[]>([]);
    let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadInstructor = (slug: string) => {
        getUserBySlug(slug).then(res => {
            setInstructor(res.data);
            loadCourses(res.data.id);
        })
    }

    const loadCourses = (instructorId: number) => {
        getInstructorCourses(instructorId).then(res => {
            setCourses(res.data);
        })
    }

    const handleCourseClick = (course: Course) => {
        setSelectedCourse(course);
    }

    const handleClosePopup = () => {
        setSelectedCourse(null);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            handleClosePopup();
        }
    }

    useEffect(() => {
        if (selectedCourse) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [selectedCourse]);

    return (<>
        <Header user={user}></Header>
        { instructor &&
            <div className="instructor-profile-container">
                <ViewProfile user={instructor}></ViewProfile>
                <div className="subheader">
                    <span className="subtitle">{instructor.firstName}'s courses</span>
                </div>
                <div className="courses-container">
                {
                    courses && courses.map(course => {
                        return <>
                            <CourseCard course={course} handleCourseClick={handleCourseClick} />
                        </>
                    })
                }
                </div>
            </div>
        }
        <Footer/>
        {selectedCourse && (
            <div className="course-popup-overlay">
                <div className="course-popup-content" ref={popupRef}>
                    <CoursePopup course={selectedCourse}/>
                </div>
            </div>
        )}
    </>);
}