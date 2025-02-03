import example from "../assets/blank-profile-picture.png"
import instagramIcon from "../assets/instagram-icon.png"
import linkedInIcon from "../assets/linkedin-icon.png"
import emailIcon from "../assets/email-icon.png"
import phoneIcon from "../assets/phone-icon.png"
import locationIcon from "../assets/location-icon.png"
import dobIcon from "../assets/dob-icon.png"
import genderIcon from "../assets/gender-icon.png"
import { User } from "../utils/models";

interface ViewProfileProps {
    user: User;
}

export const ViewProfile = ({user}: ViewProfileProps) => {
    const openInNewTab = (url: string) => {
        window.open(url, "_blank", "noreferrer");
    };

    return (<>
        { user &&
            <div className="view-profile-container">
                    <img className="profile-picture"
                        src={user.profilePicture || example}
                        alt="User"
                    />
                    <div className="profile-details">
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
                    <div className="extended-profile-details">
                        <h3>.</h3>
                        <div className="location-section">
                            <img className="icon" src={dobIcon} alt="Date of Birth"/>
                            <span>{"18. 02. 2002."}</span>
                        </div>
                        <div className="location-section">
                            <img className="icon" src={genderIcon} alt="Gender"/>
                            <span>{user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</span>
                        </div>
                    </div>
            </div>
        }
    </>);
}