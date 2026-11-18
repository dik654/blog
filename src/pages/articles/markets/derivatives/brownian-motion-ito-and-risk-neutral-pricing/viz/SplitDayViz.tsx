import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 평균 몫은 시간에, 흔들림 몫은 시간의 제곱근에 비례한다.
 * 하루(Δt=1/252)의 한 표준 흔들림 20√Δt≈1.26을 n조각으로 쪼개면 조각마다 1.26/√n,
 * 그 제곱은 1.59/n이라 n조각을 더하면 언제나 1.59. 방향은 서로 지워질 수 있지만 제곱은 모두 양수로 쌓인다.
 * n=1: 1.26·1.59 / n=4: 0.63·0.397 / n=16: 0.315·0.099.
 */
const DAY_MOVE = 20 / Math.sqrt(252);
const DAY_SQUARE = DAY_MOVE ** 2;

const SIGNS: Record<number, readonly number[]> = {
  1: [1],
  4: [1, -1, -1, 1],
  16: [1, 1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, -1, 1],
};

const SCENES = [
  { label: "하루 한 칸", summary: "흔들림 ±1.26 · 제곱 1.59", n: 1, note: "하루(1÷252년)를 한 번에 보면 한 표준 흔들림은 20×√(1/252)≈1.26이고, 그 제곱은 약 1.59입니다." },
  { label: "4조각으로 쪼개기", summary: "조각마다 ±0.63 · 제곱 0.397", n: 4, note: "시간을 4분의 1로 줄이면 평균 몫은 4분의 1이 되지만 흔들림은 2분의 1(0.63)만 줄어듭니다. 위아래가 섞여 움직임은 지워질 수 있어도, 제곱 0.397 네 개를 더하면 다시 1.59입니다." },
  { label: "16조각으로 쪼개기", summary: "조각마다 ±0.31 · 제곱 0.099", n: 16, note: "16조각이면 평균 몫은 16분의 1, 흔들림은 4분의 1입니다. 잘게 쪼갤수록 조각 안에서는 흔들림이 평균 몫보다 상대적으로 더 커지고, 제곱 16개의 합은 여전히 1.59로 남습니다." },
] as const;

const W = 360;
const LEFT = 20;
const RIGHT = 340;
const MID_Y = 58;
const PX_PER_UNIT = 30;
const SQ_Y = 132;
const SQ_H = 18;

function Bar({ label, value, text }: { label: string; value: number; text: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${value * 100}%`, backgroundColor: label.startsWith("평균") ? "#64748b" : "#2563eb" }} />
      </div>
      <span className="text-right font-mono">{text}</span>
    </div>
  );
}

export default function SplitDayViz() {
  return (
    <SceneShell
      eyebrow="시간을 쪼개면"
      title="하루를 잘게 쪼개도 흔들림의 제곱은 1.59로 남습니다"
      description="평균 몫은 시간이 흐르는 만큼 일정하게 붙는 이동이고, 흔들림 몫은 위아래가 정해지지 않은 무작위 이동입니다. 주가 100·연 20%·252일을 그대로 씁니다. 조각마다 크기를 한 표준 흔들림으로 두고 위아래를 예시로 고른 배치라(가정) 제곱의 합이 정확히 1.59로 나오며, 실제 무작위 경로에서는 1.59가 제곱 합의 평균이고 잘게 쪼갤수록 실제 합이 이 값에 가까워집니다."
      ariaLabel="하루를 1, 4, 16조각으로 나눌 때 조각별 흔들림과 제곱의 합"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const n = scene.n;
        const signs = SIGNS[n];
        const step = (DAY_MOVE / Math.sqrt(n)) * PX_PER_UNIT;
        const segW = (RIGHT - LEFT) / n;
        const ys = signs.reduce<number[]>((acc, sign) => [...acc, acc[acc.length - 1] - sign * step], [MID_Y]);
        const points = ys.map((y, i) => `${LEFT + i * segW},${y}`).join(" ");
        const pieceSquare = DAY_SQUARE / n;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 170`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LEFT} y={14} fontSize={12} fill="#64748b">흔들림 몫의 경로 (출발 100, 평균 몫 제외)</text>
              <line x1={LEFT} x2={RIGHT} y1={MID_Y} y2={MID_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={RIGHT} y={MID_Y - 4} textAnchor="end" fontSize={12} fill="#64748b">100</text>
              {signs.map((_, i) => (
                <line key={i} x1={LEFT + (i + 1) * segW} x2={LEFT + (i + 1) * segW} y1={22} y2={96} stroke="#e2e8f0" strokeWidth={1} />
              ))}
              <polyline points={points} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <text x={LEFT} y={110} fontSize={12} fill="#64748b">{`조각 ${n}개 · 조각마다 ±${(DAY_MOVE / Math.sqrt(n)).toFixed(2)}`}</text>
              <text x={RIGHT} y={110} textAnchor="end" fontSize={12} fill="#64748b">{`움직임의 합 ${n === 1 ? "+1.26" : "0"}`}</text>
              <text x={LEFT} y={SQ_Y - 6} fontSize={12} fill="#64748b">흔들림의 제곱 (모두 양수로 쌓임)</text>
              {signs.map((_, i) => (
                <rect key={i} x={LEFT + i * segW} y={SQ_Y} width={segW} height={SQ_H} fill={i % 2 === 0 ? "#d97706" : "#f59e0b"} stroke="#ffffff" strokeWidth={1} />
              ))}
              <text x={LEFT} y={SQ_Y + SQ_H + 14} fontSize={12} fill="#64748b">{`${pieceSquare.toFixed(n === 1 ? 2 : 3)} × ${n}`}</text>
              <text x={RIGHT} y={SQ_Y + SQ_H + 14} textAnchor="end" fontSize={12} fontWeight={700} fill="#b45309">{`합 ${DAY_SQUARE.toFixed(2)}`}</text>
            </svg>
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground">조각 하나의 크기 (하루 한 칸 = 1)</p>
              <Bar label="평균 몫 (∝ 시간)" value={1 / n} text={n === 1 ? "1" : `1/${n}`} />
              <Bar label="흔들림 (∝ √시간)" value={1 / Math.sqrt(n)} text={n === 1 ? "1" : `1/${Math.sqrt(n)}`} />
            </div>
          </div>
        );
      }}
    />
  );
}
