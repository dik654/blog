import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scoreboard-barrier — 장부는 하나이고, long/short 이름은 접근이 지난 경로로 갈린다.
 * register 이름 r1·r2 는 그림을 위한 가정이다.
 */
const SCENES = [
  { label: "L1TEX 경로", summary: "global load → long", note: "Issue 된 load 의 결과 register 에 미완료 표시가 남습니다. 이 접근은 L1TEX unit 을 거치므로, 그 결과를 기다리는 표본은 long scoreboard 로 분류됩니다." },
  { label: "MIO 경로", summary: "shared load → short", note: "같은 장부에 표시가 하나 더 붙습니다. 장부는 그대로이고 경로만 다릅니다. MIO queue 를 거치는 접근의 결과를 기다리는 표본은 short scoreboard 로 분류됩니다." },
  { label: "결과 도착", summary: "표시 지움", note: "결과가 오면 표시를 지웁니다. Long 과 short 라는 이름은 두 경로의 전형적인 latency 에서 왔지만, 측정된 시간이 일정 기준을 넘는지로 분류하는 것은 아닙니다." },
] as const;

const LONG = "#d97706";
const SHORT = "#0284c7";
const IDLE = "#94a3b8";

function Ledger({ x, name, status, marked }: { x: number; name: string; status: string; marked: boolean }) {
  return (
    <g>
      <rect x={x} y={30} width={150} height={28} rx={4} fill={marked ? "#2563eb" : "none"} fillOpacity={0.12} stroke={marked ? "#2563eb" : IDLE} strokeWidth={1} strokeDasharray={marked ? undefined : "3 3"} />
      <text x={x + 8} y={49} fontSize={12} fontWeight={700} fill="currentColor">{name}</text>
      <text x={x + 142} y={49} textAnchor="end" fontSize={12} fill="currentColor">{status}</text>
    </g>
  );
}

function Route({ y, color, on, unit, lines, stall }: { y: number; color: string; on: boolean; unit: string; lines: readonly string[]; stall: readonly string[] }) {
  const stroke = on ? color : IDLE;
  return (
    <g opacity={on ? 1 : 0.5}>
      <rect x={104} y={y} width={144} height={66} rx={6} fill={on ? color : "none"} fillOpacity={0.12} stroke={stroke} strokeWidth={1} />
      <text x={176} y={y + 19} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{unit}</text>
      {lines.map((line, index) => (
        <text key={line} x={176} y={y + 37 + index * 15} textAnchor="middle" fontSize={11} fill="currentColor">{line}</text>
      ))}
      <line x1={248} x2={264} y1={y + 33} y2={y + 33} stroke={stroke} strokeWidth={1} />
      <path d={`M264,${y + 29} L270,${y + 33} L264,${y + 37} Z`} fill={stroke} />
      <rect x={272} y={y + 11} width={84} height={44} rx={6} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray="3 3" />
      {stall.map((line, index) => (
        <text key={line} x={314} y={y + 29 + index * 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{line}</text>
      ))}
    </g>
  );
}

export default function ScoreboardPathViz() {
  return (
    <SceneShell
      eyebrow="Long 과 short 의 경계"
      title="장부는 하나이고, 이름은 결과가 돌아오는 경로로 갈립니다"
      description="Scoreboard 는 결과가 아직 오지 않은 register 에 표시를 남기는 장부입니다. 아래 두 줄이 접근이 지나는 두 경로이고, r1·r2 는 그림을 위한 가정입니다."
      ariaLabel="scoreboard 장부 하나와 L1TEX, MIO 두 경로에 따른 long, short 분류"
      scenes={SCENES}
      render={(active) => {
        const issuing = active === 0 ? "global" : active === 1 ? "shared" : null;
        return (
          <svg viewBox="0 0 360 246" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={0} y={18} fontSize={12} fontWeight={700} fill="currentColor">Scoreboard 장부 (하나)</text>
            <Ledger x={0} name="r1" status={active === 2 ? "표시 지움" : "미완료"} marked={active < 2} />
            <Ledger x={206} name="r2" status={active === 0 ? "표시 없음" : active === 1 ? "미완료" : "표시 지움"} marked={active === 1} />

            <rect x={0} y={132} width={84} height={46} rx={6} fill="none" stroke={issuing ? "#2563eb" : IDLE} strokeWidth={1} />
            <text x={42} y={151} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{issuing ? `${issuing}` : "결과"}</text>
            <text x={42} y={167} textAnchor="middle" fontSize={12} fill="currentColor">{issuing ? "load issue" : "도착"}</text>

            <path d="M84,155 L94,155 L94,109 L104,109" fill="none" stroke={active === 0 ? LONG : IDLE} strokeWidth={1} />
            <path d="M84,155 L94,155 L94,201 L104,201" fill="none" stroke={active === 1 ? SHORT : IDLE} strokeWidth={1} />

            <Route y={76} color={LONG} on={active === 0} unit="L1TEX unit" lines={["global · local", "surface · texture"]} stall={["long", "scoreboard"]} />
            <Route y={168} color={SHORT} on={active === 1} unit="MIO queue" lines={["shared · 특수 함수", "dynamic branch"]} stall={["short", "scoreboard"]} />
          </svg>
        );
      }}
    />
  );
}
