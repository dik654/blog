import ContextViz from './viz/ContextViz';
import CodePanel from '@/components/ui/code-panel';
import DAGViz from './viz/DAGViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const dagCompareCode = `이더리움 (선형 체인):
  B1 -> B2 -> B3 -> B4 -> B5
  한 ���에 하나의 블록만 제안/처리

DAG 기반 (Narwhal + Bullshark):
  Round 1    Round 2    Round 3    Round 4
  +---+      +---+      +---+      +---+
  |V1 |----->|V1 |----->|V1*|----->|V1 |  (* = 리더)
  +---+\\    /+---+\\    /+---+\\    /+---+
        \\  /       \\  /       \\  /
  +---+  \\/  +---+  \\/  +---+  \\/  +---+
  |V2 |--X-->|V2 |--X-->|V2 |--X-->|V2 |
  +---+ /\\   +---+ /\\   +---+ /\\   +---+
       /  \\       /  \\       /  \\
  +---+    \\ +---+    \\ +---+    \\ +---+
  |V3 |----->|V3 |----->|V3 |----->|V3 |
  +---+      +---+      +---+      +---+

  모든 검증자가 매 라운드 동시에 "vertex" 제출
  -> 처리량 = n x (단일 노드 처리량)`;

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DAG 기반 합의 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 Narwhal(DAG 구축)과 Bullshark(순서 결정)의<br />
          내부 구조를 코드 수준으로 추적합니다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">선형 체인 vs DAG</h3>
        <CodePanel title="선형 체인 vs DAG 구조" code={dagCompareCode}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '이더리움: 단일 블록 순차 처리' },
            { lines: [5, 18], color: 'emerald', note: 'DAG: 모든 검증자 동시 제출' },
            { lines: [20, 21], color: 'amber', note: '처리량 = n배 향상' },
          ]} />
        <DAGViz />
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('sui-block', codeRefs['sui-block'])} />
            <span className="text-[10px] text-muted-foreground self-center">block.rs</span>
            <CodeViewButton onClick={() => onCodeRef('sui-core', codeRefs['sui-core'])} />
            <span className="text-[10px] text-muted-foreground self-center">core.rs</span>
          </div>
        )}
      </div>
    </section>
  );
}
