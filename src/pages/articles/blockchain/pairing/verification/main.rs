use ark_bn254::{Bn254, Config, Fq, Fq12, Fq2, Fq6, Fr, G1Affine, G2Affine};
use ark_ec::{
    bn::{BnConfig, G2Prepared},
    pairing::{MillerLoopOutput, Pairing},
    AffineRepr,
};
use ark_ff::{BigInteger, Field, One, PrimeField, Zero};
use num_bigint::BigUint;
fn gcd(mut a: BigUint, mut b: BigUint) -> BigUint {
    while !b.is_zero() {
        let c = &a % &b;
        a = b;
        b = c
    }
    a
}
// Same pinned prepared coefficients, ordinary dense multiplication at each line.
// This checks dispatch/recurrence, not independent line-generation formulas.
fn dense_miller(p: G1Affine, q: G2Affine) -> (Fq12, usize, usize, usize) {
    let prepared = G2Prepared::<Config>::from(q);
    let mut coeffs = prepared.ell_coeffs.iter();
    let mut f = Fq12::one();
    let (mut squares, mut additions, mut lines) = (0, 0, 0);
    let mut apply = |f: &mut Fq12| {
        let (a, b, c) = coeffs.next().unwrap();
        let v = Fq12::new(
            Fq6::new(Fq2::new(a.c0 * p.y, a.c1 * p.y), Fq2::zero(), Fq2::zero()),
            Fq6::new(Fq2::new(b.c0 * p.x, b.c1 * p.x), *c, Fq2::zero()),
        );
        *f *= v;
        lines += 1;
    };
    for i in (1..Config::ATE_LOOP_COUNT.len()).rev() {
        if i != Config::ATE_LOOP_COUNT.len() - 1 {
            f.square_in_place();
            squares += 1;
        }
        apply(&mut f);
        if Config::ATE_LOOP_COUNT[i - 1] != 0 {
            apply(&mut f);
            additions += 1;
        }
    }
    assert!(!Config::X_IS_NEGATIVE);
    apply(&mut f);
    apply(&mut f);
    drop(apply);
    assert!(coeffs.next().is_none());
    (f, squares, additions, lines)
}
fn main() {
    let p = BigUint::from_bytes_be(&Fq::MODULUS.to_bytes_be());
    let r = BigUint::from_bytes_be(&Fr::MODULUS.to_bytes_be());
    let z = BigUint::from(4965661367192848881u64);
    let c = BigUint::from(2u8)
        * &z
        * (BigUint::from(6u8) * z.pow(2) + BigUint::from(3u8) * &z + BigUint::from(1u8));
    let e = (p.pow(12) - BigUint::from(1u8)) / &r;
    assert_eq!(gcd(c.clone(), r.clone()), BigUint::from(1u8));
    let point_p = G1Affine::generator();
    let point_q = G2Affine::generator();
    let miller = Bn254::multi_miller_loop([point_p], [point_q]);
    let ordinary = miller.0.pow(e.to_u64_digits());
    let scaled = miller.0.pow((&e * &c).to_u64_digits());
    let actual = Bn254::final_exponentiation(miller).unwrap();
    assert_eq!(actual.0, scaled);
    assert_ne!(actual.0, ordinary);
    assert!(ordinary.pow(r.to_u64_digits()).is_one());
    assert!(actual.0.pow(r.to_u64_digits()).is_one());
    let c_inverse = Fr::from_be_bytes_mod_order(&c.to_bytes_be())
        .inverse()
        .unwrap()
        .into_bigint();
    assert_eq!(actual.0.pow(c_inverse), ordinary);
    let (dense, squares, additions, lines) = dense_miller(point_p, point_q);
    assert_eq!(dense, miller.0);
    assert_eq!((squares, additions, lines), (63, 21, 87));
    let signed: i128 = Config::ATE_LOOP_COUNT
        .iter()
        .enumerate()
        .map(|(i, &a)| (a as i128) * (1i128 << i))
        .sum();
    assert_eq!(signed, 6 * 4965661367192848881i128 + 2);
    let p2 = point_p.mul_bigint([2]);
    let q3 = point_q.mul_bigint([3]);
    let fused =
        Bn254::multi_miller_loop([p2, -point_p.mul_bigint([6])], [q3, point_q.into_group()]);
    let final_fused = Bn254::final_exponentiation(fused).unwrap();
    assert!(final_fused.is_zero());
    let a = Bn254::multi_miller_loop([p2], [q3]);
    let b = Bn254::multi_miller_loop([-point_p.mul_bigint([6])], [point_q]);
    assert_eq!(fused.0, a.0 * b.0);
    assert_eq!(
        final_fused.0,
        Bn254::final_exponentiation(a).unwrap().0 * Bn254::final_exponentiation(b).unwrap().0
    );
    assert!(Bn254::final_exponentiation(MillerLoopOutput(Fq12::zero())).is_none());
    assert!(Bn254::multi_pairing([G1Affine::identity()], [point_q]).is_zero());
    println!("c={c} gcd_c_r=1 ordinary_E_equals_actual=false cE_equals_actual=true normalize_by_c_inverse=true");
    println!("signed_digits_length={} signed_6z_plus_2={signed} square_calls={squares} nonzero_additions={additions} line_calls={lines} dense_same_prepared_equals_source=true",Config::ATE_LOOP_COUNT.len());
    println!("fused_two_pair_miller_equals_product=true final_once_equals_final_twice=true product_identity=true zero_final=None identity_input=one; no_EVM_no_independent_pairing_no_timing");
}
