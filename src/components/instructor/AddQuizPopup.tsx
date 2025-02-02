import { useEffect, useState } from "react";
import { createQuestion, deleteQuestion, getAllQuestionTypes, getQuestionsByQuizId, updateQuestionWithAnswers } from "../../services/questionService";
import { Answer, Question, QuestionType } from "../../utils/models";
import { createAnswer, deleteAnswer, deleteAnswersByQuestionId, getAnswersByQuestionIds } from "../../services/answerService";
import tickSign from "../../assets/tick-sign.png"
import xSign from "../../assets/x-sign.png"
import plusSign from "../../assets/plus-sign.png"
import { updateQuiz } from "../../services";

export const AddQuizPopup = ({quiz, setQuiz, setIsQuizBeingEdited}: any) => {
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

    const addNewQuestion = () => {
        createQuestion({
            title: "",
            questionTypeId: 2,
            quizId: quiz.id
        }).then(res => {
            setQuestions((prevQuestions: Question[]) => [...prevQuestions, { ...res.data, answers: [], isBeingEdited: true }]);
        })
    }
 
    const handleTitleChange = (e: any) => {
        setQuiz((quizInfo: any) => ({
            ...quizInfo,
            title: e.target.value
        }))
    }

    const addNewAnswer = (questionId: number, isCorrect: boolean) => {
        saveQuestionWithAnswers(questions.find(q=> q.id=== questionId)!);
        createAnswer({
            title: "",
            isCorrect: isCorrect,
            questionId: questionId
        }).then(res => {
            // setQuestions(prevQuestions => 
            //     prevQuestions.map(q => 
            //         q.id === questionId 
            //         ? { ...q, answers: [...q.answers, res.data] } 
            //         : q
            //     )
            // );
            loadQuestionAnswers();
        }).catch(error => {
            console.error("Failed to add answer:", error);
        });
    }

    const deleteAnswers = (questionId: number) => {
        deleteAnswersByQuestionId(questionId).then(() => {
            loadQuestionAnswers();
        })
    }

    const deleteSelectedAnswer = (answerId: number) => {
        deleteAnswer(answerId).then(() => {
            loadQuestionAnswers();
        })
    }

    const saveQuestionWithAnswers = (question: Question) => {
        const answers = question.answers.map(answer => ({
            id: answer.id,
            title: answer.title,
            isCorrect: answer.isCorrect
        }));

        const req = {
            id: question.id,
            title: question.title,
            questionTypeId: question.questionType.id,
            answers: answers
        }
        updateQuestionWithAnswers(req)
            .then(response => {
                console.log("Question and answers updated successfully:", response);

            })
            .catch(error => {
                console.error("Error updating question and answers:", error);
            });
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
                        console.log("Changed from choices to short")
                        deleteAnswersByQuestionId(q.id).then(() => {
                            console.log(q.answers.length)
                            if (q.answers.length === 0) {
                                addNewAnswer(q.id, true);
                            }
                        })
                    } else if (newTypeId !== 1 && q.questionType.id === 1) {
                        console.log("Changed from short to choices")
                        deleteAnswers(q.id);
                    }

                    return { ...q, questionType: questionType! };
                }
                return q;
            })
        );
    };
 
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

    const canSaveAnswers = (question: Question) => {
        return question.answers.every(a => a.title) && question.answers.some(a => a.isCorrect)
    }

    const canSaveQuestion = (question: Question) => {
        return question.title && question.answers.length > 0 && canSaveAnswers(question);
    }

    const canSaveQuiz = () => {
        return quiz.title && questions.length > 0 && questions.every(q => !q.isBeingEdited);
    }

    const saveQuiz = () => {
        updateQuiz({
            id: quiz.id,
            title: quiz.title,
            courseId: quiz.course.id
        }).then(() => {
            setIsQuizBeingEdited(false);
        })
    }

    const removeQuestion = (questionId: number) => {
        deleteQuestion(questionId).then(() => {
            loadQuizQuestions();
        })
    }

    return (<>
        <div className="add-quiz-popup-container">
            <div className="top-section">
                <input
                    value={quiz.title}
                    type="text"
                    placeholder="Quiz Title"
                    onChange={handleTitleChange}
                ></input>
            </div>
            <div className="questions-container">
                <span className="questions-title">Questions:</span>
            {
                questions.length > 0 && questions.map((question: Question) => (
                    <div className="question-item" key={question.id}>
                        <div className="question-header">
                            <div className="title">
                                {
                                    !question.isBeingEdited && <>
                                    <span>{question.title}</span>
                                    <span>{question.questionType.name.charAt(0).toUpperCase() + question.questionType.name.slice(1)}</span></>
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
                                    question.answers.length > 0 && <input
                                        className="answer-input"
                                        value={question.answers[0].title}
                                        type="text"
                                        placeholder="Answer"
                                        onChange={(e) => handleAnswerTitleName(question, question.answers[0], e)}
                                    />
                                }
                                {
                                    (question.questionType.id === 1 && !question.isBeingEdited) &&
                                    question.answers.length > 0 && <span className="answer-text">{question.answers[0].title}</span>
                                }
                                {
                                    (question.questionType.id === 2 && question.isBeingEdited) && <>{
                                        question.answers && question.answers.map(answer => (
                                            <div className="answer-item"><label key={answer.id}>
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
                                            <img src={xSign} onClick={() => deleteSelectedAnswer(answer.id)}/>
                                            </div>
                                        ))
                                    }
                                    <button className="add-new-question-btn" onClick={() => addNewAnswer(question.id, false)}>
                                        <img src={plusSign}/>
                                    </button></>
                                }
                                {
                                    (question.questionType.id === 2 && !question.isBeingEdited) && (
                                        question.answers && question.answers.map(answer => (
                                            <label key={answer.id}>
                                                { answer.isCorrect && <img src={tickSign}/> }
                                                { !answer.isCorrect && <img src={xSign}/> }
                                                <span>{answer.title}</span>
                                            </label>
                                        ))
                                    )
                                }
                                {
                                    (question.questionType.id === 3 && question.isBeingEdited) && <>{
                                        question.answers && question.answers.map(answer => (
                                            <div className="answer-item"><label key={answer.id}>
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
                                            <img src={xSign} onClick={() => deleteSelectedAnswer(answer.id)}/>
                                            </div>
                                        ))
                                    }
                                        <button className="add-new-question-btn" onClick={() => addNewAnswer(question.id, false)}>
                                            <img src={plusSign}/>
                                        </button></>
                                }
                                {
                                    (question.questionType.id === 3 && !question.isBeingEdited) && (
                                        question.answers && question.answers.map(answer => (
                                            <label key={answer.id}>
                                                { answer.isCorrect && <img src={tickSign}/> }
                                                { !answer.isCorrect && <img src={xSign}/> }
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
                                    <button onClick={() => {
                                        saveQuestionWithAnswers(question);
                                        handleIsQuesstionBeingEditedChange(question, false);
                                    }} disabled={!canSaveQuestion(question)}>SAVE</button>
                                    <button onClick={() => handleIsQuesstionBeingEditedChange(question, false)}>CANCEL</button></>
                                }
                                <button onClick={() => removeQuestion(question.id)}>REMOVE</button>
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
                <button onClick={saveQuiz} disabled={!canSaveQuiz()}>SAVE QUIZ</button>
                <button onClick={() => setIsQuizBeingEdited(false)}>CANCEL</button>
            </div>
        </div>
    </>);
}