import { useEffect, useRef, useState } from "react";
import { Course, User } from "../../utils/models";
import { getLoggedInUser } from "../../services";
import { Header, Footer, RecommendedCourseCard, CoursePopup } from "../../components";
import { useNavigate } from "react-router";
import { getRandomCourses } from "../../services/courseService";
import { isUserStudent } from "../../services/userService";

export const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        isUserStudent().then(res => {
            if(!res.data) navigate("/home")
        });
        loadUser();
        loadRecommendedCourses();
    }, [])

    let [user, setUser] = useState<User>();
    let [recommendedCourses, setRecommendedCourses] = useState<Course[]>();
    let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
            if(loadIsUserOnlyInstructor(res.data)) {
                navigate("/my-courses");
            }
        })
    }

    const loadRecommendedCourses = () => {
        getRandomCourses().then(res => {
            setRecommendedCourses(res.data);
            console.log(recommendedCourses);
        })
    }

    const loadIsUserOnlyInstructor = (u: User) => {
        return u.userRoles.length === 1 && u.userRoles[0].name === "instructor";
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
        <div className="home-container">
            <span className="subtitle">Reccomended courses</span>
            <div className="cards-container">
            {
                recommendedCourses && recommendedCourses.map(course => {
                    return <RecommendedCourseCard course={course} handleCourseClick={handleCourseClick}></RecommendedCourseCard>
                })
            }
            </div>
        </div>
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