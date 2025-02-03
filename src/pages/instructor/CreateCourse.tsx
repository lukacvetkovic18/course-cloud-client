import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Lesson, Question, QuestionType, User } from "../../utils/models";
import { createCourse, createLesson, createQuiz, getLoggedInUser } from "../../services";
import { Header } from "../../components/Header";
import example from "../../assets/add-image.png"
import plusSign from "../../assets/plus-sign.png"
import { Footer } from "../../components/Footer";
import { AddQuizPopup } from "../../components/instructor/AddQuizPopup";
import { ViewLessonCard } from "../../components/ViewLessonCard";
import { EditLessonCard } from "../../components/instructor/EditLessonCard";
import { CreateLessonCard } from "../../components/instructor/CreateLessonCard";
import { getAllQuestionTypes } from "../../services/questionService";
import { isUserInstructor } from "../../services/userService";

export const CreateCourse = () => {
    const navigate = useNavigate();

    let [newCourse, setNewCourse] = useState<{
        title: string;
        shortDescription: string;
        description: string;
        isActive: boolean;
        image: string | null;
    }>({
        title: "",
        shortDescription: "",
        description: "",
        isActive: true,
        image: null
    });
    let [user, setUser] = useState<User>();
    let [lessons, setLessons] = useState<Partial<Lesson>[]>([]);
    let [isLessonBeingAdded, setIsLessonBeingAdded] = useState<boolean>(false);
    let [lessonBeingEdited, setLessonBeingEdited] = useState<Partial<Lesson> | null>(null);
    let [quiz, setQuiz] = useState<{
            title: string;
            questions: Question[];
        }>({
            title: "",
            questions: []
        });
    let [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
    let [isQuizBeingEdited, setIsQuizBeingEdited] = useState<boolean>(false);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        isUserInstructor().then(res => {
            if(!res.data) navigate("/home")
        });
        loadUser();
        loadQuestionTypes();
    }, []);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadQuestionTypes = () => {
        getAllQuestionTypes().then(res => {
            setQuestionTypes(res.data);
        })
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewCourse((uInfo: any) => ({
            ...uInfo,
            [name]: value
        }))
    }

    const handleCreateLesson = () => {
        setIsLessonBeingAdded(true);
    }

    const handleFinishCreatingLesson = () => {
        setIsLessonBeingAdded(false);
    }

    const handleEditLesson = (lesson: Partial<Lesson>) => {
        setLessonBeingEdited(lesson);
    }

    const handleFinishEditingLesson = () => {
        setLessonBeingEdited(null);
    }

    const handleDeleteLesson = (lesson: Partial<Lesson>) => {
        setLessons(prevLessons => prevLessons.filter(l => l.id !== lesson.id));
    }

    const handleEditQuiz = () => {
        setIsQuizBeingEdited(true);
    }

    const handleCloseQuiz = () => {
        setIsQuizBeingEdited(false);
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
                        canvas.width = 300;
                        canvas.height = 200;
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
    
    const saveCourse = async () => {
        try {
            const req = {
                title: newCourse.title,
                shortDescription: newCourse.shortDescription,
                description: newCourse.description,
                isActive: newCourse.isActive,
                image: newCourse.image || ""
            };

            const courseResponse = await createCourse(req);
            const courseId = courseResponse.data.id;

            const lessonPromises = lessons.map(l => {
                const lessonReq = {
                    courseId: courseId,
                    title: l.title!,
                    files: l.files!.map(f => ({ file: f.file }))
                };
                return createLesson(lessonReq);
            });

            await Promise.all(lessonPromises);

            const quizReq = {
                title: quiz.title,
                courseId: courseId,
                questions: quiz.questions.map(q => ({
                    title: q.title,
                    questionTypeId: q.questionType.id,
                    answers: q.answers.map(a => ({
                        title: a.title,
                        isCorrect: a.isCorrect
                    }))
                }))
            };

            await createQuiz(quizReq);

            navigate("/my-courses");
        } catch (error) {
            console.error("Failed to save course:", error);
            alert("Failed to save course. Please try again.");
        }
    };

    // const saveCourse = () => {
    //     const req = {
    //         title: newCourse!.title,
    //         shortDescription: newCourse!.shortDescription,
    //         description: newCourse!.description,
    //         isActive: newCourse!.isActive,
    //         image: newCourse!.image || ""
    //     }
    //     createCourse(req).then(async res => {
    //         lessons.forEach(async l => {
    //             const lessonReq = {
    //                 courseId: res.data.id,
    //                 title: l.title!,
    //                 files: l.files!.map(f => ({ file: f.file }))
    //             }
    //             await createLesson(lessonReq).catch(() => console.log("Failed Lesson save"));
    //         })
    //         const quizReq = {
    //             title: quiz.title,
    //             courseId: res.data.id,
    //             questions: quiz.questions.map(q => ({
    //                 title: q.title,
    //                 questionTypeId: q.questionType.id,
    //                 answers: q.answers.map(a => ({
    //                     title: a.title,
    //                     isCorrect: a.isCorrect
    //                 }))
    //             }))
    //         }
    //         await createQuiz(quizReq).catch(() => console.log("Failed Quiz save"));
    //     })
    // }
 
    const cancelCourse = () => {
        navigate("/my-courses");
    }

    const canSaveCourse = () => {
        if(newCourse.title &&
            newCourse.shortDescription &&
            newCourse.description &&
            lessons.length > 0 &&
            quiz) return true;

        return false;
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
                            return (lessonBeingEdited && lessonBeingEdited.id === lesson.id) ?
                            <EditLessonCard
                                lesson={lesson}
                                setLessons={setLessons}
                                handleFinishEditingLesson={handleFinishEditingLesson}
                            /> :
                            <ViewLessonCard
                                key={lesson.id}
                                lesson={lesson}
                                handleEditLesson={handleEditLesson}
                                handleDeleteLesson={handleDeleteLesson}
                                isAbleToEdit={true}
                            />
                        })
                    }
                    {
                        !isLessonBeingAdded ?
                        <button onClick={handleCreateLesson} disabled={lessonBeingEdited !== null} className="add-lesson-btn">
                            <img src={plusSign}/>
                        </button> :
                        <CreateLessonCard
                            setLessons={setLessons}
                            handleFinishCreatingLesson={handleFinishCreatingLesson}
                        />
                    }
                    </div>
                </div>
                <div className="quiz-info">
                    <span>Quiz</span>
                    <div className="quiz-buttons">
                        <button onClick={handleEditQuiz}>
                            { quiz.title !== "" ? "EDIT" : "CREATE"} QUIZ
                        </button>
                    </div>
                </div>
                <div className="add-section">
                    <button onClick={saveCourse} disabled={!canSaveCourse()}>SAVE COURSE</button>
                    <button onClick={cancelCourse}>CANCEL</button>
                </div>
            </div>
        }
        <Footer/>
        {isQuizBeingEdited && (
            <div className="quiz-popup-overlay">
                <div className="quiz-popup-content" ref={popupRef}>
                    <AddQuizPopup quiz={quiz} setQuiz={setQuiz} questionTypes={questionTypes} handleCloseQuiz={handleCloseQuiz}/>
                </div>
            </div>
        )}
    </>);
}