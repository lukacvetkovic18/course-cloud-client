import { useEffect, useState } from "react";
import dropdownIcon from "../assets/dropdown-icon.png"
import { isUserOwnerOfCourse } from "../services/courseService";
import { deleteLesson } from "../services";
import { uploadFile } from "../services/fileService";
import { Lesson } from "../utils/models";

export const LessonCard = ({lesson, setLessons, isCreateMode, isLessonBeingAdded, setIsLessonBeingAdded}: any) => {
    // let [lesson, setLesson] = useState<Lesson>();
    let [isOwner, setIsOwner] = useState<boolean>(false);
    let [isLessonExpanded, setIsLessonExpanded] = useState<boolean>(false)
    let [lessonName, setLessonName] = useState<string>("");
    let [lessonMaterials, setLessonMaterials] = useState<string[]>([]);
    let [selectedFile, setSelectedFile] = useState<File | null>(null);
    let [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    useEffect(() => {
        if (lesson && !isLessonBeingAdded) {
            loadIsUserOwnerOfLesson();
        }
    }, [])

    const loadIsUserOwnerOfLesson = () => {
        // isUserOwnerOfCourse(lesson!.course.id).then(res => {
        //     setIsOwner(res.data);
        // })
    }

    const removeLesson = () => {
        deleteLesson(lesson!.id).then(() => {})
    }

    const toggleIsExpanded = () => {
        setIsLessonExpanded(!isLessonExpanded);
    }

    const handleNameChange = (e: any) => {
        setLessonName(e.target.value);
    }

    const handleFileChange = (e: any) => {
        setSelectedFile(e.target.files[0]);
    };

    const addLesson = () => {
        const newLesson: Lesson = {
            id: Math.random(), // or use a proper unique id generator
            // course: lesson.course,
            title: lessonName,
            description: "",
            lessonOrder: 1,
            isExpanded: true,
            materials: lessonMaterials,
        };
        setLessons((prevLessons: Lesson[]) => [...prevLessons, newLesson]);
        setIsLessonBeingAdded(false);
        console.log(newLesson)
    };

    const handleFileUpload = () => {
        if (selectedFile && lesson) {
            uploadFile(selectedFile, lesson.id).then(res => {
                setUploadedFiles(prevFiles => [...prevFiles, res.data]);
                setLessonMaterials(prevMaterials => [...prevMaterials, res.data.name]);
                setSelectedFile(null);
            });
        }
    };

    const downloadFile = (fileId: number) => {
        // Implement downloadFile function
        fetch(`/api/files/${fileId}`)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file.pdf'); // or extract the filename from response
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            });
    };

    return (<>
        {
            lesson && <div className="lesson-card-container">
                <div className="lesson-header">
                    <span onClick={toggleIsExpanded}>{ lesson.title }</span>
                    <div className="buttons">
                        {
                            (isOwner || isCreateMode) &&
                            <button onClick={removeLesson}>-</button>
                        }
                        <button>
                            <img src={dropdownIcon} onClick={toggleIsExpanded} />
                        </button>
                    </div>
                </div>
                <div className={"lesson-details" + (isLessonExpanded ? 'show' : 'hidden')}>
                    <div>
                        {lesson.materials.map((material: any, index: any) => (
                            <div key={index}>
                                <span>{material}</span>
                                <button onClick={() => downloadFile(material.id)}>Download</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        }
        {
            isLessonBeingAdded && <div className="lesson-card-container">
                <div className="lesson-header">
                    <input
                        className="lesson-title-input"
                        value={lessonName}
                        type="text"
                        placeholder="Title"
                        onChange={handleNameChange}
                    />
                </div>
                    <div className="lesson-details show">
                        <div className="file-upload-section">
                            <input type="file" onChange={handleFileChange} />
                            <button onClick={handleFileUpload}>Upload File</button>
                        </div>
                        <div>
                            {uploadedFiles.map(file => (
                                <div key={file.id}>
                                    <span>{file.name}</span>
                                    <button onClick={() => downloadFile(file.id)}>Download</button>
                                </div>
                            ))}
                        </div>
                    </div>
                <button onClick={addLesson}>ADD</button>
                <button onClick={() => setIsLessonBeingAdded(false)}>CANCEL</button>
            </div>
        }
    </>);
}