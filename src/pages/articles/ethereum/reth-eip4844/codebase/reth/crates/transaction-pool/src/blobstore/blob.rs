// reth-transaction-pool — Blob TX 검증 (reth v1.x)

/// BlobTransaction 사이드카 검증
/// blobs + commitments + proofs의 유효성을 4단계로 확인
pub fn validate_blob_sidecar(
    sidecar: &BlobTransactionSidecar,
) -> Result<(), BlobTransactionValidationError> {
    let num_blobs = sidecar.blobs.len();

    // 1. blob, commitment, proof 개수가 모두 같아야 함
    // 하나라도 불일치하면 사이드카 자체가 잘못된 것
    if num_blobs != sidecar.commitments.len()
        || num_blobs != sidecar.proofs.len()
    {
        return Err(BlobTransactionValidationError::MismatchedLength);
    }

    // 2. blob 개수 한도 확인 (MAX_BLOBS_PER_BLOCK = 6)
    // 블록당 최대 6 × 128KB = 768KB blob 데이터
    if num_blobs > MAX_BLOBS_PER_BLOCK {
        return Err(BlobTransactionValidationError::TooManyBlobs {
            have: num_blobs,
            max: MAX_BLOBS_PER_BLOCK,
        });
    }

    // 3. KZG commitment → versioned hash 매칭 확인
    // SHA256(commitment)의 첫 바이트를 0x01(버전)로 교체
    for (i, commitment) in sidecar.commitments.iter().enumerate() {
        let expected = kzg_to_versioned_hash(commitment);
        if expected != sidecar.versioned_hashes[i] {
            return Err(BlobTransactionValidationError::InvalidHash);
        }
    }

    // 4. KZG proof 배치 검증 — blob ↔ commitment 일치 증명
    // 개별 검증보다 pairing 연산 공유로 효율적
    kzg_settings.verify_blob_kzg_proof_batch(
        &sidecar.blobs,       // 실제 blob 데이터
        &sidecar.commitments, // 다항식 커밋먼트
        &sidecar.proofs,      // 검증 증거
    )?;

    Ok(())
}
