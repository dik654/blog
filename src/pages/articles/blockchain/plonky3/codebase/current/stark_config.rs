pub trait StarkGenericConfig: Clone {
    /// The [`Pcs`] implementation used to commit to trace polynomials.
    ///
    /// Its domain's base field is the alphabet the transcript sponge speaks.
    /// A prime field below `2^64` is what that layer knows how to encode and absorb.
    type Pcs: UnivariateStarkPcs<
            Self::Challenge,
            Self::Challenger,
            Domain: PolynomialSpace<Val: PrimeField64>,
        >;

    /// The [`ExtensionField`] from which most random challenges are drawn.
    type Challenge: ExtensionField<Val<Self>>;

    /// The [`FieldChallenger`] (Fiat-Shamir) implementation used.
    type Challenger: FieldChallenger<Val<Self>>
        + CanObserve<<Self::Pcs as Pcs<Self::Challenge, Self::Challenger>>::Commitment>
        + CanSample<Self::Challenge>;

    /// Get a reference to the [`Pcs`] used by this proof configuration.
    fn pcs(&self) -> &Self::Pcs;

    /// Get an initialisation of the [`FieldChallenger`] used by this proof configuration.
    fn initialise_challenger(&self) -> Self::Challenger;

    /// Returns 1 if the [`Pcs`] is zero-knowledge, 0 otherwise.
    fn is_zk(&self) -> usize {
        Self::Pcs::ZK as usize
    }
