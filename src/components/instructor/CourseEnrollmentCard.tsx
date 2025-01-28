import example from "../../assets/blank-profile-picture.png"
import { QuizAttempt, User } from "../../utils/models";

interface CourseEnrollmentCardProps {
    user: User;
    quizAttempt: QuizAttempt;
    handleUserClick: (user: User) => void;
    handleAttemptClick: (quizAttempt: QuizAttempt) => void;
}

export const CourseEnrollmentCard = ({user, quizAttempt, handleUserClick, handleAttemptClick}: CourseEnrollmentCardProps) => {
    return (<>
        <div className="quiz-attempt-card-container">
            <div className="left" onClick={() => handleUserClick(user)}>
                <img src={user.profilePicture || example} alt="Course" />
                <h3>{user.firstName + " " + user.lastName}</h3>
            </div>
            <div className="right">
                { quizAttempt && <button onClick={() => handleAttemptClick(quizAttempt)}>VIEW QUIZ RESULTS</button>}
            </div>
        </div>
    </>);
}