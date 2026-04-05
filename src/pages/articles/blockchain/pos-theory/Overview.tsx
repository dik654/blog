import StorageProofOverviewViz from './viz/StorageProofOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: 저장 증명 분류</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          저장 증명(Proof of Storage) — 분산 저장소에서 데이터가 실제로 보관 중임을 암호학적으로 보장하는 프로토콜.<br />
          PoR, PoRep, PoSt 세 가지로 분류되며 각각 다른 보안 속성을 보장
        </p>
      </div>
      <div className="not-prose"><StorageProofOverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">저장 증명 3가지 분류</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Storage Proofs 3 Types:

// 1. PoR (Proof of Retrievability):
// - data 보관 증명
// - 검증자: challenge
// - 저장자: response (partial data + proof)
// - 검증: data integrity
// - 사용: cloud storage audits

// 2. PoRep (Proof of Replication):
// - 고유 물리적 복제본 증명
// - Sybil attack 방어
// - 여러 copies 구분
// - 사용: Filecoin sealing

// 3. PoSt (Proof of Spacetime):
// - 지속적 저장 증명
// - 시간 축 추가
// - 주기적 challenge
// - 사용: Filecoin WindowPoSt

// 진화:
// - 2007: PoR (Ateniese et al.)
// - 2013: PoRep 제안
// - 2017: PoSt 제안 (Benet-Dalrymple-Greco)
// - 2020: Filecoin mainnet
// - 2024: PDP 등장 (light PoR variant)

// Security properties 비교:
//
// PoR:
// ✓ data integrity
// ✗ uniqueness
// ✗ time persistence
//
// PoRep:
// ✓ data integrity
// ✓ uniqueness (physical)
// ✗ time persistence
//
// PoSt:
// ✓ data integrity
// ✓ uniqueness (built on PoRep)
// ✓ time persistence

// Filecoin 실제 사용:
// - Sealing phase: PoRep (one-time)
// - Proving phase: PoSt (continuous)
// - 둘 다 필요 (complementary)

// Cryptographic primitives:
// - Merkle trees (PoR)
// - Stacked DRG (PoRep)
// - VDF / random beacon (PoSt)
// - SNARK (all three, compression)

// Applications:
// - Decentralized storage (Filecoin)
// - Audit systems
// - Data availability
// - Cloud verification
// - Compliance (GDPR, etc.)`}
        </pre>
        <p className="leading-7">
          Storage Proofs: <strong>PoR (retrievable) → PoRep (unique) → PoSt (persistent)</strong>.<br />
          Filecoin = PoRep + PoSt 결합.<br />
          2007 PoR → 2024 PDP까지 진화.
        </p>
      </div>
    </section>
  );
}
