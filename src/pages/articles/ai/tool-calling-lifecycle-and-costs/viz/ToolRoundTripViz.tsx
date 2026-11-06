import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 모델은 제안하고, 실행 담당자가 확인해 외부 기능을 실행한 뒤 결과를 원래 요청에 연결한다.
 * 세로선 셋이 세 자리이고, 화살표 하나가 한 번의 전달이다. 칸 사이 거리는 시간을 뜻하지 않는다.
 */
const SCENES = [
  { label: "가능한 조회를 알립니다", summary: "1. 이름과 사용법", note: "모델에게 어떤 조회가 있고 어떻게 쓰는지를 먼저 알려 줍니다. 아직 아무것도 실행되지 않았습니다." },
  { label: "모델이 제안합니다", summary: "2. 조회와 입력값 제안", note: "모델은 어느 조회를 어떤 값으로 부를지 제안할 뿐입니다. 이 화살표에서 날씨를 관측한 자리는 아직 없습니다." },
  { label: "실행 담당자가 실행합니다", summary: "3. 확인 뒤 실제 실행", note: "실행 담당자가 요청을 확인해 외부 기능을 실행하고 결과를 받습니다. 실제 일은 이 오른쪽 자리에서 일어납니다." },
  { label: "결과를 요청에 연결합니다", summary: "4. 원래 요청에 연결", note: "받은 결과를 원래 요청에 연결해 모델에게 돌려줍니다. 어느 요청의 결과인지가 함께 가야 합니다." },
  { label: "다음을 고릅니다", summary: "부족 → 2로 · 충분 → 답", note: "돌아온 정보가 부족하면 다음 조회를 고릅니다. 충분하면 답합니다. 처음 질문에 이미 답할 수 있으면 조회 없이 답할 수도 있습니다." },
] as const;

const LANES = [
  { x: 84, name: "모델", role: "제안" },
  { x: 212, name: "실행 담당자", role: "확인·실행" },
  { x: 322, name: "외부 기능", role: "실제 조회" },
] as const;

const ACTIVE = "#2563eb";
const DONE = "#64748b";

function Message({ x1, x2, y, label, labelX, anchor = "middle", step, active }: { x1: number; x2: number; y: number; label: string; labelX: number; anchor?: "middle" | "start"; step: number; active: number }) {
  if (active < step) return null;
  const color = active === step ? ACTIVE : DONE;
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2 - dir * 5} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <polygon points={`${x2},${y} ${x2 - dir * 6},${y - 3.5} ${x2 - dir * 6},${y + 3.5}`} fill={color} />
      <text x={labelX} y={y - 6} textAnchor={anchor} fontSize={11} fontWeight={active === step ? 700 : 400} fill={color}>{label}</text>
    </g>
  );
}

export default function ToolRoundTripViz() {
  return (
    <SceneShell
      eyebrow="왕복 한 번"
      title="모델은 제안하고, 실행은 다른 자리에서 일어납니다"
      description="세로선 하나가 한 자리이고 화살표가 한 번의 전달입니다. 간격은 시간을 뜻하지 않습니다."
      ariaLabel="모델, 실행 담당자, 외부 기능 사이의 왕복 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 244" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {LANES.map((lane) => (
            <g key={lane.name}>
              <text x={lane.x} y={13} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">{lane.name}</text>
              <text x={lane.x} y={28} textAnchor="middle" fontSize={11} fill="#64748b">{lane.role}</text>
              <line x1={lane.x} x2={lane.x} y1={35} y2={236} stroke="#94a3b8" strokeWidth={1} />
            </g>
          ))}
          <Message x1={14} x2={84} y={62} label="조회 이름·사용법" labelX={92} anchor="start" step={0} active={active} />
          <Message x1={84} x2={212} y={94} label="이름·입력값 제안" labelX={148} step={1} active={active} />
          <Message x1={212} x2={322} y={126} label="확인 뒤 실행" labelX={267} step={2} active={active} />
          <Message x1={322} x2={212} y={154} label="실행 결과" labelX={267} step={2} active={active} />
          <Message x1={212} x2={84} y={186} label="요청에 연결한 결과" labelX={148} step={3} active={active} />
          {active === 4 && (
            <g>
              <path d="M84 224 H42 V94 H78" fill="none" stroke={ACTIVE} strokeWidth={1.25} strokeDasharray="4 3" />
              <polygon points="84,94 78,90.5 78,97.5" fill={ACTIVE} />
              <text x={92} y={212} fontSize={11} fontWeight={700} fill={ACTIVE}>충분하면 → 답</text>
              <text x={92} y={230} fontSize={11} fontWeight={700} fill={ACTIVE}>부족하면 → 다음 조회</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
