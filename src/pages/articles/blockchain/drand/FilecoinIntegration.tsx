import FilecoinViz from './viz/FilecoinViz';

export default function FilecoinIntegration() {
  return (
    <section id="filecoin-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 연동</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Filecoin은 DRAND를 핵심 외부 의존성으로 사용.<br />
          블록 추첨, 저장 증명 챌린지, 타이밍 동기화 모두 DRAND 랜덤에 의존
        </p>
      </div>
      <div className="not-prose"><FilecoinViz /></div>
    </section>
  );
}
