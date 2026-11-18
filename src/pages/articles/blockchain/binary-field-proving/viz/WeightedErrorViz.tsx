import SceneShell from "./SceneShell";

/**
 * 본문 대응: #zerocheck — 오류표 E=[1,1,0,0] (순서 (0,0),(1,0),(0,1),(1,1)).
 * 같은 가중치: 1+1+0+0 = 0. 주소별 가중치 eq((u,v),b) = qₓ·qᵧ, q = b·r + (1+b)(1+r):
 * (0,0): (1+u)(1+v)=1+u+v+uv=15, (1,0): u(1+v)=u+uv=10, (0,1): (1+u)v=v+uv=12, (1,1): uv=8.
 * 가중 합 = 15 + 10 = 1111 XOR 1010 = 0101 = 5 = 1+v. rᵧ=1이면 아래 줄 가중치가 0이 되어 가려집니다.
 */
const BLUE = "#2563eb";
const RED = "#dc2626";
const ORANGE = "#d97706";
const LINE = "#64748b";
const TEXT = "#334155";

const X0 = 52;
const X1 = 160;
const Y0 = 150;
const Y1 = 54;

const CORNERS = [
  { key: "00", x: X0, y: Y0, error: 1, weights: ["1", "15", "0"] },
  { key: "10", x: X1, y: Y0, error: 1, weights: ["1", "10", "0"] },
  { key: "01", x: X0, y: Y1, error: 0, weights: ["1", "12", "–"] },
  { key: "11", x: X1, y: Y1, error: 0, weights: ["1", "8", "–"] },
] as const;

const SCENES = [
  { label: "같은 가중치로 더하기", summary: "1 + 1 + 0 + 0 = 0", note: "AND 결과표의 두 자리가 틀려 오류표가 [1,1,0,0]이라고 합시다. 모든 자리에 같은 가중치 1을 주고 더하면 특성 2에서 1+1=0이라 두 오류가 서로 지워집니다. 합이 0이어도 계산이 맞았다는 뜻은 아닙니다." },
  { label: "주소마다 다른 가중치", summary: "15 + 10 = 5 ≠ 0", note: "무작위 주소 r=(u,v)에 맞춘 가중치 eq(r,b)를 꼭짓점마다 곱하면 아래 두 칸의 가중치가 15와 10으로 달라집니다. 15+10은 비트별로 1111과 1010의 XOR라 0101, 곧 5입니다. 오류표의 확장 1+rᵧ에 rᵧ=v를 넣은 1+v=5와 같습니다." },
  { label: "가려지는 한 경우", summary: "rᵧ = 1이면 0", note: "rᵧ가 1이면 y=0인 아래 줄의 가중치가 모두 0이 되어 두 오류가 보이지 않습니다. 고정한 이 오류표는 균등하게 고른 rᵧ가 1일 때만 이 가중 평가에서 가려집니다. 실제 zerocheck는 이 가중 합이 0인지를 sumcheck로 줄이고 원래 기록과의 연결도 따로 확인합니다." },
] as const;

export default function WeightedErrorViz() {
  return (
    <SceneShell
      eyebrow="가중 합"
      title="두 오류는 같은 가중치로 더하면 지워지고, 주소마다 다른 가중치를 주면 드러납니다"
      description="꼭짓점의 원 안 숫자는 오류(1이면 틀린 자리), 옆의 ×는 그 자리에 곱하는 가중치입니다. 수는 비트 표기이고 +는 XOR입니다."
      ariaLabel="오류표 1,1,0,0을 같은 가중치와 주소별 가중치로 더한 결과 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={X0} y={Y1} width={X1 - X0} height={Y0 - Y1} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
          {CORNERS.map((corner) => {
            const weight = (corner.weights as readonly string[])[active];
            const color = corner.error === 1 ? RED : LINE;
            const left = corner.x === X0;
            return (
              <g key={corner.key}>
                <circle cx={corner.x} cy={corner.y} r={13} fill={corner.error === 1 ? RED : "none"} fillOpacity={0.14} stroke={color} strokeWidth={1} />
                <text x={corner.x} y={corner.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="ui-monospace, monospace" fill={TEXT}>{corner.error}</text>
                <text
                  x={left ? corner.x - 18 : corner.x + 18}
                  y={corner.y + 5}
                  textAnchor={left ? "end" : "start"}
                  fontSize={12}
                  fontWeight={700}
                  fill={active === 0 ? LINE : ORANGE}
                >
                  {`×${weight}`}
                </text>
                <text x={corner.x} y={corner.y < 100 ? corner.y - 20 : corner.y + 30} textAnchor="middle" fontSize={10} fill={LINE}>
                  {`(${corner.key[0]},${corner.key[1]})`}
                </text>
              </g>
            );
          })}
          <g>
            <text x={218} y={58} fontSize={11} fill={LINE}>{active === 0 ? "가중치 모두 1" : active === 1 ? "r = (u, v)" : "rᵧ = 1"}</text>
            {active === 0 && (
              <g>
                <text x={218} y={84} fontSize={13} fontWeight={700} fill={TEXT}>1 + 1 = 0</text>
                <text x={218} y={106} fontSize={12} fontWeight={700} fill={RED}>오류가 가려짐</text>
              </g>
            )}
            {active === 1 && (
              <g>
                <text x={218} y={84} fontSize={13} fontWeight={700} fill={TEXT}>15 + 10 = 5</text>
                <text x={218} y={104} fontSize={11} fontFamily="ui-monospace, monospace" fill={LINE}>1111 ⊕ 1010</text>
                <text x={218} y={120} fontSize={11} fontFamily="ui-monospace, monospace" fill={LINE}>= 0101</text>
                <text x={218} y={144} fontSize={12} fontWeight={700} fill={BLUE}>≠ 0, 드러남</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <text x={218} y={84} fontSize={13} fontWeight={700} fill={TEXT}>0 + 0 = 0</text>
                <text x={218} y={106} fontSize={12} fontWeight={700} fill={RED}>이 경우만 가려짐</text>
                <text x={218} y={130} fontSize={11} fill={LINE}>위 줄은 오류 0이라</text>
                <text x={218} y={145} fontSize={11} fill={LINE}>가중치와 무관(–)</text>
              </g>
            )}
          </g>
        </svg>
      )}
    />
  );
}
