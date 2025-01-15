import { useEffect, useState } from "react";
import example from "../../assets/example-button-speech-bubble-example-colorful-web-banner-illustration-vector.jpg"
import { createQuestion, getAllQuestionTypes, getQuestionsByQuizId } from "../../services/questionService";
import { Answer, Question, QuestionType } from "../../utils/models";
import { getAnswersByQuestionIds } from "../../services/answerService";

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
    }, [questions]);

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
                                    !question.isBeingEdited &&
                                    <span>{question.title}</span>
                                }
                                {
                                    question.isBeingEdited && <>
                                    <button>SAVE</button>
                                    <button>CANCEL</button></>
                                }
                            </div>
                            <div className="buttons">
                                {
                                    !question.isBeingEdited &&
                                    <button>EDIT</button>
                                }
                                {
                                    question.isBeingEdited && <>
                                    <button>SAVE</button>
                                    <button>CANCEL</button></>
                                }
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