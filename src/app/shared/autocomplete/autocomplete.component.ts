import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TrackBy } from '../../utils/track-by';
import { AutocompleteOption } from './autocomplete-option';

const timeoutToAllowClickBeforeClosingOverlayInMS = 10;

@Component({
    standalone: true,
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
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

    public value?: AutocompleteOption;
    public isDisabled = false;
    public isOverlayOpen = false;

    public onChange?: (value: string) => void;
    public onTouched?: () => void;

    public writeValue(option: AutocompleteOption): void {
        console.log('# value:\n', option);
        this.value = option;
        this.onChange?.(option.value);
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

    public openOverlay(): void {
        this.isOverlayOpen = true;
    }
    public closeOverlay(): void {
        setTimeout(() => {
            this.isOverlayOpen = false;
        }, timeoutToAllowClickBeforeClosingOverlayInMS);
    }

}
