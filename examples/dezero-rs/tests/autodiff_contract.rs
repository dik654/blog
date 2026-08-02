use dezero_rs_learning::autodiff::{no_grad, Value};

fn close(actual: f64, expected: f64) {
    assert!((actual - expected).abs() < 1e-9, "{actual} != {expected}");
}

#[test]
fn shared_multilevel_graph_accumulates_and_keeps_traversing() {
    let x = Value::new(3.0);
    let branch = x.mul(&x);
    let y = branch.add(&branch);
    let z = y.mul(&Value::new(5.0));
    z.backward(false);
    close(x.grad_value().unwrap(), 60.0);
}

#[test]
fn backward_can_build_a_second_derivative_graph() {
    let x = Value::new(2.0);
    let y = x.powf(3.0);
    y.backward(true);
    let first_derivative = x.grad().unwrap();
    x.clear_grad();
    first_derivative.backward(false);
    close(x.grad_value().unwrap(), 12.0);
}

#[test]
fn no_grad_restores_recording_and_weak_output_breaks_the_cycle() {
    let x = Value::new(2.0);
    let detached_output = no_grad(|| x.mul(&x));
    assert_eq!(detached_output.generation(), 0);

    let recorded_output = x.mul(&x);
    let producer = recorded_output.creator_handle().unwrap();
    assert!(producer.upgrade().is_some());
    drop(recorded_output);
    assert!(producer.upgrade().is_none());

    let recorded_again = x.add(&Value::new(1.0));
    assert_eq!(recorded_again.generation(), 1);
}

