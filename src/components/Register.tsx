import { useEffect, useState } from "react";
import { registerUser, getUserRoles } from "../services";
import { useNavigate } from "react-router";
import { LandingPageState } from "../pages/LandingPage";
import "react-datepicker/dist/react-datepicker.css";
import "../styles"
import { UserRole } from "../utils/models";
import DatePicker from "react-datepicker";


export const Register = ({pageState, setPageState}: any) => {
    const navigate = useNavigate();

    let [userInfo, setUserInfo] = useState<{
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        dateOfBirth: Date,
        gender: string,
        isActive: boolean,
        userRoleIds: number[]
    }>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dateOfBirth: new Date(),
        gender: "",
        isActive: false,
        userRoleIds: []
    });
    let [userRoles, setUserRoles] = useState<UserRole[]>([]);
    let [confirmPassword, setConfirmPassword] = useState<string>("");
    let [selectedGender, setSelectedGender] = useState<string>("");
    let [selectedUserRole, setSelectedUserRole] = useState<number>(-1);

    useEffect(() => {
        if(localStorage.getItem("token") !== null) {
            navigate("/home");
        };
        loadUserRoles();
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
        console.log(userRoles)
    }
 
    const handleRegister = () => {
        let userIds: number[] = [];
        if(selectedUserRole === 1000) {
            userIds.push(...userRoles.map(uR => uR.id));
        } else {
            userIds.push(selectedUserRole)
        }
        const req = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            password: userInfo.password,
            dateOfBirth: userInfo.dateOfBirth,
            gender: selectedGender,
            isActive: true,
            userRoleIds: userIds
        }
        registerUser(req).then(res => {
            localStorage.removeItem("token");
            localStorage.setItem("token", res.data.token);
            navigate("/home");
        });
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUserInfo( uInfo => ({
            ...uInfo,
            [name]: value
        }))
    }

    const handleDateChange = (date: Date) => {
        setUserInfo( uInfo => ({
            ...uInfo,
            dateOfBirth: date
        }))
    }
 
    const handleConfirmPasswordChange = (e: any) => {
        setConfirmPassword(e.target.value);
    }

    const handleGenderChange = (e: any) => {
        setSelectedGender(e.target.value);
    }

    const handleRolesChange = (e: any) => {
        userRoles.find((uR: UserRole) => uR.id === +(e.target.value))
        setSelectedUserRole(+(e.target.value));
    }

    const canRegister = () => {
        if( userInfo.firstName !== "" &&
            userInfo.lastName !== "" &&
            userInfo.email !== "" &&
            userInfo.password !== "" &&
            userInfo.password === confirmPassword &&
            userInfo.dateOfBirth !== null &&
            selectedGender !== "" &&
            selectedUserRole !== -1
        ) {
            return true;
        }
        return false;
    }

    return(
        <>
            <div className="login-container">
                <h2>Please enter your info to register</h2>
                <div className="containers-list">
                <div className="input-container">
                    <span>First Name:</span>
                    <input
                        value={userInfo.firstName}
                        type="text"
                        onChange={handleChange}
                        name="firstName"
                    />
                </div>
                <div className="input-container">
                    <span>Password:</span>
                    <input
                        value={userInfo.password}
                        type="password"
                        onChange={handleChange}
                        name="password"
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
                    <span>Last Name:</span>
                    <input
                        value={userInfo.lastName}
                        type="text"
                        onChange={handleChange}
                        name="lastName"
                    />
                </div>
                <div className="input-container">
                    <span>Confirm Password:</span>
                    <input
                        value={confirmPassword}
                        type="password"
                        onChange={handleConfirmPasswordChange}
                        name="password"
                    />
                    {
                        confirmPassword !== null && confirmPassword !== userInfo.password ?
                        <div className="error-message">
                            Passwords have to match!
                        </div>
                        :
                        <div style={{display: "none"}}></div>
                    }
                </div>
                <div className="input-container">
                    <span>Choose your planned role(s):</span>
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
                <div className="input-container">
                    <span>Email:</span>
                    <input
                        value={userInfo.email}
                        type="email"
                        onChange={handleChange}
                        name="email"
                    />
                </div>
                <div className="input-container">
                    <span>Date of Birth:</span>
                    <DatePicker
                        wrapperClassName="datePicker"
                        selected={userInfo.dateOfBirth}
                        onChange={(date) => date ? handleDateChange(date) : console.log("No date selected")}
                        name="dateOfBirth"
                    />
                </div>
                </div>
                <button className="register-button" onClick={handleRegister} disabled={!canRegister()}>Register</button>
                <span className="redirect-text" onClick={() => setPageState(LandingPageState.LOGIN) }>Already have an account? Login here.</span>
            </div>
        </>
    )
}