import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
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

    public userAnswers: Array<string> = [];
    public quizService = inject(QuizService);
    public router = inject(Router);

    public submit(): void {
        this.quizService.computeScore(this.questions ?? [], this.userAnswers);
        this.router.navigateByUrl('/result');
    }

}
