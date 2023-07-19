export interface Category {
    id: number;
    name: string;
}

export type NestedCategory = Category & {
    children: Array<Category>;
};

export interface ApiQuestion {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
}

export interface Question {
    question: string;
    correct_answer: string;
    incorrect_answers: Array<string>;
    all_answers: Array<string>;
}

export interface Results {
    questions: Array<Question>;
    answers: Array<string>;
    score: number;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
