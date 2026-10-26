// Reth v2.8.1 · crates/ethereum/hardforks/src/hardforks/mod.rs 발췌입니다.

#[derive(Default, Clone, PartialEq, Eq)]
pub struct ChainHardforks {
    forks: Vec<(Box<dyn Hardfork>, ForkCondition)>,
    #[cfg(feature = "std")]
    map: FxHashMap<&'static str, ForkCondition>,
    #[cfg(not(feature = "std"))]
    map: alloc::collections::BTreeMap<&'static str, ForkCondition>,
}

impl ChainHardforks {
    /// The list must be ordered by activation.
    pub fn new(forks: Vec<(Box<dyn Hardfork>, ForkCondition)>) -> Self {
        let map = forks.iter().map(|(fork, condition)| (fork.name(), *condition)).collect();
        Self { forks, map }
    }

    pub fn get<H: Hardfork>(&self, fork: H) -> Option<ForkCondition> {
        self.map.get(fork.name()).copied()
    }

    pub fn forks_iter(&self) -> impl Iterator<Item = (&dyn Hardfork, ForkCondition)> {
        self.forks.iter().map(|(f, b)| (&**f, *b))
    }

    pub fn insert<H: Hardfork>(&mut self, fork: H, condition: ForkCondition) {
        self.remove(&fork);
        let pos = self
            .forks
            .iter()
            .position(|(_, existing_condition)| *existing_condition > condition)
            .unwrap_or(self.forks.len());

        self.map.insert(fork.name(), condition);
        self.forks.insert(pos, (Box::new(fork), condition));
    }
}
