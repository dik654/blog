use alloy::consensus::TrieAccount;
use alloy::primitives::{keccak256, Bytes, B256, U256};
use alloy::rlp;
use alloy::rpc::types::EIP1186AccountProofResponse;
use alloy_trie::{proof::verify_proof, Nibbles, KECCAK_EMPTY};
use eyre::{eyre, Result};

use super::errors::ExecutionError;

/// Verify a given `EIP1186AccountProofResponse`'s account proof against given state root.
pub fn verify_account_proof(
    proof: &EIP1186AccountProofResponse,
    state_root: B256,
) -> Result<()> {
    let account_key = proof.address;
    let account = TrieAccount {
        nonce: proof.nonce,
        balance: proof.balance,
        storage_root: proof.storage_hash,
        code_hash: proof.code_hash,
    };

    verify_mpt_proof(state_root, account_key, account, &proof.account_proof)
        .map_err(|_| eyre!(ExecutionError::InvalidAccountProof(proof.address)))
}

/// Verify a given `EIP1186AccountProofResponse`'s storage proof against the storage root.
pub fn verify_storage_proof(proof: &EIP1186AccountProofResponse) -> Result<()> {
    for storage_proof in &proof.storage_proof {
        let key = storage_proof.key.as_b256();
        let value = storage_proof.value;

        verify_mpt_proof(proof.storage_hash, key, value, &storage_proof.proof)
            .map_err(|_| ExecutionError::InvalidStorageProof(proof.address, key))?;
    }

    Ok(())
}

/// Verify a given `EIP1186AccountProofResponse`'s code hash against the given code.
pub fn verify_code_hash_proof(
    proof: &EIP1186AccountProofResponse,
    code: &Bytes,
) -> Result<()> {
    if (proof.code_hash == KECCAK_EMPTY || proof.code_hash == B256::ZERO) && code.is_empty() {
        Ok(())
    } else {
        let code_hash = keccak256(code);
        if proof.code_hash != code_hash {
            return Err(ExecutionError::CodeHashMismatch(
                proof.address,
                code_hash,
                proof.code_hash,
            )
            .into());
        }
        Ok(())
    }
}

/// Verifies a MPT proof for a given key-value pair against the provided root hash.
/// This function wraps `alloy_trie::proof::verify_proof` and checks
/// if the value represents an empty account or slot to support exclusion proofs.
pub fn verify_mpt_proof<K: AsRef<[u8]>, V: rlp::Encodable>(
    root: B256,
    raw_key: K,
    raw_value: V,
    proof: &[Bytes],
) -> Result<()> {
    let key = Nibbles::unpack(keccak256(raw_key));
    let value = rlp::encode(raw_value);

    let value = if is_empty_value(&value) {
        None // exclusion proof
    } else {
        Some(value) // inclusion proof
    };

    verify_proof(root, key, value, proof).map_err(|e| eyre!(e))
}

/// Check if the value is an empty account or empty slot.
fn is_empty_value(value: &[u8]) -> bool {
    let empty_account = TrieAccount::default();
    let new_empty_account = TrieAccount {
        nonce: 0,
        balance: U256::ZERO,
        storage_root: B256::ZERO,
        code_hash: B256::ZERO,
    };

    let empty_account = rlp::encode(empty_account);
    let new_empty_account = rlp::encode(new_empty_account);

    let is_empty_slot = value.len() == 1 && value[0] == 0x80;
    let is_empty_account = value == empty_account || value == new_empty_account;
    is_empty_slot || is_empty_account
}
