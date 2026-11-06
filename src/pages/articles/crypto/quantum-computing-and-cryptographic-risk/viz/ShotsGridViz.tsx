import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 중간값 0.5를 제곱하면 0.25, 네 칸의 합은 1, 400회의 기대 횟수는 칸마다 100회.
 * 큰 정사각형의 한 변이 1이고 네 칸의 한 변이 0.5라서, 제곱이 곧 칸의 넓이로 보입니다.
 * 400개 점은 20×20이므로 한 칸에 10×10=100개가 들어갑니다.
 */
const W = 360;
const H = 296;
const S = 220;
const X0 = 70;
const Y0 = 30;
const HALF = S / 2;
const BLUE = "#2563eb";
const GRAY = "#64748b";
const FAINT = "#94a3b8";

const CELLS = [
  { name: "00", col: 0, row: 0, color: BLUE },
  { name: "01", col: 1, row: 0, color: GRAY },
  { name: "10", col: 0, row: 1, color: GRAY },
  { name: "11", col: 1, row: 1, color: GRAY },
] as const;

const SCENES = [
  { label: "중간값", summary: "네 칸 모두 0.5", note: "한 변이 1인 정사각형을 네 후보로 나눴습니다. 각 칸의 한 변이 그 후보의 중간값 0.5입니다. 00이 정답이라고 둔 것은 가정입니다." },
  { label: "제곱은 넓이", summary: "0.5 × 0.5 = 0.25", note: "중간값을 제곱하면 칸의 넓이 0.25가 됩니다. 이 넓이가 측정 확률입니다. 중간값 0.5를 그대로 확률로 읽지 않습니다." },
  { label: "합은 1", summary: "0.25 × 4 = 1", note: "네 칸의 넓이를 모두 더하면 큰 정사각형 하나, 곧 1입니다. 측정하면 네 후보 중 어느 하나는 반드시 나옵니다." },
  { label: "한 번 재면", summary: "결과 하나", note: "한 번 측정하면 점 하나만 찍힙니다. 네 칸을 한꺼번에 읽어 낼 수 없습니다. 이 점이 01에 찍힌 것은 예시입니다." },
  { label: "400번 재면", summary: "400 × 0.25 = 100", note: "점 400개를 넓이대로 나누면 칸마다 100개입니다. 이것은 기대 횟수이며 실제 빈도를 정확히 보장하는 숫자가 아닙니다. 지금은 정답 칸이 다른 칸보다 많지 않습니다." },
] as const;

function Dots() {
  const gap = S / 20;
  return (
    <g>
      {Array.from({ length: 400 }, (_, index) => {
        const col = index % 20;
        const row = Math.floor(index / 20);
        return <circle key={index} cx={X0 + (col + 0.5) * gap} cy={Y0 + (row + 0.5) * gap} r={2.5} fill={col < 10 && row < 10 ? BLUE : GRAY} opacity={0.75} />;
      })}
    </g>
  );
}

function Grid({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={X0 + HALF / 2} y={Y0 - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>0.5</text>
      <text x={X0 + HALF * 1.5} y={Y0 - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>0.5</text>
      <text x={X0 - 10} y={Y0 + HALF / 2 + 5} textAnchor="end" fontSize={13} fontWeight={700} fill={GRAY}>0.5</text>
      <text x={X0 - 10} y={Y0 + HALF * 1.5 + 5} textAnchor="end" fontSize={13} fontWeight={700} fill={GRAY}>0.5</text>

      {CELLS.map((cell) => {
        const x = X0 + cell.col * HALF;
        const y = Y0 + cell.row * HALF;
        const filled = active === 2 || (active === 1 && cell.name === "00");
        return (
          <rect key={cell.name} x={x} y={y} width={HALF} height={HALF} fill={filled ? `${cell.color}33` : "none"} stroke={cell.color === BLUE && filled ? BLUE : FAINT} strokeWidth={1} />
        );
      })}

      {active === 4 && <Dots />}
      {active === 3 && (
        <g>
          <circle cx={X0 + HALF * 1.5} cy={Y0 + HALF / 2 + 22} r={6} fill={GRAY} />
        </g>
      )}

      {CELLS.map((cell) => {
        const cx = X0 + cell.col * HALF + HALF / 2;
        const cy = Y0 + cell.row * HALF + HALF / 2;
        const showArea = active === 2 || (active === 1 && cell.name === "00");
        const value = active === 4 ? "100회" : showArea ? "0.25" : null;
        return (
          <g key={cell.name}>
            {active === 4 && <rect x={cx - 26} y={cy - 22} width={52} height={44} rx={6} className="fill-background" opacity={0.92} />}
            <text x={cx} y={value ? cy - 4 : cy + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={cell.color}>
              {cell.name}
            </text>
            {value && (
              <text x={cx} y={cy + 15} textAnchor="middle" fontSize={13} fontWeight={700} fill={cell.color}>
                {value}
              </text>
            )}
          </g>
        );
      })}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>
        {active === 4 ? "점 400개 = 20 × 20" : active === 2 ? "큰 정사각형 넓이 = 1" : "큰 정사각형의 한 변 = 1"}
      </text>
    </svg>
  );
}

export default function ShotsGridViz() {
  return (
    <SceneShell
      eyebrow="넓이로 보는 확률"
      title="중간값 0.5가 400번 중 100번이 되기까지"
      description="칸 하나가 후보 하나입니다. 칸의 한 변이 중간값이고, 칸의 넓이가 측정 확률입니다."
      ariaLabel="중간값 0.5를 제곱해 확률 0.25를 얻고 400회 반복의 기대 횟수 100회에 이르는 과정"
      scenes={SCENES}
      render={(active) => <Grid active={active} />}
    />
  );
}
