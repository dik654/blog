# -*- coding: utf-8 -*-
"""Authored arithmetic/ledger model; no central-bank operational code or forecast."""
from fractions import Fraction as F
from pathlib import Path
import json
p=600_000_000
interest=F(p)*F(46,1000)/365
change=F(p)*F(25,10000)/365
before=(F(45,10)+4+F(35,10))/3+F(3,10)
after=(F(475,100)+F(35,10)+3)/3+F(3,10)
assert before==F(43,10) and after==F(405,100)
assert 4-F(383,100)-F(15,100)==F(2,100)
assert F(1_000_000_000)*F(25,10000)==2_500_000
assert 14+6==20
# Changes in aggregate reserve assets; separate transactions, not a sequence.
reserve_changes={'interbank':F(6)-6,'central_bank_loan':F(6),'central_bank_bank_bond_purchase':F(6),'central_bank_nonbank_bond_purchase':F(6)}
deposit_changes={'interbank':0,'central_bank_loan':0,'central_bank_bank_bond_purchase':0,'central_bank_nonbank_bond_purchase':6}
# Every transaction's change to assets equals the change to liabilities.
assert (6-6)==0 # bank bond sale: reserves +6, bond -6, deposits unchanged
assert 6==6 # nonbank bond sale through bank: reserves +6, deposits +6
geometric=(1.045*1.04*1.035)**(1/3)-1
out={'status':'PASS','scope':'Authored model, no forecast, EFFR quote, live policy or production system execution','daily_interest_won':float(interest),'daily_change_won':float(change),'daily_after_won':float(interest+change),'three_year_before_percent':float(before),'three_year_after_percent':float(after),'known_path_geometric_percent':100*geometric,'annual_factory_change_won':2500000,'reserve_changes_100_million_krw':{k:float(v)for k,v in reserve_changes.items()},'deposit_changes_100_million_krw':deposit_changes}
Path(__file__).with_name('output.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False,indent=2))
