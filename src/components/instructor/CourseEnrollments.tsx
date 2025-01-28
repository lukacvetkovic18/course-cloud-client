import { useEffect, useRef, useState } from "react";
import { Course, QuizAttempt, User } from "../../utils/models";
import { getQuizAttemptsByCourseId, getUserAttempts } from "../../services/quizAttemptService";
import { getUsersByRole } from "../../services";
import { getStudentsInCourse } from "../../services/courseService";
import { ViewProfile } from "../ViewProfile";
import { QuizAttemptCard } from "../student/QuizAttemptCard";
import { CourseEnrollmentCard } from "./CourseEnrollmentCard";
import { ReviewQuizResultPopup } from "../student/ReviewQuizResultPopup";

interface CourseEnrollmentsProps {
    course: Course;
}

export const CourseEnrollments = ({ course }: CourseEnrollmentsProps) => {
    let [students, setStudents] = useState<User[]>();
    let [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>();
    let [selectedStudent, setSelectedStudent] = useState<User | null>(null);
    let [selectedQuizAttempt, setSelectedQuizAttempt] = useState<QuizAttempt | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadStudents();
        loadUserAttempts();
    }, [])

    const loadStudents= () => {
        getStudentsInCourse(course.id).then(res => {
            setStudents(res.data);
        })
    }

    const loadUserAttempts = () => {
        getQuizAttemptsByCourseId(course.id).then(res => {
            setQuizAttempts(res.data);
        })
    }

    const handleAttemptClick = (quizAttempt: QuizAttempt) => {
        setSelectedQuizAttempt(quizAttempt);
    }

    const handleUserClick = (user: User) => {
        setSelectedStudent(user);
    }

    const handleClosePopup = () => {
        setSelectedQuizAttempt(null);
        setSelectedStudent(null);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            handleClosePopup();
        }
    }

    useEffect(() => {
        if (selectedQuizAttempt || selectedStudent) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [selectedQuizAttempt, selectedStudent]);

    return (<>
        <div className="my-quiz-results-container">
        {
            (students && students.length > 0 && quizAttempts) && students.map(student => {
                return <>
                    <CourseEnrollmentCard user={student} quizAttempt={quizAttempts.find(qa => qa.user.id === student.id)!} handleUserClick={handleUserClick} handleAttemptClick={handleAttemptClick} />
                </>
            })
        }
        </div>
        {selectedQuizAttempt && (
            <div className="quiz-result-popup-overlay">
                <div className="quiz-result-popup-content" ref={popupRef}>
                    <ReviewQuizResultPopup quizAttempt={selectedQuizAttempt}/>
                </div>
            </div>
        )}
        {selectedStudent && (
            <div className="student-popup-overlay">
                <div className="student-popup-content" ref={popupRef}>
                    <ViewProfile user={selectedStudent}/>
                </div>
            </div>
        )}
    </>);
}