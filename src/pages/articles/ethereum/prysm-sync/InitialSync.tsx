import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function InitialSync({ onCodeRef }: Props) {
  return (
    <section id="initial-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initial Sync</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Initial Sync는 <code>BlocksByRange</code> RPC를 사용해<br />
          피어에서 블록을 배치로 요청한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('round-robin-sync', codeRefs['round-robin-sync'])} />
          <span className="text-[10px] text-muted-foreground self-center">roundRobinSync()</span>
          <CodeViewButton onClick={() => onCodeRef('blocks-by-range-handler', codeRefs['blocks-by-range-handler'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlocksByRange 핸들러</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">라운드로빈 전략</h3>
        <ul>
          <li><strong>피어 필터링</strong> — 헤드 슬롯이 우리보다 앞선 피어만 선택</li>
          <li><strong>범위 분배</strong> — [0-63] → 피어A, [64-127] → 피어B 식으로 분산</li>
          <li><strong>응답 정렬</strong> — 도착 순서 무관하게 슬롯 순으로 정렬</li>
          <li><strong>순차 처리</strong> — 상태 전환은 반드시 슬롯 순서대로 실행</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 병렬 다운로드 + 순차 실행</strong> — 다운로드는 여러 피어에 병렬 분산하지만<br />
          상태 전환은 반드시 순차 실행해야 함 (slot N의 상태가 slot N+1의 입력)<br />
          이 구조가 Initial Sync의 근본적 속도 한계
        </p>
      </div>
    </section>
  );
}
