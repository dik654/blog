import LighthouseModules from './LighthouseModules';

export default function ConsensusLayer({ title }: { title?: string }) {
  return (
    <section id="consensus-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Consensus Layer (lighthouse)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Lighthouse</strong>는 Rust 기반 CL 클라이언트로 94개의 크레이트,
          8개의 바이너리로 구성됩니다. <code className="bg-accent px-1.5 py-0.5 rounded text-sm">EthSpec</code> 트레이트로
          Mainnet/Minimal 스펙을 컴파일 타임에 전환하고,
          Beacon Node와 Validator Client를 별도 프로세스로 분리합니다.
        </p>
        
      </div>
      <div className="mt-6">
        <LighthouseModules />
      </div>
    </section>
  );
}
