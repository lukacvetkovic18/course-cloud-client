import { useEffect, useRef, useState } from "react";
import example from "../assets/blank-profile-picture.png"
import instagramIcon from "../assets/instagram-icon.png"
import linkedInIcon from "../assets/linkedin-icon.png"
import emailIcon from "../assets/email-icon.png"
import phoneIcon from "../assets/phone-icon.png"
import locationIcon from "../assets/location-icon.png"
import dobIcon from "../assets/dob-icon.png"
import genderIcon from "../assets/gender-icon.png"

export const ChangePasswordPopup = ({user}: any) => {
    let [newPassword, setNewPassword] = useState<string>("");
    let [confirmPassword, setConfirmPassword] = useState<string>("");
 
    const handleNewPasswordChange = (e: any) => {
        setNewPassword(e.target.value);
    }
 
    const handleConfirmPasswordChange = (e: any) => {
        setConfirmPassword(e.target.value);
    }

    return (<>
        { user &&
            <div className="change-password-popup-container">
                <span>Change Your Password</span>
                <div className="input-container">
                    <span>New Password:</span>
                    <input
                        value={newPassword}
                        type="password"
                        onChange={handleNewPasswordChange}
                    />
                </div>
                <div className="input-container">
                    <span>Confirm Password:</span>
                    <input
                        value={confirmPassword}
                        type="password"
                        onChange={handleConfirmPasswordChange}
                    />
                    {
                        confirmPassword !== null && confirmPassword !== newPassword ?
                        <div className="error-message">
                            Passwords have to match!
                        </div>
                        :
                        <div style={{display: "none"}}></div>
                    }
                </div>
                <button>Save</button>
            </div>
        }
    </>);
}