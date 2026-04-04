import SyncAggregateViz from './viz/SyncAggregateViz';

export default function SyncAggregate() {
  return (
    <section id="sync-aggregate" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        SyncAggregate (bits + signature)
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth(EL)에는 SyncAggregate가 없다.
          이것은 순수 CL 전용 타입이다.
          Helios가 경량 검증을 위해 핵심적으로 사용한다.<br />
          512명 Sync Committee 중 누가 참여했는지
          Bitvector&lt;512&gt;(64바이트)로 표현한다.
        </p>
        <p className="leading-7">
          sync_committee_bits: 각 비트가 한 명의 참여 여부.
          popcount로 참여자 수를 세어 2/3 정족수를 검사한다.<br />
          sync_committee_signature: 참여자들의
          BLS 서명을 집계한 96바이트 G2 점.
          하나의 서명으로 수백 명의 동의를 확인할 수 있다.
        </p>
      </div>
      <div className="not-prose"><SyncAggregateViz /></div>
    </section>
  );
}
