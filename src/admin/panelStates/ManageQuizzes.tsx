import { useEffect, useRef, useState } from "react";
import { Course, QuestionType, Quiz } from "../../utils/models";
import { getAllCourses, getAllQuizzes } from "../../services/adminService";
import { DeletePopup } from "../popups/DeletePopup";
import { ManageQuizCard } from "../cards/ManageQuizCard";
import { EditQuizPopup } from "../popups/EditQuizPopup";
import { getAllQuestionTypes } from "../../services/questionService";
import { CreateQuizPopup } from "../popups/CreateQuizPopup";

export const ManageQuizzes = () => {
    let [quizzes, setQuizzes] = useState<Quiz[]>([]);
    let [courses, setCourses] = useState<Course[]>([]);
    let [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
    let [quizBeingEdited, setQuizBeingEdited] = useState<Quiz | null>(null);
    let [quizBeingDeleted, setQuizBeingDeleted] = useState<Quiz | null>(null);
    let [isQuizBeingCreated, setIsQuizBeingCreated] = useState<boolean>(false);
    let [selectedCourseFilter, setSelectedCourseFilter] = useState<number | null>(null);
    let [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
    let [searchText, setSearchText] = useState<string>("");
    let [sortColumn, setSortColumn] = useState<string | null>(null);
    let [sortOrder, setSortOrder] = useState<string>("asc");
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadQuizzes();
        loadCourses();
        loadQuestionTypes();
    }, []);

    useEffect(() => {
        loadQuizzes();
    }, [quizBeingEdited === null, quizBeingDeleted === null, isQuizBeingCreated]);

    useEffect(() => {
        filterAndSortQuizzes();
    }, [quizzes, selectedCourseFilter, searchText, sortColumn, sortOrder]);

    const loadQuizzes = () => {
        getAllQuizzes().then(res => {
            setQuizzes(res.data);
        })
    }

    const loadCourses = () => {
        getAllCourses().then(res => {
            setCourses(res.data);
        })
    }

    const loadQuestionTypes = () => {
        getAllQuestionTypes().then(res => {
            setQuestionTypes(res.data);
        })
    }

    const handleEditClick = (quiz: Quiz) => {
        setQuizBeingEdited(quiz);
    }

    const closeEditPopup = () => {
        setQuizBeingEdited(null);
    }

    const handleDeleteClick = (quiz: Quiz) => {
        setQuizBeingDeleted(quiz);
    }

    const closeDeletePopup = () => {
        setQuizBeingDeleted(null);
    }

    const handleCreateClick = () => {
        setIsQuizBeingCreated(true);
    }

    const closeCreatePopup = () => {
        setIsQuizBeingCreated(false);
    }

    const handleFilterByCourse = (e: any) => {
        const value = e.target.value !== "-1" ? parseInt(e.target.value) : null;
        setSelectedCourseFilter(value);
    };

    const handleSearchChange = (e: any) => {
        setSearchText(e.target.value);
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    const filterAndSortQuizzes = () => {
        let filtered = quizzes;

        if (selectedCourseFilter !== null) {
            filtered = filtered.filter(quiz => quiz.course && quiz.course.id === selectedCourseFilter);
        }

        if (searchText.trim()) {
            filtered = filtered.filter(quiz =>
                quiz.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (sortColumn) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;
                if (sortColumn === "course") {
                    aValue = a.course ? a.course.title.toLowerCase() : "";
                    bValue = b.course ? b.course.title.toLowerCase() : "";
                } else if (sortColumn === "title" || sortColumn === "createdAt") {
                    aValue = a[sortColumn];
                    bValue = b[sortColumn];
                }

                if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }

        setFilteredQuizzes(filtered);
    };

    return (<>
        <div className="manage-container">
            <div className="subheader">
                <span className="subtitle">Quizzes</span>
                <button onClick={handleCreateClick}>ADD NEW QUIZ</button>
            </div>
            <div className="filter-options">
                <input
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Search by Title"
                />
                <select
                    name="courseId"
                    value={selectedCourseFilter ?? -1}
                    onChange={handleFilterByCourse}
                >
                    <option value={-1}>
                        All Courses
                    </option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>
            <div className="items-header">
                    <span onClick={() => handleSort("title")}>
                        Title {sortColumn === "title" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
                    <span onClick={() => handleSort("course")}>
                        Course {sortColumn === "course" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
                    <span onClick={() => handleSort("createdAt")}>
                        Created {sortColumn === "createdAt" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
            </div>
            <div className="items-container">
                {filteredQuizzes.map(quiz => (
                    <ManageQuizCard key={quiz.id} quiz={quiz} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
                ))}
            </div>
        </div>
        {quizBeingEdited && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content course-popup" ref={popupRef}>
                    <EditQuizPopup quiz={quizBeingEdited} questionTypes={questionTypes} closeEditPopup={closeEditPopup}/>
                </div>
            </div>
        )}
        {quizBeingDeleted && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content" ref={popupRef}>
                    <DeletePopup item={quizBeingDeleted} closeDeletePopup={closeDeletePopup}/>
                </div>
            </div>
        )}
        {isQuizBeingCreated && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content course-popup" ref={popupRef}>
                    <CreateQuizPopup questionTypes={questionTypes} closeCreatePopup={closeCreatePopup}/>
                </div>
            </div>
        )}
        </>);
}