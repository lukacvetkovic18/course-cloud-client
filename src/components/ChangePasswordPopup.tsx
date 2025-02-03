import { useState } from "react";

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