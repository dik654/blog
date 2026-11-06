import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 1780=100일 때 1840년 노동자당 산출 146, 실질임금 112.
 * 양 끝 값만 본문에 있어 그 사이는 점선입니다.
 * 산수: 146−112=34, 12/46≈0.26, 1.46^(1/60)≈1.0063, 1.12^(1/60)≈1.0019.
 */
const SCENES = [
  { label: "같은 출발", summary: "1780년 = 100", note: "단위가 다른 두 계열을 비교하려고 1780년을 둘 다 100으로 맞춥니다." },
  { label: "60년 뒤", summary: "146 vs 112", note: "노동자당 산출은 46% 늘고 실질임금은 12% 올랐습니다. 임금이 오른 폭은 산출이 늘어난 폭의 약 4분의 1입니다." },
  { label: "해마다로 쪼개면", summary: "연 약 0.63% vs 약 0.19%", note: "60년에 걸친 복리로 풀면 산출은 해마다 약 0.63%, 임금은 약 0.19%입니다. 한 해씩은 작아 보여도 60년 쌓이면 벌어집니다." },
] as const;

const W = 320;
const H = 190;
const LEFT = 30;
const RIGHT = 112;
const TOP = 10;
const BOTTOM = 26;
const V_MIN = 90;
const V_MAX = 155;
const px = (year: number) => LEFT + ((year - 1780) / 60) * (W - LEFT - RIGHT);
const py = (value: number) => TOP + ((V_MAX - value) / (V_MAX - V_MIN)) * (H - TOP - BOTTOM);
const OUTPUT = "#2563eb";
const WAGE = "#d97706";
const MUTED = "#64748b";
const IDLE = "#94a3b8";

export default function IndexGapViz() {
  return (
    <SceneShell
      eyebrow="같은 기준년"
      title="같은 100에서 출발한 산출과 임금이 60년 뒤 146과 112가 됩니다"
      description="생산이 늘어나는 동안 임금은 얼마나 따라갔을까요? 세로는 1780년을 100으로 놓은 지수입니다."
      note="146은 크래프츠·할리의 영국 국내총생산 추정, 112는 파인스타인의 실질임금 지수로 앨런(2009)이 적은 값입니다. 양 끝 값만 있어 사이의 점선은 실제 경로가 아닙니다. 34는 지수의 차이이며 소득의 몫이 아닙니다."
      ariaLabel="1780년을 100으로 놓은 노동자당 산출과 실질임금의 1840년 값"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          <line x1={LEFT} x2={px(1840)} y1={py(100)} y2={py(100)} stroke={IDLE} strokeWidth={1} />
          <text x={LEFT - 5} y={py(100) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={MUTED}>100</text>
          <line x1={px(1780)} x2={px(1780)} y1={py(100)} y2={H - BOTTOM + 4} stroke={IDLE} strokeWidth={1} />
          <line x1={px(1840)} x2={px(1840)} y1={TOP} y2={H - BOTTOM + 4} stroke={IDLE} strokeWidth={1} strokeDasharray="2 3" />
          <text x={px(1780)} y={H - 6} textAnchor="middle" fontSize={12} fill={MUTED}>1780</text>
          <text x={px(1840)} y={H - 6} textAnchor="middle" fontSize={12} fill={MUTED}>1840</text>
          <circle cx={px(1780)} cy={py(100)} r={4} fill={MUTED} />
          {index === 0 && <text x={px(1780) + 10} y={py(100) - 8} fontSize={12} fontWeight={700} fill={MUTED}>산출과 임금 모두 100</text>}
          {index >= 1 && (
            <>
              <line x1={px(1780)} x2={px(1840)} y1={py(100)} y2={py(146)} stroke={OUTPUT} strokeWidth={1.25} strokeDasharray="5 3" />
              <line x1={px(1780)} x2={px(1840)} y1={py(100)} y2={py(112)} stroke={WAGE} strokeWidth={1.25} strokeDasharray="5 3" />
              <circle cx={px(1840)} cy={py(146)} r={4} fill={OUTPUT} />
              <circle cx={px(1840)} cy={py(112)} r={4} fill={WAGE} />
              <text x={px(1840) + 9} y={py(146) - 2} fontSize={13} fontWeight={700} fill={OUTPUT}>산출 146</text>
              <text x={px(1840) + 9} y={py(146) + 14} fontSize={12} fill={OUTPUT}>{index === 2 ? "연 약 0.63%" : "+46%"}</text>
              <text x={px(1840) + 9} y={py(112) - 2} fontSize={13} fontWeight={700} fill={WAGE}>실질임금 112</text>
              <text x={px(1840) + 9} y={py(112) + 14} fontSize={12} fill={WAGE}>{index === 2 ? "연 약 0.19%" : "+12%"}</text>
            </>
          )}
          {index === 1 && (
            <text x={px(1840) + 9} y={py(129) + 4} fontSize={12} fontWeight={700} fill={MUTED}>차이 34</text>
          )}
        </svg>
      )}
    />
  );
}
