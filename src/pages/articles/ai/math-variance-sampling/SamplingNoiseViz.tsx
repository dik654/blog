import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["중심과 편차", "편차 제곱", "Sample 평균", "1/B 축소", "Gradient estimate"] as const;

export default function SamplingNoiseViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;
  const xs = [150, 250, 250, 350];
  return <VizFrame eyebrow="Animated sampling noise" title="개별 sample의 흔들림과 평균 estimate의 흔들림을 분리한다" description="같은 population에서 sample을 모을수록 center estimate의 분포가 좁아지지만, independence가 깨지면 1/B 축소도 사라집니다." note="Unbiasedness는 평균적으로 방향이 맞다는 뜻입니다. 한 batch의 gradient가 작거나 loss를 반드시 줄인다는 뜻은 아닙니다.">
    <div data-viz-canvas tabIndex={0} role="group" aria-label="variance sample mean gradient estimator 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <svg viewBox="0 0 760 330" className="h-auto w-full" aria-label="값의 편차와 batch 평균 분포가 줄어드는 그림">
        <line x1="90" y1="150" x2="430" y2="150" stroke="currentColor" strokeOpacity=".4" strokeWidth="1" />
        {[0, 1, 2, 3].map(v => <g key={v}><line x1={150 + v * 100} y1="143" x2={150 + v * 100} y2="158" stroke="currentColor" strokeWidth="1" /><text x={150 + v * 100} y="184" textAnchor="middle" fontSize="13" fill="currentColor">{v}</text></g>)}
        {xs.map((x, index) => <circle key={index} cx={x} cy={115 - (index % 2) * 24} r="9" fill={index === 0 || index === 3 ? "#bae6fd" : "#ddd6fe"} stroke="currentColor" strokeWidth="1" />)}
        <line x1="250" y1="70" x2="250" y2="150" stroke="#f97316" strokeDasharray="4 4" strokeWidth="1.1" />
        <text x="250" y="52" textAnchor="middle" fontSize="13" fill="#f97316">μ=1</text>
        <path d="M150 105 Q200 72 250 105 M350 105 Q300 72 250 105" fill="none" stroke="#8b5cf6" strokeWidth="1.1" opacity={active >= 1 ? 1 : .12} />
        <text x="250" y="214" textAnchor="middle" fontSize="13" fill="#8b5cf6" opacity={active >= 1 ? 1 : .12}>square distance → variance</text>
        <line x1="495" y1="278" x2="710" y2="278" stroke="currentColor" strokeOpacity=".4" strokeWidth="1" opacity={active >= 2 ? 1 : .12} />
        {[{x:525,h:64},{x:565,h:112},{x:605,h:148},{x:645,h:112},{x:685,h:64}].map(({x,h},i)=><rect key={x} x={x-13} y={278-h} width="26" height={h} fill={active >= 3 && i !== 2 ? "#dbeafe" : "#bae6fd"} opacity={active >= 2 ? (active >= 3 && i !== 2 ? .35 : .85) : .08} />)}
        <text x="605" y="305" textAnchor="middle" fontSize="13" fill="currentColor" opacity={active >= 2 ? 1 : .15}>distribution of sample means</text>
        <text x="605" y="88" textAnchor="middle" fontSize="13" fill="#0ea5e9" opacity={active >= 3 ? 1 : 0}>Var[X̄_B]=σ²/B</text>
        <g opacity={active >= 4 ? 1 : 0}>
          <path d="M500 145 L565 112 M500 145 L560 160 M500 145 L600 138" fill="none" stroke="#8b5cf6" strokeWidth="1.1" />
          <path d="M500 145 L595 133" fill="none" stroke="#f97316" strokeWidth="1.2" />
          <text x="600" y="126" fontSize="13" fill="#f97316">batch mean gradient</text>
        </g>
      </svg>
      <div className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-5">
        <Fact label="Center" value="μ=E[X]" detail="비교 기준" active={active === 0} />
        <Fact label="Spread" value="E[(X−μ)²]" detail="부호 상쇄 방지" active={active === 1} />
        <Fact label="Estimate" value="X̄_B" detail="B개를 같은 비중으로" active={active === 2} />
        <Fact label="Noise" value="σ²/B" detail="independent일 때" active={active === 3} />
        <Fact label="Training" value="g_B" detail="full gradient의 estimate" active={active === 4} />
      </div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
    </div>
  </VizFrame>;
}

function Fact({ label, value, detail, active }: { label: string; value: string; detail: string; active: boolean }) { return <div className={`border-l pl-4 ${active ? "border-primary" : "border-border"}`}><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-2 font-mono text-sm font-black">{value}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></div>; }
