/// Customized gate is a list of tuples of
///     (coefficient, selector_index, wire_indices)
///
/// Example:
///     q_L(X) * W_1(X)^5 - W_2(X) = 0
/// is represented as
/// vec![
///     ( 1,    Some(id_qL),    vec![id_W1, id_W1, id_W1, id_W1, id_W1]),
///     (-1,    None,           vec![id_W2])
/// ]
///
/// CustomizedGates {
///     gates: vec![
///         (1, Some(0), vec![0, 0, 0, 0, 0]),
///         (-1, None, vec![1])
///     ],
/// };
/// where id_qL = 0 // first selector
/// id_W1 = 0 // first witness
/// id_w2 = 1 // second witness
///
/// NOTE: here coeff is a signed integer, instead of a field element
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct CustomizedGates {
    pub(crate) gates: Vec<(i64, Option<usize>, Vec<usize>)>,
}

impl CustomizedGates {
    /// The degree of the algebraic customized gate
    pub fn degree(&self) -> usize {
        let mut res = 0;
        for x in self.gates.iter() {
            res = max(res, x.2.len() + (x.1.is_some() as usize))
        }
        res
    }
