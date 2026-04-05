import ContextViz from './viz/ContextViz';
import BLSSignFlowViz from './viz/BLSSignFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLS12-381 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 BLS 서명 생성, 집계, FastAggregateVerify 검증의 전체 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── BLS12-381 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BLS12-381 — 서명 집계가 가능한 곡선</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BLS12-381: Barreto-Lynn-Scott 곡선 (embedding degree 12, 381-bit prime)
// 이더리움 2.0 consensus 서명에 표준 채택

// 특징:
// - 128-bit 보안 수준 (양자 내성 없음)
// - Pairing 지원: e(G1, G2) → GT
// - 서명 집계 가능: sig_agg = sig_1 + sig_2 + ... + sig_n
// - 동일 메시지 집계 검증: FastAggregateVerify

// 2개 그룹:
// G1: 48 bytes (serialized), 서명에 사용
// G2: 96 bytes (serialized), 공개키에 사용
// Ethereum 2.0 convention: pk in G1, sig in G2
// → 서명이 더 크지만 공개키 서브넷 방송 효율

// 연산 비용 (blst 기준):
// - 서명 생성: ~1ms (G2 scalar multiplication)
// - 서명 검증: ~2ms (1 pairing)
// - 배치 검증 100개: ~50ms (수량 대비 ~20배 가속)
// - 서명 집계: ~50μs per signature

// 메인넷 활용:
// - Attestation 서명: 슬롯당 ~30,000개 validator 서명
//                     → 서브넷별 집계 → 블록 포함
// - Block 서명: validator의 block proposal 서명
// - Sync committee: 512 validator의 block root 서명
// - Deposit: validator 등록 서명`}
        </pre>
        <p className="leading-7">
          BLS의 핵심 가치: <strong>서명 집계</strong> — N개 서명을 1개로 압축.<br />
          Ethereum consensus는 슬롯당 수만 개 attestation → 집계 필수.<br />
          각 validator가 독립 서명 → 서브넷에서 집계 → 블록에 1개 aggregate로 포함.
        </p>

        {/* ── BLS의 왜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 BLS? — ECDSA와의 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ECDSA (secp256k1, EL TX 서명):
// - 서명 크기: 64~65 bytes
// - 검증: ~0.1ms (빠름)
// - 집계 불가: N개 서명 = N × 65 bytes 저장 필요
// - 이더리움 메인넷 TX에서 사용

// BLS (BLS12-381, CL attestation):
// - 서명 크기: 96 bytes
// - 검증: ~2ms (20배 느림)
// - 집계 가능: N개 서명 → 1개 96 bytes
// - non-interactive aggregation
// - ethereum 2.0 consensus에서 사용

// 왜 BLS 선택?
// Ethereum 2.0은 validator 100만+ 운영
// 각 epoch마다 모든 validator가 attestation 생성
// 매 슬롯 ~30,000 attestation
//
// ECDSA 사용 시:
// - 30K × 65 bytes = 1.95 MB/slot → 블록 크기 폭발
// - 30K × 0.1ms = 3초 검증 → 12초 슬롯 내 불가능
//
// BLS 사용 시:
// - 서브넷별 집계 → 블록당 ~200 aggregate
// - 200 × 96 bytes = ~20KB (100배 절약)
// - 200 aggregate × 2ms = ~400ms 검증 (가능)
// - 집계 서명도 배치 검증 가능 → 추가 가속

// 트레이드오프:
// - 서명 크기 50% 증가
// - 검증 비용 20배 증가
// - 집계로 상쇄 + 그 이상의 이득`}
        </pre>
        <p className="leading-7">
          BLS는 <strong>집계 가능성이 핵심</strong> — 100만 validator 운영에 필수.<br />
          개별 서명은 ECDSA보다 느리지만, 집계로 네트워크 오버헤드 100배 절약.<br />
          Ethereum 2.0이 BLS를 consensus 서명으로 채택한 근본 이유.
        </p>

        {/* ── Prysm의 BLS 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm의 BLS 구현 — blst CGo 바인딩</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm: supranational/blst CGo 바인딩 사용
// 이유: pure Go 구현 대비 2~5배 빠름

// 구조 (prysm/crypto/bls/):
prysm/crypto/bls/
├── bls.go              # 공개 API (SecretKey, PublicKey, Signature)
├── common/
│   └── interfaces.go   # SecretKey, PublicKey, Signature trait
└── blst/
    ├── blst.go         # blst 초기화
    ├── secret_key.go   # blst.SecretKey 래퍼
    ├── public_key.go   # blst.P1 (G1) 래퍼
    ├── signature.go    # blst.P2 (G2) 래퍼
    └── aliases.go      # CGo 타입 별칭

// blst 라이브러리:
// - github.com/supranational/blst
// - C++ 구현, assembly 최적화 (AVX, NEON)
// - Ethereum Foundation 공식 권장
// - Consensus specs test vectors 통과

// Go 래퍼:
type blstPublicKey = blst.P1Affine  // 48 bytes (G1)
type blstSignature = blst.P2Affine  // 96 bytes (G2)
type blstSecretKey = blst.SecretKey // 32 bytes (scalar)

// CGo 사용 시 비용:
// - Go ↔ C 전환: ~100ns overhead
// - 서명 검증 자체: ~2ms
// - 비율: 0.005% (무시할 수준)

// pure Go 구현 (herumi/bls-eth-go-binary)와 비교:
// - 단일 검증: blst 2배 빠름
// - 배치 검증: blst 4배 빠름
// - 메모리: 동등
// - 안정성: 동등 (둘 다 spec tests 통과)`}
        </pre>
        <p className="leading-7">
          Prysm이 <strong>blst</strong>를 선택한 이유는 <strong>성능</strong>.<br />
          CGo 오버헤드(~100ns) vs 서명 검증 비용(2ms) → 무시할 수준.<br />
          대량 attestation 검증에서 2~5배 가속 → 메인넷 운영에 필수.
        </p>
      </div>
      <div className="not-prose mt-6"><BLSSignFlowViz /></div>
    </section>
  );
}
