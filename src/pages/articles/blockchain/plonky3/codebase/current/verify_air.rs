    let quotient = recompose_quotient_from_chunks::<SC>(
        &quotient_chunks_domains,
        &opened_values.quotient_chunks,
        zeta,
    )?;

    let zeros;
    let trace_next_slice = match &opened_values.trace_next {
        Some(v) => v.as_slice(),
        None => {
            zeros = SC::Challenge::zero_vec(air_width);
            &zeros
        }
    };
    let pre_next_zeros;
    let preprocessed_next_for_verify = match opened_values.preprocessed_next() {
        Some(v) => Some(v),
        None if preprocessed_width > 0 => {
            pre_next_zeros = SC::Challenge::zero_vec(preprocessed_width);
            Some(pre_next_zeros.as_slice())
        }
        None => None,
    };
    verify_constraints::<SC, A, PcsError<SC>>(
        air,
        preprocessed_width,
        &opened_values.trace_local,
        trace_next_slice,
        opened_values.preprocessed_local(),
        preprocessed_next_for_verify,
        &periodic_values,
        public_values,
        init_trace_domain,
        zeta,
        alpha,
        quotient,
    )?;

    Ok(())
}
