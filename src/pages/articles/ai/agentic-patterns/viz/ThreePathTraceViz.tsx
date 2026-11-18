import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { runExtensionBoundary, type BoundaryResult, type BoundaryTrace } from "../extensionBoundaryModel";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: agent-extension-boundaries #trace — 같은 요청의 세 fixture를 본문의 reference model로 직접 실행해
 * 각 경로가 다섯 단계 중 어디까지 trace를 남기고 effect 시작선의 어느 쪽에서 멈추는지 보인다.
 */
const BASE = { resource: " PROD/CUSTOMERS ", expectedRows: 1200, rollbackPassed: true };

const PATHS: readonly { input: string; result: BoundaryResult }[] = [
  { input: "APR-42 · 1,200행", result: runExtensionBoundary({ ...BASE, approval: "APR-42", observedRows: 1200 }) },
  { input: "승인 없음 · 1,200행", result: runExtensionBoundary({ ...BASE, approval: null, observedRows: 1200 }) },
  { input: "APR-42 · 1,199행", result: runExtensionBoundary({ ...BASE, approval: "APR-42", observedRows: 1199 }) },
];

const STAGES: readonly BoundaryTrace["stage"][] = ["hook", "skill", "guardrail", "executor", "verifier"];
const STAGE_LABEL: Record<BoundaryTrace["stage"], string> = {
  hook: "Hook",
  skill: "Skill",
  guardrail: "Guardrail",
  executor: "Executor",
  verifier: "Verifier",
};

function shortDecision(entry: BoundaryTrace | undefined): { text: string; color: string } {
  if (!entry) return { text: "없음", color: "#94a3b8" };
  const d = entry.decision;
  if (d.startsWith("normalize")) return { text: "정규화", color: "#475569" };
  if (d.startsWith("load")) return { text: "절차", color: "#475569" };
  if (d.startsWith("allow")) return { text: "허용", color: "#16a34a" };
  if (d.startsWith("deny")) return { text: "거부", color: "#dc2626" };
  if (d.startsWith("migration")) return { text: "fx-9001", color: "#2563eb" };
  if (d.startsWith("accept")) return { text: "합격", color: "#16a34a" };
  return { text: "불합격", color: "#dc2626" };
}

const SCENES = [
  { label: "승인 있음 · 1,200행", summary: `${PATHS[0].result.trace.length}단계 · ${PATHS[0].result.status}`, focus: 0, note: "다섯 단계가 모두 trace에 남습니다. Guardrail이 허용한 뒤 executor가 migration을 실행해 effect receipt fx-9001을 남기고, Verifier가 1,200행과 rollback 시험을 확인해 accepted로 끝납니다." },
  { label: "승인 없음", summary: `${PATHS[1].result.trace.length}단계 · ${PATHS[1].result.status}`, focus: 1, note: "Guardrail에서 거부되어 세 단계로 끝납니다. effect 시작선을 넘지 않았으므로 executor와 verifier가 trace에 생기지 않고 effectStarted는 false입니다." },
  { label: "승인 있음 · 1,199행", summary: `${PATHS[2].result.trace.length}단계 · ${PATHS[2].result.status}`, focus: 2, note: "Guardrail은 허용했고 executor도 실행했습니다. 실패는 effect 시작선 뒤 Verifier에서 나옵니다. action은 authorized였지만 결과는 rejected입니다." },
  { label: "세 경로 비교", summary: "선 앞에서 멈춤 vs 선 뒤에서 불합격", focus: -1, note: "denied는 effect 전에 멈췄고 rejected는 effect 뒤 결과가 기준을 통과하지 못했습니다. 그래서 rejected는 rollback·격리·사람 escalation 같은 복구 상태를 추가로 가져야 합니다." },
] as const;

const GRID = "grid grid-cols-[4.6rem_repeat(3,minmax(0,1fr))_3px_repeat(2,minmax(0,1fr))] items-stretch gap-x-1 sm:grid-cols-[8rem_repeat(3,minmax(0,1fr))_3px_repeat(2,minmax(0,1fr))] sm:gap-x-2";

export default function ThreePathTraceViz() {
  return (
    <SceneShell
      eyebrow="세 fixture의 trace"
      title="같은 요청이 어느 단계에서, effect 시작선의 어느 쪽에서 멈추는가"
      description="본문 9절의 reference model을 세 입력으로 실행한 trace입니다. 줄 하나가 한 입력이고, 세로 막대가 executor가 실제 변경을 시작하는 effect 시작선입니다."
      ariaLabel="accepted, denied, rejected 세 경로의 단계별 trace와 effect 시작선"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        return (
          <div className="grid min-w-0 gap-3">
            <div className="min-w-0 text-center text-[10px] text-muted-foreground sm:text-xs">
              {/* 좁은 폭에서도 단계 이름을 자르지 않도록 9px로 줄입니다. */}
              <div className={GRID}>
                <span className="text-left">입력</span>
                {STAGES.slice(0, 3).map((stage) => (
                  <span key={stage} className="min-w-0 break-all text-[9px] leading-3 sm:text-xs sm:leading-4">{STAGE_LABEL[stage]}</span>
                ))}
                <span aria-hidden />
                {STAGES.slice(3).map((stage) => (
                  <span key={stage} className="min-w-0 break-all text-[9px] leading-3 sm:text-xs sm:leading-4">{STAGE_LABEL[stage]}</span>
                ))}
              </div>
            </div>
            {PATHS.map((path, row) => {
              const dim = focus !== -1 && focus !== row;
              const cells = STAGES.map((stage) => shortDecision(path.result.trace.find((entry) => entry.stage === stage)));
              const renderCell = (cell: { text: string; color: string }, key: number) => (
                <span
                  key={key}
                  className={`grid min-h-[2.25rem] min-w-0 place-items-center rounded-md border px-0.5 text-center text-[11px] font-semibold leading-4 sm:text-xs ${cell.text === "없음" ? "border-dashed" : ""}`}
                  style={{ borderColor: cell.color, color: cell.color }}
                >
                  {cell.text}
                </span>
              );
              return (
                <div key={path.input} className={`${GRID} transition-opacity duration-300 motion-reduce:transition-none ${dim ? "opacity-30" : "opacity-100"}`}>
                  <span className="grid min-w-0 content-center text-[11px] leading-4 sm:text-xs">
                    <span className="font-semibold">{path.input}</span>
                    <span className="font-mono text-muted-foreground">{path.result.status}</span>
                  </span>
                  {cells.slice(0, 3).map((cell, index) => renderCell(cell, index))}
                  <span className="rounded-sm bg-[#2563eb]" aria-hidden />
                  {cells.slice(3).map((cell, index) => renderCell(cell, index + 3))}
                </div>
              );
            })}
            <p className="text-right text-[11px] text-muted-foreground sm:text-xs">
              <span className="mr-1 inline-block h-3 w-[3px] translate-y-0.5 rounded-sm bg-[#2563eb]" aria-hidden />
              effect 시작선 · 오른쪽은 실제 변경이 시작된 뒤
            </p>
            <StableSceneStack
              active={active}
              scenes={SCENES.map((scene) => (
                <p key={scene.label} className="break-all font-mono text-[11px] leading-5 text-muted-foreground sm:text-xs">
                  {scene.focus === -1
                    ? PATHS.map((path) => `${path.result.status}: effectStarted=${String(path.result.effectStarted)}`).join(" · ")
                    : PATHS[scene.focus].result.trace.map((entry) => `${entry.stage}: ${entry.decision}`).join(" → ")}
                </p>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
