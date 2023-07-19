import { of } from 'rxjs';
import { CategoryService } from '../../core/category.service';
import { fakeCategory } from './fake-category';

export const stubCategoryService: Partial<CategoryService> = {
    allCategoriesAsList$: of([fakeCategory]),
    fetchAllCategories: () => {},
    hasSubCategories: () => true,
};
