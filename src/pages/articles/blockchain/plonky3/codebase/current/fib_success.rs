/// n-th Fibonacci number expected to be x
fn test_public_value_impl(n: usize, x: u64, log_final_poly_len: usize) {
    let trace = generate_trace_rows::<Val>(0, 1, n);
    let config = make_two_adic_config(log_final_poly_len);
    let pis = vec![BabyBear::ZERO, BabyBear::ONE, BabyBear::from_u64(x)];

    let proof = prove(&config, &FibonacciAir {}, trace, &pis).unwrap();
    verify(&config, &FibonacciAir {}, &proof, &pis).expect("verification failed");
}
