import { ChangeDetectionStrategy, Component, forwardRef, HostListener, Input } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TrackBy } from '../../../utils/track-by';
import { AutocompleteOption } from './autocomplete-option';
import { BehaviorSubject, debounceTime, map, Observable, Subject } from 'rxjs';
import { HighlightPipe } from '../../pipes/highlight/highlight.pipe';

const timeoutToAllowClickBeforeClosingOverlayInMS = 100;

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
        HighlightPipe,
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

    @HostListener('document:click', ['$event'])
    public onKeyUp(): void {
        if (this._isOverlayOpen$.getValue()) {
            this._isOverlayOpen$.next(false);
        }
    }

    public value?: AutocompleteOption;
    public isDisabled = false;

    protected _isOverlayOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isOverlayOpen$: Observable<boolean> = this._isOverlayOpen$
        .pipe(
            debounceTime(timeoutToAllowClickBeforeClosingOverlayInMS),
        );

    public onChange?: (value: string) => void;
    public onTouched?: () => void;

    public search$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public filteredOptions$: Observable<Array<AutocompleteOption>> = this.search$
        .pipe(
            map(search => this._filterOptionsBySearch(this.options || [], search)),
            debounceTime(timeoutToAllowClickBeforeClosingOverlayInMS),
        );

    public writeValue(option: AutocompleteOption): void {
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

    public openOverlay(event: Event): void {
        this._isOverlayOpen$.next(true);
        event.stopPropagation();
    }

    public selectValue(event: Event, value: AutocompleteOption): void {
        this.writeValue(value);
        this.onTouched?.();
        this.filterOptions('');
        this._isOverlayOpen$.next(false);
        event.stopPropagation();
    }

    public filterOptions(search: string): void {
        // Known issue: if you remove the search value the component value is still the same but not displayed
        this.search$.next(search);
    }

    protected _filterOptionsBySearch(options: Array<AutocompleteOption>, search: string): Array<AutocompleteOption> {
        if (!search) {
            return options;
        }

        const lowerCaseSearch = search.toLowerCase();

        return options.filter(option => option.label.toLowerCase().includes(lowerCaseSearch));
    }

}
