import TDXQuoteViz from './viz/TDXQuoteViz';
import AttestationStepViz from './viz/AttestationStepViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function DstackAttestation({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="tdx-attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'TDX Quote & RA-TLS'}</h2>
      <div className="not-prose mb-8"><TDXQuoteViz /></div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('tdx-quote-gen', codeRefs['tdx-quote-gen'])} />
          <span className="text-[10px] text-muted-foreground self-center">get_quote() 생성</span>
          <CodeViewButton onClick={() => onCodeRef('tdx-verify', codeRefs['tdx-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">verify_tdx_quote()</span>
          <CodeViewButton onClick={() => onCodeRef('ra-tls', codeRefs['ra-tls'])} />
          <span className="text-[10px] text-muted-foreground self-center">RA-TLS 인증서</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">dstack Attestation 체계</h3>
        <p>
          <strong>Quote 생성</strong>: Guest agent가 Intel TDX로부터 quote 발급<br />
          <strong>KMS 검증</strong>: Phala KMS가 quote 검증 + 정책 매치<br />
          <strong>Secret 발급</strong>: 검증 통과 시 app-specific 암호키·secrets 전달<br />
          <strong>RA-TLS</strong>: 외부 사용자가 dstack VM과 통신 시 attestation 내장 TLS
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Quote 생성 — Guest 측</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// dstack-guest-agent (Rust)
// github.com/Dstack-TEE/dstack-tdx

use tdx_attest::get_tdx_report;

pub async fn generate_quote(report_data: [u8; 64]) -> Result<Vec<u8>> {
    // 1) TDX Module에 TDREPORT 요청
    let report = get_tdx_report(&report_data)?;
    // TDREPORT = MRTD + RTMR[0..3] + platform info

    // 2) Quote Enclave에 TDREPORT 제출
    // configfs-tsm 인터페이스 사용 (Linux 6.5+)
    let quote = configfs_tsm_report(&report)?;

    // 또는 legacy /dev/tdx-attest 경로
    // let quote = ioctl_get_quote(fd, &report)?;

    Ok(quote)
}

// Report data 구성 (64 bytes)
// - 앞 32 bytes: 앱 공개키 해시 (세션 키 binding)
// - 뒤 32 bytes: KMS가 제공한 nonce (replay 방어)

// 크기
// - TDREPORT: 1024 bytes
// - TDX Quote: ~4 KB (certificate chain 포함)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">KMS 정책 기반 키 발급</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// dstack-kms (Rust)

pub struct Policy {
    // 허용된 MRTD (이미지 해시)
    allowed_mrtd: HashSet<[u8; 48]>,

    // RTMR 매칭 규칙
    expected_rtmr: HashMap<usize, Vec<[u8; 48]>>,

    // 최소 TCB 버전
    min_tcb: TcbVersion,

    // 정책 적용 대상 앱
    app_ids: HashSet<String>,
}

pub async fn handle_attestation(
    quote: &[u8],
    app_id: &str,
) -> Result<Vec<u8>> {
    // 1) Quote 파싱 & 서명 검증
    let parsed = parse_tdx_quote(quote)?;
    verify_quote_signature(&parsed, intel_pcs)?;

    // 2) TCB 체크
    if parsed.tcb < policy.min_tcb {
        return Err(Error::OutdatedTcb);
    }

    // 3) MRTD 매칭
    if !policy.allowed_mrtd.contains(&parsed.mrtd) {
        return Err(Error::UnknownImage);
    }

    // 4) RTMR 매칭 (앱 레벨 측정)
    if !policy.expected_rtmr[&3].contains(&parsed.rtmr[3]) {
        return Err(Error::WrongAppMeasurement);
    }

    // 5) 앱 전용 키 파생
    let app_key = derive_app_key(app_id, &parsed);

    // 6) 클라이언트 공개키로 암호화 (report_data에서 추출)
    let encrypted_key = encrypt_with_pubkey(&app_key, &parsed.report_data[..32]);

    Ok(encrypted_key)
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">RA-TLS 인증서 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// RA-TLS = Remote Attestation + TLS
// Quote를 X.509 certificate extension에 포함

// X.509 구조
struct RATlsCert {
    // Standard X.509 fields
    subject: "CN=dstack-app-instance",
    public_key: Ed25519PubKey,
    not_before: current_time,
    not_after: current_time + 90_days,

    // Custom extensions
    extensions: [
        {
            oid: "1.2.840.113741.1337.6",  // dstack TDX Quote
            critical: true,
            value: tdx_quote_der,
        },
        {
            oid: "1.2.840.113741.1337.7",  // App measurements
            critical: false,
            value: app_measurements_der,
        },
    ],

    // Self-signed
    signature_algorithm: Ed25519,
    signature: signed_with_app_privkey,
}

// 클라이언트 측 검증 (확장 TLS handshake)
// 1) 일반 TLS 검증 + cert 수신
// 2) Extension에서 Quote 추출
// 3) Quote 검증 (Intel PCS / PCCS)
// 4) Quote.report_data[0..32] == hash(cert.public_key) 확인
// 5) 모든 체크 통과 시 TLS 세션 수립

// 장점
// - HTTPS 생태계 활용 (curl, browsers)
// - Attestation이 TLS에 투명 통합
// - 세션 키가 TEE key와 binding`}</pre>

      </div>
      <div className="not-prose mt-6">
        <AttestationStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: dstack vs kata confidential</p>
          <p>
            <strong>공통점</strong>:<br />
            - Intel TDX 사용<br />
            - Container workload 지원<br />
            - Attestation 통합
          </p>
          <p className="mt-2">
            <strong>dstack 특화</strong>:<br />
            ✓ Docker Compose 직접 지원<br />
            ✓ KMS 기본 포함<br />
            ✓ RA-TLS 즉시 사용<br />
            ✓ 단일 VM에 여러 containers
          </p>
          <p className="mt-2">
            <strong>Kata Confidential Containers</strong>:<br />
            ✓ Kubernetes native<br />
            ✓ Pod = TDX VM 단위<br />
            ✓ CRI-compatible<br />
            ✓ Cluster-scale 운영
          </p>
          <p className="mt-2">
            <strong>선택 기준</strong>:<br />
            - Web3·AI agent 단일 서비스: dstack<br />
            - Enterprise K8s 워크로드: Kata CoCo<br />
            - 둘 다 confidential-containers 프로젝트 우산 아래
          </p>
        </div>

      </div>
    </section>
  );
}
