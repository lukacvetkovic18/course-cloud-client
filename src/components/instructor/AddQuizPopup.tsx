import { useEffect, useState } from "react";
import example from "../../assets/example-button-speech-bubble-example-colorful-web-banner-illustration-vector.jpg"
import { createQuestion, getAllQuestionTypes, getQuestionsByQuizId } from "../../services/questionService";
import { Answer, Question, QuestionType } from "../../utils/models";
import { createAnswer, deleteAnswersByQuestionId, getAnswersByQuestionIds } from "../../services/answerService";
import tickSign from "../../assets/tick-sign.png"
import xSign from "../../assets/x-sign.png"
import imageIcon from "../../assets/image-icon.png"
import pdfIcon from "../../assets/pdf-icon.png"
import plusSign from "../../assets/plus-sign.png"
import minusSign from "../../assets/minus-sign.png"

export const AddQuizPopup = ({quiz, setQuiz}: any) => {
    let [questions, setQuestions] = useState<Question[]>([]);
    let [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);

    useEffect(() => {
        loadQuestionTypes();
        loadQuizQuestions();
    }, [])
    useEffect(() => {
        if (questions.length > 0) {
            loadQuestionAnswers();
        }
    }, [questions.length]);

    const loadQuestionTypes = () => {
        getAllQuestionTypes().then(res => {
            setQuestionTypes(res.data);
        }).catch(error => {
            console.error("Failed to load question types:", error);
        });
    }

    const loadQuizQuestions = () => {
        getQuestionsByQuizId(quiz.id).then(res => {
            setQuestions(res.data);
        }).catch(error => {
            console.error("Failed to load questions:", error);
        });
    }

    const loadQuestionAnswers = async () => {
        try {
            const questionIds = questions.map(question => question.id);
            const res = await getAnswersByQuestionIds(questionIds);
            const answers = res.data;

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
                    answersMap[question.id] ? { ...question, answers: answersMap[question.id] } : question
                )
            );
        } catch (error) {
            console.error("Failed to load lesson materials:", error);
        }
    };

    const addNewQuestion = () => {
        createQuestion({
            title: "",
            questionTypeId: 2,
            quizId: quiz.id
        }).then(res => {
            setQuestions((prevQuestions: Question[]) => [...prevQuestions, res.data]);
        })
    }
 
    const handleTitleChange = (e: any) => {
        setQuiz((quizInfo: any) => ({
            ...quizInfo,
            title: e.target.value
        }))
    }

    const addNewAnswer = (question: Question) => {
        createAnswer({
            title: "",
            questionId: question.id
        }).then(res => {
            console.log(res.data)
            setQuestions(prevQuestions => 
                prevQuestions.map(q => 
                    q.id === question.id 
                    ? { ...q, answers: [...q.answers, res.data] } 
                    : q
                )
            );
        }).catch(error => {
            console.error("Failed to add answer:", error);
        });
    }

    const deleteAnswers = (question: Question) => {
        deleteAnswersByQuestionId(question.id).then(() => {
            loadQuestionAnswers();
        })
    }

    const handleIsQuesstionBeingEditedChange = (question: Question, condition: boolean) => {
        setQuestions((prevQuestions: Question[]) => 
            prevQuestions.map(q => 
                q.id === question.id ? { ...q, isBeingEdited: condition } : q
            )
        );
    }
 
    const handleQuestionTitleName = (question: Question, e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestions((prevQuestions: Question[]) => 
            prevQuestions.map(q => 
                q.id === question.id ? { ...q, title: e.target.value } : q
            )
        );
    }

    const handleQuestionTypeChange = (question: Question, e: any) => {
        const newTypeId = +(e.target.value);
        const questionType = questionTypes.find(qT => qT.id === newTypeId);
        
        setQuestions((prevQuestions: Question[]) => 
            prevQuestions.map(q => {
                if (q.id === question.id) {
                    // let updatedAnswers = [...q.answers];

                    if (newTypeId === 1 && q.questionType.id !== 1) {
                        deleteAnswers(q);
                        addNewAnswer(q);
                    } else if (newTypeId !== 1 && q.questionType.id === 1) {
                        deleteAnswers(q);
                    }

                    return { ...q, questionType: questionType! };
                }
                return q;
            })
        );
    }
 
    const handleAnswerTitleName = (question: Question, answer: Answer, e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestions((prevQuestions: Question[]) => 
            prevQuestions.map(q => 
                q.id === question.id ? { ...q, answers: question.answers.map(a =>
                    a.id === answer.id ? { ...a, title: e.target.value } : a)
                } : q
            )
        )
    }

    const handleAnswerCorrectnessChange = (question: Question, answer: Answer) => {
        setQuestions((prevQuestions: Question[]) => 
            prevQuestions.map(q => {
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
        );
    };

    return (<>
        <div className="add-quiz-popup-container">
            <div className="top-section">
                <input
                    value={quiz.title}
                    type="text"
                    placeholder="Title"
                    onChange={handleTitleChange}
                ></input>
            </div>
            <div className="questions-container">
            {
                questions.length > 0 && questions.map((question: Question) => (
                    <div className="question-item">
                        <div className="question-header">
                            <div className="title">
                                {
                                    !question.isBeingEdited && <>
                                    <span>{question.title}</span>
                                    <span>{question.questionType.name}</span></>
                                }
                                {
                                    question.isBeingEdited && <>
                                    <input
                                        className="question-title-input"
                                        value={question.title}
                                        type="text"
                                        placeholder="Title"
                                        onChange={(e) => handleQuestionTitleName(question, e)}
                                    />
                                    <select
                                        value={question.questionType.id}
                                        onChange={(e) => handleQuestionTypeChange(question, e)}
                                    >
                                        {
                                            questionTypes.map((questionType) => {
                                                return <option value={questionType.id} key={questionType.id} onChange={(e) => handleQuestionTypeChange(question, e)}>{questionType.name.charAt(0).toUpperCase() + questionType.name.slice(1)}</option>
                                            })
                                        }
                                    </select></>
                                }
                            </div>
                            <div className="answers-container">
                                { 
                                    (question.questionType.id === 1 && question.isBeingEdited) &&
                                    question.answers && <input
                                        className="answer-input"
                                        value={question.answers[0].title}
                                        type="text"
                                        placeholder="Answer"
                                        onChange={(e) => handleAnswerTitleName(question, question.answers[0], e)}
                                    />
                                }
                                {
                                    (question.questionType.id === 1 && !question.isBeingEdited) &&
                                    question.answers && <span className="answer-text">{question.answers[0].title}</span>
                                }
                                {
                                    (question.questionType.id === 2 && question.isBeingEdited) && (
                                        question.answers && question.answers.map(answer => (
                                            <label key={answer.id}>
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
                                                    onChange={(e) => handleAnswerTitleName(question, answer, e)}
                                                />
                                            </label>
                                        )) && 
                                        <button onClick={() => addNewAnswer(question)}>ADD</button>
                                    )
                                }
                                {
                                    (question.questionType.id === 2 && !question.isBeingEdited) && (
                                        question.answers && question.answers.map(answer => (
                                            <label key={answer.id}>
                                                { answer.isCorrect ? <span>U</span> : <span>x</span> }
                                                <span>{answer.title}</span>
                                            </label>
                                        ))
                                    )
                                }
                                {
                                    (question.questionType.id === 3 && question.isBeingEdited) && <>{
                                        question.answers && question.answers.map(answer => (
                                            <label key={answer.id}>
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
                                                    onChange={(e) => handleAnswerTitleName(question, answer, e)}
                                                />
                                            </label>
                                        ))
                                    }
                                        <button onClick={() => addNewAnswer(question)}>ADD</button></>
                                }
                                {
                                    (question.questionType.id === 3 && !question.isBeingEdited) && (
                                        question.answers && question.answers.map(answer => (
                                            <label key={answer.id}>
                                                { answer.isCorrect ? <span>✓</span> : <span>x</span> }
                                                <span>{answer.title}</span>
                                            </label>
                                        ))
                                    )
                                }
                            </div>
                            <div className="buttons">
                                {
                                    !question.isBeingEdited &&
                                    <button onClick={() => handleIsQuesstionBeingEditedChange(question, true)}>EDIT</button>
                                }
                                {
                                    question.isBeingEdited && <>
                                    <button onClick={() => handleIsQuesstionBeingEditedChange(question, false)}>SAVE</button>
                                    <button onClick={() => handleIsQuesstionBeingEditedChange(question, false)}>CANCEL</button></>
                                }
                                <button>REMOVE</button>
                            </div>
                        </div>

                    </div>
                ))
            }
            </div>
            <button className="add-new-question-btn" onClick={addNewQuestion}>+</button>
        </div>
    </>);
}