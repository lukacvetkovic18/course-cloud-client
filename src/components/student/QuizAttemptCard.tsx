import example from "../../assets/blank-profile-picture.png"
import { QuizAttempt } from "../../utils/models";

interface QuizAttemptCardProps {
    quizAttempt: QuizAttempt;
    isUsersView: boolean;
    handleAttemptClick: (quizAttempt: QuizAttempt) => void
}

export const QuizAttemptCard = ({quizAttempt, isUsersView, handleAttemptClick}: QuizAttemptCardProps) => {
    return (<>
        <div className="quiz-attempt-card-container" onClick={() => handleAttemptClick(quizAttempt)}>
            <div className="left">
                { !isUsersView ? <>
                    <img src={quizAttempt.user.profilePicture || example} alt="Course" />
                    <h3>{quizAttempt.user.firstName + " " + quizAttempt.user.lastName}</h3>
                </> : <>
                    <h2>{quizAttempt.quiz.title}</h2>
                </>
                }
            </div>
            <div className="right">
                <span>Result: {+quizAttempt.correctAnswers.toFixed(2) + "/" + quizAttempt.totalQuestions}</span>
                <span className={quizAttempt.score > 50 ? 'green' : 'red'}>{+quizAttempt.score.toFixed(2)} %</span>
            </div>
        </div>
    </>);
}