/// Note: Because the class is deserialized from untrusted data, it
/// cannot maintain any invariant on its data members; hence, they are
/// all public so as to allow for easy manipulation for testing.
#[derive(Clone, Serialize, Deserialize)]
pub struct VerifiableQueryResult<CP: CommitmentEvaluationProof> {
    /// The result of the query in intermediate form.
    pub result: OwnedTable<CP::Scalar>,
    /// The proof that the query result is valid.
    pub proof: QueryProof<CP>,
}

impl<CP: CommitmentEvaluationProof> VerifiableQueryResult<CP> {
    /// Form a `VerifiableQueryResult` from a query expression.
    ///
    /// This function both computes the result of a query and constructs a proof of the results
    /// validity.
    #[tracing::instrument(name = "VerifiableQueryResult::new", level = "info", skip_all)]
    pub fn new(
        expr: &(impl ProofPlan + Serialize),
        accessor: &impl DataAccessor<CP::Scalar>,
        setup: &CP::ProverPublicSetup<'_>,
        params: &[LiteralValue],
    ) -> PlaceholderResult<Self> {
        log::log_memory_usage("Start");
        let (proof, res) = QueryProof::new(expr, accessor, setup, params)?;
        log::log_memory_usage("End");
        Ok(Self { result: res, proof })
    }

    /// Verify a `VerifiableQueryResult`. Upon success, this function returns the finalized form of
    /// the query result.
    ///
    /// Note: a verified result can still respresent an error (e.g. overflow), but it is a verified
    /// error.
    ///
    /// Note: This does NOT transform the result!
    #[tracing::instrument(name = "VerifiableQueryResult::verify", level = "info", skip_all)]
    pub fn verify(
        self,
        expr: &(impl ProofPlan + Serialize),
        accessor: &impl CommitmentAccessor<CP::Commitment>,
        setup: &CP::VerifierPublicSetup<'_>,
        params: &[LiteralValue],
    ) -> QueryResult<CP::Scalar> {
        log::log_memory_usage("Start");
        let QueryData {
            table,
            verification_hash,
        } = self
            .proof
            .verify(expr, accessor, self.result, setup, params)?;
        Ok(QueryData {
            table: table.try_coerce_with_fields(expr.get_column_result_fields())?,
            verification_hash,
        })
    }
}
