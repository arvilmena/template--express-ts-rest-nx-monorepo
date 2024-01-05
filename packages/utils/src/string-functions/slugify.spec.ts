import { describe, expect, test } from '@jest/globals';
import { slugify } from './slugify';

describe('should work', () => {
  test('slugify should convert PSE:ABS to pse-abs', () => {
    const input = 'PSE:ABS';
    const expected = 'pse-abs';

    expect(slugify(input)).toBe(expected);
  });

  test('slugify should convert spaces to hyphens', () => {
    const input = 'Hello World!';
    const expected = 'hello-world';

    expect(slugify(input)).toBe(expected);
  });

  test('slugify should remove non-alphanumeric characters', () => {
    const input = 'My #awesome blog post!';
    const expected = 'my-awesome-blog-post';

    expect(slugify(input)).toBe(expected);
  });

  test('slugify should handle uppercase characters', () => {
    const input = 'This is My Title';
    const expected = 'this-is-my-title';

    expect(slugify(input)).toBe(expected);
  });
});
