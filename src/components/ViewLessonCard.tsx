import { useState } from "react";
import dropdownIcon from "../assets/dropdown-icon.png";
import minusSign from "../assets/minus-sign.png";
import imageIcon from "../assets/image-icon.png"
import pdfIcon from "../assets/pdf-icon.png"
import { FileModel, Lesson } from "../utils/models";
import { downloadFile } from "../services/fileService";

interface ViewLessonCardProps {
    lesson: Partial<Lesson>;
    // handleEditLesson: (lesson: Partial<Lesson>) => void;
    handleEditLesson: any;
    // handleDeleteLesson: (lesson: Partial<Lesson>) => void;
    handleDeleteLesson: any;
    isAbleToEdit: boolean;
}

export const ViewLessonCard = ({ lesson, handleEditLesson, handleDeleteLesson, isAbleToEdit }: ViewLessonCardProps) => {
    let [isLessonExpanded, setIsLessonExpanded] = useState<boolean>(false);
    // let [updatedFiles, setUpdatedFiles] = useState<FileModel[]>([]);

    // useEffect(() => {
    //     loadFiles();
    // }, [lesson]);

    // const loadFiles = () => {
    //     getFilesByLessonId(lesson.id!).then(res => {
    //         const files = res.data.map((file: any) => ({
    //             id: file.id,
    //             name: file.name,
    //             type: file.type,
    //             file: new File([new Blob([file.data], { type: file.type })], file.name, { type: file.type }),
    //             createdAt: file.createdAt
    //         }));
    //         setUpdatedFiles(files);
    //     }).catch(() => {
    //         setUpdatedFiles(lesson.files!);
    //     });
    // };
    const toggleIsExpanded = () => {
        setIsLessonExpanded(!isLessonExpanded);
    };

    const splitByLastDot = (filename: string) => {
        const lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex === -1) {
            return [filename, ""];
        }
        const name = filename.substring(0, lastDotIndex);
        const extension = filename.substring(lastDotIndex + 1);
        return [name, extension];
    };
    
    const downloadFileFromDB = (fileId: number, fileName: string) => {
        console.log(fileId)
        downloadFile(fileId)
            .then(response => {
                console.log(response)
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

    return (
        <div className="lesson-card-container">
            <div className="lesson-header">
                <span className="lesson-title" onClick={toggleIsExpanded}>
                    {lesson.title}
                </span>
                <div className="buttons">
                    {isAbleToEdit && (
                        <>
                            <button className="remove-btn" onClick={() => handleDeleteLesson(lesson)}>
                                <img src={minusSign} />
                            </button>
                            <button className="edit-btn" onClick={() => handleEditLesson(lesson)}>
                                <span>EDIT</span>
                            </button>
                        </>
                    )}
                    <button className="expand-btn" onClick={toggleIsExpanded}>
                        <img className={isLessonExpanded ? "show" : "hidden"} src={dropdownIcon} />
                    </button>
                </div>
            </div>
            {isLessonExpanded && (
                <div className={"lesson-details" + (isLessonExpanded ? " show" : " hidden")}>
                    <div>
                        {lesson.files && lesson.files.map((material: FileModel) => (
                            <div className="file-item" key={material.id}>
                                <img className="type-icon" src={material.type.startsWith("image/") ? imageIcon : pdfIcon} />
                                { isAbleToEdit ?
                                <span className="file-name">{splitByLastDot(material.name)[0]}</span> :
                                <span className="file-name clickable" onClick={() => downloadFileFromDB(material.id, material.name)}>{splitByLastDot(material.name)[0]}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};