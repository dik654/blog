import ArchDiagram from './ArchDiagram';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '전체 구조'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이더리움 노드는 <strong>Execution Layer(EL)</strong>와{' '}
          <strong>Consensus Layer(CL)</strong> 두 클라이언트의 조합으로 동작합니다.
          The Merge 이후 PoS 합의는 CL이, 트랜잭션 실행과 상태 관리는 EL이 담당하며,
          <strong> Engine API</strong>로 통신합니다.
        </p>
        <p>
          아래 다이어그램의 각 컴포넌트를 클릭하면 세부 구조를 확인할 수 있습니다.
        </p>
      </div>
      <div className="mt-6">
        <ArchDiagram />
      </div>
    </section>
  );
}
