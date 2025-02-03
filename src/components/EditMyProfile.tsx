import { useEffect, useRef, useState } from "react";
import example from "../assets/blank-profile-picture.png"
import DatePicker from "react-datepicker";
import { User, UserRole } from "../utils/models";
import { getUserRoles, updateUser } from "../services";
import { ChangePasswordPopup } from "./ChangePasswordPopup";
import { MyProfileState } from "../pages/MyProfile";

interface EditMyProfileProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    setProfileState: React.Dispatch<React.SetStateAction<MyProfileState>>
}

export const EditMyProfile = ({user, setUser, setProfileState}: EditMyProfileProps) => {
    let [updatedUser, setUpdatedUser] = useState<User>(user);
    let [userRoles, setUserRoles] = useState<UserRole[]>([]);
    let [originalUser, setOriginalUser] = useState<User>();
    let [isPasswordPopupOpened, setIsPasswordPopupOpened] = useState<boolean>(false);
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadUserRoles();
        setOriginalUser(user);
    }, [])

    const loadUserRoles = () => {
        getUserRoles().then(res => {
            setUserRoles(res.data)
        })
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUpdatedUser((uInfo: any) => ({
            ...uInfo,
            [name]: value
        }))
    }

    const handleRoleChange = (e: any) => {
        const selectedRoleId = parseInt(e.target.value);
        if (selectedRoleId === -1) {
            // "All User Roles" selected
            setUpdatedUser((userInfo: any) => ({
                ...userInfo,
                userRoles: userRoles
            }));
        } else {
            const selectedRole = userRoles.find(role => role.id === selectedRoleId) || null;
            setUpdatedUser((userInfo: any) => ({
                ...userInfo,
                userRoles: selectedRole ? [selectedRole] : []
            }));
        }
    };

    const handleDateChange = (date: Date) => {
        setUpdatedUser((uInfo: any) => ({
            ...uInfo,
            dateOfBirth: date
        }))
    }

    const handleGenderChange = (e: any) => {
        const { value } = e.target;
        setUpdatedUser((userInfo: any) => ({
            ...userInfo,
            gender: value
        }));
    };

    const saveUser = () => {
        const req = {
            id: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            password: updatedUser.password,
            dateOfBirth: updatedUser.dateOfBirth,
            gender: updatedUser.gender,
            address:  updatedUser.address,
            isActive: updatedUser.isActive,
            profilePicture: updatedUser.profilePicture ,
            phoneNumber: updatedUser.phoneNumber,
            instagram: updatedUser.instagram,
            linkedIn: updatedUser.linkedIn,
            userRoleIds: updatedUser.userRoles.map(r => r.id)
        }
        console.log(req);
        updateUser(req).then(() => {
            setUser(updatedUser);
            setProfileState(MyProfileState.VIEW);
        })
    }

    const canSaveUser = () => {
        if(updatedUser.firstName &&
            updatedUser.lastName &&
            updatedUser.email &&
            updatedUser.dateOfBirth &&
            updatedUser.gender &&
            updatedUser.userRoles.length > 0) return true;

        return false;
    }

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = new Image();
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const size = Math.min(image.width, image.height);
                        const offsetX = (image.width - size) / 2;
                        const offsetY = (image.height - size) / 2;
                        canvas.width = size;
                        canvas.height = size;
                        ctx.drawImage(image, offsetX, offsetY, size, size, 0, 0, size, size);
                        const base64Image = canvas.toDataURL('image/png');
                        setUpdatedUser((uInfo: any) => ({
                            ...uInfo,
                            profilePicture: base64Image
                        }));
                    }
                };
                image.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfilePicture = () => {
        setUpdatedUser((uInfo: any) => ({
            ...uInfo,
            profilePicture: null
        }));
    };

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };

    const handlePasswordClick = () => {
        setIsPasswordPopupOpened(true);
    }

    const handleClosePopup = () => {
        setIsPasswordPopupOpened(false);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            handleClosePopup();
        }
    }

    useEffect(() => {
        if (isPasswordPopupOpened) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isPasswordPopupOpened]);

    return (<>
        { updatedUser &&
            <div className="edit-profile-container">
                <div className="upper-section">
                    <div className="image-details">
                        <img className="profile-picture"
                            src={updatedUser.profilePicture || example}
                            alt="User"
                            onClick={triggerFileInput}
                        />
                        <div>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button onClick={triggerFileInput}>Upload image</button>
                            {updatedUser.profilePicture && <button onClick={removeProfilePicture}>Remove image</button>}
                        </div>
                    </div>
                    <div className="profile-details">
                        <div className="input-container">
                            <span>First Name:</span>
                            <input
                                value={updatedUser.firstName}
                                type="text"
                                onChange={handleChange}
                                name="firstName"
                            />
                        </div>
                        <div className="input-container">
                            <span>Last Name:</span>
                            <input
                                value={updatedUser.lastName}
                                type="text"
                                onChange={handleChange}
                                name="lastName"
                            />
                        </div>
                        <div className="input-container">
                            <span>Email:</span>
                            <input
                                value={updatedUser.email}
                                type="email"
                                onChange={handleChange}
                                name="email"
                            />
                        </div>
                        <span onClick={handlePasswordClick}>Change Password</span>
                    </div>
                </div>
                <div className="lower-section">
                    <div className="profile-details">
                        <div className="input-container">
                            <span>Phone Number:</span>
                            <input
                                value={updatedUser.phoneNumber}
                                type="text"
                                onChange={handleChange}
                                name="phoneNumber"
                            />
                        </div>
                        <div className="input-container">
                            <span>Location:</span>
                            <input
                                value={updatedUser.address}
                                type="text"
                                onChange={handleChange}
                                name="address"
                            />
                        </div>
                        <div className="input-container">
                            <span>Instagram:</span>
                            <input
                                value={updatedUser.instagram}
                                type="text"
                                onChange={handleChange}
                                name="instagram"
                            />
                        </div>
                        <div className="input-container">
                            <span>LinkedIn:</span>
                            <input
                                value={updatedUser.linkedIn}
                                type="text"
                                onChange={handleChange}
                                name="linkedIn"
                            />
                        </div>
                    </div>
                    <div className="profile-details">
                        <div className="input-container">
                            <span>Date of Birth:</span>
                            <DatePicker
                                wrapperClassName="datePicker"
                                selected={updatedUser.dateOfBirth}
                                onChange={(date) => date ? handleDateChange(date) : console.log("No date selected")}
                                name="dateOfBirth"
                            />
                        </div>
                        <div className="input-container">
                            <span>Gender:</span>
                            <form>
                                <label className="radio">
                                    <input type="radio" value="male"
                                        checked={updatedUser.gender === "male"} 
                                        onChange={handleGenderChange} />
                                    Male
                                </label>
                                <label className="radio">
                                    <input type="radio" value="female"
                                        checked={updatedUser.gender === "female"} 
                                        onChange={handleGenderChange} />
                                    Female
                                </label>
                                <label className="radio">
                                    <input type="radio" value="other"
                                        checked={updatedUser.gender === "other"} 
                                        onChange={handleGenderChange} />
                                    Other
                                </label>
                            </form>
                        </div>
                        <div className="input-container">
                            <span>Role(s):</span>
                                <select
                                    name="userRoles"
                                    value={updatedUser.userRoles.map(role => role.id).length > 1 ? -1 : updatedUser.userRoles[0].id}
                                    onChange={handleRoleChange}
                                >
                                    <option value={-1}>All User Roles</option>
                                    {userRoles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                        </option>
                                    ))}
                                </select>
                        </div>
                    </div>
                </div>
                <button onClick={saveUser} disabled={!canSaveUser()}>Save Changes</button>
            </div>
        }
        {isPasswordPopupOpened && (
            <div className="change-password-popup-overlay">
                <div className="change-password-popup-content" ref={popupRef}>
                    <ChangePasswordPopup user={originalUser}/>
                </div>
            </div>
        )}
    </>);
}