import ContextViz from "./viz/ContextViz";
import EpochPipelineViz from "./viz/EpochPipelineViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Epoch processing은 누적 attestation을 reward와 finality로 반영한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 ProcessEpoch가 finality, 검증자 회계와 다음 epoch
          준비를 어떤 순서로 연결하는지 코드 수준으로 추적한다.
        </p>

        {/* ── Epoch processing 7단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ProcessEpoch — 순서가 중요한 상태 전환
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-1">
              <code>ProcessEpoch(state *BeaconState) error</code>
            </p>
            <p className="text-xs text-foreground/60">
              epoch 경계에서 실행하며 slots-per-epoch와 slot duration은 네트워크
              preset/config에서 읽는다.
            </p>
          </div>
          <div className="space-y-2">
            {[
              {
                step: "1",
                fn: "justification / finalization",
                desc: "이전·현재 epoch 참여를 평가해 justified/finalized checkpoint 갱신",
                scope: "합의",
                color: "text-sky-400",
              },
              {
                step: "2",
                fn: "inactivity updates",
                desc: "finality 지연 여부에 따라 inactivity score와 leak 관련 상태 갱신",
                scope: "liveness",
                color: "text-violet-400",
              },
              {
                step: "3",
                fn: "rewards / penalties",
                desc: "fork별 participation 표현을 읽어 검증자 잔액 delta 계산",
                scope: "회계",
                color: "text-amber-400",
              },
              {
                step: "4",
                fn: "registry / pending queues",
                desc: "activation, exit, deposit, withdrawal, consolidation 등 현재 fork의 queue 처리",
                scope: "수명주기",
                color: "text-emerald-400",
              },
              {
                step: "5",
                fn: "slashings",
                desc: "slashing vector와 상관 패널티 규칙에 따라 대상 balance 갱신",
                scope: "안전성",
                color: "text-red-400",
              },
              {
                step: "6",
                fn: "periodic resets",
                desc: "해당 경계에 도달한 vote·slashings·RANDAO 등 순환 구조 갱신",
                scope: "주기 작업",
                color: "text-indigo-400",
              },
              {
                step: "7",
                fn: "final updates",
                desc: "effective balance hysteresis, historical commitment와 다음 epoch 입력 준비",
                scope: "다음 상태",
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
              이 목록은 읽기 위한 논리 그룹이다. 실제 함수 수와 순서는 fork마다
              달라지므로 현재 스키마의 <code>process_epoch</code> 호출 순서를
              기준으로 확인한다. 처리 시간은 validator 수, dirty state, 캐시와
              하드웨어에서 측정한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          Epoch processing은{" "}
          <strong>앞 단계의 결과를 다음 단계가 소비하는 순차 파이프라인</strong>
          이다.
          finality와 회계만이 아니라 registry와 fork별 pending queue, 순환
          vector까지 함께 갱신한다. 새 fork를 추가할 때는 고정된 “7단계”가
          아니라 spec의 호출 순서와
          상태 의존성을 확장한다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <EpochPipelineViz />
      </div>
    </section>
  );
}
