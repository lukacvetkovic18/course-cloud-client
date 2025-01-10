import { useEffect, useRef, useState } from "react";
import example from "../assets/blank-profile-picture.png"
import instagramIcon from "../assets/instagram-icon.png"
import linkedInIcon from "../assets/linkedin-icon.png"
import emailIcon from "../assets/email-icon.png"
import phoneIcon from "../assets/phone-icon.png"
import locationIcon from "../assets/location-icon.png"
import dobIcon from "../assets/dob-icon.png"
import genderIcon from "../assets/gender-icon.png"
import { useNavigate, useParams } from "react-router";
import { Course, User } from "../utils/models";
import { getInstructorCourses, getLoggedInUser, getUserById } from "../services";
import { CourseCard, CoursePopup, Footer, Header } from "../components";
import { ViewProfile } from "../components/ViewProfile";

export const InstructorProfile = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadInstructor(parseInt(slug!));
        loadUser();
    }, [slug]);

    let [user, setUser] = useState<User>();
    let [instructor, setInstructor] = useState<User>();
    let [courses, setCourses] = useState<Course[]>([]);
    let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    let popupRef = useRef<HTMLDivElement>(null);

    // onDestroy()

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadInstructor = (instructorId: number) => {
        getUserById(instructorId).then(res => {
            setInstructor(res.data);
            loadCourses(instructorId);
        })
    }

    const loadCourses = (instructorId: number) => {
        getInstructorCourses(instructorId).then(res => {
            setCourses(res.data);
        })
    }

    const openInNewTab = (url: string) => {
        window.open(url, "_blank", "noreferrer");
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
        { instructor &&
            <div className="instructor-profile-container">
                <ViewProfile user={instructor}></ViewProfile>
                {/*<div className="instructor-info">
                    <img className="profile-picture"
                        src={example}
                        alt="User"
                    />
                    <div className="instructor-details">
                        <h3>{instructor.firstName} {instructor.lastName}</h3>
                        <div className="location-section">
                            <img className="icon" src={locationIcon} alt="Location"/>
                            <span>Osijek, Croatia</span>
                        </div>
                        <div className="social-section">
                            <img src={phoneIcon}
                                className="icon"
                                role="link"
                                onClick={() => window.location.href = `tel:${instructor.phoneNumber}0923453678`}
                                alt="Phone Number"
                            />
                            <img src={emailIcon}
                                className="icon"
                                role="link"
                                onClick={() => window.location.href = `mailto:${instructor.email}`}
                                alt="Email"
                            />
                            <img src={instagramIcon}
                                className="icon"
                                role="link"
                                onClick={() => openInNewTab("https://www.instagram.com/")}
                                alt="Instagram"
                            />
                            <img src={linkedInIcon}
                                className="icon"
                                role="link"
                                onClick={() => openInNewTab("https://www.linkedin.com/")}
                                alt="LinkedIn"
                            />
                        </div>
                    </div>
                    <div className="extended-instructor-details">
                        <h3>.</h3>
                        <div className="location-section">
                            <img className="icon" src={dobIcon} alt="Date of Birth"/>
                            <span>{"18. 02. 2002."}</span>
                        </div>
                        <div className="location-section">
                            <img className="icon" src={genderIcon} alt="Gender"/>
                            <span>{instructor.gender.charAt(0).toUpperCase() + instructor.gender.slice(1)}</span>
                        </div>
                    </div>
                </div>*/}
                <div className="subheader">
                    <span className="subtitle">{instructor.firstName}'s courses</span>
                </div>
                <div className="courses-container">
                {
                    courses && courses.map(course => {
                        return <>
                            <CourseCard course={course} handleCourseClick={handleCourseClick} />
                        </>
                    })
                }
                </div>
            </div>
        }
        <Footer/>
        {selectedCourse && (
            <div className="course-popup-overlay">
                <div className="course-popup-content" ref={popupRef}>
                    <CoursePopup course={selectedCourse}/>
                </div>
            </div>
        )}
    </>);
}