        // Always prepend input lengths to the chi evaluation lengths
        let table_length_map = table_refs
            .into_iter()
            .map(|table_ref| {
                let len = accessor.get_length(&table_ref);
                (table_ref, len)
            })
            .collect::<IndexMap<TableRef, usize>>();

        let chi_evaluation_lengths = table_length_map
            .values()
            .chain(self.first_round_message.chi_evaluation_lengths.iter())
            .copied();

        // pass over the provable AST to fill in the verification builder
        let sumcheck_evaluations = SumcheckMleEvaluations::new(
            self.first_round_message.range_length,
            chi_evaluation_lengths,
            self.first_round_message.rho_evaluation_lengths.clone(),
            &subclaim.evaluation_point,
            &sumcheck_random_scalars,
            &self.pcs_proof_evaluations.first_round,
            &self.pcs_proof_evaluations.final_round,
        );
        let chi_eval_map: IndexMap<TableRef, (CP::Scalar, usize)> = table_length_map
            .into_iter()
            .map(|(table_ref, length)| {
                (
                    table_ref,
                    (sumcheck_evaluations.chi_evaluations[&length], length),
                )
            })
            .collect();
        let mut builder = VerificationBuilderImpl::new(
            sumcheck_evaluations,
            &self.final_round_message.bit_distributions,
            sumcheck_random_scalars.subpolynomial_multipliers,
            post_result_challenges,
            self.first_round_message.chi_evaluation_lengths.clone(),
            self.first_round_message.rho_evaluation_lengths.clone(),
            subclaim.max_multiplicands,
        );

        let pcs_proof_commitments: Vec<_> = self
            .first_round_message
            .round_commitments
            .iter()
            .cloned()
            .chain(
                column_references
                    .iter()
                    .map(|col| accessor.get_commitment(&col.table_ref(), &col.column_id())),
            )
            .chain(self.final_round_message.round_commitments.iter().cloned())
            .collect();
        let evaluation_accessor: IndexMap<_, _> = column_references
            .into_iter()
            .zip(self.pcs_proof_evaluations.column_ref.iter().copied())
            .chunk_by(|(r, _)| r.table_ref())
            .into_iter()
            .map(|(tr, g)| {
                let im: IndexMap<_, _> = g.map(|(cr, eval)| (cr.column_id(), eval)).collect();
                (tr, im)
            })
            .collect();

        let verifier_evaluations =
            expr.verifier_evaluate(&mut builder, &evaluation_accessor, &chi_eval_map, params)?;
        // compute the evaluation of the result MLEs
        let result_evaluations = result.mle_evaluations(&subclaim.evaluation_point);
        // check the evaluation of the result MLEs
        if verifier_evaluations.column_evals() != result_evaluations {
            Err(ProofError::VerificationError {
                error: "result evaluation check failed",
            })?;
        }

        // perform the evaluation check of the sumcheck polynomial
        if builder.sumcheck_evaluation() != subclaim.expected_evaluation {
            Err(ProofError::VerificationError {
                error: "sumcheck evaluation check failed",
            })?;
        }

        let pcs_proof_evaluations: Vec<_> = self
            .pcs_proof_evaluations
            .first_round
            .iter()
            .chain(self.pcs_proof_evaluations.column_ref.iter())
            .chain(self.pcs_proof_evaluations.final_round.iter())
            .copied()
            .collect();

        // finally, check the MLE evaluations with the inner product proof
        self.evaluation_proof
            .verify_batched_proof(
                &mut transcript,
                &pcs_proof_commitments,
                &evaluation_random_scalars,
                &pcs_proof_evaluations,
                &subclaim.evaluation_point,
                min_row_num as u64,
                self.first_round_message.range_length,
                setup,
            )
            .map_err(|_e| ProofError::VerificationError {
                error: "Inner product proof of MLE evaluations failed",
            })?;

        let verification_hash = transcript.challenge_as_le();

        log::log_memory_usage("End");

        Ok(QueryData {
