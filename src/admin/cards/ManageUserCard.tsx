import { useEffect } from "react";
import { User } from "../../utils/models";

interface ManageUserCardProps {
    user: User;
    handleEditClick: (user: User) => void;
    handleDeleteClick: (user: User) => void;
}

export const ManageUserCard = ({user, handleEditClick, handleDeleteClick}: ManageUserCardProps) => {
    
    useEffect(() => {
        console.log(user)
    }, [])

    const displayRoles = () => {
        return user.userRoles.map(role => role.name.charAt(0).toUpperCase() + role.name.slice(1)).join(', ');
    };

    return (<>
        <div className="manage-card-container">
            <span>{user.firstName} {user.lastName}</span>
            <span>{displayRoles()}</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            <span>{user.isActive ? "Active" : "Disabled"}</span>
            <div className="buttons">
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteClick(user)}>Delete</button>
            </div>
        </div>
    </>);
}