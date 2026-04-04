import ArchDiagram from './ArchDiagram';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '전체 구조'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움 노드는 Execution Layer(EL)와 Consensus Layer(CL) 두 클라이언트의 조합으로 동작.<br />
          The Merge 이후 PoS 합의는 CL이, 트랜잭션 실행과 상태 관리는 EL이 담당하며 Engine API로 통신
        </p>
      </div>
      <ArchDiagram />
    </section>
  );
}
