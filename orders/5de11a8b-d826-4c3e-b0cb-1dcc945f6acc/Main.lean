import Mathlib.Data.Nat.Basic
theorem pow_two_plus_one_mod_nine_zero : (2 ^ 9 + 1) % 9 = 0 := by
  have h : (2 ^ 9 + 1) % 9 = 0 := by
    decide
  exact h

theorem pow_two_plus_one_mod_one_hundred_seventy_one_zero : (2 ^ 171 + 1) % 171 = 0 := by
  have h : (2 ^ 171 + 1) % 171 = 0 := by
    decide
  exact h

theorem pow_two_plus_one_mod_five_nonzero : (2 ^ 5 + 1) % 5 ≠ 0 := by
  intro h
  have h₁ : (2 ^ 5 + 1) % 5 = 0 := h
  have h₂ : (2 ^ 5 + 1) % 5 = 3 := by
    decide
  omega