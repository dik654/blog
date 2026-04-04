import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tusk: 비동기 DAG 합의</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Tusk는 Narwhal DAG 위에서 동작하는 완전 비동기 합의 프로토콜입니다.<br />
          네트워크 타이밍 가정 없이도 안전성과 활성을 보장합니다
        </p>
        <h3>Narwhal + Tusk 분리 설계</h3>
        <p className="leading-7">
          Narwhal이 DAG를 구축해 데이터 가용성을 보장합니다.<br />
          Tusk는 DAG 위에서 순서만 결정합니다.<br />
          💡 멤풀(데이터 전파)과 합의(순서 결정)를 분리해 처리량 극대화
        </p>
      </div>
    </section>
  );
}
