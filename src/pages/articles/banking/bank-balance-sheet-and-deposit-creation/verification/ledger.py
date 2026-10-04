"""Authored accounting model, in KRW 100 million; not a bank core ledger.

Each journal posts debits and credits to named asset, liability or equity
accounts. This checks the article's arithmetic and consolidation conditions.
It does not model settlement timing, regulation, ECL forecasts or real prices.
"""
from copy import deepcopy
from fractions import Fraction
import json
from pathlib import Path

ASSETS = {"reserves", "loans", "bonds"}


def bank(reserves, loans, deposits, equity):
    return dict(reserves=reserves, loans=loans, bonds=0,
                deposits=deposits, borrowing=0, equity=equity)


def post(ledger, debit, credit):
    assert sum(debit.values()) == sum(credit.values())
    for entries, direction in [(debit, 1), (credit, -1)]:
        for account, amount in entries.items():
            ledger[account] += direction * amount * (1 if account in ASSETS else -1)
    assert all(amount >= 0 for amount in ledger.values())
    assert sum(ledger[x] for x in ASSETS) == sum(
        amount for x, amount in ledger.items() if x not in ASSETS)


a, b = bank(20, 80, 92, 8), bank(30, 70, 92, 8)
states = {"initial": deepcopy([a, b])}
post(a, {"loans": 10}, {"deposits": 10})
states["loan"] = deepcopy([a, b])
post(a, {"deposits": 6}, {"reserves": 6})
post(b, {"reserves": 6}, {"deposits": 6})
states["transfer"] = deepcopy([a, b])
post(a, {"deposits": 4}, {"loans": 4})
states["principal_repaid"] = deepcopy([a, b])
assert [a[k] for k in ("reserves", "loans", "deposits", "equity")] == [14, 86, 92, 8]
assert b["reserves"] - 30 == b["deposits"] - 92 == 6
assert [sum(x["deposits"] for x in pair) - 184 for pair in states.values()] == [0, 10, 10, 6]
assert all(sum(x["reserves"] for x in pair) == 50 for pair in states.values())

branches = {}
loss = deepcopy(a)
# Consolidated additional impairment expense: equity -3, net loan asset -3.
post(loss, {"equity": 3}, {"loans": 3})
assert loss["deposits"] == 92 and loss["equity"] == 5
branches["additional_unrecognised_loss"] = loss
interest = deepcopy(a)
# Cash-basis illustration only: no pre-existing accrued interest, cost or tax.
post(interest, {"deposits": 1}, {"equity": 1})
assert interest["loans"] == 86 and interest["equity"] == 9
branches["cash_basis_interest"] = interest
sale = deepcopy(a)
post(sale, {"reserves": 6, "equity": 4}, {"loans": 10})
branches["sale_before_payout"] = deepcopy(sale)
post(sale, {"deposits": 20}, {"reserves": 20})
assert [sale[k] for k in ("reserves", "loans", "deposits", "equity")] == [0, 76, 72, 4]
branches["sale_after_payout"] = sale
funded = deepcopy(a)
post(funded, {"reserves": 6}, {"borrowing": 6})
post(funded, {"deposits": 20}, {"reserves": 20})
assert [funded[k] for k in ("reserves", "loans", "deposits", "borrowing", "equity")] == [0, 86, 72, 6, 8]
branches["borrowing_after_payout"] = funded
purchase = deepcopy(a)
post(purchase, {"bonds": 6}, {"deposits": 6})
branches["buy_nonbank_bond"] = purchase
conversion = deepcopy(a)
post(conversion, {"deposits": 6}, {"borrowing": 6})
branches["customer_buys_bank_debt"] = conversion

# A write-off against an already recorded allowance preserves net carrying value.
gross, allowance = 86, 3
net_before = gross - allowance
gross, allowance = gross - 3, allowance - 3
assert gross - allowance == net_before == 83
assert Fraction(20) / Fraction(1, 5) == 100
assert Fraction(102, 5) == Fraction(204, 10) > 20
assert min(Fraction(6, 10) + Fraction(5, 10), 1) == 1
assert min(Fraction(6, 10), 1) + min(Fraction(5, 10), 1) == Fraction(11, 10)

result = {"kind": "authored arithmetic model", "unit": "KRW 100 million",
          "b_initial_balance_is_auxiliary": True, "states": states,
          "branches_restart_after_principal_repayment": branches,
          "checks": "balanced journals; two-bank conservation; separate loss/interest/funding; allowance write-off; ratio and insurance arithmetic"}
Path(__file__).with_name("output.json").write_text(json.dumps(result, indent=2) + "\n")
print("PASS: four two-bank states and seven independent branches")
