import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Course, User } from '../utils/models';
import { getInstructorSearchResults, getLoggedInUser } from '../services/userService';
import { useNavigate } from 'react-router';
import { getCourseSearchResults } from '../services/courseService';
import { CourseCard, CoursePopup, Footer, Header, UserCard } from '../components';

const SearchResults = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let queryParams = new URLSearchParams(location.search);
    let searchText = queryParams.get('query');

    let [user, setUser] = useState<User>();
    let [instructorResults, setInstructorsResults] = useState<User[]>([]);
    let [courseResults, setCourseResults] = useState<Course[]>([]);
    let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        if (searchText) {
            loadInstructorResults(searchText);
            loadCourseResults(searchText);
        }
    }, [])

    useEffect(() => {
        if (searchText) {
            loadInstructorResults(searchText);
            loadCourseResults(searchText);
        }
    }, [searchText]);

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadInstructorResults = async (query: any) => {
        getInstructorSearchResults(query).then(res => {
            setInstructorsResults(res.data);
        })
    };

    const loadCourseResults = async (query: any) => {
        getCourseSearchResults(query).then(res => {
            setCourseResults(res.data);
        })
    };

    const handleCourseClick = (course: Course) => {
        setSelectedCourse(course);
    }

    const handleClosePopup = () => {
        setSelectedCourse(null);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            handleClosePopup();
        }
    }

    useEffect(() => {
        if (selectedCourse) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [selectedCourse]);

    return (<>
        <Header user={user}></Header>
        <div className="search-results-container">
            <div className="subheader">
                <span className="subtitle">Search Results for "{searchText}"</span>
            </div>
            <div className="all-instructors-container">
                <div className="subheader">
                    <span className="subtitle">Instructors</span>
                </div>
                <div className="instructors-container">
                    {
                        instructorResults && instructorResults.map(instructor => {
                            return <>
                                <UserCard user={instructor}/>
                            </>
                        })
                    }
                </div>
            </div>
            <div className="my-courses-container">
                <div className="subheader">
                    <span className="subtitle">Courses</span>
                </div>
                <div className="courses-container">
                    {
                        courseResults && courseResults.map(course => {
                            return <>
                                <CourseCard course={course} handleCourseClick={handleCourseClick} />
                            </>
                        })
                    }
                </div>
            </div>
        </div>
        <Footer />
        {selectedCourse && (
            <div className="course-popup-overlay">
                <div className="course-popup-content" ref={popupRef}>
                    <CoursePopup course={selectedCourse}/>
                </div>
            </div>
        )}
    </>);
};

export default SearchResults;