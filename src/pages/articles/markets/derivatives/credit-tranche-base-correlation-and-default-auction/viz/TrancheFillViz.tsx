import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 구간 손실 = max(min(L, 끝) − 시작, 0).
 * 명목 100 중 바닥 0~10만 그립니다. 손실 7은 본문 값이고 2·5·9는 같은 식을 보이려는 가정입니다.
 * L=2 → 2·0·0, L=5 → 3·2·0, L=7 → 3·4·0, L=9 → 3·4·2.
 */
const TRANCHES = [
  { start: 0, end: 3, color: "#dc2626" },
  { start: 3, end: 7, color: "#d97706" },
  { start: 7, end: 10, color: "#2563eb" },
] as const;

const SCENES = [
  { label: "손실 2 (가정)", summary: "0~3만 2를 잃음", loss: 2, note: "손실이 작으면 바닥의 0~3 구간 안에서 끝납니다. 3~7과 7~10은 손실이 닿지 않아 0입니다. 이 손실 크기는 식을 보이려는 가정입니다." },
  { label: "손실 5 (가정)", summary: "3 + 2 + 0", loss: 5, note: "0~3이 3을 전부 잃은 뒤에야 넘친 2가 3~7 구간으로 들어갑니다. 7~10은 아직 0입니다." },
  { label: "손실 7 (본문)", summary: "3 + 4 + 0 = 7", loss: 7, note: "본문의 경우입니다. 0~3은 min(7,3)−0=3, 3~7은 min(7,7)−3=4로 둘 다 전액을 잃고, 7~10은 max(min(7,10)−7,0)=0입니다." },
  { label: "손실 9 (가정)", summary: "3 + 4 + 2", loss: 9, note: "손실이 7을 넘어야 비로소 7~10 구간이 잃기 시작합니다. 위 구간은 큰 공동 손실에서만 영향을 받는다는 4절의 말이 이 장면입니다." },
] as const;

const lossIn = (loss: number, start: number, end: number) => Math.max(Math.min(loss, end) - start, 0);

const W = 124;
const H = 230;
const TOP = 14;
const BASE = 214;
const UNIT = (BASE - TOP) / 10;
const BOX_X = 26;
const BOX_W = 60;
const y = (value: number) => BASE - value * UNIT;

export default function TrancheFillViz() {
  return (
    <SceneShell
      eyebrow="손실 구간"
      title="손실은 맨 아래 구간부터 차오릅니다"
      description="명목 100인 회사채 묶음에서 손실 0~10 부분만 세로로 그렸습니다. 칸 하나가 한 트랜치(시작점과 끝점 사이만 맡는 계약 구간)이고, 색이 찬 높이가 그 구간이 잃은 금액입니다."
      ariaLabel="포트폴리오 손실 2, 5, 7, 9에서 0~3, 3~7, 7~10 구간이 잃는 금액"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] sm:gap-6">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {TRANCHES.map((tranche) => {
                const filled = lossIn(scene.loss, tranche.start, tranche.end);
                return (
                  <g key={tranche.start}>
                    <rect x={BOX_X} y={y(tranche.end)} width={BOX_W} height={(tranche.end - tranche.start) * UNIT} fill="none" stroke="#94a3b8" strokeWidth={1} />
                    <rect
                      x={BOX_X + 1}
                      y={y(tranche.start + filled)}
                      width={BOX_W - 2}
                      height={filled * UNIT}
                      fill={tranche.color}
                      opacity={0.75}
                      className="transition-all duration-300 motion-reduce:transition-none"
                    />
                  </g>
                );
              })}
              {[0, 3, 7, 10].map((tick) => (
                <text key={tick} x={BOX_X - 6} y={y(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">
                  {tick}
                </text>
              ))}
              <line x1={BOX_X - 4} x2={BOX_X + BOX_W + 6} y1={y(scene.loss)} y2={y(scene.loss)} stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" className="transition-all duration-300 motion-reduce:transition-none" />
              <text x={BOX_X + BOX_W + 8} y={y(scene.loss) + 4} fontSize={12} fontWeight={700} fill="#64748b">
                L={scene.loss}
              </text>
            </svg>
            <ul className="min-w-0 space-y-2 text-xs leading-5 sm:text-sm">
              {[...TRANCHES].reverse().map((tranche) => {
                const filled = lossIn(scene.loss, tranche.start, tranche.end);
                return (
                  <li key={tranche.start} className="rounded-lg border border-border px-2 py-1.5">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold">
                        <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: tranche.color }} />
                        {tranche.start}~{tranche.end} 구간
                      </span>
                      <span className="font-mono font-bold">{filled}/{tranche.end - tranche.start}</span>
                    </span>
                    <span className="block whitespace-nowrap font-mono text-[10px] text-muted-foreground sm:text-xs">
                      max(min({scene.loss},{tranche.end})−{tranche.start},0)={filled}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    />
  );
}
