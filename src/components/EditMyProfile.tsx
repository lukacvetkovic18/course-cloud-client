import { useEffect, useRef, useState } from "react";
import example from "../assets/blank-profile-picture.png"
import DatePicker from "react-datepicker";
import { User, UserRole } from "../utils/models";
import { getUserRoles, updateUser } from "../services";
import { useNavigate } from "react-router";
import { ChangePasswordPopup } from "./ChangePasswordPopup";

export const EditMyProfile = ({user, setUser}: any) => {
    const navigate = useNavigate();

    let [userRoles, setUserRoles] = useState<UserRole[]>([]);
    let [selectedGender, setSelectedGender] = useState<string>(user.gender || "");
    let [selectedUserRole, setSelectedUserRole] = useState<number>(-1);
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
        if(!userRoles.find(uR => uR.id === 1000)) {
            userRoles.push({
                id: 1000,
                name: "All roles"
            })
        }
        if(user.userRoles.includes(userRoles.find(uR => uR.name === "student")) && user.userRoles.includes(userRoles.find(uR => uR.name === "instructor"))) {
            setSelectedUserRole(1000)
        } else if (user.userRoles.includes(userRoles.find(uR => uR.name === "student"))) {
            setSelectedUserRole(1);
        } else {
            setSelectedUserRole(2);
        }
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUser((uInfo: any) => ({
            ...uInfo,
            [name]: value
        }))
    }

    const handleDateChange = (date: Date) => {
        setUser((uInfo: any) => ({
            ...uInfo,
            dateOfBirth: date
        }))
    }

    const handleGenderChange = (e: any) => {
        setSelectedGender(e.target.value);
    }

    const handleRolesChange = (e: any) => {
        userRoles.find((uR: UserRole) => uR.id === +(e.target.value))
        setSelectedUserRole(+(e.target.value));
    }

    const detectChanges = () => {
        const changes: any = {};
        let temp: any = originalUser;
        for (const key in originalUser) {
            if (user[key] !== temp[key]) {
                changes[key] = user[key];
            }
            if (selectedGender !== originalUser["gender"]) {
                changes["gender"] = selectedGender;
            }
            let roleIds: number[] = [];
            if(selectedUserRole === 1000) {
                roleIds.push(...userRoles.map(uR => uR.id));
            } else {
                roleIds.push(selectedUserRole)
            }
            const equalsCheck = (a:any, b:any) => {
                return JSON.stringify(a) === JSON.stringify(b);
            }
            let originalRoleIds: number[] = originalUser.userRoles.map((uR: any) => uR.id)
            if(!equalsCheck(roleIds, originalRoleIds)) {
                changes["userRoleIds"] = roleIds;
            }
        }
        return changes;
    }
 
    const saveChanges = (changes: any) => {
        console.log(changes)
        changes["id"] = user.id;
        updateUser(changes).then(() => {
            navigate("/my-profile");
        });
    }

    const handleSaveChanges = () => {
        const changes = detectChanges();
        saveChanges(changes);
    }

    const canSaveChanges = () => {
        const changes = detectChanges();
        return Object.keys(changes).length !== 0;
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
                        setUser((uInfo: any) => ({
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
        setUser((uInfo: any) => ({
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
        { user &&
            <div className="edit-profile-container">
                <div className="upper-section">
                    <div className="image-details">
                        <img className="profile-picture"
                            src={user.profilePicture || example}
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
                            {user.profilePicture && <button onClick={removeProfilePicture}>Remove image</button>}
                        </div>
                    </div>
                    <div className="profile-details">
                        <div className="input-container">
                            <span>First Name:</span>
                            <input
                                value={user.firstName}
                                type="text"
                                onChange={handleChange}
                                name="firstName"
                            />
                        </div>
                        <div className="input-container">
                            <span>Last Name:</span>
                            <input
                                value={user.lastName}
                                type="text"
                                onChange={handleChange}
                                name="lastName"
                            />
                        </div>
                        <div className="input-container">
                            <span>Email:</span>
                            <input
                                value={user.email}
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
                                value={user.phoneNumber}
                                type="text"
                                onChange={handleChange}
                                name="phoneNumber"
                            />
                        </div>
                        <div className="input-container">
                            <span>Location:</span>
                            <input
                                value={user.address}
                                type="text"
                                onChange={handleChange}
                                name="address"
                            />
                        </div>
                        <div className="input-container">
                            <span>Instagram:</span>
                            <input
                                value={user.instagram}
                                type="text"
                                onChange={handleChange}
                                name="instagram"
                            />
                        </div>
                        <div className="input-container">
                            <span>LinkedIn:</span>
                            <input
                                value={user.linkedIn}
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
                                selected={user.dateOfBirth}
                                onChange={(date) => date ? handleDateChange(date) : console.log("No date selected")}
                                name="dateOfBirth"
                            />
                        </div>
                        <div className="input-container">
                            <span>Gender:</span>
                            <form>
                                <label className="radio">
                                    <input type="radio" value="male"
                                        checked={selectedGender === "male"} 
                                        onChange={handleGenderChange} />
                                    Male
                                </label>
                                <label className="radio">
                                    <input type="radio" value="female"
                                        checked={selectedGender === "female"} 
                                        onChange={handleGenderChange} />
                                    Female
                                </label>
                                <label className="radio">
                                    <input type="radio" value="other"
                                        checked={selectedGender === "other"} 
                                        onChange={handleGenderChange} />
                                    Other
                                </label>
                            </form>
                        </div>
                        <div className="input-container">
                            <span>Role(s):</span>
                            <select
                                value={selectedUserRole}
                                onChange={handleRolesChange}
                            >
                                {
                                    userRoles.map((userRole) => {
                                        return <option value={userRole.id} key={userRole.id} onChange={handleRolesChange}>{userRole.name.charAt(0).toUpperCase() + userRole.name.slice(1)}</option>
                                    })
                                }
                                <option value={1000}>All roles</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button onClick={handleSaveChanges} disabled={!canSaveChanges()}>Save Changes</button>
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