use std::collections::HashSet;

use crate::autodiff::Value;

#[derive(Clone)]
pub struct Parameter(pub Value);

impl Parameter {
    pub fn new(data: f64) -> Self {
        Self(Value::new(data))
    }

    pub fn id(&self) -> usize {
        self.0.id()
    }
}

pub trait Layer {
    fn forward(&self, input: &[Value]) -> Vec<Value>;
    fn parameters(&self) -> Vec<Parameter>;
}

pub struct Linear {
    input_size: usize,
    output_size: usize,
    weights: Vec<Parameter>,
    bias: Vec<Parameter>,
}

impl Linear {
    pub fn new(input_size: usize, output_size: usize, seed: f64) -> Self {
        let weights = (0..input_size * output_size)
            .map(|index| Parameter::new(seed + 0.015 * (index + 1) as f64))
            .collect();
        let bias = (0..output_size)
            .map(|_| Parameter::new(0.0))
            .collect();
        Self {
            input_size,
            output_size,
            weights,
            bias,
        }
    }
}

impl Layer for Linear {
    fn forward(&self, input: &[Value]) -> Vec<Value> {
        assert_eq!(
            input.len(),
            self.input_size,
            "Linear expected {} features, received {}",
            self.input_size,
            input.len()
        );
        (0..self.output_size)
            .map(|column| {
                input
                    .iter()
                    .enumerate()
                    .fold(self.bias[column].0.clone(), |sum, (row, value)| {
                        let weight = &self.weights[row * self.output_size + column].0;
                        sum.add(&value.mul(weight))
                    })
            })
            .collect()
    }

    fn parameters(&self) -> Vec<Parameter> {
        self.weights
            .iter()
            .chain(self.bias.iter())
            .cloned()
            .collect()
    }
}

pub struct Sequential {
    layers: Vec<Box<dyn Layer>>,
}

impl Sequential {
    pub fn new(layers: Vec<Box<dyn Layer>>) -> Self {
        Self { layers }
    }
}

impl Layer for Sequential {
    fn forward(&self, input: &[Value]) -> Vec<Value> {
        self.layers
            .iter()
            .fold(input.to_vec(), |values, layer| layer.forward(&values))
    }

    fn parameters(&self) -> Vec<Parameter> {
        unique_parameters(
            self.layers
                .iter()
                .flat_map(|layer| layer.parameters())
                .collect(),
        )
    }
}

pub fn unique_parameters(parameters: Vec<Parameter>) -> Vec<Parameter> {
    let mut seen = HashSet::new();
    parameters
        .into_iter()
        .filter(|parameter| seen.insert(parameter.id()))
        .collect()
}

pub fn zero_grad(parameters: &[Parameter]) {
    for parameter in unique_parameters(parameters.to_vec()) {
        parameter.0.clear_grad();
    }
}

pub struct Sgd {
    pub learning_rate: f64,
}

impl Sgd {
    pub fn step(&self, parameters: &[Parameter]) {
        for parameter in unique_parameters(parameters.to_vec()) {
            if let Some(gradient) = parameter.0.grad_value() {
                parameter
                    .0
                    .set_data(parameter.0.data() - self.learning_rate * gradient);
            }
        }
    }
}

pub fn mean_squared_error(prediction: &[Value], target: &[f64]) -> Value {
    assert_eq!(prediction.len(), target.len());
    let sum = prediction
        .iter()
        .zip(target)
        .map(|(value, target)| value.sub(&Value::new(*target)).powf(2.0))
        .reduce(|left, right| left.add(&right))
        .expect("MSE needs at least one value");
    sum.div(&Value::new(prediction.len() as f64))
}

