import SceneShell from "./SceneShell";

/**
 * 본문 대응: #equivalence-level — 기준값 100.00, 재실행값 100.08(가정).
 * 실제 차이 0.08, 허용 경계 = 절대 0.01 + 상대 0.001 × |100.00| = 0.11 → 이 원소는 통과.
 * 기준값이 0.00이면 상대 몫은 0이 되고 절대 0.01만 남는다(식에서 계산).
 */
const ABS = 0.01;
const REL = 0.001;
const SPAN = 0.2;

const SCENES = [
  { label: "실제 차이부터 잽니다", summary: "|100.00 − 100.08| = 0.08", center: 100, rerun: 100.08, absOn: false, relOn: false, note: "같은 위치의 기준값과 재실행값 사이 거리입니다. 방향은 보지 않으므로 경계도 기준값 양쪽으로 같은 폭을 둡니다." },
  { label: "고정 허용량 0.01을 둡니다", summary: "경계 ±0.01", center: 100, rerun: 100.08, absOn: true, relOn: false, note: "절대 허용 오차는 기준값의 크기와 상관없이 같은 폭입니다. 0.01만으로는 이 원소의 차이 0.08을 덮지 못합니다." },
  { label: "값의 크기에 비례한 몫을 더합니다", summary: "0.01 + 0.10 = 0.11 ≥ 0.08", center: 100, rerun: 100.08, absOn: true, relOn: true, note: "상대 허용 오차 0.001에 기준값 100.00을 곱한 0.10을 더해 경계는 0.11입니다. 0.08이 그 안에 있으므로 이 원소는 통과합니다. 전체 tensor는 모든 원소와 중요 slice를 따로 검사합니다." },
  { label: "기준값이 0 근처인 원소라면", summary: "0.01 + 0.001 × 0 = 0.01", center: 0, rerun: null, absOn: true, relOn: true, note: "같은 식에 기준값 0.00(가정)을 넣으면 비례하는 몫은 0이 됩니다. 이때도 고정 허용량 0.01이 남아 경계가 0으로 사라지지 않습니다." },
] as const;

const W = 360;
const H = 118;
const LEFT = 24;
const RIGHT = 24;
const LINE_Y = 64;
const scale = (W - LEFT - RIGHT) / (2 * SPAN);
const fmt = (value: number) => value.toFixed(2);

export default function ToleranceBandViz() {
  return (
    <SceneShell
      eyebrow="허용 경계 만들기"
      title="고정 허용량과 비례 허용량을 더해 경계를 만듭니다"
      description="가로선은 한 tensor 원소의 값이고 가운데 눈금이 기준값입니다. 색 띠가 통과로 인정하는 범위입니다. 100.00·100.08과 허용 오차 0.01·0.001은 본문의 가정입니다."
      ariaLabel="기준값 주변에 절대 허용 오차와 상대 허용 오차를 더한 통과 범위를 그리고 재실행값이 그 안에 드는지 보는 수직선"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const relPart = scene.relOn ? REL * Math.abs(scene.center) : 0;
        const absPart = scene.absOn ? ABS : 0;
        const tau = absPart + relPart;
        const x = (value: number) => LEFT + (value - scene.center + SPAN) * scale;
        const ticks = [-0.2, -0.1, 0, 0.1, 0.2].map((offset) => scene.center + offset);
        const inside = scene.rerun !== null && Math.abs(scene.rerun - scene.center) <= tau + 1e-9;
        const verdict = scene.rerun === null || !scene.absOn ? null : inside ? "통과" : "경계 밖";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {relPart > 0 && (
                <rect x={x(scene.center - tau)} y={LINE_Y - 14} width={2 * tau * scale} height={28} fill="#93c5fd" opacity={0.55} />
              )}
              {absPart > 0 && (
                <rect x={x(scene.center - absPart)} y={LINE_Y - 14} width={2 * absPart * scale} height={28} fill="#2563eb" opacity={0.75} />
              )}
              <line x1={LEFT} x2={W - RIGHT} y1={LINE_Y} y2={LINE_Y} stroke="#94a3b8" strokeWidth={1} />
              {ticks.map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={LINE_Y - 4} y2={LINE_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={LINE_Y + 30} textAnchor="middle" fontSize={12} fill="#64748b">
                    {fmt(tick)}
                  </text>
                </g>
              ))}
              <line x1={x(scene.center)} x2={x(scene.center)} y1={LINE_Y - 22} y2={LINE_Y + 18} stroke="#0f172a" strokeWidth={1.25} className="dark:stroke-slate-200" />
              <text x={x(scene.center)} y={LINE_Y - 38} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">
                {`기준값 ${fmt(scene.center)}${scene.rerun === null ? " (가정)" : ""}`}
              </text>
              {scene.rerun !== null && (
                <g>
                  <circle cx={x(scene.rerun)} cy={LINE_Y} r={5} fill={verdict === "경계 밖" ? "#dc2626" : verdict === "통과" ? "#16a34a" : "#0f172a"} stroke="#ffffff" strokeWidth={1} />
                  <text x={x(scene.rerun)} y={LINE_Y + 46} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">
                    재실행 100.08
                  </text>
                  <line x1={x(scene.center)} x2={x(scene.rerun)} y1={LINE_Y - 20} y2={LINE_Y - 20} stroke="#64748b" strokeWidth={1} opacity={active === 0 ? 1 : 0} />
                  <text x={(x(scene.center) + x(scene.rerun)) / 2} y={LINE_Y - 24} textAnchor="middle" fontSize={12} fill="#64748b" opacity={active === 0 ? 1 : 0}>
                    0.08
                  </text>
                </g>
              )}
            </svg>

            <div className="mx-auto mt-2 grid max-w-[560px] grid-cols-3 gap-2 text-center text-xs">
              <div className={`rounded-lg border px-1 py-2 ${scene.absOn ? "border-[#2563eb]" : "border-border opacity-30"}`}>
                <span className="block text-muted-foreground">고정 허용량</span>
                <strong className="font-mono">{fmt(ABS)}</strong>
              </div>
              <div className={`rounded-lg border px-1 py-2 ${scene.relOn ? "border-[#93c5fd]" : "border-border opacity-30"}`}>
                <span className="block text-muted-foreground">비례 몫 0.001×|기준값|</span>
                <strong className="font-mono">{fmt(REL * Math.abs(scene.center))}</strong>
              </div>
              <div className="rounded-lg border border-border px-1 py-2">
                <span className="block text-muted-foreground">경계 · 판정</span>
                <strong className="font-mono">
                  {scene.absOn ? fmt(tau) : "−"}
                  {verdict ? ` · ${verdict}` : ""}
                </strong>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
