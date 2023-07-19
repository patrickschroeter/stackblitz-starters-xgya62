import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, Subject } from 'rxjs';
import { Category, NestedCategory } from '../data.models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {

    protected _allCategories$: Subject<Record<string, NestedCategory>> = new Subject<Record<string, NestedCategory>>();
    public allCategoriesAsList$: Observable<Array<NestedCategory>> = this._allCategories$
        .pipe(
            map(categories => this._categoriesToNestedCategoryList(categories)),
            shareReplay(1),
        );

    constructor(private readonly _http: HttpClient) {
    }

    public fetchAllCategories(): void {
        this._http.get<{ trivia_categories: Array<Category> }>(`${ environment.apiUrl }api_category.php`).pipe(
            map(res => res.trivia_categories),
            map(categories => this._categoriesToNestedCategories(categories)),
        )
            .subscribe(categories => {
                this._allCategories$.next(categories);
            });
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
