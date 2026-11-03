fn prove(
    poly: &Self::VirtualPolynomial,
    transcript: &mut Self::Transcript,
) -> Result<Self::SumCheckProof, PolyIOPErrors> {
    let start = start_timer!(|| "sum check prove");

    transcript.append_serializable_element(b"aux info", &poly.aux_info)?;

    let mut prover_state = IOPProverState::prover_init(poly)?;
    let mut challenge = None;
    let mut prover_msgs = Vec::with_capacity(poly.aux_info.num_variables);
    for _ in 0..poly.aux_info.num_variables {
        let prover_msg =
            IOPProverState::prove_round_and_update_state(&mut prover_state, &challenge)?;
        transcript.append_serializable_element(b"prover msg", &prover_msg)?;
        prover_msgs.push(prover_msg);
        challenge = Some(transcript.get_and_append_challenge(b"Internal round")?);
    }
    // pushing the last challenge point to the state
    if let Some(p) = challenge {
        prover_state.challenges.push(p)
    };

    end_timer!(start);
    Ok(IOPProof {
        point: prover_state.challenges,
        proofs: prover_msgs,
    })
}

fn verify(
    claimed_sum: F,
    proof: &Self::SumCheckProof,
    aux_info: &Self::VPAuxInfo,
    transcript: &mut Self::Transcript,
) -> Result<Self::SumCheckSubClaim, PolyIOPErrors> {
    let start = start_timer!(|| "sum check verify");

    transcript.append_serializable_element(b"aux info", aux_info)?;
    let mut verifier_state = IOPVerifierState::verifier_init(aux_info);
    for i in 0..aux_info.num_variables {
        let prover_msg = proof.proofs.get(i).expect("proof is incomplete");
        transcript.append_serializable_element(b"prover msg", prover_msg)?;
        IOPVerifierState::verify_round_and_update_state(
            &mut verifier_state,
            prover_msg,
            transcript,
        )?;
    }

    let res = IOPVerifierState::check_and_generate_subclaim(&verifier_state, &claimed_sum);

    end_timer!(start);
    res
}
