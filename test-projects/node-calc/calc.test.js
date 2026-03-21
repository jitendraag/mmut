const { add, multiply, isEven, max, factorial } = require("./calc");

// STRONG TEST
test("add returns correct sum", () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
});

// WEAK TEST - only checks one case, doesn't verify the actual product
test("multiply works", () => {
  const result = multiply(3, 4);
  expect(result).toBeTruthy();
});

// STRONG TEST
test("isEven correctly identifies even and odd", () => {
  expect(isEven(4)).toBe(true);
  expect(isEven(3)).toBe(false);
  expect(isEven(0)).toBe(true);
});

// WEAK TEST - only checks one direction
test("max returns a number", () => {
  expect(max(3, 5)).toBe(5);
  // Missing: doesn't test when a > b
});

// STRONG TEST
test("factorial throws on negative input", () => {
  expect(() => factorial(-1)).toThrow("Negative numbers not allowed");
});

// WEAK TEST - doesn't check the actual value
test("factorial returns something for positive numbers", () => {
  const result = factorial(5);
  expect(result).toBeGreaterThan(0);
});
