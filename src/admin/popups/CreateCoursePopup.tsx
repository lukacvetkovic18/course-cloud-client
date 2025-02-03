import { useState } from "react";
import { User } from "../../utils/models";
import emptyImage from "../../assets/add-image.png"
import { createCourse } from "../../services/adminService";

interface CreateCoursePopupProps {
    instructors: User[];
    closeCreatePopup: () => void;
}

export const CreateCoursePopup = ({instructors, closeCreatePopup}: CreateCoursePopupProps) => {
    let [newCourse, setNewCourse] = useState<{
        title: string;
        shortDescription: string;
        description: string;
        isActive: boolean;
        image: string | null;
        owner: User | null;
    }>({
        title: "",
        shortDescription: "",
        description: "",
        isActive: false,
        image: null,
        owner: null
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setNewCourse((courseInfo: any) => ({
            ...courseInfo,
            [name]: finalValue
        }));
        console.log(canSaveCourse())
        // console.log(newCourse)
    };

    const handleInstructorChange = (e: any) => {
        const selectedInstructorId = parseInt(e.target.value);
        const selectedInstructor = instructors.find(instructor => instructor.id === selectedInstructorId) || null;
        setNewCourse((courseInfo: any) => ({
            ...courseInfo,
            owner: selectedInstructor
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
                        canvas.width = 300;
                        canvas.height = 200;
                        ctx.drawImage(image, 0, 0, 300, 200);
                        const base64Image = canvas.toDataURL('image/png');
                        setNewCourse((course: any) => ({
                            ...course,
                            image: base64Image
                        }));
                    }
                };
                image.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setNewCourse((courseInfo: any) => ({
            ...courseInfo,
            image: ""
        }));
    };
    
    const saveCourse = () => {
        const req = {
            title: newCourse.title,
            shortDescription: newCourse.shortDescription ,
            description: newCourse.description,
            isActive: newCourse.isActive,
            image: newCourse.image ? newCourse.image : null,
            ownerId: newCourse.owner!.id
        }
        console.log(req);
        createCourse(req).then(() => {
            closeCreatePopup();
        })
    }

    const canSaveCourse = () => {
        if(newCourse.title !== "" &&
            newCourse.shortDescription !== "" &&
            newCourse.description !== "" &&
            newCourse.owner
        ) return true;

        return false;
    }

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };

    return (<>
        {
            newCourse && 
            <div className="edit-course-popup-container">
                <div className="basic-info">
                    <div className="image-details">
                        <img src={newCourse.image || emptyImage} onClick={triggerFileInput} />
                        <div>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button onClick={triggerFileInput}>Upload image</button>
                            {newCourse.image && <button onClick={removeImage}>Remove image</button>}
                        </div>
                    </div>
                    <input
                        className="title-input"
                        value={newCourse.title}
                        type="text"
                        placeholder="Title"
                        onChange={handleChange}
                        name="title"
                    />
                    <textarea
                        className="short-description-input"
                        value={newCourse.shortDescription}
                        placeholder="Short Description"
                        onChange={handleChange}
                        name="shortDescription"
                    />
                    <textarea
                        className="description-input"
                        value={newCourse.description}
                        placeholder="Description"
                        onChange={handleChange}
                        name="description"
                    />
                    <label>
                    <span className="owner-text">Owner:</span>
                    <select
                        name="ownerId"
                        value={newCourse.owner ? newCourse.owner.id : -1}
                        onChange={handleInstructorChange}
                    >
                    <option value={-1}>
                        No Instructor
                    </option>
                        {instructors.map((instructor) => (
                            <option key={instructor.id} value={instructor.id}>
                                {instructor.firstName} {instructor.lastName}
                            </option>
                        ))}
                    </select>
                    </label>
                    <label>
                        <input
                            className="active-input"
                            type="checkbox"
                            checked={newCourse.isActive}
                            onChange={handleChange}
                            name="isActive"
                        />
                        <span>Is Active</span>
                    </label>
                </div>
                <div className="add-section">
                    <button onClick={saveCourse} disabled={!canSaveCourse()}>SAVE COURSE</button>
                    <button onClick={closeCreatePopup}>CANCEL</button>
                </div>
            </div>
        }
    </>);
}