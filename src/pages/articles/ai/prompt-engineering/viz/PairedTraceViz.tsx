import { Fragment } from "react";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #anti-patterns — trace 기록 항목, 한 요소만 바꾼 paired comparison,
 * 새 model의 regression suite·canary, guardrail 초과 시 rollback.
 * case 결과와 어느 guardrail이 넘었는지는 가정이다. 글에 없는 traffic 비율과 guardrail 값은 그리지 않는다.
 */
const FIELDS = ["prompt hash", "model snapshot", "system message", "chat template", "tool schema", "temperature · top-p · max token"] as const;
const GUARDS = ["quality", "constraint violation", "p95 latency", "token cost"] as const;

const SCENES = [
  { label: "한 요소만 바꾼 비교", summary: "prompt hash만 다름", note: "같은 eval case를 양쪽에 돌려 짝지어 봅니다. 나머지 항목이 같아 차이를 prompt 변경과 연결해 읽을 수 있습니다(결과는 가정)." },
  { label: "hash가 같아도", summary: "model snapshot이 다름", note: "prompt hash만 기록했다면 둘은 같아 보입니다. model snapshot·template·tool schema가 바뀌면 같은 system이 아닙니다." },
  { label: "두 요소를 함께 바꾸면", summary: "원인을 나눌 수 없음", note: "결과가 달라져도 prompt 때문인지 model 때문인지 이 비교만으로는 나눌 수 없습니다." },
  { label: "새 model을 옮길 때", summary: "suite → canary → traffic 증가", note: "같은 regression suite와 production canary(일부 traffic에 먼저 적용)를 통과한 뒤 traffic을 늘립니다. 네 항목은 모두 안 넘었다고 가정했습니다." },
  { label: "하나라도 넘으면", summary: "rollback", note: "네 항목 중 하나라도 guardrail(되돌리는 기준선)을 넘으면 rollback(이전 구성으로 복귀)합니다. 여기서는 p95 latency로 가정했습니다." },
] as const;

const CASE_A = ["통과", "통과", "실패", "통과"] as const;
const CASE_B = ["통과", "통과", "통과", "통과"] as const;

function TraceTable({ diff }: { diff: readonly number[] }) {
  return (
    <div className="min-w-0">
      <div className="divide-y divide-border border-y border-border">
        {FIELDS.map((field, index) => {
          const changed = diff.includes(index);
          return (
            <div key={field} className="grid grid-cols-[minmax(0,1fr)_3.25rem] items-center gap-2 py-0.5 text-xs leading-5 sm:text-sm">
              <span className={`min-w-0 break-keep ${changed ? "font-semibold" : "text-muted-foreground"}`}>{field}</span>
              <strong className="text-right" style={{ color: changed ? "#d97706" : "#94a3b8" }}>{changed ? "다름" : "같음"}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaseRow({ name, values }: { name: string; values: readonly string[] }) {
  return (
    <div className="grid grid-cols-[3.75rem_repeat(4,minmax(0,1fr))] items-center gap-1 text-[11px] leading-5 sm:text-xs">
      <strong>{name}</strong>
      {values.map((value, index) => (
        <span key={index} className={`rounded-sm text-center ${value === "실패" ? "border border-[#dc2626] font-bold" : Number(value) ? "text-muted-foreground" : "border border-border text-muted-foreground"}`}>{value}</span>
      ))}
    </div>
  );
}

function Paired() {
  return (
    <div className="min-w-0">
      <TraceTable diff={[0]} />
      <div className="mt-1 space-y-0.5">
        <CaseRow name="eval case" values={["1", "2", "3", "4"]} />
        <CaseRow name="기존" values={CASE_A} />
        <CaseRow name="변경" values={CASE_B} />
      </div>
    </div>
  );
}

function Rollout({ breach }: { breach: boolean }) {
  const steps = ["Regression suite", "Canary", breach ? "Rollback" : "Traffic 증가"];
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
        {steps.map((step, index) => {
          const last = index === 2;
          const color = last ? (breach ? "#dc2626" : "#16a34a") : undefined;
          return (
            <Fragment key={index}>
              {index > 0 && <span aria-hidden className="text-muted-foreground">→</span>}
              <div className="flex min-h-[3.25rem] items-center justify-center rounded-lg border border-border px-1.5 py-2 text-center text-xs font-semibold leading-4 sm:text-sm" style={{ borderColor: color, color }}>
                {step}
              </div>
            </Fragment>
          );
        })}
      </div>
      <p className="mt-3 text-xs font-semibold leading-5">guardrail 네 개</p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {GUARDS.map((guard) => {
          const over = breach && guard === "p95 latency";
          return (
            <div key={guard} className="rounded-lg border px-2 py-1.5 text-xs leading-4" style={{ borderColor: over ? "#dc2626" : undefined }}>
              <span className="block break-keep">{guard}</span>
              <strong className="mt-0.5 block" style={{ color: over ? "#dc2626" : "#16a34a" }}>{over ? "넘음" : "안 넘음"}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PairedTraceViz() {
  return (
    <SceneShell
      eyebrow="비교와 배포"
      title="무엇이 같고 무엇이 다른지 적어 두어야 비교가 됩니다"
      description="trace는 한 번의 실행 기록입니다. 표에는 두 구성의 trace를 항목별로 비교한 결과만 적었습니다."
      ariaLabel="trace 항목을 비교하고 canary와 rollback으로 이어지는 다섯 장면"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <Paired key="paired" />,
            <TraceTable key="hash" diff={[1]} />,
            <TraceTable key="two" diff={[0, 1]} />,
            <Rollout key="ok" breach={false} />,
            <Rollout key="over" breach />,
          ]}
        />
      )}
    />
  );
}
