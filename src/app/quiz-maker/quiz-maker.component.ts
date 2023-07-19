import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable } from 'rxjs';
import { QuizService } from '../quiz.service';
import { TrackBy } from '../utils/track-by';

@Component({
    selector: 'app-quiz-maker',
    templateUrl: './quiz-maker.component.html',
    styleUrls: ['./quiz-maker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizMakerComponent extends TrackBy {

    public categories$: Observable<Array<Category>>;
    public questions$!: Observable<Array<Question>>;

    constructor(protected _quizService: QuizService) {
        super();

        this.categories$ = _quizService.getAllCategories();
    }

    public createQuiz(cat: string, difficulty: string): void {
        this.questions$ = this._quizService.createQuiz(cat, difficulty as Difficulty);
    }
}
