use dezero_rs_learning::autodiff::Value;
use dezero_rs_learning::nn::{
    mean_squared_error, zero_grad, Layer, Linear, Parameter, Sequential, Sgd,
};

#[test]
fn a_full_step_reduces_loss_and_zero_grad_clears_the_previous_batch() {
    let model = Sequential::new(vec![
        Box::new(Linear::new(2, 3, 0.04)),
        Box::new(Linear::new(3, 2, 0.03)),
        Box::new(Linear::new(2, 1, 0.02)),
    ]);
    let input = vec![Value::new(1.0), Value::new(-0.5)];
    let parameters = model.parameters();

    zero_grad(&parameters);
    let before = mean_squared_error(&model.forward(&input), &[0.8]);
    before.backward(false);
    Sgd { learning_rate: 0.1 }.step(&parameters);
    let after = mean_squared_error(&model.forward(&input), &[0.8]);

    assert!(after.data() < before.data());
    zero_grad(&parameters);
    assert!(parameters.iter().all(|parameter| parameter.0.grad().is_none()));
}

#[test]
fn a_shared_parameter_handle_is_updated_only_once() {
    let parameter = Parameter::new(1.0);
    let loss = parameter.0.add(&parameter.0);
    loss.backward(false);
    Sgd { learning_rate: 0.1 }.step(&[parameter.clone(), parameter.clone()]);
    assert!((parameter.0.data() - 0.8).abs() < 1e-9);
}

#[test]
#[should_panic(expected = "Linear expected 2 features")]
fn linear_rejects_the_wrong_feature_shape() {
    Linear::new(2, 1, 0.1).forward(&[Value::new(1.0)]);
}
