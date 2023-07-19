import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionComponent } from './question.component';
import { fakeQuestion } from '../utils/testing/fake-question';

describe('QuestionComponent', () => {
    let component: QuestionComponent;
    let fixture: ComponentFixture<QuestionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QuestionComponent],
        });
        fixture = TestBed.createComponent(QuestionComponent);
        component = fixture.componentInstance;
        component.question = fakeQuestion;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
