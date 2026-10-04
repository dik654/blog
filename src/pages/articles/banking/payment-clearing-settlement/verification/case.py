# -*- coding: utf-8 -*-
"""Authored teaching model; not BOK-Wire+, FedNow, or CLS code."""
import itertools,json
from fractions import Fraction
from pathlib import Path
flows=[('A','B',100),('B','A',90),('B','C',30),('C','B',20),('A','C',10),('C','A',10)]
def run(initial,order):
 balance=dict(initial);trace=[]
 for i in order:
  sender,receiver,amount=flows[i]
  assert balance[sender]>=amount
  balance[sender]-=amount;balance[receiver]+=amount
  trace.append({'instruction':i+1,'balances':dict(balance)})
 return trace
def need(order):
 b={k:0 for k in 'ABC'};low=b.copy()
 for i in order:
  a,c,v=flows[i];b[a]-=v;b[c]+=v
  for k in b:low[k]=min(low[k],b[k])
 return {k:-v for k,v in low.items()}
fixed=run(dict(A=100,B=20,C=0),range(6))
reordered=run(dict(A=100,B=0,C=0),[0,2,3,1,4,5])
assert fixed[-1]['balances']==dict(A=90,B=20,C=10)
assert reordered[-1]['balances']==dict(A=90,B=0,C=10)
minimum=min(sum(need(order).values()) for order in itertools.permutations(range(6)))
assert minimum==100
net={k:0 for k in 'ABC'}
for sender,receiver,amount in flows:net[sender]-=amount;net[receiver]+=amount
assert net==dict(A=-10,B=0,C=10)
atomic={k:dict(A=10,B=0,C=0)[k]+net[k]for k in net}
assert atomic==dict(A=0,B=0,C=10)
assert run(dict(A=10,B=0,C=0),[4])[-1]['balances']==dict(A=0,B=0,C=10)
a_removed={k:0 for k in 'BC'}
for a,b,v in flows:
 if 'A' not in (a,b):a_removed[a]-=v;a_removed[b]+=v
assert a_removed==dict(B=-10,C=10)
report={'origin':'authored educational arithmetic; no production system execution','units':'KRW100million; same currency','assumptions':['all instructions valid/accepted','no credit or fees','each instruction indivisible','received balances reused','atomic group depends on separate legal and technical conditions'],'gross':sum(v for a,b,v in flows),'net':net,'netTransfer':10,'reductionFraction':str(1-Fraction(10,260)),'firstTwoReductionFraction':str(1-Fraction(10,190)),'fixed':fixed,'reordered':reordered,'allPermutations':720,'minimumInitialSum':minimum,'atomicGroupFinal':atomic,'hypotheticalRemoveA':a_removed,'fxKRW':1400*1000000}
assert report['gross']==260 and report['fxKRW']==1400000000
if __name__=='__main__':
 Path(__file__).with_name('output.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print('PASS 720 orders; same six flows; atomic and FX branches')
