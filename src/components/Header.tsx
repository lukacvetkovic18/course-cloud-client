import { useState } from "react";
import "../styles"
import blank  from "../assets/blank-profile-picture.png"
import { useNavigate } from "react-router";

export const Header = ({user}: any) => {
    const navigate = useNavigate();

    let [searchText, setSearchText] = useState<string>("");
 
    const handleSearchChange = (e: any) => {
        setSearchText(e.target.value);
    }
 
    const handleSearchClick = () => {
        if (searchText.trim()) {
            navigate(`/search-results?query=${encodeURIComponent(searchText)}`);
        }
    }

    return (<>
        <div className="header-container">
            <div className="left">
                <span className="title">CourseCloud</span>
                <input
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Search for anything"
                />
                <button className="search-button" onClick={handleSearchClick} disabled={searchText === ""}>Search</button>
            </div>
            <div className="right">
                {
                    user?.userRoles.map((uR:any) => uR.name).includes("student") &&
                    <span className="redirect-text" onClick={() => navigate("/my-enrollments")}>My Enrollments</span>
                }
                {
                    user?.userRoles.map((uR:any) => uR.name).includes("instructor") &&
                    <span className="redirect-text" onClick={() => navigate("/my-courses")}>My Courses</span>
                }
                <span className="user-name">{user?.firstName}</span>
                <img src={user?.profilePicture || blank} className="profile-picture" onClick={() => navigate("/my-profile")}/>
            </div>
        </div>
        </>);
}