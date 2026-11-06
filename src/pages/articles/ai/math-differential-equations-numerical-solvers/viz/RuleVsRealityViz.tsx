import SceneShell from "./SceneShell";
import { PlotAxes, PlotLegend } from "./PlotParts";
import { eulerDecay, linePath, sample } from "./plotHelpers";

/**
 * 본문 대응: #why — 외부 보충을 빼먹은 식은 간격을 줄여도 그 잘못이 남는다.
 * 식: x′=−x, x(1)=e⁻¹≈0.3679. 현실(가정): x′=−x+0.25 → x(1)=0.25+0.75e⁻¹≈0.5259.
 * 규칙 차이 ≈0.1580은 h와 무관. 계산 차이: h=.5 → .1179, h=.25 → .0515, h=.1 → .0192.
 */
const rule = (t: number) => Math.exp(-t);
const real = (t: number) => 0.25 + 0.75 * Math.exp(-t);
const sx = (t: number) => 38 + 204 * t;
const sy = (x: number) => 192 - 170 * x;

const SCENES = [
  { label: "간격 0.5", h: 0.5, summary: "계산 차이 0.118 · 규칙 차이 0.158", note: "두 번만 움직이면 끝값은 0.25입니다. 식의 기준값 약 0.368과의 차이는 약 0.118이고, 식과 현실(가정)의 차이는 약 0.158입니다." },
  { label: "간격 0.25", h: 0.25, summary: "계산 차이 0.051 · 규칙 차이 0.158", note: "간격을 줄이면 파란 점이 점선에 가까워집니다. 계산 차이만 약 0.051로 줄고, 점선과 초록 선 사이의 거리는 그대로입니다." },
  { label: "간격 0.1", h: 0.1, summary: "계산 차이 0.019 · 규칙 차이 0.158", note: "계산 차이는 약 0.019가 되었지만 규칙 차이 약 0.158은 움직이지 않습니다. 더 정밀한 계산은 잘못 정한 규칙을 더 충실히 따라갑니다." },
] as const;

export default function RuleVsRealityViz() {
  return (
    <SceneShell
      eyebrow="계산의 차이 · 규칙의 차이"
      title="간격을 줄이면 식에는 가까워지지만 빠뜨린 보충은 남습니다"
      description="가로는 시간, 세로는 남은 양입니다. 식은 x′=−x이고, 현실에는 이 식이 빠뜨린 보충이 초당 0.25만큼 있다고 둡니다(가정). 0.25는 설명을 위해 고른 값입니다."
      ariaLabel="간격을 줄일 때 계산 차이는 줄고 규칙 차이는 남는 모습"
      scenes={SCENES}
      render={(active) => {
        const { h } = SCENES[active];
        const points = eulerDecay(h);
        const end = (1 - h) ** Math.round(1 / h);
        const gapCalc = rule(1) - end;
        const midCalc = sy((rule(1) + end) / 2);
        const midRule = sy((rule(1) + real(1)) / 2);
        return (
          <div>
            <PlotLegend items={[{ label: "현실(보충 포함, 가정)", color: "#16a34a" }, { label: "식의 기준 경로", color: "#64748b", kind: "dash" }, { label: "간격 h로 계산", color: "#2563eb", kind: "dot" }]} />
            <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`간격 ${h}에서 ${SCENES[active].summary}`}>
              <PlotAxes sx={sx} sy={sy} xTicks={[0, 0.5, 1]} yTicks={[0, 0.5, 1]} xLabel="시간(초)" yLabel="남은 양" xMax={1} yBottom={0} yTop={1} />
              <path d={linePath(sample(real, 0, 1), sx, sy)} fill="none" stroke="#16a34a" strokeWidth={1.25} />
              <path d={linePath(sample(rule, 0, 1), sx, sy)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" />
              <path d={linePath(points, sx, sy)} fill="none" stroke="#2563eb" strokeWidth={1} />
              {points.map(([t, x]) => <circle key={t} cx={sx(t)} cy={sy(x)} r={2.8} fill="#2563eb" />)}
              <line x1={sx(1) + 8} x2={sx(1) + 8} y1={sy(real(1))} y2={sy(rule(1))} stroke="#16a34a" strokeWidth={1.25} />
              <line x1={sx(1) + 8} x2={sx(1) + 8} y1={sy(rule(1)) + 1.5} y2={sy(end)} stroke="#2563eb" strokeWidth={1.25} />
              <text x={sx(1) + 13} y={midRule + 2} fontSize={11.5} fontWeight={700} fill="#16a34a">규칙 차이 0.158</text>
              <text x={sx(1) + 13} y={Math.max(midCalc, midRule + 15) + 2} fontSize={11.5} fontWeight={700} fill="#2563eb">계산 차이 {gapCalc.toFixed(3)}</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
