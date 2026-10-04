"""Integer-only toy Tate computation over F19[u]/(u^2+1).
Independent of arkworks. This small exhaustive check does not prove a general
pairing theorem and is not intended for protecting secrets.
"""
import json
from collections import Counter
p=19
zero=(0,0);one=(1,0)
def add(a,b):return((a[0]+b[0])%p,(a[1]+b[1])%p)
def neg(a):return((-a[0])%p,(-a[1])%p)
def sub(a,b):return add(a,neg(b))
def mul(a,b):return((a[0]*b[0]-a[1]*b[1])%p,(a[0]*b[1]+a[1]*b[0])%p)
def power(a,n):
 out=one
 while n:
  if n&1:out=mul(out,a)
  a=mul(a,a);n//=2
 return out
def inv(a):
 assert a!=zero
 d=pow((a[0]*a[0]+a[1]*a[1])%p,-1,p)
 return(a[0]*d%p,-a[1]*d%p)
def div(a,b):return mul(a,inv(b))
def point_add(a,b):
 if a is None:return b
 if b is None:return a
 x,y=a;X,Y=b
 if x==X and add(y,Y)==zero:return None
 slope=div(sub(Y,y),sub(X,x)) if a!=b else div(add(mul((3,0),mul(x,x)),one),mul((2,0),y))
 xx=sub(sub(mul(slope,slope),x),X)
 return xx,sub(mul(slope,sub(x,xx)),y)
def point_mul(a,n):
 out=None
 for _ in range(n):out=point_add(out,a)
 return out
def line_ratio(a,b,q):
 x,y=a;X,Y=b;qx,qy=q
 if x==X and add(y,Y)==zero:return sub(qx,x)
 slope=div(sub(Y,y),sub(X,x)) if a!=b else div(add(mul((3,0),mul(x,x)),one),mul((2,0),y))
 c=point_add(a,b)
 return div(sub(sub(qy,y),mul(slope,sub(qx,x))),sub(qx,c[0]))
def miller(a,q,n=5):
 f=one;R=a;trace=[]
 for bit in bin(n)[3:]:
  factor=line_ratio(R,R,q);f=mul(mul(f,f),factor);R=point_add(R,R);trace.append({'op':'double','R':R,'factor':factor,'f':f})
  if bit=='1':
   factor=line_ratio(R,a,q);f=mul(f,factor);R=point_add(R,a);trace.append({'op':'add','R':R,'factor':factor,'f':f})
 return f,trace
P=((5,0),(4,0));Q=((14,0),(0,4));raw,trace=miller(P,Q);g=power(raw,72)
assert raw==(15,14) and g==(7,3)
assert [x['factor'] for x in trace]==[(3,16),(10,11),(9,0)]
assert [x['f'] for x in trace]==[(3,16),(8,10),(15,14)]
assert power(g,5)==one and g!=one and power(g,72)==(2,4)
checks=[]
for a in range(1,5):
 for b in range(1,5):
  v=power(miller(point_mul(P,a),point_mul(Q,b))[0],72)
  assert v==power(g,a*b);checks.append({'a':a,'b':b,'result':v})
counts=Counter(power((a,b),72) for a in range(p) for b in range(p) if (a,b)!=zero)
assert len(counts)==5 and set(counts.values())=={72}
points=[(x,y) for x in range(p) for y in range(p) if (y*y-x*x*x-x)%p==0]
assert len(points)+1==20 and point_mul(P,5) is None and point_mul(Q,5) is None
assert power((8,10),72)==g and power((9,0),72)==one
print(json.dumps({'field':'F19,u²=-1','curvePointsIncludingO':20,'trace':trace,'raw':raw,'final':g,'reapply72':power(g,72),'bilinear16':checks,'outputFibers':[{'output':k,'count':v} for k,v in sorted(counts.items())],'skippedLastFactorSameFinal':True,'scope':'Integer toy computation; not general proof or BN normalization.'},ensure_ascii=False,indent=2))
