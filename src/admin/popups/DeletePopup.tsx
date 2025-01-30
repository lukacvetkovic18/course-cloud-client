import { Course, Lesson, Quiz, User } from "../../utils/models";

interface DeletePopupProps {
    item: User | Course | Lesson | Quiz;
    closeDeletePopup: () => void;
}

function isUser(item: User | Course | Lesson | Quiz): item is User {
    return (item as User).firstName !== undefined && (item as User).lastName !== undefined;
}

function isCourse(item: User | Course | Lesson | Quiz): item is Course {
    return (item as Course).title !== undefined;
}

function isLesson(item: User | Course | Lesson | Quiz): item is Lesson {
    return (item as Lesson).title !== undefined;
}

function isQuiz(item: User | Course | Lesson | Quiz): item is Quiz {
    return (item as Quiz).title !== undefined;
}

export const DeletePopup = ({item, closeDeletePopup}: DeletePopupProps) => {
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
                            : item.title}
                    </span>
            </div>
            <div className="buttons">
                <button>PROCEED</button>
                <button>CANCEL</button>
            </div>
        </div>
    </>);
}