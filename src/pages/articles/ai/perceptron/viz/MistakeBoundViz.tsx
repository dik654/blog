import SceneShell from "./SceneShell";

/**
 * 본문 대응: #convergence "왜 R/γ의 제곱이 나오는가" — 오답 M번 뒤 정답 방향 전진의 하한 Mγ와
 * 가중치 길이의 상한 R√M이 같은 가중치를 가리키므로 Mγ ≤ R√M이어야 한다.
 * R=2, γ=0.5 → 0.5M = 2√M 에서 M=16. γ=0.25 → 0.25M = 2√M 에서 M=64 (네 배).
 * 17번째 오답 검산: 0.5×17 = 8.5 > 2√17 ≈ 8.25.
 */
const R = 2;
const M_MAX = 80;
const Y_MAX = 24;

const PL = 26;
const PR = 292;
const PT = 10;
const PB = 160;
const px = (m: number) => PL + (m / M_MAX) * (PR - PL);
const py = (y: number) => PB - (y / Y_MAX) * (PB - PT);

const SQRT_PATH = Array.from({ length: M_MAX + 1 }, (_, m) => `${m === 0 ? "M" : "L"}${px(m).toFixed(1)},${py(R * Math.sqrt(m)).toFixed(1)}`).join(" ");

interface Scene {
  label: string;
  summary: string;
  gamma: number;
  shade: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "두 길이가 같은 가중치를 잽니다",
    summary: "R=2, γ=0.5 → 교차점 M=16",
    gamma: 0.5,
    shade: false,
    note: "오답마다 정답 경계 방향으로 적어도 γ씩 전진하므로 그 양은 파란 직선 이상이고, 가중치 전체 길이는 주황 곡선 이하입니다. 한 방향으로 전진한 양은 전체 길이를 넘을 수 없습니다.",
  },
  {
    label: "16회를 넘으면 모순",
    summary: "M=17: 8.5 > 2√17 ≈ 8.25",
    gamma: 0.5,
    shade: true,
    note: "직선은 M에 비례해, 곡선은 √M으로 느리게 오르므로 M=16 뒤로는 직선이 위에 섭니다. 칠한 구간은 Mγ ≤ R√M을 깨므로 오답은 16회를 넘지 못합니다. 실제 횟수가 아니라 최악의 상한입니다.",
  },
  {
    label: "γ만 절반으로 줄이면",
    summary: "γ=0.25 → 교차점 M=64 (네 배)",
    gamma: 0.25,
    shade: true,
    note: "직선 기울기가 절반이 되면 곡선과 만나는 점이 (R/γ)² = 8² = 64로 밀려납니다. γ가 절반이면 상한은 네 배입니다.",
  },
];

export default function MistakeBoundViz() {
  return (
    <SceneShell
      eyebrow="오답 횟수의 상한"
      title="비례해 오르는 하한과 √M으로 오르는 상한이 만나는 곳이 (R/γ)²입니다"
      description="가로축은 오답 횟수 M, 세로축은 길이입니다. 본문 예시 R=2(입력 크기의 상한), γ=0.5(가장 가까운 자료의 여유)를 씁니다."
      ariaLabel="Mγ와 R√M이 만나는 오답 횟수 상한"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cross = (R / scene.gamma) ** 2;
        const lineEndM = Math.min(M_MAX, Y_MAX / scene.gamma);
        const crossY = scene.gamma * cross;
        const shadeTop = Array.from({ length: Math.floor(lineEndM - cross) + 1 }, (_, i) => cross + i).map((m) => `${px(m).toFixed(1)},${py(scene.gamma * m).toFixed(1)}`);
        const shadeBottom = Array.from({ length: Math.floor(lineEndM - cross) + 1 }, (_, i) => cross + i)
          .reverse()
          .map((m) => `${px(m).toFixed(1)},${py(R * Math.sqrt(m)).toFixed(1)}`);
        return (
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4" style={{ backgroundColor: "#2563eb" }} />
                Mγ: 정답 방향 전진의 하한
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4" style={{ backgroundColor: "#d97706" }} />
                R√M: 가중치 길이의 상한
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-3 rounded-sm" style={{ backgroundColor: "#dc2626", opacity: 0.25 }} />
                하한이 상한을 넘는 구간
              </span>
            </div>
            <svg viewBox="0 0 300 190" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 8, 16, 24].map((y) => (
                <g key={y}>
                  <line x1={PL} x2={PR} y1={py(y)} y2={py(y)} stroke="#94a3b8" strokeWidth={y === 0 ? 1 : 0.5} strokeOpacity={y === 0 ? 1 : 0.5} />
                  <text x={PL - 6} y={py(y) + 4} textAnchor="end" fontSize={10} fill="#64748b">
                    {y}
                  </text>
                </g>
              ))}
              {[0, 16, 32, 48, 64, 80].map((m) => (
                <text key={m} x={px(m)} y={PB + 14} textAnchor="middle" fontSize={10} fill="#64748b">
                  {m}
                </text>
              ))}
              <text x={PR} y={PB + 27} textAnchor="end" fontSize={10} fill="#64748b">
                오답 횟수 M
              </text>
              {scene.shade && shadeTop.length > 1 && (
                <polygon points={[...shadeTop, ...shadeBottom].join(" ")} fill="#dc2626" fillOpacity={0.14} />
              )}
              <path d={SQRT_PATH} fill="none" stroke="#d97706" strokeWidth={1.25} />
              <line x1={px(0)} y1={py(0)} x2={px(lineEndM)} y2={py(scene.gamma * lineEndM)} stroke="#2563eb" strokeWidth={1.25} />
              <line x1={px(cross)} x2={px(cross)} y1={py(crossY)} y2={PB} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={px(cross)} cy={py(crossY)} r={3.5} fill="#475569" />
              <text x={px(cross) + 6} y={py(crossY) + 16} fontSize={11} fontWeight={700} fill="#475569">
                M = {cross}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
