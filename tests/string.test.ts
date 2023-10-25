import { upperCaseForTest } from './../src/utils/string';

test('upperCase function should upper case a string', () => {
  expect(upperCaseForTest('hello')).toBe('HELLO');
  expect(upperCaseForTest('world')).toBe('WORLD');
});
