#[test]
fn test_hyperplonk_e2e() -> Result<(), HyperPlonkErrors> {
    // Example:
    //     q_L(X) * W_1(X)^5 - W_2(X) = 0
    // is represented as
    // vec![
    //     ( 1,    Some(id_qL),    vec![id_W1, id_W1, id_W1, id_W1, id_W1]),
    //     (-1,    None,           vec![id_W2])
    // ]
    //
    // 4 public input
    // 1 selector,
    // 2 witnesses,
    // 2 variables for MLE,
    // 4 wires,
    let gates = CustomizedGates {
        gates: vec![(1, Some(0), vec![0, 0, 0, 0, 0]), (-1, None, vec![1])],
    };
    test_hyperplonk_helper::<Bls12_381>(gates)
}
