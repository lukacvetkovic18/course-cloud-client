import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Course, Lesson, Quiz, User } from "../../utils/models";
import { getCourseById, getLoggedInUser, isUserEnrolledInCourse, getLessonsByCourseId, getQuizById } from "../../services";
import { Header, Footer } from "../../components";
import example from "../../assets/example-button-speech-bubble-example-colorful-web-banner-illustration-vector.jpg"

export const ViewCourse1 = () => {
    const navigate = useNavigate();
    let [user, setUser] = useState<User>();
    let [courseId, setCourseId] = useState<number>(0);
    let [course, setCourse] = useState<Course>();
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [quiz, setQuiz] = useState<Quiz>();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        let id = localStorage.getItem("courseId");
        if(id === null) {
            navigate("/home");
        } else {
            setCourseId(parseInt(id));
        }
        loadUser();
        loadCourse();
        loadCourseLessons();
        loadQuiz();
        loadisUserEnrolledInCourse();
    }, []);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadCourse = () => {
        getCourseById(courseId).then(res => {
            setCourse(res.data);
        })
    }

    const loadCourseLessons = () => {
        getLessonsByCourseId(courseId).then(res => {
            setLessons(res.data);
            console.log(lessons);
        })
    }

    const loadisUserEnrolledInCourse = () => {
        isUserEnrolledInCourse(courseId).then(res => {
            if(!res.data) {
                navigate("/home");
            }
        })
    }

    const loadQuiz = () => {
        getQuizById(courseId).then(res => {
            setQuiz(res.data);
        })
    }
 
    return (<>
        <Header user={user}></Header>
        <div className="view-course-container">
            <img src={example}>
                <span>{course?.title}</span>
            </img>
            <span className="description">{course?.description}</span>
            <div className="lessons-container">
            {
                lessons && lessons.map(lesson => {
                    return <div className="lesson-item">
                        <div className="lesson-header">
                            <span>{lesson.title}</span>
                            <input
                                type="checkbox"
                            />
                        </div>
                        <div className="lesson-content">
                        </div>
                    </div>
                })
            }
            <div className="quiz-container">
                {quiz?.title}
            </div>
            </div>
        </div>
        <Footer></Footer>
    </>);
}