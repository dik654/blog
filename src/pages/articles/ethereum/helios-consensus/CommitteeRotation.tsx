import RotationViz from './viz/RotationViz';

export default function CommitteeRotation({ title }: { title: string }) {
  return (
    <section id="committee-rotation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Sync Committee는 256 에폭(~27시간)마다 교체된다.
          <br />
          <code>period = slot / (256 * 32)</code>로 현재 period를 계산한다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 Beacon State에서 위원회를 직접 읽는다.
          <br />
          Helios는 Update 메시지에 포함된 next_sync_committee를 검증 후 교체한다.
        </p>
      </div>
      <div className="not-prose"><RotationViz /></div>
    </section>
  );
}
