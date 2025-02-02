import { useEffect, useRef, useState } from "react";
import { User, UserRole } from "../../utils/models";
import emptyImage from "../../assets/blank-profile-picture.png"
import { updateUser } from "../../services/adminService";
import DatePicker from "react-datepicker";
import { ChangePasswordPopup } from "../../components/ChangePasswordPopup";

interface EditUserPopupProps {
    user: User;
    userRoles: UserRole[];
    closeEditPopup: () => void;
}

export const EditUserPopup = ({user, userRoles, closeEditPopup}: EditUserPopupProps) => {
    let [updatedUser, setUpdatedUser] = useState<User>(user);
    let [isPasswordPopupOpened, setIsPasswordPopupOpened] = useState<boolean>(false);
    let popupRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setUpdatedUser(user);
    }, [])

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setUpdatedUser((userInfo: any) => ({
            ...userInfo,
            [name]: finalValue
        }));
    };

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

    const handlePasswordClick = () => {
        setIsPasswordPopupOpened(true);
    };

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
    
    const saveUser = () => {
        const req = {
            id: updatedUser.id,
            firstName: (user.firstName !== updatedUser.firstName) ? updatedUser.firstName : null,
            lastName: (user.lastName !== updatedUser.lastName) ? updatedUser.lastName : null,
            email: (user.email !== updatedUser.email) ? updatedUser.email : null,
            password: (user.password !== updatedUser.password) ? updatedUser.password : null,
            dateOfBirth: (user.dateOfBirth !== updatedUser.dateOfBirth) ? updatedUser.dateOfBirth : null,
            gender: (user.gender !== updatedUser.gender) ? updatedUser.gender : null,
            address: (user.address !== updatedUser.address) ? updatedUser.address : null,
            isActive: (user.isActive !== updatedUser.isActive) ? updatedUser.isActive : null,
            profilePicture: (user.profilePicture !== updatedUser.profilePicture) ? updatedUser.profilePicture : null,
            phoneNumber: (user.phoneNumber !== updatedUser.phoneNumber) ? updatedUser.phoneNumber : null,
            instagram: (user.instagram !== updatedUser.instagram) ? updatedUser.instagram : null,
            linkedIn: (user.linkedIn !== updatedUser.linkedIn) ? updatedUser.linkedIn : null,
            userRoleIds: updatedUser.userRoles.map(r => r.id),
            slug: (user.slug !== updatedUser.slug) ? updatedUser.slug : null
        }
        console.log(req);
        updateUser(req).then(() => {
            closeEditPopup();
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

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };

    return (<>
        {
            updatedUser && 
            <div className="edit-course-popup-container">
                <div className="basic-info">
                    <div className="image-details user">
                        <img src={updatedUser.profilePicture || emptyImage} onClick={triggerFileInput} />
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
                    <input
                        className="title-input"
                        value={updatedUser.firstName}
                        type="text"
                        placeholder="First Name"
                        onChange={handleChange}
                        name="firstName"
                    />
                    <input
                        className="title-input"
                        value={updatedUser.lastName}
                        type="text"
                        placeholder="Last Name"
                        onChange={handleChange}
                        name="lastName"
                    />
                    <input
                        className="title-input"
                        value={updatedUser.email}
                        type="text"
                        placeholder="Email"
                        onChange={handleChange}
                        name="email"
                    />
                    <DatePicker
                        wrapperClassName="datePicker"
                        selected={updatedUser.dateOfBirth}
                        placeholderText="Date of Birth"
                        onChange={(date) => date ? handleDateChange(date) : console.log("No date selected")}
                        name="dateOfBirth"
                    />
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
                    <input
                        className="title-input"
                        value={updatedUser.address}
                        type="text"
                        placeholder="Address"
                        onChange={handleChange}
                        name="address"
                    />
                    <input
                        className="title-input"
                        value={updatedUser.phoneNumber}
                        type="text"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        name="phoneNumber"
                    />
                    <input
                        className="title-input"
                        value={updatedUser.instagram}
                        type="text"
                        placeholder="Instagram"
                        onChange={handleChange}
                        name="instagram"
                    />
                    <input
                        className="title-input"
                        value={updatedUser.linkedIn}
                        type="text"
                        placeholder="LinkedIn"
                        onChange={handleChange}
                        name="linkedIn"
                    />
                    <input
                        className="title-input"
                        value={updatedUser.slug}
                        type="text"
                        placeholder="Slug"
                        onChange={handleChange}
                        name="slug"
                    />
                    <label>
                        <span className="owner-text">Roles:</span>
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
                    </label>
                    <label>
                        <input
                            className="active-input"
                            type="checkbox"
                            checked={updatedUser.isActive}
                            onChange={handleChange}
                            name="isActive"
                        />
                        <span>Is Active</span>
                    </label>
                    <button onClick={handlePasswordClick}>Change Password</button>
                </div>
                <div className="add-section">
                    <button onClick={saveUser} disabled={!canSaveUser()}>SAVE USER</button>
                    <button onClick={closeEditPopup}>CANCEL</button>
                </div>
            </div>
        }
        {isPasswordPopupOpened && (
            <div className="change-password-popup-overlay">
                <div className="change-password-popup-content" ref={popupRef}>
                    <ChangePasswordPopup user={updatedUser}/>
                </div>
            </div>
        )}
    </>);
}