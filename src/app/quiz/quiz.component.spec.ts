import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizComponent } from './quiz.component';
import { QuizService } from '../quiz.service';

describe('QuizComponent', () => {
    let component: QuizComponent;
    let fixture: ComponentFixture<QuizComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QuizComponent],
            providers: [
                { provide: QuizService, useValue: {} },
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
