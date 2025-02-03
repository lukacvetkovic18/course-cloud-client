import { useState } from "react";
import { Course, FileModel } from "../../utils/models";
import plusSign from "../../assets/plus-sign.png"
import xSign from "../../assets/x-sign.png"
import pdfIcon from "../../assets/pdf-icon.png"
import imageIcon from "../../assets/image-icon.png"
import { createLesson } from "../../services/adminService";

interface CreateLessonPopupProps {
    courses: Course[];
    closeCreatePopup: () => void;
}

export const CreateLessonPopup = ({courses, closeCreatePopup}: CreateLessonPopupProps) => {
    let [newLesson, setNewLesson] = useState<{
            course: Course | null,
            title: string,
            files: FileModel[]
        }>({
            course: null,
            title: "",
            files: []
        });
    let [updatedFiles, setUpdatedFiles] = useState<FileModel[]>([]);
    let [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewLesson((lessonInfo: any) => ({
            ...lessonInfo,
            [name]: value
        }));
    };

    const handleCourseChange = (e: any) => {
        const selectedCourseId = parseInt(e.target.value);
        const selectedCourse = courses.find(course => course.id === selectedCourseId) || null;
        setNewLesson((lessonInfo: any) => ({
            ...lessonInfo,
            course: selectedCourse
        }));
    };

    const handleFileChange = (e: any) => {
        const files: File[] = Array.from(e.target.files);
        const newFileModels = files.map(file => ({
            id: Date.now(),
            name: file.name,
            type: file.type,
            file: file,
            createdAt: new Date().toISOString()
        }));

        setSelectedFiles(prevFiles => [...prevFiles, ...files]);
        setUpdatedFiles(prevFiles => [...prevFiles, ...newFileModels]);
    };

    const removeFile = (file: FileModel) => {
        setUpdatedFiles(prevFiles => prevFiles.filter(f => f.id !== file.id));
        setSelectedFiles(prevFiles => prevFiles.filter(f => f.name !== file.name));
    };

    const saveLesson = () => {
        const req = {
            courseId: newLesson!.course!.id,
            title: newLesson!.title,
            files: selectedFiles.map(f => ({ file: f }))
        }

        createLesson(req).then(() => {
            closeCreatePopup();
        });
    };

    const canSaveLesson = () => {
        return newLesson?.title && newLesson?.course && updatedFiles.length > 0;
    };

    const splitByLastDot = (filename: string) => {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return [filename, ''];
        }
        const name = filename.substring(0, lastDotIndex);
        const extension = filename.substring(lastDotIndex + 1);
        return [name, extension];
    };

    return (<>
        {
            newLesson && 
            <div className="edit-course-popup-container">
                <div className="basic-info">
                    <input
                        className="title-input"
                        value={newLesson.title}
                        type="text"
                        placeholder="Title"
                        onChange={handleChange}
                        name="title"
                    />
                    <div>
                        {updatedFiles.map((material: FileModel, index) => (
                            <div className="file-item" key={index}>
                                <img className="type-icon" src={material.type.startsWith("image/") ? imageIcon : pdfIcon} />
                                <span className="file-name">{splitByLastDot(material.name)[0]}</span>
                                <button onClick={() => removeFile(material)}>
                                    <img src={xSign} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="file-upload-section">
                        <label htmlFor="file-upload" className="custom-file-upload">
                            <img src={plusSign} />
                        </label>
                        <input id="file-upload" type="file" onChange={handleFileChange} multiple />
                    </div>
                    <label>
                        <span className="owner-text">Course:</span>
                        <select
                            name="courseId"
                            value={newLesson.course ? newLesson.course.id : -1}
                            onChange={handleCourseChange}
                        >
                            <option value={-1}>
                                No Course
                            </option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="add-section">
                    <button onClick={saveLesson} disabled={!canSaveLesson()}>SAVE LESSON</button>
                    <button onClick={closeCreatePopup}>CANCEL</button>
                </div>
            </div>
        }
    </>);
}