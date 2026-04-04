// alloy-primitives — Keccak256 해시 + Address 생성

use tiny_keccak::{Hasher, Keccak};

/// Keccak256 해싱 — 이더리움 표준 해시 함수
pub fn keccak256<T: AsRef<[u8]>>(bytes: T) -> B256 {
    let mut output = [0u8; 32];
    let mut hasher = Keccak::v256();
    hasher.update(bytes.as_ref());
    hasher.finalize(&mut output);
    B256(FixedBytes(output))
}

/// CREATE 주소 생성: sender + nonce → RLP → Keccak256 → 하위 20바이트
pub fn create_address(sender: &Address, nonce: u64) -> Address {
    let mut buf = Vec::new();
    // RLP([sender, nonce]) 인코딩
    Header { list: true, payload_length: sender.length() + nonce.length() }
        .encode(&mut buf);
    sender.encode(&mut buf);
    nonce.encode(&mut buf);
    let hash = keccak256(&buf);
    Address(FixedBytes(hash.0[12..32].try_into().unwrap()))
}

/// CREATE2 주소: 0xff + sender + salt + init_code_hash → Keccak256
pub fn create2_address(sender: &Address, salt: &B256, init_code_hash: &B256) -> Address {
    let mut bytes = [0u8; 85]; // 1 + 20 + 32 + 32
    bytes[0] = 0xff;
    bytes[1..21].copy_from_slice(sender.as_slice());
    bytes[21..53].copy_from_slice(salt.as_ref());
    bytes[53..85].copy_from_slice(init_code_hash.as_ref());
    let hash = keccak256(bytes);
    Address(FixedBytes(hash.0[12..32].try_into().unwrap()))
}
