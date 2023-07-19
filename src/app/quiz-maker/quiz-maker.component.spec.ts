import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMakerComponent } from './quiz-maker.component';
import { QuizService } from '../quiz.service';
import { stubQuizService } from '../utils/testing/stub-quiz-service';

describe('GameStatsComponent', () => {
    let component: QuizMakerComponent;
    let fixture: ComponentFixture<QuizMakerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QuizMakerComponent],
            providers: [
                { provide: QuizService, useValue: stubQuizService },
            ],
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
