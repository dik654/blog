import LighthouseModules from './LighthouseModules';

export default function ConsensusLayer({ title }: { title?: string }) {
  return (
    <section id="consensus-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Consensus Layer (lighthouse)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Lighthouse — Rust 기반 CL 클라이언트. 94 크레이트, 8 바이너리로 구성.<br />
          Beacon Node와 Validator Client를 별도 프로세스로 분리
        </p>
      </div>
      <LighthouseModules />
    </section>
  );
}
