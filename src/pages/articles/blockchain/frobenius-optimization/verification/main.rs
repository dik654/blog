// Article verification only: own F9 config and separately labelled real BN254 arithmetic.
use ark_ff::{AdditiveGroup,BigInt,BigInteger,Field,Fp64,Fp2,Fp2Config,MontBackend,MontConfig,PrimeField};
use ark_bn254::{Fq,Fq2,Fq6,Fq12,Fr};
use num_bigint::BigUint;
pub struct Mod3;
type F3=Fp64<MontBackend<Mod3,1>>;
impl MontConfig<1> for Mod3 {
 const MODULUS:BigInt<1>=BigInt([3]);
 const GENERATOR:F3=F3::new(BigInt([2]));
 const TWO_ADIC_ROOT_OF_UNITY:F3=F3::new(BigInt([2]));
}
pub struct Ext3;
impl Fp2Config for Ext3 {
 type Fp=F3;
 const NONRESIDUE:F3=F3::new(BigInt([2]));
 const FROBENIUS_COEFF_FP2_C1:&'static[F3]=&[F3::new(BigInt([1])),F3::new(BigInt([2]))];
}
type F9=Fp2<Ext3>;
fn pair(a:u64,b:u64)->F9 {F9::new(F3::from(a),F3::from(b))}
fn coords(x:F9)->[u64;2]{[x.c0.into_bigint().0[0],x.c1.into_bigint().0[0]]}
// New basis v=1+u: a+bu=(a-b)+bv, all coefficients mod3.
fn to_v(x:F9)->[u64;2]{let[a,b]=coords(x);[(a+3-b)%3,b]}
fn from_v(x:[u64;2])->F9{pair((x[0]+x[1])%3,x[1])}
fn matrix_v([a,b]:[u64;2])->[u64;2]{[(a+2*b)%3,2*b%3]}
fn phi12(x:Fq12,j:usize)->Fq12{x.frobenius_map(j)}
fn bigpow(x:Fq12,e:&BigUint)->Fq12{x.pow(e.to_u64_digits())}
fn ring_mul(a:[u64;2],b:[u64;2],p:u64,beta:u64)->[u64;2]{[(a[0]*b[0]+beta*a[1]*b[1])%p,(a[0]*b[1]+a[1]*b[0])%p]}
fn ring_pow(mut a:[u64;2],mut n:u64,p:u64,beta:u64)->[u64;2]{let mut out=[1,0];while n>0{if n%2==1{out=ring_mul(out,a,p,beta)}a=ring_mul(a,a,p,beta);n/=2;}out}
fn main(){
 let x=pair(1,1);let fx=x.frobenius_map(1);assert_eq!(coords(fx),[1,2]);assert_eq!(fx,x.pow([3]));assert_eq!(x.frobenius_map(2),x);
 assert_eq!(to_v(x),[0,1]);assert_eq!(to_v(fx),[2,2]);
 for a in 0..3 {for b in 0..3 {
  let z=pair(a,b);let n=to_v(z);assert_eq!(from_v(n),z);
  assert_eq!(from_v(matrix_v(n)),z.pow([3]));assert_eq!(matrix_v(matrix_v(n)),n);
  assert_eq!(z.frobenius_map(1),z.pow([3]));
  for c in 0..3 {for d in 0..3 {let q=pair(c,d);assert_eq!((z+q).frobenius_map(1),z.frobenius_map(1)+q.frobenius_map(1));assert_eq!((z*q).frobenius_map(1),z.frobenius_map(1)*q.frobenius_map(1));}}
 }}
 let wrong=[0,2];assert_ne!(from_v(wrong),fx);assert_eq!([wrong[0],(2*wrong[1])%3],[0,1]);
 assert_ne!(fx,x.inverse().unwrap());let y=fx*x.inverse().unwrap();assert_eq!(coords(y),[0,2]);
 assert_eq!(y.pow([4]),F9::ONE);assert_eq!(y.frobenius_map(1),y.inverse().unwrap());assert_eq!(coords(y.inverse().unwrap()),[0,1]);
 // Non-field examples use explicit modular arithmetic, not an invalid library field configuration.
 for a in 0..5u64 {for b in 0..5u64 {
  // In F5[u]/(u²+1), u^5=u, so the fifth-power map is identity on all25 pairs.
  assert_eq!(ring_pow([a,b],5,5,4),[a,b]);
 }}
 // In F3[e]/(e²), e is nonzero but e³=0: Frobenius is not injective.
 assert_ne!([0u64,1],[0,0]);assert_eq!(ring_pow([0,1],3,3,0),[0,0]);
 assert_eq!(ring_mul([3,1],[2,1],5,4),[0,0]);
 assert_ne!(2u64.pow(6)%6,(1u64.pow(6)+1u64.pow(6))%6);
 let p=BigUint::from_bytes_le(&Fq::MODULUS.to_bytes_le());let r=BigUint::from_bytes_le(&Fr::MODULUS.to_bytes_le());
 let a=Fq12::new(Fq6::ZERO,Fq6::new(Fq2::ZERO,Fq2::ZERO,Fq2::new(Fq::from(1),Fq::from(1))));
 let m=Fq12::ONE+a;
 for j in 0..12 {assert_eq!(phi12(m,j),bigpow(m,&p.pow(j as u32)));}
 assert_eq!(phi12(m,13),phi12(m,1));assert_eq!(phi12(m,6),Fq12::ONE-a);
 assert_ne!(phi12(m,6),m.inverse().unwrap());
 let first=phi12(m,6)*m.inverse().unwrap();assert_eq!(first*phi12(first,6),Fq12::ONE);
 let easy=phi12(first,2)*first;let e_easy=(p.pow(6)-1u32)*(p.pow(2)+1u32);
 assert_eq!(easy,bigpow(m,&e_easy));assert_eq!(phi12(easy,6),easy.inverse().unwrap());
 let cyclotomic=p.pow(4)-p.pow(2)+1u32;assert_eq!(&cyclotomic%&r,BigUint::ZERO);
 assert_eq!(bigpow(easy,&cyclotomic),Fq12::ONE);
 let h=&cyclotomic/&r;let final_value=bigpow(easy,&h);let e=(p.pow(12)-1u32)/&r;
 assert_eq!(final_value,bigpow(m,&e));assert_eq!(bigpow(final_value,&r),Fq12::ONE);
 // Scott et al. §5 polynomial exponents, not its optimized short addition chain.
 let z=BigUint::from(4965661367192848881u64);
 let pp=36u32*z.pow(4)+36u32*z.pow(3)+24u32*z.pow(2)+6u32*&z+1u32;
 let rr=36u32*z.pow(4)+36u32*z.pow(3)+18u32*z.pow(2)+6u32*&z+1u32;assert_eq!(p,pp);assert_eq!(r,rr);
 let l0_abs=36u32*z.pow(3)+30u32*z.pow(2)+18u32*&z+2u32;
 let l1_abs=36u32*z.pow(3)+18u32*z.pow(2)+12u32*&z-1u32;
 let l2=6u32*z.pow(2)+1u32;
 assert_eq!(&h+&l0_abs+&l1_abs*&p,&l2*p.pow(2)+p.pow(3));
 let factored=phi12(easy,3)*bigpow(phi12(easy,2),&l2)*bigpow(phi12(easy,1),&l1_abs).inverse().unwrap()*bigpow(easy,&l0_abs).inverse().unwrap();
 assert_eq!(factored,final_value);
 println!("F9 x=[1,1] phi=[1,2] new_basis_x=[0,1] new_basis_phi=[2,2] wrong_copied_table=[0,2]");
 println!("F9 unitary_y=[0,2] inverse=conjugate=[0,1] cases=9 addition_and_product_pairs=81");
 println!("BN254 pin=7ad88c46e859a94ab8e0b19fd8a217c3dc472f1c ff=0.5.0 bn254=0.5.0-alpha.0");
 println!("powers0to11=true power13_mod12=true easy_factor=true unitary=true final_generic=true Scott_polynomial_factor=true H_bits={}",h.bits());
 println!("pairing_executed=false optimized_hard_chain_executed=false timing_measured=false");
}
