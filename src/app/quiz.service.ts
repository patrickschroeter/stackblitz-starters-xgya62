import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiQuestion, Category, Difficulty, Question, Results } from './data.models';

@Injectable({
    providedIn: 'root',
})
export class QuizService {

    private readonly _apiUrl = 'https://opentdb.com/';
    private _latestResults!: Results;

    private readonly _randomThreshold = 0.5;

    constructor(private readonly _http: HttpClient) {
    }

    public getAllCategories(): Observable<Array<Category>> {
        return this._http.get<{ trivia_categories: Array<Category> }>(`${ this._apiUrl }api_category.php`).pipe(
            map(res => res.trivia_categories),
        );
    }

    public createQuiz(categoryId: string, difficulty: Difficulty): Observable<Array<Question>> {
        return this._http.get<{ results: Array<ApiQuestion> }>(
            `${ this._apiUrl }/api.php?amount=5&category=${ categoryId }&difficulty=${ difficulty.toLowerCase() }&type=multiple`)
            .pipe(
                map(res => {
                    const quiz: Array<Question> = res.results.map(q => (
                        {
                            ...q,
                            all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > this._randomThreshold)
                                ? 1
                                : -1),
                        }
                    ));

                    return quiz;
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
