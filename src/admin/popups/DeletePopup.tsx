import { deleteCourse, deleteLesson, deleteQuiz, deleteUser } from "../../services/adminService";
import { Course, Lesson, Quiz, User } from "../../utils/models";

interface DeletePopupProps {
    item: User | Course | Lesson | Quiz;
    closeDeletePopup: () => void;
}

function isUser(item: User | Course | Lesson | Quiz): item is User {
    return (item as User).firstName !== undefined && (item as User).lastName !== undefined;
}

function isCourse(item: User | Course | Lesson | Quiz): item is Course {
    return (item as Course).shortDescription !== undefined;
}

function isLesson(item: User | Course | Lesson | Quiz): item is Lesson {
    return (item as Lesson).files !== undefined;
}

function isQuiz(item: User | Course | Lesson | Quiz): item is Quiz {
    return (item as Quiz).questions !== undefined;
}

export const DeletePopup = ({item, closeDeletePopup}: DeletePopupProps) => {
    
    const removeItem = () => {
        console.log(isUser(item) + " " + isCourse(item) + " " + isLesson(item) + " " + isQuiz(item))
        if (isUser(item)) {
            deleteUser(item.id).then(() => {
                closeDeletePopup();
            });
        } else if (isCourse(item)) {
            deleteCourse(item.id).then(() => {
                closeDeletePopup();
            });
        } else if (isLesson(item)) {
            deleteLesson(item.id).then(() => {
                closeDeletePopup();
            });
        } else if (isQuiz(item)) {
            deleteQuiz(item.id).then(() => {
                closeDeletePopup();
            });
        }
    };

    return (<>
        <div className="delete-popup-container">
            <div className="warning-text">
                <span>
                    Are you sure that you want to delete{" "}
                    {isUser(item)
                        ? "User"
                        : isCourse(item)
                        ? "Course"
                        : isLesson(item)
                        ? "Lesson"
                        : "Quiz"}{" "}
                    with name{" "}
                    {isUser(item)
                        ? item.firstName + " " + item.lastName
                        : item.title}?
                </span>
            </div>
            <div className="buttons">
                <button onClick={removeItem}>PROCEED</button>
                <button onClick={closeDeletePopup}>CANCEL</button>
            </div>
        </div>
    </>);
}