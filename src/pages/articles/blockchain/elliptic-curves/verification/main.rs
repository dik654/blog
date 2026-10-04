use ark_ff::{AdditiveGroup,BigInt,BigInteger,Fp64,MontBackend,MontConfig,MontFp,PrimeField,Zero};
use ark_ec::{AffineRepr,CurveGroup,CurveConfig,PrimeGroup,pairing::Pairing,short_weierstrass::{Affine,Projective,SWCurveConfig}};
use ark_serialize::{CanonicalDeserialize,CanonicalSerialize,Valid};
use ark_bn254::{Bn254,Fq,Fq2,Fr,G1Affine,G2Affine};
pub struct Mod17;type F17=Fp64<MontBackend<Mod17,1>>;
impl MontConfig<1> for Mod17{const MODULUS:BigInt<1>=BigInt([17]);const GENERATOR:F17=F17::new(BigInt([3]));const TWO_ADIC_ROOT_OF_UNITY:F17=F17::new(BigInt([3]));}
pub struct Mod19;type F19=Fp64<MontBackend<Mod19,1>>;
impl MontConfig<1> for Mod19{const MODULUS:BigInt<1>=BigInt([19]);const GENERATOR:F19=F19::new(BigInt([2]));const TWO_ADIC_ROOT_OF_UNITY:F19=F19::new(BigInt([18]));}
#[derive(Clone,Default,PartialEq,Eq)]pub struct Toy;
impl CurveConfig for Toy{type BaseField=F17;type ScalarField=F19;const COFACTOR:&'static[u64]=&[1];const COFACTOR_INV:F19=MontFp!("1");}
impl SWCurveConfig for Toy{const COEFF_A:F17=MontFp!("2");const COEFF_B:F17=MontFp!("2");const GENERATOR:Affine<Self>=Affine::new_unchecked(MontFp!("5"),MontFp!("1"));}
type Point=Option<(i64,i64)>;
fn m(x:i64)->i64{x.rem_euclid(17)}
fn inv(x:i64)->i64{(1..17).find(|y|m(x*y)==1).unwrap()}
fn add(p:Point,q:Point)->Point{match(p,q){(None,b)=>b,(a,None)=>a,(Some((x,y)),Some((u,v)))=>{if x==u&&m(y+v)==0{return None}let s=if x==u{m((3*x*x+2)*inv(2*y))}else{m((v-y)*inv(u-x))};let a=m(s*s-x-u);Some((a,m(s*(x-a)-y)))}}}
fn lib(p:Point)->Affine<Toy>{match p{None=>Affine::identity(),Some((x,y))=>Affine::new(F17::from(x as u64),F17::from(y as u64))}}
fn xy(p:Affine<Toy>)->Point{if p.is_zero(){None}else{Some((p.x.into_bigint().0[0]as i64,p.y.into_bigint().0[0]as i64))}}
fn raw(p:Projective<Toy>)->[u64;3]{[p.x.into_bigint().0[0],p.y.into_bigint().0[0],p.z.into_bigint().0[0]]}
// Literal educational model of EIP-196 ECADD input rules. This is not an EVM client.
fn ecadd_model(bytes:&[u8])->Result<G1Affine,&'static str>{
 let mut input=[0u8;128];let n=bytes.len().min(128);input[..n].copy_from_slice(&bytes[..n]);
 let modulus=Fq::MODULUS.to_bytes_be();
 let decode=|part:&[u8]|->Result<G1Affine,&'static str>{let x=&part[..32];let y=&part[32..];if x>=modulus.as_slice()||y>=modulus.as_slice(){return Err("coordinate >= p")}
 if x.iter().all(|v|*v==0)&&y.iter().all(|v|*v==0){return Ok(G1Affine::identity())}
 let p=G1Affine::new_unchecked(Fq::from_be_bytes_mod_order(x),Fq::from_be_bytes_mod_order(y));if !p.is_on_curve(){return Err("off curve")}Ok(p)};
 Ok((decode(&input[..64])?+decode(&input[64..])?).into_affine())
}
fn main(){
 let mut points=vec![None];for x in 0..17{for y in 0..17{if m(y*y)==m(x*x*x+2*x+2){points.push(Some((x,y)))}}}assert_eq!(points.len(),19);
 for p in &points{for q in &points{assert_eq!(xy((lib(*p)+lib(*q)).into_affine()),add(*p,*q));}}
 let p=Toy::GENERATOR;let mut expected=None;for k in 0..=19{assert_eq!(xy(p.mul_bigint([k]).into_affine()),expected);expected=add(expected,Some((5,1)));}
 assert_eq!(xy(p.mul_bigint([7]).into_affine()),Some((0,6)));assert!(p.mul_bigint([19]).is_zero());
 let j=Projective::<Toy>::new_unchecked(F17::from(3),F17::from(8),F17::from(2));assert_eq!(j.into_affine(),p);assert_eq!(j,p.into_group());
 let mut doubled=p.into_group();doubled.double_in_place();assert_eq!(raw(doubled),[7,7,2]);assert_eq!(xy(doubled.into_affine()),Some((6,3)));
 let mut state=Projective::<Toy>::zero();let mut trace=Vec::new();for bit in[true,true,true]{state.double_in_place();if bit{state+=p;}trace.push(xy(state.into_affine()));}assert_eq!(trace,vec![Some((5,1)),Some((10,6)),Some((0,6))]);
 let invalid=G1Affine::new_unchecked(Fq::from(1),Fq::from(1));assert!(!invalid.is_on_curve());assert!(invalid.is_in_correct_subgroup_assuming_on_curve());assert!(invalid.check().is_err());assert!(G1Affine::identity().check().is_ok());
 let g1=G1Affine::generator();let g2=G2Affine::generator();assert!(g1.check().is_ok()&&g2.check().is_ok());
 let bad=(0u64..100).find_map(|k|G2Affine::get_point_from_x_unchecked(Fq2::new(Fq::from(k),Fq::from(0)),false).filter(|p|!p.is_in_correct_subgroup_assuming_on_curve()).map(|p|(k,p))).unwrap();
 assert!(bad.1.is_on_curve());assert!(!bad.1.mul_bigint(Fr::MODULUS).is_zero());let cleared=bad.1.clear_cofactor();assert!(cleared.check().is_ok());
 let mut encoded=Vec::new();bad.1.serialize_compressed(&mut encoded).unwrap();assert!(G2Affine::deserialize_compressed(&encoded[..]).is_err());
 let recovered=G2Affine::deserialize_compressed_unchecked(&encoded[..]).unwrap();assert_eq!(recovered,bad.1);
 let mut scalar=Fr::MODULUS;scalar.add_with_carry(&BigInt::from(1u64));assert_eq!(g1.mul_bigint(scalar).into_affine(),g1);
 let mut input=vec![0u8;64];input[31]=1;input[63]=2;assert_eq!(ecadd_model(&input).unwrap(),g1);assert!(ecadd_model(&[]).unwrap().is_zero());
 input.resize(128,0);let exact=ecadd_model(&input).unwrap();input.extend_from_slice(&[255,123]);assert_eq!(ecadd_model(&input).unwrap(),exact);
 let mut noncanonical=vec![0;128];noncanonical[..32].copy_from_slice(&Fq::MODULUS.to_bytes_be());assert!(ecadd_model(&noncanonical).is_err());
 let z=Bn254::pairing(g1,g2);let left=Bn254::pairing(g1.mul_bigint([2]),g2.mul_bigint([3]));assert_eq!(left,z.mul_bigint([6]));
 assert!(Bn254::multi_pairing([g1.mul_bigint([2]),-g1.mul_bigint([6])],[g2.mul_bigint([3]),g2.into_group()]).is_zero());
 println!("toy_points=19 pairwise_additions=361 scalar_inputs=20 raw_double={:?} normalized=(6,3) scalar7_trace={:?}",raw(doubled),trace);
 println!("g2_wrong_subgroup_x=({k},0) subgroup=false cleared_identity={zero} compressed_bytes={n} validated_decode=reject unchecked_decode=accept",k=bad.0,zero=cleared.is_zero(),n=encoded.len());
 println!("g1_offcurve_subgroup_helper=true full_check=reject identity_full_check=accept eip196_model_empty/padded/surplus/noncanonical=PASS r_plus_1_mul=G1 pairing_2x3=6 full_pairing_product_identity=PASS");
}
