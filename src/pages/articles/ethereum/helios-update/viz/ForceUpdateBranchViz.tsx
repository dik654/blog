import UpdateSceneShell from "./UpdateSceneShell";

/**
 * 본문 대응: #force-update — finalized header가 sync-committee period 하나보다 오래 멈췄고
 * best_valid_update가 남아 있으면 force_update가 quorum 검사 없이 그 후보를 적용할 수 있다.
 * 후보의 finalized header가 더 새롭지 않으면 attested header를 finalized 자리에 쓴다.
 * 시간축은 길이를 재지 않는 개념도이며 slot 수를 적지 않는다.
 */

type Path = "wait" | "none" | "newer" | "attested";

interface Scene {
  label: string;
  summary: string;
  note: string;
  stalledPast: boolean;
  hasCandidate: boolean | null;
  path: Path;
}

const SCENES: readonly Scene[] = [
  {
    label: "Period 하나 이내",
    summary: "force update 조건 아님",
    note: "Finalized header가 멈춘 시간이 sync-committee period 하나를 넘지 않았습니다. 이때는 force update 조건이 아니므로 두 번째 조건도 따지지 않습니다.",
    stalledPast: false,
    hasCandidate: null,
    path: "wait",
  },
  {
    label: "후보가 없으면",
    summary: "적용할 대상 없음",
    note: "Period 하나보다 오래 멈췄어도 best_valid_update가 비어 있으면 force update로 적용할 후보가 없습니다.",
    stalledPast: true,
    hasCandidate: false,
    path: "none",
  },
  {
    label: "후보 finality가 더 새로움",
    summary: "quorum 검사 없이 적용",
    note: "Period 하나보다 오래 멈췄고 best_valid_update가 남아 있으면 force_update가 그 후보를 quorum 검사 없이 적용할 수 있습니다. 후보의 finalized header가 Store보다 새롭다면 그 header가 finalized 자리에 들어갑니다.",
    stalledPast: true,
    hasCandidate: true,
    path: "newer",
  },
  {
    label: "더 새롭지 않으면",
    summary: "attested header를 finalized 자리에",
    note: "후보의 finalized header가 Store보다 새롭지 않다면, 후보의 attested header를 finalized 자리에도 사용합니다. 이 경로는 liveness escape hatch이며 normal 2/3 finality와 같은 보장이 아닙니다.",
    stalledPast: true,
    hasCandidate: true,
    path: "attested",
  },
];

function Box({
  title,
  detail,
  state,
}: {
  title: string;
  detail: string;
  state: "idle" | "on" | "warn" | "off";
}) {
  const border =
    state === "on" ? "border-primary bg-primary/[0.06]" : state === "warn" ? "border-amber-600 bg-amber-500/[0.07]" : "border-border bg-background";
  return (
    <div className={`min-w-0 rounded-md border px-2.5 py-2 ${border} ${state === "off" ? "opacity-45" : ""}`}>
      <p className="break-keep text-xs font-bold leading-5">{title}</p>
      <p className="mt-0.5 break-keep text-[11px] leading-4 text-muted-foreground">{detail}</p>
    </div>
  );
}

function Timeline({ past }: { past: boolean }) {
  return (
    <svg viewBox="0 0 340 64" className="mx-auto h-auto w-full max-w-[420px]" role="presentation">
      <line x1={14} x2={326} y1={30} y2={30} stroke="#cbd5e1" strokeWidth={1} />
      <circle cx={30} cy={30} r={5} fill="#64748b" />
      <text x={14} y={54} textAnchor="start" fontSize={12} fill="#475569">finalized 멈춤</text>
      <line x1={210} x2={210} y1={14} y2={46} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
      <text x={210} y={10} textAnchor="middle" fontSize={12} fill="#b45309">period 하나 경과</text>
      <rect x={30} y={27} width={past ? 260 : 120} height={6} rx={3} fill={past ? "#d97706" : "#2563eb"} />
      <circle cx={past ? 290 : 150} cy={30} r={6} fill="#ffffff" stroke={past ? "#d97706" : "#2563eb"} strokeWidth={1.25} />
      <text x={past ? 290 : 150} y={54} textAnchor="middle" fontSize={12} fontWeight={700} fill={past ? "#b45309" : "#2563eb"}>
        지금
      </text>
    </svg>
  );
}

function Diagram({ scene }: { scene: Scene }) {
  const forceOn = scene.path === "newer" || scene.path === "attested";
  return (
    <div className="min-w-0" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <p className="mb-1 text-[11px] text-muted-foreground">시간축은 길이를 재지 않는 개념도입니다.</p>
      <Timeline past={scene.stalledPast} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Box
          title="① period 하나보다 오래 멈춤?"
          detail={scene.stalledPast ? "예 → 다음 조건" : "아니오 → force update 아님"}
          state={scene.stalledPast ? "warn" : "on"}
        />
        <Box
          title="② best_valid_update 남아 있음?"
          detail={scene.hasCandidate === null ? "판단하지 않음" : scene.hasCandidate ? "예 → force_update 가능" : "아니오 → 적용할 후보 없음"}
          state={scene.hasCandidate === null ? "off" : scene.hasCandidate ? "warn" : "on"}
        />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Box
          title="후보 finalized가 더 새로움"
          detail="그 finalized header를 적용 · quorum 검사 없음"
          state={scene.path === "newer" ? "warn" : forceOn ? "idle" : "off"}
        />
        <Box
          title="더 새롭지 않음"
          detail="attested header를 finalized 자리에 · quorum 검사 없음"
          state={scene.path === "attested" ? "warn" : forceOn ? "idle" : "off"}
        />
      </div>
      <p className="mt-3 break-keep text-[11px] font-bold" style={{ color: forceOn ? "#b45309" : "#475569" }}>
        {forceOn ? "결과: liveness escape hatch · normal 2/3 finality와 다른 보장" : scene.path === "wait" ? "결과: force update 조건 아님" : "결과: force update 없음"}
      </p>
    </div>
  );
}

export default function ForceUpdateBranchViz() {
  return (
    <UpdateSceneShell
      eyebrow="Force update 경계"
      title="Finality가 오래 멈췄을 때만 열리는 예외 경로"
      description="두 조건이 모두 참일 때 force_update가 후보를 quorum 검사 없이 적용할 수 있습니다. 주황색은 정상 2/3 경로보다 약한 보장을 뜻합니다."
      ariaLabel="Finalized header 정체 시간과 best_valid_update 유무에 따라 force update가 열리는 분기"
      scenes={SCENES}
      render={(active) => <Diagram scene={SCENES[active]} />}
    />
  );
}
