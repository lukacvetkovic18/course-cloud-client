import { useEffect } from "react";
import { Lesson } from "../../utils/models";

interface ManageLessonCardProps {
    lesson: Lesson;
    handleEditClick: (lesson: Lesson) => void;
    handleDeleteClick: (lesson: Lesson) => void;
}

export const ManageLessonCard = ({lesson, handleEditClick, handleDeleteClick}: ManageLessonCardProps) => {
    
    useEffect(() => {
        console.log(lesson)
    }, [])
    return (<>
        <div className="manage-card-container">
            <span>{lesson.title}</span>
            {lesson.course ? <span>{lesson.course.title}</span>: <span></span>}
            <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
            <div className="buttons">
                <button onClick={() => handleEditClick(lesson)}>Edit</button>
                <button onClick={() => handleDeleteClick(lesson)}>Delete</button>
            </div>
        </div>
    </>);
}