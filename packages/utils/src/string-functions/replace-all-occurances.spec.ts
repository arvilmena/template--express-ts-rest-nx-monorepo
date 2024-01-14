import { replaceAllOccurances } from './replace-all-occurances';
describe('replaceAllOccurances', () => {
  test('replaces all occurrences of a substring', () => {
    expect(replaceAllOccurances('banana', 'an', 'e')).toBe('beea');
  });

  test('handles empty strings', () => {
    expect(replaceAllOccurances('', 'an', 'e')).toBe('');
    expect(replaceAllOccurances('banana', '', 'e')).toBe('banana');
    expect(replaceAllOccurances('banana', 'an', '')).toBe('ba');
  });

  test('handles cases where the needle is not found', () => {
    expect(replaceAllOccurances('banana', 'x', 'e')).toBe('banana');
  });

  test('works with multiple occurrences', () => {
    expect(replaceAllOccurances('hello world, how are you?', 'o', '*')).toBe(
      'hell* w*rld, h*w are y*u?',
    );
  });
});
