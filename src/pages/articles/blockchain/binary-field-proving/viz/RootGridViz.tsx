import SceneShell from "./SceneShell";

/**
 * 본문 대응: #soundness — 정직한 t²와 거짓 t의 차이 t²+t는 F₁₆에서도 근이 0과 1뿐입니다.
 * 질문을 {0,1}에서만 고르면 항상 놓치고, 16원소에서 균등하게 고르면 놓칠 확률 2/16 = 1/8.
 * 질문 u(비트 표기 2)에서는 u²+u = 1 ≠ 0.
 */
const BLUE = "#2563eb";
const RED = "#dc2626";
const MUTED = "#cbd5e1";
const TEXT = "#334155";
const LINE = "#64748b";

const CELL_W = 40;
const CELL_H = 34;
const GAP = 6;
const ELEMENTS = Array.from({ length: 16 }, (_, value) => value);

const SCENES = [
  { label: "0과 1에서만 질문", summary: "두 칸 모두 차이 0", note: "첫 메시지 t² 대신 t를 보내도 0과 1에서는 값이 같아 두 끝값의 합도 1입니다. 차이 t²+t는 0이 아닌 다항식이지만 0과 1에서 모두 0이라, 질문을 이 두 칸에서만 뽑으면 거짓을 볼 수 없습니다." },
  { label: "16원소에서 균등하게", summary: "놓칠 확률 2/16 = 1/8", note: "F₁₆에서도 t²+t의 근은 0과 1뿐입니다. 메시지가 먼저 고정되고 16칸에서 균등하게 질문을 뽑으면 차이를 놓치는 칸은 빨간 두 칸이라 확률은 2/16=1/8입니다. 이는 한 차이식에 대한 계산이며 sumcheck 전체의 오류 확률이 아닙니다." },
  { label: "질문 u에서", summary: "u²+u = 1 ≠ 0", note: "본문이 고른 u(비트 표기 2)에서는 u²=u+1이라 u²+u=1입니다. 정직한 t²와 거짓 t가 다른 값을 내므로 차이가 드러납니다." },
] as const;

export default function RootGridViz() {
  return (
    <SceneShell
      eyebrow="질문할 칸의 수"
      title="거짓 식은 16칸 중 두 칸에서만 정직한 식과 같습니다"
      description="칸 하나가 F₁₆의 원소 하나이고 숫자는 비트 표기입니다(0, 1, 2=u, …). 빨간 칸은 정직한 첫 메시지 t²와 거짓 t의 값이 같은 곳입니다."
      ariaLabel="F16의 16개 원소 중 차이식 t제곱+t가 0인 두 원소와 질문 범위 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {ELEMENTS.map((value) => {
            const col = value % 4;
            const row = Math.floor(value / 4);
            const x = 8 + col * (CELL_W + GAP);
            const y = 12 + row * (CELL_H + GAP);
            const root = value < 2;
            const askable = active === 0 ? root : true;
            const focus = active === 2 && value === 2;
            const color = !askable ? MUTED : root ? RED : BLUE;
            const dim = active === 2 && !focus;
            return (
              <g key={value} opacity={dim ? 0.45 : 1}>
                <rect
                  x={x}
                  y={y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={4}
                  fill={askable ? color : "none"}
                  fillOpacity={askable ? (focus ? 0.3 : 0.14) : 0}
                  stroke={color}
                  strokeWidth={focus ? 1.25 : 1}
                  strokeDasharray={askable ? undefined : "3 2"}
                />
                <text x={x + CELL_W / 2} y={y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="ui-monospace, monospace" fill={askable ? TEXT : "#94a3b8"}>
                  {value === 2 ? "2=u" : value}
                </text>
              </g>
            );
          })}
          <g>
            <text x={200} y={34} fontSize={11} fill={LINE}>차이식 t²+t</text>
            {active === 0 && (
              <g>
                <text x={200} y={60} fontSize={12} fontWeight={700} fill={RED}>질문 가능: 0, 1</text>
                <text x={200} y={80} fontSize={12} fontWeight={700} fill={RED}>둘 다 차이 0</text>
                <text x={200} y={110} fontSize={11} fill={LINE}>놓칠 확률 2/2</text>
              </g>
            )}
            {active === 1 && (
              <g>
                <text x={200} y={60} fontSize={12} fontWeight={700} fill={RED}>차이 0: 2칸</text>
                <text x={200} y={80} fontSize={12} fontWeight={700} fill={BLUE}>차이 ≠ 0: 14칸</text>
                <text x={200} y={110} fontSize={11} fill={LINE}>놓칠 확률 2/16 = 1/8</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <text x={200} y={60} fontSize={12} fontWeight={700} fill={BLUE}>t = u</text>
                <text x={200} y={80} fontSize={12} fontWeight={700} fill={BLUE}>u²+u = 1 ≠ 0</text>
                <text x={200} y={110} fontSize={11} fill={LINE}>t²와 t가 달라 드러남</text>
              </g>
            )}
          </g>
        </svg>
      )}
    />
  );
}
