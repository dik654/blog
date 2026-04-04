import ArchitectureViz from './viz/ArchitectureViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Host · Client · Server 아키텍처</h2>
      <div className="not-prose mb-8"><ArchitectureViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Host(LLM 앱) → Client(프로토콜 관리) → Server(도구 제공)의 3계층 구조<br />
          하나의 Host가 여러 Server에 연결 — 각 Server는 격리된 프로세스로 보안 경계 분리
        </p>
      </div>
    </section>
  );
}
