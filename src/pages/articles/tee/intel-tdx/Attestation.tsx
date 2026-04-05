import AttestationViz from './viz/AttestationViz';

export default function Attestation() {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 — DCAP &amp; Quote</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">DCAP 아키텍처 (3-party)</h3>

        <AttestationViz />

        <p>
          <strong>DCAP</strong>(Data Center Attestation Primitives): EPID 대체<br />
          Intel 서버 의존성 제거 — 운영자가 직접 PCS(Provisioning Cert. Service) 캐시<br />
          <strong>3 주체</strong>: TD(증명 대상) · Quote Enclave(서명자) · Verifier(검증자)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TDREPORT 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Intel TDX Module Spec 1.5

struct TDREPORT_STRUCT {
    REPORTMACSTRUCT  report_mac;       // 256B — HMAC으로 서명
    TEE_TCB_INFO     tee_tcb_info;     // 239B — TDX Module 정보
    u8               reserved[17];
    TDINFO_STRUCT    tdinfo;           // 512B — TD 자체 정보
};  // total 1024B

struct REPORTMACSTRUCT {
    REPORTTYPE       report_type;      // TDX
    u8               cpusvn[16];       // CPU SVN
    u8               tee_tcb_info_hash[48];
    u8               tdinfo_hash[48];
    u8               reportdata[64];   // 사용자 정의 (nonce 용도)
    u8               mac[32];          // HMAC-SHA256
};

struct TDINFO_STRUCT {
    u64 attributes;        // TD_ATTRIBUTES (DEBUG bit 등)
    u64 xfam;              // XCR0 allowed mask
    u8  mrtd[48];          // 초기 이미지 측정 (SHA-384)
    u8  mrconfigid[48];    // config 해시
    u8  mrowner[48];       // owner 해시
    u8  mrownerconfig[48]; // owner config
    u8  rtmr[4][48];       // 4 × SHA-384 RTMR
    u8  servtd_hash[48];   // service TD 해시 (1.5+)
    u8  reserved[64];
};`}</pre>
        <p>
          <strong>REPORTDATA(64B)</strong>: 증명자가 임의 데이터 넣는 슬롯<br />
          일반적으로 <strong>nonce + 공개키 해시</strong> → replay 방어 + 키 바인딩<br />
          MRTD+RTMR이 TD 정체성 증명 — 코드·설정·런타임 상태 전부 반영
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Quote 생성 — Service TD 경유</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 1) TD가 TDREPORT 생성 (로컬)
tdx_mcall_get_report0(reportdata, tdreport);
  → TDG.MR.REPORT (TDCALL)
  → TDX Module이 HMAC으로 서명
  → "이 CPU의 TD Module이 만든 리포트"라는 증거

// 2) TDVMCALL로 Host에 전달
_tdx_hypercall(TDVMCALL_GET_QUOTE, shared_pa, len, 0, 0);

// 3) Host가 QE(Quote Enclave)에 forward
//    - QE는 Service TD 또는 SGX enclave
//    - Intel이 서명한 PCK(Provisioning Cert Key) 보유
//    - MAC 검증 후 ECDSA-P256으로 Quote 서명

// 4) 결과를 Shared 버퍼에 기록
//    - 비동기 — SetupEventNotify로 완료 알림

struct tdx_quote_buf {
    u64    version;       // 1
    u64    status;        // 0 = success
    u32    in_len;        // TDREPORT 크기
    u32    out_len;       // Quote 크기
    u8     data[];        // TDREPORT → (Quote)
};`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verifier 측 검증 로직</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Intel DCAP QVL(Quote Verification Library)

// 1) Quote 서명 검증
verify_ecdsa_signature(quote.body, quote.signature, att_key);

// 2) Attestation Key가 PCK 인증서로 서명됐는지
verify_cert_chain(att_key, pck_cert, intel_root_ca);

// 3) PCK 인증서 상태 (PCS 조회)
fetch_from_pcs("/sgx/certification/v4/pckcrl?ca=processor");
verify_not_revoked(pck_cert, crl);

// 4) TCB Info & QE Identity 조회
fetch_from_pcs("/tdx/certification/v4/tcb?fmspc=<FMSPC>");
fetch_from_pcs("/tdx/certification/v4/qe/identity");

// 5) TCB 상태 결정
switch (tcb_status) {
  case UpToDate:         return OK;
  case OutOfDate:        return WARN;  // 패치 필요
  case ConfigNeeded:     return WARN;  // BIOS 설정
  case SWHardeningNeeded:return WARN;  // 사이드채널 패치
  case Revoked:          return FAIL;  // 거부
}

// 6) 정책 적용
if (!policy.allowed_mrtd.contains(quote.mrtd)) return FAIL;
if (quote.attributes & DEBUG_BIT) return FAIL;   // prod는 debug 금지
if (!policy.match_rtmr(quote.rtmr)) return FAIL;`}</pre>
        <p>
          <strong>검증은 다단계</strong>: 서명 → 인증서 체인 → TCB 상태 → 정책<br />
          <strong>PCS 캐시 필수</strong>: 온라인 의존 제거용 (pccs, SGX Caching Service)<br />
          <strong>정책</strong>: Relying Party가 결정 — 어떤 MRTD/RTMR 조합을 받아줄지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 — Azure CVM Attestation 예</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Azure Attestation Service 플로우
// TD inside Azure → Microsoft Azure Attestation(MAA) → JWT

// 1) TD가 /dev/tdx_guest ioctl로 quote 요청
int fd = open("/dev/tdx_guest", O_RDWR);
ioctl(fd, TDX_CMD_GET_QUOTE, &req);

// 2) TDX Quote를 MAA에 POST
// POST https://sharedeus2.eus2.attest.azure.net/attest/TdxVm?api-version=2023-04-01-preview
// Body: { "quote": "<base64>", "runtimeData": {...} }

// 3) MAA가 Intel PCS 대신 검증 → JWT 발급
// JWT.claims = {
//   "tdx_mrtd": "...",
//   "tdx_rtmr0": "...",
//   "tcb_status": "UpToDate",
//   "x-ms-runtime": { user data },
//   "x-ms-policy-hash": "..."
// }

// 4) Relying Party가 JWT 검증
jwt.verify(jwt, MAA_signing_key);`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Local vs Remote Attestation</p>
          <p>
            <strong>Local Attestation (TDREPORT)</strong>:<br />
            - 같은 플랫폼 내 TD ↔ TD 간 검증<br />
            - HMAC 기반 — 빠름, 오프라인 가능<br />
            - TDX Module이 MAC 키 관리
          </p>
          <p className="mt-2">
            <strong>Remote Attestation (Quote)</strong>:<br />
            - 외부 Relying Party가 검증<br />
            - ECDSA + PCK 인증서 체인 — Intel 신뢰 체인 활용<br />
            - JSON/binary 직렬화 가능
          </p>
          <p className="mt-2">
            <strong>SGX 대비 개선점</strong>:<br />
            - EPID 없음 → Intel IAS 서버 의존성 제거<br />
            - PCS 셀프호스팅 가능 (pccs Docker)<br />
            - TD단위 증명 (VM 전체) — 더 넓은 TCB
          </p>
        </div>

      </div>
    </section>
  );
}
