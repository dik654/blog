import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateRootCaching({ onCodeRef: _ }: Props) {
  return (
    <section id="state-root-caching" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 루트 캐싱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Ring Buffer ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Ring Buffer 8192 — 최근 state/block roots</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">BeaconState 필드</p>
            <div className="space-y-2 text-xs">
              <div><code className="text-indigo-300">block_roots: Vector[Bytes32, 8192]</code> <span className="text-foreground/60">— 슬롯별 블록 루트</span></div>
              <div><code className="text-indigo-300">state_roots: Vector[Bytes32, 8192]</code> <span className="text-foreground/60">— 슬롯별 상태 루트</span></div>
              <div><code className="text-indigo-300">historical_roots: List[Bytes32, LIMIT]</code> <span className="text-foreground/60">— 장기 보관용 (확장)</span></div>
            </div>
            <p className="text-xs text-foreground/60 mt-2"><code>SLOTS_PER_HISTORICAL_ROOT = 8192 = 2^13</code> — 8192 x 12초 = 약 27.3시간</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Ring Buffer 동작</p>
            <div className="text-xs text-foreground/70 space-y-1">
              <div>인덱스 계산: <code>idx = slot % SLOTS_PER_HISTORICAL_ROOT</code></div>
              <div>slot 0~8191 → 순차 기록 / slot 8192 → <code>block_roots[0]</code> 덮어씀 (순환)</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'RANDAO 계산',
              'Attestation beacon_block_root 검증',
              'Fork choice tip 추적',
              'Light client 근거리 증명',
            ].map((use, i) => (
              <div key={i} className="rounded-lg border border-border p-2 text-center">
                <span className="text-xs font-bold text-muted-foreground">{i + 1}.</span>
                <p className="text-xs text-foreground/70">{use}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">왜 27시간인가?</p>
            <div className="text-xs text-foreground/70 space-y-1">
              <div>Attestation inclusion window: 1 epoch (6.4분) / Finality: 2 epoch (~12.8분)</div>
              <div>Safety margin ~수 시간 포함 → 8192 slot (27시간)이 충분 + 메모리 효율적</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          block_roots/state_roots는 <strong>8192 slot ring buffer</strong>.<br />
          slot % 8192로 순환 인덱싱 → 최근 ~27시간 roots 유지.<br />
          Attestation 검증, RANDAO, fork choice에 직접 활용.
        </p>

        {/* ── HistoricalBatch ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HistoricalBatch — 장기 저장 압축</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">트리거 시점</p>
            <div className="text-xs text-foreground/70">
              ring buffer 한 바퀴(<code>slot % SLOTS_PER_HISTORICAL_ROOT == 0</code>) → 덮어쓰기 전 보관
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">HistoricalBatch (Phase0~Altair)</p>
              <div className="space-y-1 text-xs">
                <div><code className="text-sky-300">block_roots: Vector[Bytes32, 8192]</code></div>
                <div><code className="text-sky-300">state_roots: Vector[Bytes32, 8192]</code></div>
                <div className="text-foreground/60 mt-1"><code>batch.HashTreeRoot()</code> → 단일 32 bytes로 <code>historical_roots</code>에 추가</div>
              </div>
            </div>
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">HistoricalSummary (Capella+)</p>
              <div className="space-y-1 text-xs">
                <div><code className="text-violet-300">block_summary_root: Bytes32</code> <span className="text-foreground/60">— block_roots의 HashTreeRoot</span></div>
                <div><code className="text-violet-300">state_summary_root: Bytes32</code> <span className="text-foreground/60">— state_roots의 HashTreeRoot</span></div>
                <div className="text-foreground/60 mt-1">2개 필드 분리 → 각각 독립 증명 가능</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">압축률</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>원본: 8192 x 2 x 32B = <strong>512 KB</strong></div>
                <div>HashTreeRoot: <strong>32 bytes</strong></div>
                <div className="font-semibold text-emerald-400">16,000배 압축</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">장기 증명 절차</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div><strong>1.</strong> slot X가 속한 HistoricalBatch index 계산</div>
                <div><strong>2.</strong> <code>historical_roots[index]</code> 가져오기</div>
                <div><strong>3.</strong> HistoricalBatch 복원 (아카이브 노드)</div>
                <div><strong>4.</strong> Merkle proof 생성</div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          HistoricalBatch가 <strong>16,000배 압축</strong>.<br />
          512KB ring buffer → 32 bytes HashTreeRoot.<br />
          과거 상태 증명 가능 + state 크기 제어.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 링 버퍼 8192</strong> — stateRoots와 blockRoots는 고정 크기 8192 배열.<br />
          slot % 8192로 인덱싱하여 오래된 값을 자연스럽게 덮어씀.<br />
          약 27시간 분량 — 이보다 오래된 루트는 historicalRoots로 이동.
        </p>

        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 HistoricalBatch 압축</strong> — 에폭 경계에서 링 버퍼가 한 바퀴 돌면 stateRoots + blockRoots의 Merkle Root를 historicalRoots에 추가.<br />
          장기 상태 증명에 필요한 최소한의 데이터만 보관.
        </p>
      </div>
    </section>
  );
}
