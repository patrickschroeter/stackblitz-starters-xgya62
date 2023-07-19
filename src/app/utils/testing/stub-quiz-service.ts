import { QuizService } from '../../quiz.service';
import { Category, Difficulty, Question, Results } from '../../data.models';
import { Observable, of } from 'rxjs';
import { fakeQuestion } from './fake-question';
import { fakeCategory } from './fake-category';
import { fakeResults } from './fake-results';

export const stubQuizService: Partial<QuizService> = {
    computeScore: (_questions: Array<Question>, _answers: Array<string>): void => {},
    createQuiz: (_categoryId: string, _difficulty: Difficulty): Observable<Array<Question>> => of([fakeQuestion]),
    getAllCategories: (): Observable<Array<Category>> => of([fakeCategory]),
    getLatestResults: (): Results => fakeResults,
};
