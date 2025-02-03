import { useNavigate } from "react-router";
import { enrollToCourse } from "../../services/courseService";
import { Course } from "../../utils/models";

interface EnrollPopupProps {
    course: Course;
    handleClosePopup: () => void;
}

export const EnrollPopup = ({course, handleClosePopup}: EnrollPopupProps) => {
    const navigate = useNavigate();
    
    const enroll = () => {
        enrollToCourse(course.id).then(() => {
            navigate(`/courses/${course.slug}`)
        })
    };

    return (<>
        <div className="delete-popup-container">
            <div className="warning-text">
                <span>
                    Are you sure that you want to enroll to Course with name {course.title}?
                </span>
            </div>
            <div className="buttons">
                <button onClick={enroll}>PROCEED</button>
                <button onClick={handleClosePopup}>CANCEL</button>
            </div>
        </div>
    </>);
}