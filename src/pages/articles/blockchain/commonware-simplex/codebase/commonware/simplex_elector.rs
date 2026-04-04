// consensus/src/simplex/elector.rs — Leader election

/// Configuration for creating an Elector.
/// Determinism required: same inputs → same leader index.
pub trait Config<S: Scheme>: Clone + Default + Send + 'static {
    type Elector: Elector<S>;
    fn build(self, participants: &Set<S::PublicKey>) -> Self::Elector;
}

/// An initialized elector that selects leaders.
pub trait Elector<S: Scheme>: Clone + Send + 'static {
    /// Selects the leader for the given round.
    /// `certificate` is None only for view 1 (after genesis).
    fn elect(&self, round: Round, certificate: Option<&S::Certificate>) -> Leader;
}

/// RoundRobin — view mod n_participants 순환.
/// Optionally shuffled using a seed.
pub struct RoundRobinElector {
    participants: Vec<PublicKey>,
}

impl Elector for RoundRobinElector {
    fn elect(&self, round: Round, _certificate: Option<&Certificate>) -> Leader {
        let idx = modulo(round.view(), self.participants.len());
        Leader { idx, key: self.participants[idx].clone() }
    }
}

/// Random — BLS threshold VRF에서 파생한 시드로 리더 선출.
/// 편향 없는 랜덤성 — 임계값 미만의 참여자가 결과 조작 불가.
pub struct RandomElector<V: Variant> {
    participants: Vec<PublicKey>,
    _phantom: PhantomData<V>,
}

impl Elector for RandomElector {
    fn elect(&self, round: Round, certificate: Option<&Certificate>) -> Leader {
        match certificate {
            None => {
                // View 1: certificate 없음 → round-robin fallback
                let idx = modulo(round.view(), self.participants.len());
                Leader { idx, key: self.participants[idx].clone() }
            }
            Some(cert) => {
                // seed = SHA256(certificate) → mod participants
                let seed = Sha256::hash(&cert.encode());
                let idx = modulo_from_seed(seed, self.participants.len());
                Leader { idx, key: self.participants[idx].clone() }
            }
        }
    }
}
