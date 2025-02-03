import { useEffect, useState } from "react";
import "../styles"
import blank  from "../assets/blank-profile-picture.png"
import adminIcon  from "../assets/admin-header-icon.png"
import { useNavigate } from "react-router";
import { isUserAdmin } from "../services/userService";

export const Header = ({user}: any) => {
    const navigate = useNavigate();

    let [searchText, setSearchText] = useState<string>("");
    let [isAdmin, setIsAdmin] = useState<boolean>(false);
 
    const handleSearchChange = (e: any) => {
        setSearchText(e.target.value);
    }
 
    const handleSearchClick = () => {
        if (searchText.trim()) {
            navigate(`/search-results?query=${encodeURIComponent(searchText)}`);
        }
    }
    useEffect(() => {
        isUserAdmin().then(res=> {
            setIsAdmin(res.data);
        })
    }, []);

    return (<>
        <div className="header-container">
            <div className="left">
                <span className="title" onClick={() => navigate("/home")}>CourseCloud</span>
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
                {isAdmin && <img src={adminIcon} className="switch-icon" onClick={() => navigate("/admin")}/>}
                <span className="user-name">{user?.firstName}</span>
                <img src={user?.profilePicture || blank} className="profile-picture" onClick={() => navigate("/my-profile")}/>
            </div>
        </div>
        </>);
}