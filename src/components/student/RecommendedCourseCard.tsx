import { useEffect, useState } from "react";
import example from "../../assets/example-button-speech-bubble-example-colorful-web-banner-illustration-vector.jpg"
import { Course, User } from "../../utils/models";
import { getOwnerOfCourse } from "../../services";

interface RecommendedCourseCardProps {
    course: Course;
}

export const RecommendedCourseCard = ({course}: RecommendedCourseCardProps) => {
    let [owner, setOwner] = useState<User>();
    
    useEffect(() => {
        loadOwner();
    }, [])


    const loadOwner = () => {
        getOwnerOfCourse(course.id).then(res => {
            setOwner(res.data);
        })
    }

    return (<>
        <div className="card-container">
            <img src={course.image || example}></img>
            <h3>{ course.title }</h3>
            {owner && <span className="author">By {owner.firstName + " " + owner.lastName}</span>}
        </div>
    </>);
}