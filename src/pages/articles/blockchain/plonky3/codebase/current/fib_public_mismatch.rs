fn test_public_value() {
    test_public_value_impl(1 << 3, 21, 2);
}

#[test]
fn test_short_public_values_rejected() {
    let trace = generate_trace_rows::<Val>(0, 1, 1 << 3);
    let config = make_two_adic_config(2);
    let pis = vec![BabyBear::ZERO, BabyBear::ONE, BabyBear::from_u64(21)];

    let proof = prove(&config, &FibonacciAir {}, trace, &pis).unwrap();
    let short_pis = vec![BabyBear::ZERO, BabyBear::ONE];
    let err = verify(&config, &FibonacciAir {}, &proof, &short_pis)
        .expect_err("verification should reject short public values");
    match err {
        p3_uni_stark::VerificationError::InvalidProofShape(
            InvalidProofShapeError::PublicValuesLengthMismatch { expected, got },
        ) => {
            assert_eq!(expected, 3);
            assert_eq!(got, 2);
        }
        _ => panic!("unexpected error: {err:?}"),
    }
}
