import { addForTest } from '../src/utils/math';

test('add function should add two numbers correctly', () => {
  expect(addForTest(2, 3)).toBe(5);
  expect(addForTest(8, 3)).toBe(11);
});
