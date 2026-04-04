import StorageViz from './viz/StorageViz';

export default function Storage() {
  return (
    <section id="storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">저장 프리미티브 (MMR · ADB · QMDB)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>Merkle Mountain Range</strong>(MMR) — 감소하는 높이의 트리 리스트
          <br />
          Merkle Tree와 달리 append-only, O(1) 순차 쓰기, SSD 친화적, GC 불필요
          <br />
          블록체인 상태 저장에 최적화된 구조
        </p>
        <p className="leading-7">
          <strong>storage::adb</strong>(Authenticated Database) — MMR 기반 인증 데이터베이스 제품군
          <br />
          <strong>adb::any</strong> — "어떤 시점에 키가 특정 값을 가졌음"을 증명
          <br />
          <strong>adb::current</strong> — "키의 현재 값"을 증명. Activity Merkle Tree와 Grafting 기법 사용
        </p>
        <p className="leading-7">
          <strong>QMDB</strong>(Quick Merkle Database) — LayerZero와 협력 개발
          <br />
          상태 읽기: 1 SSD read · 상태 업데이트: O(1) SSD I/O · Merkleization: 메모리 내(0 SSD I/O)
          <br />
          메모리: 2.3 bytes/entry · 처리량: 최대 2.28M 상태 업데이트/초
        </p>
      </div>
      <div className="not-prose mb-8"><StorageViz /></div>
    </section>
  );
}
