import { useEffect, useRef, useState } from "react";
import { User, UserRole } from "../../utils/models";
import { DeletePopup } from "../popups/DeletePopup";
import { getAllUsers } from "../../services/adminService";
import { getUserRoles } from "../../services";
import { ManageUserCard } from "../cards/ManageUserCard";
import { EditUserPopup } from "../popups/EditUserPopup";
import { CreateUserPopup } from "../popups/CreateUserPopup";

export const ManageUsers = () => {
    let [users, setUsers] = useState<User[]>([]);
    let [userRoles, setUserRoles] = useState<UserRole[]>([]);
    let [userBeingEdited, setUserBeingEdited] = useState<User | null>(null);
    let [userBeingDeleted, setUserBeingDeleted] = useState<User | null>(null);
    let [isUserBeingCreated, setIsUserBeingCreated] = useState<boolean>(false);
    let [selectedRoleFilter, setSelectedRoleFilter] = useState<number | null>(null);
    let [selectedStatusFilter, setSelectedStatusFilter] = useState<number | null>(null);
    let [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    let [searchText, setSearchText] = useState<string>("");
    let [sortColumn, setSortColumn] = useState<string | null>(null);
    let [sortOrder, setSortOrder] = useState<string>("asc");
    let popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadUsers();
        loadUserRoles();
    }, []);

    useEffect(() => {
        loadUsers();
    }, [userBeingEdited === null, userBeingDeleted === null, isUserBeingCreated]);

    useEffect(() => {
        filterAndSortUsers();
    }, [users, selectedRoleFilter, selectedStatusFilter, searchText, sortColumn, sortOrder]);


    const loadUsers = () => {
        getAllUsers().then(res => {
            setUsers(res.data);
        })
    }

    const loadUserRoles = () => {
        getUserRoles().then(res => {
            setUserRoles(res.data);
        })
    }

    const handleEditClick = (user: User) => {
        setUserBeingEdited(user);
    }

    const closeEditPopup = () => {
        setUserBeingEdited(null);
    }

    const handleDeleteClick = (user: User) => {
        setUserBeingDeleted(user);
    }

    const closeDeletePopup = () => {
        setUserBeingDeleted(null);
    }

    const handleCreateClick = () => {
        setIsUserBeingCreated(true);
    }

    const closeCreatePopup = () => {
        setIsUserBeingCreated(false);
    }

    const handleFilterByRole = (e: any) => {
        const value = e.target.value !== "-1" ? parseInt(e.target.value) : null;
        setSelectedRoleFilter(value);
    };

    const handleFilterByStatus = (e: any) => {
        const value = e.target.value !== "0" ? parseInt(e.target.value) : null;
        setSelectedStatusFilter(value);
    };

    const handleSearchChange = (e: any) => {
        setSearchText(e.target.value);
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    const filterAndSortUsers = () => {
        let filtered = users;

        if (selectedRoleFilter !== null) {
            filtered = filtered.filter(user => user.userRoles && user.userRoles.map(r => r.id).includes(selectedRoleFilter));
        }

        if (selectedStatusFilter !== null) {
            const isActive = selectedStatusFilter === 1;
            filtered = filtered.filter(user => user.isActive === isActive);
        }

        if (searchText.trim()) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                (user.firstName + " " + user.lastName).toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (sortColumn) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;
                if (sortColumn === "name") {
                    aValue = (a.firstName + " " + a.lastName).toLowerCase();
                    bValue = (b.firstName + " " + b.lastName).toLowerCase();
                } else if (sortColumn === "role") {
                    aValue = a.userRoles.map(role => role.name).join(', ').toLowerCase();
                    bValue = b.userRoles.map(role => role.name).join(', ').toLowerCase();
                } else if (sortColumn === "createdAt") {
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                } else if (sortColumn === "isActive") {
                    aValue = a.isActive ? 1 : 0;
                    bValue = b.isActive ? 1 : 0;
                }

                if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
                if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }

        setFilteredUsers(filtered);
    };

    return (<>
        <div className="manage-container">
            <div className="subheader">
                <span className="subtitle">Users</span>
                <button onClick={handleCreateClick}>ADD NEW USER</button>
            </div>
            <div className="filter-options">
                <input
                    type="text"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Search by Name or Email"
                />
                <select
                    name="ownerId"
                    value={selectedRoleFilter ?? -1}
                    onChange={handleFilterByRole}
                >
                    <option value={-1}>
                        All User Roles
                    </option>
                    {userRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                        </option>
                    ))}
                </select>
                <select
                    name="isActive"
                    value={selectedStatusFilter ?? 0}
                    onChange={handleFilterByStatus}
                >
                    <option value={0}>
                        All Statuses
                    </option>
                    <option value={1}>
                        Active
                    </option>
                    <option value={2}>
                        Disabled
                    </option>
                </select>
            </div>
            <div className="items-header">
                    <span onClick={() => handleSort("name")}>
                        Name {sortColumn === "name" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
                    <span onClick={() => handleSort("role")}>
                        Role(s) {sortColumn === "role" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
                    <span onClick={() => handleSort("createdAt")}>
                        Created {sortColumn === "createdAt" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
                    <span onClick={() => handleSort("isActive")}>
                        Status {sortColumn === "isActive" ? (sortOrder === "asc" ? "↓" : "↑") : ""}
                    </span>
            </div>
            <div className="items-container">
                {filteredUsers.map(user => (
                    <ManageUserCard key={user.id} user={user} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
                ))}
            </div>
        </div>
        {userBeingEdited && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content course-popup" ref={popupRef}>
                    <EditUserPopup user={userBeingEdited} userRoles={userRoles} closeEditPopup={closeEditPopup}/>
                </div>
            </div>
        )}
        {userBeingDeleted && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content" ref={popupRef}>
                    <DeletePopup item={userBeingDeleted} closeDeletePopup={closeDeletePopup}/>
                </div>
            </div>
        )}
        {isUserBeingCreated && (
            <div className="manage-popup-overlay">
                <div className="manage-popup-content course-popup" ref={popupRef}>
                    <CreateUserPopup userRoles={userRoles} closeCreatePopup={closeCreatePopup}/>
                </div>
            </div>
        )}
        </>);
}