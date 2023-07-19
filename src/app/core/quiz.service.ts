import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiQuestion, Difficulty, Question, Results } from '../data.models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class QuizService {

    private _latestResults!: Results;

    private readonly _randomThreshold = 0.5;

    constructor(private readonly _http: HttpClient) {
    }

    public createQuiz(categoryId: string, difficulty: Difficulty): Observable<Array<Question>> {
        return this._http.get<{ results: Array<ApiQuestion> }>(
            `${ environment.apiUrl }/api.php?amount=5&category=${ categoryId }&difficulty=${ difficulty.toLowerCase() }&type=multiple`)
            .pipe(
                map(res => {
                    const quiz: Array<Question> = res.results.map(q => (
                        {
                            ...q,
                            all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() >
                                this._randomThreshold)
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
