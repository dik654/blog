"""Independent field arithmetic for the selected original Poseidon/Poseidon2 profiles.

This model compares retained native outputs. It does not generate a ZK proof.
"""
from pathlib import Path
import json, re, math, sys, platform
BASE = Path(__file__).resolve().parents[1]
P = 21888242871839275222246405745257275088548364400416034343698204186575808495617

def source_values(filename, name):
    text = (BASE/'codebase'/filename).read_text()
    body = text.split('pub static ref '+name+':',1)[1].split('];',1)[0]
    return [int(h,16) for h in re.findall(r'from_hex\("(0x[0-9a-f]+)"\)',body)]

def rows(values, width=3):
    assert len(values) % width == 0
    return [values[i:i+width] for i in range(0,len(values),width)]

M = rows(source_values('poseidon_instance_bn256.rs','MDS3'))
C1 = rows(source_values('poseidon_instance_bn256.rs','RC3'))
C2 = rows(source_values('poseidon2_instance_bn256.rs','RC3'))
assert len(C1) == len(C2) == 64
assert all(0 <= v < P for matrix in [M,C1,C2] for row in matrix for v in row)

def matrix_mul(matrix, state, modulus):
    return [sum(a*b for a,b in zip(row,state)) % modulus for row in matrix]

def external(state):
    total = sum(state)
    return [(x+total) % P for x in state]

def internal(state):
    total = sum(state)
    return [(x*d+total) % P for x,d in zip(state,[1,1,2])]

def permute(state, variant):
    state = list(state)
    records = []
    if variant == 2:
        state = external(state)
        records.append({'stage':'initial-external','state':state})
    constants = C1 if variant == 1 else C2
    for r in range(64):
        full = r < 4 or r >= 60
        if variant == 1 or full:
            added = [(x+c) % P for x,c in zip(state,constants[r])]
        else:
            added = [(state[0]+constants[r][0]) % P]+state[1:]
        powered = [pow(x,5,P) if full or i == 0 else x for i,x in enumerate(added)]
        state = matrix_mul(M,powered,P) if variant == 1 else (external(powered) if full else internal(powered))
        records.append({'round':r,'full':full,'afterConstants':added,'afterPower':powered,'state':state})
    return state, records

native_path = Path(sys.argv[1]) if len(sys.argv)>1 else BASE/'verification/observed-rust-1.93.0.jsonl'
native = [json.loads(s) for s in native_path.read_text().splitlines()]
checks = []
for item in native:
    initial = [int(x) for x in item['input']]
    for variant,key in [(1,'poseidon'),(2,'poseidon2')]:
        out,_ = permute(initial,variant)
        assert out == [int(x) for x in item[key]]
    checks.append({'case':item['case'],'bothVariantsMatch':True,'optimizedEqualsPlain':item['optimizedEqualsPlain']})
# Compare the native [0,1,2] outputs against the exact KATs in upstream source.
kat_results=[]
for variant,filename,module in [(1,'poseidon.rs','mod poseidon_tests_bn256'),(2,'poseidon2.rs','mod poseidon2_tests_bn256')]:
    text=(BASE/'codebase'/filename).read_text().split(module,1)[1].split('\nmod ',1)[0]
    expected=[int(h,16) for h in re.findall(r'from_hex\("(0x[0-9a-f]+)"\)',text)][:3]
    key='poseidon' if variant==1 else 'poseidon2'
    assert expected==[int(x) for x in native[0][key]]
    kat_results.append({'variant':variant,'matchesOriginalKnownAnswer':True})

TOY_M=[[1,1],[1,2]]
INV_M=[[2,-1],[-1,1]]
def toy(value, full=True, constants=(1,2)):
    added=[(x+c)%17 for x,c in zip(value,constants)]
    powered=[pow(x,5,17) if full or i==0 else x for i,x in enumerate(added)]
    return matrix_mul(TOY_M,powered,17)
def toy_inverse(value,full=True):
    unmixed=matrix_mul(INV_M,value,17)
    unpowered=[pow(x,13,17)if full or i==0 else x for i,x in enumerate(unmixed)]
    return [(x-c)%17 for x,c in zip(unpowered,(1,2))]
assert toy([3,4])==[11,1] and toy([3,4],False)==[10,16]
all_inputs=[(a,b)for a in range(17)for b in range(17)]
for full in [True,False]:
    assert len({tuple(toy(x,full))for x in all_inputs})==289
    assert all(toy_inverse(toy(x,full),full)==list(x)for x in all_inputs)
weight=lambda x:sum(v!=0 for v in x)
branch=min(weight(x)+weight(matrix_mul(TOY_M,x,17))for x in all_inputs if x!=(0,0))
identity_branch=min(2*weight(x)for x in all_inputs if x!=(0,0))
assert branch==3 and identity_branch==2
assert [pow(3,2,17),pow(14,2,17)]==[9,9]
assert [pow(4,2,17),pow(16,2,17),1*4%17]==[16,1,4]
assert [pow(6,2,17),pow(2,2,17),4*6%17]==[2,4,7]
# One deliberately omitted constraint lets a false S-box output pass the others.
x,u,v,fake_y=4,16,1,5
assert (x*x-u)%17==0 and (u*u-v)%17==0 and (v*x-fake_y)%17!=0
assert matrix_mul(TOY_M,[fake_y,7],17)==[12,2]
assert toy([3,4],constants=(2,2))!=[11,1]
# A single output coordinate has exactly 17 preimages across a 17^2 permutation.
counts=[0]*17
for x in all_inputs: counts[toy(x)[0]]+=1
assert counts==[17]*17
out1,trace1=permute([3,4,0],1);out2,trace2=permute([3,4,0],2)
result={'status':'PASS','python':platform.python_version(),'nativeComparisons':checks,'originalKAT':kat_results,
 'toy':{'input':[3,4],'full':[11,1],'partial':[10,16],'inverseExponent':13,'permutationStates':289,'branch':branch,'identityBranch':identity_branch,'projectedPreimages':counts,'missingConstraintOutput':[12,2]},
 'counts':{'sboxes':8*3+56,'directR1CSNonlinearConstraints':3*(8*3+56),'allFullCounterfactual':3*64*3},
 'p':str(P),'capacityOneWordGenericScaleBits':math.log2(P)/2,
 'poseidon':{'output':out1,'hex':[f'{v:064x}'for v in out1],'rounds':trace1},
 'poseidon2':{'output':out2,'hex':[f'{v:064x}'for v in out2],'rounds':trace2},
 'scope':'Own Python naive round model versus actual selected Rust source modules; no proof/circuit backend or attack execution.'}
print(json.dumps(result,indent=2))
