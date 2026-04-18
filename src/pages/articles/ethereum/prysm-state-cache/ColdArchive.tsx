import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ColdArchive({ onCodeRef: _ }: Props) {
  return (
    <section id="cold-archive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cold State 아카이브</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Finalized된 에폭의 상태는 Hot 캐시에서 제거되고 Cold 영역으로 이동한다.<br />
          Cold 상태는 매 <strong>K 슬롯</strong>마다 DB에 저장된다 (기본 K = 2048).
        </p>

        {/* ── Cold state 저장 정책 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Cold State 저장 정책 — K-slot interval</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>saveColdState</code> 흐름</h4>
            <p className="text-xs text-muted-foreground mb-2"><code>DEFAULT_SLOTS_PER_COLD_STATE = 2048</code> (~6.8시간)</p>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div><code>slot % K == 0</code> 체크 — 아니면 <code>saveStateSummary()</code> 만 기록</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div><code>state.MarshalSSZ()</code> — SSZ 직렬화 (~250 MB)</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div><code>beaconDB.SaveState(root, encoded)</code> — full state 저장</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">추가 조건: epoch boundary (64 slot), finalized checkpoint slot</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">모드별 저장량 (1년 기준)</h4>
            <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="rounded border p-2">
                <p className="font-medium text-foreground">Archive</p>
                <p>K=1 효과 / ~5000개 state</p>
                <p>~1.2 TB</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium text-foreground">Non-archive</p>
                <p>K=8192 (~1일) / ~365개</p>
                <p>~90 GB</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium text-foreground">Prune</p>
                <p>수 주만 유지 / ~100개</p>
                <p>~25 GB</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Cold state는 <strong>K-slot 간격으로만 저장</strong>.<br />
          2048 slot(~6.8시간) = 기본값 → 디스크 사용량과 조회 속도 균형.<br />
          모드에 따라 K 조정 가능 (archive, default, prune).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Hot → Cold 전환</h3>
        <ul>
          <li><strong>트리거</strong> — Finalized 체크포인트 갱신 시</li>
          <li><strong>대상</strong> — 이전 Finalized 에폭까지의 Hot 상태</li>
          <li><strong>저장</strong> — K 슬롯 간격으로 선택적 저장</li>
          <li><strong>정리</strong> — 나머지 상태는 Hot 캐시에서 삭제</li>
        </ul>

        {/* ── Archive 모드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">저장 모드 3가지</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-4 border-blue-500/30 bg-blue-500/5">
              <h4 className="font-semibold text-sm mb-2">Default <span className="text-xs text-muted-foreground font-normal">대부분의 validator</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>K = 2048 (6.8시간)</li>
                <li>Finalized 이전 ~1달 유지</li>
                <li>디스크: ~100 GB</li>
                <li>Replay max: K-1 = 2047 slots</li>
                <li>Replay 비용: ~수 초</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Archive <span className="text-xs text-muted-foreground font-normal">--archive</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>모든 slot의 state 저장 (K=1)</li>
                <li>디스크: ~5 TB (연 ~2 TB 증가)</li>
                <li>Replay max: 0 (항상 hit)</li>
                <li>Replay 비용: 0</li>
                <li>단점: 디스크 비용 큼</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Minimal <span className="text-xs text-muted-foreground font-normal">--minimal</span></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>K = 8192 (~27시간)</li>
                <li>Finalized 이전 ~1주만 유지</li>
                <li>디스크: ~30 GB</li>
                <li>Replay max: 8191 slots (~27h)</li>
                <li>Replay 비용: 최대 수 분</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">선택 기준</h4>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>Solo validator → default / minimal</span>
                <span>Staking pool → default</span>
                <span>RPC provider → archive</span>
                <span>Explorer → archive</span>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">모드 전환</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>default → archive: missing slot state 복원 필요 (시간 소요)</li>
                <li>archive → default: 추가 삭제만 수행 (즉시)</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Prysm은 <strong>3가지 저장 모드</strong> 지원.<br />
          Default(100GB) → Archive(5TB) → Minimal(30GB).<br />
          노드 용도에 따라 디스크 vs 조회 속도 trade-off.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 K값과 재생 비용</strong> — K=2048이면 최대 2047슬롯(~6.8시간)을 재생해야 함.<br />
          자주 조회되는 인프라는 K값을 줄이거나 아카이벌 모드를 사용.<br />
          K값이 작을수록 디스크 사용량은 늘지만 조회 속도는 향상.
        </p>
      </div>
    </section>
  );
}
