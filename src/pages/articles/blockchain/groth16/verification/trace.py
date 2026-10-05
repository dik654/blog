"""Independent small-field arithmetic; no actual pairing group or cryptographic security."""
import json
P=101
def inv(x):return pow(x,-1,P)
def proof(r,s):
    a=(2+39+r*11)%P;b=(3+36+s*11)%P
    c=(49+s*a+r*b-r*s*11)%P
    return a,b,c
u=[-6,9];v=[-4,8];w=[-120,132];product=[u[0]*v[0],u[0]*v[1]+u[1]*v[0],u[1]*v[1]]
difference=[product[0]-w[0],product[1]-w[1],product[2]]
assert difference==[144,-216,72]
ic=[0,92*inv(7)%P,4*inv(7)%P];public=(3*ic[1]+43*ic[2])%P
private=(4*95+12*17)%P;h_t=72*12%P
assert ic==[0,42,15] and public==64 and private==79 and h_t==56
assert (private+h_t)*inv(11)%P==49
p=proof(13,17);assert p==(83,24,48)
assert p[0]*p[1]%P==(6+64*7+p[2]*11)%P==73
assert (6+79*7+p[2]*11)%P==77
pairs=set()
for r in range(P):
    for s in range(P):
        a,b,c=proof(r,s);assert a*b%P==(6+64*7+c*11)%P;pairs.add((a,b))
assert len(pairs)==P*P
roots=[a for a in range(P) if ((3*a)%P)**2%P==43]
false_roots=[a for a in range(P) if ((3*a)%P)**2%P==2]
assert roots==[4,97] and false_roots==[]
fake_public=(3*42+2*15)%P;fake_c=(1-6-fake_public*7)*inv(11)%P
assert fake_public==55 and fake_c==38 and (6+55*7+38*11)%P==1
print(json.dumps({'field':P,'qapDifferenceIntegerCoefficients':difference,'h':72,'ic':ic,'publicExponent':public,'privateNumerator':private,'hTimesT':h_t,'baseC':49,'proof':p,'verificationExponent':73,'wrongY44Exponent':77,'allRandomnessPairsChecked':P*P,'distinctAB':len(pairs),'rootsFor43':roots,'rootsFor2':false_roots,'knownTrapdoorFake':[1,1,fake_c]},indent=2))
