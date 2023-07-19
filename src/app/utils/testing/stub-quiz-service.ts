import { QuizService } from '../../core/quiz.service';
import { Difficulty, Question, Results } from '../../data.models';
import { Observable, of } from 'rxjs';
import { fakeQuestion } from './fake-question';
import { fakeResults } from './fake-results';

export const stubQuizService: Partial<QuizService> = {
    computeScore: (_questions: Array<Question>, _answers: Array<string>): void => {},
    createQuiz: (_categoryId: string, _difficulty: Difficulty): Observable<Array<Question>> => of([fakeQuestion]),
    getLatestResults: (): Results => fakeResults,
    swapQuestion: () => {},
};
