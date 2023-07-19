import { Category } from '../data.models';
import { AutocompleteOption } from '../shared/autocomplete/autocomplete-option';
import { map, Observable } from 'rxjs';

export const categoryToAutocompleteOption = (question: Category): AutocompleteOption => ({
    value: question.id.toString(),
    label: question.name,
});

export const categoriesToAutocompleteOptions = (questions: Array<Category>): Array<AutocompleteOption> => questions.map(
    categoryToAutocompleteOption,
);

export const mapCategoriesToAutocompleteOptions = (source: Observable<Array<Category>>): Observable<Array<AutocompleteOption>> => source.pipe(
    map(categoriesToAutocompleteOptions),
);
