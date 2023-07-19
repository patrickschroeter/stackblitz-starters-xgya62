import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Category, Difficulty, NestedCategory, Question } from '../data.models';
import { filter, map, Observable, tap, withLatestFrom } from 'rxjs';
import { QuizService } from '../quiz.service';
import { TrackBy } from '../utils/track-by';
import { FormControl, FormGroup } from '@angular/forms';

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

    public categories$: Observable<Array<NestedCategory>>;
    public subCategories$?: Observable<Array<Category>>;
    public questions$?: Observable<Array<Question>>;

    public quizForm = new FormGroup<QuizForm>({
        category: new FormControl(''),
        difficulty: new FormControl(''),
        subCategory: new FormControl(''),
    });

    public errorMessage?: string;

    constructor(protected _quizService: QuizService) {
        super();

        this._quizService.fetchAllCategories();

        this.categories$ = _quizService.allCategoriesAsList$;

        this.subCategories$ = this.quizForm.get('category')?.valueChanges
            .pipe(
                tap(() => this.quizForm.get('subCategory')?.setValue('')),
                tap(() => this.errorMessage = undefined),
                filter((value): value is string => value !== null),
                withLatestFrom(this.categories$),
                map(([value, categories]) => categories.find(category => category.id === +value)?.children || []),
            );
    }

    public createQuiz(options: FormGroup<QuizForm>['value']): void {
        if (!options.category) {
            this.errorMessage = 'Please Select a category';

            return;
        }

        if (this._quizService.hasSubCategories(options.category) && !options.subCategory) {
            this.errorMessage = 'Please Select a sub-category';

            return;
        }

        if (!options.difficulty) {
            this.errorMessage = 'Please Select a difficulty';

            return;
        }

        this.errorMessage = undefined;

        this.questions$ = this._quizService.createQuiz(options.subCategory || options.category, options.difficulty as Difficulty);
    }

}
