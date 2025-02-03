import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Course, Lesson, QuestionType, Quiz } from "../../utils/models";
import { getLessonsByCourseId } from "../../services";
import example from "../../assets/add-image.png"
import plusSign from "../../assets/plus-sign.png"
import { deleteCourse, updateCourse } from "../../services/courseService";
import { getFilesByLessonIds } from "../../services/fileService";
import { updateLesson } from "../../services/lessonService";
import { AddQuizPopup } from "./AddQuizPopup";
import { getQuizByCourseId, updateQuiz } from "../../services/quizService";
import { EditLessonCard } from "./EditLessonCard";
import { ViewLessonCard } from "../ViewLessonCard";
import { CreateLessonCard } from "./CreateLessonCard";
import { getAllQuestionTypes } from "../../services/questionService";

interface EditCourseComponentProps {
    course: Course
    setCourse: React.Dispatch<React.SetStateAction<Course | undefined>>
}

export const EditCourseComponent = ({course, setCourse}: EditCourseComponentProps) => {
    const navigate = useNavigate();

    let [updatedCourse, setUpdatedCourse] = useState<Course>(course);
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [isLessonBeingAdded, setIsLessonBeingAdded] = useState<boolean>(false);
    let [lessonBeingEdited, setLessonBeingEdited] = useState<Partial<Lesson> | null>(null);
    let [quiz, setQuiz] = useState<Quiz>();
    let [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
    let [isQuizBeingEdited, setIsQuizBeingEdited] = useState<boolean>(false);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadLessonsAndFiles();
        loadQuiz();
        loadQuestionTypes();
    }, []);

    const loadQuiz = () => {
        getQuizByCourseId(updatedCourse.id).then(res => {
            setQuiz(res.data);
        })
    }

    const loadLessonsAndFiles = async () => {
        try {
            const lessonsResponse = await getLessonsByCourseId(updatedCourse.id);
            const lessonsData = lessonsResponse.data;

            const lessonIds = lessonsData.map((lesson: Lesson) => lesson.id);
            const filesResponse = await getFilesByLessonIds(lessonIds);

            const filesData = filesResponse.data;

            const lessonsWithFiles = lessonsData.map((lesson: Lesson) => ({
                ...lesson,
                files: filesData.filter((file: any) => file.lesson.id === lesson.id).map((file: any) => ({
                    id: file.id,
                    name: file.name,
                    type: file.type,
                    file: new File([new Blob([file.data], { type: file.type })], file.name, { type: file.type }),
                    createdAt: file.createdAt
                }))
            }));

            setLessons(lessonsWithFiles);
        } catch (error) {
            console.error("Failed to load lessons and files:", error);
        }
    };

    const loadQuestionTypes = () => {
        getAllQuestionTypes().then(res => {
            setQuestionTypes(res.data);
        })
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCourse((uInfo: any) => ({
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
                        setUpdatedCourse((course: any) => ({
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
        setUpdatedCourse((course: any) => ({
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
                id: updatedCourse.id,
                title: updatedCourse.title,
                shortDescription: updatedCourse.shortDescription,
                description: updatedCourse.description,
                isActive: updatedCourse.isActive,
                image: updatedCourse.image || ""
            };

            const courseResponse = await updateCourse(req);
            const courseId = courseResponse.data.id;

            const lessonPromises = lessons.map(l => {
                const lessonReq = {
                    id: l.id,
                    courseId: courseId,
                    title: l.title!,
                    files: l.files!.map(f => ({ file: f.file }))
                };
                return updateLesson(lessonReq);
            });

            await Promise.all(lessonPromises);

            const quizReq = {
                title: quiz!.title,
                courseId: courseId,
                questions: quiz!.questions.map(q => ({
                    title: q.title,
                    questionTypeId: q.questionType.id,
                    answers: q.answers.map(a => ({
                        title: a.title,
                        isCorrect: a.isCorrect
                    }))
                }))
            };

            await updateQuiz(quizReq, quiz!.id);

            navigate("/my-courses");
        } catch (error) {
            console.error("Failed to save course:", error);
            alert("Failed to save course. Please try again.");
        }
    };
 
    const removeCourse = () => {
        deleteCourse(course.id).then(() => {
            navigate("/my-courses");
        })
    }
 
    const canSaveCourse = () => {
        if(updatedCourse.title &&
            updatedCourse.shortDescription &&
            updatedCourse.description &&
            lessons.length > 0 &&
            quiz) return true;

        return false;
    }

    return (<>
        {
            updatedCourse && 
            <div className="create-course-container">
                <div className="basic-info">
                    <div className="image-details">
                        <img src={updatedCourse.image || example}
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
                            {updatedCourse.image && <button onClick={removeImage}>Remove image</button>}
                        </div>
                    </div>
                    <input
                        className="title-input"
                        value={updatedCourse.title}
                        type="text"
                        placeholder="Title"
                        onChange={handleChange}
                        name="title"
                    />
                    <textarea
                        className="short-description-input"
                        value={updatedCourse.shortDescription}
                        placeholder="Short Description (Will be displayed in a list view)"
                        onChange={handleChange}
                        name="shortDescription"
                    />
                    <textarea
                        className="description-input"
                        value={updatedCourse.description}
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
                            { quiz && quiz.title !== "" ? "EDIT" : "CREATE"} QUIZ
                        </button>
                    </div>
                </div>
                <div className="add-section">
                    <button onClick={saveCourse} disabled={!canSaveCourse()}>SAVE COURSE</button>
                    <button onClick={removeCourse}>REMOVE</button>
                </div>
            </div>
        }
        {(quiz && isQuizBeingEdited) && (
            <div className="quiz-popup-overlay">
                <div className="quiz-popup-content" ref={popupRef}>
                <AddQuizPopup quiz={quiz} setQuiz={setQuiz} questionTypes={questionTypes} handleCloseQuiz={handleCloseQuiz}/>
                </div>
            </div>
        )}
    </>);
}