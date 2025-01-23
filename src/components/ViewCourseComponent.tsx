import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Lesson, Quiz, User } from "../utils/models";
import { getLessonsByCourseId, getLoggedInUser, getOwnerOfCourse, isUserOwnerOfCourse } from "../services";
import { getQuizByCourseId } from "../services/quizService";
import { getFilesByLessonIds } from "../services/fileService";
import example from "../assets/add-image.png"
import { LessonCard } from "./LessonCard";

export const ViewCourseComponent = ({course, isOwner}: any) => {
    const navigate = useNavigate();

    let [user, setUser] = useState<User>();
    let [courseOwner, setCourseOwner] = useState<User>();
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [isLessonBeingAdded, setIsLessonBeingAdded] = useState<boolean>(false);
    let [lessonBeingAdded, setLessonBeingAdded] = useState<number>(0);
    let [quiz, setQuiz] = useState<Quiz>();
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        loadLessons();
        // loadCourseOwner();
    }, []);

    useEffect(() => {
        // loadLessons();
    }, [isLessonBeingAdded]);

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

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadCourseOwner = () => {
        getOwnerOfCourse(course.id).then(res => {
            setCourseOwner(res.data);
        })
    }

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
        // setIsQuizBeingEdited(false);
    }

    const handleViewQuiz = () => {
        // setIsQuizBeingEdited(false);
    }

    const handleTakeQuiz = () => {
        // setIsQuizBeingEdited(false);
    }

    return (<>
        {
            course && 
            <div className="create-course-container">
                <div className="subheader">
                    <span className="subtitle">Create Course</span>
                </div>
                <div className="basic-info">
                    <img src={course.image || example}/>
                    <span>{course.title}</span>
                    <span>{course.shortDescription}</span>
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
                                        isCreateMode={true}
                                        isLessonBeingAdded={false}
                                        setIsLessonBeingAdded={null}
                                    ></LessonCard>
                                }
                            })
                        }
                        {
                            (lessonBeingAdded && isLessonBeingAdded) && <LessonCard
                                lesson={null}
                                setLessons={setLessons}
                                lessonId={lessonBeingAdded}
                                isCreateMode={true}
                                isLessonBeingAdded={lessonBeingAdded}
                                setIsLessonBeingAdded={setIsLessonBeingAdded}
                            ></LessonCard>
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
        {/* {(quiz && isQuizBeingEdited) && (
            <div className="quiz-popup-overlay">
                <div className="quiz-popup-content" ref={popupRef}>
                    <AddQuizPopup quiz={quiz} setQuiz={setQuiz} setIsQuizBeingEdited={setIsQuizBeingEdited}/>
                </div>
            </div>
        )} */}
    </>);
}