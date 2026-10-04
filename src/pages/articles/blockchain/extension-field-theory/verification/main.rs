use ark_ff::{BigInt,Field,Fp64,MontBackend,MontConfig,PrimeField,Zero,Fp2,Fp2Config,One};
use ark_serialize::{CanonicalDeserialize,CanonicalSerialize};
pub struct Mod3;
type F3=Fp64<MontBackend<Mod3,1>>;
impl MontConfig<1> for Mod3 {
 const MODULUS: BigInt<1> = BigInt([3]);
 const GENERATOR: F3 = F3::new(BigInt([2]));
 const TWO_ADIC_ROOT_OF_UNITY: F3 = F3::new(BigInt([2]));
}
pub struct Ext3;
impl Fp2Config for Ext3 {
 type Fp=F3;
 const NONRESIDUE:F3=F3::new(BigInt([2]));
 const FROBENIUS_COEFF_FP2_C1:&'static[F3]=&[F3::new(BigInt([1])),F3::new(BigInt([2]))];
}
pub struct Reducible;
impl Fp2Config for Reducible {
 type Fp=F3;
 const NONRESIDUE:F3=F3::new(BigInt([1]));
 const FROBENIUS_COEFF_FP2_C1:&'static[F3]=&[F3::new(BigInt([1])),F3::new(BigInt([1]))];
}
pub struct WrongFrob;
impl Fp2Config for WrongFrob {
 type Fp=F3;
 const NONRESIDUE:F3=F3::new(BigInt([2]));
 const FROBENIUS_COEFF_FP2_C1:&'static[F3]=&[F3::new(BigInt([1])),F3::new(BigInt([1]))];
}
type F9=Fp2<Ext3>;
fn val(x:F9)->[u64;2]{[x.c0.into_bigint().0[0],x.c1.into_bigint().0[0]]}
fn pair(a:u64,b:u64)->F9{F9::new(F3::from(a),F3::from(b))}
fn main(){
 let x=pair(1,1);let y=pair(2,1);assert_eq!(val(x*y),[1,0]);assert_eq!(val(x.inverse().unwrap()),[2,1]);assert_eq!(val(x.frobenius_map(1)),[1,2]);assert_eq!(val(x.frobenius_map(2)),[1,1]);assert_eq!(val(x.pow([3])),[1,2]);assert!(F9::zero().inverse().is_none());
 let mut checks=0;
 for a in 0..3{for b in 0..3{let z=pair(a,b);assert_eq!(z.frobenius_map(1),z.pow([3]));assert_eq!(z.frobenius_map(2),z);if !z.is_zero(){assert_eq!(z*z.inverse().unwrap(),F9::one());}for c in 0..3{for d in 0..3{assert_eq!(val(z*pair(c,d)),[(a*c+2*b*d)%3,(a*d+b*c)%3]);checks+=1;}}}}
 let mut bytes=Vec::new();x.serialize_compressed(&mut bytes).unwrap();assert_eq!(bytes,vec![1,1]);assert_eq!(F9::deserialize_compressed(&bytes[..]).unwrap(),x);
 let bad=Fp2::<Reducible>::new(F3::from(1),F3::from(1));let bad2=Fp2::<Reducible>::new(F3::from(1),F3::from(2));assert!(!bad.is_zero());assert!(!bad2.is_zero());assert!((bad*bad2).is_zero());assert!(bad.inverse().is_none());
 let wrong=Fp2::<WrongFrob>::new(F3::from(1),F3::from(1));assert_ne!(wrong.frobenius_map(1),wrong.pow([3]));
 println!("invalid-config beta1: nonzero product zero and inverse None; wrong-frob-table [1,1]: map differs from pow3");
 let u=pair(0,1);assert_eq!(u.pow([4]),F9::one());assert_ne!(u.pow([2]),F9::one());assert_eq!(x.pow([8]),F9::one());assert_ne!(x.pow([4]),F9::one());
 println!("pin=7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c own-config p=3 beta=2 frob=[1,2] degree={} product={:?} inverse={:?} frobenius1={:?} bytes={:?} all-products={} inverse-nonzero=8 frobenius=9",F9::extension_degree(),val(x*y),val(x.inverse().unwrap()),val(x.frobenius_map(1)),bytes,checks);
}
