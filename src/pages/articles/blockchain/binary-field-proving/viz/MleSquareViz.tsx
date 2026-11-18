import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multilinear — 주소 (x,y)의 네 꼭짓점에 기록을 놓고 x로 한 번, y로 한 번 잇습니다.
 * A=[1,1,0,1] (순서 (0,0),(1,0),(0,1),(1,1)) → y=0 줄은 1, y=1 줄은 x → a=1+(x+1)y=1+y+xy.
 * B=[0,1,1,0] → b=x+y. 꼭짓점에서 g=ab와 c=x(1+y)는 같지만 (u,v)에서는 g=5, c=10.
 */
const BLUE = "#2563eb";
const ORANGE = "#d97706";
const LINE = "#64748b";
const TEXT = "#334155";

const X0 = 60;
const X1 = 190;
const Y0 = 160;
const Y1 = 46;

const CORNERS = [
  { key: "00", x: X0, y: Y0, label: "(0,0)", index: 0 },
  { key: "10", x: X1, y: Y0, label: "(1,0)", index: 1 },
  { key: "01", x: X0, y: Y1, label: "(0,1)", index: 2 },
  { key: "11", x: X1, y: Y1, label: "(1,1)", index: 3 },
] as const;
const A_VALUES = [1, 1, 0, 1] as const;
const B_VALUES = [0, 1, 1, 0] as const;
const AND_VALUES = [0, 1, 0, 0] as const;

const SCENES = [
  { label: "꼭짓점에 놓기", summary: "A = [1,1,0,1]", note: "주소의 낮은 비트를 x, 높은 비트를 y로 두면 네 기록은 정사각형의 네 꼭짓점에 놓입니다. 기록 순서 (0,0), (1,0), (0,1), (1,1)대로 A의 값 1, 1, 0, 1을 적습니다." },
  { label: "x로 잇기", summary: "y=0 줄: 1 · y=1 줄: x", note: "먼저 같은 y를 가진 두 끝값을 x로 잇습니다. 아래 줄은 양 끝이 1과 1이라 x와 상관없이 1이고, 위 줄은 0과 1이라 x 자체입니다." },
  { label: "y로 잇기", summary: "a = 1+(x+1)y = 1+y+xy", note: "이제 두 줄의 식을 y로 잇습니다. y=0이면 아래 줄 1, y=1이면 위 줄 x가 나오도록 1+(x+1)y로 씁니다. 특성 2에서는 뺄셈이 덧셈과 같으므로 x−1을 x+1로 씁니다." },
  { label: "원래 기록 돌려주기", summary: "a(0,1)=0 · a(1,1)=1", note: "꼭짓점을 넣으면 원래 기록이 돌아옵니다. a(0,1)=1+1=0, a(1,1)=1+1+1=1입니다. 둘째 표 B=[0,1,1,0]도 같은 방법으로 b=x+y가 됩니다(주황)." },
  { label: "곱의 확장은 둘", summary: "꼭짓점 같음 · (u,v)에서 5와 10", note: "g=ab와 AND 결과표의 확장 c=x(1+y)는 네 꼭짓점에서 모두 [0,1,0,0]으로 같습니다. 하지만 꼭짓점 밖의 점 (u,v)에서는 g=13×6=5, c=10으로 갈라집니다. 표의 곱과 확장한 식의 곱을 구분해야 하는 이유입니다." },
] as const;

function Dot({ x, y, value, color, dx = 0 }: { x: number; y: number; value: number | string; color: string; dx?: number }) {
  return (
    <g>
      <circle cx={x + dx} cy={y} r={13} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1} />
      <text x={x + dx} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="ui-monospace, monospace" fill={TEXT}>{value}</text>
    </g>
  );
}

export default function MleSquareViz() {
  return (
    <SceneShell
      eyebrow="다중선형 확장"
      title="네 기록을 정사각형 꼭짓점에 놓고 x로 한 번, y로 한 번 잇습니다"
      description="가로가 주소의 낮은 비트 x, 세로가 높은 비트 y입니다. 꼭짓점만 실제 기록이고, 선은 0과 1 사이를 잇는 식을 나타냅니다."
      ariaLabel="기록 A를 정사각형 꼭짓점에 놓고 다중선형 확장 a=1+y+xy를 만드는 다섯 장면"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={active === 1 ? BLUE : LINE} strokeWidth={active === 1 ? 1.25 : 1} strokeOpacity={active >= 1 ? 1 : 0.4} strokeDasharray={active === 0 ? "3 3" : undefined} />
          <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke={active === 1 ? BLUE : LINE} strokeWidth={active === 1 ? 1.25 : 1} strokeOpacity={active >= 1 ? 1 : 0.4} strokeDasharray={active === 0 ? "3 3" : undefined} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke={active === 2 ? ORANGE : LINE} strokeWidth={active === 2 ? 1.25 : 1} strokeOpacity={active >= 2 ? 1 : 0.4} strokeDasharray={active < 2 ? "3 3" : undefined} />
          <line x1={X1} y1={Y0} x2={X1} y2={Y1} stroke={active === 2 ? ORANGE : LINE} strokeWidth={active === 2 ? 1.25 : 1} strokeOpacity={active >= 2 ? 1 : 0.4} strokeDasharray={active < 2 ? "3 3" : undefined} />
          <text x={X1 + 18} y={Y0 + 30} fontSize={11} fill={LINE}>x →</text>
          <text x={14} y={(Y0 + Y1) / 2 + 4} fontSize={11} fill={LINE}>↑ y</text>
          {CORNERS.map((corner) => {
            const below = corner.y === Y0;
            const values = active === 4 ? AND_VALUES : A_VALUES;
            return (
              <g key={corner.key}>
                <Dot x={corner.x} y={corner.y} value={values[corner.index]} color={active === 4 ? LINE : BLUE} dx={active === 3 ? -16 : 0} />
                {active === 3 && <Dot x={corner.x} y={corner.y} value={B_VALUES[corner.index]} color={ORANGE} dx={16} />}
                <text x={corner.x} y={below ? corner.y + 30 : corner.y - 20} textAnchor="middle" fontSize={10} fill={LINE}>
                  {active === 0 ? `[${corner.index}] ${corner.label}` : corner.label}
                </text>
              </g>
            );
          })}
          {active === 1 && (
            <g>
              <text x={(X0 + X1) / 2} y={Y0 - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>1 → 1 : 상수 1</text>
              <text x={(X0 + X1) / 2} y={Y1 + 22} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>0 → 1 : x</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <text x={(X0 + X1) / 2} y={Y0 - 8} textAnchor="middle" fontSize={11} fill={LINE}>y=0 줄: 1</text>
              <text x={(X0 + X1) / 2} y={Y1 + 22} textAnchor="middle" fontSize={11} fill={LINE}>y=1 줄: x</text>
              <text x={(X0 + X1) / 2} y={(Y0 + Y1) / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={ORANGE}>y로 이음 ↕</text>
            </g>
          )}
          <g>
            <text x={232} y={70} fontSize={11} fill={LINE}>{active === 4 ? "꼭짓점 값" : active === 3 ? "두 표" : active === 0 ? "기록" : "식"}</text>
            {active <= 1 && <text x={232} y={92} fontSize={13} fontWeight={700} fill={BLUE}>{active === 0 ? "A = [1,1,0,1]" : "줄마다 x의 식"}</text>}
            {active === 2 && <text x={232} y={92} fontSize={13} fontWeight={700} fill={ORANGE}>a = 1+y+xy</text>}
            {active === 3 && (
              <g>
                <text x={232} y={92} fontSize={13} fontWeight={700} fill={BLUE}>a = 1+y+xy</text>
                <text x={232} y={114} fontSize={13} fontWeight={700} fill={ORANGE}>b = x+y</text>
              </g>
            )}
            {active === 4 && (
              <g>
                <text x={232} y={92} fontSize={12} fontWeight={700} fill={TEXT}>g, c 모두 [0,1,0,0]</text>
                <rect x={228} y={110} width={126} height={56} rx={6} fill="none" stroke={ORANGE} strokeWidth={1} strokeDasharray="4 3" />
                <text x={236} y={128} fontSize={11} fill={ORANGE}>꼭짓점 밖 (u,v)</text>
                <text x={236} y={146} fontSize={12} fontWeight={700} fill={TEXT}>g = 5</text>
                <text x={236} y={161} fontSize={12} fontWeight={700} fill={TEXT}>c = 10</text>
              </g>
            )}
          </g>
        </svg>
      )}
    />
  );
}
