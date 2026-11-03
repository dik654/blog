        let post_result_challenge_count = first_round_builder.num_post_result_challenges();

        // commit to any intermediate MLEs
        let first_round_commitments =
            first_round_builder.commit_intermediate_mles(min_row_num, setup);

        // construct a transcript for the proof
        let mut transcript: Keccak256Transcript = Transcript::new();
        transcript.extend_as_le([SETUP_HASH]);
        transcript.challenge_as_le();
        transcript.extend_serialize_as_le(expr);
        transcript.challenge_as_le();
        transcript.extend_serialize_as_le(&owned_table_result);
        transcript.challenge_as_le();

        for table in expr.get_table_references() {
            let length = accessor.get_length(&table);
            transcript.extend_serialize_as_le(&[0, 0, 0, length]);
        }
        transcript.challenge_as_le();

        for commitment in CP::Commitment::compute_commitments(
            &expr
                .get_column_references()
                .into_iter()
                .map(|col| {
                    CommittableColumn::from(accessor.get_column(&col.table_ref(), &col.column_id()))
                })
                .collect_vec(),
            min_row_num,
            setup,
        ) {
            transcript.extend_serialize_as_le(&commitment);
        }
        transcript.challenge_as_le();

        transcript.extend_serialize_as_le(&min_row_num);
        transcript.challenge_as_le();

        let first_round_message = FirstRoundMessage {
            range_length,
            chi_evaluation_lengths: chi_evaluation_lengths.to_vec(),
            rho_evaluation_lengths: rho_evaluation_lengths.to_vec(),
            post_result_challenge_count,
            round_commitments: first_round_commitments,
        };
        transcript.extend_serialize_as_le(&first_round_message);

        // These are the challenges that will be consumed by the proof
        // Specifically, these are the challenges that the verifier sends to
        // the prover after the prover sends the result, but before the prover
        // send commitments to the intermediate witness columns.
        // Note: the last challenge in the vec is the first one that is consumed.
        let post_result_challenges =
            core::iter::repeat_with(|| transcript.scalar_challenge_as_be())
                .take(post_result_challenge_count)
                .collect();

        let mut final_round_builder =
            FinalRoundBuilder::new(num_sumcheck_variables, post_result_challenges);

        expr.final_round_evaluate(&mut final_round_builder, &alloc, &table_map, params)?;

        let num_sumcheck_variables = final_round_builder.num_sumcheck_variables();

        // commit to any intermediate MLEs
        let final_round_commitments =
            final_round_builder.commit_intermediate_mles(min_row_num, setup);

        let final_round_message = FinalRoundMessage {
            subpolynomial_constraint_count: final_round_builder.num_sumcheck_subpolynomials(),
            round_commitments: final_round_commitments,
            bit_distributions: final_round_builder.bit_distributions().to_vec(),
        };

        // add the commitments, bit distributions and chi evaluation lengths to the proof
        transcript.challenge_as_le();
        transcript.extend_serialize_as_le(&final_round_message);

        // construct the sumcheck polynomial
        let num_random_scalars =
            num_sumcheck_variables + final_round_message.subpolynomial_constraint_count;
        let random_scalars: Vec<_> =
            core::iter::repeat_with(|| transcript.scalar_challenge_as_be())
                .take(num_random_scalars)
                .collect();
