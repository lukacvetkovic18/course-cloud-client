import { useEffect, useState } from "react";
import { getQuestionsByQuizId } from "../../services/questionService";
import { Answer, Question, Quiz, QuizAttempt, User } from "../../utils/models";
import { getAnswersByQuestionIds } from "../../services/answerService";
import { getLoggedInUser, getQuizById } from "../../services";
import { useNavigate } from "react-router";
import { createQuizAttempt } from "../../services/quizAttemptService";

export const TakeExam = () => {
    const navigate = useNavigate();

    let [quiz, setQuiz] = useState<Quiz>();
    let [user, setUser] = useState<User>();
    let [quizAttempt, setQuizAttempt] = useState<QuizAttempt>();
    let [questions, setQuestions] = useState<Question[]>([]);
    // let [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
    let [selectedAnswers, setSelectedAnswers] = useState<Map<number, number[]>>(
      new Map()
    );
    let [textAnswers, setTextAnswers] = useState<Map<number, string>>(
      new Map()
    );

    useEffect(() => {
        if(localStorage.getItem("quizId") !== null) {
            const quizId = parseInt(localStorage.getItem("quizId")!);
            loadUser();
            loadQuiz(quizId);
        } else {
            navigate("/my-courses");
        }

        return () => {
            localStorage.removeItem("quizId");
        }
    }, []);

    useEffect(() => {
        if (quiz) {
            loadQuizQuestions();
        }
    }, [quiz]);

    useEffect(() => {
        if (questions.length > 0) {
            loadQuestionAnswers();
        }
    }, [questions.length]);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadQuiz = (quizId: number) => {
        getQuizById(quizId).then(res => {
            setQuiz(res.data);
        })
    }

    const loadQuizQuestions = () => {
        getQuestionsByQuizId(quiz!.id).then(res => {
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

    const handleAnswerSelection = (questionId: number, answerId: number, questionType: number) => {
        setSelectedAnswers((prevSelectedAnswers) => {
            const newSelectedAnswers = new Map(prevSelectedAnswers);
            
            if (questionType === 2) {
                newSelectedAnswers.set(questionId, [answerId]);
            } else if (questionType === 3) {
                const answerIds = newSelectedAnswers.get(questionId) || [];
                if (answerIds.includes(answerId)) {
                    newSelectedAnswers.set(
                        questionId,
                        answerIds.filter((id) => id !== answerId)
                    );
                } else {
                    newSelectedAnswers.set(questionId, [...answerIds, answerId]);
                }
            }
            
            return newSelectedAnswers;
        });
    };

    const handleTextAnswerChange = (
        questionId: number,
        answer: string
    ) => {
        setTextAnswers((prevTextAnswers) => {
        const newTextAnswers = new Map(prevTextAnswers);
        newTextAnswers.set(questionId, answer);
        return newTextAnswers;
        });
    };

    const handleSubmitQuizAttempt = async () => {
      try {
        if (!user || !quiz) return;
        const userId = user.id;
        const quizId = quiz.id;
        const selectedAnswerIds: Record<number, number[]> = {};
        selectedAnswers.forEach((answers, questionId) => {
            selectedAnswerIds[questionId] = answers;
        });
        const textAnswerRecords: Record<number, string> = {};
        selectedAnswers.forEach((answers, questionId) => {
          selectedAnswerIds[questionId] = answers;
        });
  
        const res = await createQuizAttempt(
          userId,
          quizId,
          selectedAnswerIds,
          textAnswerRecords
        );
        setQuizAttempt(res.data);
        console.log("Quiz attempt created successfully:", res.data);
      } catch (error) {
        console.error("Failed to submit quiz attempt:", error);
      }
    };

    const canSubmitQuiz = () => {
        return questions.every(q => {
                if (q.questionType.id === 1) {
                    return textAnswers.has(q.id) && textAnswers.get(q.id)!.trim() !== "";
                } else {
                    return selectedAnswers.has(q.id) && selectedAnswers.get(q.id)!.length > 0;
                }
            })
    }

    return (<>
        <div className="take-quiz-container">
            <div className="quiz-header">
                <h2>{quiz?.title}</h2>
            </div>
            <div className="questions-container">
            {
                questions.length > 0 && questions.map((question: Question) => (
                    <div className="question-item" key={question.id}>
                        <div className="question-title">{question.title}</div>
                        <div className="answers-container">
                            { 
                                (question.questionType.id === 1 &&
                                question.answers.length > 0) && <input
                                    className="answer-input"
                                    value={textAnswers.get(question.id) || ""}
                                    type="text"
                                    placeholder="Answer"
                                    onChange={(e) => handleTextAnswerChange(question.id, e.target.value)}
                                />
                            }
                            {
                                question.questionType.id === 2 && 
                                question.answers.map((answer) => (
                                  <label key={answer.id}>
                                    <input
                                      type="radio"
                                      checked={
                                        selectedAnswers.get(question.id)?.includes(
                                          answer.id
                                        ) || false
                                      }
                                      onChange={() =>
                                        handleAnswerSelection(question.id, answer.id, question.questionType.id)
                                      }
                                    />
                                    <span>{answer.title}</span>
                                  </label>
                                ))
                            }
                            {
                                question.questionType.id === 3 && 
                                question.answers.map((answer) => (
                                  <label key={answer.id}>
                                    <input
                                      type="checkbox"
                                      checked={
                                        selectedAnswers.get(question.id)?.includes(
                                          answer.id
                                        ) || false
                                      }
                                      onChange={() =>
                                        handleAnswerSelection(question.id, answer.id, question.questionType.id)
                                      }
                                    />
                                    <span>{answer.title}</span>
                                  </label>
                                ))
                            }
                        </div>
                    </div>

                ))
            }
            </div>
            <div className="buttons-section">
                <button onClick={handleSubmitQuizAttempt} disabled={!canSubmitQuiz()}>Submit Quiz</button>
            </div>
        </div>
    </>);
}