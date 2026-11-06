import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";
import { PlotAxes, PlotLegend } from "./PlotParts";
import { linePath, sample } from "./plotHelpers";

/**
 * 본문 대응: #error. x′=−x, x₀=1.
 * 첫 걸음 결손 e^(−.5)−.5≈.1065. 다음 걸음: 정확한 .6065에서 출발했다면 .3033, 새 결손 .0646.
 * 앞 결손 .1065×.5=.0533이 전해져 끝 오차 .0646+.0533=.1179(=.3679−.25).
 * 표: h=.5/.25/.2/.1 → δ .1065/.0288/.0187/.0048, E .1179/.0515/.0402/.0192.
 */
const exact = (t: number) => Math.exp(-t);
const sx = (t: number) => 38 + 204 * t;
const sy = (x: number) => 192 - 170 * x;

const ROWS = [
  { h: 0.5, steps: 2 },
  { h: 0.25, steps: 4 },
  { h: 0.2, steps: 5 },
  { h: 0.1, steps: 10 },
].map(({ h, steps }) => ({ h, steps, delta: Math.exp(-h) - (1 - h), total: Math.exp(-1) - (1 - h) ** steps }));

const SCENES = [
  { label: "한 번 놓친 굽음", summary: "한 단계 결손 ≈ 0.1065", note: "정확한 출발점에서 접선으로 0.5초 움직이면 0.5에 닿습니다. 같은 시각의 정확한 값 약 0.6065와의 차이가 한 단계 결손입니다." },
  { label: "틀린 자리에서 다음 걸음", summary: "0.0646 + 0.0533 ≈ 0.1179", note: "두 번째 걸음은 이미 틀린 0.5에서 출발합니다. 이 걸음이 새로 놓친 약 0.0646에 앞 결손이 절반(배율 0.5)으로 전해진 약 0.0533이 더해져 전체 오차가 약 0.1179가 됩니다." },
  { label: "간격별 두 오차", summary: "h=0.2→0.1: 전체 오차 비율 약 0.478", note: "간격을 줄이면 한 단계 결손은 빠르게 작아지고 단계 수는 늘어납니다. 그래서 전체 오차는 한 단계 결손보다 느리게 줄어듭니다. 이 한 사례의 비교로 모든 문제의 수렴 차수를 입증한 것은 아닙니다." },
] as const;

function Chart({ active }: { active: number }) {
  const second = active === 1;
  return (
    <>
      <PlotAxes sx={sx} sy={sy} xTicks={[0, 0.5, 1]} yTicks={[0, 0.5, 1]} xLabel="시간(초)" yLabel="양" xMax={1} yBottom={0} yTop={1} />
      <path d={linePath(sample(exact, 0, 1), sx, sy)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" />
      <path d={`M${sx(0)} ${sy(1)}L${sx(0.5)} ${sy(0.5)}`} stroke="#2563eb" strokeWidth={1.25} fill="none" />
      <circle cx={sx(0)} cy={sy(1)} r={3.2} fill="#2563eb" />
      <circle cx={sx(0.5)} cy={sy(0.5)} r={3.2} fill="#2563eb" />
      {!second && (
        <g>
          <line x1={sx(0.5)} x2={sx(0.5)} y1={sy(exact(0.5))} y2={sy(0.5)} stroke="#d97706" strokeWidth={1.25} />
          <text x={sx(0.5) - 6} y={sy(0.5) + 18} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">결손 0.1065</text>
        </g>
      )}
      {second && (
        <g>
          <path d={`M${sx(0.5)} ${sy(0.5)}L${sx(1)} ${sy(0.25)}`} stroke="#2563eb" strokeWidth={1.25} fill="none" />
          <circle cx={sx(1)} cy={sy(0.25)} r={3.2} fill="#2563eb" />
          <path d={`M${sx(0.5)} ${sy(exact(0.5))}L${sx(1)} ${sy(exact(0.5) / 2)}`} stroke="#16a34a" strokeWidth={1} fill="none" />
          <circle cx={sx(1)} cy={sy(exact(0.5) / 2)} r={2.6} fill="#16a34a" />
          <line x1={sx(1) + 8} x2={sx(1) + 8} y1={sy(exact(1))} y2={sy(exact(0.5) / 2) - 0.8} stroke="#d97706" strokeWidth={1.25} />
          <line x1={sx(1) + 8} x2={sx(1) + 8} y1={sy(exact(0.5) / 2) + 0.8} y2={sy(0.25)} stroke="#dc2626" strokeWidth={1.25} />
          <text x={sx(1) + 13} y={(sy(exact(1)) + sy(exact(0.5) / 2)) / 2 + 2} fontSize={11.5} fontWeight={700} fill="#d97706">새 결손 0.0646</text>
          <text x={sx(1) + 13} y={(sy(exact(0.5) / 2) + sy(0.25)) / 2 + 6} fontSize={11.5} fontWeight={700} fill="#dc2626">전해짐 0.0533</text>
        </g>
      )}
    </>
  );
}

function Bars() {
  const scale = (value: number) => (value / 0.12) * 216;
  return (
    <>
      <text x={4} y={14} fontSize={11.5} fill="#64748b">왼쪽은 간격과 단계 수, 막대는 오차 크기(같은 눈금)</text>
      {ROWS.map(({ h, steps, delta, total }, index) => {
        const y = 24 + index * 49;
        return (
          <g key={h}>
            <text x={4} y={y + 12} fontSize={12} fontWeight={700} fill="#64748b">h={h}</text>
            <text x={4} y={y + 26} fontSize={11.5} fill="#64748b">{steps}단계</text>
            <rect x={52} y={y + 2} width={scale(delta)} height={13} rx={2} fill="#d97706" />
            <text x={56 + scale(delta)} y={y + 12.5} fontSize={11.5} fontWeight={700} fill="#d97706">{delta.toFixed(4)}</text>
            <rect x={52} y={y + 18} width={scale(total)} height={13} rx={2} fill="#2563eb" />
            <text x={56 + scale(total)} y={y + 28.5} fontSize={11.5} fontWeight={700} fill="#2563eb">{total.toFixed(4)}</text>
          </g>
        );
      })}
    </>
  );
}

export default function ErrorBuildupViz() {
  return (
    <SceneShell
      eyebrow="한 단계와 전체"
      title="한 번 놓친 굽음이 다음 걸음으로 전해져 전체 오차가 됩니다"
      description="한 단계 결손은 정확한 값에서 출발한 한 번의 오차이고, 전체 오차는 계산값과 같은 시각의 정확한 값 사이 차이입니다. x′=−x, x(0)=1의 Euler 계산입니다."
      ariaLabel="한 단계 결손과 전체 오차의 관계"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) => (
            <div key={scene.label}>
              <PlotLegend items={index === 0 ? [{ label: "정확한 경로", color: "#64748b", kind: "dash" }, { label: "Euler 계산", color: "#2563eb", kind: "dot" }] : index === 1 ? [{ label: "정확한 경로", color: "#64748b", kind: "dash" }, { label: "Euler 계산", color: "#2563eb", kind: "dot" }, { label: "정확한 값에서 다시 출발", color: "#16a34a" }] : [{ label: "첫 한 단계 결손", color: "#d97706", kind: "box" }, { label: "t=1의 전체 오차", color: "#2563eb", kind: "box" }]} />
              <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
                {index < 2 ? <Chart active={index} /> : <Bars />}
              </svg>
            </div>
          ))}
        />
      )}
    />
  );
}
