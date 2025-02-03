import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Course, Lesson } from "../utils/models";
import { getLessonsByCourseId } from "../services/lessonService";
import example from "../assets/no-image.png"
import { isUserEnrolledInCourse, isUserOwnerOfCourse } from "../services/courseService";
import { isUserStudent } from "../services/userService";
import { EnrollPopup } from "./student/EnrollPopup";

interface CoursePopupProps {
    course: Course
}

export const CoursePopup = ({course}: CoursePopupProps) => {
    const navigate = useNavigate();
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [isEnrolled, setIsEnrolled] = useState<boolean>(false);
    let [isOwner, setIsOwner] = useState<boolean>(false);
    let [isStudent, setIsStudent] = useState<boolean>(false);
    let [isUserBeingEnrolled, setIsUserBeingEnrolled] = useState<boolean>(false);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCourseLessons();
        loadisUserEnrolledInCourse();
        loadisUserOwnerOfCourse();
        loadisUserStudent();
    }, [])

    const loadCourseLessons = () => {
        getLessonsByCourseId(course.id).then(res => {
            setLessons(res.data);
            console.log(lessons);
        })
    }

    const loadisUserStudent = () => {
        isUserStudent().then(res => {
            setIsStudent(res.data);
        })
    }

    const loadisUserOwnerOfCourse = () => {
        isUserOwnerOfCourse(course.id).then(res => {
            setIsOwner(res.data);
        })
    }

    const loadisUserEnrolledInCourse = () => {
        isUserEnrolledInCourse(course.id).then(res => {
            setIsEnrolled(res.data);
        })
    }
    
    const handleButtonClick = () => {
        navigate(`/courses/${course.slug}`)
    }

    const handleEnrollClick = () => {
        setIsUserBeingEnrolled(true);
    }

    const handleClosePopup = () => {
        setIsUserBeingEnrolled(false);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            handleClosePopup();
        }
    }

    useEffect(() => {
        if (isUserBeingEnrolled) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isUserBeingEnrolled]);
 
    return (<>
        <div className="course-popup-container">
            <img src={course.image || example}></img>
            <h3>{ course.title }</h3>
            <span className="author">By {course.owner.firstName} {course.owner.lastName}</span>
            <span className="description">{ course.description }</span>
            {/* <span className="lessons-title">Lessons:</span> */}
            <div className="lessons-list">
            {
                lessons && lessons.map(lesson => {
                    return <span>{ lesson.title } | </span>
                })
            }
            </div>
            <div className="buttons">
                {
                    isEnrolled && <button onClick={handleButtonClick}>View</button>
                }
                {
                    isOwner && <button onClick={handleButtonClick}>Manage</button>
                }
                {
                    (!isOwner && !isEnrolled && isStudent) && <button onClick={handleEnrollClick}>Enroll</button>
                }
            </div>
        </div>
        {isUserBeingEnrolled && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content" ref={popupRef}>
                    <EnrollPopup course={course} handleClosePopup={handleClosePopup}/>
                </div>
            </div>
        )}
    </>);
}