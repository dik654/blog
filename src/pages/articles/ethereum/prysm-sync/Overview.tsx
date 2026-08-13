import ContextViz from "./viz/ContextViz";
import SyncModesViz from "./viz/SyncModesViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prysm sync는 finalized checkpoint에서 head까지 경로를 바꾼다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 각 동기화 모드의 내부 동작과 모드 전환 로직을 코드
          수준으로 추적한다.
        </p>

        {/* ── 동기화 단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          시작 전략과 live 추격 단계
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-1">
                1. Initial Sync (Full Sync)
              </p>
              <p className="text-sm text-foreground/80">
                로컬 시작점 이후의 역사 블록을 범위 요청으로 받아 검증·적용한다.
                완료 시간은 시작점, 피어와 DB 성능에 좌우된다.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-1">
                2. Checkpoint Sync
              </p>
              <p className="text-sm text-foreground/80">
                신뢰 가능한 finalized state/block에서 시작해 과거 재실행을
                줄인다. checkpoint root의 출처가 명시적 신뢰 경계다.
              </p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs font-bold text-purple-500 mb-1">
                3. Regular Sync (Live)
              </p>
              <p className="text-sm text-foreground/80">
                초기 추격 뒤 gossip과 누락 블록 RPC를 함께 사용해 head 부근을
                유지한다. 처리 지연은 실제 부하에서 측정한다.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              <code>decideSyncMode()</code> — 모드 결정 로직
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                <code>checkpointURL != ""</code> → Checkpoint Sync
              </p>
              <p>
                <code>dbHead != 0</code> → Regular Sync (기존 DB 존재)
              </p>
              <p>그 외 → Initial Sync (genesis부터)</p>
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              이 분기는 읽기용 모델이며 실제 Prysm의 service 상태, DB 초기화와
              head 근접 판정은 현재 릴리스 코드를 따른다.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              신뢰 anchor 보유 → Checkpoint
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              이력 재검증 → Initial range
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              head 근접 → Regular
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              오프라인 복귀 → gap 크기로 판단
            </div>
          </div>
        </div>
        <p className="leading-7">
          Prysm 동기화는{" "}
          <strong>시작점을 고르는 단계와 head를 유지하는 단계</strong>로 나누어
          보면 확장하기 쉽다.
          Initial과 Checkpoint는 시작 신뢰·작업량의 선택이고, Regular는 head
          근처에서 이어지는 live 동작이다. 따라서
          운영 목적만으로 고정 매핑하지 말고 신뢰 anchor, 보관 정책과 복구
          시간을 함께 결정한다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <SyncModesViz />
      </div>
    </section>
  );
}
