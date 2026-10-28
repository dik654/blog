// Source: revm-precompile 43.0.3
// src/lib.rs (focused excerpts)

impl Precompiles {
    /// Returns the precompiles for the given spec.
    pub fn new(spec: PrecompileSpecId) -> &'static Self {
        static INSTANCES: [OnceLock<Precompiles>; PrecompileSpecId::NEXT as usize + 1] =
            [const { OnceLock::new() }; PrecompileSpecId::NEXT as usize + 1];
        INSTANCES[spec as usize].get_or_init(|| init_precompiles(spec))
    }

    /// Returns the precompile for the given address.
    #[inline]
    pub fn get(&self, address: &Address) -> Option<&Precompile> {
        if let Some(short_address) = short_address(address) {
            return self.optimized_access[short_address].as_ref();
        }
        self.inner.get(address)
    }
}

fn init_precompiles(spec: PrecompileSpecId) -> Precompiles {
    use PrecompileSpecId::*;

    let mut precompiles = Precompiles::default();

    // Homestead
    precompiles.extend([
        secp256k1::ECRECOVER,
        hash::SHA256,
        hash::RIPEMD160,
        identity::FUN,
    ]);

    if spec.is_enabled_in(BYZANTIUM) {
        precompiles.extend([
            modexp::BYZANTIUM,
            bn254::add::BYZANTIUM,
            bn254::mul::BYZANTIUM,
            bn254::pair::BYZANTIUM,
        ]);
    }

    if spec.is_enabled_in(ISTANBUL) {
        precompiles.extend([
            bn254::add::ISTANBUL,
            bn254::mul::ISTANBUL,
            bn254::pair::ISTANBUL,
            blake2::FUN,
        ]);
    }

    if spec.is_enabled_in(BERLIN) {
        precompiles.extend([modexp::BERLIN]);
    }

    if spec.is_enabled_in(CANCUN) {
        precompiles.extend([kzg_point_evaluation::POINT_EVALUATION]);
    }

    if spec.is_enabled_in(PRAGUE) {
        precompiles.extend(bls12_381::precompiles());
    }

    if spec.is_enabled_in(OSAKA) {
        precompiles.extend([modexp::OSAKA, secp256r1::P256VERIFY_OSAKA]);
    }

    precompiles
}

impl PrecompileSpecId {
    /// Returns the appropriate precompile Spec for the primitive [SpecId].
    pub const fn from_spec_id(spec_id: SpecId) -> Self {
        use SpecId::*;
        match spec_id {
            FRONTIER | HOMESTEAD | TANGERINE | SPURIOUS_DRAGON => Self::HOMESTEAD,
            BYZANTIUM | PETERSBURG => Self::BYZANTIUM,
            ISTANBUL => Self::ISTANBUL,
            BERLIN | LONDON | MERGE | SHANGHAI => Self::BERLIN,
            CANCUN => Self::CANCUN,
            PRAGUE => Self::PRAGUE,
            OSAKA | AMSTERDAM => Self::OSAKA,
        }
    }
}
