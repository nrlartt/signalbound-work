# TicketBox Fuzz Project

Properties:
- invariant_SoldNeverExceedsMax: sold never exceeds maxTickets
- invariant_BalanceEqualsSoldTimesPrice: address(box).balance == sold * price
- invariant_SoldEqualsSumOfTickets: sold equals sum of ticketsOf over the 3 actors
- testFuzz_BuyThenRefundRestoresBalance: buying then refunding restores the buyer's balance
