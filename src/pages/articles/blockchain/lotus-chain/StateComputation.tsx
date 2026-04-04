import StateViz from './viz/StateViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateComputation({ onCodeRef }: Props) {
  return (
    <section id="state-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 계산 — ApplyBlocks() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        StateManager.ApplyBlocks()가 FVM으로 메시지 실행 → state root 계산<br />
        CronTick이 사용자 메시지보다 선행 — 마이너 결함 처리가 메시지에 영향
      </p>
      <div className="not-prose mb-8">
        <StateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
