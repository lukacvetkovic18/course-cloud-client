import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Course, Lesson, Quiz, User } from "../../utils/models";
import { getLoggedInUser } from "../../services";
import { Header } from "../../components/Header";
import example from "../../assets/add-image.png"
import { Footer } from "../../components/Footer";
import { LessonCard } from "../../components/LessonCard";

export const CreateCourse = () => {
    const navigate = useNavigate();

    let [courseData, setCourseData] = useState<{
        title: string;
        shortDescription: string;
        description: string;
        isActive: boolean;
        duration: number;
        image: string;
    }>({
        title: "",
        shortDescription: "",
        description: "",
        isActive: false,
        duration: 0,
        image: ""
    });
    let [user, setUser] = useState<User>();
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [quiz, setQuiz] = useState<Quiz>();
    let [isLessonBeingAdded, setIsLessonBeingAdded] = useState<boolean>(false);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
    }, []);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCourseData((uInfo: any) => ({
            ...uInfo,
            [name]: value
        }))
    }

    const addLesson = () => {
        setIsLessonBeingAdded(true);
    }

    const cancelAddLesson = () => {
        setIsLessonBeingAdded(false);
    }
 
    return (<>
        <Header user={user}></Header>
        <div className="create-course-container">
            <div className="subheader">
                <span className="subtitle">Create Course</span>
            </div>
            <div className="basic-info">
                <img src={courseData.image || example}/>
                <input
                    className="title-input"
                    value={courseData.title}
                    type="text"
                    placeholder="Title"
                    onChange={handleChange}
                    name="title"
                />
                <textarea
                    className="short-description-input"
                    value={courseData.shortDescription}
                    placeholder="Short Description (Will be displayed in a list view)"
                    onChange={handleChange}
                    name="shortDescription"
                />
                <textarea
                    className="description-input"
                    value={courseData.description}
                    placeholder="Description (Will be displayed in detailed view."
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
        </div>
        <Footer></Footer>
    </>);
}