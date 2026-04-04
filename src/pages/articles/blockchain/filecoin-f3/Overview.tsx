import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 F3가 필요한가</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        EC(Expected Consensus)의 확정까지 900 에폭(7.5시간) 대기 문제<br />
        F3는 EC 위에 올리는 확정성 레이어 — 블록 생산은 EC, 확정은 F3
      </p>
      <div className="not-prose mb-8"><ContextViz /></div>
    </section>
  );
}
