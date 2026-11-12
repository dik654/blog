import SceneShell from "./SceneShell";

/**
 * 본문 대응: #validator-set "숫자를 작게 잡아 보겠습니다"
 * power 3·1, priority 0·0 → 적립 3·1 → 첫 validator 선택 후 W=4 차감 −1·1 → 다시 적립 2·2(동률).
 */
const POWERS: readonly number[] = [3, 1];
const TOTAL = POWERS.reduce<number>((sum, value) => sum + value, 0);

const SCENES = [
  { label: "시작", summary: "priority 0 · 0", values: [0, 0], prev: [0, 0], chosen: -1, note: "두 validator의 power는 3과 1이고 priority는 둘 다 0에서 시작합니다. 막대는 0에서 오른쪽이면 양수, 왼쪽이면 음수입니다." },
  { label: "1 round · power만큼 적립", summary: "0+3=3 · 0+1=1", values: [3, 1], prev: [0, 0], chosen: -1, note: "모든 validator가 자기 power만큼 priority를 쌓습니다. power 3인 쪽이 더 많이 쌓여 3과 1이 됩니다." },
  { label: "1 round · 선택하고 전체 power 차감", summary: `3−${TOTAL}=−1 · 1`, values: [-1, 1], prev: [3, 1], chosen: 0, note: `priority가 가장 높은 power 3 쪽이 proposer가 되고, 전체 power ${TOTAL}만큼 빼서 −1로 내려갑니다. 선택되지 않은 쪽은 1을 그대로 유지해 이제 순서가 뒤집힙니다.` },
  { label: "2 round · 다시 적립", summary: "−1+3=2 · 1+1=2 · 동률", values: [2, 2], prev: [-1, 1], chosen: -1, note: "다시 power만큼 더하면 2와 2로 같아집니다. 누가 제안할지는 고정한 implementation의 deterministic tie-break가 정하며, 이 그림은 그 결과를 정하지 않습니다." },
] as const;
const ARIA: readonly string[] = SCENES.map((scene) => `${scene.label}: ${scene.summary}`);

const BLUE = "#2563eb";
const GRAY = "#94a3b8";
const MUTED = "#64748b";
const AMBER = "#d97706";

const ZERO_X = 190;
const UNIT = 36;
const ROWS: readonly number[] = [70, 150];
const vx = (value: number) => ZERO_X + value * UNIT;
const TICKS: readonly number[] = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

function signed(value: number) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}

export default function ProposerPriorityLineViz() {
  return (
    <SceneShell
      eyebrow="Proposer priority 갱신"
      title="가장 power가 큰 validator도 선택된 다음에는 뒤로 밀립니다"
      description="본문의 power 3·1 예시를 priority 수직선 위에 놓았습니다. 점선 막대는 직전 값입니다. 그림은 핵심 step만 보이며, 실제 v0.40.0 구현은 그 전에 priority 범위를 rescale하고 평균을 중심으로 옮깁니다."
      ariaLabel="power 3과 1인 두 validator의 proposer priority가 적립과 차감으로 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const values = scene.values as readonly number[];
        const prevs = scene.prev as readonly number[];
        return (
          <svg viewBox="0 0 380 220" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={ARIA[active]}>
            <line x1={ZERO_X} x2={ZERO_X} y1={44} y2={186} stroke={GRAY} strokeWidth={1} />
            {ROWS.map((y, index) => {
              const value = values[index];
              const prev = prevs[index];
              const changed = value !== prev;
              const chosen = scene.chosen === index;
              const color = chosen ? AMBER : BLUE;
              return (
                <g key={y}>
                  <text x={10} y={y - 18} fontSize={13} fontWeight={700} fill="currentColor">
                    validator {index + 1} · power {POWERS[index]}
                  </text>
                  {chosen && (
                    <text x={370} y={y - 18} textAnchor="end" fontSize={13} fontWeight={700} fill={AMBER}>
                      proposer · −{TOTAL}
                    </text>
                  )}
                  {changed && (
                    <rect
                      x={Math.min(vx(prev), ZERO_X)}
                      y={y - 6}
                      width={Math.abs(vx(prev) - ZERO_X)}
                      height={20}
                      rx={2}
                      fill="none"
                      stroke={GRAY}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                  )}
                  <rect
                    x={Math.min(vx(value), ZERO_X)}
                    y={y - 2}
                    width={Math.abs(vx(value) - ZERO_X)}
                    height={12}
                    rx={2}
                    fill={color}
                    opacity={0.85}
                  />
                  <circle cx={vx(value)} cy={y + 4} r={4} fill={color} />
                  <text
                    x={value < 0 ? vx(value) - 8 : vx(value) + 8}
                    y={y + 8}
                    textAnchor={value < 0 ? "end" : "start"}
                    fontSize={13}
                    fontWeight={700}
                    fill={color}
                  >
                    {signed(value)}
                  </text>
                  {changed && (
                    <text x={10} y={y + 32} fontSize={12} fill={MUTED}>
                      직전 {signed(prev)} → 지금 {signed(value)}
                    </text>
                  )}
                </g>
              );
            })}
            <line x1={vx(-4)} x2={vx(4)} y1={196} y2={196} stroke={GRAY} strokeWidth={1} />
            {TICKS.map((tick) => (
              <g key={tick}>
                <line x1={vx(tick)} x2={vx(tick)} y1={193} y2={199} stroke={GRAY} strokeWidth={1} />
                <text x={vx(tick)} y={214} textAnchor="middle" fontSize={12} fill={MUTED}>{signed(tick)}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
