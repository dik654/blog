let quadratic_expression = possible_non_quadratic;
let constraint_expression = AExpr::transform_expression_to_constraint_form(
    quadratic_expression,
    runtime.constants.get_p(),
)
.unwrap();
if let Option::Some(node) = actual_node {
    node.add_constraint(constraint_expression);
}
