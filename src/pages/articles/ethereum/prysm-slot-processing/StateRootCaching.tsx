import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function StateRootCaching({ onCodeRef: _ }: Props) {
  return (
    <section id="state-root-caching" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 루트 캐싱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Ring Buffer ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          Ring Buffer — 최근 state/block roots
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">
              BeaconState 필드
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <code className="text-indigo-300">
                  block_roots: Vector[Bytes32, SLOTS_PER_HISTORICAL_ROOT]
                </code>{" "}
                <span className="text-foreground/60">— 슬롯별 블록 루트</span>
              </div>
              <div>
                <code className="text-indigo-300">
                  state_roots: Vector[Bytes32, SLOTS_PER_HISTORICAL_ROOT]
                </code>{" "}
                <span className="text-foreground/60">— 슬롯별 상태 루트</span>
              </div>
              <div>
                <code className="text-indigo-300">
                  historical_roots / historical_summaries
                </code>{" "}
                <span className="text-foreground/60">
                  — 포크별 과거 범위 commitment
                </span>
              </div>
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              <code>SLOTS_PER_HISTORICAL_ROOT</code> entries — 보관 시간은 이
              preset과 <code>SLOT_DURATION_MS</code>로 계산
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Ring Buffer 동작
            </p>
            <div className="text-xs text-foreground/70 space-y-1">
              <div>
                인덱스 계산: <code>idx = slot % SLOTS_PER_HISTORICAL_ROOT</code>
              </div>
              <div>
                slot 0~8191 → 순차 기록 / slot 8192 →{" "}
                <code>block_roots[0]</code> 덮어씀 (순환)
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "RANDAO 계산",
              "Attestation beacon_block_root 검증",
              "Fork choice tip 추적",
              "Light client 근거리 증명",
            ].map((use, i) => (
              <div
                key={i}
                className="rounded-lg border border-border p-2 text-center"
              >
                <span className="text-xs font-bold text-muted-foreground">
                  {i + 1}.
                </span>
                <p className="text-xs text-foreground/70">{use}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              preset과 시간의 구분
            </p>
            <div className="text-xs text-foreground/70 space-y-1">
              <div>
                8192는 mainnet preset의 <code>SLOTS_PER_HISTORICAL_ROOT</code>{" "}
                값이다.
              </div>
              <div>
                벽시계 시간은 <code>SLOT_DURATION_MS</code>와 함께 계산하며 설계
                근거를 임의의 safety margin으로 단정하지 않는다.
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>block_roots</code>와 <code>state_roots</code>는 <code>SLOTS_PER_HISTORICAL_ROOT</code> 크기의 ring buffer입니다. <code>slot % SLOTS_PER_HISTORICAL_ROOT</code> 위치를 새 root로 덮어쓰므로 recent root lookup은 고정된 state field 안에서 처리할 수 있고, attestation target과 historical-root 검증 같은 consensus rule이 이 범위를 사용합니다.
        </p>

        {/* ── HistoricalBatch ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          HistoricalBatch — 장기 저장 압축
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              트리거 시점
            </p>
            <div className="text-xs text-foreground/70">
              ring buffer 한 바퀴(
              <code>slot % SLOTS_PER_HISTORICAL_ROOT == 0</code>) → 덮어쓰기 전
              보관
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">
                HistoricalBatch (Phase0~Altair)
              </p>
              <div className="space-y-1 text-xs">
                <div>
                  <code className="text-sky-300">
                    block_roots: Vector[Bytes32, 8192]
                  </code>
                </div>
                <div>
                  <code className="text-sky-300">
                    state_roots: Vector[Bytes32, 8192]
                  </code>
                </div>
                <div className="text-foreground/60 mt-1">
                  <code>batch.HashTreeRoot()</code> → 단일 32 bytes로{" "}
                  <code>historical_roots</code>에 추가
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">
                HistoricalSummary (Capella+)
              </p>
              <div className="space-y-1 text-xs">
                <div>
                  <code className="text-violet-300">
                    block_summary_root: Bytes32
                  </code>{" "}
                  <span className="text-foreground/60">
                    — block_roots의 HashTreeRoot
                  </span>
                </div>
                <div>
                  <code className="text-violet-300">
                    state_summary_root: Bytes32
                  </code>{" "}
                  <span className="text-foreground/60">
                    — state_roots의 HashTreeRoot
                  </span>
                </div>
                <div className="text-foreground/60 mt-1">
                  2개 필드 분리 → 각각 독립 증명 가능
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">
                commitment 크기
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  원본: 8192 x 2 x 32B = <strong>512 KB</strong>
                </div>
                <div>
                  HashTreeRoot: <strong>32 bytes</strong>
                </div>
                <div className="font-semibold text-emerald-400">
                  원본을 대체하는 압축본이 아니라 범위에 대한 commitment
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                장기 증명 절차
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  <strong>1.</strong> slot X가 속한 HistoricalBatch index 계산
                </div>
                <div>
                  <strong>2.</strong> <code>historical_roots[index]</code>{" "}
                  가져오기
                </div>
                <div>
                  <strong>3.</strong> HistoricalBatch 복원 (아카이브 노드)
                </div>
                <div>
                  <strong>4.</strong> Merkle proof 생성
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          HistoricalBatch/Summary는{" "}
          <strong>과거 범위의 Merkle commitment</strong>를 state에 남깁니다. Commitment만으로 원본 root list를 복원할 수는 없으므로 과거 field의 proof를 만들려면 해당 historical data와 branch가 별도로 필요합니다. 활성 fork에 따라 <code>historical_roots</code> 또는 <code>historical_summaries</code>를 갱신하는 rule도 달라집니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 링 버퍼</strong> — stateRoots와 blockRoots는 preset이 정한
          고정 크기 vector입니다. Modulo indexing으로 오래된 entry를 덮어쓰기 전에 범위 전체의 commitment를 fork별 historical structure에 추가합니다. 개별 old root가 <code>historical_roots</code> list로 그대로 이동하는 구조는 아닙니다.
        </p>

        <p className="mt-4 border-l-2 border-violet-500/50 pl-3 text-sm">
          <strong>💡 Historical commitment</strong> — 링 버퍼가 한 바퀴 도는
          경계에서 stateRoots + blockRoots의 Merkle commitment를 포크에 맞는
          list에 추가합니다. 이 값은 long-range proof의 anchor를 남기지만 proof에 필요한 원본 leaf data까지 state 안에 보관하지는 않습니다.
        </p>
      </div>
    </section>
  );
}
