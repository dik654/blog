import CodePanel from '@/components/ui/code-panel';
import { ANTE_CHAIN_CODE, ANTE_ANNOTATIONS } from './AnteHandlerData';
import AnteHandlerViz from './viz/AnteHandlerViz';

export default function AnteHandler() {
  return (
    <section id="ante-handler" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AnteHandler 체인 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          AnteHandler는 이더리움의 <strong>validateTx()</strong>에 해당하는 트랜잭션 사전 검증 파이프라인입니다.
          <br />
          체인 형태의 <strong>데코레이터 패턴(Decorator Pattern)</strong>으로 구성됩니다.
          <br />
          수수료 차감, 서명 검증, 시퀀스 관리 등을 순차적으로 수행합니다.
        </p>
      </div>

      <AnteHandlerViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>AnteHandler 데코레이터 체인</h3>
        <CodePanel title="AnteHandler 체인 구성" code={ANTE_CHAIN_CODE} annotations={ANTE_ANNOTATIONS} />
      </div>
    </section>
  );
}
