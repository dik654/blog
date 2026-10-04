// Selective harness for unchanged upstream source modules, not the full zkhash package.
#![allow(dead_code, unused_imports)]
use ark_ff::{PrimeField,Field};
mod utils { include!("../codebase/utils.rs"); }
mod fields {
 pub mod bn256 { include!("../codebase/bn256.rs"); }
 pub mod utils { include!("../codebase/field-utils.rs"); }
}
mod merkle_tree { pub mod merkle_tree_fp { include!("../codebase/merkle_tree_fp.rs"); } }
mod poseidon {
 pub mod poseidon_params { include!("../codebase/poseidon_params.rs"); }
 pub mod poseidon { include!("../codebase/poseidon.rs"); }
 pub mod poseidon_instance_bn256 { include!("../codebase/poseidon_instance_bn256.rs"); }
}
mod poseidon2 {
 pub mod poseidon2_params { include!("../codebase/poseidon2_params.rs"); }
 pub mod poseidon2 { include!("../codebase/poseidon2.rs"); }
 pub mod poseidon2_instance_bn256 { include!("../codebase/poseidon2_instance_bn256.rs"); }
}
use fields::bn256::FpBN256 as F;
use merkle_tree::merkle_tree_fp::MerkleTreeHash;
fn json_values(values:&[F])->String {format!("[{}]",values.iter().map(|v|format!("\"{}\"",v.into_bigint())).collect::<Vec<_>>().join(","))}
fn main(){
 let p1=poseidon::poseidon::Poseidon::new(&poseidon::poseidon_instance_bn256::POSEIDON_BN_PARAMS);
 let p2=poseidon2::poseidon2::Poseidon2::new(&poseidon2::poseidon2_instance_bn256::POSEIDON2_BN256_PARAMS);
 let cases=[[F::from(0),F::from(1),F::from(2)],[F::from(3),F::from(4),F::from(0)],[F::from(0);3],[F::from(1);3],[-F::from(1);3]];
 for (i,input) in cases.iter().enumerate(){
  let opt=p1.permutation(input);let plain=p1.permutation_not_opt(input);let second=p2.permutation(input);assert_eq!(opt,plain);
  if i==1{assert_eq!(p1.compress(&[&input[0],&input[1]]),opt[0]);assert_eq!(p2.compress(&[&input[0],&input[1]]),second[0]);}
  println!("{{\"case\":{},\"input\":{},\"poseidon\":{},\"poseidon2\":{},\"optimizedEqualsPlain\":true}}",i,json_values(input),json_values(&opt),json_values(&second));
 }
}
