import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Course, User } from "../utils/models";
import { getAllCourses, getLoggedInUser } from "../services";
import { Header, Footer, CoursePopup, CourseCard } from "../components";

export const AllCourses = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        loadCourses();
        // checkCourseOwnership(courses!);
    }, [])

    let [user, setUser] = useState<User>();
    let [courses, setCourses] = useState<Course[]>();
    // const [courseOwnership, setCourseOwnership] = useState<{ [key: number]: boolean }>({});
    let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadCourses = () => {
        getAllCourses().then(res => {
            setCourses(res.data);
        })
    }

    // const checkCourseOwnership = async (courses: Course[]) => {
    //     const ownership: { [key: number]: boolean } = {};
    //     for (const course of courses) {
    //         const res = await isUserOwnerOfCourse(course.id);
    //         ownership[course.id] = res.data;
    //     }
    //     setCourseOwnership(ownership);
    // }

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
        <div className="my-courses-container">
            <div className="subheader">
                <span className="subtitle">All courses</span>
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