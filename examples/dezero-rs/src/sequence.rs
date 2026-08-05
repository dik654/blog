use crate::autodiff::Value;
use crate::nn::Parameter;

pub struct LstmCell {
    pub input_gate: Parameter,
    pub forget_gate: Parameter,
    pub output_gate: Parameter,
    pub candidate: Parameter,
}

impl LstmCell {
    pub fn new() -> Self {
        Self {
            input_gate: Parameter::new(0.7),
            forget_gate: Parameter::new(0.7),
            output_gate: Parameter::new(0.7),
            candidate: Parameter::new(0.7),
        }
    }

    pub fn step(
        &self,
        input: &Value,
        hidden: &Value,
        cell: &Value,
    ) -> (Value, Value) {
        let joined = input.add(hidden);
        let input_gate = joined.mul(&self.input_gate.0).sigmoid();
        let forget_gate = joined.mul(&self.forget_gate.0).sigmoid();
        let output_gate = joined.mul(&self.output_gate.0).sigmoid();
        let candidate = joined.mul(&self.candidate.0).tanh();
        let next_cell = forget_gate
            .mul(cell)
            .add(&input_gate.mul(&candidate));
        let next_hidden = output_gate.mul(&next_cell.tanh());
        (next_hidden, next_cell)
    }
}

impl Default for LstmCell {
    fn default() -> Self {
        Self::new()
    }
}

pub fn detach_state(hidden: &Value, cell: &Value) -> (Value, Value) {
    (hidden.detach(), cell.detach())
}

pub fn reset_state() -> (Value, Value) {
    (Value::new(0.0), Value::new(0.0))
}

pub fn cell_gradient_product(forget_gates: &[f64]) -> f64 {
    forget_gates.iter().product()
}

pub struct LayerNorm {
    gamma: Vec<Parameter>,
    beta: Vec<Parameter>,
    epsilon: f64,
}

impl LayerNorm {
    pub fn new(feature_size: usize, epsilon: f64) -> Self {
        Self {
            gamma: (0..feature_size).map(|_| Parameter::new(1.0)).collect(),
            beta: (0..feature_size).map(|_| Parameter::new(0.0)).collect(),
            epsilon,
        }
    }

    pub fn forward(&self, features: &[Value]) -> Vec<Value> {
        assert_eq!(features.len(), self.gamma.len());
        let count = Value::new(features.len() as f64);
        let mean = features
            .iter()
            .cloned()
            .reduce(|left, right| left.add(&right))
            .expect("LayerNorm needs features")
            .div(&count);
        let variance = features
            .iter()
            .map(|value| value.sub(&mean).powf(2.0))
            .reduce(|left, right| left.add(&right))
            .expect("LayerNorm needs features")
            .div(&count);
        let denominator = variance.add(&Value::new(self.epsilon)).powf(0.5);

        features
            .iter()
            .enumerate()
            .map(|(index, value)| {
                value
                    .sub(&mean)
                    .div(&denominator)
                    .mul(&self.gamma[index].0)
                    .add(&self.beta[index].0)
            })
            .collect()
    }
}

pub fn inverted_dropout(values: &[Value], keep_mask: &[bool], drop_probability: f64) -> Vec<Value> {
    assert_eq!(values.len(), keep_mask.len());
    assert!((0.0..1.0).contains(&drop_probability));
    let scale = Value::new(1.0 / (1.0 - drop_probability));
    values
        .iter()
        .zip(keep_mask)
        .map(|(value, keep)| {
            if *keep {
                value.mul(&scale)
            } else {
                value.mul(&Value::new(0.0))
            }
        })
        .collect()
}

pub struct Embedding {
    rows: Vec<Vec<Parameter>>,
}

impl Embedding {
    pub fn new(vocabulary_size: usize, width: usize) -> Self {
        let rows = (0..vocabulary_size)
            .map(|row| {
                (0..width)
                    .map(|column| Parameter::new((row * width + column) as f64 / 100.0))
                    .collect()
            })
            .collect();
        Self { rows }
    }

    pub fn lookup(&self, token_ids: &[usize]) -> Vec<Vec<Value>> {
        token_ids
            .iter()
            .map(|token_id| {
                self.rows[*token_id]
                    .iter()
                    .map(|parameter| parameter.0.clone())
                    .collect()
            })
            .collect()
    }

    pub fn row(&self, index: usize) -> Vec<Parameter> {
        self.rows[index].clone()
    }
}
