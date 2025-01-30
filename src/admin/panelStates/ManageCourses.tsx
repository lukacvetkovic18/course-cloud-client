import { useEffect, useRef, useState } from "react";
import { Course, User } from "../../utils/models";
import { getAllCourses } from "../../services/adminService";
import { ManageCourseCard } from "../cards/ManageCourseCard";
import { DeletePopup } from "../popups/DeletePopup";
import { getUsersByRole } from "../../services";
import { EditCoursePopup } from "../popups/EditCoursePopup";

export const ManageCourses = () => {
    let [courses, setCourses] = useState<Course[]>([]);
    let [instructors, setInstructors] = useState<User[]>([]);
    let [courseBeingEdited, setCourseBeingEdited] = useState<Course | null>(null);
    let [courseBeingDeleted, setCourseBeingDeleted] = useState<Course | null>(null);
    let [selectedInstrucorFilter, setSelectedInstrucorFilter] = useState<User>();
    let [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCourses();
        loadInstructors();
    }, []);

    const loadCourses = () => {
        getAllCourses().then(res => {
            setCourses(res.data);
        })
    }

    const loadInstructors = () => {
        getUsersByRole("instructor").then(res => {
            setInstructors(res.data);
        })
    }

    const handleEditClick = (course: Course) => {
        setCourseBeingEdited(course);
    }

    const closeEditPopup = () => {
        setCourseBeingEdited(null);
    }

    const handleDeleteClick = (course: Course) => {
        setCourseBeingDeleted(course);
    }

    const closeDeletePopup = () => {
        setCourseBeingDeleted(null);
    }

    const handleFilterByOwner = (e:any) => {
        setSelectedInstrucorFilter(e.target.value.toInt())
    }

    return (<>
        <div className="manage-container">
            <div className="subheader">
                <span className="subtitle">Courses</span>
                <button>ADD NEW COURSE</button>
            </div>
            <div className="filter-options">
                <select
                    name="ownerId"
                    value={selectedInstrucorFilter?.id || -1}
                    onChange={handleFilterByOwner}
                >
                    {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                            {instructor.firstName} {instructor.lastName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="courses-header">
                
            </div>
            <div className="items-container">
            {
                courses && courses.map(course => {
                    return <>
                        <ManageCourseCard key={course.id} course={course} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
                    </>
                })
            }
            </div>
        </div>
        {courseBeingEdited && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content" ref={popupRef}>
                    <EditCoursePopup course={courseBeingEdited} instructors={instructors} closeEditPopup={closeEditPopup}/>
                </div>
            </div>
        )}
        {courseBeingDeleted && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content" ref={popupRef}>
                    <DeletePopup item={courseBeingDeleted} closeDeletePopup={closeDeletePopup}/>
                </div>
            </div>
        )}
        </>);
}