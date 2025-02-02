import { useEffect, useRef, useState } from "react";
import { Course, Lesson } from "../../utils/models";
import { getAllCourses, getAllLessons } from "../../services/adminService";
import { DeletePopup } from "../popups/DeletePopup";
import { ManageLessonCard } from "../cards/ManageLessonCard";
import { EditLessonPopup } from "../popups/EditLessonPopup";
import { CreateLessonPopup } from "../popups/CreateLessonPopup";

export const ManageLessons = () => {
    let [lessons, setLessons] = useState<Lesson[]>([]);
    let [courses, setCourses] = useState<Course[]>([]);
    let [lessonBeingEdited, setLessonBeingEdited] = useState<Lesson | null>(null);
    let [lessonBeingDeleted, setLessonBeingDeleted] = useState<Lesson | null>(null);
    let [isLessonBeingCreated, setIsLessonBeingCreated] = useState<boolean>(false);
    let [selectedCourseFilter, setSelectedCourseFilter] = useState<number | null>(null);
    let [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
    let [searchText, setSearchText] = useState<string>("");
    let [sortColumn, setSortColumn] = useState<string | null>(null);
    let [sortOrder, setSortOrder] = useState<string>("asc");
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadLessons();
        loadCourses();
    }, []);

    useEffect(() => {
        loadLessons();
    }, [lessonBeingEdited === null, lessonBeingDeleted === null, isLessonBeingCreated]);

    useEffect(() => {
        filterAndSortLessons();
    }, [lessons, selectedCourseFilter, searchText, sortColumn, sortOrder]);

    const loadLessons = () => {
        getAllLessons().then(res => {
            setLessons(res.data);
        })
    }

    const loadCourses = () => {
        getAllCourses().then(res => {
            setCourses(res.data);
        })
    }

    const handleEditClick = (lesson: Lesson) => {
        setLessonBeingEdited(lesson);
    }

    const closeEditPopup = () => {
        setLessonBeingEdited(null);
    }

    const handleDeleteClick = (lesson: Lesson) => {
        setLessonBeingDeleted(lesson);
    }

    const closeDeletePopup = () => {
        setLessonBeingDeleted(null);
    }

    const handleCreateClick = () => {
        setIsLessonBeingCreated(true);
    }

    const closeCreatePopup = () => {
        setIsLessonBeingCreated(false);
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

    const filterAndSortLessons = () => {
        let filtered = lessons;

        if (selectedCourseFilter !== null) {
            filtered = filtered.filter(lesson => lesson.course && lesson.course.id === selectedCourseFilter);
        }

        if (searchText.trim()) {
            filtered = filtered.filter(lesson =>
                lesson.title.toLowerCase().includes(searchText.toLowerCase())
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

        setFilteredLessons(filtered);
    };

    return (<>
        <div className="manage-container">
            <div className="subheader">
                <span className="subtitle">Lessons</span>
                <button onClick={handleCreateClick}>ADD NEW LESSON</button>
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
                {filteredLessons.map(lesson => (
                    <ManageLessonCard key={lesson.id} lesson={lesson} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
                ))}
            </div>
        </div>
        {lessonBeingEdited && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content course-popup" ref={popupRef}>
                    <EditLessonPopup lesson={lessonBeingEdited} courses={courses} closeEditPopup={closeEditPopup}/>
                </div>
            </div>
        )}
        {lessonBeingDeleted && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content" ref={popupRef}>
                    <DeletePopup item={lessonBeingDeleted} closeDeletePopup={closeDeletePopup}/>
                </div>
            </div>
        )}
        {isLessonBeingCreated && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content course-popup" ref={popupRef}>
                    <CreateLessonPopup courses={courses} closeCreatePopup={closeCreatePopup}/>
                </div>
            </div>
        )}
        </>);
}