use ark_ff::{BigInt,Field,Fp64,MontBackend,MontConfig,PrimeField,Zero};
use ark_serialize::{CanonicalDeserialize,CanonicalSerialize};
pub struct Mod17;
type F17=Fp64<MontBackend<Mod17,1>>;
impl MontConfig<1> for Mod17 {
 const MODULUS: BigInt<1> = BigInt([17]);
 const GENERATOR: F17 = F17::new_unchecked(BigInt([3]));
 const TWO_ADIC_ROOT_OF_UNITY: F17 = F17::new_unchecked(BigInt([3]));
}
pub struct Mod19;
type F19=Fp64<MontBackend<Mod19,1>>;
impl MontConfig<1> for Mod19 {
 const MODULUS: BigInt<1> = BigInt([19]);
 const GENERATOR: F19 = F19::new( BigInt([2]));
 const TWO_ADIC_ROOT_OF_UNITY: F19 = F19::new(BigInt([18]));
}
fn main(){
 let a=F17::from_bigint(BigInt([7])).unwrap();let b=F17::from_bigint(BigInt([5])).unwrap();let c=a*b;
 assert_eq!(c.into_bigint().0,[1]);
 assert_eq!(F17::R.0,[1]);assert_eq!(F17::R2.0,[1]);assert_eq!(F17::INV,1085102592571150095);
 assert!(F17::from_bigint(BigInt([17])).is_none());assert_eq!(F17::from_le_bytes_mod_order(&[17]),F17::zero());
 assert!(F17::zero().inverse().is_none());assert_eq!(b.inverse().unwrap().into_bigint().0,[7]);
 let mut bytes=Vec::new();b.serialize_compressed(&mut bytes).unwrap();assert_eq!(bytes,vec![5]);
 let f19=F19::deserialize_compressed(&bytes[..]).unwrap();assert_eq!(f19.into_bigint().0,[5]);
 assert!(F17::deserialize_compressed(&[17][..]).is_err());
 let mut trailing=&[5,99][..];assert_eq!(F17::deserialize_compressed(&mut trailing).unwrap(),b);assert_eq!(trailing,&[99]);
 for x in 0..17{for y in 0..17{let fx=F17::from(x);let fy=F17::from(y);assert_eq!((fx*fy).into_bigint().0,[x*y%17]);assert_eq!((fx+fy).into_bigint().0,[(x+y)%17]);}}
 println!("mode=manual-MontConfig-default-methods pin=7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c R={:?} R2={:?} INV={} internal7={:?} internal5={:?} internal_product={:?} result={:?} cross_field5={:?} trailing={:?} products=289 sums=289",F17::R.0,F17::R2.0,F17::INV,a.0.0,b.0.0,c.0.0,c.into_bigint().0,f19.into_bigint().0,trailing);
}
