import { useEffect, useState } from "react";
import example from "../assets/blank-profile-picture.png"
import instagramIcon from "../assets/instagram-icon.png"
import linkedInIcon from "../assets/linkedin-icon.png"
import emailIcon from "../assets/email-icon.png"
import phoneIcon from "../assets/phone-icon.png"
import locationIcon from "../assets/location-icon.png"
import { getLoggedInUser } from "../services";
import { useNavigate } from "react-router";

export const UserCard = ({user}: any) => {
    const navigate = useNavigate();
    let [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        loadLoggedInUser();
    }, [])

    const loadLoggedInUser = () => {
        getLoggedInUser().then(res => {
            setIsLoggedIn(res.data.id === user.id);
        })
    }

    const openInNewTab = (url: string) => {
        window.open(url, "_blank", "noreferrer");
    };

    const handleProfileClick = () => {
        // localStorage.setItem("instructorId", userId.toString());
        navigate(`/courses/${user.slug}`)
    }
    
    return (<>
        <div className="user-card-container">
            <div className="left">
                <img className="profile-picture"
                    src={user.profilePicture || example}
                    role="link"
                    onClick={() => handleProfileClick()}
                    alt="User"
                />
                <div className="instructor-details">
                    <h3>{user.firstName} {user.lastName}</h3>
                    <div className="location-section">
                        <img className="icon" src={locationIcon} alt="Location"/>
                        <span>{user.address ? user.address : "No location"}</span>
                    </div>
                    <div className="social-section">
                        {user.phoneNumber && <img src={phoneIcon}
                            className="icon"
                            role="link"
                            onClick={() => window.location.href = `tel:${user.phoneNumber}`}
                            alt="Phone Number"
                        />}
                        <img src={emailIcon}
                            className="icon"
                            role="link"
                            onClick={() => window.location.href = `mailto:${user.email}`}
                            alt="Email"
                        />
                        {user.instagram && <img src={instagramIcon}
                            className="icon"
                            role="link"
                            onClick={() => openInNewTab(user.instagram)}
                            alt="Instagram"
                        />}
                        {user.linkedIn && <img src={linkedInIcon}
                            className="icon"
                            role="link"
                            onClick={() => openInNewTab(user.linkedIn)}
                            alt="LinkedIn"
                        />}
                    </div>
                </div>
            </div>
            {
                isLoggedIn && <div className="right">
                    <button onClick={() => navigate("/my-profile")}>Manage</button>
                </div>
            }
        </div>
    </>);
}