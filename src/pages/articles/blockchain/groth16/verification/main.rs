//! A reproducible CPU observation harness, separate from the unchanged library.
//! Fixed seeds are for reproduction; this is not a ceremony or deployment tool.
use ark_bn254::{Bn254, Fr, G1Affine, G2Affine};
use ark_ec::AffineRepr;
use ark_ff::{PrimeField, Zero};
use ark_groth16::{prepare_verifying_key, r1cs_to_qap::{LibsnarkReduction, R1CSToQAP}, Groth16, Proof};
use ark_poly::{EvaluationDomain, GeneralEvaluationDomain};
use ark_relations::{gr1cs::{ConstraintSynthesizer, ConstraintSystem, ConstraintSystemRef, OptimizationGoal, SynthesisError}, lc};
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use ark_std::rand::{rngs::StdRng, SeedableRng};
use serde_json::{json, Value};

#[derive(Clone)]
struct Case { x: Option<Fr>, y: Option<Fr>, w: Option<Fr>, v: Option<Fr>, square: bool }
impl ConstraintSynthesizer<Fr> for Case {
    fn generate_constraints(self, cs: ConstraintSystemRef<Fr>) -> Result<(), SynthesisError> {
        let x = cs.new_input_variable(|| self.x.ok_or(SynthesisError::AssignmentMissing))?;
        let y = cs.new_input_variable(|| self.y.ok_or(SynthesisError::AssignmentMissing))?;
        let w = cs.new_witness_variable(|| self.w.ok_or(SynthesisError::AssignmentMissing))?;
        let v = cs.new_witness_variable(|| self.v.ok_or(SynthesisError::AssignmentMissing))?;
        cs.enforce_r1cs_constraint(|| lc!() + x, || lc!() + w, || lc!() + v)?;
        if self.square { cs.enforce_r1cs_constraint(|| lc!() + v, || lc!() + v, || lc!() + y)?; }
        Ok(())
    }
}
fn case(w: Fr, v: Fr, y: u64) -> Case { Case { x: Some(3.into()), y: Some(y.into()), w: Some(w), v: Some(v), square: true } }
fn empty(square: bool) -> Case { Case { x: None, y: None, w: None, v: None, square } }
fn vals(xs: &[Fr]) -> Vec<String> { xs.iter().map(|x| x.into_bigint().to_string()).collect() }
fn compressed(p: &Proof<Bn254>) -> Vec<u8> { let mut b=vec![]; p.serialize_compressed(&mut b).unwrap(); b }
fn verify(vk: &ark_groth16::PreparedVerifyingKey<Bn254>, proof: &Proof<Bn254>, input: &[Fr]) -> bool { Groth16::<Bn254>::verify_proof(vk, proof, input).unwrap() }
// This application wrapper fixes the public layout and consumes the whole message.
fn checked_verify(vk: &ark_groth16::PreparedVerifyingKey<Bn254>, bytes: &[u8], inputs: &[Fr]) -> Result<bool, &'static str> {
    if inputs.len() + 1 != vk.vk.gamma_abc_g1.len() { return Err("public-input-count"); }
    if bytes.len() != 128 { return Err("compressed-proof-length"); }
    let mut reader = bytes;
    let proof = Proof::<Bn254>::deserialize_compressed(&mut reader).map_err(|_| "point-decode")?;
    if !reader.is_empty() { return Err("trailing-bytes"); }
    Groth16::<Bn254>::verify_proof(vk, &proof, inputs).map_err(|_| "verification-error")
}
fn observed(result: Result<bool, &str>) -> Value { match result { Ok(value)=>json!({"accepted":value}), Err(reason)=>json!({"error":reason}) } }
fn qap(c: Case) -> Value {
    let cs=ConstraintSystem::new_ref(); cs.set_optimization_goal(OptimizationGoal::Constraints);
    c.generate_constraints(cs.clone()).unwrap(); cs.finalize();
    let satisfied=cs.is_satisfied().unwrap(); let ni=cs.num_instance_variables(); let nc=cs.num_constraints();
    let domain=GeneralEvaluationDomain::<Fr>::new(ni+nc).unwrap();
    let h=LibsnarkReduction::witness_map::<Fr, GeneralEvaluationDomain<Fr>>(cs.clone()).unwrap();
    let assignment={let b=cs.borrow().unwrap(); [b.instance_assignment().unwrap(),b.witness_assignment().unwrap()].concat()};
    let matrices=cs.to_matrices().unwrap(); let m=&matrices["R1CS"];
    let mut u=vec![Fr::zero();domain.size()]; let mut v=u.clone(); let mut w=u.clone();
    for i in 0..nc { for (coef,k) in &m[0][i] {u[i]+=*coef*assignment[*k];} for(coef,k)in&m[1][i]{v[i]+=*coef*assignment[*k];} for(coef,k)in&m[2][i]{w[i]+=*coef*assignment[*k];} }
    u[nc..nc+ni].copy_from_slice(&assignment[..ni]);
    let evaluations=json!({"u":vals(&u),"v":vals(&v),"w":vals(&w)});
    domain.ifft_in_place(&mut u);domain.ifft_in_place(&mut v);domain.ifft_in_place(&mut w);
    let eval=|coeffs:&[Fr],x:Fr|coeffs.iter().rev().fold(Fr::zero(),|a,c|a*x+c);
    let checks: Vec<Value>=[5u64,7,11].iter().map(|x| {let x=Fr::from(*x);let residual=eval(&u,x)*eval(&v,x)-eval(&w,x)-eval(&h,x)*domain.evaluate_vanishing_polynomial(x);json!({"point":x.to_string(),"identity":residual.is_zero(),"residual":residual.into_bigint().to_string()})}).collect();
    json!({"satisfied":satisfied,"instances":ni,"constraints":nc,"domain":domain.size(),"assignment":vals(&assignment),"evaluationRows":evaluations,"h":vals(&h),"checks":checks})
}
fn main() {
    let mut rng=StdRng::seed_from_u64(20261005);
    let pk=Groth16::<Bn254>::generate_random_parameters_with_reduction(empty(true),&mut rng).unwrap(); let pvk=prepare_verifying_key(&pk.vk);
    let valid=case(4.into(),12.into(),144); let public=[Fr::from(3),Fr::from(144)];
    let invalid=case(5.into(),12.into(),144);
    if std::env::args().any(|a|a=="--invalid-only") {
        let result=std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| Groth16::<Bn254>::create_proof_with_reduction(invalid,&pk,Fr::from(13),Fr::from(17))));
        let observation=match result {Ok(Ok(p))=>json!({"returnedProof":true,"verified":verify(&pvk,&p,&public)}),Ok(Err(e))=>json!({"returnedError":format!("{e:?}")}),Err(_)=>json!({"panicked":true})};
        println!("{}",json!({"debugAssertions":cfg!(debug_assertions),"invalidWitness":observation}));return;
    }
    let p=Groth16::<Bn254>::create_proof_with_reduction(valid.clone(),&pk,Fr::from(13),Fr::from(17)).unwrap();
    let again=Groth16::<Bn254>::create_proof_with_reduction(valid.clone(),&pk,Fr::from(13),Fr::from(17)).unwrap();
    let other=Groth16::<Bn254>::create_proof_with_reduction(valid.clone(),&pk,Fr::from(19),Fr::from(23)).unwrap();
    let no_zk=Groth16::<Bn254>::create_proof_with_reduction_no_zk(valid.clone(),&pk).unwrap();
    let negative=Groth16::<Bn254>::create_proof_with_reduction(case(-Fr::from(4),-Fr::from(12),144),&pk,Fr::from(29),Fr::from(31)).unwrap();
    let mut bytes=compressed(&p);let cb=bytes.len();let mut uncompressed=vec![];p.serialize_uncompressed(&mut uncompressed).unwrap();
    let decoded=Proof::<Bn254>::deserialize_compressed(bytes.as_slice()).unwrap();
    bytes.push(7);let mut reader=bytes.as_slice();let trailing=Proof::<Bn254>::deserialize_compressed(&mut reader).is_ok();
    let all_identity=Proof::<Bn254>{a:G1Affine::zero(),b:G2Affine::zero(),c:G1Affine::zero()};let identity_bytes=compressed(&all_identity);
    let bad=G1Affine::new_unchecked(1.into(),1.into());let mut bad_bytes=vec![];bad.serialize_uncompressed(&mut bad_bytes).unwrap();
    let mut changed=valid.clone();changed.square=false;changed.y=Some(145.into());let pk2=Groth16::<Bn254>::generate_random_parameters_with_reduction(empty(false),&mut rng).unwrap();let pvk2=prepare_verifying_key(&pk2.vk);let p2=Groth16::<Bn254>::create_proof_with_reduction(changed,&pk2,Fr::from(13),Fr::from(17)).unwrap();
    let invalid_result=std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| Groth16::<Bn254>::create_proof_with_reduction(invalid.clone(),&pk,Fr::from(13),Fr::from(17))));
    let invalid_observation=match invalid_result {Ok(Ok(p))=>json!({"returnedProof":true,"verified":verify(&pvk,&p,&public)}),Ok(Err(e))=>json!({"returnedError":format!("{e:?}")}),Err(_)=>json!({"panicked":true})};
    println!("{}",serde_json::to_string_pretty(&json!({
        "profile":{"crate":"ark-groth16 0.6.0","commit":"0bb3e604c534bd118ed477eaf1231f591d6fc40f","curve":"BN254","debugAssertions":cfg!(debug_assertions),"setup":"local deterministic seed; no ceremony","parallel":false},
        "inputs":{"valid":verify(&pvk,&p,&public),"wrongY":verify(&pvk,&p,&[3.into(),145.into()]),"swapped":verify(&pvk,&p,&[144.into(),3.into()]),"short":verify(&pvk,&p,&[3.into()]),"long":verify(&pvk,&p,&[3.into(),144.into(),999.into()]),"empty":verify(&pvk,&p,&[])},
        "randomness":{"sameFixedPairSameProof":p==again,"changedPairChangesProof":p!=other,"changedPairVerified":verify(&pvk,&other,&public),"noZkVerified":verify(&pvk,&no_zk,&public)},
        "negativeWitnessVerified":verify(&pvk,&negative,&public),"invalidWitness":invalid_observation,
        "serialization":{"compressedBytes":cb,"uncompressedBytes":uncompressed.len(),"roundtrip":decoded==p,"trailingDecoded":trailing,"trailingBytesLeft":reader.len(),"allIdentityDecodes":Proof::<Bn254>::deserialize_compressed(identity_bytes.as_slice()).is_ok(),"allIdentityVerified":verify(&pvk,&all_identity,&public),"offCurve11Decodes":G1Affine::deserialize_uncompressed(bad_bytes.as_slice()).is_ok()},
        "wrapper":{"valid":observed(checked_verify(&pvk,&compressed(&p),&public)),"longPublic":observed(checked_verify(&pvk,&compressed(&p),&[3.into(),144.into(),999.into()])),"shortPublic":observed(checked_verify(&pvk,&compressed(&p),&[3.into()])),"trailingBytes":observed(checked_verify(&pvk,&bytes,&public))},
        "missingSquare":{"newKeyProofY145":verify(&pvk2,&p2,&[3.into(),145.into()]),"originalKeyRejects":!verify(&pvk,&p2,&[3.into(),145.into()])},
        "validQap":qap(valid),"invalidQap":qap(invalid)
    })).unwrap());
}
