import SceneShell from "./SceneShell";
import SvgArrow from "./SvgArrow";

/**
 * 본문 대응: #limits 셋째 문단, #mechanism 둘째 문단 끝 — 허가·자금조달·토질 조사 결과에 따른
 * 계약 진행 조건과 불성립 시 계약금 처리. 결과별 금액은 본문에 없어 적지 않습니다.
 */
const W = 340;
const H = 196;
const ACCENT = "#2563eb";
const DIM = "#94a3b8";
const TEXT = "#64748b";
const FAIL = "#dc2626";

type Status = "wait" | "ok" | "fail";

const SOURCES = [
  { name: "허가", x: 8 },
  { name: "자금조달", x: 120 },
  { name: "토질 조사", x: 232 },
] as const;
const BOX_W = 100;

const SCENES: readonly { label: string; summary: string; note: string; status: readonly [Status, Status, Status] }[] = [
  { label: "계약에 먼저 적을 것", summary: "조건 3개, 결과는 아직", note: "토지와 취득에 남은 15억 원을 계산한 뒤, 세 결과에 따른 계약 진행 조건과 불성립 시 계약금 처리를 정합니다. 결과를 보기 전에 정해 두는 내용입니다.", status: ["wait", "wait", "wait"] },
  { label: "조건이 맞으면", summary: "계약 진행", note: "세 결과가 정한 조건에 맞으면 계약을 진행합니다. 잔여값이 커도 토지 권리와 허가, 자금 일정이 맞아야 실행 가능한 계획이 됩니다.", status: ["ok", "ok", "ok"] },
  { label: "하나가 실패하면", summary: "해제 · 계약금 처리", note: "예로 금융 조달에 실패했다고 둡니다. 미리 정한 대로 계약을 해제하고 어느 돈을 돌려받을지가 정해집니다.", status: ["ok", "fail", "ok"] },
];

const color = (status: Status) => (status === "ok" ? ACCENT : status === "fail" ? FAIL : DIM);

function Stage({ step }: { step: number }) {
  const scene = SCENES[step];
  const allOk = scene.status.every((item) => item === "ok");
  const failed = scene.status.includes("fail");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {SOURCES.map((source, index) => {
        const status = scene.status[index];
        const tint = color(status);
        const cx = source.x + BOX_W / 2;
        return (
          <g key={source.name}>
            <rect x={source.x} y={6} width={BOX_W} height={40} rx={8} fill="none" stroke={tint} strokeWidth={status === "wait" ? 1 : 1.25} strokeDasharray={status === "wait" ? "3 3" : undefined} />
            <text x={cx} y={31} textAnchor="middle" fontSize={13} fontWeight={700} fill={status === "wait" ? TEXT : tint}>
              {status === "ok" ? "✓ " : status === "fail" ? "✕ " : ""}{source.name}
            </text>
            <SvgArrow x1={cx} y1={46} x2={120 + index * 50} y2={80} color={tint} dashed={status !== "ok"} />
          </g>
        );
      })}
      <rect x={90} y={80} width={160} height={36} rx={8} fill="none" stroke={failed ? FAIL : allOk ? ACCENT : TEXT} strokeWidth={1.25} />
      <text x={170} y={103} textAnchor="middle" fontSize={13} fontWeight={700} fill={failed ? FAIL : allOk ? ACCENT : TEXT}>계약 진행 조건</text>

      <SvgArrow x1={120} y1={116} x2={84} y2={146} color={allOk ? ACCENT : DIM} dashed={!allOk} />
      <SvgArrow x1={220} y1={116} x2={256} y2={146} color={failed ? FAIL : DIM} dashed={!failed} />
      <rect x={8} y={146} width={150} height={42} rx={8} fill="none" stroke={allOk ? ACCENT : DIM} strokeWidth={allOk ? 1.25 : 1} strokeDasharray={allOk ? undefined : "3 3"} />
      <text x={83} y={172} textAnchor="middle" fontSize={13} fontWeight={700} fill={allOk ? ACCENT : TEXT}>계약 진행</text>
      <rect x={182} y={146} width={150} height={42} rx={8} fill="none" stroke={failed ? FAIL : DIM} strokeWidth={failed ? 1.25 : 1} strokeDasharray={failed ? undefined : "3 3"} />
      <text x={257} y={172} textAnchor="middle" fontSize={13} fontWeight={700} fill={failed ? FAIL : TEXT}>해제 · 계약금 처리</text>
    </svg>
  );
}

export default function ContractBranchViz() {
  return (
    <SceneShell
      eyebrow="계약 갈림길"
      title="토지 계약은 세 결과가 어느 쪽으로 나와도 다음 행동이 정해져 있어야 합니다"
      description="위 세 칸은 7절에서 계약 조건으로 삼은 결과이고, 가운데 조건을 거쳐 아래 두 길 중 하나로 갑니다. 사업은 (가정)이며 결과별 금액은 본문에 없어 적지 않았습니다."
      ariaLabel="허가, 자금조달, 토질 조사 결과에 따라 계약을 진행하거나 해제하고 계약금을 처리하는 갈림길"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
