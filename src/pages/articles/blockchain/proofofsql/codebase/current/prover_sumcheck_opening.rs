        let state = make_sumcheck_prover_state(
            final_round_builder.sumcheck_subpolynomials(),
            num_sumcheck_variables,
            &SumcheckRandomScalars::new(&random_scalars, range_length, num_sumcheck_variables),
        );
        transcript.challenge_as_le();

        // create the sumcheck proof -- this is the main part of proving a query
        let span = span!(Level::DEBUG, "Sumcheck with initialization").entered();
        let mut evaluation_point = vec![Zero::zero(); state.num_vars];
        let sumcheck_proof = SumcheckProof::create(&mut transcript, &mut evaluation_point, state);
        span.exit();

        // evaluate the MLEs used in sumcheck except for the result columns
        let span = span!(Level::DEBUG, "initialize evaluation_vec").entered();
        let mut evaluation_vec = vec![Zero::zero(); range_length];
        span.exit();
        compute_evaluation_vector(&mut evaluation_vec, &evaluation_point);
        let first_round_pcs_proof_evaluations =
            first_round_builder.evaluate_pcs_proof_mles(&evaluation_vec);
        let span = span!(Level::DEBUG, "initialize column_ref_pcs_proof_evaluations").entered();
        let column_ref_pcs_proof_evaluations: Vec<_> = total_col_refs
            .iter()
            .map(|col_ref| {
                accessor
                    .get_column(&col_ref.table_ref(), &col_ref.column_id())
                    .inner_product(&evaluation_vec)
            })
            .collect();
        span.exit();
        let final_round_pcs_proof_evaluations =
            final_round_builder.evaluate_pcs_proof_mles(&evaluation_vec);

        // commit to the MLE evaluations
        let pcs_proof_evaluations = QueryProofPCSProofEvaluations {
            first_round: first_round_pcs_proof_evaluations,
            column_ref: column_ref_pcs_proof_evaluations,
            final_round: final_round_pcs_proof_evaluations,
        };
        transcript.extend_serialize_as_le(&pcs_proof_evaluations);

        // fold together the pre result MLEs -- this will form the input to an inner product proof
        // of their evaluations (fold in this context means create a random linear combination)
        let random_scalars: Vec<_> =
            core::iter::repeat_with(|| transcript.scalar_challenge_as_be())
                .take(
                    pcs_proof_evaluations.first_round.len()
                        + pcs_proof_evaluations.column_ref.len()
                        + pcs_proof_evaluations.final_round.len(),
                )
                .collect();

        let column_ref_mles: Vec<_> = total_col_refs
            .into_iter()
            .map(|c| {
                Box::new(accessor.get_column(&c.table_ref(), &c.column_id()))
                    as Box<dyn MultilinearExtension<_>>
            })
            .collect();

        let span = span!(Level::DEBUG, "QueryProof get folded_mle").entered();
        let mut folded_mle = vec![Zero::zero(); range_length];
        for (multiplier, evaluator) in random_scalars.iter().zip(
            first_round_builder
                .pcs_proof_mles()
                .iter()
                .chain(&column_ref_mles)
                .chain(final_round_builder.pcs_proof_mles().iter()),
        ) {
            evaluator.mul_add(&mut folded_mle, multiplier);
        }
        span.exit();

        // finally, form the inner product proof of the MLEs' evaluations
        let evaluation_proof = CP::new(
            &mut transcript,
            &folded_mle,
            &evaluation_point,
            min_row_num as u64,
            setup,
        );

        let proof = Self {
            first_round_message,
            final_round_message,
            sumcheck_proof,
            pcs_proof_evaluations,
            evaluation_proof,
        };

        log::log_memory_usage("End");

        Ok((proof, provable_result))
