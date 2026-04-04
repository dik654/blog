import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import RewardDetailViz from './viz/RewardDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RewardsPenalties({ onCodeRef }: Props) {
  return (
    <section id="rewards-penalties" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보상 & 패널티</h2>
      <div className="not-prose mb-8"><RewardDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-rewards', codeRefs['process-rewards'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessRewardsAndPenalties()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Precompute 최적화</strong> — 모든 검증자의 참여도를 한 번에 집계한 후 보상/패널티 벡터 계산<br />
          N번 반복 대신 한 번의 순회로 처리하여 O(N) 성능 달성<br />
          Phase0 vs Altair에서 보상 공식이 다르므로 포크별 분기 구현
        </p>
      </div>
    </section>
  );
}
