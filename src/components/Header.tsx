import { useState } from "react";
import "../styles"
import blank  from "../assets/blank-profile-picture.png"

export const Header = ({user}: any) => {

    let [searchText, setSearchText] = useState<string>("");
 
    const handleSearchChange = (e: any) => {
        setSearchText(e.target.value);
    }
 
    const handleSearchClick = () => {
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
                <button className="search-button" onClick={handleSearchClick}>Search</button>
            </div>
            <div className="right">
                {
                    user?.userRoles.map((uR:any) => uR.name).includes("student") ?
                    <span className="redirect-text">My Enrollments</span> :
                    <span style={{display:"none"}}></span>
                }
                {
                    user?.userRoles.map((uR:any) => uR.name).includes("instructor") ?
                    <span className="redirect-text">My Courses</span> :
                    <span style={{display:"none"}}></span>
                }
                <span className="user-name">{user?.firstName}</span>
                <img src={blank} className="profile-picture"/>
            </div>
        </div>
        </>);
}