pub struct BundleAccount {
    /// Current account information.
    pub info: Option<AccountInfo>,
    /// Original account information before modifications.
    pub original_info: Option<AccountInfo>,
    /// Contains both original and present storage values.
    pub storage: StorageWithOriginalValues,
    /// Created, changed, destroyed or storage-wiped status.
    pub status: AccountStatus,
}

pub enum BundleRetention {
    /// Only plain state is updated.
    PlainState,
    /// Both plain state and reverts are retained.
    Reverts,
}

pub struct BundleState {
    /// Accounts changed by the execution.
    pub state: AddressMap<BundleAccount>,
    /// Contracts created by the execution.
    pub contracts: B256Map<Bytecode>,
    /// Changes needed to revert the bundle.
    pub reverts: Reverts,
    pub state_size: usize,
    pub reverts_size: usize,
}

pub fn merge_transitions(&mut self, retention: BundleRetention) {
    if let Some(transition_state) = self.transition_state.as_mut().map(TransitionState::take) {
        self.bundle_state
            .apply_transitions_and_create_reverts(transition_state, retention);
    }
}

pub fn load_cache_account(&mut self, address: Address) -> Result<&mut CacheAccount, DB::Error> {
    // If the account is not already in the bundle or cache, State loads it from the database.
    Self::load_cache_account_with(
        &mut self.cache,
        self.use_preloaded_bundle,
        &self.bundle_state,
        &mut self.database,
        address,
    )
}
