import VerkleEthViz from './viz/VerkleEthViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Verkle Tree의 이더리움 적용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Verkle Tree는 이더리움의 현재 상태 저장 구조인
          <strong> Merkle Patricia Trie(MPT)</strong>를 대체하기 위한 차세대 데이터 구조입니다.
          "Vector commitment" + "Merkle"의 합성어로,
          <strong> 벡터 커밋먼트 기반의 트리 구조</strong>를 의미합니다.
        </p>

        <p>
          Verkle Tree의 핵심 목표는 <strong>Stateless client</strong>의 실현입니다.
          현재 이더리움 풀 노드는 수백 GB의 상태 데이터를 저장해야 하지만,
          Verkle Tree를 도입하면 블록에 첨부된 작은 증명(witness)만으로
          트랜잭션을 검증할 수 있게 됩니다.
          이는 이더리움 로드맵의 <strong>The Verge</strong> 단계에 해당하며,
          <strong>Hegota 업그레이드(2026 H2 예정)</strong>에서 메인넷 도입이 계획되어 있습니다.
        </p>

        <VerkleEthViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">MPT vs Verkle Tree</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`비교 항목            MPT (현재)              Verkle Tree (계획)
───────────────────────────────────────────────────────────────
분기 계수            16 (hex)               256
해시/커밋먼트        Keccak-256             IPA (벡터 커밋먼트)
곡선                 -                      Bandersnatch
증명 크기/접근       ~4 KB                  ~150 bytes
증명 집계            불가                   가능 (IPA 특성)
Stateless 지원      비현실적               실현 가능
트리 깊이            ~8 (hex nibbles)       ~3 (256-ary)
상태 크기            동일                   동일 (데이터 변화 없음)
───────────────────────────────────────────────────────────────

핵심: 데이터는 동일하나, 커밋먼트 방식이 바뀜
  Keccak hash → IPA vector commitment
  → 증명 크기가 분기 계수에 독립적`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 로드맵에서의 위치</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 로드맵 (The Verge)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Merge (완료)     → PoS 전환
The Surge           → 확장성 (Danksharding)
The Scourge         → MEV/검열 저항
The Verge           → Stateless client    ◄── Verkle Tree
The Purge           → 히스토리 만료
The Splurge         → 기타 개선

The Verge 세부:
  1. Verkle Tree 도입 (Hegotá, 2026 H2)
  2. State expiry (장기 비활성 상태 아카이브)
  3. 궁극적 목표: 완전한 Stateless Ethereum`}</code>
        </pre>
      </div>
    </section>
  );
}
