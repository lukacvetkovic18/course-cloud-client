import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Course, User } from "../../utils/models";
import { getLoggedInUser } from "../../services";
import { createEmptyCourse, getMyCourses, getMyEnrolledCourses } from "../../services/courseService";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CoursePopup } from "../../components/CoursePopup";
import { CourseCard } from "../../components/CourseCard";

export const MyEnrollments = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        loadEnrolledCourses();
    }, [])

    let [user, setUser] = useState<User>();
    let [enrolledCourses, setEnrolledCourses] = useState<Course[]>();
    let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
            console.log(user);
        })
    }

    const loadEnrolledCourses = () => {
        getMyEnrolledCourses().then(res => {
            setEnrolledCourses(res.data);
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
                <span className="subtitle">{user?.firstName}'s enrollments</span>
            </div>
            <div className="courses-container">
            {
                enrolledCourses && enrolledCourses.map(course => {
                    return <>
                        <CourseCard course={course} handleCourseClick={handleCourseClick} />
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