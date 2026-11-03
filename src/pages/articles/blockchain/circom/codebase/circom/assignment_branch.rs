if let AssignOp::AssignConstraintSignal = op {
    if value_right.is_nonquadratic() {
        let err = Result::Err(ExecutionError::NonQuadraticConstraint);
        treat_result_with_execution_error(
            err,
            meta,
            &mut runtime.runtime_errors,
            &runtime.call_trace,
        )?;
    } else {
        let p = runtime.constants.get_p().clone();
        let symbol = signal_left;
        let expr = AExpr::sub(&symbol, &value_right, &p);
        let ctr = AExpr::transform_expression_to_constraint_form(expr, &p).unwrap();
        node.add_constraint(ctr);
    }
} else if let AssignOp::AssignSignal = op {// needs fix, check case arrays
    //debug_assert!(possible_constraint.is_some());
    let signal_name = match signal_left{
        AExpr::Signal { symbol } =>{
            symbol
        },
        _ => unreachable!()
    };

    if !value_right.is_nonquadratic() && !node.is_custom_gate {
        needs_double_arrow.push(signal_name);
    }
}
