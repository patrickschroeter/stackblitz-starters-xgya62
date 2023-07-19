import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Question } from '../data.models';
import { QuizService } from '../core/quiz.service';
import { Router } from '@angular/router';
import { TrackBy } from '../utils/track-by';

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent extends TrackBy {

    @Input()
    public questions: Array<Question> | null = [];

    @Input()
    public isSwapEnabled = false;

    @Output()
    public readonly swap = new EventEmitter<{ question: Question; index: number }>();

    public userAnswers: Array<string> = [];
    public quizService = inject(QuizService);
    public router = inject(Router);

    public submit(): void {
        this.quizService.computeScore(this.questions ?? [], this.userAnswers);
        this.router.navigateByUrl('/result');
    }

    public swapQuestion(question: Question, index: number): void {
        this.swap.emit({ question, index });
    }

}
