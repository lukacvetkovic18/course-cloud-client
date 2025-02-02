import { useEffect, useRef, useState } from "react";
import { Course, User } from "../../utils/models";
import { getAllCourses } from "../../services/adminService";
import { ManageCourseCard } from "../cards/ManageCourseCard";
import { DeletePopup } from "../popups/DeletePopup";
import { getUsersByRole } from "../../services";
import { EditCoursePopup } from "../popups/EditCoursePopup";
import { CreateCoursePopup } from "../popups/CreateCoursePopup";

export const ManageCourses = () => {
    let [courses, setCourses] = useState<Course[]>([]);
    let [instructors, setInstructors] = useState<User[]>([]);
    let [courseBeingEdited, setCourseBeingEdited] = useState<Course | null>(null);
    let [courseBeingDeleted, setCourseBeingDeleted] = useState<Course | null>(null);
    let [isCourseBeingCreated, setIsCourseBeingCreated] = useState<boolean>(false);
    let [selectedInstructorFilter, setSelectedInstructorFilter] = useState<number | null>(null);
    let [selectedStatusFilter, setSelectedStatusFilter] = useState<number | null>(null);
    let [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    let [searchText, setSearchText] = useState<string>("");
    let [sortColumn, setSortColumn] = useState<string | null>(null);
    let [sortOrder, setSortOrder] = useState<string>("asc");
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCourses();
        loadInstructors();
    }, []);

    useEffect(() => {
        loadCourses();
    }, [courseBeingEdited === null, courseBeingDeleted === null, isCourseBeingCreated]);

    useEffect(() => {
        filterAndSortCourses();
    }, [courses, selectedInstructorFilter, selectedStatusFilter, searchText, sortColumn, sortOrder]);


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

    const handleCreateClick = () => {
        setIsCourseBeingCreated(true);
    }

    const closeCreatePopup = () => {
        setIsCourseBeingCreated(false);
    }

    const handleFilterByInstructor = (e: any) => {
        const value = e.target.value !== "-1" ? parseInt(e.target.value) : null;
        setSelectedInstructorFilter(value);
    };

    const handleFilterByStatus = (e: any) => {
        const value = e.target.value !== "0" ? parseInt(e.target.value) : null;
        setSelectedStatusFilter(value);
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

    const filterAndSortCourses = () => {
        let filtered = courses;

        if (selectedInstructorFilter !== null) {
            filtered = filtered.filter(course => course.owner && course.owner.id === selectedInstructorFilter);
        }

        if (selectedStatusFilter !== null) {
            const isActive = selectedStatusFilter === 1;
            filtered = filtered.filter(course => course.isActive === isActive);
        }

        if (searchText.trim()) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchText.toLowerCase()) ||
                (course.owner && (course.owner.firstName + " " + course.owner.lastName).toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        if (sortColumn) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;
                if (sortColumn === "owner") {
                    aValue = a.owner ? (a.owner.firstName + " " + a.owner.lastName).toLowerCase() : "";
                    bValue = b.owner ? (b.owner.firstName + " " + b.owner.lastName).toLowerCase() : "";
                } else if (sortColumn === "title" || sortColumn === "createdAt" || sortColumn === "isActive") {
                    aValue = a[sortColumn];
                    bValue = b[sortColumn];
                }

                if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }

        setFilteredCourses(filtered);
    };

    return (<>
        <div className="manage-container">
            <div className="subheader">
                <span className="subtitle">Courses</span>
                <button onClick={handleCreateClick}>ADD NEW COURSE</button>
            </div>
            <div className="filter-options">
                <input
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Search by Name or Email"
                />
                {/* <button className="search-button" onClick={filterCourses} disabled={searchText === ""}>Search</button> */}
                <select
                    name="ownerId"
                    value={selectedInstructorFilter ?? -1}
                    onChange={handleFilterByInstructor}
                >
                    <option value={-1}>
                        All Instructors
                    </option>
                    {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                            {instructor.firstName} {instructor.lastName}
                        </option>
                    ))}
                </select>
                <select
                    name="isActive"
                    value={selectedStatusFilter ?? 0}
                    onChange={handleFilterByStatus}
                >
                    <option value={0}>
                        All Statuses
                    </option>
                    <option value={1}>
                        Active
                    </option>
                    <option value={2}>
                        Disabled
                    </option>
                </select>
            </div>
            <div className="items-header">
                    <span onClick={() => handleSort("title")}>
                        Title {sortColumn === "title" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
                    <span onClick={() => handleSort("owner")}>
                        Owner {sortColumn === "owner" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
                    <span onClick={() => handleSort("createdAt")}>
                        Created {sortColumn === "createdAt" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
                    <span onClick={() => handleSort("isActive")}>
                        Status {sortColumn === "isActive" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
            </div>
            <div className="items-container">
                {filteredCourses.map(course => (
                    <ManageCourseCard key={course.id} course={course} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
                ))}
            </div>
        </div>
        {courseBeingEdited && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content course-popup" ref={popupRef}>
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
        {isCourseBeingCreated && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content course-popup" ref={popupRef}>
                    <CreateCoursePopup instructors={instructors} closeCreatePopup={closeCreatePopup}/>
                </div>
            </div>
        )}
        </>);
}