import example from "../../assets/no-image.png"
import { Course } from "../../utils/models";

interface RecommendedCourseCardProps {
    course: Course;
    handleCourseClick: (course: Course) => void
}

export const RecommendedCourseCard = ({course, handleCourseClick}: RecommendedCourseCardProps) => {
    return (<>
        <div className="card-container" onClick={() => handleCourseClick(course)}>
            <img src={course.image || example}></img>
            <h3>{ course.title }</h3>
            {course.owner && <span className="author">By {course.owner.firstName + " " + course.owner.lastName}</span>}
        </div>
    </>);
}