import { useEffect, useState } from "react";
import dropdownIcon from "../assets/dropdown-icon.png"
import { isUserOwnerOfCourse } from "../services/courseService";
import { createLesson, deleteLesson } from "../services";
import { getFile, uploadFile } from "../services/fileService";
import { FileModel, Lesson } from "../utils/models";
import { createEmptyLesson, updateLesson } from "../services/lessonService";

export const LessonCard = ({lesson, courseId, isCreateMode, isLessonBeingAdded, setIsLessonBeingAdded}: any) => {
    // View lesson
    let [isOwner, setIsOwner] = useState<boolean>(false);
    let [isLessonExpanded, setIsLessonExpanded] = useState<boolean>(false);

    // let [lessonName, setLessonName] = useState<string>("");
    // let [lessonMaterials, setLessonMaterials] = useState<FileModel[]>([]);

    // Edit lesson
    let [selectedFile, setSelectedFile] = useState<File | null>(null);
    let [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    // Add new lesson
    let [newLesson, setNewLesson] = useState<Lesson>();

    useEffect(() => {
        if (lesson && !isLessonBeingAdded) {
            loadIsUserOwnerOfLesson();
        }
        if (isLessonBeingAdded && !lesson) {
            createEmptyLesson(courseId).then(res => {
                setNewLesson(res.data)
            })
        }
    }, [])

    const loadIsUserOwnerOfLesson = () => {
        isUserOwnerOfCourse(lesson!.course.id).then(res => {
            setIsOwner(res.data);
        })
    }

    const removeLesson = () => {
        deleteLesson(lesson!.id).then(() => {})
    }

    const toggleIsExpanded = () => {
        setIsLessonExpanded(!isLessonExpanded);
    }
 
    const handleNameChange = (e: any) => {
        setNewLesson((uInfo: any) => ({
            ...uInfo,
            title: e.target.value
        }))
    }

    const handleFileChange = (e: any) => {
        setSelectedFile(e.target.files[0]);
    };

    const addLesson = () => {
        const req = {
            id: newLesson!.id,
            courseId: null,
            title: newLesson?.title || null,
            content: null,
            lessonOrder: null
        }
        updateLesson(req);
        setIsLessonBeingAdded(false);
        console.log(newLesson)
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            uploadFile(selectedFile, newLesson!.id).then(res => {
                const uploadedFile: FileModel = res.data;
                setUploadedFiles(prevFiles => [...prevFiles, uploadedFile]);
                setNewLesson((uInfo: any) => ({
                    ...uInfo,
                    materials: (prevMaterials:any) => [...prevMaterials, uploadedFile]
                }))
                setSelectedFile(null);
            });
        }
    };

    // const downloadFile = (fileId: number) => {
    //     // Implement downloadFile function
    //     getFile(fileId)
    //         .then((response:any) => response.blob())
    //         .then((blob:any) => {
    //             const url = window.URL.createObjectURL(new Blob([blob]));
    //             const link = document.createElement('a');
    //             link.href = url;
    //             link.setAttribute('download', 'file.pdf'); // or extract the filename from response
    //             document.body.appendChild(link);
    //             link.click();
    //             link.parentNode?.removeChild(link);
    //         });
    // };
    const downloadFile = (fileId: number, fileName: string) => {
        getFile(fileId)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => console.error("File download failed:", error));
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
                                <button onClick={() => downloadFile(material.id,  material.name)}>Download</button>
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
                        value={newLesson?.title}
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
                            {newLesson?.materials.map((material: FileModel, index: number) => (
                                <div key={material.id}>
                                    <span>{material.name}</span>
                                    <button onClick={() => downloadFile(material.id,  material.name)}>Download</button>
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