import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison-conditions — 가정 숫자. 인상 지역 20→21, 비교 지역 25→23.
 * (21−20)−(23−25)=3. 정책이 없었어도 2 줄었다면 18, 21−18=3.
 */
const X_BEFORE = 66;
const X_AFTER = 256;
const Y0 = 186;
const Y1 = 14;
const VMIN = 16;
const VMAX = 26;
const sy = (v: number) => Y0 - ((v - VMIN) / (VMAX - VMIN)) * (Y0 - Y1);

const SCENES = [
  { label: "두 지역의 변화", summary: "+1 · −2", note: "인상 지역은 20에서 21로, 비교 지역은 25에서 23으로 바뀌었다고 합시다. 처음 평균이 20과 25로 다르다는 사실만으로 계산이 무효가 되지는 않습니다." },
  { label: "변화끼리 뺍니다", summary: "(+1) − (−2) = 3", note: "차이의 차이는 수준이 아니라 변화를 뺍니다. 아직은 계산일 뿐이며 정책효과라고 읽으려면 다음 가정이 필요합니다." },
  { label: "바뀌지 않았을 때의 경로", summary: "20 − 2 = 18 → 21 − 18 = 3", note: "점선은 관측값이 아니라 가정입니다. 정책이 없었어도 인상 지역이 비교 지역처럼 2만큼 줄었다고 놓는 것을 평행추세라고 합니다. 그러면 21과 18의 차이 3을 정책효과로 읽을 수 있습니다." },
  { label: "가정이 어긋나면", summary: "3 안에 다른 영향", note: "인상 지역에만 별도의 수요 증가가 있었다면 3에 그 영향도 섞입니다. 얼마가 섞였는지는 이 네 숫자로 나눌 수 없어 3을 둘로 나누어 그리지 않았습니다." },
] as const;

export default function ParallelTrendViz() {
  return (
    <SceneShell
      eyebrow="차이의 차이"
      title="비교 지역의 변화를 빌려 오면 관측하지 못한 경로가 그려집니다"
      description="가로는 인상 전후, 세로는 평균 고용입니다. 20·21·25·23은 방법을 보이는 별도 가정 숫자이고 세로축은 16부터 그렸습니다(가정)."
      ariaLabel="인상 지역과 비교 지역의 전후 평균과 평행추세 가정의 반사실 경로"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={30} x2={350} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          <text x={X_BEFORE} y={Y0 + 16} textAnchor="middle" fontSize={11} fill="#64748b">인상 전</text>
          <text x={X_AFTER} y={Y0 + 16} textAnchor="middle" fontSize={11} fill="#64748b">인상 후</text>

          <line x1={X_BEFORE} x2={X_AFTER} y1={sy(25)} y2={sy(23)} stroke="#64748b" strokeWidth={1.25} />
          <circle cx={X_BEFORE} cy={sy(25)} r={3.5} fill="#64748b" />
          <circle cx={X_AFTER} cy={sy(23)} r={3.5} fill="#64748b" />
          <text x={X_BEFORE - 8} y={sy(25) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">25</text>
          <text x={X_AFTER + 8} y={sy(23) + 4} fontSize={12} fontWeight={700} fill="#64748b">23 비교 지역</text>

          <line x1={X_BEFORE} x2={X_AFTER} y1={sy(20)} y2={sy(21)} stroke="#2563eb" strokeWidth={1.25} />
          <circle cx={X_BEFORE} cy={sy(20)} r={3.5} fill="#2563eb" />
          <circle cx={X_AFTER} cy={sy(21)} r={3.5} fill="#2563eb" />
          <text x={X_BEFORE - 8} y={sy(20) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">20</text>
          <text x={X_AFTER + 8} y={sy(21) + 4} fontSize={12} fontWeight={700} fill="#2563eb">21 인상 지역</text>

          {active === 1 && (
            <g>
              <text x={(X_BEFORE + X_AFTER) / 2} y={sy(24) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">−2</text>
              <text x={(X_BEFORE + X_AFTER) / 2} y={sy(20.5) + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">+1</text>
            </g>
          )}
          {active >= 2 && (
            <g>
              <line x1={X_BEFORE} x2={X_AFTER} y1={sy(20)} y2={sy(18)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
              <circle cx={X_AFTER} cy={sy(18)} r={3.5} fill="none" stroke="#d97706" strokeWidth={1.25} />
              <text x={X_AFTER + 8} y={sy(18) + 4} fontSize={12} fontWeight={700} fill="#b45309">18 가정</text>
              <line x1={X_AFTER} x2={X_AFTER} y1={sy(21) + 5} y2={sy(18) - 5} stroke="#dc2626" strokeWidth={1.25} />
              <text x={X_AFTER - 7} y={sy(19.5) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">3</text>
              {active === 3 && <text x={X_AFTER + 6} y={sy(16.6)} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">수요 증가가 있었다면 3에 섞임 · 비율 모름</text>}
            </g>
          )}
        </svg>
      )}
    />
  );
}
