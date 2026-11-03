fn prove(
    poly: &Self::VirtualPolynomial,
    transcript: &mut Self::Transcript,
) -> Result<Self::ZeroCheckProof, PolyIOPErrors> {
    let start = start_timer!(|| "zero check prove");

    let length = poly.aux_info.num_variables;
    let r = transcript.get_and_append_challenge_vectors(b"0check r", length)?;
    let f_hat = poly.build_f_hat(r.as_ref())?;
    let res = <Self as SumCheck<F>>::prove(&f_hat, transcript);

    end_timer!(start);
    res
}

fn verify(
    proof: &Self::ZeroCheckProof,
    fx_aux_info: &Self::VPAuxInfo,
    transcript: &mut Self::Transcript,
) -> Result<Self::ZeroCheckSubClaim, PolyIOPErrors> {
    let start = start_timer!(|| "zero check verify");

    // check that the sum is zero
    if proof.proofs[0].evaluations[0] + proof.proofs[0].evaluations[1] != F::zero() {
        return Err(PolyIOPErrors::InvalidProof(format!(
            "zero check: sum {} is not zero",
            proof.proofs[0].evaluations[0] + proof.proofs[0].evaluations[1]
        )));
    }

    // generate `r` and pass it to the caller for correctness check
    let length = fx_aux_info.num_variables;
    let r = transcript.get_and_append_challenge_vectors(b"0check r", length)?;

    // hat_fx's max degree is increased by eq(x, r).degree() which is 1
    let mut hat_fx_aux_info = fx_aux_info.clone();
    hat_fx_aux_info.max_degree += 1;
    let sum_subclaim =
        <Self as SumCheck<F>>::verify(F::zero(), proof, &hat_fx_aux_info, transcript)?;

    // expected_eval = sumcheck.expect_eval/eq(v, r)
    // where v = sum_check_sub_claim.point
    let eq_x_r_eval = eq_eval(&sum_subclaim.point, &r)?;
    let expected_evaluation = sum_subclaim.expected_evaluation / eq_x_r_eval;

    end_timer!(start);
    Ok(ZeroCheckSubClaim {
        point: sum_subclaim.point,
        expected_evaluation,
        init_challenge: r,
    })
}
