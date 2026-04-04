import PhatContractViz from './viz/PhatContractViz';
import PhatContractStepViz from './viz/PhatContractStepViz';

export default function PhatContract({ title }: { title?: string }) {
  return (
    <section id="phat-contract" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Phat Contract (Pink Runtime)'}</h2>
      <div className="not-prose mb-8">
        <PhatContractViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Phat Contract</strong>는 Phala Network의 TEE 내 스마트 컨트랙트입니다.<br />
          Substrate의 <code>pallet-contracts</code>를 기반으로
          HTTP 요청, 암호화 서명, 랜덤 생성 등 TEE 특화 확장 기능을 제공합니다.<br />
          Ink! 언어로 개발하며, WASM 샌드박스에서 격리 실행됩니다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <PhatContractStepViz />
      </div>
    </section>
  );
}
