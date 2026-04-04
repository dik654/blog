import R0EthereumViz from '../components/R0EthereumViz';
import CodePanel from '@/components/ui/code-panel';
import { VERIFIER_CODE, APP_CODE, STEEL_CODE, AGGREGATION_CODE } from './EthereumData';
import { verifierAnnotations, appAnnotations, steelAnnotations, aggregationAnnotations } from './EthereumAnnotations';

export default function R0Ethereum({ title }: { title?: string }) {
  return (
    <section id="ethereum" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Ethereum 통합 & 온체인 검증'}</h2>
      <div className="not-prose mb-8"><R0EthereumViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RISC Zero Ethereum — zkVM 증명을 이더리움 온체인에서 검증 가능한
          Solidity 컨트랙트 + Rust 라이브러리 제공<br />
          오프체인 계산 수행 → 결과만 온체인 검증
        </p>
        <CodePanel title="Verifier Router 패턴" code={VERIFIER_CODE} annotations={verifierAnnotations} />
        <CodePanel title="앱 컨트랙트 패턴" code={APP_CODE} annotations={appAnnotations} />
        <p>
          Steel — 이더리움 상태(스토리지, 잔액 등)를 읽는 뷰 콜을 오프체인에서 증명하는 라이브러리
        </p>
        <CodePanel title="Steel: EVM View Call 증명" code={STEEL_CODE} annotations={steelAnnotations} />
        <CodePanel title="증명 집계 (Aggregation)" code={AGGREGATION_CODE} annotations={aggregationAnnotations} />
      </div>
    </section>
  );
}
