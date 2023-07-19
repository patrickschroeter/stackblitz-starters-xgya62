import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight',
    standalone: true,
})
export class HighlightPipe implements PipeTransform {

    public transform(value: string, search?: string | null): string {
        if (!search) {
            return value;
        }

        const valueStart = value.toLowerCase().indexOf(search.toLowerCase());

        if (valueStart === -1) {
            return value;
        }

        const valueEnd = valueStart + search.length;

        const firstPart = value.slice(0, valueStart);
        const firstValue = value.slice(valueStart, valueEnd);
        const lastPart = value.slice(valueEnd);


        return `${ firstPart }${ this._markBold(firstValue) }${ this.transform(lastPart, search) }`;
    }

    protected _markBold(value: string): string {
        return `<b>${ value }</b>`;
    }

}
