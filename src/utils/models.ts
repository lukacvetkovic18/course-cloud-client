export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    isActive: boolean;
    profilePicture: string;
    phoneNumber: string;
    instagram: string;
    linkedIn: string;
    userRoles: UserRole[];
    createdAt: Date;
    slug: string;
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
    owner: User;
    createdAt: Date;
    slug: string;
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
    // materials: FileModel[];
    files: FileModel[];
    isExpanded: boolean;
    createdAt: Date;
}

export interface FileModel {
    id: number;
    name: string;
    type: string;
    // data: Uint8Array;
    file: File;
    createdAt: string;
}

export interface Quiz {
    id: number;
    title: string;
    course: Course;
    createdAt: Date;
    questions: Question[];
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

export interface QuizAttempt {
    id: number;
    user: User;
    quiz: Quiz;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
}

export interface QuizAttemptAnswer {
    id: number;
    quizAttempt: QuizAttempt;
    question: Question;
    selectedAnswer: Answer;
    textAnswer: string;
    isCorrect: boolean;
}
