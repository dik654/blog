import PeerSlotViz from './viz/PeerSlotViz';

export default function PowToPos() {
  return (
    <section id="pow-to-pos" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PoW에서 PoS 전환과 Peer Slots</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          The Merge 이후 포크 지정 방식이 블록 번호 → 타임스탬프 기반으로 변경.<br />
          Fork-ID로 비호환 피어를 조기 필터링하여 피어 슬롯 낭비를 방지
        </p>
      </div>
      <div className="not-prose"><PeerSlotViz /></div>
    </section>
  );
}
