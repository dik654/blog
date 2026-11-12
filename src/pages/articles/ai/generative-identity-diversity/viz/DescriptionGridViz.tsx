import SceneShell from "./SceneShell";

/**
 * 본문 대응: #distillation-bottleneck — 성별 2 × 나이 3 × 얼굴형 3 × 이목구비 4 = 72개 묘사.
 * 행 = 성별·나이 구간 6개, 열 = 얼굴형 × 이목구비 12개.
 * 한 구간 12칸 → 12×11÷2 = 66쌍, 구간 안 쌍 6×66 = 396, 72개 전체 72×71÷2 = 2556.
 * 탐지 67건 → 67×66÷2 = 2211쌍, 탐지 66건 → 66×65÷2 = 2145쌍, 채택 18 ÷ 67 = 26.9%.
 */
const ROWS = ["남 · 나이①", "남 · 나이②", "남 · 나이③", "여 · 나이①", "여 · 나이②", "여 · 나이③"] as const;
const SHAPES = ["얼굴형①", "얼굴형②", "얼굴형③"] as const;
const COLS = 12;
const CELL_W = 24;
const CELL_H = 17;
const GRID_X = 64;
const GRID_Y = 44;
const FOCUS_ROW = 3;

const PER_ROW_PAIRS = (COLS * (COLS - 1)) / 2;
const WITHIN_PAIRS = ROWS.length * PER_ROW_PAIRS;
const ALL = ROWS.length * COLS;
const ALL_PAIRS = (ALL * (ALL - 1)) / 2;
const BETWEEN_PAIRS = ALL_PAIRS - WITHIN_PAIRS;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const WARN = "#dc2626";

const SCENES = [
  {
    label: "네 축을 곱하면",
    summary: "2 × 3 × 3 × 4 = 72",
    note: "칸 하나가 묘사 하나이고 각각 하나씩 생성했습니다. 한 줄은 성별·나이가 같은 구간, 줄 안 열두 칸은 얼굴형과 이목구비 서술어만 다릅니다. 나이 ①②③은 구간 표시일 뿐입니다(가정).",
  },
  {
    label: "한 줄 안에서만 비교하면",
    summary: "12 × 11 ÷ 2 = 66쌍",
    note: "성별과 나이를 고정하고 묘사만으로 열두 명을 구분하려는 경우입니다. 한 줄 열두 칸이 다 잡히면 66쌍이고, 증류 가중치에서는 구간마다 구간 안 쌍의 27~38%가 임계를 넘었습니다. 탐지 실패가 있던 구간은 쌍이 66보다 적습니다.",
  },
  {
    label: "전체 쌍의 대부분은 구간 사이",
    summary: "구간 안 396 / 전체 2,556",
    note: "72개가 다 잡혔다고 치면 같은 구간끼리의 쌍은 6 × 66 = 396개(15.5%)뿐이고 2,160개(84.5%)는 성별이나 나이가 다른 쌍입니다. 본문은 전체 평균이 낮아 보인 이유를 이 구간 분리로 진단했습니다.",
  },
  {
    label: "실제로 센 쌍",
    summary: "67 × 66 ÷ 2 = 2,211",
    note: "2,211과 2,145는 탐지된 결과끼리 센 쌍 수와 같습니다. 탐지 실패를 빼면 증류 67건, 비증류 66건입니다. 증류 채택 18명 ÷ 67 = 26.9%가 본문의 보존율입니다.",
  },
] as const;

function Grid({ active }: { active: number }) {
  return (
    <g>
      {SHAPES.map((shape, index) => (
        <g key={shape}>
          <text x={GRID_X + index * 4 * CELL_W + 2 * CELL_W} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT}>
            {shape}
          </text>
          {[1, 2, 3, 4].map((feature) => (
            <text key={feature} x={GRID_X + (index * 4 + feature - 1) * CELL_W + CELL_W / 2} y={37} textAnchor="middle" fontSize={10} fill={MUTED}>
              {feature}
            </text>
          ))}
          {index > 0 && (
            <line x1={GRID_X + index * 4 * CELL_W} x2={GRID_X + index * 4 * CELL_W} y1={10} y2={GRID_Y + ROWS.length * CELL_H} stroke={TEXT} strokeWidth={1} />
          )}
        </g>
      ))}
      {ROWS.map((row, r) => {
        const focus = active === 1 && r === FOCUS_ROW;
        const dim = active === 1 && r !== FOCUS_ROW;
        return (
          <g key={row}>
            <text x={GRID_X - 6} y={GRID_Y + r * CELL_H + 12} textAnchor="end" fontSize={11} fontWeight={focus ? 700 : 400} fill={focus ? ACCENT : TEXT}>
              {row}
            </text>
            {Array.from({ length: COLS }, (_, c) => (
              <rect
                key={c}
                x={GRID_X + c * CELL_W + 1}
                y={GRID_Y + r * CELL_H + 1}
                width={CELL_W - 2}
                height={CELL_H - 2}
                rx={2}
                fill={active === 2 || focus ? ACCENT : MUTED}
                fillOpacity={dim ? 0.12 : focus ? 0.55 : 0.3}
                stroke={focus ? ACCENT : "none"}
                strokeWidth={1}
              />
            ))}
          </g>
        );
      })}
      <line x1={GRID_X} x2={GRID_X + COLS * CELL_W} y1={GRID_Y + 3 * CELL_H} y2={GRID_Y + 3 * CELL_H} stroke={TEXT} strokeWidth={1} />
    </g>
  );
}

function Below({ active }: { active: number }) {
  const y = GRID_Y + ROWS.length * CELL_H;
  if (active === 0) {
    return (
      <g>
        <text x={GRID_X} y={y + 22} fontSize={11} fill={TEXT}>
          세로: 성별 2 × 나이 3 = 구간 6줄
        </text>
        <text x={GRID_X} y={y + 40} fontSize={11} fill={TEXT}>
          가로: 얼굴형 3 × 이목구비 4 = 묘사 12칸
        </text>
      </g>
    );
  }
  if (active === 1) {
    return (
      <g>
        <text x={GRID_X} y={y + 22} fontSize={11} fontWeight={700} fill={ACCENT}>
          한 줄 12칸 → 66쌍
        </text>
        <text x={GRID_X} y={y + 40} fontSize={11} fill={WARN}>
          증류: 구간마다 구간 안 쌍의 27~38%가 충돌
        </text>
      </g>
    );
  }
  const width = COLS * CELL_W;
  const within = (WITHIN_PAIRS / ALL_PAIRS) * width;
  return (
    <g>
      <rect x={GRID_X} y={y + 10} width={within} height={14} fill={ACCENT} fillOpacity={0.55} />
      <rect x={GRID_X + within} y={y + 10} width={width - within} height={14} fill={MUTED} fillOpacity={0.3} />
      <text x={GRID_X} y={y + 40} fontSize={10} fontWeight={700} fill={ACCENT}>
        구간 안 {WITHIN_PAIRS}
      </text>
      <text x={GRID_X + width} y={y + 40} textAnchor="end" fontSize={10} fill={TEXT}>
        구간 사이 {BETWEEN_PAIRS.toLocaleString("en-US")}
      </text>
    </g>
  );
}

const COUNTS = [
  { name: "증류", detected: 67, failed: 5, pairs: 2211, collide: 215 },
  { name: "비증류", detected: 66, failed: 6, pairs: 2145, collide: 8 },
] as const;

function Counts() {
  const barW = 220;
  return (
    <g>
      {COUNTS.map((row, i) => {
        const y = 14 + i * 92;
        const share = (row.collide / row.pairs) * barW;
        return (
          <g key={row.name}>
            <text x={10} y={y + 12} fontSize={12} fontWeight={700} fill={i === 0 ? WARN : ACCENT}>
              {row.name}
            </text>
            <text x={70} y={y + 12} fontSize={11} fill={TEXT}>
              묘사 72 − 탐지 실패 {row.failed} = 탐지 {row.detected}
            </text>
            <text x={70} y={y + 32} fontSize={11} fontWeight={700} fill={TEXT}>
              {row.detected} × {row.detected - 1} ÷ 2 = {row.pairs.toLocaleString("en-US")}쌍
            </text>
            <rect x={70} y={y + 42} width={barW} height={12} fill={MUTED} fillOpacity={0.25} />
            <rect x={70} y={y + 42} width={Math.max(1.5, share)} height={12} fill={i === 0 ? WARN : ACCENT} fillOpacity={0.7} />
            <text x={70} y={y + 70} fontSize={10} fill={i === 0 ? WARN : ACCENT}>
              임계를 넘은 쌍 {row.collide} ({((row.collide / row.pairs) * 100).toFixed(1)}%)
            </text>
          </g>
        );
      })}
      <text x={10} y={202} fontSize={10} fill={TEXT}>
        증류 채택 18 ÷ 탐지 67 = 26.9% (본문의 보존율)
      </text>
    </g>
  );
}

export default function DescriptionGridViz() {
  return (
    <SceneShell
      eyebrow="일흔두 개 묘사"
      title="72칸을 줄로 묶으면 실제로 비교한 것이 보입니다"
      description="칸 하나가 묘사 하나입니다. 같은 줄은 성별과 나이가 같은 구간이고, 쌍은 두 결과가 같은 사람인지 판정하는 단위입니다."
      ariaLabel="성별·나이 구간 6줄과 묘사 12칸으로 나눈 72개 묘사, 구간 안 쌍과 실제 쌍 수 계산"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox="0 0 360 210"
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          {active === 3 ? (
            <Counts />
          ) : (
            <>
              <Grid active={active} />
              <Below active={active} />
            </>
          )}
        </svg>
      )}
    />
  );
}
