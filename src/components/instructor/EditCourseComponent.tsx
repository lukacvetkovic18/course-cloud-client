import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Course, Lesson, Quiz, User } from "../../utils/models";
import { getLessonsByCourseId, getLoggedInUser } from "../../services";
import { Header } from "../Header";
import example from "../../assets/add-image.png"
import plusSign from "../../assets/plus-sign.png"
import { Footer } from "../Footer";
import { LessonCard } from "../LessonCard";
import { createEmptyCourse, deleteCourse, getCourseById, updateCourse } from "../../services/courseService";
import { getFilesByLessonId, getFilesByLessonIds } from "../../services/fileService";
import { createEmptyLesson } from "../../services/lessonService";
import { AddQuizPopup } from "./AddQuizPopup";
import { createQuiz, getQuizByCourseId } from "../../services/quizService";

export const EditCourseComponent = ({course, setCourse}: any) => {
    const navigate = useNavigate();

    let [user, setUser] = useState<User>();
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [isLessonBeingAdded, setIsLessonBeingAdded] = useState<boolean>(false);
    let [lessonBeingAdded, setLessonBeingAdded] = useState<number>(0);
    let [quiz, setQuiz] = useState<Quiz>();
    let [isQuizBeingEdited, setIsQuizBeingEdited] = useState<boolean>(false);
    let [materialsLoaded, setMaterialsLoaded] = useState<boolean>(false);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        loadLessons();
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
            setMaterialsLoaded(true);
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
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCourse((uInfo: any) => ({
            ...uInfo,
            [name]: value
        }))
    }

    const addLesson = () => {
        createEmptyLesson({courseId: course.id}).then(res => {
            // setLessons((prevLessons: Lesson[]) => [...prevLessons, res.data]);
            setIsLessonBeingAdded(true);
            setLessonBeingAdded(res.data.id);
            // setLessonBeingAdded(lessons.find(l => l.id === res.data.id));
        })
    }

    const handleCreateQuiz = () => {
        createQuiz({
            title: "",
            courseId: course!.id
        }).then(res => {
            setQuiz(res.data);
            handleEditQuiz();
        })
    }

    const handleEditQuiz = () => {
        console.log(quiz)
        setIsQuizBeingEdited(true);
    }

    // const handleCloseQuiz = () => {
    //     setIsQuizBeingEdited(false);
    // }
 
    const saveCourse = () => {
        const req = {
            id: course!.id,
            title: course!.title,
            shortDescription: course!.shortDescription,
            description: course!.description,
            isActive: course!.isActive,
            image: course!.image || ""
        }
        updateCourse(req).then(() => {
            navigate("/my-courses");
        })
    }
 
    const removeCourse = () => {
        deleteCourse(course.id).then(() => {
            navigate("/my-courses");
        })
    }
 
    const canSaveCourse = () => {
        if(course.title &&
            course.shortDescription &&
            course.description &&
            lessons.length > 0 &&
            quiz) return true;

        return false;
    }

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = new Image();
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const size = Math.min(image.width, image.height);
                        const offsetX = (image.width - size) / 2;
                        const offsetY = (image.height - size) / 2;
                        // Set the canvas to the desired dimensions
                        canvas.width = 300;
                        canvas.height = 200;
                        // Draw the resized image on the canvas
                        ctx.drawImage(image, 0, 0, 300, 200);
                        const base64Image = canvas.toDataURL('image/png');
                        setCourse((course: any) => ({
                            ...course,
                            image: base64Image
                        }));
                    }
                };
                image.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCourse((course: any) => ({
            ...course,
            image: null
        }));
    };

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };


    return (<>
        {
            course && 
            <div className="create-course-container">
                <div className="basic-info">
                    <div className="image-details">
                        <img src={course.image || example}
                            onClick={triggerFileInput}
                        />
                        <div>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button onClick={triggerFileInput}>Upload image</button>
                            {course.image && <button onClick={removeImage}>Remove image</button>}
                        </div>
                    </div>
                    <input
                        className="title-input"
                        value={course.title}
                        type="text"
                        placeholder="Title"
                        onChange={handleChange}
                        name="title"
                    />
                    <textarea
                        className="short-description-input"
                        value={course.shortDescription}
                        placeholder="Short Description (Will be displayed in a list view)"
                        onChange={handleChange}
                        name="shortDescription"
                    />
                    <textarea
                        className="description-input"
                        value={course.description}
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
                            !isLessonBeingAdded && <button onClick={addLesson} className="add-lesson-btn">
                                <img src={plusSign}/>
                            </button>
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
                        { !quiz && <button onClick={handleCreateQuiz}>CREATE QUIZ</button> }
                        { quiz && <button onClick={handleEditQuiz}>EDIT QUIZ</button> }
                        {/* { isQuizBeingEdited && <button onClick={handleCloseQuiz}>CLOSE QUIZ</button> } */}
                    </div>
                </div>
                <div className="add-section">
                    <button onClick={saveCourse} disabled={!canSaveCourse}>SAVE COURSE</button>
                    <button onClick={removeCourse}>CANCEL</button>
                </div>
            </div>
        }
        {(quiz && isQuizBeingEdited) && (
            <div className="quiz-popup-overlay">
                <div className="quiz-popup-content" ref={popupRef}>
                    <AddQuizPopup quiz={quiz} setQuiz={setQuiz} setIsQuizBeingEdited={setIsQuizBeingEdited}/>
                </div>
            </div>
        )}
    </>);
}