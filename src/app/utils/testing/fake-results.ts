import { Results } from '../../data.models';
import { fakeQuestion } from './fake-question';

export const fakeResults: Results = {
    questions: [fakeQuestion],
    answers: ['Yes'],
    score: 1,
};
