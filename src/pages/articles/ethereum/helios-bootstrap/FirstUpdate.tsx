import FirstUpdateViz from './viz/FirstUpdateViz';

export default function FirstUpdate({ title }: { title: string }) {
  return (
    <section id="first-update" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Store 초기화가 끝나면 Beacon API에 <code>finality_update</code>를 요청한다.
          <br />
          이것이 부트스트랩 이후 첫 번째 동기화 단계다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 피어에서 블록을 하나씩 받는다.
          <br />
          Helios는 단일 API 응답으로 최신 finalized 헤더를 즉시 확보한다.
        </p>
      </div>
      <div className="not-prose"><FirstUpdateViz /></div>
    </section>
  );
}
