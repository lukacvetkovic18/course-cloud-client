import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Course, Lesson, Quiz, User } from "../../utils/models";
import { getLoggedInUser } from "../../services";
import { Header } from "../../components/Header";
import example from "../../assets/add-image.png"
import { Footer } from "../../components/Footer";
import { LessonCard } from "../../components/LessonCard";
import { createEmptyCourse } from "../../services/courseService";

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
    let [quiz, setQuiz] = useState<Quiz>();
    let [isLessonBeingAdded, setIsLessonBeingAdded] = useState<boolean>(false);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        createNewLesoon();
    }, []);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const createNewLesoon = () => {
        createEmptyCourse().then(res => {
            setNewCourse(res.data)
        })
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewCourse((uInfo: any) => ({
            ...uInfo,
            [name]: value
        }))
    }

    const addLesson = () => {
        setIsLessonBeingAdded(true);
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
                    <span>Lessons</span>
                    <div className="lessons-container">
                        {
                            lessons && lessons.map(lesson => {
                                return <LessonCard
                                    lesson={lesson}
                                    setLessons={setLessons}
                                    isCreateMode={true}
                                    key={lesson.id}
                                ></LessonCard>
                            })
                        }
                        {
                            !isLessonBeingAdded && <button onClick={addLesson}>+</button>
                        }
                        {
                            isLessonBeingAdded && <LessonCard
                                lesson={null}
                                setLessons={setLessons}
                                isCreateMode={true}
                                isLessonBeingAdded={isLessonBeingAdded}
                                setIsLessonBeingAdded={setIsLessonBeingAdded}
                            ></LessonCard>
                        }
                    </div>
    
                </div>
                <div className="quiz-info">
                    <span>Quiz</span>
                    <div className="quiz-container">
                    </div>
                </div>
    
                <div className="add-section">
                    <button>ADD COURSE</button>
                </div>
            </div>
        }
        <Footer></Footer>
    </>);
}