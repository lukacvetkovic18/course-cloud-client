import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "../utils/models";
import { getLoggedInUser, getUsersByRole } from "../services";
import { Header, Footer, UserCard } from "../components";

export const AllInstructors = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        loadUsersByRole();
    }, [])

    let [user, setUser] = useState<User>();
    let [users, setUsers] = useState<User[]>();

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
        })
    }

    const loadUsersByRole = () => {
        getUsersByRole("instructor").then(res => {
            setUsers(res.data);
        })
    }

    return (<>
        <Header user={user}></Header>
        <div className="all-instructors-container">
            <div className="subheader">
                <span className="subtitle">All instructors</span>
            </div>
            <div className="instructors-container">
            {
                users && users.map(user => {
                    return <>
                        <UserCard user={user}/>
                    </>
                })
            }
            </div>
        </div>
        <Footer />
    </>);
}