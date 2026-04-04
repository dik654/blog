import StateRoundViz from './viz/StateRoundViz';
import MessageTypesViz from './viz/MessageTypesViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CoreTraits({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="core-traits" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Core Types: State · Round · Proposal</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Simplex의 상태 관리는 2단계 — State(에폭) → Round(뷰)
          <br />
          각 뷰의 투표·인증서·타임아웃을 Round가 독립 추적
        </p>
      </div>
      <div className="not-prose mb-8">
        <StateRoundViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">프로토콜 메시지 & Trait 분리</h3>
        <p className="leading-7">
          투표(개별 서명) → 인증서(2f+1 집합) 2단계 + Automaton·Relay·Reporter 분리
        </p>
      </div>
      <div className="not-prose">
        <MessageTypesViz onOpenCode={open} />
      </div>
    </section>
  );
}
