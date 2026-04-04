import CheckpointViz from './viz/CheckpointViz';

export default function CheckpointSources({ title }: { title: string }) {
  return (
    <section id="checkpoint-sources" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          체크포인트 해시를 어디서 가져오느냐가 보안의 시작점이다.
          <br />
          Helios는 3가지 소스를 우선순위로 탐색한다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 제네시스 해시가 하드코딩되어 있다.
          <br />
          Helios는 <em>최근</em> 체크포인트를 사용하므로 Weak Subjectivity 가정이 필요하다.
        </p>
      </div>
      <div className="not-prose"><CheckpointViz /></div>
    </section>
  );
}
