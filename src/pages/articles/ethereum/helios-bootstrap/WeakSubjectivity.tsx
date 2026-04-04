import WeakSubViz from './viz/WeakSubViz';

export default function WeakSubjectivity({ title }: { title: string }) {
  return (
    <section id="weak-subjectivity" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          체크포인트가 너무 오래되면 검증자 집합이 완전히 바뀔 수 있다.
          <br />
          이더리움은 ~27시간을 Weak Subjectivity 유효 기간으로 정의한다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 제네시스부터 검증하므로 이 제약이 없다.
          <br />
          Helios는 이 시간 안에 체크포인트를 갱신해야 한다.
        </p>
      </div>
      <div className="not-prose"><WeakSubViz /></div>
    </section>
  );
}
