import Mathlib.Data.Nat.Basic
def digit_square_sum (n : Nat) : Nat := n % 10 * (n % 10) + (n / 10 % 10) * (n / 10 % 10) + (n / 100 % 10) * (n / 100 % 10) + (n / 1000 % 10) * (n / 1000 % 10) + (n / 10000 % 10) * (n / 10000 % 10)
theorem digit_square_sum_one : digit_square_sum 1 = 1 := by
  decide
theorem digit_square_sum_seven : digit_square_sum 7 = 49 := by
  decide
theorem digit_square_sum_thirteen : digit_square_sum 13 = 10 := by
  decide
theorem digit_square_sum_ten : digit_square_sum 10 = 1 := by
  decide
theorem digit_square_sum_four : digit_square_sum 4 = 16 := by
  decide
theorem digit_square_sum_sixteen : digit_square_sum 16 = 37 := by
  decide
theorem seven_chain : digit_square_sum 7 = 49 ∧ digit_square_sum 49 = 97 ∧ digit_square_sum 97 = 130 ∧ digit_square_sum 130 = 10 ∧ digit_square_sum 10 = 1 := by
  decide