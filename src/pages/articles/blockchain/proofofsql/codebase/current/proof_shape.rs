pub struct FinalRoundMessage<C> {
    pub subpolynomial_constraint_count: usize,
    /// Final Round Commitments
    pub round_commitments: Vec<C>,
    /// Bit distributions
    pub bit_distributions: Vec<BitDistribution>,
}
#[derive(Clone, Serialize, Deserialize)]
pub struct QueryProofPCSProofEvaluations<S> {
    /// MLEs used in first round sumcheck except for the result columns
    pub first_round: Vec<S>,
    /// evaluations of the columns referenced in the query
    pub column_ref: Vec<S>,
    /// MLEs used in final round sumcheck except for the result columns
    pub final_round: Vec<S>,
}

/// The proof for a query.
///
/// Note: Because the class is deserialized from untrusted data, it
/// cannot maintain any invariant on its data members; hence, they are
/// all public so as to allow for easy manipulation for testing.
#[derive(Clone, Serialize, Deserialize)]
pub struct QueryProof<CP: CommitmentEvaluationProof> {
    pub(super) first_round_message: FirstRoundMessage<CP::Commitment>,
    pub(super) final_round_message: FinalRoundMessage<CP::Commitment>,
    /// Sumcheck Proof
    pub(super) sumcheck_proof: SumcheckProof<CP::Scalar>,
    pub(super) pcs_proof_evaluations: QueryProofPCSProofEvaluations<CP::Scalar>,
    /// Inner product proof of the MLEs' evaluations
    pub(super) evaluation_proof: CP,
}

impl<CP: CommitmentEvaluationProof> QueryProof<CP> {
    /// Create a new `QueryProof`.
    #[tracing::instrument(name = "QueryProof::new", level = "debug", skip_all)]
    #[expect(clippy::too_many_lines)]
    pub fn new(
        expr: &(impl ProofPlan + Serialize),
        accessor: &impl DataAccessor<CP::Scalar>,
        setup: &CP::ProverPublicSetup<'_>,
        params: &[LiteralValue],
    ) -> PlaceholderResult<(Self, OwnedTable<CP::Scalar>)> {
