import SceneShell from "./SurveillanceSceneShell";

/**
 * 본문 대응: #manipulation-surveillance-case 계산 예 — alert 480건 × 10분 = 4,800분, analyst 4명 × 360분 = 1,440분, Q ≈ 3.33.
 * 하루에 남는 일: 4,800 − 1,440 = 3,360분 = 336건. 같은 유입이 매일 반복된다고 가정하면 1~5일 누적 336·672·1,008·1,344·1,680건.
 * Q = 1 경계(다른 둘은 그대로): alert 1,440/10 = 144건, 건당 1,440/480 = 3분, 인원 4,800/360 ≈ 13.3 → 14명.
 */
const ALERTS = 480;
const MIN_PER = 10;
const ANALYSTS = 4;
const MIN_EACH = 360;
const NEED = ALERTS * MIN_PER;
const HAVE = ANALYSTS * MIN_EACH;
const Q = NEED / HAVE;
const LEFT_PER_DAY = (NEED - HAVE) / MIN_PER;
const DAYS = [1, 2, 3, 4, 5] as const;
const fmt = (v: number) => v.toLocaleString("en-US");

const LEVERS = [
  { name: "하루 alert", from: `${ALERTS}건`, to: `${HAVE / MIN_PER}건` },
  { name: "건당 검토", from: `${MIN_PER}분`, to: `${HAVE / ALERTS}분` },
  { name: "analyst", from: `${ANALYSTS}명`, to: `${Math.ceil(NEED / MIN_EACH)}명 (${(NEED / MIN_EACH).toFixed(1)})` },
] as const;

const SCENES = [
  { label: "하루 필요 vs 가용", summary: `Q = ${fmt(NEED)} / ${fmt(HAVE)} ≈ ${Q.toFixed(2)}`, note: `부하 Q는 하루 필요 검토시간을 analyst 가용시간으로 나눈 값입니다. 필요 시간은 alert ${ALERTS}건 × 건당 ${MIN_PER}분 = ${fmt(NEED)}분, 가용 시간은 analyst ${ANALYSTS}명 × ${MIN_EACH}분 = ${fmt(HAVE)}분입니다. 필요한 시간이 가용 시간의 ${Q.toFixed(2)}배입니다.` },
  { label: "남는 일이 쌓입니다", summary: `하루 ${fmt(LEFT_PER_DAY)}건씩 누적`, note: `하루에 처리하지 못한 ${fmt(NEED - HAVE)}분은 alert ${fmt(LEFT_PER_DAY)}건입니다. (가정) 같은 유입이 매일 반복되면 5일 뒤 대기열은 ${fmt(LEFT_PER_DAY * 5)}건입니다. Q가 1보다 크면 queue가 줄지 않고 계속 쌓입니다.` },
  { label: "Q ≤ 1이 되는 경계", summary: "threshold · workflow · 인력", note: "다른 두 값을 그대로 둔 산술 경계입니다. 건당 3분으로 품질을 유지할 수 있는지, 평균이 맞아도 P95 queue age와 고위험 miss가 괜찮은지는 따로 확인합니다. Q는 위법 판단이나 신고 조건이 아닙니다." },
] as const;

const W = 360;
const H = 204;
const BX = 70;
const BW = 270;
const bar = (min: number) => (min / NEED) * BW;

export default function AlertQueueBacklogViz() {
  return (
    <SceneShell
      eyebrow="Review capacity"
      title="하루 alert 480건을 analyst 4명이 보면 남는 일이 매일 쌓입니다"
      description="본문 계산 예(alert 480건, 건당 10분, analyst 4명 × 360분)를 그대로 씁니다. 막대 길이는 분 단위 시간입니다."
      ariaLabel="alert 검토 필요시간과 가용시간, 누적 대기열, Q가 1이 되는 경계"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={4} y={30} fontSize={10} fontWeight={700} fill="#334155">필요</text>
          <rect x={BX} y={20} width={bar(NEED)} height={14} fill="#d97706" opacity={0.85} />
          <text x={BX + bar(NEED) - 4} y={31} textAnchor="end" fontSize={10} fontWeight={700} fill="#ffffff">{fmt(NEED)}분</text>
          <text x={4} y={56} fontSize={10} fontWeight={700} fill="#334155">가용</text>
          <rect x={BX} y={46} width={bar(HAVE)} height={14} fill="#2563eb" opacity={0.85} />
          <text x={BX + bar(HAVE) + 4} y={57} fontSize={10} fontWeight={700} fill="#1d4ed8">{fmt(HAVE)}분</text>
          <rect x={BX + bar(HAVE)} y={46} width={bar(NEED) - bar(HAVE)} height={14} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" opacity={active >= 1 ? 1 : 0} />
          {active >= 1 && <text x={BX + bar(NEED) - 4} y={74} textAnchor="end" fontSize={9} fill="#b45309">못 본 {fmt(NEED - HAVE)}분 = {fmt(LEFT_PER_DAY)}건</text>}

          {active === 0 && (
            <g>
              <text x={W / 2} y={128} textAnchor="middle" fontSize={20} fontWeight={700} fill="#0f172a">Q ≈ {Q.toFixed(2)}</text>
              <text x={W / 2} y={150} textAnchor="middle" fontSize={10} fill="#64748b">1보다 크면 평균 유입이 처리용량보다 큼</text>
            </g>
          )}

          {active === 1 && (
            <g>
              <text x={4} y={98} fontSize={10} fontWeight={700} fill="#334155">누적 대기 (가정: 매일 같은 유입)</text>
              {DAYS.map((d, i) => {
                const v = LEFT_PER_DAY * d;
                const h = (v / (LEFT_PER_DAY * 5)) * 70;
                const x = 70 + i * 56;
                return (
                  <g key={d}>
                    <rect x={x} y={180 - h} width={34} height={h} fill="#d97706" opacity={0.75} />
                    <text x={x + 17} y={176 - h} textAnchor="middle" fontSize={9} fontWeight={700} fill="#92400e">{fmt(v)}</text>
                    <text x={x + 17} y={194} textAnchor="middle" fontSize={9} fill="#64748b">{d}일</text>
                  </g>
                );
              })}
              <line x1={64} x2={W - 8} y1={180} y2={180} stroke="#94a3b8" strokeWidth={1} />
            </g>
          )}

          {active === 2 && (
            <g>
              <text x={4} y={98} fontSize={10} fontWeight={700} fill="#334155">하나만 바꿔 Q ≤ 1로 만들려면</text>
              {LEVERS.map((lv, i) => {
                const y = 122 + i * 26;
                return (
                  <g key={lv.name}>
                    <text x={4} y={y + 4} fontSize={10} fill="#334155">{lv.name}</text>
                    <text x={120} y={y + 4} fontSize={11} fontWeight={700} fill="#b45309">{lv.from}</text>
                    <text x={170} y={y + 4} fontSize={11} fill="#64748b">→</text>
                    <text x={190} y={y + 4} fontSize={11} fontWeight={700} fill="#1d4ed8">{lv.to}</text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      )}
    />
  );
}
