import ExecFlowViz from './viz/ExecFlowViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ExecutionFlow({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execution-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">트랜잭션 → EVM 실행 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          블록에 포함된 트랜잭션이 상태 전이를 일으키는 전체 과정
          <br />
          geth의 <code>stateTransition.execute()</code>가 5단계로 처리
        </p>
      </div>
      <div className="not-prose mb-8">
        <ExecFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          {/* 트랜잭션에 받는 주소(To)가 지정되지 않은 경우 */}
          msg.To == nil이면 컨트랙트 생성(Create) — init code를 실행하여 결과를 배포
          <br />
          msg.To != nil이면 일반 호출(Call) — 대상 주소의 코드를 인터프리터 루프로 실행
        </p>
      </div>
    </section>
  );
}
