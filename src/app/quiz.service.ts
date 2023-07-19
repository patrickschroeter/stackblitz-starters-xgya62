import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, Subject } from 'rxjs';
import { ApiQuestion, Category, Difficulty, NestedCategory, Question, Results } from './data.models';

@Injectable({
    providedIn: 'root',
})
export class QuizService {

    protected _allCategories$: Subject<Record<string, NestedCategory>> = new Subject<Record<string, NestedCategory>>();
    public allCategoriesAsList$: Observable<Array<NestedCategory>> = this._allCategories$
        .pipe(
            map(categories => this._categoriesToNestedCategoryList(categories)),
            shareReplay(1),
        );

    private readonly _apiUrl = 'https://opentdb.com/';
    private _latestResults!: Results;

    private readonly _randomThreshold = 0.5;

    constructor(private readonly _http: HttpClient) {
    }

    public fetchAllCategories(): void {
        this._http.get<{ trivia_categories: Array<Category> }>(`${ this._apiUrl }api_category.php`).pipe(
            map(res => res.trivia_categories),
            map(categories => this._categoriesToNestedCategories(categories)),
        )
            .subscribe(categories => {
                this._allCategories$.next(categories);
            });
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


    public hasSubCategories(id: string): boolean {
        return +id < 0;
    }

    protected _generateIdForCategoryWithChildren(id: number): number {
        return -id;
    }

    /**
     * transform a list of categories to a nested tree structure by grouping by name - seperated by ':'
     *
     * @param categories a list of categories to be grouped
     *
     * @protected
     */
    protected _categoriesToNestedCategories(categories: Array<Category>): Record<string, NestedCategory> {
        return categories.reduce((state, category) => {
            const categoryNames = category.name.split(':');
            const primaryCategoryName = categoryNames[0];
            const subCategoryName = categoryNames[1];

            const categoryId = category.id;
            const parentCategoryId = subCategoryName ? this._generateIdForCategoryWithChildren(categoryId) : categoryId;

            // the primary category name is the only identification we have without adding a registry here
            // which would prevent the solution from scaling if new categories are created in the api
            let currentCategory = state[primaryCategoryName];

            if (!currentCategory) {
                currentCategory = {
                    id: parentCategoryId,
                    name: primaryCategoryName,
                    children: [],
                };
            }

            if (subCategoryName) {
                currentCategory.children.push({
                    id: categoryId,
                    name: subCategoryName.trim(),
                });
            }

            return {
                ...state,
                [primaryCategoryName]: currentCategory,
            };
        }, {} as Record<string, NestedCategory>);
    }

    protected _categoriesToNestedCategoryList(categories: Record<string, NestedCategory>): Array<NestedCategory> {
        return Object.values(categories);
    }
}
