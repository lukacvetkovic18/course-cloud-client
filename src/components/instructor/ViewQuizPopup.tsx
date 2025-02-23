import { useEffect, useState } from "react";
import { getQuestionsByQuizId } from "../../services/questionService";
import { Answer, Question } from "../../utils/models";
import { getAnswersByQuestionIds } from "../../services/answerService";
import tickSign from "../../assets/tick-sign.png"
import xSign from "../../assets/x-sign.png"

export const ViewQuizPopup = ({quiz}: any) => {
    let [questions, setQuestions] = useState<Question[]>([]);
    // let [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);

    useEffect(() => {
        // loadQuestionTypes();
        loadQuizQuestions();
    }, [])
    useEffect(() => {
        if (questions.length > 0) {
            loadQuestionAnswers();
        }
    }, [questions.length]);

    // const loadQuestionTypes = () => {
    //     getAllQuestionTypes().then(res => {
    //         setQuestionTypes(res.data);
    //     }).catch(error => {
    //         console.error("Failed to load question types:", error);
    //     });
    // }

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

    return (<>
        <div className="view-quiz-popup-container">
            <div className="top-section">
                <span>{quiz.title}</span>
            </div>
            <div className="questions-container">
                <span className="questions-title">Questions:</span>
            {
                questions.length > 0 && questions.map((question: Question) => (
                    <div className="question-item" key={question.id}>
                        <div className="question-header">
                            <div className="title">
                                <span>{question.title}</span>
                                <span>{question.questionType.name.charAt(0).toUpperCase() + question.questionType.name.slice(1)}</span>
                            </div>
                            <div className="answers-container">
                                {
                                    (question.questionType.id === 1) &&
                                    question.answers.length > 0 && <span className="answer-text">{question.answers[0].title}</span>
                                }
                                {
                                    (question.questionType.id === 2) && (
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
                                    (question.questionType.id === 3) && (
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
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    </>);
}