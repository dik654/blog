#[derive(Copy, Clone, Eq, PartialEq)]
pub enum AssignOp {
    AssignVar,
    AssignSignal,
    AssignConstraintSignal,
}
