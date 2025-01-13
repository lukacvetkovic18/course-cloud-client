import { useEffect, useState } from "react";
import dropdownIcon from "../assets/dropdown-icon.png"
import { isUserOwnerOfCourse } from "../services/courseService";
import { createLesson, deleteLesson } from "../services";
import { deleteFile, downloadFile, uploadFile } from "../services/fileService";
import { FileModel, Lesson } from "../utils/models";
import { createEmptyLesson, updateLesson } from "../services/lessonService";
import tickSign from "../assets/tick-sign.png"
import xSign from "../assets/x-sign.png"
import imageIcon from "../assets/image-icon.png"
import pdfIcon from "../assets/pdf-icon.png"
import plusSign from "../assets/plus-sign.png"

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
            console.log(courseId)
            createEmptyLesson({courseId}).then(res => {
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

    const handleFileCancel = () => {
        setSelectedFile(null);
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
                    materials: [...(uInfo.materials || []), uploadedFile] 
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
    const downloadFileFromDB = (fileId: number, fileName: string) => {
        downloadFile(fileId)
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

    const removeFile = (file: any) => {
        deleteFile(file.id).then(() => {
            newLesson?.materials.filter(m => m.id !== file.Id);
        })
    }

    const splitByLastDot = (filename:string) => {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex === -1) {
            // No dot found in the filename
            return [filename, ''];
        }
        const name = filename.substring(0, lastDotIndex);
        const extension = filename.substring(lastDotIndex + 1);
        return [name, extension];
    }
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
                                <button onClick={() => downloadFileFromDB(material.id,  material.name)}>Download</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        }
        {
            newLesson && isLessonBeingAdded && <div className="lesson-card-container is-being-added">
                <div className="lesson-header">
                    <input
                        className="lesson-title-input"
                        value={newLesson.title}
                        type="text"
                        placeholder="Title"
                        onChange={handleNameChange}
                    />
                </div>
                <div className="lesson-details show">
                    <div className="file-upload-section">
                        {
                            !selectedFile && <>
                                <label htmlFor="file-upload" className="custom-file-upload">
                                    <img src={plusSign}/>
                                </label>
                                <input id="file-upload" type="file" onChange={handleFileChange}/>
                            </>
                        }
                        {
                            selectedFile && <>
                                <img className="type-icon" src={selectedFile.type.startsWith("image/") ? imageIcon : pdfIcon }/>
                                <span className="selected-file-name">{splitByLastDot(selectedFile.name)[0]}</span>
                                <button onClick={handleFileUpload}>
                                    <img src={tickSign}/>
                                </button>
                                <button onClick={handleFileCancel}>
                                    <img src={xSign}/>
                                </button>
                            </>
                        }
                    </div>
                    <div>
                        {newLesson.materials && newLesson.materials.map((material: FileModel, index: number) => (
                            <div className="file-item" key={material.id}>
                                <img className="type-icon" src={material.type.startsWith("image/") ? imageIcon : pdfIcon }/>
                                <span className="file-name">{splitByLastDot(material.name)[0]}</span>
                                <button onClick={() => removeFile(material)}>
                                    <img src={xSign}/>
                                </button>
                                {/* <button onClick={() => downloadFileFromDB(material.id,  material.name)}>Download</button> */}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="buttons-section">
                    <button onClick={addLesson}>ADD</button>
                    <button onClick={() => setIsLessonBeingAdded(false)}>CANCEL</button>
                </div>
            </div>
        }
    </>);
}