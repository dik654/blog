import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stabilization-mechanisms 암호자산 담보형 문단(가정 숫자).
 * 담보 150 / 부채 100 → 150%. 최소 담보비율 130% → 담보 130이 경계선.
 * 담보 120 → 120% < 130%: 처분 조건. oracle이 이전 값 150을 계속 알리면 시스템은 150%로 본다.
 * 90까지 떨어진 뒤 팔면 90 − 100 = −10(비용 전).
 */
const DEBT = 100;
const MIN_RATIO = 1.3;

const SCENES = [
  { label: "담보 150 · 부채 100", summary: "150% ≥ 130%", actual: 150, oracle: 150 as number | null, note: "담보 150달러를 맡기고 토큰 부채 100달러를 만들었습니다(가정). 담보비율은 150÷100=150%로 최소 담보비율 130%보다 높습니다. 부채 100에 130%를 곱한 담보 130달러가 경계선입니다." },
  { label: "담보 120으로 하락", summary: "120% < 130% · 처분 조건", actual: 120, oracle: 120 as number | null, note: "담보가 120달러로 떨어지면 비율은 120%입니다. 최소 담보비율 아래이므로 담보를 처분하는 조건에 걸립니다. 처분은 담보를 팔아 부채를 갚는 절차를 뜻합니다." },
  { label: "oracle이 150을 계속 알림", summary: "실제 120% · 시스템은 150%", actual: 120, oracle: 150 as number | null, note: "가격을 계약에 전달하는 oracle이 이전 값 150을 계속 알리면 계약은 비율을 150%로 계산합니다. 실제로는 처분 조건인데도 대응이 늦어집니다. 담보를 파는 거래가 밀려도 같은 지연이 생깁니다." },
  { label: "90에서 매각", summary: "매각 90 < 부채 100 · 10 부족", actual: 90, oracle: null as number | null, note: "대응이 늦어 담보가 90달러까지 떨어진 뒤 팔면 받은 돈으로 부채 100달러를 다 갚지 못합니다. 매매 비용을 빼기 전에도 10달러가 부족합니다." },
] as const;

const W = 360;
const H = 156;
const X0 = 92;
const X1 = 346;
const MAX = 160;
const x = (value: number) => X0 + (value / MAX) * (X1 - X0);
const ROWS: readonly number[] = [52, 92];

export default function CollateralRatioViz() {
  return (
    <SceneShell
      eyebrow="담보비율과 처분 경계"
      title="담보가 130 아래로 내려가는 순간과 계약이 그것을 아는 순간은 다를 수 있습니다"
      description="막대 길이는 달러 금액입니다. 담보 150·부채 100·최소 담보비율 130%와 가격 경로는 9절의 가정 숫자입니다."
      ariaLabel="담보 가치가 150에서 120, 90으로 내려갈 때 담보비율과 oracle 지연, 매각 부족분"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows = [
          { label: "실제 담보", value: scene.actual, color: scene.actual >= DEBT * MIN_RATIO ? "#16a34a" : "#dc2626" },
          { label: active === 3 ? "매각 대금" : "계약이 본 값", value: active === 3 ? scene.actual : scene.oracle, color: active === 3 ? "#dc2626" : "#2563eb" },
        ];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={x(DEBT)} x2={x(DEBT)} y1={24} y2={118} stroke="#475569" strokeWidth={1} />
            <text x={x(DEBT)} y={18} textAnchor="end" fontSize={10} fontWeight={700} fill="#475569">부채 100</text>
            <line x1={x(DEBT * MIN_RATIO)} x2={x(DEBT * MIN_RATIO)} y1={24} y2={118} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(DEBT * MIN_RATIO) + 2} y={18} fontSize={10} fontWeight={700} fill="#b45309">최소 130</text>
            {rows.map((row, i) => (
              <g key={i}>
                <text x={6} y={ROWS[i] + 4} fontSize={11} fill="#334155">{row.label}</text>
                {row.value === null ? (
                  <text x={X0} y={ROWS[i] + 4} fontSize={11} fill="#94a3b8">—</text>
                ) : (
                  <>
                    <rect x={X0} y={ROWS[i] - 10} width={x(row.value) - X0} height={20} rx={2} fill={row.color} fillOpacity={0.85} />
                    <text x={x(row.value) - 4} y={ROWS[i] + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#ffffff">{row.value}</text>
                  </>
                )}
              </g>
            ))}
            {active === 3 && (
              <>
                <rect x={x(90)} y={ROWS[1] - 10} width={x(DEBT) - x(90)} height={20} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
                <text x={x(DEBT) + 4} y={ROWS[1] + 4} fontSize={10} fontWeight={700} fill="#dc2626">10 부족</text>
              </>
            )}
            <line x1={X0} x2={X1} y1={124} y2={124} stroke="#94a3b8" strokeWidth={1} />
            {[0, 50, 100, 150].map((v) => (
              <text key={v} x={x(v)} y={139} textAnchor={v === 0 ? "start" : "middle"} fontSize={10} fill="#64748b">{v}</text>
            ))}
            <text x={X1} y={153} textAnchor="end" fontSize={10} fill="#64748b">달러</text>
          </svg>
        );
      }}
    />
  );
}
