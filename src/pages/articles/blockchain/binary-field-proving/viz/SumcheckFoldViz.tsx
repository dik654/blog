import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sumcheck·#second — g=ab의 꼭짓점 값은 AND 결과 [0,1,0,0].
 * g₁(0)=g(0,0)+g(0,1)=0, g₁(1)=g(1,0)+g(1,1)=1 → g₁(t)=t², 합 1.
 * r₁=u → 새 주장 g₁(u)=u+1=3 = g(u,0)+g(u,1) = u + 1 (g₂(0)=u, g₂(1)=1).
 * r₂=v → g₂(v)=1+v=5 = a(u,v)·b(u,v) = 13×6.
 * 세 칸은 좌표가 아니라 "아직 더해야 하는 점의 수" 4 → 2 → 1을 나란히 놓은 것입니다.
 */
const BLUE = "#2563eb";
const ORANGE = "#d97706";
const LINE = "#64748b";
const TEXT = "#334155";
const MUTED = "#cbd5e1";

const SQ = { x0: 34, x1: 104, y0: 132, y1: 58 };
const LINE_X = 196;
const POINT_X = 304;

const SCENES = [
  { label: "네 점의 합", summary: "S = 0+1+0+0 = 1", note: "꼭짓점 값은 AND 결과 [0,1,0,0]이고 처음 주장은 합 S=1입니다. 체에서 더하므로 1이 짝수 개면 합이 0이 될 수 있습니다." },
  { label: "첫 메시지", summary: "g₁(0)+g₁(1) = 0+1 = 1", note: "증명자가 y로 먼저 더한 g₁(t)=t²을 보냅니다. 왼쪽 세로줄 합이 g₁(0)=0, 오른쪽이 g₁(1)=1입니다. 검증자는 차수 2 이하와 합 0+1=1을 확인합니다." },
  { label: "첫 질문 r₁ = u", summary: "새 주장 g₁(u) = u+1 = 3", note: "메시지를 받은 뒤 r₁=u를 고르면 x=u인 줄의 두 점만 남습니다. 두 값 u와 1의 합은 u+1, 곧 3입니다. 이번 u는 설명용 고정값입니다." },
  { label: "둘째 질문 r₂ = v", summary: "g₂(v) = 1+v = 5", note: "둘째 메시지 g₂의 두 끝값 u와 1의 합은 앞 주장 u+1과 맞습니다. r₂=v를 넣으면 1+v=5이고, 같은 점의 a=13, b=6의 곱 13×6도 5입니다." },
] as const;

function Dot({ x, y, value, on }: { x: number; y: number; value: string; on: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} fill={on ? BLUE : "none"} fillOpacity={on ? 0.15 : 0} stroke={on ? BLUE : MUTED} strokeWidth={1} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="ui-monospace, monospace" fill={on ? TEXT : "#94a3b8"}>{value}</text>
    </g>
  );
}

function Arrow({ x1, x2, y, label, on }: { x1: number; x2: number; y: number; label: string; on: boolean }) {
  const color = on ? ORANGE : MUTED;
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 6} y2={y} stroke={color} strokeWidth={1.25} />
      <polygon points={`${x2},${y} ${x2 - 7},${y - 4} ${x2 - 7},${y + 4}`} fill={color} />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? ORANGE : "#94a3b8"}>{label}</text>
    </g>
  );
}

export default function SumcheckFoldViz() {
  return (
    <SceneShell
      eyebrow="합 확인 두 번"
      title="질문 하나마다 더해야 할 점이 절반으로 줄어 4 → 2 → 1이 됩니다"
      description="왼쪽은 네 꼭짓점, 가운데는 x=u인 두 점, 오른쪽은 (u,v) 한 점입니다. u, v는 0과 1 사이의 위치가 아닌 확장체 원소라 따로 그렸습니다. 수는 비트 표기입니다(2=u, 3=u+1, 5=1+v)."
      ariaLabel="sumcheck에서 네 점의 합이 두 점의 합, 다시 한 점의 값으로 줄어드는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const sqOn = active <= 1;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={SQ.x0} y={SQ.y1} width={SQ.x1 - SQ.x0} height={SQ.y0 - SQ.y1} fill="none" stroke={sqOn ? LINE : MUTED} strokeWidth={1} strokeDasharray="3 3" />
            {active === 1 && (
              <g>
                <rect x={SQ.x0 - 19} y={SQ.y1 - 19} width={38} height={SQ.y0 - SQ.y1 + 38} rx={19} fill="none" stroke={ORANGE} strokeWidth={1.25} />
                <rect x={SQ.x1 - 19} y={SQ.y1 - 19} width={38} height={SQ.y0 - SQ.y1 + 38} rx={19} fill="none" stroke={ORANGE} strokeWidth={1.25} />
                <text x={SQ.x0} y={SQ.y0 + 34} textAnchor="middle" fontSize={11} fontWeight={700} fill={ORANGE}>g₁(0)=0</text>
                <text x={SQ.x1} y={SQ.y0 + 34} textAnchor="middle" fontSize={11} fontWeight={700} fill={ORANGE}>g₁(1)=1</text>
              </g>
            )}
            <Dot x={SQ.x0} y={SQ.y0} value="0" on={sqOn} />
            <Dot x={SQ.x1} y={SQ.y0} value="1" on={sqOn} />
            <Dot x={SQ.x0} y={SQ.y1} value="0" on={sqOn} />
            <Dot x={SQ.x1} y={SQ.y1} value="0" on={sqOn} />
            <text x={(SQ.x0 + SQ.x1) / 2} y={22} textAnchor="middle" fontSize={11} fill={sqOn ? TEXT : "#94a3b8"}>네 점</text>
            <text x={SQ.x0} y={SQ.y0 + 54} textAnchor="middle" fontSize={10} fill={sqOn ? LINE : "#94a3b8"}>x=0</text>
            <text x={SQ.x1} y={SQ.y0 + 54} textAnchor="middle" fontSize={10} fill={sqOn ? LINE : "#94a3b8"}>x=1</text>
            {active === 0 && <text x={(SQ.x0 + SQ.x1) / 2} y={SQ.y0 + 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>합 1</text>}

            <Arrow x1={128} x2={174} y={95} label="r₁ = u" on={active === 2} />
            <line x1={LINE_X} y1={SQ.y1} x2={LINE_X} y2={SQ.y0} stroke={active === 2 ? LINE : MUTED} strokeWidth={1} strokeDasharray="3 3" />
            {/* 질문 r₁이 정해지기 전(장면 0·1)에는 x=u인 점의 값이 아직 없으므로 비워 둡니다. */}
            <Dot x={LINE_X} y={SQ.y1} value={active >= 2 ? "1" : ""} on={active === 2} />
            <Dot x={LINE_X} y={SQ.y0} value={active >= 2 ? "2" : ""} on={active === 2} />
            <text x={LINE_X} y={22} textAnchor="middle" fontSize={11} fill={active === 2 ? TEXT : "#94a3b8"}>x = u인 두 점</text>
            <text x={LINE_X + 18} y={SQ.y1 + 4} fontSize={10} fill={active === 2 ? LINE : "#94a3b8"}>(u,1)</text>
            <text x={LINE_X + 18} y={SQ.y0 + 4} fontSize={10} fill={active === 2 ? LINE : "#94a3b8"}>(u,0)</text>
            {active === 2 && <text x={LINE_X} y={SQ.y0 + 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>합 u+1 = 3</text>}

            <Arrow x1={238} x2={284} y={95} label="r₂ = v" on={active === 3} />
            <Dot x={POINT_X} y={95} value={active >= 3 ? "5" : ""} on={active === 3} />
            <text x={POINT_X} y={22} textAnchor="middle" fontSize={11} fill={active === 3 ? TEXT : "#94a3b8"}>한 점 (u,v)</text>
            {active === 3 && (
              <g>
                <text x={POINT_X} y={SQ.y0 + 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>값 1+v = 5</text>
                <text x={POINT_X} y={136} textAnchor="middle" fontSize={11} fill={LINE}>13 × 6 = 5</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
