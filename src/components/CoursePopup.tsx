import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Lesson } from "../utils/models";
import { getLessonsByCourseId } from "../services/lessonService";
import example from "../assets/example-button-speech-bubble-example-colorful-web-banner-illustration-vector.jpg"
import { isUserEnrolledInCourse, isUserOwnerOfCourse } from "../services/courseService";

export const CoursePopup = ({course}: any) => {
    const navigate = useNavigate();
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [isEnrolled, setIsEnrolled] = useState<boolean>(false);
    let [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        loadCourseLessons();
        loadIsUserOwnerOfCourse();
        loadisUserEnrolledInCourse();
    }, [])

    const loadCourseLessons = () => {
        getLessonsByCourseId(course.id).then(res => {
            setLessons(res.data);
            console.log(lessons);
        })
    }

    const loadisUserEnrolledInCourse = () => {
        isUserEnrolledInCourse(course.id).then(res => {
            setIsEnrolled(res.data);
            console.log(isEnrolled);
        })
    }

    const loadIsUserOwnerOfCourse = () => {
        isUserOwnerOfCourse(course.id).then(res => {
            setIsOwner(res.data);
            console.log(isOwner);
        })
    }
 
    return (<>
        <div className="course-popup-container">
            <img src={example}></img>
            <h3>{ course.title }</h3>
            <span className="author">By Luka Cvetkovic</span>
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
            <button>View</button>
                {
                    isEnrolled && <button>View</button>
                }
                {
                    (!isOwner && !isEnrolled) && <button>Enroll</button>
                }
                {
                    isOwner && <button>Edit</button>
                }
            </div>
        </div>
    </>);
}