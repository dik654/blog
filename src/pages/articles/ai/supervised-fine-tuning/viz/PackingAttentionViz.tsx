import SceneShell from "./SftSceneShell";

/**
 * 본문 대응: #packing — separator만 두고 standard causal mask를 쓰면 뒤 example이 앞 example을 읽고,
 * label shift가 경계를 넘으면 다음 example 첫 token이 앞 example의 target이 된다.
 * 토큰 수(A 3개 + 구분자 1개, B 3개)는 그림을 위한 가정입니다.
 * 표준 causal: 보이는 칸 7×8/2 = 28, 그중 B 행이 A 열을 보는 칸 3×4 = 12.
 * block-diagonal: A 블록 4×5/2 = 10 + B 블록 3×4/2 = 6 = 16칸.
 */
const TOKENS = ["A₁", "A₂", "A₃", "sep", "B₁", "B₂", "B₃"] as const;
const A_END = 3; // index 3(sep)까지 example A 블록으로 둡니다(가정).
const N = TOKENS.length;
const inA = (index: number) => index <= A_END;

const CELL = 26;
const MX = 92;
const MY = 34;
const STRIP_Y = MY + N * CELL + 30;
const PAIR_W = 50;
const PAIR_GAP = 4;
const STRIP_X = (360 - (N - 1) * PAIR_W - (N - 2) * PAIR_GAP) / 2;

const SCENES = [
  {
    label: "구분자 + 표준 causal mask",
    summary: "보이는 칸 28 · 그중 B→A 12",
    note: "표준 causal mask는 자기 앞쪽을 모두 열어 둡니다. 구분자 sep가 있어도 B 행은 A₁~sep 열을 attention으로 읽습니다(빨간 칸 12개).",
  },
  {
    label: "Block-diagonal attention",
    summary: "보이는 칸 10 + 6 = 16",
    note: "B 행에서 A 열을 닫으면 각 example은 자기 블록 안에서만 읽습니다. 본문은 이런 block-diagonal attention 또는 position reset 등의 구현 계약이 필요하다고 말합니다.",
  },
  {
    label: "Label shift가 경계를 넘을 때",
    summary: "sep → B₁ 짝은 끊어야 함",
    note: "띠의 짝은 '이 위치 input → 다음 token이 target'입니다. 경계에서 shift를 그대로 두면 sep 위치가 B₁을 정답으로 받아 silent contamination이 생깁니다. 구분자를 loss에 넣을지(A₃→sep)도 따로 명시합니다.",
  },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#94a3b8";
const TEXT = "#64748b";

function cellState(row: number, col: number, active: number): "hidden" | "visible" | "leak" | "blocked" {
  if (col > row) return "hidden";
  const crosses = !inA(row) && inA(col);
  if (!crosses) return "visible";
  return active === 0 ? "leak" : "blocked";
}

export default function PackingAttentionViz() {
  return (
    <SceneShell
      eyebrow="Packed sequence의 attention과 label"
      title="구분자 하나로는 뒤 example이 앞 example을 읽지 못하게 막을 수 없습니다"
      description="두 demonstration A·B를 한 sequence에 이어 붙였습니다. 칸이 색으로 차 있으면 그 행 위치가 그 열 token을 읽을 수 있습니다. Token 수는 그림을 위한 가정입니다(가정)."
      ariaLabel="packed sequence의 표준 causal mask, block-diagonal mask, 경계를 넘는 label shift 세 장면"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 360 ${STRIP_Y + 62}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={MX + (N * CELL) / 2} y={14} textAnchor="middle" fontSize={11} fill={TEXT}>읽히는 token (열)</text>
          {TOKENS.map((token, index) => (
            <text key={`c-${token}`} x={MX + index * CELL + CELL / 2} y={MY - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={inA(index) ? "#334155" : BLUE}>{token}</text>
          ))}
          {TOKENS.map((token, index) => (
            <text key={`r-${token}`} x={MX - 8} y={MY + index * CELL + CELL / 2 + 4} textAnchor="end" fontSize={10} fontWeight={700} fill={inA(index) ? "#334155" : BLUE}>{token}</text>
          ))}
          <text x={8} y={MY + (N * CELL) / 2 - 4} fontSize={11} fill={TEXT}>예측</text>
          <text x={8} y={MY + (N * CELL) / 2 + 10} fontSize={11} fill={TEXT}>위치 (행)</text>
          {TOKENS.map((rowToken, row) =>
            TOKENS.map((colToken, col) => {
              const state = cellState(row, col, active);
              const x = MX + col * CELL;
              const y = MY + row * CELL;
              const fill = state === "visible" ? BLUE : state === "leak" ? RED : "none";
              return (
                <g key={`${rowToken}-${colToken}`}>
                  <rect x={x + 1} y={y + 1} width={CELL - 2} height={CELL - 2} rx={3} fill={fill} fillOpacity={state === "visible" ? 0.35 : state === "leak" ? 0.75 : 0} stroke={state === "hidden" ? "#e2e8f0" : state === "blocked" ? GRAY : "none"} strokeWidth={1} strokeDasharray={state === "blocked" ? "3 2" : undefined} />
                  {state === "blocked" && <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fill={GRAY}>×</text>}
                </g>
              );
            }),
          )}
          <line x1={MX + (A_END + 1) * CELL} x2={MX + (A_END + 1) * CELL} y1={MY - 2} y2={MY + N * CELL + 2} stroke="#334155" strokeWidth={1} strokeDasharray="4 3" />
          <line x1={MX - 2} x2={MX + N * CELL + 2} y1={MY + (A_END + 1) * CELL} y2={MY + (A_END + 1) * CELL} stroke="#334155" strokeWidth={1} strokeDasharray="4 3" />
          <text x={MX + N * CELL + 6} y={MY + 2 * CELL + 4} fontSize={10} fill={TEXT}>A 블록</text>
          <text x={MX + N * CELL + 6} y={MY + 5.5 * CELL + 4} fontSize={10} fill={BLUE}>B 블록</text>

          <text x={180} y={STRIP_Y - 8} textAnchor="middle" fontSize={11} fill={TEXT}>label shift: input → target</text>
          {TOKENS.slice(0, -1).map((token, index) => {
            const next = TOKENS[index + 1];
            const crossing = index === A_END;
            const separator = index === A_END - 1;
            const x = STRIP_X + index * (PAIR_W + PAIR_GAP);
            const highlight = active === 2 && (crossing || separator);
            const stroke = active === 2 && crossing ? RED : active === 2 && separator ? "#d97706" : GRAY;
            return (
              <g key={`p-${token}`}>
                <rect x={x} y={STRIP_Y} width={PAIR_W} height={26} rx={4} fill="none" stroke={stroke} strokeWidth={highlight ? 1.25 : 1} strokeDasharray={active === 2 && crossing ? "3 2" : undefined} />
                <text x={x + PAIR_W / 2} y={STRIP_Y + 17} textAnchor="middle" fontSize={10} fontWeight={highlight ? 700 : 400} fill={highlight ? stroke : "#334155"}>{token}→{next}</text>
                {active === 2 && crossing && <text x={x + PAIR_W / 2} y={STRIP_Y + 44} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>끊기</text>}
                {active === 2 && separator && <text x={x + PAIR_W / 2} y={STRIP_Y + 44} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">명시</text>}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
