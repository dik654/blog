// Reth v2.8.1 · crates/transaction-pool/src/validate/eth.rs
// Upstream lines 401–435, 661–730. 중간의 함수는 이 학습 발췌에서 생략했습니다.

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
    // [학습 주석] State를 읽기 전에 transaction 자체만으로 끝낼 수 있는 검사를 실행합니다.
    match self.validate_stateless(origin, &transaction) {
        Ok(()) => {
            // [학습 주석] Stateless 통과 뒤에만 최신 account state provider를 얻습니다.
            if maybe_state.is_none() {
                match state_provider() {
                    Ok(new_state) => {
                        *maybe_state = Some(new_state);
                    }
                    Err(err) => {
                        // [학습 주석] 입력이 틀린 Invalid가 아니라 state 조회 실패인 Error입니다.
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

pub fn validate_stateful<P>(
    &self,
    origin: TransactionOrigin,
    mut transaction: Tx,
    state: P,
) -> TransactionValidationOutcome<Tx>
where
    P: AccountInfoReader,
{
    // [학습 주석] Sender의 현재 account를 한 state snapshot에서 읽습니다.
    let account = match state.basic_account(transaction.sender_ref()) {
        Ok(account) => account.unwrap_or_default(),
        Err(err) => {
            return TransactionValidationOutcome::Error(*transaction.hash(), Box::new(err))
        }
    };

    match self.validate_sender_bytecode(&transaction, &account, &state) {
        Err(outcome) => return outcome,
        Ok(Err(err)) => return TransactionValidationOutcome::Invalid(transaction, err),
        _ => {}
    };

    // [학습 주석] 현재 nonce와 transaction nonce를 비교합니다.
    if transaction.requires_nonce_check() &&
        let Err(err) = self.validate_sender_nonce(&transaction, &account)
    {
        return TransactionValidationOutcome::Invalid(transaction, err)
    }

    // [학습 주석] transaction.cost()를 현재 balance로 감당할 수 있는지 확인합니다.
    if let Err(err) = self.validate_sender_balance(&transaction, &account) {
        return TransactionValidationOutcome::Invalid(transaction, err)
    }

    // [학습 주석] 값싼 검사와 account 검사를 통과한 뒤 Blob sidecar를 검증합니다.
    let maybe_blob_sidecar = match self.validate_eip4844(&mut transaction) {
        Err(err) => return TransactionValidationOutcome::Invalid(transaction, err),
        Ok(sidecar) => sidecar,
    };

    if let Some(check) = &self.additional_stateful_validation &&
        let Err(err) = check(origin, &transaction, &state)
    {
        return TransactionValidationOutcome::Invalid(transaction, err)
    }

    let authorities = self.recover_authorities(&transaction);
    TransactionValidationOutcome::Valid {
        balance: account.balance,
        state_nonce: account.nonce,
        bytecode_hash: account.bytecode_hash,
        transaction: ValidTransaction::new(transaction, maybe_blob_sidecar),
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
