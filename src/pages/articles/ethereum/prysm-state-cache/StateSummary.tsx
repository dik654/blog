import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateSummary({ onCodeRef }: Props) {
  return (
    <section id="state-summary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">State Summary & 재생</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          에폭 경계가 아닌 슬롯의 상태는 저장하지 않는다.<br />
          대신 <strong>StateSummary</strong>(슬롯, 블록 루트)만 기록해 공간을 절약한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('replay-blocks', codeRefs['replay-blocks'])} />
          <span className="text-[10px] text-muted-foreground self-center">ReplayBlocks()</span>
          <CodeViewButton onClick={() => onCodeRef('state-by-slot', codeRefs['state-by-slot'])} />
          <span className="text-[10px] text-muted-foreground self-center">StateBySlot()</span>
        </div>

        {/* ── StateSummary 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateSummary — 메타데이터 인덱스</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>StateSummary</code> 구조체</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span><code>Slot uint64</code> — 해당 slot</span>
              <span><code>Root [32]byte</code> — block root (state root 유도 가능)</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">slot별 1 entry x ~30 bytes → 1년치 2,700,000 slots = <strong className="text-foreground">~80 MB</strong> (실제 state 저장보다 100배 이상 작음)</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">용도</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>slot → block_root 매핑 (빠른 인덱스)</li>
                <li>Replay 기점 탐색</li>
                <li>RPC <code>/eth/v1/beacon/headers/{'{slot}'}</code> 응답</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">DB 저장</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Bucket: <code>"state-summary"</code> in BoltDB</li>
                <li>Key: <code>slot</code> (big-endian uint64)</li>
                <li>Value: <code>block_root</code> (32 bytes)</li>
                <li>조회: <code>GetStateSummary(slot)</code> → <code>db.Get("state-summary", key)</code></li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Skipped slots 처리</h4>
            <p className="text-xs text-muted-foreground">빈 slot (블록 없음) → StateSummary 없음. 하지만 state는 변경됨 (slot transition). Replay 시 <code>ProcessSlots</code> 만 수행 (블록 없이 진행)</p>
          </div>
        </div>
        <p className="leading-7">
          StateSummary는 <strong>모든 slot의 메타데이터 인덱스</strong>.<br />
          slot → block_root 매핑만 저장 → 1년치 ~80MB.<br />
          Replay 기점 탐색 및 RPC 응답에 활용.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">재생 과정</h3>
        <ul>
          <li><strong>기점 탐색</strong> — 타겟 슬롯 이전의 가장 가까운 저장 상태를 찾음</li>
          <li><strong>블록 로딩</strong> — 기점~타겟 사이의 블록을 DB에서 로드</li>
          <li><strong>순차 적용</strong> — ProcessSlots + ExecuteStateTransition을 반복</li>
        </ul>

        {/* ── ReplayBlocks 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ReplayBlocks — 기점→타겟 state 전환</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>ReplayBlocks</code> 흐름</h4>
            <p className="text-xs text-muted-foreground mb-2"><code>startState.Copy()</code> 로 복사본 생성 후 순차 적용</p>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1a</span>
                <div>블록 슬롯까지 empty slot 전환: <code>ProcessSlot(state, currentSlot+1)</code> 반복</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1b</span>
                <div>블록 실행: <code>ExecuteStateTransition(state, block)</code></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div>마지막 블록 이후 targetSlot까지 empty slots 처리</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">비용 분석</h4>
              <div className="grid gap-1 text-xs text-muted-foreground">
                <span><code>ProcessSlot</code>: ~수 ms (randao update 등만)</span>
                <span><code>ExecuteStateTransition</code>: ~50ms 평균 (블록 크기 비례)</span>
                <div className="border-t pt-1 mt-1">
                  <span>1 epoch (32 slot): ~500ms</span><br />
                  <span>1 day (7200 slot): ~2분</span><br />
                  <span>K=2048 max: ~1분 (avg)</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">최적화</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>병렬 signature verify</li>
                <li>FieldTrie 캐시 재사용</li>
                <li>pre-allocated slice pools</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>ReplayBlocks</code>가 <strong>state transition 순차 재적용</strong>.<br />
          각 block마다 ProcessSlot(빈 slot) + ExecuteStateTransition(블록).<br />
          K=2048 기준 최대 replay ~1분 — 드물지만 발생 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 최대 재생 거리</strong> — 에폭 경계마다 저장하므로 최대 31슬롯(~6.2분) 재생.<br />
          재생 비용은 기점~타겟 거리에 비례.<br />
          빈 슬롯(블록 없음)은 ProcessSlots만 수행해 빠르게 건너뜀.
        </p>
      </div>
    </section>
  );
}
