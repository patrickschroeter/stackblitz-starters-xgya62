import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuizMakerComponent } from './quiz-maker/quiz-maker.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuestionComponent } from './question/question.component';
import { AnswersComponent } from './answers/answers.component';
import { AutocompleteComponent } from './shared/components/autocomplete/autocomplete.component';

@NgModule({
    declarations: [
        AppComponent,
        QuizMakerComponent,
        QuizComponent,
        QuestionComponent,
        AnswersComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AutocompleteComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
