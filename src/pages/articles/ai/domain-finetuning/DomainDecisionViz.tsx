import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import {
  DOMAIN_ADAPTATION_FIXTURE as FIXTURE,
  candidateFitsBudget,
  candidatePassesHardRequirements,
  candidatePassesQuality,
} from "./calculations";

type SceneProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function Scene({ id, eyebrow, title, description, labels, notes, children }: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 7200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? labels.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 [&>figcaption>p:last-child]:hidden sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7 sm:[&>figcaption>p:last-child]:mt-2 sm:[&>figcaption>p:last-child]:block sm:[&>figcaption>p:last-child]:text-sm sm:[&>figcaption>p:last-child]:leading-6"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label={`${title}의 ${labels.length}단계 설명`}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-col justify-center sm:min-h-[25rem]">
          <p className="text-[11px] font-black text-primary">
            장면 {String(active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}
          </p>
          <h4 className="mt-1 break-keep text-sm font-bold leading-6 sm:mt-2 sm:text-base sm:leading-7">
            {labels[active]}
          </h4>
          <div className="mt-3 min-w-0 sm:mt-5">{children(active)}</div>
          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:mt-5 sm:pl-4 sm:text-sm sm:leading-7">
            {notes[active]}
          </p>
        </div>
        <AnimatedSceneControls
          labels={labels}
          active={active}
          playing={controls.playing}
          reducedMotion={controls.reducedMotion}
          setActive={controls.setActive}
          setPlaying={controls.setPlaying}
        />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {labels.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function FlowArrow({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex min-h-8 items-center justify-center text-center text-[9px] font-bold leading-4 sm:min-h-0 sm:flex-col ${active ? "text-primary" : "text-muted-foreground/45"}`}>
      <span className="hidden sm:block">{label}</span>
      <span aria-hidden className="text-base sm:hidden">↓</span>
      <span aria-hidden className="hidden text-base sm:block sm:-rotate-90">↓</span>
    </div>
  );
}

export function DomainAdaptationTraceViz() {
  const labels = [
    "요청이 현재 사실과 근거를 함께 요구합니다",
    "가중치만 읽은 모델은 이전 규정을 답합니다",
    "검색기가 현재 문서 revision을 context에 넣습니다",
    "같은 가중치가 현재 조항과 근거를 함께 반환합니다",
  ] as const;
  const notes = [
    `설명용 요청은 “${FIXTURE.request}”입니다. 현재 정보와 source revision이 모두 완료 조건입니다.`,
    "Model weight에는 학습 당시의 패턴만 있습니다. 최신 문서가 입력에 없으므로 이전 규정을 답하고 근거를 연결하지 못합니다.",
    `검색기는 ${FIXTURE.sourceRevision} 문서를 찾아 passage와 source revision을 요청 context에 붙입니다. Model weight는 바꾸지 않습니다.`,
    "출력은 현재 조항과 문서 revision을 함께 담습니다. 바뀐 상태는 모델이 아니라 요청 시점의 외부 context입니다.",
  ] as const;

  return (
    <Scene
      id="domain-adaptation-trace"
      eyebrow="One request"
      title="최신 정책 질문은 모델을 다시 학습하지 않고 외부 근거로 회복됩니다"
      description="한 요청이 가중치만 읽을 때와 versioned 문서를 함께 읽을 때 무엇이 달라지는지 따라갑니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid gap-1 sm:grid-cols-[minmax(0,.9fr)_2.5rem_minmax(0,1.15fr)_2.5rem_minmax(0,.95fr)] sm:items-stretch">
            <div className={`min-w-0 border-y px-3 py-4 sm:px-4 ${active === 0 ? "border-primary bg-primary/[0.07]" : "border-border"}`}>
              <span className="text-[9px] font-black text-primary">REQUEST</span>
              <strong className="mt-2 block break-keep text-sm leading-6">2026년 환불 규정</strong>
              <span className="mt-1 block break-keep text-[10px] leading-5 text-muted-foreground">현재 조항 · 문서 revision 필요</span>
            </div>

            <FlowArrow active={active >= 1} label="질문" />

            <div className="grid min-w-0 grid-cols-2 gap-2 border-y border-border px-3 py-3 sm:grid-cols-1 sm:px-4">
              <div className={`border px-3 py-3 ${active === 2 ? "border-primary bg-primary/[0.07]" : "border-border"}`}>
                <span className="text-[9px] font-black text-primary">EXTERNAL CONTEXT</span>
                <strong className="mt-1 block break-keep text-xs leading-5">
                  {active >= 2 ? FIXTURE.sourceRevision : "현재 문서 없음"}
                </strong>
                <span className="mt-1 block text-[9px] leading-4 text-muted-foreground">검색·교체·출처 연결</span>
              </div>
              <div className={`border px-3 py-3 ${active === 1 || active === 3 ? "border-primary bg-primary/[0.07]" : "border-border"}`}>
                <span className="text-[9px] font-black text-primary">MODEL WEIGHTS</span>
                <strong className="mt-1 block break-keep text-xs leading-5">학습 시점의 언어 패턴</strong>
                <span className="mt-1 block text-[9px] leading-4 text-muted-foreground">이번 요청에서는 변경 없음</span>
              </div>
            </div>

            <FlowArrow active={active >= 1} label="생성" />

            <div className={`min-w-0 border-y px-3 py-4 sm:px-4 ${active === 3 ? "border-primary bg-primary/[0.07]" : active === 1 ? "border-destructive/50 bg-destructive/[0.04]" : "border-border"}`}>
              <span className="text-[9px] font-black text-primary">OUTPUT</span>
              <strong className="mt-2 block break-keep text-sm leading-6">
                {active === 1 ? "이전 규정 · 근거 없음" : active >= 3 ? "현재 조항 · revision 포함" : "응답 대기"}
              </strong>
              <span className="mt-1 block break-keep text-[10px] leading-5 text-muted-foreground">
                {active === 1 ? "요청 계약 실패" : active >= 3 ? "요청 계약 통과" : "아직 판정하지 않음"}
              </span>
            </div>
          </div>
          <div className="mt-4 border-y border-border px-3 py-3 text-xs leading-6">
            <strong>바뀐 상태</strong>
            <span className="ml-2 text-muted-foreground">
              {active < 2 ? "없음" : `외부 context에 ${FIXTURE.sourceRevision} 추가 · model weight 유지`}
            </span>
          </div>
        </div>
      )}
    </Scene>
  );
}

const GAP_ROWS = [
  { failure: "오늘 바뀐 규정을 모름", state: "외부 문서·검색 index", intervention: "RAG", boundary: "갱신·삭제·출처가 요청 시점에 필요" },
  { failure: "특허 문장을 계속 잘못 끊음", state: "모델 가중치의 언어 패턴", intervention: "Continued pretraining", boundary: "반복되는 unlabeled corpus 패턴" },
  { failure: "사실은 맞지만 JSON을 어김", state: "응답 행동·target 예시", intervention: "SFT", boundary: "Input과 desired response가 있는 demonstration" },
  { failure: "품질은 맞지만 VRAM 초과", state: "실행 환경·update 범위", intervention: "Runtime·PEFT 검토", boundary: "학습 목표와 배포 제약을 분리" },
] as const;

export function GapOwnershipMap() {
  return (
    <VizFrame
      eyebrow="State boundary"
      title="같은 ‘도메인 성능 저하’도 잘못된 상태의 위치가 다릅니다"
      description="왼쪽 실패에서 시작해 상태 저장 위치와 그 상태를 바꾸는 개입을 같은 행으로 읽습니다."
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div role="img" aria-label="실패 사례를 외부 문서, 모델 가중치, 응답 행동, 실행 환경에 대응한 지도">
        <div className="hidden grid-cols-[1.05fr_1fr_.8fr_1.15fr] gap-3 border-y border-border px-4 py-3 text-[10px] font-black text-muted-foreground sm:grid">
          <span>관찰한 실패</span><span>잘못된 상태</span><span>개입</span><span>선택 경계</span>
        </div>
        <div className="divide-y divide-border border-b border-border">
          {GAP_ROWS.map((row) => (
            <div key={row.failure} className="grid gap-2 px-3 py-4 sm:grid-cols-[1.05fr_1fr_.8fr_1.15fr] sm:gap-3 sm:px-4">
              <strong className="break-keep text-sm leading-6">{row.failure}</strong>
              <span className="break-keep text-xs leading-5"><span className="mr-2 text-[9px] font-bold text-muted-foreground sm:hidden">상태</span>{row.state}</span>
              <span className="break-keep text-xs font-bold leading-5 text-primary"><span className="mr-2 text-[9px] text-muted-foreground sm:hidden">개입</span>{row.intervention}</span>
              <span className="break-keep text-xs leading-5 text-muted-foreground">{row.boundary}</span>
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}

function stageStatus(index: number, active: number) {
  const candidate = FIXTURE.candidates[index];
  if (active === 0) return { label: "후보", tone: "pending" } as const;
  if (!candidatePassesHardRequirements(candidate)) return { label: "근거 조건 탈락", tone: "fail" } as const;
  if (active === 1) return { label: "통과", tone: "pass" } as const;
  if (!candidatePassesQuality(candidate)) return { label: "품질 조건 탈락", tone: "fail" } as const;
  if (active === 2) return { label: "통과", tone: "pass" } as const;
  if (!candidateFitsBudget(candidate)) return { label: "예산 탈락", tone: "fail" } as const;
  return { label: candidate.id === "rag" ? "선택" : "통과", tone: candidate.id === "rag" ? "selected" : "pass" } as const;
}

export function InterventionFunnelViz() {
  const labels = [
    "서로 다른 상태를 바꾸는 다섯 후보를 만듭니다",
    "현재 문서 근거를 반환하지 못하는 후보를 먼저 뺍니다",
    "Target gain과 general regression 조건을 적용합니다",
    "예산을 넘는 조합을 빼고 가장 작은 통과안을 고릅니다",
  ] as const;
  const notes = [
    "후보 이름부터 고르지 않고 요청 계약을 만족할 수 있는 개입을 모두 적습니다. 수치는 절차를 설명하기 위한 가정입니다.",
    "Prompt only·continued pretraining·SFT는 이 사례의 현재 source revision을 직접 반환하지 못하므로 점수가 높아도 hard requirement에서 탈락합니다.",
    "RAG와 RAG+SFT는 설명용 target gain 3 이상, general change -1 이상을 통과합니다. 실제 임계값은 대상 환경에서 정해야 합니다.",
    "RAG+SFT는 설명용 cost 4로 예산 3을 넘습니다. RAG가 모든 조건을 만족하는 가장 작은 개입으로 남습니다.",
  ] as const;

  return (
    <Scene
      id="domain-intervention-funnel"
      eyebrow="Candidate funnel"
      title="후보를 만든 뒤 요구 조건·회귀·예산 순서로 줄입니다"
      description="점수가 큰 방법을 바로 고르지 않고, 먼저 지켜야 할 조건을 통과한 후보만 비교합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {FIXTURE.candidates.map((candidate, index) => {
              const status = stageStatus(index, active);
              const failed = status.tone === "fail";
              const selected = status.tone === "selected";
              return (
                <div key={candidate.id} className={`min-w-0 border px-2.5 py-2.5 last:col-span-2 sm:px-3 sm:py-3 sm:last:col-span-1 ${selected ? "border-primary bg-primary/[0.09]" : failed ? "border-border bg-muted/20 opacity-55" : "border-border bg-background"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <strong className="break-keep text-xs leading-5">{candidate.label}</strong>
                    <span className={`shrink-0 text-[8px] font-black ${selected ? "text-primary" : failed ? "text-muted-foreground" : "text-foreground"}`}>{status.label}</span>
                  </div>
                  <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-2 gap-y-0.5 text-[9px] leading-4 sm:mt-3 sm:gap-y-1">
                    <dt className="text-muted-foreground">현재 근거</dt><dd className="font-bold">{candidate.currentEvidence ? "가능" : "불가"}</dd>
                    <dt className="text-muted-foreground">Target</dt><dd className="font-mono font-bold">+{candidate.targetGain}</dd>
                    <dt className="text-muted-foreground">General</dt><dd className="font-mono font-bold">{candidate.generalChange}</dd>
                    <dt className="text-muted-foreground">Cost</dt><dd className="font-mono font-bold">{candidate.cost}</dd>
                  </dl>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-[10px] sm:leading-5">
            <div className={`bg-background px-1 py-2 sm:px-3 sm:py-3 ${active >= 1 ? "text-foreground" : "text-muted-foreground/45"}`}>Hard<br />현재 근거</div>
            <div className={`bg-background px-1 py-2 sm:px-3 sm:py-3 ${active >= 2 ? "text-foreground" : "text-muted-foreground/45"}`}>Quality<br />target·general</div>
            <div className={`px-1 py-2 sm:px-3 sm:py-3 ${active >= 3 ? "bg-primary/[0.08] font-bold text-primary" : "bg-background text-muted-foreground/45"}`}>Budget<br />cost ≤ 3 → RAG</div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function EvidenceMissingViz() {
  const labels = [
    "요청은 현재 문서 revision을 요구합니다",
    "검색 결과가 없거나 revision이 맞지 않습니다",
    "생성기는 현재 사실을 추측하지 않습니다",
    "결과는 근거 없음 상태와 재시도 단서를 남깁니다",
  ] as const;
  const notes = [
    "완료 조건은 자연스러운 문장이 아니라 현재 source revision과 연결된 답입니다.",
    "검색 결과 0건과 stale revision은 모두 evidence gate를 통과하지 못한 상태입니다.",
    "가중치에 남은 기억으로 보충하면 현재성을 증명할 수 없습니다. 그래서 답 생성을 멈추고 abstain합니다.",
    "사용자는 답을 받지 못하지만 시스템은 성공으로 위장하지 않습니다. evidence_status와 source revision을 남겨 다시 시도할 수 있습니다.",
  ] as const;

  return (
    <Scene
      id="domain-evidence-missing"
      eyebrow="Designed failure"
      title="현재 근거가 없으면 오래된 기억으로 빈칸을 채우지 않습니다"
      description="실패를 숨기지 않고 근거 없음 상태로 끝내야 최신성 요구를 지킬 수 있습니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={notes[active]} className="grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["요청 계약", "current revision + source"],
            ["검색 결과", active >= 1 ? "0건 또는 stale" : "대기"],
            ["생성 상태", active >= 2 ? "ABSTAIN" : "대기"],
            ["관측 결과", active >= 3 ? "evidence_status=missing" : "대기"],
          ].map(([title, detail], index) => (
            <div key={title} className={`min-w-0 px-3 py-4 sm:min-h-32 sm:px-4 ${index === active ? "bg-primary/[0.08]" : "bg-background"}`}>
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-2 block break-keep text-xs leading-5">{title}</strong>
              <span className="mt-2 block break-all font-mono text-[9px] leading-5 text-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>
      )}
    </Scene>
  );
}
