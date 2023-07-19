import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../data.models';
import { TrackBy } from '../utils/track-by';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent extends TrackBy {

    @Input({ required: true })
    public question!: Question;
    @Input()
    public correctAnswer?: string;
    @Input()
    public userAnswer?: string;
    @Input()
    public isSwapEnabled = false;

    @Output()
    public readonly change = new EventEmitter<string>();

    @Output()
    public readonly swap = new EventEmitter<Question>();

    public currentSelection!: string;

    public getButtonClass(answer: string): string {
        if (!this.userAnswer) {
            if (this.currentSelection === answer) {
                return 'tertiary';
            }
        } else {
            if (this.userAnswer === this.correctAnswer && this.userAnswer === answer) {
                return 'tertiary';
            }

            if (answer === this.correctAnswer) {
                return 'secondary';
            }
        }

        return 'primary';
    }

    public buttonClicked(answer: string): void {
        this.currentSelection = answer;
        this.change.emit(answer);
    }

    public swapQuestion(question: Question): void {
        this.swap.emit(question);
    }
}
