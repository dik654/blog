import SceneShell from "./SceneShell";

/**
 * 본문 대응: #optimistic 둘째 문단 — 1024단계 실행 기록을 매번 절반으로 줄이는 단순 모델.
 * 남은 단계 1024→512→…→1, 열 번. 처음 갈라지는 단계를 701번째로 둔 것은 그림을 위한 가정.
 */
const N = 1024;
const SPLIT = 700; // 0부터 센 위치 → 701번째 단계 (가정)
const ROUNDS = 10;

const INTERVALS = Array.from({ length: ROUNDS }).reduce<{ lo: number; hi: number }[]>(
  (acc) => {
    const last = acc[acc.length - 1];
    const mid = (last.lo + last.hi) / 2;
    return [...acc, SPLIT < mid ? { lo: last.lo, hi: mid } : { lo: mid, hi: last.hi }];
  },
  [{ lo: 0, hi: N }],
);

const W = 360;
const LEFT = 30;
const RIGHT = 70;
const ROW = 18;
const TOP = 18;
const H = TOP + INTERVALS.length * ROW + 8;
const sx = (v: number) => LEFT + (v / N) * (W - LEFT - RIGHT);

const SCENES = [
  { label: "시작", summary: "후보 1024단계", shown: 0, note: "함께 인정한 시작 상태와 같은 입력에서 1024개 명령 단계 가운데 어디서 결과가 갈라지는지 아직 모릅니다. 막대 하나가 남은 후보 구간입니다." },
  { label: "1회", summary: "1024 → 512", shown: 1, note: "중간 지점의 상태를 대조해 불일치가 남은 절반만 남깁니다. 후보가 512단계로 줄어듭니다." },
  { label: "2–3회", summary: "512 → 256 → 128", shown: 3, note: "같은 방식으로 두 번 더 줄이면 256, 128단계가 남습니다. 남은 막대가 매번 반으로 짧아집니다." },
  { label: "4–9회", summary: "64 → 32 → … → 2", shown: 9, note: "64, 32, 16, 8, 4, 2단계로 이어집니다. 아홉 번 뒤에는 두 단계만 남습니다." },
  { label: "10회", summary: "한 단계 → 계약이 확인", shown: 10, note: "열 번째 축소에서 한 단계가 남고, 계약은 이 작은 단계의 옳고 그름을 확인합니다. 각 응답의 L1 포함 대기와 시간 제한은 이 횟수와 별도로 듭니다." },
] as const;

export default function BisectionNarrowViz() {
  return (
    <SceneShell
      eyebrow="불일치 구간 좁히기"
      title="1024단계 후보가 열 번 만에 한 단계로 줄어듭니다"
      description="가로축은 실행 기록의 1–1024번째 단계, 줄 하나가 축소 1회 뒤 남은 후보 구간입니다. 처음 갈라지는 단계를 701번째로 둔 것은 그림을 위한 가정이며, T1·T2가 실제로 1024개 명령이라는 측정값도 아닙니다."
      ariaLabel="1024단계 후보 구간을 열 번 절반으로 줄여 한 단계를 남기는 과정"
      scenes={SCENES}
      render={(active) => {
        const shown = SCENES[active].shown;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={sx(SPLIT + 0.5)} x2={sx(SPLIT + 0.5)} y1={TOP - 6} y2={H - 4} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            <text x={sx(SPLIT + 0.5) - 4} y={TOP - 6} textAnchor="end" fontSize={11} fill="#b45309">
              701번째 (가정)
            </text>
            <text x={LEFT - 6} y={TOP - 6} textAnchor="end" fontSize={11} fill="#64748b">
              회
            </text>
            {INTERVALS.map((iv, r) => {
              const y = TOP + r * ROW;
              const on = r <= shown;
              const width = Math.max(sx(iv.hi) - sx(iv.lo), 2);
              return (
                <g key={r} opacity={on ? 1 : 0.15}>
                  <text x={LEFT - 6} y={y + 11} textAnchor="end" fontSize={11} fill="#64748b">
                    {r}
                  </text>
                  <line x1={sx(0)} x2={sx(N)} y1={y + 6.5} y2={y + 6.5} stroke="#cbd5e1" strokeWidth={1} />
                  <rect x={sx(iv.lo)} y={y + 1} width={width} height={11} rx={1.5} fill={r === shown ? "#2563eb" : "#94a3b8"} />
                  <text x={W - RIGHT + 6} y={y + 11} fontSize={11} fill={r === shown ? "#2563eb" : "#64748b"} fontWeight={r === shown ? 700 : 400}>
                    {iv.hi - iv.lo}단계
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
