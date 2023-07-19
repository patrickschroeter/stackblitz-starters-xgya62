import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TrackBy } from '../../utils/track-by';
import { AutocompleteOption } from './autocomplete-option';

@Component({
    standalone: true,
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        FormsModule,
        NgForOf,
        ReactiveFormsModule,
        NgIf,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutocompleteComponent),
            multi: true,
        },
    ],
})
export class AutocompleteComponent extends TrackBy implements ControlValueAccessor {

    @Input({ required: true }) public options?: Array<AutocompleteOption> | null;
    @Input() public placeholder?: string;

    public value?: string;
    public isDisabled = false;

    public onChange?: (value: string) => void;
    public onTouched?: () => void;

    public writeValue(value: string): void {
        this.value = value;
        this.onChange?.(value);
    }

    public registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

}
