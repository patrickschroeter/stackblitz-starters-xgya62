import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, withLatestFrom } from 'rxjs';
import { ApiQuestion, Difficulty, Question, Results } from '../data.models';
import { environment } from '../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface QuizOptions {
    categoryId: string;
    difficulty: Difficulty;
}

@Injectable({
    providedIn: 'root',
})
export class QuizService {

    protected _currentOptions$ = new BehaviorSubject<QuizOptions | undefined>(undefined);
    protected _currentQuiz$ = new BehaviorSubject<Array<Question>>([]);
    public currentQuiz$ = this._currentQuiz$.asObservable();

    private _latestResults!: Results;

    private readonly _randomThreshold = 0.5;

    constructor(private readonly _http: HttpClient) {
        this._currentOptions$.pipe(
            filter(Boolean),
            switchMap(options => this._getQuestions$(options)),
            takeUntilDestroyed(),
        )
            .subscribe(result => this._currentQuiz$.next(result));
    }

    public createQuiz(categoryId: string, difficulty: Difficulty): void {
        this._currentOptions$.next({ categoryId, difficulty });
    }

    public swapQuestion(index: number): void {
        this._currentOptions$.pipe(
            take(1),
            filter(Boolean),
            switchMap(options => this._getQuestions$(options, 1)),
            map(questions => questions[0]),
            filter(Boolean),
            withLatestFrom(this._currentQuiz$),
        )
            .subscribe(([newQuestion, currentQuestions]) => {
                // Possible Optimization: if the new question is already part of the exising list, fetch a new one
                const newQuestions = [...currentQuestions].map((question, i) => i === index ? newQuestion : question);

                this._currentQuiz$.next(newQuestions);
            });
    }

    protected _getQuestions$(
        { categoryId, difficulty }: QuizOptions,
        amount: number = 5,
    ): Observable<Array<Question>> {
        const queryParams = `amount=${ amount }&category=${ categoryId }&difficulty=${ difficulty.toLowerCase() }&type=multiple`;

        return this._http.get<{ results: Array<ApiQuestion> }>(
            `${ environment.apiUrl }/api.php?${ queryParams }`)
            .pipe(
                map(res => {
                    const quiz: Array<Question> = res.results.map(q => (
                        {
                            ...q,
                            all_answers: [...q.incorrect_answers, q.correct_answer]
                                .sort(() => (Math.random() > this._randomThreshold) ? 1 : -1),
                        }
                    ));

                    return quiz;
                }),
                catchError(O_o => {
                    console.error(O_o);

                    return of([]);
                }),
            );
    }

    public computeScore(questions: Array<Question>, answers: Array<string>): void {
        let score = 0;

        questions.forEach((q, index) => {
            if (q.correct_answer === answers[index]) {
                score++;
            }
        });
        this._latestResults = { questions, answers, score };
    }

    public getLatestResults(): Results {
        return this._latestResults;
    }
}
