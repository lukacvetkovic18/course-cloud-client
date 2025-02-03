import { useEffect, useState } from "react";
import example from "../assets/no-image.png"
import { isUserOwnerOfCourse } from "../services/courseService";
import { useNavigate } from "react-router";
import { Course } from "../utils/models";

interface CoursePopupProps {
    course: Course
    handleCourseClick: (course: Course) => void
}

export const CourseCard = ({course, handleCourseClick}: CoursePopupProps) => {
    const navigate = useNavigate();
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
    
    const handleButtonClick = () => {
        navigate(`/courses/${course.slug}`)
    }

    return (<>
        <div className="course-container">
            <div className="left">
            <img src={course.image || example} onClick={() => handleCourseClick(course)} alt="Course" />
                <div className="course-details">
                    <h3>{course.title}</h3>
                    <span>{course.description}</span>
                </div>
            </div>
            {
                isOwner && <div className="right">
                    <button onClick={handleButtonClick}>Manage</button>
                </div>
            }
        </div>
    </>);
}