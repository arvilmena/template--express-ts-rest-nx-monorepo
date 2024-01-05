import { expect, test } from '@jest/globals';
import { dailyCategoryToHumanReadable } from './daily-category.functions';

test('should remove trailing underscore and numbers', () => {
  const inputString = 'filename_12345';
  const expectedOutput = 'filename';

  const output = dailyCategoryToHumanReadable({
    name: inputString,
    source: 'sws',
  });

  expect(output).toBe(`${expectedOutput} - (Simply Wall Street)`);
});

test('should not modify string without trailing underscore and numbers', () => {
  const inputString = 'test_string';
  const expectedOutput = 'test_string';

  const output = dailyCategoryToHumanReadable({
    name: inputString,
    source: 'sws',
  });

  expect(output).toBe(`${expectedOutput} - (Simply Wall Street)`);
});

test('should handle strings ending with numbers only', () => {
  const inputString = 'numbers123';
  const expectedOutput = 'numbers123'; // No change expected

  const output = dailyCategoryToHumanReadable({
    name: inputString,
    source: 'sws',
  });

  expect(output).toBe(`${expectedOutput} - (Simply Wall Street)`);
});
test('should not truncate numbers when not SWS', () => {
  const inputString = 'numbers123_123';
  const expectedOutput = 'numbers123_123'; // No change expected

  expect(
    dailyCategoryToHumanReadable({
      name: inputString,
      source: 'pse',
    })
  ).toBe(`${expectedOutput} - (PSE)`);

  expect(
    dailyCategoryToHumanReadable({
      name: inputString,
      source: 'investa',
    })
  ).toBe(`${expectedOutput} - (Investa)`);
});
