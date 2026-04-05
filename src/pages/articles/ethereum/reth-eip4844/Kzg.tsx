import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Kzg({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="kzg" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG Commitment 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-validate', codeRefs['blob-validate'])} />
          <span className="text-[10px] text-muted-foreground self-center">KZG 검증 흐름</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-4844-standalone', codeRefs['header-4844-standalone'])} />
          <span className="text-[10px] text-muted-foreground self-center">헤더 blob gas 독립 검증</span>
        </div>

        {/* ── KZG 개요 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">KZG Commitment Scheme — 다항식 commitment</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// KZG (Kate-Zaverucha-Goldberg) commitment:
// 다항식 P(x)에 대한 짧은 commitment
// → 원본 다항식 공개 없이 특정 지점 P(z)=y 증명 가능

// 이더리움 blob에서의 사용:
// Blob = 4096 × 32B = 128KB
// 이 4096 bytes를 BLS12-381 field elements로 해석
// 4096개 points를 지나는 다항식 P(x) 유일하게 결정

// KZG commitment: 48바이트 (BLS12-381 G1 point)
// Blob (128KB) → Commitment (48 bytes)
// → 2730배 압축

// 구조:
pub struct KzgCommitment(pub [u8; 48]);
pub struct KzgProof(pub [u8; 48]);

// BLS12-381 곡선 특성:
// - pairing 지원 (e(a*G1, b*G2) = e(G1,G2)^(ab))
// - 128-bit 보안 수준
// - 효율적 pairing 라이브러리 존재 (c-kzg, arkworks)

// verify_blob_kzg_proof():
// 1. Blob → 4096 field elements
// 2. 다항식 evaluation point z 계산 (Fiat-Shamir)
// 3. P(z) = y 계산
// 4. pairing으로 검증:
//    e(proof, G2) == e(commitment - y*G1, X - z*G1)`}
        </pre>
        <p className="leading-7">
          KZG commitment이 <strong>128KB blob을 48바이트로 압축</strong>.<br />
          다항식 commitment의 성질 — 원본 숨기면서 특정 지점 증명 가능.<br />
          L2 fraud proof에서 "특정 blob의 특정 위치에 특정 값"을 증명할 때 사용.
        </p>

        {/* ── Versioned Hash ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Versioned Hash — 미래 호환성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 이더리움은 KZG commitment를 직접 사용하지 않고
// "versioned hash"로 래핑

fn kzg_to_versioned_hash(commitment: &KzgCommitment) -> B256 {
    let mut hash = sha256(&commitment.0);  // 32바이트 hash
    hash[0] = 0x01;                         // version byte
    B256::from(hash)
}

// 구조:
// bytes[0] = 0x01 (version, KZG 의미)
// bytes[1..32] = SHA-256(commitment)[1..32]

// 블록 헤더에 저장되는 것:
// - blob_versioned_hashes: Vec<B256>
// - 원본 commitment는 sidecar (노드 간 전파)

// 왜 versioned?
// - 미래에 KZG → FRI, IPA 등으로 교체 가능
// - version=0x02, 0x03으로 새 알고리즘 지원
// - on-chain 계약은 version 체크 후 처리

// 사용 예:
// - Precompile 0x0A (point_evaluation)이
//   (versioned_hash, z, y, commitment, proof) 받아서
//   commitment의 versioned_hash 일치 검증 + KZG 증명 검증

// SHA-256 사용 이유:
// - BLS12-381 G1 point가 48바이트 (32바이트 초과)
// - 해시로 축약 필요
// - keccak256 대신 SHA-256: 다른 zk 스택(Starknet 등)과 호환`}
        </pre>
        <p className="leading-7">
          <code>versioned_hash</code>가 <strong>future-proof 설계</strong>.<br />
          첫 바이트 version으로 commitment scheme 교체 가능 (현재 0x01 = KZG).<br />
          미래 post-quantum commitment scheme 마이그레이션 대비.
        </p>

        {/* ── Trusted Setup ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Trusted Setup — KZG의 보안 기반</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// KZG의 보안은 "trusted setup"에 의존
// 비밀 값 τ (tau)를 공개 parameters로 변환

// Powers of Tau:
// [G1, τ*G1, τ²*G1, ..., τ^(4095)*G1]  (G1 그룹)
// [G2, τ*G2]                           (G2 그룹)
//
// τ는 알려지면 안 됨 (KZG 위조 가능)
// → ceremony로 분산 생성

// Ethereum KZG Ceremony (2023):
// - 140,000+ 참가자 (세계 최대 MPC)
// - 각 참가자가 random 값 기여
// - 기여 후 즉시 비밀 파기
// - 단 1명이라도 정직하면 전체 secure
// - 최종 parameters는 공개

// Reth의 KZG settings:
pub struct KzgSettings {
    // G1 points (4096 + 1 = 4097개)
    g1_values_monomial: [G1; 4097],
    // G2 points
    g2_values_monomial: [G2; 4097],
    // 인덱스 관련 정보
    roots_of_unity: [Fr; 4096],
    // ...
}

// 로딩:
// - 바이너리에 임베드 (trusted_setup.txt)
// - 노드 시작 시 1회 파싱
// - 이후 메모리에 영구 보관

// 사용:
// verify_blob_kzg_proof(blob, commitment, proof, &KZG_SETTINGS)

// 공격 시나리오:
// τ 유출 시:
// - 임의 데이터의 KZG proof 위조 가능
// - 잘못된 blob을 "valid"로 검증 통과
// - 전체 이더리움 blob 보안 붕괴
//
// 방어:
// - Ceremony 참가자 다수성 (1명만 정직해도 됨)
// - 주기적 재-ceremony (미래 계획)`}
        </pre>
        <p className="leading-7">
          KZG의 <strong>trusted setup이 보안의 근원</strong>.<br />
          140K+ 참가자의 MPC ceremony로 τ 분산 생성 → 신뢰 최소화.<br />
          바이너리에 파라미터 임베드 → 런타임 다운로드 불필요.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-3">
          <strong>point evaluation precompile</strong> — KZG precompile(0x0a)은 L2가<br />
          L1 blob의 특정 지점을 검증할 때 사용. 사기 증명에 활용 가능하다.
        </p>
      </div>
    </section>
  );
}
