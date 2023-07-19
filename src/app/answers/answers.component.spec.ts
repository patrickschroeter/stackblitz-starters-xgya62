import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersComponent } from './answers.component';
import { fakeResults } from '../utils/testing/fake-results';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AnswersComponent', () => {
    let component: AnswersComponent;
    let fixture: ComponentFixture<AnswersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AnswersComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });
        fixture = TestBed.createComponent(AnswersComponent);
        component = fixture.componentInstance;
        component.data = fakeResults;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
