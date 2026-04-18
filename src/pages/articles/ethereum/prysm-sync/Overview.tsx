import ContextViz from './viz/ContextViz';
import SyncModesViz from './viz/SyncModesViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동기화 전략 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 각 동기화 모드의 내부 동작과 모드 전환 로직을 코드 수준으로 추적한다.
        </p>

        {/* ── 3가지 동기화 모드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 동기화 모드</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-1">1. Initial Sync (Full Sync)</p>
              <p className="text-sm text-foreground/80">genesis부터 block-by-block 재생. 소요: 수 일. 디스크 최대. 완전 자체 검증(신뢰 불필요).</p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-1">2. Checkpoint Sync</p>
              <p className="text-sm text-foreground/80">trusted URL에서 finalized state 다운로드. 소요: 수 분. 신뢰 가정: checkpoint URL 정직. 일반 사용자 권장.</p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs font-bold text-purple-500 mb-1">3. Regular Sync (Live)</p>
              <p className="text-sm text-foreground/80">Initial/Checkpoint 완료 후 자동 전환. 실시간 gossip 블록 수신. 블록당 ~100ms. validator 운영 모드.</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2"><code>decideSyncMode()</code> — 모드 결정 로직</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><code>checkpointURL != ""</code> → Checkpoint Sync</p>
              <p><code>dbHead != 0</code> → Regular Sync (기존 DB 존재)</p>
              <p>그 외 → Initial Sync (genesis부터)</p>
            </div>
            <p className="text-xs text-foreground/60 mt-2">전환 조건: head slot이 network tip에 도달하면 (Initial or Checkpoint) → Regular.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">Solo staker → Checkpoint</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">Archive → Initial</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">Research → Initial+archive</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">Validator → Checkpoint+Regular</div>
          </div>
        </div>
        <p className="leading-7">
          Prysm은 <strong>3가지 sync mode</strong> 지원.<br />
          Initial(완전) / Checkpoint(빠름) / Regular(실시간).<br />
          용도별 선택: staker는 Checkpoint, archive는 Initial.
        </p>
      </div>
      <div className="not-prose mt-6"><SyncModesViz /></div>
    </section>
  );
}
