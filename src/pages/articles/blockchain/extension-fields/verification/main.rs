// This article's verification program; not an upstream source file or benchmark.
use ark_bn254::{Fq, Fq2, Fq6, Fq12, Fq6Config, Fq12Config, Fr};
use ark_ff::{AdditiveGroup, BigInteger, Field, Fp6Config, Fp12Config, PrimeField};
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use num_bigint::BigUint;
fn q(x:u64)->Fq { Fq::from(x) }
fn pair(a:u64,b:u64)->Fq2 { Fq2::new(q(a),q(b)) }
fn flat(x:Fq12)->[Fq;12] {
    [x.c0.c0.c0,x.c0.c0.c1,x.c0.c1.c0,x.c0.c1.c1,x.c0.c2.c0,x.c0.c2.c1,
     x.c1.c0.c0,x.c1.c0.c1,x.c1.c1.c0,x.c1.c1.c1,x.c1.c2.c0,x.c1.c2.c1]
}
fn unflat(x:[Fq;12])->Fq12 {
    Fq12::new(Fq6::new(Fq2::new(x[0],x[1]),Fq2::new(x[2],x[3]),Fq2::new(x[4],x[5])),
               Fq6::new(Fq2::new(x[6],x[7]),Fq2::new(x[8],x[9]),Fq2::new(x[10],x[11])))
}
// Direct 12×12 monomial convolution, unlike the library's layered schedules.
fn direct(a:Fq12,b:Fq12)->Fq12 {
    let aa=flat(a);let bb=flat(b);let mut out=[Fq::ZERO;12];
    for s in 0..12 {for t in 0..12 {
        let w=s/6+t/6;let v=(s/2)%3+(t/2)%3+w/2;let u=s%2+t%2;
        let c=aa[s]*bb[t];let w=w%2;
        // v^3=9+u; these input degrees can cross the cubic boundary at most once.
        if v>=3 {
            for (extra,factor) in [(0,q(9)),(1,Fq::ONE)] {
                let up=u+extra;let value=if up/2==1 {-(c*factor)} else {c*factor};
                out[6*w+2*(v-3)+up%2]+=value;
            }
        } else {
            out[6*w+2*v+u%2]+=if u/2==1 {-c} else {c};
        }
    }}
    unflat(out)
}
fn main() {
    let p=BigUint::from_bytes_le(&Fq::MODULUS.to_bytes_le());
    let r=BigUint::from_bytes_le(&Fr::MODULUS.to_bytes_le());
    let u=pair(0,1);let xi=pair(9,1);
    let v=Fq6::new(Fq2::ZERO,Fq2::ONE,Fq2::ZERO);
    let w=Fq12::new(Fq6::ZERO,Fq6::ONE);
    assert_eq!(u.square(),-Fq2::ONE);
    assert_eq!(v.pow([3]),Fq6::new(xi,Fq2::ZERO,Fq2::ZERO));
    assert_eq!(w.square(),Fq12::new(v,Fq6::ZERO));
    assert_ne!(xi.pow(((p.pow(2)-1u32)/3u32).to_u64_digits()),Fq2::ONE);
    assert_eq!(v.pow(((p.pow(6)-1u32)/2u32).to_u64_digits()),-Fq6::ONE);
    for k in 1u32..12 {assert_ne!(p.modpow(&BigUint::from(k),&r),BigUint::from(1u32));}
    assert_eq!(p.modpow(&BigUint::from(12u32),&r),BigUint::from(1u32));
    let a1=Fq6::new(Fq2::ZERO,Fq2::ZERO,pair(1,1));
    let b1=Fq6::new(Fq2::ZERO,Fq2::ZERO,pair(2,1));
    let a=Fq12::new(Fq6::ZERO,a1);let b=Fq12::new(Fq6::ZERO,b1);
    let c=a*b;let expected=Fq12::new(Fq6::new(Fq2::ZERO,Fq2::ZERO,pair(6,28)),Fq6::ZERO);
    assert_eq!(c,expected);assert_eq!(c,direct(a,b));
    assert_eq!(pair(1,1)*pair(2,1),pair(1,3));
    assert_eq!(a1*b1,Fq6::new(Fq2::ZERO,pair(6,28),Fq2::ZERO));
    let mut middle=pair(1,3);Fq6Config::mul_fp2_by_nonresidue_in_place(&mut middle);assert_eq!(middle,pair(6,28));
    let mut top=a1*b1;Fq12Config::mul_fp6_by_nonresidue_in_place(&mut top);assert_eq!(top,expected.c0);
    let half=q(2).inverse().unwrap();assert_eq!(pair(1,1).inverse().unwrap(),Fq2::new(half,-half));
    assert_eq!(a*a.inverse().unwrap(),Fq12::ONE);assert!(Fq12::ZERO.inverse().is_none());
    let mut basis=[Fq12::ZERO;12];
    for i in 0..12 {let mut digits=[Fq::ZERO;12];digits[i]=Fq::ONE;basis[i]=unflat(digits);}
    for x in basis {for y in basis {assert_eq!(x*y,direct(x,y));}}
    for seed in 1..=16u64 {
        let x=unflat(std::array::from_fn(|i|q((seed*17+i as u64*13)%97)));
        let y=unflat(std::array::from_fn(|i|q((seed*23+i as u64*7)%101)));
        assert_eq!(x*y,direct(x,y));
    }
    for x in basis.into_iter().chain([a,b,c]) {
        let mut f=x;f.frobenius_map_in_place(1);assert_eq!(f,x.pow(Fq::MODULUS));
        let mut cycle=x;cycle.frobenius_map_in_place(12);assert_eq!(cycle,x);
    }
    let mut six=a;six.frobenius_map_in_place(6);assert_eq!(six,-a);
    let mut wrong=a;wrong.c1.c2.c1=-wrong.c1.c2.c1;
    assert_ne!(wrong,a.pow(Fq::MODULUS));
    // Conjugating only u twice is identity, so a twelve-cycle test alone misses it.
    let mut cycle=wrong;cycle.c1.c2.c1=-cycle.c1.c2.c1;assert_eq!(cycle,a);
    let mut bytes=Vec::new();c.serialize_compressed(&mut bytes).unwrap();assert_eq!(bytes.len(),384);
    for i in 0..12 {assert_eq!(Fq::deserialize_compressed(&bytes[32*i..32*(i+1)]).unwrap(),flat(c)[i]);}
    assert_eq!(bytes[128],6);assert_eq!(bytes[160],28);
    assert_eq!(Fq12::deserialize_compressed(&bytes[..]).unwrap(),c);
    let coefficient=pair(6,28);let mut arkbytes=Vec::new();coefficient.serialize_compressed(&mut arkbytes).unwrap();
    assert_eq!(arkbytes[0],6);assert_eq!(arkbytes[32],28);
    let mut evmbytes=[0u8;64];evmbytes[31]=28;evmbytes[63]=6;
    // This is the EIP's coefficient encoding, not a G2 point or EVM execution.
    assert_ne!(arkbytes,evmbytes);
    let swapped=Fq12::new(Fq6::new(Fq2::ZERO,Fq2::ZERO,pair(28,6)),Fq6::ZERO);assert_ne!(c,swapped);
    println!("p={} r={} degree=12 beta=-1 xi=[9,1]",p,r);
    println!("A_slots=[10:1,11:1] B_slots=[10:2,11:1] output_slots=[4:6,5:28]");
    println!("basis_products=144 dense_products=16 frobenius_vs_pow=15 fp12_bytes={} nonzero_byte_offsets=128:6,160:28",bytes.len());
    println!("cube_nonresidue=true top_nonsquare=true embedding_degree=12 inverse=true wrong_u_only_frobenius_rejected=true native_pairing_executed=false");
}
