import { useEffect, useState } from "react";
import plusSign from "../../assets/plus-sign.png";
import xSign from "../../assets/x-sign.png";
import imageIcon from "../../assets/image-icon.png";
import pdfIcon from "../../assets/pdf-icon.png";
import { FileModel, Lesson } from "../../utils/models";

interface EditLessonCardProps {
    lesson: Partial<Lesson>;
    // setLessons: React.Dispatch<React.SetStateAction<Partial<Lesson>[]>>;
    setLessons: any;
    handleFinishEditingLesson: () => void;
}

export const EditLessonCard = ({ lesson, setLessons, handleFinishEditingLesson }: EditLessonCardProps) => {
    let [editedLesson, setEditedLesson] = useState<Partial<Lesson>>(lesson);
    let [updatedFiles, setUpdatedFiles] = useState<FileModel[]>([]);

    useEffect(() => {
        if(lesson.files) {
            setUpdatedFiles(lesson.files);
        }
    }, [lesson]);

    const handleNameChange = (e: any) => {
        setEditedLesson({ ...editedLesson, title: e.target.value });
    };

    const handleFileChange = (e: any) => {
        const files: File[] = Array.from(e.target.files);
        const newFileModels = files.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            type: file.type,
            file: file,
            createdAt: new Date().toISOString()
        }));

        setUpdatedFiles(prevFiles => [...prevFiles, ...newFileModels]);
    };

    const removeFile = (file: FileModel) => {
        setUpdatedFiles(prevFiles => prevFiles.filter(f => f.id !== file.id));
    };

    const updateLesson = () => {
        const lessonToUpdate: Partial<Lesson> = {
            ...editedLesson,
            title: editedLesson.title,
            files: updatedFiles,
            isExpanded: false
        };

        setLessons((prevLessons: Partial<Lesson>[]) =>
            prevLessons.map(l => (l.id === lesson.id ? lessonToUpdate : l))
        );
        handleFinishEditingLesson();
    };

    const cancelEditLesson = () => {
        handleFinishEditingLesson();
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

    const canSaveLesson = () => {
        return editedLesson.title && updatedFiles.length > 0;
    };

    return (
        <div className="lesson-card-container is-being-added">
            <div className="lesson-header">
                <input
                    className="lesson-title-input"
                    value={editedLesson.title}
                    type="text"
                    placeholder="Title"
                    onChange={handleNameChange}
                />
            </div>
            <div className="lesson-details show">
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
            </div>
            <div className="buttons-section">
                <button onClick={updateLesson} disabled={!canSaveLesson()}>SAVE LESSON</button>
                <button onClick={cancelEditLesson}>CANCEL</button>
            </div>
        </div>
    );
};