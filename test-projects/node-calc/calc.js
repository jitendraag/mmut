function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function isEven(n) {
  return n % 2 === 0;
}

function max(a, b) {
  if (a > b) {
    return a;
  }
  return b;
}

function factorial(n) {
  if (n < 0) {
    throw new Error("Negative numbers not allowed");
  }
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

module.exports = { add, multiply, isEven, max, factorial };
