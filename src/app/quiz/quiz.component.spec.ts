import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizComponent } from './quiz.component';
import { QuizService } from '../core/quiz.service';
import { stubQuizService } from '../utils/testing/stub-quiz-service';

describe('QuizComponent', () => {
    let component: QuizComponent;
    let fixture: ComponentFixture<QuizComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QuizComponent],
            providers: [
                { provide: QuizService, useValue: stubQuizService },
            ],
        });
        fixture = TestBed.createComponent(QuizComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
