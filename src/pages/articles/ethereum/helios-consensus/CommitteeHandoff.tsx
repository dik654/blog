import HandoffViz from './viz/HandoffViz';

export default function CommitteeHandoff({ title }: { title: string }) {
  return (
    <section id="committee-handoff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Period 경계에서 <code>next_sync_committee</code>가 <code>current</code>로 승격된다.
          <br />
          이전 period의 위원회는 더 이상 사용되지 않는다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 상태 전환이 자동이다 (Beacon State 갱신).
          <br />
          Helios는 명시적 핸드오프가 필요 — Update에 next committee가 없으면 교체 불가.
        </p>
      </div>
      <div className="not-prose"><HandoffViz /></div>
    </section>
  );
}
