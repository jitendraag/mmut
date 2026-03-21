package calc

import (
	"testing"
)

// STRONG TEST
func TestAdd(t *testing.T) {
	if Add(2, 3) != 5 {
		t.Error("expected 5")
	}
	if Add(-1, 1) != 0 {
		t.Error("expected 0")
	}
}

// WEAK TEST - only checks positive input
func TestAbs(t *testing.T) {
	result := Abs(5)
	if result != 5 {
		t.Errorf("expected 5, got %d", result)
	}
	// Missing: doesn't test negative input (the interesting case)
}

// STRONG TEST
func TestIsPrime(t *testing.T) {
	if IsPrime(7) != true {
		t.Error("7 should be prime")
	}
	if IsPrime(4) != false {
		t.Error("4 should not be prime")
	}
	if IsPrime(1) != false {
		t.Error("1 should not be prime")
	}
}

// WEAK TEST - only checks that no error, doesn't check the value
func TestSafeDivide(t *testing.T) {
	_, err := SafeDivide(10, 2)
	if err != nil {
		t.Error("unexpected error")
	}
}

// STRONG TEST
func TestSafeDivideByZero(t *testing.T) {
	_, err := SafeDivide(10, 0)
	if err == nil {
		t.Error("expected error for division by zero")
	}
}

// WEAK TEST - only tests value in range, misses boundaries
func TestClamp(t *testing.T) {
	if Clamp(5, 0, 10) != 5 {
		t.Error("expected 5")
	}
}
