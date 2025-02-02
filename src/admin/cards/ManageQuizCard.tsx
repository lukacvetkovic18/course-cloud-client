import { useEffect } from "react";
import { Quiz } from "../../utils/models";

interface ManageQuizCardProps {
    quiz: Quiz;
    handleEditClick: (quiz: Quiz) => void;
    handleDeleteClick: (quiz: Quiz) => void;
}

export const ManageQuizCard = ({quiz, handleEditClick, handleDeleteClick}: ManageQuizCardProps) => {
    
    useEffect(() => {
        console.log(quiz)
    }, [])
    return (<>
        <div className="manage-card-container">
            <span>{quiz.title}</span>
            {quiz.course ? <span>{quiz.course.title}</span>: <span></span>}
            <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
            <div className="buttons">
                <button onClick={() => handleEditClick(quiz)}>Edit</button>
                <button onClick={() => handleDeleteClick(quiz)}>Delete</button>
            </div>
        </div>
    </>);
}