import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMakerComponent } from './quiz-maker.component';
import { QuizService } from '../core/quiz.service';
import { stubQuizService } from '../utils/testing/stub-quiz-service';
import { CategoryService } from '../core/category.service';
import { stubCategoryService } from '../utils/testing/stub-categories-service';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AutocompleteComponent } from '../shared/components/autocomplete/autocomplete.component';

describe('GameStatsComponent', () => {
    let component: QuizMakerComponent;
    let fixture: ComponentFixture<QuizMakerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QuizMakerComponent],
            providers: [
                { provide: QuizService, useValue: stubQuizService },
                { provide: CategoryService, useValue: stubCategoryService },
            ],
            imports: [
                ReactiveFormsModule,
                AutocompleteComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();

        fixture = TestBed.createComponent(QuizMakerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
