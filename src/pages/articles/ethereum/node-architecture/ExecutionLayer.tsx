import RethModules from './RethModules';

export default function ExecutionLayer({ title }: { title?: string }) {
  return (
    <section id="execution-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Execution Layer (reth)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          reth — Rust 모듈형 EL 클라이언트. 180+ 크레이트로 구성.<br />
          Type-State Builder 패턴으로 컴파일 타임에 초기화 순서를 보장
        </p>
      </div>
      <RethModules />
    </section>
  );
}
