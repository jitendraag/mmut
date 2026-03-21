import unittest
from calc import add, divide, is_positive, clamp, discount_price


# STRONG TEST - checks return value precisely
class TestAdd(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
        self.assertEqual(add(-1, 1), 0)
        self.assertEqual(add(0, 0), 0)


# WEAK TEST - only checks that divide returns something, not the right value
class TestDivide(unittest.TestCase):
    def test_divide(self):
        result = divide(10, 2)
        self.assertIsNotNone(result)


# STRONG TEST - checks both True and False cases
class TestIsPositive(unittest.TestCase):
    def test_is_positive(self):
        self.assertTrue(is_positive(5))
        self.assertFalse(is_positive(-3))
        self.assertFalse(is_positive(0))


# WEAK TEST - only checks lower boundary, misses upper
class TestClamp(unittest.TestCase):
    def test_clamp(self):
        self.assertEqual(clamp(5, 0, 10), 5)
        self.assertEqual(clamp(-5, 0, 10), 0)
        # Missing: doesn't test upper boundary clamping


# STRONG TEST - checks error handling
class TestDivideByZero(unittest.TestCase):
    def test_divide_by_zero(self):
        with self.assertRaises(ValueError):
            divide(10, 0)


# WEAK TEST - doesn't check the actual discounted price
class TestDiscountPrice(unittest.TestCase):
    def test_discount_price(self):
        result = discount_price(100, 20)
        self.assertGreater(result, 0)


if __name__ == "__main__":
    unittest.main()
