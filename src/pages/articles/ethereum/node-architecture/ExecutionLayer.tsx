import RethModules from './RethModules';

export default function ExecutionLayer({ title }: { title?: string }) {
  return (
    <section id="execution-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Execution Layer (reth)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>reth</strong>는 Rust로 작성된 모듈형 EL 클라이언트로, 180+개의
          크레이트로 구성됩니다. Type-State Builder 패턴으로 컴파일 타임에
          초기화 순서를 보장하고, <code className="bg-accent px-1.5 py-0.5 rounded text-sm">NodeTypes</code> 트레이트를
          통해 Ethereum / Optimism을 동일 코드베이스로 지원합니다.
        </p>
        
      </div>
      <div className="mt-6">
        <RethModules />
      </div>
    </section>
  );
}
