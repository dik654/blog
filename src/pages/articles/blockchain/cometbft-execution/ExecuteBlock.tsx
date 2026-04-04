import { codeRefs } from './codeRefs';
import ApplyBlockViz from './viz/ApplyBlockViz';
import type { CodeRef } from '@/components/code/types';

export default function ExecuteBlock({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execute-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ApplyBlock 내부 (ABCI 호출 순서)</h2>
      <div className="not-prose mb-8">
        <ApplyBlockViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 ApplyBlock이 전체 상태 전이를 집약</strong> — 검증, ABCI 실행, 상태 갱신, DB 저장이 모두 이 함수 안에 있음<br />
          fail.Fail() 크래시 주입 지점 — 각 단계 사이에서 크래시가 발생해도 복구 가능함을 검증
        </p>
      </div>
    </section>
  );
}
