import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
    it('create an instance', () => {
        const pipe = new HighlightPipe();

        expect(pipe).toBeTruthy();
    });

    it('should return input if search is not defined', () => {
        const pipe = new HighlightPipe();

        expect(pipe.transform('text')).toEqual('text');
    });

    it('should return input if search was not found in value', () => {
        const pipe = new HighlightPipe();

        expect(pipe.transform('text', 'search')).toEqual('text');
    });

    it('should return text with highlighted search values', () => {
        const pipe = new HighlightPipe();

        expect(pipe.transform('Easy', 'as')).toEqual('E<b>as</b>y');
    });

    it('should return text with highlighted case insensitive values', () => {
        const pipe = new HighlightPipe();

        expect(pipe.transform('Easy', 'Ea')).toEqual('<b>Ea</b>sy');
    });

    it('should return text with multiple highlighted values', () => {
        const pipe = new HighlightPipe();

        expect(pipe.transform('Angular', 'a')).toEqual('<b>A</b>ngul<b>a</b>r');
    });
});
