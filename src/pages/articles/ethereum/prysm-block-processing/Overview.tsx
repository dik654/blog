import ContextViz from "./viz/ContextViz";
import BlockProcessingViz from "./viz/BlockProcessingViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Block processing은 서명·operation·execution payload를 순서대로 검증한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 블록 수신부터 fork별 상태 반영과 실행 payload
          확인까지의 의존 순서를 코드 수준으로 추적한다.
        </p>

        {/* ── process_block 파이프라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          process_block — fork별 파이프라인
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-1">
              <code>
                ProcessBlock(state *BeaconState, block *BeaconBlock) error
              </code>
            </p>
            <p className="text-xs text-foreground/60">
              아래는 공통 논리 그룹이며 실제 호출 목록은 block version에 따라
              달라진다.
            </p>
          </div>
          <div className="space-y-2">
            {[
              {
                step: "1",
                fn: "processBlockHeader",
                desc: "slot·parent·proposer를 확인하고 상태 내부 latest header 갱신",
                scope: "공통",
                color: "text-sky-400",
              },
              {
                step: "2",
                fn: "processRandao",
                desc: "제안자의 reveal을 검증해 현재 epoch RANDAO mix 갱신",
                scope: "공통",
                color: "text-violet-400",
              },
              {
                step: "3",
                fn: "processExecutionPayload",
                desc: "Bellatrix 이후 payload header와 Engine API 유효성 경계를 처리",
                scope: "fork 조건",
                color: "text-red-400",
              },
              {
                step: "4",
                fn: "processEth1Data / executionRequests",
                desc: "legacy deposit vote와 Electra 이후 execution requests를 version에 맞게 처리",
                scope: "fork 조건",
                color: "text-emerald-400",
              },
              {
                step: "5",
                fn: "processOperations",
                desc: "slashings·attestations·deposits·exits 등 block body operation 검증·반영",
                scope: "버전별 목록",
                color: "text-amber-400",
              },
              {
                step: "6",
                fn: "processSyncAggregate",
                desc: "Altair 이후 sync committee 참여와 집계 서명 처리",
                scope: "fork 조건",
                color: "text-pink-400",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted shrink-0 ${s.color}`}
                >
                  {s.step}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-semibold">{s.fn}</code>
                    <span className="text-xs text-muted-foreground">
                      {s.scope}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-foreground/70">
              처리 시간과 병목은 operation 수, BLS 검증 batching, EL 상태,
              캐시와 하드웨어에 따라 달라진다. 고정된 단계별 밀리초는 합의
              규칙이 아니다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          블록 처리는{" "}
          <strong>
            앞 단계의 상태를 다음 단계가 소비하는 버전별 파이프라인
          </strong>
          이다.
          fork가 추가되면 body 필드와 operation 순서, Engine API 인자를 함께
          확장해야 하며,
          성능 평가는 실제 블록 구성과 실행 환경에서 별도로 측정한다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <BlockProcessingViz />
      </div>
    </section>
  );
}
