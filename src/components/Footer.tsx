import { useNavigate } from "react-router";

export const Footer = () => {
    const navigate = useNavigate();
    return (<>
        <div className="footer-container">
            <button onClick={() => navigate("/instructors")}>View All Instructors</button>
            <button onClick={() => navigate("/courses")}>View All Courses</button>
        </div>
    </>);
}