use dezero_rs_learning::autodiff::Value;
use dezero_rs_learning::sequence::{
    cell_gradient_product, detach_state, inverted_dropout, reset_state, Embedding, LayerNorm,
    LstmCell,
};

#[test]
fn reset_changes_values_while_detach_only_cuts_history() {
    let cell = LstmCell::new();
    let (hidden, memory) = reset_state();
    let (next_hidden, next_memory) = cell.step(&Value::new(1.0), &hidden, &memory);
    let (detached_hidden, detached_memory) = detach_state(&next_hidden, &next_memory);
    assert_eq!(detached_hidden.data(), next_hidden.data());
    assert_eq!(detached_memory.data(), next_memory.data());
    assert_eq!(detached_hidden.generation(), 0);
    let (reset_hidden, reset_memory) = reset_state();
    assert_eq!((reset_hidden.data(), reset_memory.data()), (0.0, 0.0));
}

#[test]
fn the_cell_path_gradient_is_the_product_of_forget_gates() {
    assert!((cell_gradient_product(&[0.9, 0.8, 0.5]) - 0.36).abs() < 1e-9);
}

#[test]
fn layer_norm_uses_the_last_feature_axis_and_is_not_identity() {
    let output = LayerNorm::new(3, 1e-5).forward(&[
        Value::new(1.0),
        Value::new(2.0),
        Value::new(3.0),
    ]);
    let mean = output.iter().map(Value::data).sum::<f64>() / output.len() as f64;
    assert!(mean.abs() < 1e-9);
    assert!((output[0].data() - 1.0).abs() > 0.1);
}

#[test]
fn inverted_dropout_preserves_expectation_over_masks() {
    let input = vec![Value::new(2.0)];
    let dropped = inverted_dropout(&input, &[false], 0.5)[0].data();
    let kept = inverted_dropout(&input, &[true], 0.5)[0].data();
    assert!(((dropped + kept) / 2.0 - 2.0).abs() < 1e-9);
}

#[test]
fn repeated_token_ids_accumulate_into_the_same_embedding_row() {
    let embedding = Embedding::new(5, 2);
    let looked_up = embedding.lookup(&[4, 1, 4]);
    let loss = looked_up
        .into_iter()
        .flatten()
        .reduce(|left, right| left.add(&right))
        .unwrap();
    loss.backward(false);
    assert_eq!(embedding.row(4)[0].0.grad_value(), Some(2.0));
    assert_eq!(embedding.row(1)[0].0.grad_value(), Some(1.0));
}
