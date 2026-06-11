function sum(a, b) {
  return a + b;
}

test('addition', () => {
  expect(sum(2, 3)).toBe(5);
});