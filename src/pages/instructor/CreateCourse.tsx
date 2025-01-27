import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Course, Lesson, Quiz, User } from "../../utils/models";
import { getLessonsByCourseId, getLoggedInUser } from "../../services";
import { Header } from "../../components/Header";
import example from "../../assets/add-image.png"
import plusSign from "../../assets/plus-sign.png"
import { Footer } from "../../components/Footer";
import { LessonCard } from "../../components/LessonCard";
import { createEmptyCourse, deleteCourse, getCourseById, updateCourse } from "../../services/courseService";
import { getFilesByLessonId, getFilesByLessonIds } from "../../services/fileService";
import { createEmptyLesson } from "../../services/lessonService";
import { AddQuizPopup } from "../../components/instructor/AddQuizPopup";
import { createQuiz, getQuizByCourseId } from "../../services/quizService";

export const CreateCourse = () => {
    const navigate = useNavigate();

    // let [pageMode, setPageMode] = useState<string>("");
    let [newCourse, setNewCourse] = useState<Course>();
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
        if(localStorage.getItem("courseId") !== null) {
            const courseId = parseInt(localStorage.getItem("courseId")!);
            loadUser();
            loadNewCourse(courseId);
        } else {
            navigate("/my-courses");
        }

        return () => {
            localStorage.removeItem("courseId");
        }
    }, []);

    useEffect(() => {
        loadLessons();
    }, [isLessonBeingAdded]);

    useEffect(() => {
        if (lessons.length > 0) {
            loadLessonMaterials();
        }
    }, [lessons.length]);

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
            setMaterialsLoaded(true);
        } catch (error) {
            console.error("Failed to load lesson materials:", error);
        }
    };

    const loadLessons = () => {
        if(newCourse){
        getLessonsByCourseId(newCourse.id).then(res => {
            setLessons(res.data);
        }).catch(error => {
            console.error("Failed to load lessons:", error);
        });}
    };

    const loadNewCourse = (courseId: number) => {
        getCourseById(courseId).then(res => {
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
        if(newCourse){
        createEmptyLesson({courseId: newCourse.id}).then(res => {
            // setLessons((prevLessons: Lesson[]) => [...prevLessons, res.data]);
            setIsLessonBeingAdded(true);
            setLessonBeingAdded(res.data.id);
            // setLessonBeingAdded(lessons.find(l => l.id === res.data.id));
        })}
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
        console.log(quiz)
        setIsQuizBeingEdited(true);
    }

    // const handleCloseQuiz = () => {
    //     setIsQuizBeingEdited(false);
    // }
 
    const saveCourse = () => {
        const req = {
            id: newCourse!.id,
            title: newCourse!.title,
            shortDescription: newCourse!.shortDescription,
            description: newCourse!.description,
            isActive: newCourse!.isActive,
            image: newCourse!.image || ""
        }
        updateCourse(req).then(() => {
            navigate("/my-courses");
        })
    }
 
    const removeCourse = () => {
        deleteCourse(newCourse!.id).then(() => {
            navigate("/my-courses");
        })
    }
 
    const canSaveCourse = () => {
        if(newCourse!.title &&
            newCourse!.shortDescription &&
            newCourse!.description &&
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
                        setNewCourse((course: any) => ({
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
        setNewCourse((course: any) => ({
            ...course,
            image: null
        }));
    };

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };


    return (<>
        <Header user={user}></Header>
        {
            newCourse && 
            <div className="create-course-container">
                <div className="subheader">
                    <span className="subtitle">Create Course</span>
                </div>
                <div className="basic-info">
                    <div className="image-details">
                        <img src={newCourse!.image || example}
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
                            {newCourse.image && <button onClick={removeImage}>Remove image</button>}
                        </div>
                    </div>
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
        <Footer/>
        {(quiz && isQuizBeingEdited) && (
            <div className="quiz-popup-overlay">
                <div className="quiz-popup-content" ref={popupRef}>
                    <AddQuizPopup quiz={quiz} setQuiz={setQuiz} setIsQuizBeingEdited={setIsQuizBeingEdited}/>
                </div>
            </div>
        )}
    </>);
}