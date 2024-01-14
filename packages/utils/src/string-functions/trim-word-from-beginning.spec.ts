import { trimWordFromBeginning } from './trim-word-from-beginning'; // Replace with the correct path to your function

describe('trimWordFromBeginning', () => {
  test('trims word from beginning and trims whitespace', () => {
    expect(
      trimWordFromBeginning('window.REDUX_STATE = {', 'window.REDUX_STATE ='),
    ).toBe('{');
  });

  test('does not modify string if word is not at the beginning', () => {
    expect(
      trimWordFromBeginning('some other string', 'window.REDUX_STATE ='),
    ).toBe('some other string');
  });

  test('handles empty strings', () => {
    expect(trimWordFromBeginning('', 'window.REDUX_STATE =')).toBe('');
    expect(trimWordFromBeginning('window.REDUX_STATE =', '')).toBe(
      'window.REDUX_STATE =',
    );
  });

  test('trims leading and trailing whitespace', () => {
    expect(
      trimWordFromBeginning(
        '  window.REDUX_STATE =  {',
        'window.REDUX_STATE =',
      ),
    ).toBe('{');
  });

  test('trims from a multi-word subject', () => {
    expect(
      trimWordFromBeginning(
        'hello window.REDUX_STATE = world',
        'window.REDUX_STATE =',
      ),
    ).toBe('hello window.REDUX_STATE = world');
  });
});
