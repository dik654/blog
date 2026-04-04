// commonware/consensus/threshold_simplex — VRF + BLS Threshold

use commonware_cryptography::bls12381::{
    dkg::{Contributor, Phase},
    threshold::Signer,
};

/// threshold_simplex adds VRF leader selection
/// and threshold signatures to base Simplex
pub struct ThresholdEngine<A: Automaton> {
    simplex: Engine<A>,
    signer: Signer,
    group_public_key: PublicKey,
}

impl<A: Automaton> ThresholdEngine<A> {
    /// DKG Phase 1: Generate and distribute shares
    pub async fn run_dkg(
        participants: &[PublicKey],
        threshold: usize,
        my_index: usize,
    ) -> Result<(Signer, PublicKey)> {
        let contributor = Contributor::new(
            participants, threshold, my_index,
        );

        // Phase 1: Generate shares, encrypt, send via P2P
        let shares = contributor.generate_shares();
        for (i, share) in shares.iter().enumerate() {
            send_encrypted(i, share); // No broadcast needed
        }

        // Phase 2: Receive and verify shares
        for share in received_shares {
            contributor.receive_share(share)?;
        }

        // Phase 3: Finalize — derive group public key
        let group_public_key = contributor.finalize()?;

        // Create threshold signer
        let signer = Signer::new(my_share, group_public_key);
        Ok((signer, group_public_key))
    }

    /// Sign with threshold — produces partial signature
    pub fn partial_sign(&self, message: &[u8]) -> PartialSig {
        self.signer.sign(message)
    }

    /// Combine t partial sigs → 96-byte threshold signature
    pub fn combine(partial_sigs: &[PartialSig]) -> ThresholdSig {
        // O(1) size regardless of participant count!
        combine(partial_sigs).unwrap() // 96 bytes
    }

    /// VRF-based leader selection using threshold randomness
    pub fn select_leader(&self, view: u64) -> PublicKey {
        let seed = self.derive_seed(view);
        let index = seed.as_u64() % self.participants.len() as u64;
        self.participants[index as usize]
    }
}

/// Supported signature schemes in Commonware
pub enum SchemePreference {
    /// Fast signing/verification, batch support
    Ed25519,
    /// Signature aggregation, threshold signatures
    Bls12381Multisig,
    /// Threshold signing, O(1) certificate size (96 bytes)
    Bls12381Threshold,
    /// HSM compatible (NIST P-256)
    Secp256r1,
}
