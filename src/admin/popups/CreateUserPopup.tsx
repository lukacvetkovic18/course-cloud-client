import { useState } from "react";
import { UserRole } from "../../utils/models";
import emptyImage from "../../assets/blank-profile-picture.png"
import { createUser } from "../../services/adminService";
import DatePicker from "react-datepicker";

interface CreateUserPopupProps {
    userRoles: UserRole[];
    closeCreatePopup: () => void;
}

export const CreateUserPopup = ({userRoles, closeCreatePopup}: CreateUserPopupProps) => {
    let [newUser, setNewUser] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        dateOfBirth: Date | null;
        gender: string;
        address: string | null;
        isActive: boolean;
        profilePicture: string | null;
        phoneNumber: string | null;
        instagram: string | null;
        linkedIn: string | null;
        userRoles: UserRole[];
        slug: string | null;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dateOfBirth: null,
        gender: "male",
        address: null,
        isActive: false,
        profilePicture: null,
        phoneNumber: null,
        instagram: null,
        linkedIn: null,
        userRoles: userRoles,
        slug: null
    });
    let [confirmPassword, setConfirmPassword] = useState<string>("");

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setNewUser((userInfo: any) => ({
            ...userInfo,
            [name]: finalValue
        }));
    };

    const handleRoleChange = (e: any) => {
        const selectedRoleId = parseInt(e.target.value);
        if (selectedRoleId === -1) {
            // "All User Roles" selected
            setNewUser((userInfo: any) => ({
                ...userInfo,
                userRoles: userRoles
            }));
        } else {
            const selectedRole = userRoles.find(role => role.id === selectedRoleId) || null;
            setNewUser((userInfo: any) => ({
                ...userInfo,
                userRoles: selectedRole ? [selectedRole] : []
            }));
        }
    };

    const handleDateChange = (date: Date) => {
        setNewUser((uInfo: any) => ({
            ...uInfo,
            dateOfBirth: date
        }))
    }

    const handleGenderChange = (e: any) => {
        const { value } = e.target;
        setNewUser((userInfo: any) => ({
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
                        setNewUser((uInfo: any) => ({
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
        setNewUser((uInfo: any) => ({
            ...uInfo,
            profilePicture: null
        }));
    };

    const saveUser = () => {
        const req = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
            dateOfBirth: newUser.dateOfBirth!,
            gender: newUser.gender,
            address: newUser.address,
            isActive: newUser.isActive,
            profilePicture: newUser.profilePicture,
            phoneNumber: newUser.phoneNumber,
            instagram: newUser.instagram,
            linkedIn: newUser.linkedIn,
            userRoleIds: newUser.userRoles.map(r => r.id),
            slug: newUser.slug
        }
        console.log(req);
        createUser(req).then(() => {
            closeCreatePopup();
        })
    }
 
    const handleConfirmPasswordChange = (e: any) => {
        setConfirmPassword(e.target.value);
    }

    const canSaveUser = () => {
        if(newUser.firstName &&
            newUser.lastName &&
            newUser.email &&
            newUser.password &&
            (newUser.password === confirmPassword) &&
            newUser.dateOfBirth &&
            newUser.gender &&
            newUser.userRoles.length > 0) return true;

        return false;
    }

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };

    return (<>
        {
            newUser && 
            <div className="edit-course-popup-container">
                <div className="basic-info">
                    <div className="image-details user">
                        <img src={newUser.profilePicture || emptyImage} onClick={triggerFileInput} />
                        <div>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button onClick={triggerFileInput}>Upload image</button>
                            {newUser.profilePicture && <button onClick={removeProfilePicture}>Remove image</button>}
                        </div>
                    </div>
                    <input
                        className="title-input"
                        value={newUser.firstName}
                        type="text"
                        placeholder="First Name"
                        onChange={handleChange}
                        name="firstName"
                    />
                    <input
                        className="title-input"
                        value={newUser.lastName}
                        type="text"
                        placeholder="Last Name"
                        onChange={handleChange}
                        name="lastName"
                    />
                    <input
                        className="title-input"
                        value={newUser.email}
                        type="text"
                        placeholder="Email"
                        onChange={handleChange}
                        name="email"
                    />
                    <input
                        className="title-input"
                        value={newUser.password}
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password"
                    />
                    <input
                        className="title-input"
                        value={confirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleConfirmPasswordChange}
                        name="password"
                    />
                    {
                        confirmPassword !== null && confirmPassword !== newUser.password ?
                        <div className="error-message">
                            Passwords have to match!
                        </div>
                        :
                        <div style={{display: "none"}}></div>
                    }
                    <DatePicker
                        wrapperClassName="datePicker"
                        selected={newUser.dateOfBirth}
                        placeholderText="Date of Birth"
                        onChange={(date) => date ? handleDateChange(date) : console.log("No date selected")}
                        name="dateOfBirth"
                    />
                    <div className="input-container">
                        <span>Gender:</span>
                        <form>
                            <label className="radio">
                                <input type="radio" value="male"
                                    checked={newUser.gender === "male"} 
                                    onChange={handleGenderChange} />
                                Male
                            </label>
                            <label className="radio">
                                <input type="radio" value="female"
                                    checked={newUser.gender === "female"} 
                                    onChange={handleGenderChange} />
                                Female
                            </label>
                            <label className="radio">
                                <input type="radio" value="other"
                                    checked={newUser.gender === "other"} 
                                    onChange={handleGenderChange} />
                                Other
                            </label>
                        </form>
                    </div>
                    <input
                        className="title-input"
                        value={newUser.address ? newUser.address : ""}
                        type="text"
                        placeholder="Address"
                        onChange={handleChange}
                        name="address"
                    />
                    <input
                        className="title-input"
                        value={newUser.phoneNumber ? newUser.phoneNumber : ""}
                        type="text"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        name="phoneNumber"
                    />
                    <input
                        className="title-input"
                        value={newUser.instagram ? newUser.instagram : ""}
                        type="text"
                        placeholder="Instagram"
                        onChange={handleChange}
                        name="instagram"
                    />
                    <input
                        className="title-input"
                        value={newUser.linkedIn ? newUser.linkedIn : ""}
                        type="text"
                        placeholder="LinkedIn"
                        onChange={handleChange}
                        name="linkedIn"
                    />
                    <input
                        className="title-input"
                        value={newUser.slug ? newUser.slug : ""}
                        type="text"
                        placeholder="Slug"
                        onChange={handleChange}
                        name="slug"
                    />
                    <label>
                        <span className="owner-text">Roles:</span>
                        <select
                            name="userRoles"
                            value={newUser.userRoles.map(role => role.id).length > 1 ? -1 : newUser.userRoles[0].id}
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
                            checked={newUser.isActive}
                            onChange={handleChange}
                            name="isActive"
                        />
                        <span>Is Active</span>
                    </label>
                </div>
                <div className="add-section">
                    <button onClick={saveUser} disabled={!canSaveUser()}>SAVE USER</button>
                    <button onClick={closeCreatePopup}>CANCEL</button>
                </div>
            </div>
        }
    </>);
}