import SceneShell from "./SceneShell";

/**
 * 본문 대응: #precision-recall — 8개 target mode 중 2개에서만 선명한 sample을 만들면
 * precision은 높고 recall은 낮을 수 있다. target 밖 artifact가 많은 모델과 실패 원인이 다르다.
 * 생성 표본 8개, mode마다 같은 무게로 센 것은 가정이다.
 * 소수 mode 복제: P = 8/8, R = 2/8. target 밖 artifact: P = 4/8, R = 4/8.
 */
type Point = readonly [number, number];

const CX = 130;
const CY = 92;
const RING = 62;
const MODE_R = 17;
const MODES: readonly Point[] = Array.from({ length: 8 }, (_, k) => {
  const angle = (k * Math.PI) / 4 - Math.PI / 2;
  return [CX + RING * Math.cos(angle), CY + RING * Math.sin(angle)] as const;
});

const near = (mode: number, dx: number, dy: number): Point => [MODES[mode][0] + dx, MODES[mode][1] + dy];

const COLLAPSE: readonly Point[] = [
  near(0, -6, -5), near(0, 6, -4), near(0, -5, 6), near(0, 6, 6),
  near(1, -6, -5), near(1, 6, -4), near(1, -5, 6), near(1, 6, 6),
];
const ARTIFACT: readonly Point[] = [
  near(0, 0, 0), near(2, 0, 0), near(4, 0, 0), near(6, 0, 0),
  [CX - 16, CY - 10], [CX + 14, CY + 12], [24, 22], [236, 168],
];

const SCENES = [
  { label: "목표 영역 8곳", summary: "R의 mode 8개 · 생성 표본 없음", points: [] as readonly Point[], note: "파란 원 8개가 reference R이 놓인 영역입니다. 원마다 target 질량이 같다고 두고(가정) 생성 표본이 원을 얼마나 덮는지로 recall을 셉니다." },
  { label: "소수 mode 복제", summary: "precision 8/8 · recall 2/8", points: COLLAPSE, note: "생성 표본 8개(가정)가 모두 원 안에 있어 precision은 8/8입니다. 그러나 덮인 원은 2개뿐이라 recall은 2/8입니다. 높은 precision과 낮은 recall이 함께 나오는, mode collapse와 호환되는 모양입니다." },
  { label: "target 밖 artifact", summary: "precision 4/8 · recall 4/8", points: ARTIFACT, note: "같은 수 8개(가정)를 넓게 흩뜨렸지만 4개가 원 밖에 떨어졌습니다. 덮인 원은 4개라 recall 4/8, precision도 4/8입니다. 앞 장면과 실패 원인이 달라 고칠 축도 다릅니다." },
] as const;

function inside(point: Point) {
  return MODES.some(([mx, my]) => (point[0] - mx) ** 2 + (point[1] - my) ** 2 <= MODE_R ** 2);
}
function coveredModes(points: readonly Point[]) {
  return MODES.filter(([mx, my]) => points.some((p) => (p[0] - mx) ** 2 + (p[1] - my) ** 2 <= MODE_R ** 2)).length;
}

function Ratio({ label, hit, total, color }: { label: string; hit: number; total: number; color: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${total === 0 ? 0 : (hit / total) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{total === 0 ? "−" : `${hit}/${total}`}</span>
    </div>
  );
}

export default function PrecisionRecallModesViz() {
  return (
    <SceneShell
      eyebrow="Precision · recall"
      title="생성 표본이 원 안에 있는지와 원을 몇 개 덮는지는 다른 질문입니다"
      description="파란 원은 reference R의 feature 영역(mode), 주황 사각형은 생성 표본 G입니다. Precision은 사각형 중 원 안에 든 비율, recall은 원 중 사각형이 하나라도 닿은 비율입니다. 표본 수와 위치는 설명용 가정입니다."
      ariaLabel="8개 target mode에서 생성 표본 배치에 따라 달라지는 precision과 recall"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const points = scene.points;
        const inCount = points.filter(inside).length;
        const covered = coveredModes(points);
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
              <svg viewBox="0 0 260 184" className="mx-auto h-auto w-full max-w-[340px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
                {MODES.map(([mx, my], k) => {
                  const hit = points.some((p) => (p[0] - mx) ** 2 + (p[1] - my) ** 2 <= MODE_R ** 2);
                  return (
                    <circle key={k} cx={mx} cy={my} r={MODE_R} fill={hit ? "#bfdbfe" : "#eff6ff"} stroke="#2563eb" strokeWidth={hit ? 1.25 : 1} strokeDasharray={hit ? undefined : "3 2"} />
                  );
                })}
                {points.map((p, i) => {
                  const ok = inside(p);
                  return ok ? (
                    <rect key={i} x={p[0] - 4} y={p[1] - 4} width={8} height={8} rx={1.5} fill="#f97316" />
                  ) : (
                    <g key={i}>
                      <rect x={p[0] - 4} y={p[1] - 4} width={8} height={8} rx={1.5} fill="none" stroke="#dc2626" strokeWidth={1.25} />
                      <line x1={p[0] - 3} y1={p[1] - 3} x2={p[0] + 3} y2={p[1] + 3} stroke="#dc2626" strokeWidth={1} />
                    </g>
                  );
                })}
              </svg>
              <div className="min-w-0 space-y-2">
                <Ratio label="precision" hit={inCount} total={points.length} color="#f97316" />
                <Ratio label="recall" hit={covered} total={MODES.length} color="#2563eb" />
                <p className="pt-1 text-xs leading-5 text-muted-foreground">
                  ■ 원 안 표본 · □ 원 밖 표본 · 진한 원 = 덮인 mode · 점선 원 = 놓친 mode
                </p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
