use std::cell::{Cell, RefCell};
use std::collections::HashSet;
use std::rc::{Rc, Weak};

thread_local! {
    static RECORDING: Cell<bool> = const { Cell::new(true) };
}

#[derive(Clone)]
pub struct Value {
    inner: Rc<RefCell<Node>>,
}

struct Node {
    data: f64,
    grad: Option<Value>,
    creator: Option<Rc<OpState>>,
    generation: usize,
}

#[derive(Clone, Copy)]
enum Op {
    Add,
    Sub,
    Mul,
    Div,
    Neg,
    Exp,
    Tanh,
    Pow(f64),
}

pub struct OpState {
    op: Op,
    inputs: Vec<Value>,
    outputs: Vec<Weak<RefCell<Node>>>,
    generation: usize,
}

struct RecordingGuard {
    previous: bool,
}

impl RecordingGuard {
    fn set(enabled: bool) -> Self {
        let previous = RECORDING.with(|flag| flag.replace(enabled));
        Self { previous }
    }
}

impl Drop for RecordingGuard {
    fn drop(&mut self) {
        RECORDING.with(|flag| flag.set(self.previous));
    }
}

impl Value {
    pub fn new(data: f64) -> Self {
        Self {
            inner: Rc::new(RefCell::new(Node {
                data,
                grad: None,
                creator: None,
                generation: 0,
            })),
        }
    }

    pub fn data(&self) -> f64 {
        self.inner.borrow().data
    }

    pub fn set_data(&self, data: f64) {
        self.inner.borrow_mut().data = data;
    }

    pub fn grad(&self) -> Option<Value> {
        self.inner.borrow().grad.clone()
    }

    pub fn grad_value(&self) -> Option<f64> {
        self.grad().map(|grad| grad.data())
    }

    pub fn clear_grad(&self) {
        self.inner.borrow_mut().grad = None;
    }

    pub fn generation(&self) -> usize {
        self.inner.borrow().generation
    }

    pub fn id(&self) -> usize {
        Rc::as_ptr(&self.inner) as usize
    }

    pub fn detach(&self) -> Value {
        Value::new(self.data())
    }

    pub fn add(&self, other: &Value) -> Value {
        apply(Op::Add, vec![self.clone(), other.clone()])
    }

    pub fn sub(&self, other: &Value) -> Value {
        apply(Op::Sub, vec![self.clone(), other.clone()])
    }

    pub fn mul(&self, other: &Value) -> Value {
        apply(Op::Mul, vec![self.clone(), other.clone()])
    }

    pub fn div(&self, other: &Value) -> Value {
        apply(Op::Div, vec![self.clone(), other.clone()])
    }

    pub fn neg(&self) -> Value {
        apply(Op::Neg, vec![self.clone()])
    }

    pub fn exp(&self) -> Value {
        apply(Op::Exp, vec![self.clone()])
    }

    pub fn tanh(&self) -> Value {
        apply(Op::Tanh, vec![self.clone()])
    }

    pub fn powf(&self, exponent: f64) -> Value {
        apply(Op::Pow(exponent), vec![self.clone()])
    }

    pub fn sigmoid(&self) -> Value {
        let one = Value::new(1.0);
        one.div(&one.add(&self.neg().exp()))
    }

    pub fn backward(&self, create_graph: bool) {
        if self.grad().is_none() {
            self.inner.borrow_mut().grad = Some(Value::new(1.0));
        }

        let mut ready = Vec::<Rc<OpState>>::new();
        let mut seen = HashSet::<usize>::new();
        if let Some(creator) = self.inner.borrow().creator.clone() {
            enqueue(creator, &mut ready, &mut seen);
        }

        while !ready.is_empty() {
            ready.sort_by_key(|state| state.generation);
            let state = ready.pop().expect("ready queue is not empty");
            let output_grad = state
                .outputs
                .first()
                .and_then(Weak::upgrade)
                .and_then(|node| node.borrow().grad.clone())
                .expect("a live output must have a gradient");

            let _recording = RecordingGuard::set(create_graph);
            let input_grads = local_backward(&state.op, &state.inputs, &output_grad);
            for (input, contribution) in state.inputs.iter().zip(input_grads) {
                let accumulated = match input.grad() {
                    Some(previous) => previous.add(&contribution),
                    None => contribution,
                };
                input.inner.borrow_mut().grad = Some(accumulated);

                if let Some(creator) = input.inner.borrow().creator.clone() {
                    enqueue(creator, &mut ready, &mut seen);
                }
            }
        }
    }

    pub fn creator_handle(&self) -> Option<Weak<OpState>> {
        self.inner
            .borrow()
            .creator
            .as_ref()
            .map(Rc::downgrade)
    }
}

pub fn no_grad<T>(f: impl FnOnce() -> T) -> T {
    let _guard = RecordingGuard::set(false);
    f()
}

fn enqueue(
    state: Rc<OpState>,
    ready: &mut Vec<Rc<OpState>>,
    seen: &mut HashSet<usize>,
) {
    let id = Rc::as_ptr(&state) as usize;
    if seen.insert(id) {
        ready.push(state);
    }
}

fn apply(op: Op, inputs: Vec<Value>) -> Value {
    let generation = inputs.iter().map(Value::generation).max().unwrap_or(0);
    let data = forward_value(&op, &inputs);
    let output = Value::new(data);

    let recording = RECORDING.with(Cell::get);
    if recording {
        let state = Rc::new(OpState {
            op,
            inputs,
            outputs: vec![Rc::downgrade(&output.inner)],
            generation,
        });
        let mut node = output.inner.borrow_mut();
        node.creator = Some(state);
        node.generation = generation + 1;
    }
    output
}

fn forward_value(op: &Op, inputs: &[Value]) -> f64 {
    let x = inputs[0].data();
    match op {
        Op::Add => x + inputs[1].data(),
        Op::Sub => x - inputs[1].data(),
        Op::Mul => x * inputs[1].data(),
        Op::Div => x / inputs[1].data(),
        Op::Neg => -x,
        Op::Exp => x.exp(),
        Op::Tanh => x.tanh(),
        Op::Pow(exponent) => x.powf(*exponent),
    }
}

fn local_backward(op: &Op, inputs: &[Value], gy: &Value) -> Vec<Value> {
    let one = Value::new(1.0);
    match op {
        Op::Add => vec![gy.clone(), gy.clone()],
        Op::Sub => vec![gy.clone(), gy.neg()],
        Op::Mul => vec![gy.mul(&inputs[1]), gy.mul(&inputs[0])],
        Op::Div => {
            let gx = gy.div(&inputs[1]);
            let gy_denominator = gy
                .mul(&inputs[0])
                .div(&inputs[1].powf(2.0))
                .neg();
            vec![gx, gy_denominator]
        }
        Op::Neg => vec![gy.neg()],
        Op::Exp => vec![gy.mul(&inputs[0].exp())],
        Op::Tanh => {
            let y = inputs[0].tanh();
            vec![gy.mul(&one.sub(&y.powf(2.0)))]
        }
        Op::Pow(exponent) => {
            let scale = Value::new(*exponent);
            vec![gy.mul(&scale).mul(&inputs[0].powf(exponent - 1.0))]
        }
    }
}

