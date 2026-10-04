// Article experiment. Generic polynomial multiplication is independent of tower helpers.
use ark_bn254::{Bn254,Config,Fq,Fq2,Fq6,Fq12,G1Affine,G2Affine};
use ark_ec::{AffineRepr,pairing::Pairing,bn::{BnConfig,TwistType}};
use ark_ff::{AdditiveGroup,Field};
fn q(a:u64)->Fq2{Fq2::new(Fq::from(a),Fq::ZERO)}
fn flat(a:[Fq2;6])->Fq12{Fq12::new(Fq6::new(a[0],a[1],a[2]),Fq6::new(a[3],a[4],a[5]))}
fn slots(a:Fq12)->[Fq2;6]{[a.c0.c0,a.c0.c1,a.c0.c2,a.c1.c0,a.c1.c1,a.c1.c2]}
fn powers(a:Fq12)->[Fq2;6]{let s=slots(a);[s[0],s[3],s[1],s[4],s[2],s[5]]}
fn from_powers(p:[Fq2;6])->Fq12{flat([p[0],p[2],p[4],p[1],p[3],p[5]])}
fn direct(a:Fq12,b:Fq12)->Fq12{
 let ap=powers(a);let bp=powers(b);let mut c=[Fq2::ZERO;11];
 for i in 0..6 {for j in 0..6 {c[i+j]+=ap[i]*bp[j];}}
 let xi=Fq2::new(Fq::from(9),Fq::from(1));
 for k in (6..11).rev(){c[k-6]+=c[k]*xi;}
 from_powers([c[0],c[1],c[2],c[3],c[4],c[5]])
}
fn operand(c:[Fq2;3],pattern:[usize;3])->Fq12{let mut s=[Fq2::ZERO;6];for i in 0..3{s[pattern[i]]=c[i]}flat(s)}
fn fast(mut a:Fq12,c:[Fq2;3],which:bool)->Fq12{if which{a.mul_by_014(&c[0],&c[1],&c[2])}else{a.mul_by_034(&c[0],&c[1],&c[2])}a}
fn line(coeffs:(Fq2,Fq2,Fq2),p:G1Affine)->[Fq2;3]{let(mut c0,mut c1,c2)=coeffs;c0.mul_assign_by_fp(&p.y);c1.mul_assign_by_fp(&p.x);[c0,c1,c2]}
fn main(){
 let a=from_powers([q(1),q(2),q(3),q(4),q(0),q(0)]);
 let b=operand([q(5),q(7),q(0)],[0,1,4]);
 let expected=from_powers([q(5),q(10),q(22),q(34),q(21),q(28)]);
 assert_eq!(a*b,expected);assert_eq!(direct(a,b),expected);assert_eq!(fast(a,[q(5),q(7),q(0)],true),expected);
 let c=[q(5),q(7),q(11)];let high=Fq2::new(Fq::from(401),Fq::from(44));
 let extended=flat([high,q(22),q(43),q(10),q(45),q(61)]);
 assert_eq!(direct(a,operand(c,[0,1,4])),extended);assert_eq!(fast(a,c,true),extended);
 let other=flat([high,q(29),q(50),q(17),q(52),q(33)]);
 assert_eq!(direct(a,operand(c,[0,3,4])),other);assert_eq!(fast(a,c,false),other);assert_ne!(other,extended);
 let mut aa=a.c0;aa.mul_by_01(&q(5),&q(7));assert_eq!(aa,Fq6::new(q(5),q(22),q(21)));
 let mut bb=a.c1;bb.mul_by_1(&q(11));assert_eq!(bb,Fq6::new(q(0),q(22),q(44)));
 let mut e=a.c0+a.c1;e.mul_by_01(&q(5),&q(18));assert_eq!(e,Fq6::new(q(15),q(89),q(126)));
 for which in [true,false]{let pattern=if which{[0,1,4]}else{[0,3,4]};
  for i in 0..6 {for j in 0..3 {let mut av=[q(0);6];av[i]=q(1);let mut cv=[q(0);3];cv[j]=q(1);let a=flat(av);let b=operand(cv,pattern);assert_eq!(fast(a,cv,which),direct(a,b));assert_eq!(a*b,direct(a,b));}}
  for k in 1..=16u64{let mut av=[q(0);6];for i in 0..6{av[i]=Fq2::new(Fq::from(k*(i as u64+1)),Fq::from(k+i as u64));}let cv=[Fq2::new(Fq::from(k+1),Fq::from(k)),Fq2::new(Fq::from(k+2),Fq::from(2*k)),Fq2::new(Fq::from(k+3),Fq::from(3*k))];let a=flat(av);let b=operand(cv,pattern);assert_eq!(fast(a,cv,which),direct(a,b));assert_eq!(a*b,direct(a,b));}
  assert_eq!(fast(a,[q(0);3],which),Fq12::ZERO);assert_eq!(fast(a,[q(1),q(0),q(0)],which),a);
 }
 // A supposedly empty slot is not silently accepted as the same operand.
 let mut invalid=operand(c,[0,1,4]);invalid.c0.c2=q(1);assert_ne!(fast(a,c,true),direct(a,invalid));
 assert!(matches!(Config::TWIST_TYPE,TwistType::D));assert!(!Config::X_IS_NEGATIVE);
 let p=G1Affine::generator();let g2=G2Affine::generator();assert!(p.is_on_curve()&&p.is_in_correct_subgroup_assuming_on_curve());assert!(g2.is_on_curve()&&g2.is_in_correct_subgroup_assuming_on_curve());
 assert_eq!(p.x,Fq::from(1));assert_eq!(p.y,Fq::from(2));
 let prepared=<Bn254 as Pairing>::G2Prepared::from(g2);let mut it=prepared.ell_coeffs.iter().copied();let mut f=Fq12::ONE;let mut lines=0;
 // Same prepared lines and recurrence, replace each sparse multiply by direct polynomial product.
 for i in (1..Config::ATE_LOOP_COUNT.len()).rev(){
  if i!=Config::ATE_LOOP_COUNT.len()-1{f.square_in_place();}
  let c=line(it.next().unwrap(),p);let d=direct(f,operand(c,[0,3,4]));assert_eq!(fast(f,c,false),d);f=d;lines+=1;
  let bit=Config::ATE_LOOP_COUNT[i-1];if bit==1||bit== -1{let c=line(it.next().unwrap(),p);let d=direct(f,operand(c,[0,3,4]));assert_eq!(fast(f,c,false),d);f=d;lines+=1;}
 }
 for _ in 0..2{let c=line(it.next().unwrap(),p);let d=direct(f,operand(c,[0,3,4]));assert_eq!(fast(f,c,false),d);f=d;lines+=1;}
 assert!(it.next().is_none());assert_eq!(f,Bn254::multi_miller_loop([p],[g2]).0);
 println!("original power coefficients=[5,10,22,34,21,28]; tower=[5,22,21,10,34,28]");
 println!("014 c4=11 tower=[401+44u,22,43,10,45,61]; 034 same arguments=[401+44u,29,50,17,52,33]");
 println!("basis products=36; deterministic dense inputs=32; zero/one=4; wrong slot and omitted coefficient rejected by comparison");
 println!("BN254 twist=D; generator G1=(1,2); prepared lines={}; direct polynomial Miller product equals library=true",lines);
 println!("final exponentiation=false; full pairing=false; timing=false; source=7ad88c46; ff/ec=0.5.0; bn254=0.5.0-alpha.0");
}
