import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["x만 이동", "y만 이동", "방향 (3/5,4/5)", "최대 증가 방향"] as const;
const DIRECTIONS = [
  {x:1,y:0,rate:4,label:"(1,0)"},
  {x:0,y:1,rate:3,label:"(0,1)"},
  {x:.6,y:.8,rate:4.8,label:"(3/5,4/5)"},
  {x:.8,y:.6,rate:5,label:"(4/5,3/5)"},
] as const;
const sx = (x:number) => 50+50*x;
const sy = (y:number) => 20+50*(1-y);
function contour(c:number) {
  let started=false;
  return Array.from({length:161},(_,i)=>{
    const x=i/40; const y=(c-x*x)/3;
    if(y < -3 || y > 1){started=false;return "";}
    const command=started?"L":"M";started=true;
    return `${command}${sx(x)} ${sy(y)}`;
  }).join(" ");
}

export default function SensitivityShapeViz() {
  const scenes=useAnimatedScenes(SCENES.length);const dir=DIRECTIONS[scenes.active];
  return (
    <VizFrame eyebrow="방향과 변화율" title="같은 길이의 네 방향을 같은 점에서 비교합니다" description="가정 f=x²+3y의 (2,−1)에서 시작합니다. 회색 선은 실제 식으로 계산한 같은 함수값의 선이고 화살표는 길이 1인 방향입니다." note="화살표 길이는 방향 비교용입니다. 그만큼 실제로 움직였을 때의 유한 변화가 이 국소 변화율과 같다는 뜻은 아닙니다. 두 좌표축의 눈금 간격은 같습니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="같은 길이의 입력 방향별 변화율" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <svg viewBox="0 0 320 260" className="mx-auto h-auto w-full max-w-[360px]" role="img" aria-label="제곱과 선형 항의 실제 등고선 및 단위 방향 화살표">
          <defs><marker id="sensitivity-unit-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="none" stroke="var(--primary)" strokeWidth="1" /></marker></defs>
          <path d="M50 20V220H268" fill="none" stroke="currentColor" strokeWidth="1" opacity=".35" />
          {[0,1,2,3,4].map(x=><text key={x} x={sx(x)} y="236" textAnchor="middle" fontSize="11" fill="currentColor">{x}</text>)}
          {[-3,-2,-1,0,1].map(y=><text key={y} x="41" y={sy(y)+4} textAnchor="end" fontSize="11" fill="currentColor">{y}</text>)}
          <text x="275" y="223" fontSize="11" fill="currentColor">x</text><text x="46" y="13" fontSize="11" fill="currentColor">y</text>
          {[-3,1,5,9].map(c=><path key={c} d={contour(c)} fill="none" stroke="currentColor" strokeWidth="1" opacity={c===1?.5:.2} />)}
          <path d={`M${sx(2)} ${sy(-1)}L${sx(2+dir.x)} ${sy(-1+dir.y)}`} fill="none" stroke="var(--primary)" strokeWidth="1.25" markerEnd="url(#sensitivity-unit-arrow)" />
          <circle cx={sx(2)} cy={sy(-1)} r="4" fill="var(--background)" stroke="var(--primary)" strokeWidth="1.25" />
          <text x={sx(2)-10} y={sy(-1)+20} textAnchor="middle" fontSize="11" fill="currentColor">(2,−1)</text>
        </svg>
        <div className="flex h-32 flex-col justify-center gap-2 border-t border-border py-4" aria-live="polite">
          <p className="font-mono text-base font-bold">{dir.label} → 변화율 {dir.rate}</p>
          <p className="text-sm leading-6">4×{dir.x}+3×{dir.y}={dir.rate}. {scenes.active===3?"기울기 (4,3)와 같은 방향에서 최대 5입니다.":"이 방향의 두 성분에 입력별 비율 4와 3을 곱해 더합니다."}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
