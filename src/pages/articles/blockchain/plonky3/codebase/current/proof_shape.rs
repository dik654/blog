#[derive(Serialize, Deserialize)]
#[serde(bound = "")]
pub struct Proof<SC: StarkGenericConfig> {
    pub commitments: Commitments<Com<SC>>,
    pub opened_values: OpenedValues<SC::Challenge>,
    pub opening_proof: PcsProof<SC>,
    pub degree_bits: usize,
    /// Proof of work for the phase before the out-of-domain point is sampled.
    ///
    /// Trivially valid (and unread) when
    /// [`StarkGenericConfig::ood_proof_of_work_bits`] is `0`.
    pub ood_pow_witness: Val<SC>,
}

impl<SC: StarkGenericConfig> Proof<SC> {
    /// Legacy conjectured security level (in bits).
    ///
    /// For historical comparison only: this may exceed [`ConjecturedSecurity`]
    /// and is not a soundness bound. Do not use it to size deployment parameters.
    ///
    /// See [`LegacySecurity`].
    pub fn legacy_security(&self, params: &StarkSecurityParams) -> LegacySecurity {
        LegacySecurity::compute_from_params(params, self.degree_bits)
    }

    /// Conjectured security level (in bits).
    ///
    /// See [`ConjecturedSecurity`].
    pub fn conjectured_security(&self, params: &StarkSecurityParams) -> ConjecturedSecurity {
        ConjecturedSecurity::compute_from_params(params, self.degree_bits)
    }

    /// Proven security level (in bits).
    ///
    /// See [`ProvenSecurity`].
    pub fn proven_security(&self, params: &StarkSecurityParams) -> ProvenSecurity {
        ProvenSecurity::compute_from_proof(self.degree_bits, params)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Commitments<Com> {
    pub trace: Com,
    pub quotient_chunks: Com,
    pub random: Option<Com>,
}

/// Every committed polynomial evaluated at the out-of-domain point.
///
/// The opening argument binds each vector here to the commitment it came from.
#[derive(Debug)]
pub struct OpenedValues<Challenge> {
    /// Main trace evaluated at `zeta`.
    pub trace_local: Vec<Challenge>,
    /// Main trace evaluated at `g * zeta`.
    ///
    /// `None` when the AIR has no transition constraints and does not access the next row.
    pub trace_next: Option<Vec<Challenge>>,
    /// Preprocessed trace openings, carried as one unit so the two rows cannot drift apart.
    ///
    /// `None` when the AIR has no preprocessed columns.
    pub preprocessed: Option<PreprocessedOpenedValues<Challenge>>,
    /// One evaluation vector per quotient chunk, in the order the chunks were committed.
    pub quotient_chunks: Vec<Vec<Challenge>>,
    /// Masking polynomial evaluated at `zeta`.
    ///
    /// `None` unless the commitment scheme proves in zero knowledge.
    pub random: Option<Vec<Challenge>>,
}
