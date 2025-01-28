import { useEffect, useState } from "react";
import { getQuestionsByQuizId } from "../../services/questionService";
import { Answer, Question, QuizAttempt, QuizAttemptAnswer } from "../../utils/models";
import { getAnswersByQuestionIds } from "../../services/answerService";
import { getQuizAttemptAnswersByQuizAttempt } from "../../services/quizAttemptService";

interface ReviewQuizResultPopupProps {
    quizAttempt: QuizAttempt;
}

export const ReviewQuizResultPopup = ({ quizAttempt }: ReviewQuizResultPopupProps) => {
    let [questions, setQuestions] = useState<Question[]>([]);
    // let [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
    let [attemptAnswers, setAttemptAnswers] = useState<QuizAttemptAnswer[]>([]);

    useEffect(() => {
        loadQuizQuestions();
        loadQuizAttemptAnswers();
    }, [])

    useEffect(() => {
        if (questions.length > 0) {
            loadQuestionAnswers();
        }
    }, [questions.length]);

    // useEffect(() => {
    //     if (quizAttempt) {
    //         loadQuizAttemptAnswers();
    //     }
    // }, [quizAttempt]);

    // const loadQuizAttempt = () => {
    //     getQuizAttemptByQuizAndUser(quiz.id, user.id).then(res => {
    //         setQuizAttempt(res.data);
    //     }).catch(error => {
    //         console.error("Failed to load quiz attempt:", error);
    //     });
    // };

    const loadQuizAttemptAnswers = () => {
        getQuizAttemptAnswersByQuizAttempt(quizAttempt!.id).then(res => {
            setAttemptAnswers(res.data);
        }).catch(error => {
            console.error("Failed to load quiz attempt answers:", error);
        });
    };

    const loadQuizQuestions = () => {
        getQuestionsByQuizId(quizAttempt.quiz.id).then(res => {
            // setQuestions(res.data);
            const questionsWithEmptyAnswers = res.data.map((question: Question) => ({
                ...question,
                answers: question.answers || []
            }));
            setQuestions(questionsWithEmptyAnswers);
        }).catch(error => {
            console.error("Failed to load questions:", error);
        });
    }

    const loadQuestionAnswers = async () => {
        try {
            const questionIds = questions.map(question => question.id);
            const res = await getAnswersByQuestionIds(questionIds);
            const answers = res.data;
            console.log(res.data);

            const answersMap = answers.reduce((acc: any, answer: Answer) => {
                const questionId = answer.question.id;
                if (!acc[questionId]) {
                    acc[questionId] = [];
                }
                acc[questionId].push(answer);
                return acc;
            }, {});

            setQuestions((prevQuestions: Question[]) => 
                prevQuestions.map(question => 
                    answersMap[question.id] ? { ...question, answers: answersMap[question.id] } : { ...question, answers: [] }
                )
            );
        } catch (error) {
            console.error("Failed to load lesson materials:", error);
        }
    };

    const getUserAnswer = (questionId: number) => {
        const userAnswers = attemptAnswers.filter(answer => answer.question.id === questionId);
        if (userAnswers) {
            if (userAnswers[0].selectedAnswer) {
                return userAnswers.map(answer => answer.selectedAnswer.title).join(', ');
            } else if (userAnswers[0].textAnswer) {
                return userAnswers[0].textAnswer;
            }
        }
        return '';
    };

    const getCorrectAnswers = (question: Question) => {
        const correctAnswers = question.answers.filter(answer => answer.isCorrect);
        return correctAnswers.map(answer => answer.title).join(', ');
    };

    return (<>
        <div className="view-quiz-popup-container">
            <div className="top-section">
                <div className="left">
                    <span>{quizAttempt.quiz.title}</span>
                    <span><b>{quizAttempt.user.firstName + " " + quizAttempt.user.lastName}</b></span>
                </div>
                <div className="right">
                    <span>Result: {+quizAttempt.correctAnswers.toFixed(2) + "/" + quizAttempt.totalQuestions}</span>
                    <span className={quizAttempt.score > 50 ? 'green' : 'red'}>{+quizAttempt.score.toFixed(2)} %</span>
                </div>
            </div>
            <div className="questions-container">
            {
                (questions.length > 0 && attemptAnswers.length > 0) && questions.map((question: Question) => (
                    <div className="question-item" key={question.id}>
                        <div className="question-header">
                            <div className="title">
                                <span>{question.title}</span>
                            </div>
                            <div className="answers-container">
                                {
                                    (question.questionType.id === 1) &&
                                    <input
                                        className="answer-input"
                                        value={getUserAnswer(question.id)}
                                        type="text"
                                        disabled
                                    />
                                }
                                {
                                    question.questionType.id === 2 && question.answers.map((answer) => (
                                        <label key={answer.id}>
                                            <input
                                                type="radio"
                                                checked={getUserAnswer(question.id) === answer.title}
                                                disabled
                                            />
                                            <span>{answer.title}</span>
                                        </label>
                                    ))
                                }
                                {
                                    question.questionType.id === 3 && question.answers.map((answer) => (
                                        <label key={answer.id}>
                                            <input
                                                type="checkbox"
                                                checked={getUserAnswer(question.id).split(', ').includes(answer.title)}
                                                disabled
                                            />
                                            <span>{answer.title}</span>
                                        </label>
                                    ))
                                }
                                <div className="correct-answer">
                                    <strong>Correct Answer(s):</strong> {getCorrectAnswers(question)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    </>);
}