import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Lesson, Quiz, User } from "../utils/models";
import { getLessonsByCourseId, getLoggedInUser, getOwnerOfCourse, isUserOwnerOfCourse } from "../services";
import { getQuizByCourseId } from "../services/quizService";
import { getFilesByLessonIds } from "../services/fileService";
import example from "../assets/add-image.png"
import { LessonCard } from "./LessonCard";
import { ViewQuizPopup } from "./instructor/ViewQuizPopup";

export const ViewCourseComponent = ({course, isOwner}: any) => {
    const navigate = useNavigate();

    // let [user, setUser] = useState<User>();
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [quiz, setQuiz] = useState<Quiz>();
    let [isQuizOpened, setIsQuizOpened] = useState<boolean>(false);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // if(localStorage.getItem("token") === null) {
        //     navigate("/");
        // };
        // loadUser();
        loadLessons();
    }, []);

    useEffect(() => {
        if (lessons.length > 0) {
            loadLessonMaterials();
        }
    }, [lessons.length]);

    useEffect(() => {
        if (course !== undefined) {
            console.log(course)
            loadQuiz();
        }
    }, [course]);

    // const loadUser = () => {
    //     getLoggedInUser().then(res => {
    //         setUser(res.data);
    //     })
    // }

    const loadQuiz = () => {
        getQuizByCourseId(course!.id).then(res => {
            setQuiz(res.data);
        })
    }

    const loadLessonMaterials = async () => {
        try {
            const lessonIds = lessons.map(lesson => lesson.id);
            const res = await getFilesByLessonIds(lessonIds);
            const materials = res.data;

            const materialsMap = materials.reduce((acc: any, material: any) => {
                const lessonId = material.lesson.id;
                if (!acc[lessonId]) {
                    acc[lessonId] = [];
                }
                acc[lessonId].push(material);
                return acc;
            }, {});

            setLessons((prevLessons: Lesson[]) => 
                prevLessons.map(lesson => 
                    materialsMap[lesson.id] ? { ...lesson, materials: materialsMap[lesson.id] } : lesson
                )
            );
        } catch (error) {
            console.error("Failed to load lesson materials:", error);
        }
    };

    const loadLessons = () => {
        getLessonsByCourseId(course.id).then(res => {
            setLessons(res.data);
        }).catch(error => {
            console.error("Failed to load lessons:", error);
        });
    };

    const handleCloseQuiz = () => {
        setIsQuizOpened(false);
    }

    const handleViewQuiz = () => {
        setIsQuizOpened(true);
    }

    const handleTakeQuiz = () => {
        localStorage.setItem("quizId", quiz!.id.toString());
        navigate("/quiz");
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            handleCloseQuiz();
        }
    }

    useEffect(() => {
        if (isQuizOpened) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isQuizOpened]);

    return (<>
        {
            course && 
            <div className="view-course-container">
                <div className="basic-info">
                    <img src={course.image || example}/>
                    <span>{course.title}</span>
                    <span>{course.description}</span>
                </div>
                <div className="lessons-info">
                    <span className="lessons-title">Lessons</span>
                    <div className="lessons-container">
                        {
                            lessons && lessons.map(lesson => {
                                if(lesson.title) {
                                    return <LessonCard
                                        key={lesson.id}
                                        lesson={lesson}
                                        setLessons={setLessons}
                                        lessonId={null}
                                        isCreateMode={false}
                                        isLessonBeingAdded={false}
                                        setIsLessonBeingAdded={null}
                                    ></LessonCard>
                                }
                            })
                        }
                    </div>
                </div>
                <div className="quiz-info">
                    <span>Quiz</span>
                    <div className="quiz-buttons">
                        { !isOwner && <button onClick={handleTakeQuiz}>TAKE QUIZ</button> }
                        { isOwner && <button onClick={handleViewQuiz}>VIEW QUIZ</button> }
                    </div>
                </div>
            </div>
        }
        {(quiz && isQuizOpened) && (
            <div className="view-quiz-popup-overlay">
                <div className="view-quiz-popup-content" ref={popupRef}>
                    <ViewQuizPopup quiz={quiz}/>
                </div>
            </div>
        )}
    </>);
}