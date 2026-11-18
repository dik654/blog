import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cost — 한 출력 위치에서 각 단계가 어떤 입력 칸을 읽는지와 MAC 수.
 * 가로 9칸 = 3×3 창의 tap, 세로 32줄 = 입력 channel(Cin=32).
 * Dense: 출력 channel 하나가 9×32=288칸을 읽고 64번 반복 → 18,432.
 * Depthwise: channel마다 자기 줄 9칸 → 9×32=288. Pointwise: 32값을 읽고 64번 → 2,048.
 * 합계 2,336 = dense의 12.7%, 그중 pointwise 2,048/2,336 = 87.7%.
 */
const K2 = 9;
const CIN = 32;
const COUT = 64;
const DENSE = K2 * CIN * COUT;
const DW = K2 * CIN;
const PW = CIN * COUT;
const SEP = DW + PW;

const CELL_W = 11;
const CELL_H = 4;
const GRID_X = 24;
const GRID_Y = 30;
const MID_X = 178;
const OUT_X = 290;
const OUT_H = 2;
const HIGHLIGHT_ROW = 4;
const HIGHLIGHT_OUT = 9;
const ANNO_Y = GRID_Y + CIN * CELL_H + 22;

const SCENES = [
  {
    label: "Dense",
    summary: "288칸 × 64번 = 18,432 MAC",
    note: "출력 channel 하나를 만들 때 3×3 창의 9칸을 입력 channel 32개 모두에서 읽어 288번 곱합니다. 출력 channel이 64개이므로 이 일을 64번 반복합니다.",
  },
  {
    label: "Depthwise",
    summary: "9칸 × 32줄 = 288 MAC",
    note: "각 channel의 3×3 kernel은 자기 줄의 9칸만 읽고 값 하나를 냅니다. 32줄이 각자 한 번씩이라 288 MAC이고, 이 단계에서는 서로 다른 channel이 섞이지 않습니다.",
  },
  {
    label: "Pointwise",
    summary: "32값 × 64번 = 2,048 MAC",
    note: "1×1 단계는 같은 위치의 중간값 32개를 모두 읽어 출력 channel 하나를 만들고 이를 64번 반복합니다. channel을 섞는 일은 여기서 한 번만 일어납니다.",
  },
  {
    label: "합계 비교",
    summary: "2,336 / 18,432 ≈ 0.127",
    note: "분리 연산의 합은 dense의 약 12.7%이고 그중 2,048(약 87.7%)이 pointwise 몫입니다. 이 값은 이론상 MAC 비교이며 실제 시간은 다음 절처럼 장치에서 따로 잽니다.",
  },
] as const;

const AMBER = "#d97706";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const FAINT = "#e2e8f0";
const TEXT = "#64748b";

function cellFill(active: number, row: number) {
  if (active === 0) return AMBER;
  if (active === 1) return row === HIGHLIGHT_ROW ? BLUE : "#bfdbfe";
  return FAINT;
}

function Bar({ label, value, color, shown }: { label: string; value: number; color: string; shown: boolean }) {
  const width = shown ? (value / DENSE) * 100 : 0;
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_4rem] items-center gap-2 text-xs sm:text-sm">
      <span className={shown ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div
          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${width}%`, minWidth: shown ? 2 : 0, backgroundColor: color }}
        />
      </div>
      <span className="text-right font-mono">{shown ? value.toLocaleString("en-US") : "−"}</span>
    </div>
  );
}

export default function ChannelReadMapViz() {
  return (
    <SceneShell
      eyebrow="읽는 칸"
      title="출력 하나가 입력의 어느 칸을 읽는지 세어 봅니다"
      description="왼쪽 격자의 가로 9칸은 3×3 창의 칸(tap), 세로 32줄은 입력 channel입니다. 가운데 기둥은 depthwise가 남긴 channel별 중간값 32개, 오른쪽 기둥은 출력 channel 64개입니다. 막대는 k=3, Cin=32, Cout=64인 한 출력 위치의 MAC이며 H·W·batch는 두 방식에 공통이라 생략합니다."
      ariaLabel="dense, depthwise, pointwise가 읽는 입력 칸과 위치당 MAC 비교"
      scenes={SCENES}
      render={(active) => {
        const outOn = active === 0 || active === 2;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 208" className="mx-auto block h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={GRID_X + (K2 * CELL_W) / 2} y={18} textAnchor="middle" fontSize={11} fill={TEXT}>
                입력 9칸 × 32 channel
              </text>
              {Array.from({ length: CIN }, (_, row) =>
                Array.from({ length: K2 }, (_, col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={GRID_X + col * CELL_W + 0.5}
                    y={GRID_Y + row * CELL_H + 0.5}
                    width={CELL_W - 1}
                    height={CELL_H - 1}
                    fill={cellFill(active, row)}
                    opacity={active === 0 ? 0.85 : 1}
                  />
                )),
              )}
              <text x={MID_X + 6} y={18} textAnchor="middle" fontSize={11} fill={TEXT}>
                중간값 32
              </text>
              {Array.from({ length: CIN }, (_, row) => (
                <rect
                  key={`mid-${row}`}
                  opacity={active === 0 ? 0.35 : 1}
                  x={MID_X}
                  y={GRID_Y + row * CELL_H + 0.5}
                  width={12}
                  height={CELL_H - 1}
                  fill={active === 2 ? GREEN : active === 1 && row === HIGHLIGHT_ROW ? BLUE : active === 1 ? "#bfdbfe" : FAINT}
                />
              ))}
              <text x={OUT_X + 6} y={18} textAnchor="middle" fontSize={11} fill={TEXT}>
                출력 64
              </text>
              {Array.from({ length: COUT }, (_, row) => (
                <rect
                  key={`out-${row}`}
                  x={OUT_X}
                  y={GRID_Y + row * OUT_H}
                  width={12}
                  height={OUT_H - 0.4}
                  fill={outOn && row === HIGHLIGHT_OUT ? (active === 0 ? AMBER : GREEN) : outOn ? "#cbd5e1" : FAINT}
                />
              ))}
              {active === 0 && (
                <g>
                  <line x1={GRID_X + K2 * CELL_W + 4} y1={GRID_Y + 64} x2={OUT_X - 6} y2={GRID_Y + HIGHLIGHT_OUT * OUT_H + 1} stroke={AMBER} strokeWidth={1.25} />
                  <text x={180} y={ANNO_Y} textAnchor="middle" fontSize={11} fill={AMBER} fontWeight={700}>
                    288칸 전부 → 출력 1개
                  </text>
                  <text x={180} y={ANNO_Y + 16} textAnchor="middle" fontSize={11} fill={TEXT}>
                    출력 64개마다 반복
                  </text>
                </g>
              )}
              {active === 1 && (
                <g>
                  <line x1={GRID_X + K2 * CELL_W + 4} y1={GRID_Y + HIGHLIGHT_ROW * CELL_H + 1.5} x2={MID_X - 4} y2={GRID_Y + HIGHLIGHT_ROW * CELL_H + 1.5} stroke={BLUE} strokeWidth={1.25} />
                  <text x={180} y={ANNO_Y} textAnchor="middle" fontSize={11} fill={BLUE} fontWeight={700}>
                    자기 줄 9칸 → 1값
                  </text>
                  <text x={180} y={ANNO_Y + 16} textAnchor="middle" fontSize={11} fill={TEXT}>
                    32줄이 각자 한 번
                  </text>
                </g>
              )}
              {active === 2 && (
                <g>
                  <line x1={MID_X + 16} y1={GRID_Y + 64} x2={OUT_X - 4} y2={GRID_Y + HIGHLIGHT_OUT * OUT_H + 1} stroke={GREEN} strokeWidth={1.25} />
                  <text x={180} y={ANNO_Y} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={700}>
                    32값 → 출력 1개
                  </text>
                  <text x={180} y={ANNO_Y + 16} textAnchor="middle" fontSize={11} fill={TEXT}>
                    64번 반복
                  </text>
                </g>
              )}
              {active === 3 && (
                <g>
                  <text x={180} y={ANNO_Y} textAnchor="middle" fontSize={11} fill="#475569" fontWeight={700}>
                    288 + 2,048 = 2,336 MAC
                  </text>
                  <text x={180} y={ANNO_Y + 16} textAnchor="middle" fontSize={11} fill={TEXT}>
                    dense 18,432의 약 12.7%
                  </text>
                </g>
              )}
            </svg>
            <div className="mt-3 space-y-2">
              <Bar label="Dense" value={DENSE} color={AMBER} shown={active === 0 || active === 3} />
              <Bar label="Depthwise" value={DW} color={BLUE} shown={active === 1 || active === 3} />
              <Bar label="Pointwise" value={PW} color={GREEN} shown={active === 2 || active === 3} />
              <Bar label="분리 합계" value={SEP} color="#475569" shown={active === 3} />
            </div>
          </div>
        );
      }}
    />
  );
}
