// === SGX Enclave 측정 (MRENCLAVE 계산) ===
// sdk/sign_tool/SignTool/manage_metadata.cpp (simplified)

// ECREATE: 초기 해시 컨텍스트 생성
void ecreate_measure(sha256_ctx *ctx, secs_t *secs) {
    uint8_t block[64] = "ECREATE\0";
    memcpy(block + 8, &secs->ssa_frame_size, 4);
    memcpy(block + 12, &secs->size, 8);
    sha256_init(ctx);
    sha256_update(ctx, block, 64);  // MRENCLAVE 체인 시작
}

// EADD: 페이지를 Enclave에 추가할 때마다 측정
void eadd_measure(sha256_ctx *ctx, uint64_t offset,
                  secinfo_t *secinfo) {
    uint8_t block[64] = "EADD\0\0\0\0";
    memcpy(block + 8, &offset, 8);       // 페이지 오프셋
    memcpy(block + 16, secinfo, 48);     // 페이지 속성 (R/W/X)
    sha256_update(ctx, block, 64);
}

// EEXTEND: 256바이트 단위로 페이지 내용 해시 확장
// 4KB 페이지 = 16회 EEXTEND 호출
void eextend_measure(sha256_ctx *ctx, uint64_t offset,
                     const uint8_t *page_data) {
    for (int i = 0; i < 16; i++) {
        uint8_t hdr[64] = "EEXTEND\0";
        uint64_t chunk_offset = offset + i * 256;
        memcpy(hdr + 8, &chunk_offset, 8);
        sha256_update(ctx, hdr, 64);
        // 실제 코드/데이터 256바이트를 해시에 포함
        sha256_update(ctx, page_data + i * 256, 256);
    }
}

// EINIT: 최종 MRENCLAVE 값 확정 및 서명 검증
sgx_status_t einit_finalize(sha256_ctx *ctx,
                            sigstruct_t *sig, secs_t *secs) {
    // 1) MRENCLAVE 최종값 계산
    sha256_final(ctx, secs->mr_enclave);

    // 2) SIGSTRUCT의 ENCLAVEHASH와 비교
    if (memcmp(secs->mr_enclave, sig->enclave_hash, 32) != 0)
        return SGX_ERROR_ENCLAVE_FILE_ACCESS;

    // 3) RSA-3072 서명 검증 (Intel 서명 키)
    if (!rsa_verify(sig->modulus, sig->signature, sig->enclave_hash))
        return SGX_ERROR_INVALID_SIGNATURE;

    // 4) Launch Token 검증 후 Enclave 활성화
    secs->mr_signer = sha256(sig->modulus);  // MRSIGNER 파생
    secs->attributes = sig->attributes;
    return SGX_SUCCESS;
}

// === AMD SEV: LAUNCH_MEASURE ===
// drivers/crypto/ccp/sev-dev.c (simplified)

int sev_launch_measure(struct sev_data_launch_measure *data,
                       struct kvm_sev_info *sev) {
    // 펌웨어가 게스트 초기 메모리의 HMAC-SHA-256 계산
    // measurement = HMAC(key=TIK, data=guest_pages || context)
    data->address = __psp_pa(sev->measure_buf);
    data->len = sizeof(struct sev_measurement);
    return sev_do_cmd(SEV_CMD_LAUNCH_MEASURE, data, NULL);
}

// === TPM PCR Extend (의사 코드) ===
// tpm2-tss/src/tss2-esys/api/Esys_PCR_Extend.c (simplified)

void tpm_pcr_extend(uint8_t pcr[32], const uint8_t *measurement) {
    uint8_t buf[64];                 // PCR(32) + measurement(32)
    memcpy(buf, pcr, 32);           // 기존 PCR 값
    memcpy(buf + 32, measurement, 32);  // 새 측정값
    sha256(buf, 64, pcr);           // PCR[i] = SHA-256(PCR[i] || M)
    // 덮어쓰기 불가 — extend만 가능, 리셋은 재부팅 시에만
}
