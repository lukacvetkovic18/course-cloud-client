import { useEffect, useRef, useState } from "react";
import { Course, User } from "../../utils/models";
import emptyImage from "../../assets/add-image.png"
import { updateCourse } from "../../services/adminService";

interface EditCoursePopupProps {
    course: Course;
    instructors: User[];
    closeEditPopup: () => void;
}

export const EditCoursePopup = ({course, instructors, closeEditPopup}: EditCoursePopupProps) => {
    let [updatedCourse, setUpdatedCourse] = useState<Course>();
    
    useEffect(() => {
        setUpdatedCourse(course);
    }, [])

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setUpdatedCourse((courseInfo: any) => ({
            ...courseInfo,
            [name]: finalValue
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
                        // Set the canvas to the desired dimensions
                        canvas.width = 300;
                        canvas.height = 200;
                        // Draw the resized image on the canvas
                        ctx.drawImage(image, 0, 0, 300, 200);
                        const base64Image = canvas.toDataURL('image/png');
                        setUpdatedCourse((course: any) => ({
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
        setUpdatedCourse((courseInfo: any) => ({
            ...courseInfo,
            image: ""
        }));
    };

    const detectChanges = (): Partial<Course> => {
        const changes: any = {};
        for (const key in course) {
            if (course.hasOwnProperty(key) && updatedCourse!.hasOwnProperty(key)) {
                const typedKey = key as keyof Course;
                if (course[typedKey] !== updatedCourse![typedKey]) {
                    changes[typedKey] = updatedCourse![typedKey];
                }
            }
        }
        return changes;
    };
    
    const saveCourse = () => {
        const changes = detectChanges();
        changes["id"] = course.id;
        console.log(changes);
        // updateCourse(changes).then(() => {
        //     closeEditPopup();
        // })
    }

    const canSaveCourse = () => {
        if(course.title &&
            course.shortDescription &&
            course.description) return true;

        return false;
    }

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };

    return (<>
        {
            updatedCourse && 
            <div className="create-course-container">
                <div className="basic-info">
                        <select
                            name="ownerId"
                            value={updatedCourse.owner.id}
                            onChange={handleChange}
                        >
                            {instructors.map((instructor) => (
                                <option key={instructor.id} value={instructor.id}>
                                    {instructor.firstName} {instructor.lastName}
                                </option>
                            ))}
                        </select>
                    <div className="image-details">
                        <img src={updatedCourse.image || emptyImage} onClick={triggerFileInput} />
                        <div>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button onClick={triggerFileInput}>Upload image</button>
                            {updatedCourse.image && <button onClick={removeImage}>Remove image</button>}
                        </div>
                    </div>
                    <input
                        className="title-input"
                        value={updatedCourse.title}
                        type="text"
                        placeholder="Title"
                        onChange={handleChange}
                        name="title"
                    />
                    <textarea
                        className="short-description-input"
                        value={updatedCourse.shortDescription}
                        placeholder="Short Description"
                        onChange={handleChange}
                        name="shortDescription"
                    />
                    <textarea
                        className="description-input"
                        value={updatedCourse.description}
                        placeholder="Description"
                        onChange={handleChange}
                        name="description"
                    />
                    <label>
                        <input
                            className="active-input"
                            type="checkbox"
                            checked={updatedCourse.isActive}
                            onChange={handleChange}
                            name="isActive"
                        />
                        <span>Is Active</span>
                    </label>
                </div>
                <div className="add-section">
                    <button onClick={saveCourse} disabled={!canSaveCourse}>SAVE COURSE</button>
                    <button onClick={closeEditPopup}>CANCEL</button>
                </div>
            </div>
        }
    </>);
}