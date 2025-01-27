import { useEffect, useState } from "react";
import dropdownIcon from "../assets/dropdown-icon.png"
import { isUserOwnerOfCourse } from "../services/courseService";
import { createLesson, deleteLesson } from "../services";
import { deleteFile, downloadFile, getFilesByLessonId, uploadFile } from "../services/fileService";
import { FileModel, Lesson } from "../utils/models";
import { createEmptyLesson, getLessonById, updateLesson } from "../services/lessonService";
import tickSign from "../assets/tick-sign.png"
import xSign from "../assets/x-sign.png"
import imageIcon from "../assets/image-icon.png"
import pdfIcon from "../assets/pdf-icon.png"
import plusSign from "../assets/plus-sign.png"
import minusSign from "../assets/minus-sign.png"

export const LessonCard = ({lesson, setLessons, lessonId, isCreateMode, isLessonBeingAdded, setIsLessonBeingAdded}: any) => {
    // View lesson
    let [isOwner, setIsOwner] = useState<boolean>(false);
    let [isLessonExpanded, setIsLessonExpanded] = useState<boolean>(false);

    // let [lessonName, setLessonName] = useState<string>("");
    // let [lessonMaterials, setLessonMaterials] = useState<FileModel[]>([]);

    // Edit lesson
    let [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);
    let [selectedFile, setSelectedFile] = useState<File | null>(null);
    let [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    // Add new lesson
    let [newLesson, setNewLesson] = useState<Lesson>();

    useEffect(() => {
        if (!isLessonBeingAdded) {
            loadIsUserOwnerOfLesson();
        }
        if (isLessonBeingAdded && !lesson) {
            getLessonById(lessonId).then(res => {
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
        deleteLesson(lesson!.id).then(() => {
            setLessons((prevLessons: Lesson[]) => 
                prevLessons.filter(l => l.id !== lesson.id)
            );
        })
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
 
    const handleExistingNameChange = (e: any) => {
        // setLessons((uInfo: any) => ({
        //     ...uInfo,
        //     title: e.target.value
        // }))
        setLessons((prevLessons: Lesson[]) => 
            prevLessons.map(l => 
                l.id === lesson.id ? { ...l, title: e.target.value } : l
            )
        );
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
            courseId: newLesson!.course.id,
            title: newLesson!.title,
            content: "",
            lessonOrder: 0
        }
        updateLesson(req).then(() => {
            // setLessons((prevLessons: Lesson[]) => [...prevLessons, newLesson]);
            setIsLessonBeingAdded(false);
        })
    };

    const addExistingLesson = (lesson: Lesson) => {
        const req = {
            id: lesson!.id,
            courseId: lesson!.course.id,
            title: lesson!.title,
            content: "",
            lessonOrder: 0
        }
        updateLesson(req).then(() => {
            // setLessons((prevLessons: Lesson[]) => [...prevLessons, newLesson]);
            setIsBeingEdited(false);
        })
    };

    const cancelAddLesson = () => {
        deleteLesson(newLesson!.id).then(() => {
            setIsLessonBeingAdded(false);
        })
    };

    const editLesson = (state: boolean) => {
        setIsBeingEdited(state);
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

    const handleExistingFileUpload = () => {
        if (selectedFile) {
            uploadFile(selectedFile, lesson!.id).then(res => {
                const uploadedFile: FileModel = res.data;
                setUploadedFiles(prevFiles => [...prevFiles, uploadedFile]);
                setLessons((prevLessons: Lesson[]) => 
                    prevLessons.map(l => 
                        l.id === lesson.id ? {
                            ...l,
                            materials: [...(l.materials || []), uploadedFile] 
                        } : l
                    )
                );
                setSelectedFile(null);
            });
        }
    };

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
            setNewLesson((prevLesson: any) => ({
                ...prevLesson,
                materials: prevLesson.materials.filter((m: FileModel) => m.id !== file.id)
            }));
        });
    }

    const removeExistingFile = (file: any) => {
        deleteFile(file.id).then(() => {
            setLessons((prevLessons: Lesson[]) => 
                prevLessons.map(l => 
                    l.id === lesson.id ? {
                        ...l,
                        materials: l.materials.filter((m: FileModel) => m.id !== file.id)
                    } : l
                )
            );
        });
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
            lesson && <div className={"lesson-card-container" + (isBeingEdited ? " is-being-added" : "")}>
                {
                    isBeingEdited ? <>
                    <div className="lesson-header">
                        <input
                            className="lesson-title-input"
                            value={lesson.title}
                            type="text"
                            placeholder="Title"
                            onChange={handleExistingNameChange}
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
                                    <button onClick={handleExistingFileUpload}>
                                        <img src={tickSign}/>
                                    </button>
                                    <button onClick={handleFileCancel}>
                                        <img src={xSign}/>
                                    </button>
                                </>
                            }
                        </div>
                        <div>
                            {lesson.materials && lesson.materials.map((material: FileModel, index: number) => (
                                <div className="file-item" key={material.id}>
                                    <img className="type-icon" src={material.type.startsWith("image/") ? imageIcon : pdfIcon }/>
                                    <span className="file-name">{splitByLastDot(material.name)[0]}</span>
                                    <button onClick={() => removeExistingFile(material)}>
                                        <img src={xSign}/>
                                    </button>
                                    {/* <button onClick={() => downloadFileFromDB(material.id,  material.name)}>Download</button> */}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="buttons-section">
                        <button onClick={() => addExistingLesson(lesson)}>SAVE</button>
                        <button onClick={() => editLesson(false)}>CANCEL</button>
                    </div>
                    </> : <>
                    <div className="lesson-header">
                        <span className="lesson-title" onClick={toggleIsExpanded}>{ lesson.title }</span>
                        <div className="buttons">
                            {
                                isCreateMode && <>
                                    <button className="remove-btn" onClick={removeLesson}>
                                        <img src={minusSign}/>
                                    </button>
                                    <button className="edit-btn" onClick={() => editLesson(true)}>
                                        <span>EDIT</span>
                                    </button>
                                </>
                            }
                            <button className="expand-btn" onClick={toggleIsExpanded}>
                                <img className={(isLessonExpanded ? 'show' : 'hidden')} src={dropdownIcon}/>
                            </button>
                        </div>
                    </div>
                    { (isLessonExpanded) && <div className={"lesson-details" + (isLessonExpanded ? ' show' : ' hidden')}>
                            <div>
                                {lesson.materials && lesson.materials.map((material: any) => (
                                    <div className="file-item" key={material.id}>
                                    <img className="type-icon" src={material.type.startsWith("image/") ? imageIcon : pdfIcon }/>
                                    <span className="file-name clickable" onClick={() => downloadFileFromDB(material.id, material.name)}>{splitByLastDot(material.name)[0]}</span>
                                </div>
                                ))}
                            </div>
                        </div>
                    }
                    </>

                }
                {/* <div className="lesson-header">
                    <span className="lesson-title" onClick={toggleIsExpanded}>{ lesson.title }</span>
                    <div className="buttons">
                        {
                            (isCreateMode || isOwner) && <>
                                <button className="remove-btn" onClick={removeLesson}>
                                    <img src={minusSign}/>
                                </button>
                                <button className="edit-btn" onClick={editLesson}>
                                    <span>EDIT</span>
                                </button>
                            </>
                        }
                        <button className="expand-btn" onClick={toggleIsExpanded}>
                            <img className={(isLessonExpanded ? 'show' : 'hidden')} src={dropdownIcon}/>
                        </button>
                    </div>
                </div>
                { (isLessonExpanded) && <div className={"lesson-details" + (isLessonExpanded ? ' show' : ' hidden')}>
                        <div>
                            {lesson.materials && lesson.materials.map((material: any) => (
                                <div className="file-item" key={material.id}>
                                <img className="type-icon" src={material.type.startsWith("image/") ? imageIcon : pdfIcon }/>
                                <span className="file-name clickable" onClick={() => downloadFileFromDB(material.id, material.name)}>{splitByLastDot(material.name)[0]}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                } */}
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
                    <button onClick={addLesson}>ADD LESSON</button>
                    <button onClick={cancelAddLesson}>CANCEL</button>
                </div>
            </div>
        }
    </>);
}