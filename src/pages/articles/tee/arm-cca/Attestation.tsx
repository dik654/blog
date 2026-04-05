import CcaAttestViz from './viz/CcaAttestViz';

export default function Attestation() {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CCA 원격 증명 — Token &amp; Verification</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">CCA Attestation 구조</h3>

        <CcaAttestViz />

        <p>
          <strong>이중 토큰 구조</strong>: Realm Token + Platform Token<br />
          <strong>포맷</strong>: CBOR(RFC 8949) + COSE(RFC 9052) — IETF 표준<br />
          <strong>프로파일</strong>: PSA Attestation API v1.0 (Arm 표준) 확장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 생성 — RSI Flow</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Realm Guest 측 (arch/arm64/kernel/rsi.c)

int rsi_attestation_token_init(u64 challenge[8]) {
    struct arm_smccc_res res;
    arm_smccc_1_1_smc(RSI_ATTESTATION_TOKEN_INIT,
                       challenge[0], challenge[1],
                       challenge[2], challenge[3],
                       challenge[4], challenge[5],
                       challenge[6], challenge[7],
                       &res);
    return res.a0;  // token 총 크기
}

int rsi_attestation_token_continue(u64 granule_pa, u64 offset, u64 size) {
    struct arm_smccc_res res;
    arm_smccc_1_1_smc(RSI_ATTESTATION_TOKEN_CONTINUE,
                       granule_pa, offset, size, 0, &res);
    return res.a0;  // 이번에 채워진 바이트 수
}

// Realm 사용 예
void get_attestation_token(u8 *challenge, u8 *token_buf) {
    rsi_attestation_token_init(challenge);

    size_t offset = 0;
    while (offset < total_size) {
        size_t chunk = min(PAGE_SIZE, total_size - offset);
        rsi_attestation_token_continue(
            virt_to_phys(token_buf + offset), 0, chunk);
        offset += chunk;
    }
}`}</pre>
        <p>
          <strong>2단계 호출</strong>: INIT으로 시작 → CONTINUE로 chunk 전송<br />
          <strong>이유</strong>: 토큰이 1페이지 초과 가능 (여러 REM + Platform Token)<br />
          <strong>INIT에 challenge</strong>: 사용자가 제공하는 nonce (replay 방어)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RMM 측 토큰 생성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime/rsi/attestation.c

int handle_rsi_attest_token_init(struct rec *rec,
                                   struct rd *rd,
                                   unsigned long challenge[8]) {
    /* 1) CBOR 인코더 초기화 */
    cbor_encoder_init(&ctx, rec->attest_buf, MAX_TOKEN_SIZE);

    /* 2) Realm claims 수집 */
    struct realm_claims claims;
    memcpy(claims.challenge, challenge, 64);
    memcpy(claims.rim, rd->rim, 64);
    for (i = 0; i < 4; i++)
        memcpy(claims.rem[i], rd->rem[i], 64);
    memcpy(claims.rpv, rd->rpv, 64);
    claims.hash_algo = rd->algorithm;

    /* 3) CBOR 직렬화 */
    cbor_encode_realm_claims(&ctx, &claims);

    /* 4) COSE_Sign1로 래핑 */
    cose_sign1(&ctx, realm_attest_key);

    /* 5) Platform Token 삽입 */
    rmm_el3_ifc_get_platform_token(&platform_token);
    cbor_encode_bytes(&ctx, platform_token);

    /* 6) Outer COSE_Sign1 */
    cose_sign1(&ctx, realm_attest_key);

    rec->attest_size = cbor_encoder_get_extra_bytes_needed(&ctx);
    return RMI_SUCCESS;
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Platform Token (EL3에서)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// TF-A services/std_svc/rmmd/rmmd_rme_attest.c

// RMM이 Monitor(EL3)에 요청 → Platform Token 획득
int plat_get_cca_attest_token(uintptr_t buf, size_t *len,
                               uintptr_t hash_buf, size_t hash_size) {
    /* 1) HW RoT에서 IAK(Initial Attestation Key) 가져오기 */
    /* 2) Platform claims 수집 */
    struct platform_claims pc = {
        .profile          = "http://arm.com/CCA-SSD/1.0.0",
        .challenge        = hash_buf,   // RAK 공개키 해시
        .implementation_id = hw_impl_id,
        .instance_id      = hw_instance,
        .security_lifecycle = LIFECYCLE_SECURED,
        .sw_components    = { boot_components },
    };

    /* 3) COSE_Sign1 with IAK */
    cose_sign1_with_iak(buf, &pc, len);
    return 0;
}

// CCA-SSD(Security Source Data) 프로파일
// - Arm CCA 전용 EAT 프로파일
// - IANA 등록: urn:uuid:...
// - ccatoken 라이브러리로 파싱 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verifier 측 검증</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Veraison (오픈소스 CCA verifier)
// https://github.com/veraison/ccatoken

package main

import "github.com/veraison/ccatoken"

func verify(tokenBytes, iakPubKey, rakPubKey []byte) error {
    /* 1) CBOR decode */
    token, err := ccatoken.Decode(tokenBytes)

    /* 2) Platform Token 검증 */
    err = token.Verify(iakPubKey)   // IAK로 platform 확인

    /* 3) Realm Token 서명자 = Platform IAK가 보증한 RAK */
    platformClaims := token.PlatformClaims
    rakHashFromPlatform := platformClaims.Challenge
    rakPubKeyHash := sha256(rakPubKey)
    if rakHashFromPlatform != rakPubKeyHash {
        return errors.New("RAK not bound to platform")
    }

    /* 4) Realm Token 서명 확인 */
    realmClaims := token.RealmClaims
    err = verifyCose(realmClaims, rakPubKey)

    /* 5) 정책 적용 */
    if !allowedRIMs.Contains(realmClaims.RIM) {
        return errors.New("unknown realm image")
    }
    if realmClaims.Challenge != expectedNonce {
        return errors.New("nonce mismatch")
    }
    return nil
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">CCA vs TDX/SEV Attestation</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">Intel TDX</th>
                <th className="border border-border px-3 py-2 text-left">AMD SEV-SNP</th>
                <th className="border border-border px-3 py-2 text-left">ARM CCA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">포맷</td>
                <td className="border border-border px-3 py-2">Binary struct</td>
                <td className="border border-border px-3 py-2">Binary report</td>
                <td className="border border-border px-3 py-2">CBOR + COSE</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">서명 알고리즘</td>
                <td className="border border-border px-3 py-2">ECDSA P-256</td>
                <td className="border border-border px-3 py-2">ECDSA P-384</td>
                <td className="border border-border px-3 py-2">EdDSA / ECDSA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">표준</td>
                <td className="border border-border px-3 py-2">DCAP (Intel 전용)</td>
                <td className="border border-border px-3 py-2">VCEK (AMD 전용)</td>
                <td className="border border-border px-3 py-2">IETF RATS/EAT</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">인증서 체인</td>
                <td className="border border-border px-3 py-2">PCK/Intel Root</td>
                <td className="border border-border px-3 py-2">VCEK/AMD Root</td>
                <td className="border border-border px-3 py-2">IAK/SiP CA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">런타임 측정</td>
                <td className="border border-border px-3 py-2">RTMR[0..3] × 48B</td>
                <td className="border border-border px-3 py-2">LaunchDigest만</td>
                <td className="border border-border px-3 py-2">REM[0..3] × 64B</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CCA 증명의 개방성</p>
          <p>
            <strong>IETF RATS(Remote Attestation Procedures)</strong> 표준 기반<br />
            <strong>EAT(Entity Attestation Token)</strong> 공통 포맷 사용
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ 벤더 독립 — 여러 CCA 플랫폼 통합 검증<br />
            ✓ IoT·모바일 기존 PSA 인프라 재사용<br />
            ✓ 오픈 검증자 생태계 (Veraison, parsec 등)
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ CBOR 디코딩 오버헤드<br />
            ✗ 토큰 크기 큼 (2~4KB) — TDX Quote 대비<br />
            ✗ SiP별 IAK 인증서 정책 차이
          </p>
          <p className="mt-2">
            <strong>실전</strong>:<br />
            - Confidential Containers 프로젝트가 CCA attestation 통합 중<br />
            - Veraison이 크로스 플랫폼 verifier 제공 (TDX/SGX/SEV/CCA)<br />
            - Arm CCA API 사양: architectures.docs.arm.com
          </p>
        </div>

      </div>
    </section>
  );
}
