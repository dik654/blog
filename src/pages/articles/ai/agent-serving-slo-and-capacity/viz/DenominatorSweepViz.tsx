import SceneShell from "./SceneShell";

/**
 * 본문 대응: economics 절의 결론 — X_SLO가 250, 400, 650, 900이면 상한 147k, 229k, 342k, 432k달러.
 * C(X) = (19.25 × 47,304,000 / (10^6/X + 625) − 27,752) / 1.15. 다른 조건은 계산표와 같다.
 */
const cap = (x: number) => ((19.25 * 47_304_000) / (1_000_000 / x + 625) - 27_752) / 1.15;
const POINTS = [250, 400, 650, 900] as const;

const SCENES = [
  { label: "250 tok/s", summary: "상한 약 147k달러", note: "묶음 하나가 4,000 + 625 = 4,625초 걸립니다. 약속을 지키는 출력이 낮으면 3년 동안 만드는 묶음이 적어 쓸 수 있는 돈도 줄어듭니다." },
  { label: "400 tok/s", summary: "상한 약 229k달러", note: "앞의 계산입니다. 400은 측정이 아니라 3절 표에서 어림한 가정입니다." },
  { label: "650 tok/s", summary: "상한 약 342k달러", note: "묶음 하나가 약 1,538 + 625 = 2,163초입니다. 625초는 X_SLO를 바꿔도 줄지 않아 상한이 곧게 늘지 않습니다." },
  { label: "900 tok/s", summary: "상한 약 432k달러 · 1.9배", note: "커뮤니티의 900을 그대로 넣은 값입니다. 400일 때보다 상한이 1.9배 부풀어 같은 장비가 훨씬 싸 보입니다. 900은 요청 하나가 약 9 tok/s를 받던 운영점의 합계입니다." },
] as const;

const W = 360;
const H = 180;
const LEFT = 40;
const RIGHT = 16;
const BASE = 148;
const TOP = 14;
const x = (value: number) => LEFT + (value / 1000) * (W - LEFT - RIGHT);
const y = (value: number) => BASE - (value / 500_000) * (BASE - TOP);
const CURVE = Array.from({ length: 66 }, (_, i) => 250 + i * 10)
  .map((value) => `${x(value).toFixed(1)},${y(cap(value)).toFixed(1)}`)
  .join(" ");

export default function DenominatorSweepViz() {
  return (
    <SceneShell
      eyebrow="분모 바꾸기"
      title="X_SLO 하나만 바꿔도 구입비 상한이 147k에서 432k달러까지 움직입니다"
      description="가로축은 약속을 지키는 총 출력 속도(X_SLO), 세로축은 장비 구입비 상한입니다. 부하, 단가, 수명, 가동률, 전기료는 앞 계산과 같게 두었습니다."
      note="모든 값은 앞 계산의 매개변수에 따른 계산값입니다(가정). 8장 PCIe 서버로 1T MoE를 에이전트 약속 아래 잰 공개 측정은 아직 없습니다."
      ariaLabel="약속을 지키는 총 출력 속도에 따른 장비 구입비 상한 곡선"
      scenes={SCENES}
      render={(active) => {
        const value = POINTS[active];
        const px = x(value);
        const py = y(cap(value));
        const output = 1_000_000 / value;
        const total = output + 625;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {[0, 250_000, 500_000].map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={1} opacity={tick === 0 ? 1 : 0.35} />
                  <text x={LEFT - 5} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick / 1000}k</text>
                </g>
              ))}
              {POINTS.map((point) => (
                <text key={point} x={x(point)} y={BASE + 15} textAnchor="middle" fontSize={11} fontWeight={point === value ? 700 : 400} fill={point === value ? "#2563eb" : "#64748b"}>{point}</text>
              ))}
              <text x={W - RIGHT} y={BASE + 30} textAnchor="end" fontSize={11} fill="#64748b">X_SLO (tok/s)</text>
              <polyline points={CURVE} fill="none" stroke="#94a3b8" strokeWidth={1.25} />
              {POINTS.map((point) => (
                <circle key={point} cx={x(point)} cy={y(cap(point))} r={point === value ? 5 : 3} fill={point === value ? "#2563eb" : "#94a3b8"} />
              ))}
              <line x1={px} x2={px} y1={py} y2={BASE} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
              <text x={value >= 650 ? px - 8 : px + 8} y={value >= 650 ? py - 7 : py + 16} textAnchor={value >= 650 ? "end" : "start"} fontSize={12} fontWeight={700} fill="#2563eb">약 {Math.round(cap(value) / 1000)}k달러</text>
            </svg>
            <div className="mt-3">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-semibold">묶음 하나의 시간 <span className="font-normal text-muted-foreground">(끝 = 4,625초)</span></span>
                <span className="shrink-0 font-mono font-bold">{Math.round(total).toLocaleString("en-US")}초</span>
              </div>
              <div className="mt-1 flex h-4 w-full rounded-sm bg-muted/40">
                <span style={{ width: `${(output / 4625) * 100}%`, backgroundColor: "#2563eb" }} />
                <span style={{ width: `${(625 / 4625) * 100}%`, backgroundColor: "#b45309" }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">파랑 = 출력 생성, 주황 = 미적중 입력 계산 625초</p>
            </div>
          </div>
        );
      }}
    />
  );
}
