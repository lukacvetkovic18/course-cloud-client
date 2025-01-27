import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Course, User } from "../../utils/models";
import { getLoggedInUser } from "../../services";
import { createEmptyCourse, getMyCourses } from "../../services/courseService";
import { Header } from "../../components/Header";
import example from "../../assets/example-button-speech-bubble-example-colorful-web-banner-illustration-vector.jpg"
import { Footer } from "../../components/Footer";
import { CoursePopup } from "../../components/CoursePopup";
import { CourseCard } from "../../components/CourseCard";

export const MyCourses = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        loadUserCourses();
    }, [])

    let [user, setUser] = useState<User>();
    let [userCourses, setUserCourses] = useState<Course[]>();
    let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
            console.log(user);
        })
    }

    const loadUserCourses = () => {
        getMyCourses().then(res => {
            setUserCourses(res.data);
            console.log(userCourses);
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

    const handleAddCourseClick = () => {
        createEmptyCourse().then(res => {
            localStorage.removeItem("courseId");
            localStorage.setItem("courseId", res.data.id);
            navigate("/courses/create");
        })
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
        <div className="my-courses-container">
            <div className="subheader">
                <span className="subtitle">{user?.firstName}'s courses</span>
                <button onClick={handleAddCourseClick}>Add new course</button>
            </div>
            <div className="courses-container">
            {
                userCourses && userCourses.map(course => {
                    return <>
                        <CourseCard course={course} handleCourseClick={handleCourseClick} />
                    {/* <div className="course-container">
                        <div className="left">
                        <img src={example} onClick={() => handleCourseClick(course)} alt="Course" />
                            <div className="course-details">
                                <h3>{course.title}</h3>
                                <span>{course.description}</span>
                            </div>
                        </div>
                        <div className="right">
                            <button>Edit</button>
                            <button>Delete</button>
                        </div>
                    </div> */}
                    </>
                })
            }
            </div>
        </div>
        <Footer />
        {selectedCourse && (
            <div className="course-popup-overlay">
                <div className="course-popup-content" ref={popupRef}>
                    <CoursePopup course={selectedCourse}/>
                </div>
            </div>
        )}
    </>);
}