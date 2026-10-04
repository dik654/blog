"""Integer arithmetic reference for the two teaching curves; no arkworks calls."""
from itertools import product
import json

def add(p,q,a,b):
    if p is None:return q
    if q is None:return p
    x,y=p;u,v=q
    if x==u and (y+v)%17==0:return None
    slope=((3*x*x+a)*pow(2*y,-1,17) if p==q else (v-y)*pow(u-x,-1,17))%17
    newx=(slope*slope-x-u)%17
    return (newx,(slope*(x-newx)-y)%17)

def mul(k,p,a,b):
    result=None
    for _ in range(k):result=add(result,p,a,b)
    return result

points=[None]+[(x,y)for x,y in product(range(17),repeat=2)if (y*y-x*x*x-2*x-2)%17==0]
assert len(points)==19
for p,q in product(points,repeat=2):assert add(p,q,2,2)in points
for p,q,r in product(points,repeat=3):assert add(add(p,q,2,2),r,2,2)==add(p,add(q,r,2,2),2,2)
P=(5,1)
expected={2:(6,3),3:(10,6),6:(16,13),7:(0,6),19:None}
for k,value in expected.items():assert mul(k,P,2,2)==value
zinv=pow(2,-1,17)
assert (3*zinv**2%17,8*zinv**3%17)==P
assert (7*zinv**2%17,7*zinv**3%17)==(6,3)
second=[None]+[(x,y)for x,y in product(range(17),repeat=2)if (y*y-x*x*x-2*x)%17==0]
assert len(second)==20
G=(9,4);T=(0,0)
assert [mul(k,G,2,0)for k in range(1,6)]==[(9,4),(8,16),(8,1),(9,13),None]
assert mul(5,T,2,0)==T and mul(4,T,2,0)is None
# One-byte SEC 1 illustrations for the toy curve, not ark serialization.
assert 22>=17 and 22%17==5
assert 1%2==1 and 16%2==0
print(json.dumps({'primary_points':19,'closure_pairs':361,'associativity_triples':6859,'multiples':expected,'jacobian_to_affine':[[3,8,2,5,1],[7,7,2,6,3]],'secondary_points':20,'secondary_order_G':5,'secondary_order_T':2,'T_times_5':T,'T_times_4':None,'sec1_toy_compressed_hex':'0305','sec1_toy_uncompressed_hex':'040501','result':'PASS'},ensure_ascii=False))
