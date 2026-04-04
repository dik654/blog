import { codeRefs } from './codeRefs';
import RoundStateViz from './viz/RoundStateViz';
import type { CodeRef } from '@/components/code/types';

export default function RoundState({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="round-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">라운드 상태 머신 추적</h2>
      <div className="not-prose mb-8">
        <RoundStateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 LockedBlock — 안전성의 핵심</strong> — 2/3+ polka 블록에 Lock 설정<br />
          잠긴 후 다른 블록 prevote 불가 → 두 블록 동시 확정 원천 차단
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 ValidBlock — liveness 보조</strong> — Polka를 본 블록을 ValidBlock에 저장<br />
          다음 라운드 제안자가 ValidBlock을 재사용 → 불필요한 재전송 방지
        </p>
      </div>
    </section>
  );
}
