export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    isActive: string;
    profilePicture: string;
    phoneNumber: string;
    instagram: string;
    linkedIn: string;
    userRoles: UserRole[];
}

export interface UserRole {
    id: number;
    name: string;
}

export interface Course {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    isActive: boolean;
    image: string;
}

export interface Enrollment {
    id: number;
    user: User;
    course: Course;
}

export interface Lesson {
    id: number;
    course: Course;
    title: string;
    description: string;
    materials: FileModel[];
    lessonOrder: number;
    isExpanded: boolean;
}

export interface FileModel {
    id: number;
    name: string;
    type: string;
}

export interface LessonCoverage {
    id: number;
    user: User;
    lesson: Lesson;
    isCovered: boolean;
}

export interface Quiz {
    id: number;
    title: string;
    course: Course;
}

export interface QuestionType {
    id: number;
    name: string;
}

export interface Question {
    id: number;
    title: string;
    questionType: QuestionType;
    quiz: Quiz;
    answers: Answer[];
    isBeingEdited: boolean;
}

export interface Answer {
    id: number;
    title: string;
    isCorrect: boolean;
    question: Question;
}

export interface UserAnswer {
    id: number;
    title: string;
    user: User;
    question: Question;
    isCorrect: boolean;
}