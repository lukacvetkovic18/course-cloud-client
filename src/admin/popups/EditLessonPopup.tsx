import { useEffect, useRef, useState } from "react";
import { Course, FileModel, Lesson } from "../../utils/models";
import emptyImage from "../../assets/add-image.png"
import plusSign from "../../assets/plus-sign.png"
import xSign from "../../assets/x-sign.png"
import pdfIcon from "../../assets/pdf-icon.png"
import imageIcon from "../../assets/image-icon.png"
import { updateCourse, updateLesson } from "../../services/adminService";
import { title } from "process";
import { getFilesByLessonId } from "../../services/fileService";

interface EditLessonPopupProps {
    lesson: Lesson;
    courses: Course[];
    closeEditPopup: () => void;
}

export const EditLessonPopup = ({lesson, courses, closeEditPopup}: EditLessonPopupProps) => {
    let [updatedLesson, setUpdatedLesson] = useState<Lesson>(lesson);
    let [originalFiles, setOriginalFiles] = useState<FileModel[]>([]);
    let [updatedFiles, setUpdatedFiles] = useState<FileModel[]>([]);
    let [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    
    useEffect(() => {
        setUpdatedLesson(lesson);
        loadFiles();
    }, [lesson]);

    const loadFiles = () => {
        getFilesByLessonId(lesson.id).then(res => {
            const files = res.data;
            setOriginalFiles(files);
            setUpdatedFiles(files);
            setSelectedFiles(files.map((file: FileModel) => {
                const blob = new Blob([file.data], { type: file.type });
                return new File([blob], file.name, { type: file.type });
            }));
        })
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUpdatedLesson((lessonInfo: any) => ({
            ...lessonInfo,
            [name]: value
        }));
    };

    const handleCourseChange = (e: any) => {
        const selectedCourseId = parseInt(e.target.value);
        const selectedCourse = courses.find(course => course.id === selectedCourseId) || null;
        setUpdatedLesson((lessonInfo: any) => ({
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
            data: new Uint8Array(), // Placeholder, as we don't have the actual data yet
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
            id: updatedLesson!.id,
            courseId: updatedLesson!.course.id,
            title: updatedLesson!.title,
            files: selectedFiles.map(f => ({ file: f }))
        }

        updateLesson(req).then(() => {
            closeEditPopup();
        });
    };

    const canSaveLesson = () => {
        return updatedLesson?.title && updatedLesson?.course;
    };

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
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
            updatedLesson && 
            <div className="edit-course-popup-container">
                <div className="basic-info">
                    <input
                        className="title-input"
                        value={updatedLesson.title}
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
                            value={updatedLesson.course ? updatedLesson.course.id : -1}
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
                    <button onClick={closeEditPopup}>CANCEL</button>
                </div>
            </div>
        }
    </>);
}