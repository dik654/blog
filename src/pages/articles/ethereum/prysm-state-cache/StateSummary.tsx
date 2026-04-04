import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateSummary({ onCodeRef }: Props) {
  return (
    <section id="state-summary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">State Summary & 재생</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          에폭 경계가 아닌 슬롯의 상태는 저장하지 않는다.<br />
          대신 <strong>StateSummary</strong>(슬롯, 블록 루트)만 기록해 공간을 절약한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('replay-blocks', codeRefs['replay-blocks'])} />
          <span className="text-[10px] text-muted-foreground self-center">ReplayBlocks()</span>
          <CodeViewButton onClick={() => onCodeRef('state-by-slot', codeRefs['state-by-slot'])} />
          <span className="text-[10px] text-muted-foreground self-center">StateBySlot()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">재생 과정</h3>
        <ul>
          <li><strong>기점 탐색</strong> — 타겟 슬롯 이전의 가장 가까운 저장 상태를 찾음</li>
          <li><strong>블록 로딩</strong> — 기점~타겟 사이의 블록을 DB에서 로드</li>
          <li><strong>순차 적용</strong> — ProcessSlots + ExecuteStateTransition을 반복</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 최대 재생 거리</strong> — 에폭 경계마다 저장하므로 최대 31슬롯(~6.2분) 재생<br />
          재생 비용은 기점~타겟 거리에 비례<br />
          빈 슬롯(블록 없음)은 ProcessSlots만 수행해 빠르게 건너뜀
        </p>
      </div>
    </section>
  );
}
