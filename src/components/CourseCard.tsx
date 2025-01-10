import { useEffect, useState } from "react";
import example from "../assets/example-button-speech-bubble-example-colorful-web-banner-illustration-vector.jpg"
import { isUserOwnerOfCourse } from "../services/courseService";

export const CourseCard = ({course, handleCourseClick}: any) => {
    let [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        loadIsUserOwnerOfCourse();
    }, [])

    const loadIsUserOwnerOfCourse = () => {
        isUserOwnerOfCourse(course.id).then(res => {
            setIsOwner(res.data);
            console.log(isOwner);
        })
    }

    return (<>
        <div className="course-container">
            <div className="left">
            <img src={example} onClick={() => handleCourseClick(course)} alt="Course" />
                <div className="course-details">
                    <h3>{course.title}</h3>
                    <span>{course.description}</span>
                </div>
            </div>
            {
                isOwner && <div className="right">
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            }
        </div>
    </>);
}