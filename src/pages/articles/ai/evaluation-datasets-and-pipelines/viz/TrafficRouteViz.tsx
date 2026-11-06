import SceneShell from "./SceneShell";

/**
 * 본문 대응: #deployment — shadow 는 트래픽 10% 에 candidate 를 붙이되 응답을 버리고 지표만 기록,
 * A/B 는 50/50 으로 나눠(AlgorithmBlock split=0.5) 사용자가 candidate 응답을 받는다.
 * 재는 것의 차이는 ProgressiveDetail "Shadow 만으로 A/B 를 건너뛸 수 있나요?" 에서 가져왔다.
 */
const SCENES = [
  { label: "지금", summary: "요청 100% → 기존 model", note: "candidate 는 아직 어느 요청도 받지 않습니다. 사용자는 기존 model 의 응답만 받습니다." },
  { label: "Shadow", summary: "사용자 경험은 그대로", note: "트래픽 10% 에 candidate 를 붙이지만 사용자에게 가는 응답은 기존 model 의 것입니다. 에러율, latency, 극단적 출력은 볼 수 있어도 사용자 반응은 잴 수 없습니다. 문제가 없으면 10% 를 점점 늘립니다." },
  { label: "A/B", summary: "무작위 50/50, 사용자가 받음", note: "사용자가 candidate 응답을 실제로 받으므로 만족도나 클릭 같은 반응이 나옵니다. 두 그룹의 목표 지표 차이가 우연보다 큰지 유의성 검정으로 판정하며, 사용자 경험에 직접 영향을 줍니다." },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#94a3b8";

function Arrow({ x1, y1, x2, y2, color = BLUE, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6;
  const left = `${x2 - size * Math.cos(angle - 0.45)},${y2 - size * Math.sin(angle - 0.45)}`;
  const right = `${x2 - size * Math.cos(angle + 0.45)},${y2 - size * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <polygon points={`${x2},${y2} ${left} ${right}`} fill={color} />
    </g>
  );
}

function Box({ x, y, w, line1, line2, color = GRAY, dim = false }: { x: number; y: number; w: number; line1: string; line2?: string; color?: string; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.4 : 1}>
      <rect x={x} y={y} width={w} height={40} rx={6} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1} strokeDasharray={dim ? "3 3" : undefined} />
      <text x={x + w / 2} y={line2 ? y + 17 : y + 24} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">{line1}</text>
      {line2 && <text x={x + w / 2} y={y + 31} textAnchor="middle" fontSize={10} fill="#64748b">{line2}</text>}
    </g>
  );
}

export default function TrafficRouteViz() {
  return (
    <SceneShell
      eyebrow="요청과 응답의 경로"
      title="누가 candidate 의 응답을 받는지가 shadow 와 A/B 를 가릅니다"
      description="candidate 는 새로 시험하는 model, control 은 비교 대상으로 남겨 둔 기존 model 입니다. 화살표는 요청과 응답이 가는 길이고, 빨간 ✕는 사용자에게 닿지 않는 응답입니다."
      ariaLabel="기존 운영, shadow, A/B 에서 요청과 응답이 흐르는 경로"
      scenes={SCENES}
      render={(active) => {
        const shadow = active === 1;
        const ab = active === 2;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={8} y={72} w={62} line1="실 트래픽" />
            <Box x={122} y={18} w={92} line1="기존 model" line2={ab ? "control" : undefined} />
            <Box x={122} y={138} w={92} line1="candidate" line2="새 model" color={BLUE} dim={active === 0} />
            <Box x={286} y={18} w={66} line1="사용자" />
            <Box x={286} y={138} w={66} line1={ab ? "목표 지표" : "지표 기록"} line2={ab ? "유의성 검정" : shadow ? "candidate" : undefined} dim={active === 0} />

            <Arrow x1={70} y1={84} x2={122} y2={40} />
            <text x={88} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>{ab ? "50%" : "100%"}</text>
            <Arrow x1={214} y1={38} x2={286} y2={38} />
            {active > 0 && (
              <>
                <Arrow x1={70} y1={100} x2={122} y2={156} />
                <text x={88} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>{ab ? "50%" : "그중 10%"}</text>
              </>
            )}
            {shadow && (
              <>
                <line x1={214} y1={148} x2={286} y2={58} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
                <rect x={228} y={92} width={44} height={22} rx={4} fill={RED} fillOpacity={0.14} stroke={RED} strokeWidth={1} />
                <text x={250} y={107} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={RED}>✕ 버림</text>
                <Arrow x1={214} y1={164} x2={286} y2={164} />
              </>
            )}
            {ab && (
              <>
                <Arrow x1={214} y1={148} x2={286} y2={58} />
                <Arrow x1={319} y1={58} x2={319} y2={138} />
                <text x={313} y={102} textAnchor="end" fontSize={10.5} fill="#64748b">반응</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
