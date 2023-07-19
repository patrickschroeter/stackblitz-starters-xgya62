import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Difficulty, Question } from '../data.models';
import { filter, map, Observable, tap, withLatestFrom } from 'rxjs';
import { QuizService } from '../core/quiz.service';
import { TrackBy } from '../utils/track-by';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryService } from '../core/category.service';
import { AutocompleteOption } from '../shared/components/autocomplete/autocomplete-option';
import { mapCategoriesToAutocompleteOptions } from '../utils/category-to-autocomplete-option';

interface QuizForm {
    category: FormControl<string | null>;
    difficulty: FormControl<string | null>;
    subCategory: FormControl<string | null>;
}

@Component({
    selector: 'app-quiz-maker',
    templateUrl: './quiz-maker.component.html',
    styleUrls: ['./quiz-maker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizMakerComponent extends TrackBy {

    public categories$: Observable<Array<AutocompleteOption>>;
    public subCategories$?: Observable<Array<AutocompleteOption>>;
    public questions$?: Observable<Array<Question>>;

    public quizForm = new FormGroup<QuizForm>({
        category: new FormControl(''),
        difficulty: new FormControl(''),
        subCategory: new FormControl(''),
    });

    public errorMessage?: string;
    public numberOfSwaps = 0;

    public difficulties: Array<AutocompleteOption> = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ];

    constructor(
        protected _quizService: QuizService,
        protected _categoryService: CategoryService,
    ) {
        super();

        this._categoryService.fetchAllCategories();

        this.categories$ = _categoryService.allCategoriesAsList$
            .pipe(mapCategoriesToAutocompleteOptions);

        this.subCategories$ = this.quizForm.get('category')?.valueChanges
            .pipe(
                tap(() => this.quizForm.get('subCategory')?.setValue('')),
                tap(() => this.errorMessage = undefined),
                filter((value): value is string => value !== null),
                withLatestFrom(this._categoryService.allCategoriesAsList$),
                map(([value, categories]) => categories.find(category => category.id === +value)?.children || []),
                mapCategoriesToAutocompleteOptions,
            );

        this.questions$ = this._quizService.currentQuiz$;
    }

    public createQuiz(options: FormGroup<QuizForm>['value']): void {
        if (!options.category) {
            this.errorMessage = 'Please Select a category';

            return;
        }

        if (this._categoryService.hasSubCategories(options.category) && !options.subCategory) {
            this.errorMessage = 'Please Select a sub-category';

            return;
        }

        if (!options.difficulty) {
            this.errorMessage = 'Please Select a difficulty';

            return;
        }

        this.errorMessage = undefined;

        this._quizService.createQuiz(options.subCategory || options.category, options.difficulty as Difficulty);
    }

    public get isSwapEnabled(): boolean {
        return this.numberOfSwaps < 1;
    }

    public swapQuestion(event: { question: Question; index: number }): void {
        this._quizService.swapQuestion(event.index);
        this.numberOfSwaps = this.numberOfSwaps + 1;
    }

}
