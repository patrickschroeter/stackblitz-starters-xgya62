import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Results } from '../data.models';
import { TrackBy } from '../utils/track-by';

@Component({
    selector: 'app-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswersComponent extends TrackBy {

    @Input()
    public data!: Results;

}
