import { useEffect, useRef, useState } from "react";
import { QuizAttempt, User } from "../../utils/models";
import { getUserAttempts } from "../../services/quizAttemptService";
import { QuizAttemptCard } from "./QuizAttemptCard";
import { ReviewQuizResultPopup } from "./ReviewQuizResultPopup";

interface MyQuizResultsProps {
    user: User;
}

export const MyQuizResults = ({ user }: MyQuizResultsProps) => {

    useEffect(() => {
        loadUserAttempts();
    }, [])

    let [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>();
    let [selectedQuizAttempt, setSelectedQuizAttempt] = useState<QuizAttempt | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    const loadUserAttempts = () => {
        getUserAttempts(user.id).then(res => {
            setQuizAttempts(res.data);
        })
    }

    const handleAttemptClick = (quizAttempt: QuizAttempt) => {
        setSelectedQuizAttempt(quizAttempt);
    }

    const handleClosePopup = () => {
        setSelectedQuizAttempt(null);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            handleClosePopup();
        }
    }

    useEffect(() => {
        if (selectedQuizAttempt) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [selectedQuizAttempt]);

    return (<>
        <div className="my-quiz-results-container">
        {
            quizAttempts && quizAttempts.map(quizAttempt => {
                return <>
                    <QuizAttemptCard quizAttempt={quizAttempt} handleAttemptClick={handleAttemptClick} />
                </>
            })
        }
        </div>
        {selectedQuizAttempt && (
            <div className="quiz-result-popup-overlay">
                <div className="quiz-result-popup-content" ref={popupRef}>
                    <ReviewQuizResultPopup quizAttempt={selectedQuizAttempt}/>
                </div>
            </div>
        )}
    </>);
}