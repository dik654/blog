import DelegateCallViz from './viz/DelegateCallViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function DelegateStaticCall({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="delegate-static" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">파생 호출: DelegateCall · StaticCall · Selfdestruct</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Call()의 변형 — 컨텍스트 유지(Delegate), 읽기 전용(Static), 계정 파괴(Selfdestruct)
          <br />
          모두 Call()과 동일한 Snapshot → Run() → Revert 구조를 공유
        </p>
      </div>
      <div className="not-prose">
        <DelegateCallViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
