// Reth v2.8.1 · crates/transaction-pool/src/validate/eth.rs
// Excerpts: L401–435 and L661–730. The intervening stateless checks are omitted.

fn validate_one_with_provider<P, F>(
    &self,
    origin: TransactionOrigin,
    transaction: Tx,
    maybe_state: &mut Option<P>,
    state_provider: F,
) -> TransactionValidationOutcome<Tx>
where
    P: AccountInfoReader,
    F: FnOnce() -> Result<P, ProviderError>,
{
    match self.validate_stateless(origin, &transaction) {
        Ok(()) => {
            // stateless checks passed, pass transaction down stateful validation pipeline
            // If we don't have a state provider yet, fetch the latest state
            if maybe_state.is_none() {
                match state_provider() {
                    Ok(new_state) => {
                        *maybe_state = Some(new_state);
                    }
                    Err(err) => {
                        return TransactionValidationOutcome::Error(
                            *transaction.hash(),
                            Box::new(err),
                        )
                    }
                }
            }

            let state = maybe_state.as_ref().expect("provider is set");

            self.validate_stateful(origin, transaction, state)
        }
        Err(err) => TransactionValidationOutcome::Invalid(transaction, err),
    }
}

// ... validate_stateless L452–658 omitted ...

pub fn validate_stateful<P>(
    &self,
    origin: TransactionOrigin,
    mut transaction: Tx,
    state: P,
) -> TransactionValidationOutcome<Tx>
where
    P: AccountInfoReader,
{
    // Use provider to get account info
    let account = match state.basic_account(transaction.sender_ref()) {
        Ok(account) => account.unwrap_or_default(),
        Err(err) => {
            return TransactionValidationOutcome::Error(*transaction.hash(), Box::new(err))
        }
    };

    // check for bytecode
    match self.validate_sender_bytecode(&transaction, &account, &state) {
        Err(outcome) => return outcome,
        Ok(Err(err)) => return TransactionValidationOutcome::Invalid(transaction, err),
        _ => {}
    };

    // Checks for nonce
    if transaction.requires_nonce_check() &&
        let Err(err) = self.validate_sender_nonce(&transaction, &account)
    {
        return TransactionValidationOutcome::Invalid(transaction, err)
    }

    // checks for max cost not exceedng account_balance
    if let Err(err) = self.validate_sender_balance(&transaction, &account) {
        return TransactionValidationOutcome::Invalid(transaction, err)
    }

    // heavy blob tx validation
    let maybe_blob_sidecar = match self.validate_eip4844(&mut transaction) {
        Err(err) => return TransactionValidationOutcome::Invalid(transaction, err),
        Ok(sidecar) => sidecar,
    };

    // Run additional stateful validation if configured
    if let Some(check) = &self.additional_stateful_validation &&
        let Err(err) = check(origin, &transaction, &state)
    {
        return TransactionValidationOutcome::Invalid(transaction, err)
    }

    let authorities = self.recover_authorities(&transaction);
    // Return the valid transaction
    TransactionValidationOutcome::Valid {
        balance: account.balance,
        state_nonce: account.nonce,
        bytecode_hash: account.bytecode_hash,
        transaction: ValidTransaction::new(transaction, maybe_blob_sidecar),
        // by this point assume all external transactions should be propagated
        propagate: match origin {
            TransactionOrigin::External => true,
            TransactionOrigin::Local => {
                self.local_transactions_config.propagate_local_transactions
            }
            TransactionOrigin::Private => false,
        },
        authorities,
    }
}
