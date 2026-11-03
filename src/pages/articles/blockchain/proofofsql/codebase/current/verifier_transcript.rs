    pub fn verify(
        self,
        expr: &(impl ProofPlan + Serialize),
        accessor: &impl CommitmentAccessor<CP::Commitment>,
        result: OwnedTable<CP::Scalar>,
        setup: &CP::VerifierPublicSetup<'_>,
        params: &[LiteralValue],
    ) -> QueryResult<CP::Scalar> {
        log::log_memory_usage("Start");

        let table_refs = expr.get_table_references();
        let (min_row_num, _) = get_index_range(accessor, &table_refs);
        let num_sumcheck_variables = cmp::max(log2_up(self.first_round_message.range_length), 1);
        assert!(num_sumcheck_variables > 0);

        // validate bit decompositions
        for dist in &self.final_round_message.bit_distributions {
            if !dist.is_valid() {
                Err(ProofError::VerificationError {
                    error: "invalid bit distributions",
                })?;
            } else if !dist.is_within_acceptable_range() {
                Err(ProofError::VerificationError {
                    error: "bit distribution outside of acceptable range",
                })?;
            }
        }

        let column_references = expr.get_column_references();

        // construct a transcript for the proof
        let mut transcript: Keccak256Transcript = Transcript::new();
        transcript.extend_as_le([SETUP_HASH]);
        transcript.challenge_as_le();
        transcript.extend_serialize_as_le(expr);
        transcript.challenge_as_le();
        transcript.extend_serialize_as_le(&result);
        transcript.challenge_as_le();

        for table in expr.get_table_references() {
            let length = accessor.get_length(&table);
            transcript.extend_serialize_as_le(&[0, 0, 0, length]);
        }
        transcript.challenge_as_le();

        for commitment in expr
            .get_column_references()
            .into_iter()
            .map(|col| accessor.get_commitment(&col.table_ref(), &col.column_id()))
        {
            transcript.extend_serialize_as_le(&commitment);
        }
        transcript.challenge_as_le();

        transcript.extend_serialize_as_le(&min_row_num);
        transcript.challenge_as_le();

        transcript.extend_serialize_as_le(&self.first_round_message);

        // These are the challenges that will be consumed by the proof
        // Specifically, these are the challenges that the verifier sends to
        // the prover after the prover sends the result, but before the prover
        // send commitments to the intermediate witness columns.
        // Note: the last challenge in the vec is the first one that is consumed.
        let post_result_challenges =
            core::iter::repeat_with(|| transcript.scalar_challenge_as_be())
                .take(self.first_round_message.post_result_challenge_count)
                .collect();

        // add the commitments and bit distributions to the proof
        transcript.challenge_as_le();
        transcript.extend_serialize_as_le(&self.final_round_message);

        // draw the random scalars for sumcheck
        let num_random_scalars =
            num_sumcheck_variables + self.final_round_message.subpolynomial_constraint_count;
        let random_scalars: Vec<_> =
            core::iter::repeat_with(|| transcript.scalar_challenge_as_be())
                .take(num_random_scalars)
                .collect();
        let sumcheck_random_scalars = SumcheckRandomScalars::new(
            &random_scalars,
            self.first_round_message.range_length,
            num_sumcheck_variables,
        );
        transcript.challenge_as_le();

        // verify sumcheck up to the evaluation check
        let subclaim = self.sumcheck_proof.verify_without_evaluation(
            &mut transcript,
            num_sumcheck_variables,
            &Zero::zero(),
        )?;

        // commit to mle evaluations
        transcript.extend_serialize_as_le(&self.pcs_proof_evaluations);
