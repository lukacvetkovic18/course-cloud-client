import { useState } from "react";
import plusSign from "../../assets/plus-sign.png";
import xSign from "../../assets/x-sign.png";
import imageIcon from "../../assets/image-icon.png";
import pdfIcon from "../../assets/pdf-icon.png";
import { FileModel, Lesson } from "../../utils/models";

interface CreateLessonCardProps {
    // setLessons: React.Dispatch<React.SetStateAction<Partial<Lesson>[]>>;
    setLessons: any;
    handleFinishCreatingLesson: () => void;
}

export const CreateLessonCard = ({ setLessons, handleFinishCreatingLesson }: CreateLessonCardProps) => {
    let [newLesson, setNewLesson] = useState<{ id: number, title: string, files: FileModel[] }>({ id: Date.now(), title: "", files: [] });
    let [updatedFiles, setUpdatedFiles] = useState<FileModel[]>([]);

    const handleNameChange = (e: any) => {
        setNewLesson({ ...newLesson, title: e.target.value });
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

    const addLesson = () => {
        const lessonToAdd: Partial<Lesson> = {
            id: newLesson.id,
            title: newLesson.title,
            files: updatedFiles,
            isExpanded: false
        };

        setLessons((prevLessons: Partial<Lesson>[]) => [...prevLessons, lessonToAdd]);
        handleFinishCreatingLesson();
    };

    const cancelAddLesson = () => {
        handleFinishCreatingLesson();
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
        return newLesson.title && updatedFiles.length > 0;
    };

    return (
        <div className="lesson-card-container is-being-added">
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
                <button onClick={addLesson} disabled={!canSaveLesson()}>ADD LESSON</button>
                <button onClick={cancelAddLesson}>CANCEL</button>
            </div>
        </div>
    );
};