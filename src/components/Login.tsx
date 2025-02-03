import { useEffect, useState } from "react";
import { loginUser } from "../services";
import { useNavigate } from "react-router";
import { LandingPageState } from "../pages/LandingPage";
import "../styles"

interface LoginProps {
    setPageState:  React.Dispatch<React.SetStateAction<LandingPageState>>;
}

export const Login = ({setPageState}: LoginProps) => {
    const navigate = useNavigate();

    let [userInfo, setUserInfo] = useState<{
        email: string,
        password: string
    }>({email:"",password:""});
    let [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        if(localStorage.getItem("token") !== null) {
            navigate("/home");
        };
    }, [])
 
    const handleLogin = () => {
        loginUser(userInfo).then(res => {
            localStorage.removeItem("token");
            localStorage.setItem("token", res.data.token);
            navigate("/home");
        }).catch(() => {
            setShowError(true);
        });
    }
 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUserInfo( uInfo => ({
            ...uInfo,
            [name]: value
        }))
    }

    const canLogin = () => {
        if( userInfo.email !== "" &&
            userInfo.password !== ""
        ) {
            return true;
        }
        return false;
    }
    return(
        <>
            <div className="login-container">
                <h2>Please Login To Continue</h2>
                { showError && <div className="error-message">Email or Password you entered are incorrect.</div> }
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
                    <span>Password:</span>
                    <input
                        value={userInfo.password}
                        type="password"
                        onChange={handleChange}
                        name="password"
                    />
                </div>
                <button onClick={handleLogin} disabled={!canLogin()}>Login</button>
                <span className="redirect-text" onClick={() => setPageState(LandingPageState.REGISTER) }>Still don't have an account? Register here.</span>
                {/* <span className="redirect-text" onClick={() => setPageState(LandingPageState.PW_RESET) }>Can't remember your password? Reset here.</span> */}
            </div>
        </>
    )
}