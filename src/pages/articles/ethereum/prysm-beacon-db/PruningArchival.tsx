import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PruningArchival({ onCodeRef: _ }: Props) {
  return (
    <section id="pruning-archival" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프루닝 & 아카이벌</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Finalized 체크포인트가 갱신되면 그 이전의 비-캐노니컬 데이터를 정리한다.<br />
          디스크 사용량을 제어하는 핵심 메커니즘이다.
        </p>

        {/* ── Pruning 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pruning 프로세스 — finalized 이후</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>pruneFinalized</code> 흐름</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div><code>collectCanonicalChain(finalizedSlot)</code> — 캐노니컬 체인 블록 루트 수집</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div><code>blocksBucket.Cursor()</code> 순회 — slot &lt; finalizedSlot + non-canonical → <code>cur.Delete()</code></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div>관련 인덱스 정리 — <code>parent_root_indices</code>, <code>slot_indices</code>, 참조된 state</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Pruning 주기</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Finalized checkpoint 변경 시 트리거</li>
                <li>매 epoch 경계 (~6.4분) 약 1회</li>
                <li>삭제 대상 적으므로 빠름 (~수 ms)</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">주의: bbolt 공간 관리</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>공간 즉시 반환 안 함 (free page 재사용 대기)</li>
                <li>실제 디스크 반환은 <code>db.Compact()</code> 수동 필요</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Pruning은 <strong>finalized checkpoint 갱신 시 트리거</strong>.<br />
          non-canonical + pre-finalized 블록/state 삭제.<br />
          bbolt는 공간 즉시 반환 안 함 → free page 재사용.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">프루닝 대상</h3>
        <ul>
          <li><strong>비-캐노니컬 블록</strong> — Finalized 이전, 캐노니컬 체인에 포함되지 않은 블록</li>
          <li><strong>고아 상태</strong> — 참조하는 블록이 삭제된 상태</li>
          <li><strong>만료된 어테스테이션</strong> — 이미 Finalized된 에폭의 미포함 어테스테이션</li>
        </ul>

        {/* ── Archive vs Prune ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Archive vs Prune 모드 — 운영 결정</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Archive <span className="text-xs text-muted-foreground font-normal">--archive</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>모든 데이터 영구 보관</li>
                <li>Finalized pruning skip</li>
                <li>디스크: 연 ~2 TB 증가</li>
                <li>RPC: 모든 과거 slot 즉시 응답</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4 border-blue-500/30 bg-blue-500/5">
              <h4 className="font-semibold text-sm mb-2">Default <span className="text-xs text-muted-foreground font-normal">pruning 활성</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>non-canonical 즉시 삭제</li>
                <li>state 보존: 최근 ~10,000 epoch (~2달)</li>
                <li>디스크: 안정적 ~100 GB</li>
                <li>RPC: 최근 상태만 즉시</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Minimal <span className="text-xs text-muted-foreground font-normal">--minimal</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>최소 디스크 사용</li>
                <li>최근 1주만 보관</li>
                <li>디스크: ~30 GB</li>
                <li>validator 기능만 수행</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">선택 기준</h4>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>Solo validator → default / minimal</span>
                <span>Institutional staker → default + replication</span>
                <span>RPC provider → archive</span>
                <span>Researcher/analyst → archive</span>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Pruning 주의점</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>fork choice는 finalized_epoch - 1 epoch 유지 필수</li>
                <li>peer에게 과거 블록 제공 의무 (<code>min_epochs_for_block_requests</code>)</li>
                <li>bbolt 자동 compaction 없음 → 수동 <code>db.Compact()</code> 필요 (오프라인 권장)</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>3가지 모드</strong>로 디스크 vs 기능 균형 조절.<br />
          Archive(~TB) → Default(~100GB) → Minimal(~30GB).<br />
          용도에 맞는 모드 선택이 운영 비용 결정.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 아카이벌 모드</strong> — --archive 플래그로 프루닝을 건너뛸 수 있음.<br />
          블록 탐색기, 분석 인프라 등 전체 히스토리가 필요한 경우 사용.<br />
          메인넷 기준 연간 수백 GB 이상이므로 충분한 스토리지가 전제.
        </p>
      </div>
    </section>
  );
}
