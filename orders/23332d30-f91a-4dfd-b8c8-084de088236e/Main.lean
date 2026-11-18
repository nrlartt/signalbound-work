import Mathlib.Data.Nat.Basic
theorem product_consecutive_nat_even (n : Nat) : (n * (n + 1)) % 2 = 0 := by
  have h : n % 2 = 0 \/ n % 2 = 1 := by omega
  rcases h with h | h
  · rw [Nat.mul_mod, h]
    simp
  · have hn : (n + 1) % 2 = 0 := by omega
    rw [Nat.mul_mod, hn]
    simp