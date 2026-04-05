import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlstBinding({ onCodeRef }: Props) {
  return (
    <section id="blst-binding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLST CGo 바인딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Prysm은 <strong>supranational/blst</strong> C 라이브러리를 CGo로 래핑한다.<br />
          Go → C → x86-64 어셈블리 체인으로, 순수 Go 구현 대비 약 10배 빠르다.
        </p>

        {/* ── CGo 바인딩 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CGo 바인딩 구조 — 3계층</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 3-layer 구조:
//
// Layer 1 (Go): Prysm API
//   common.SecretKey.Sign(msg []byte) common.Signature
//         ↓
// Layer 2 (CGo bridge): blst-go 바인딩
//   func (sk *SecretKey) Sign(msg []byte, dst []byte) *P2Affine {
//       C.blst_sign_pk_in_g1(&sig, msg_ptr, msg_len, dst_ptr, dst_len, sk_ptr)
//   }
//         ↓
// Layer 3 (Assembly): blst C 라이브러리
//   blst_sign_pk_in_g1():
//     1. Hash to G2: hash_to_field(msg, DST) → point P
//     2. Scalar multiplication: sig = sk × P (in G2)
//     3. Return 96-byte serialization

// CGo 호출 overhead:
// - Go stack → C stack 전환: ~100ns
// - C 함수 호출 자체: ~수 μs
// - 전환 비용이 실제 연산 시간의 0.005%
// → 무시할 수준

// blst 내부 최적화:
// - AVX-512 (Intel): 512-bit 필드 연산 parallel
// - ADX (Multi-precision arithmetic): 64-bit carry chain 가속
// - NEON (ARM): 128-bit SIMD (Apple Silicon)
// - assembly로 직접 작성된 critical path
// → Rust/Go 구현 대비 2~3배 빠름`}
        </pre>
        <p className="leading-7">
          3계층 구조: <strong>Go API → CGo bridge → C + Assembly</strong>.<br />
          CGo overhead(~100ns)는 서명 연산(~1ms) 대비 무시할 수준.<br />
          AVX-512/ADX/NEON 어셈블리 최적화로 순수 언어 구현 대비 우위.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">호출 체인</h3>
        <ul>
          <li><strong>Go 레이어</strong> — <code>secretKey.Sign(msg)</code> 인터페이스</li>
          <li><strong>CGo 레이어</strong> — <code>blst_sign_pk_in_g1()</code> C 함수 호출</li>
          <li><strong>어셈블리</strong> — AVX-512/ADX 명령어로 필드 연산 가속</li>
        </ul>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('bls-sign', codeRefs['bls-sign'])} />
          <span className="text-[10px] text-muted-foreground self-center">Sign() CGo 체인</span>
        </div>

        {/* ── DST 도메인 분리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DST (Domain Separation Tag) — 용도별 서명 분리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ethereum 2.0의 DST (hash_to_curve 입력)
const DST = "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_"

// 의미 해석:
// BLS_SIG:          BLS signature
// BLS12381G2:       BLS12-381 곡선, G2 그룹
// XMD:SHA-256:      Extendable message digest using SHA-256
// SSWU:             Simplified SWU (hash-to-curve mapping)
// RO:               Random Oracle model
// POP:              Proof-of-Possession scheme (for rogue key attack 방어)

// 사용처별 도메인:
// - Attestation 서명: DST + signing_root(attestation_data)
// - Block proposal:   DST + signing_root(beacon_block)
// - Sync committee:   DST + signing_root(sync_committee_contribution)
// - Deposit:          DST + deposit_message_root
// - Randao reveal:    DST + signing_root(epoch)

// signing_root 구조:
struct SigningData {
    object_root: Root,   // attestation/block의 HashTreeRoot
    domain: Domain,      // fork-specific + purpose domain
}

domain 계산:
// domain = compute_domain(
//     domain_type (ATTESTER, PROPOSER, etc.),
//     fork_version,  // current hard fork
//     genesis_validators_root,
// )

// 왜 DST + domain 두 단계?
// 1. DST: BLS 메시지 공간 분리 (cryptographic)
// 2. domain: 네트워크/포크/용도 분리 (protocol-level)
//
// 예방하는 공격:
// - Cross-protocol replay: 테스트넷 서명 → 메인넷 재사용
// - Cross-fork replay: Bellatrix 서명 → Capella 재사용
// - Cross-purpose replay: attestation 서명 → block proposal 위조`}
        </pre>
        <p className="leading-7">
          <strong>DST</strong> — BLS 메시지 공간 분리의 암호학 메커니즘.<br />
          POP(Proof-of-Possession) 스킴으로 rogue key attack 방어.<br />
          domain separation으로 같은 키의 다용도 서명이 서로 독립됨.
        </p>

        {/* ── blst vs 대안 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">blst vs 대안 구현 벤치마크</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BLS12-381 Go 구현체 비교 (동일 하드웨어)
//
// 1. blst (supranational) - Prysm 기본
//    - C++ + ASM
//    - 단일 검증: 1.8ms
//    - 배치 100: 28ms
//
// 2. herumi/bls-eth-go-binary
//    - C++ (ASM 부분적)
//    - 단일 검증: 2.5ms (1.4배 느림)
//    - 배치 100: 40ms (1.4배 느림)
//
// 3. kilic/bls12-381 (pure Go)
//    - 단일 검증: 8ms (4.4배 느림)
//    - 배치 100: 180ms (6.4배 느림)
//    - CGo 없음 → 빌드 단순
//
// 4. prysmaticlabs/go-bls (legacy)
//    - 구 Prysm 구현 (2019)
//    - 현재 deprecated

// Prysm의 선택 과정:
// - 2019: kilic/bls12-381 (pure Go, 단순성)
// - 2020: herumi (속도 개선)
// - 2021 현재: blst (최대 성능)

// 메인넷 검증 부하:
// - 블록당 ~150 aggregate attestation 검증
// - 12초 슬롯 내 완료 필요
// - blst: ~300ms (여유)
// - herumi: ~400ms (여유)
// - pure Go: ~1.2초 (빠듯함)

// Go 생태계의 BLS 라이브러리 안정화:
// - 2024년 blst가 사실상 표준
// - Lighthouse, Teku, Lodestar도 blst 사용 (FFI 경유)
// - 이더리움 spec test vectors 모두 통과`}
        </pre>
        <p className="leading-7">
          blst가 <strong>Ethereum 2.0 CL의 사실상 표준</strong>.<br />
          Go/Rust/Java/JavaScript 구현체 모두 blst로 수렴.<br />
          C++ + 어셈블리 최적화의 성능 차이가 validator 운영에 직접 영향.
        </p>
      </div>
    </section>
  );
}
