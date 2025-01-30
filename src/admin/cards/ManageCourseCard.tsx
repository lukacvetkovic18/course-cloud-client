import { useEffect } from "react";
import { Course } from "../../utils/models";

interface ManageCourseCardProps {
    course: Course;
    handleEditClick: (course: Course) => void;
    handleDeleteClick: (course: Course) => void;
}

export const ManageCourseCard = ({course, handleEditClick, handleDeleteClick}: ManageCourseCardProps) => {
    
    useEffect(() => {
        console.log(course)
    }, [])
    return (<>
        <div className="manage-card-container">
            <span>{course.title}</span>
            {course.owner && <span>{course.owner.firstName + " " + course.owner.lastName}</span>}
            <span>{course.createdAt.toLocaleString('en-GB', { timeZone: 'Europe/Zagreb'})}</span>
            <span>{course.isActive}</span>
            <div className="buttons">
                <button onClick={() => handleEditClick(course)}>Edit</button>
                <button onClick={() => handleDeleteClick(course)}>Delete</button>
            </div>
        </div>
    </>);
}