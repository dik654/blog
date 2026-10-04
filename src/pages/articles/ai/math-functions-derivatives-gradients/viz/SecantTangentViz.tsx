import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["h=1", "h=0.1", "h=0.01", "접선"] as const;
const STEPS = [1, 0.1, 0.01, 0] as const;
const sx = (x: number) => 36 + 52 * x;
const sy = (y: number) => 212 - 6 * y;
const curve = Array.from({length: 109}, (_,i) => { const x=i/20; return `${i===0?"M":"L"}${sx(x)} ${sy(x*x)}`; }).join(" ");

export default function SecantTangentViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const h = STEPS[scenes.active];
  const slope = 6+h;
  const tangent = h === 0;
  const line = `M${sx(1.8)} ${sy(9+slope*(1.8-3))} L${sx(5.2)} ${sy(9+slope*(5.2-3))}`;
  return (
    <VizFrame eyebrow="간격과 변화율" title="두 점을 잇는 선이 한 점의 접선에 가까워집니다" description="제곱 함수의 실제 좌표 (3,9)를 고정하고 옆 점을 움직입니다. 입력 간격은 가정 사례의 1, 0.1, 0.01입니다." note="가로축은 x, 세로축은 x²입니다. 두 축의 화면 배율은 다르므로 화면에서 보이는 각도로 수학적 기울기를 읽지 않습니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="할선에서 접선으로 가는 미분 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <svg viewBox="0 0 360 250" className="mx-auto h-auto w-full max-w-[430px]" role="img" aria-label="실제 좌표로 그린 x 제곱 곡선과 할선 또는 접선">
          <path d="M36 22V212H336" fill="none" stroke="currentColor" strokeWidth="1" opacity=".4" />
          {[1,2,3,4,5].map(x=><text key={x} x={sx(x)} y="229" textAnchor="middle" fontSize="11" fill="currentColor">{x}</text>)}
          {[0,10,20,30].map(y=><text key={y} x="28" y={sy(y)+4} textAnchor="end" fontSize="11" fill="currentColor">{y}</text>)}
          <text x="340" y="216" fontSize="11" fill="currentColor">x</text><text x="30" y="18" fontSize="11" fill="currentColor">x²</text>
          <path d={curve} fill="none" stroke="currentColor" strokeWidth="1.25" opacity=".45" />
          <path d={line} fill="none" stroke="var(--primary)" strokeWidth="1.25" />
          <circle cx={sx(3)} cy={sy(9)} r="4" fill="var(--background)" stroke="var(--primary)" strokeWidth="1.25" />
          {!tangent && <circle cx={sx(3+h)} cy={sy((3+h)**2)} r="3" fill="var(--primary)" />}
          <text x={sx(3)-14} y={sy(9)+19} fontSize="11" textAnchor="middle" fill="currentColor">(3,9)</text>
        </svg>
        <div className="flex h-32 flex-col justify-center gap-2 border-t border-border py-4" aria-live="polite">
          <p className="font-mono text-lg font-bold">{tangent ? "f′(3)=6" : `h=${h} → 차분몫 ${slope}`}</p>
          <p className="text-sm leading-6">{tangent ? "간격을 0으로 나누지 않습니다. 극한으로 얻은 기울기 6의 접선 y=6x−9를 그렸습니다." : `옆 점은 (${3+h}, ${((3+h)**2).toFixed(h===1?0:h===0.1?2:4)})입니다. 두 출력의 차이를 ${h}로 나눕니다.`}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
