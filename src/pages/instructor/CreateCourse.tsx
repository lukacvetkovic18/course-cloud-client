import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Course, Lesson, Quiz, User } from "../../utils/models";
import { getLessonsByCourseId, getLoggedInUser } from "../../services";
import { Header } from "../../components/Header";
import example from "../../assets/add-image.png"
import { Footer } from "../../components/Footer";
import { LessonCard } from "../../components/LessonCard";
import { createEmptyCourse, getCourseById } from "../../services/courseService";
import { getFilesByLessonId, getFilesByLessonIds } from "../../services/fileService";
import { createEmptyLesson } from "../../services/lessonService";
import { AddQuizPopup } from "../../components/instructor/AddQuizPopup";
import { createQuiz, getQuizByCourseId } from "../../services/quizService";

export const CreateCourse = () => {
    const navigate = useNavigate();

    // let [courseData, setCourseData] = useState<{
    //     title: string;
    //     shortDescription: string;
    //     description: string;
    //     isActive: boolean;
    //     duration: number;
    //     image: string;
    // }>({
    //     title: "",
    //     shortDescription: "",
    //     description: "",
    //     isActive: false,
    //     duration: 0,
    //     image: ""
    // });
    let [newCourse, setNewCourse] = useState<Course>();
    let [user, setUser] = useState<User>();
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [isLessonBeingAdded, setIsLessonBeingAdded] = useState<boolean>(false);
    let [lessonBeingAdded, setLessonBeingAdded] = useState<number>(0);
    let [quiz, setQuiz] = useState<Quiz>();
    let [isQuizBeingEdited, setIsQuizBeingEdited] = useState<boolean>(true);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        // if(localStorage.getItem("courseId") !== null) {
        //     const courseId = parseInt(localStorage.getItem("courseId")!);
        //     loadUser();
        //     loadNewCourse(courseId);
        // } else {
        //     navigate("/my-courses");
        // }
        loadUser();
        loadNewCourse();
    }, []);

    useEffect(() => {
        loadLessons();
    }, [isLessonBeingAdded]);

    useEffect(() => {
        if (lessons.length > 0) {
            loadLessonMaterials();
        }
    }, [lessons]);

    useEffect(() => {
        if (newCourse !== undefined) {
            console.log(newCourse)
            loadQuiz();
        }
    }, [newCourse]);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadQuiz = () => {
        getQuizByCourseId(newCourse!.id).then(res => {
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
        getLessonsByCourseId(11).then(res => {
            setLessons(res.data);
        }).catch(error => {
            console.error("Failed to load lessons:", error);
        });
    };

    const loadNewCourse = () => {
        getCourseById(11).then(res => {
            setNewCourse(res.data);
            loadLessons();
        })
        // createEmptyCourse().then(res => {
        //     setNewCourse(res.data)
        //     console.log(newCourse)
        // })
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewCourse((uInfo: any) => ({
            ...uInfo,
            [name]: value
        }))
    }

    const addLesson = () => {
        createEmptyLesson({courseId: 11}).then(res => {
            // setLessons((prevLessons: Lesson[]) => [...prevLessons, res.data]);
            setIsLessonBeingAdded(true);
            setLessonBeingAdded(res.data.id);
            // setLessonBeingAdded(lessons.find(l => l.id === res.data.id));
        })
    }

    const handleCreateQuiz = () => {
        createQuiz({
            title: "",
            courseId: newCourse!.id
        }).then(res => {
            setQuiz(res.data);
            handleEditQuiz();
        })
    }

    const handleEditQuiz = () => {
        setIsQuizBeingEdited(true);
    }

    const handleCloseQuiz = () => {
        setIsQuizBeingEdited(false);
    }
 
    return (<>
        <Header user={user}></Header>
        {
            newCourse && 
            <div className="create-course-container">
                <div className="subheader">
                    <span className="subtitle">Create Course</span>
                </div>
                <div className="basic-info">
                    <img src={newCourse!.image || example}/>
                    <input
                        className="title-input"
                        value={newCourse!.title}
                        type="text"
                        placeholder="Title"
                        onChange={handleChange}
                        name="title"
                    />
                    <textarea
                        className="short-description-input"
                        value={newCourse!.shortDescription}
                        placeholder="Short Description (Will be displayed in a list view)"
                        onChange={handleChange}
                        name="shortDescription"
                    />
                    <textarea
                        className="description-input"
                        value={newCourse!.description}
                        placeholder="Description (Will be displayed in detailed view)."
                        onChange={handleChange}
                        name="description"
                    />
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
                            !isLessonBeingAdded && <button onClick={addLesson}>+</button>
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
                    { !quiz && <button onClick={handleCreateQuiz}>CREATE QUIZ</button> }
                    { quiz && <button onClick={handleEditQuiz}>EDIT QUIZ</button> }
                    { isQuizBeingEdited && <button onClick={handleCloseQuiz}>CLOSE QUIZ</button> }
                </div>
                <div className="add-section">
                    <button>ADD COURSE</button>
                </div>
            </div>
        }
        <Footer/>
        {(quiz && isQuizBeingEdited) && (
            <div className="quiz-popup-overlay">
                <div className="quiz-popup-content" ref={popupRef}>
                    <AddQuizPopup quiz={quiz} setQuiz={setQuiz}/>
                </div>
            </div>
        )}
    </>);
}