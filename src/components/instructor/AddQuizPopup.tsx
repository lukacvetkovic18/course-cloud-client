import { useEffect, useState } from "react";
import { Answer, Question, QuestionType } from "../../utils/models";
import tickSign from "../../assets/tick-sign.png"
import xSign from "../../assets/x-sign.png"
import plusSign from "../../assets/plus-sign.png"

interface AddQuizPopupProps {
    // quiz: {
    //     title: string;
    //     questions: Question[];
    // };
    quiz: any;
    // setQuiz: React.Dispatch<React.SetStateAction<{
    //     title: string;
    //     questions: Question[];
    // }>>;
    setQuiz: any;
    questionTypes: QuestionType[];
    handleCloseQuiz: () => void;
}

export const AddQuizPopup = ({quiz, setQuiz, questionTypes, handleCloseQuiz}: AddQuizPopupProps) => {
    let [updatedQuiz, setUpdatedQuiz] = useState<{
        title: string;
        questions: Question[];
    }>(quiz);

    useEffect(() => {
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => ({ ...q, isBeingEdited: false }))
        }));
    }, [])
 
    const handleTitleChange = (e: any) => {
        setUpdatedQuiz((quizInfo: any) => ({
            ...quizInfo,
            title: e.target.value
        }))
    }

    const handleQuestionTypeChange = (question: Question, e: any) => {
        const newTypeId = parseInt(e.target.value);
        const questionType = questionTypes.find(qT => qT.id === newTypeId)!;
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => {
                if (q.id === question.id) {
                    // Handle change to short answer
                    if (newTypeId === 1 && q.questionType.id !== 1) {
                        console.log("Changed from choices to short answer");
                        return {
                            ...q,
                            questionType: questionType,
                            answers: [{ id: Date.now(), title: '', isCorrect: false, question: q }]
                        };
                    }

                    // Handle change from short answer to choices
                    if (newTypeId !== 1 && q.questionType.id === 1) {
                        console.log("Changed from short answer to choices");
                        return {
                            ...q,
                            questionType: questionType,
                            answers: []
                        };
                    }

                    return { ...q, questionType: questionType };
                }
                return q;
            })
        }));
    };

    const handleQuestionTitleChange = (question: Question, e: any) => {
        const { value } = e.target;
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === question.id ? { ...q, title: value } : q)
        }));
    };

    const handleAnswerTitleChange = (question: Question, answer: Answer, e: any) => {
        const { value } = e.target;
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === question.id ? {
                ...q,
                answers: q.answers.map(a => a.id === answer.id ? { ...a, title: value } : a)
            } : q)
        }));
    };

    const handleAnswerCorrectnessChange = (question: Question, answer: Answer) => {
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => {
                if (q.id === question.id) {
                    let updatedAnswers = [...q.answers];

                    if (question.questionType.id === 2) {
                        updatedAnswers = updatedAnswers.map(a => ({ ...a, isCorrect: a.id === answer.id }));
                    } else if (question.questionType.id === 3) {
                        updatedAnswers = updatedAnswers.map(a => a.id === answer.id ? { ...a, isCorrect: !a.isCorrect } : a);
                    }

                    return { ...q, answers: updatedAnswers };
                }
                return q;
            })
        }));
    };

    const addNewAnswer = (questionId: number, isCorrect: boolean) => {
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === questionId ? {
                ...q,
                answers: [...q.answers, { id: Date.now(), title: '', isCorrect, question: q }]
            } : q)
        }));
    };

    const deleteSelectedAnswer = (questionId: number, answerId: number) => {
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === questionId ? {
                ...q,
                answers: q.answers?.filter(a => a.id !== answerId)
            } : q)
        }));
    };

    const handleIsQuestionBeingEditedChange = (question: Question, isBeingEdited: boolean) => {
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === question.id ? { ...q, isBeingEdited } : q)
        }));
    };

    const removeQuestion = (questionId: number) => {
        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.filter(q => q.id !== questionId)
        }));
    };

    const addNewQuestion = () => {
        const newQuestion: any = {
            id: Date.now(), // Temporary ID
            title: '',
            questionType: questionTypes[1], // Default to the first question type
            answers: [],
            isBeingEdited: true,
            quiz: quiz
        };

        setUpdatedQuiz(quizInfo => ({
            ...quizInfo,
            questions: [...quizInfo.questions, newQuestion]
        }));
    };

    const saveQuiz = () => {
        setQuiz(updatedQuiz);
        handleCloseQuiz();
    };

    const canSaveQuiz = () => {
        return updatedQuiz.title && updatedQuiz.questions.length > 0;
    };

    const canSaveQuestion = (question: Question) => {
        if(question.questionType.id === 1) {
            return question.title !== "" && question.answers[0].title !== "";
        } else {
            return question.title !== "" && question.answers.every(q => q.title !== "") && question.answers.some(q => q.isCorrect === true);
        }
    };

    const isAnyQuestionBeingEdited = () => {
        return updatedQuiz.questions.some(q => q.isBeingEdited === true);
    };

    return (<>
        <div className="add-quiz-popup-container">
            <div className="top-section">
                <input
                    value={updatedQuiz.title}
                    type="text"
                    placeholder="Quiz Title"
                    onChange={handleTitleChange}
                ></input>
            </div>
            <div className="questions-container">
                <span className="questions-title">Questions:</span>
            {
                updatedQuiz.questions.length > 0 && updatedQuiz.questions.map((question) => (
                    <div className="question-item" key={question.id}>
                    <div className="question-header">
                        <div className="title">
                            {!question.isBeingEdited && (
                                <>
                                    <span>{question.title}</span>
                                    <span>{question.questionType && question.questionType!.name.charAt(0).toUpperCase() + question.questionType!.name.slice(1)}</span>
                                </>
                            )}
                            {question.isBeingEdited && (
                                <>
                                    <input
                                        className="question-title-input"
                                        value={question.title}
                                        type="text"
                                        placeholder="Title"
                                        onChange={(e) => handleQuestionTitleChange(question, e)}
                                    />
                                    <select
                                        value={question.questionType && question.questionType!.id}
                                        onChange={(e) => handleQuestionTypeChange(question, e)}
                                    >
                                        {questionTypes.map((questionType) => (
                                            <option
                                                value={questionType.id}
                                                key={questionType.id}
                                            >
                                                {questionType.name.charAt(0).toUpperCase() + questionType.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                        <div className="answers-container">
                            {question.questionType && question.questionType.id === 1 && (
                                <>
                                    {question.isBeingEdited && question.answers!.length > 0 && (
                                        <input
                                            className="answer-input"
                                            value={question.answers![0].title}
                                            type="text"
                                            placeholder="Answer"
                                            onChange={(e) => handleAnswerTitleChange(question, question.answers![0], e)}
                                        />
                                    )}
                                    {!question.isBeingEdited && question.answers!.length > 0 && (
                                        <span className="answer-text">{question.answers![0].title}</span>
                                    )}
                                </>
                            )}
                            {question.questionType && question.questionType!.id === 2 && (
                                <>
                                    {question.answers!.map(answer => (
                                        <div className="answer-item" key={answer.id}>
                                            {question.isBeingEdited ? (
                                                <>
                                                    <input
                                                        type="radio"
                                                        checked={answer.isCorrect}
                                                        onChange={() => handleAnswerCorrectnessChange(question, answer)}
                                                    />
                                                    <input
                                                        className="answer-input"
                                                        value={answer.title}
                                                        type="text"
                                                        placeholder="Answer"
                                                        onChange={(e) => handleAnswerTitleChange(question, answer, e)}
                                                    />
                                                    <img src={xSign} onClick={() => deleteSelectedAnswer(question.id!, answer.id)} />
                                                </>
                                            ) : (
                                                <label>
                                                    {answer.isCorrect && <img src={tickSign} />}
                                                    { !answer.isCorrect && <img src={xSign}/> }
                                                    <span>{answer.title}</span>
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                    {question.isBeingEdited && (
                                        <button className="add-new-question-btn" onClick={() => addNewAnswer(question.id!, false)}>
                                            <img src={plusSign} />
                                        </button>
                                    )}
                                </>
                            )}
                            {question.questionType && question.questionType!.id === 3 && (
                                <>
                                    {question.answers!.map(answer => (
                                        <div className="answer-item" key={answer.id}>
                                            {question.isBeingEdited ? (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        checked={answer.isCorrect}
                                                        onChange={() => handleAnswerCorrectnessChange(question, answer)}
                                                    />
                                                    <input
                                                        className="answer-input"
                                                        value={answer.title}
                                                        type="text"
                                                        placeholder="Answer"
                                                        onChange={(e) => handleAnswerTitleChange(question, answer, e)}
                                                    />
                                                    <img src={xSign} onClick={() => deleteSelectedAnswer(question.id!, answer.id)} />
                                                </>
                                            ) : (
                                                <label>
                                                    {answer.isCorrect && <img src={tickSign} />}
                                                    { !answer.isCorrect && <img src={xSign}/> }
                                                    <span>{answer.title}</span>
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                    {question.isBeingEdited && (
                                        <button className="add-new-question-btn" onClick={() => addNewAnswer(question.id!, false)}>
                                            <img src={plusSign} />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="buttons">
                            {!question.isBeingEdited && (
                                <button onClick={() => handleIsQuestionBeingEditedChange(question, true)} disabled={isAnyQuestionBeingEdited()}>EDIT</button>
                            )}
                            {question.isBeingEdited && (
                                <>
                                    <button
                                        onClick={() => {
                                            // saveQuestionWithAnswers(question);
                                            handleIsQuestionBeingEditedChange(question, false);
                                        }}
                                        disabled={!canSaveQuestion(question)}
                                    >
                                        SAVE
                                    </button>
                                    {/* <button onClick={() => handleIsQuestionBeingEditedChange(question, false)}>CANCEL</button> */}
                                </>
                            )}
                            <button onClick={() => removeQuestion(question.id!)} disabled={isAnyQuestionBeingEdited() && !question.isBeingEdited}>REMOVE</button>
                        </div>
                    </div>

                    </div>
                ))
            }
            </div>
            <button className="add-new-question-btn" onClick={addNewQuestion}>
                <img src={plusSign}/>
            </button>
            <div className="buttons-section">
                <button onClick={saveQuiz} disabled={!canSaveQuiz() || isAnyQuestionBeingEdited()}>SAVE QUIZ</button>
                <button onClick={handleCloseQuiz} disabled={isAnyQuestionBeingEdited()}>CANCEL</button>
            </div>
        </div>
    </>);
}