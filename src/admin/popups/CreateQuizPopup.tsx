import { useEffect, useState } from "react";
import { Answer, Course, Question, QuestionType } from "../../utils/models";
import plusSign from "../../assets/plus-sign.png"
import xSign from "../../assets/x-sign.png"
import tickSign from "../../assets/tick-sign.png"
import { createQuiz } from "../../services/adminService";
import { getCoursesWithoutQuiz } from "../../services/courseService";

interface CreateQuizPopupProps {
    questionTypes: QuestionType[];
    closeCreatePopup: () => void;
}

export const CreateQuizPopup = ({questionTypes, closeCreatePopup}: CreateQuizPopupProps) => {
    let [newQuiz, setNewQuiz] = useState<{
        title: string;
        course: Course | null;
        questions: Question[];
    }>({
        title: "",
        course: null,
        questions: []
    });
    let [courses, setCourses] = useState<Course[]>([]);
    
    useEffect(() => {
        loadCourses();
    }, []);
    
    const loadCourses = () => {
        getCoursesWithoutQuiz().then(res => {
            setCourses(res.data);
        })
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewQuiz((quizInfo: any) => ({
            ...quizInfo,
            [name]: value
        }));
    };

    const handleCourseChange = (e: any) => {
        const selectedCourseId = parseInt(e.target.value);
        const selectedCourse = courses.find(course => course.id === selectedCourseId) || null;
        setNewQuiz((quizInfo: any) => ({
            ...quizInfo,
            course: selectedCourse
        }));
    };

    const handleQuestionTitleChange = (question: Question, e: any) => {
        const { value } = e.target;
        setNewQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === question.id ? { ...q, title: value } : q)
        }));
    };

    const handleQuestionTypeChange = (question: Question, e: any) => {
        const newTypeId = parseInt(e.target.value);
        const questionType = questionTypes.find(qT => qT.id === newTypeId)!;
        setNewQuiz(quizInfo => ({
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

    const handleAnswerTitleChange = (question: Question, answer: Answer, e: any) => {
        const { value } = e.target;
        setNewQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === question.id ? {
                ...q,
                answers: q.answers.map(a => a.id === answer.id ? { ...a, title: value } : a)
            } : q)
        }));
    };

    const handleAnswerCorrectnessChange = (question: Question, answer: Answer) => {
        setNewQuiz(quizInfo => ({
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
        setNewQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === questionId ? {
                ...q,
                answers: [...q.answers, { id: Date.now(), title: '', isCorrect, question: q }]
            } : q)
        }));
    };

    const deleteSelectedAnswer = (questionId: number, answerId: number) => {
        setNewQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === questionId ? {
                ...q,
                answers: q.answers.filter(a => a.id !== answerId)
            } : q)
        }));
    };

    const handleIsQuestionBeingEditedChange = (question: Question, isBeingEdited: boolean) => {
        setNewQuiz(quizInfo => ({
            ...quizInfo,
            questions: quizInfo.questions.map(q => q.id === question.id ? { ...q, isBeingEdited } : q)
        }));
    };

    const removeQuestion = (questionId: number) => {
        setNewQuiz(quizInfo => ({
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
            quiz: newQuiz
        };

        setNewQuiz(quizInfo => ({
            ...quizInfo,
            questions: [...quizInfo.questions, newQuestion]
        }));
    };


    const saveQuiz = () => {
        const req = {
            title: newQuiz.title,
            courseId: newQuiz.course!.id,
            questions: newQuiz.questions.map(q => ({
                title: q.title,
                questionTypeId: q.questionType.id,
                answers: q.answers.map(a => ({
                    title: a.title,
                    isCorrect: a.isCorrect
                }))
            }))
        }

        console.log(req);

        createQuiz(req).then(() => {
            closeCreatePopup();
        });
    };

    const canSaveQuiz = () => {
        return newQuiz.title && newQuiz.course && newQuiz.questions.length > 0;
    };

    const canSaveQuestion = (question: Question) => {
        if(question.questionType.id === 1) {
            return question.title !== "" && question.answers[0].title !== "";
        } else {
            return question.title !== "" && question.answers.every(q => q.title !== "") && question.answers.some(q => q.isCorrect === true);
        }
    };

    const isAnyQuestionBeingEdited = () => {
        return newQuiz.questions.some(q => q.isBeingEdited === true);
    };

    return (<>
        {
            newQuiz && 
            <div className="edit-course-popup-container">
                <div className="basic-info">
                    <input
                        className="title-input"
                        value={newQuiz.title}
                        type="text"
                        placeholder="Title"
                        onChange={handleChange}
                        name="title"
                    />
                    <div>
                        {newQuiz.questions.map(question => (
                            <div className="question-item" key={question.id}>
                                <div className="question-header">
                                    <div className="title">
                                        {!question.isBeingEdited && (
                                            <>
                                                <span>{question.title}</span>
                                                <span>{question.questionType.name.charAt(0).toUpperCase() + question.questionType.name.slice(1)}</span>
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
                                                    value={question.questionType.id}
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
                                        {question.questionType.id === 1 && (
                                            <>
                                                {question.isBeingEdited && question.answers.length > 0 && (
                                                    <input
                                                        className="answer-input"
                                                        value={question.answers[0].title}
                                                        type="text"
                                                        placeholder="Answer"
                                                        onChange={(e) => handleAnswerTitleChange(question, question.answers[0], e)}
                                                    />
                                                )}
                                                {!question.isBeingEdited && question.answers.length > 0 && (
                                                    <span className="answer-text">{question.answers[0].title}</span>
                                                )}
                                            </>
                                        )}
                                        {question.questionType.id === 2 && (
                                            <>
                                                {question.answers.map(answer => (
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
                                                                <img src={xSign} onClick={() => deleteSelectedAnswer(question.id, answer.id)} />
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
                                                    <button className="add-new-question-btn" onClick={() => addNewAnswer(question.id, false)}>
                                                        <img src={plusSign} />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {question.questionType.id === 3 && (
                                            <>
                                                {question.answers.map(answer => (
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
                                                                <img src={xSign} onClick={() => deleteSelectedAnswer(question.id, answer.id)} />
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
                                                    <button className="add-new-question-btn" onClick={() => addNewAnswer(question.id, false)} disabled={isAnyQuestionBeingEdited()}>
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
                                                <button onClick={() => handleIsQuestionBeingEditedChange(question, false)}>CANCEL</button>
                                            </>
                                        )}
                                        <button onClick={() => removeQuestion(question.id)} disabled={isAnyQuestionBeingEdited() && !question.isBeingEdited}>REMOVE</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="add-new-question-btn" onClick={addNewQuestion} disabled={isAnyQuestionBeingEdited()}>
                        <img src={plusSign}/>
                    </button>
                    <label>
                        <span className="owner-text">Course:</span>
                        <select
                            name="courseId"
                            value={newQuiz.course ? newQuiz.course.id : -1}
                            onChange={handleCourseChange}
                        >
                            <option value={-1}>
                                No Course
                            </option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="add-section">
                    <button onClick={saveQuiz} disabled={!canSaveQuiz() || isAnyQuestionBeingEdited()}>SAVE QUIZ</button>
                    <button onClick={closeCreatePopup} disabled={isAnyQuestionBeingEdited()}>CANCEL</button>
                </div>
            </div>
        }
    </>);
}