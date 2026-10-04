import {useAnimatedScenes} from "@/components/viz/useAnimatedScenes";
import {AnimatedSceneControls} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const labels=["전체 16조각","미래 가리기","마지막 행 분할"] as const;
const notes=["모든 위치를 허용하면 2×2짜리 16조각, 64칸입니다. 각 행은 1부터 8까지 평균 내어 4.5를 얻습니다.","대각선 위 6조각을 건너뜁니다. 남은 10조각의 40칸 중 미래 4칸도 가려 실제 연결은 36개입니다.","원래 위치 7의 한 행을 3·3·2개로 나눕니다. 부분 평균에 비중 3/8·3/8·2/8을 곱해야 4.5가 됩니다."];
export default function AttentionKernelAnatomyAndBackendsViz(){
 const scenes=useAnimatedScenes(3,6000);const active=scenes.active;
 return <VizFrame eyebrow="가정한 여덟 위치" title="허용한 칸과 계산할 조각을 구별합니다" description="점수는 모두 0, 가져올 값은 1부터 8까지입니다. 숫자 위치는 0부터 셉니다." note="2×2 조각과 3·3·2 분할은 설명용 배치이며 특정 GPU의 지원 모양이나 SM 배정이 아닙니다.">
 <div data-viz-canvas role="group" tabIndex={0} onKeyDown={scenes.onKeyDown} aria-label="같은 여덟 위치의 전체·인과·분할 계산" className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
 <div className="flex flex-none flex-col py-1"><h4 className="font-bold">{labels[active]}</h4>
 <svg viewBox="0 0 340 310" role="img" aria-label={active===2?"마지막 행의 세 부분 평균을 비중으로 합치기":"여덟 행과 여덟 열을 둘씩 묶은 조각 격자"} className="mt-1 h-auto max-h-72 w-full">
 {active<2?<>
 <text x="176" y="20" textAnchor="middle" className="fill-foreground text-[14px]">비교 위치의 값 1 → 8</text>
 {Array.from({length:8},(_,r)=><g key={r}><text x="35" y={66+r*23} textAnchor="end" className="fill-foreground text-[14px]">{r}</text>{Array.from({length:8},(_,c)=>{
 const allowed=active===0||c<=r;const skip=active===1&&Math.floor(c/2)>Math.floor(r/2);
 return <g key={c}><rect x={52+c*23} y={51+r*23} width="23" height="23" className={allowed?"fill-primary/25 stroke-border":skip?"fill-muted/40 stroke-border":"fill-amber-100 stroke-border dark:fill-amber-950"}/>{!allowed&&!skip&&<text x={63.5+c*23} y={67+r*23} textAnchor="middle" className="fill-foreground text-[14px]">×</text>}</g>;
 })}<text x="250" y={66+r*23} className="fill-foreground text-[14px]">{active===0?"4.5":(r+2)/2}</text></g>)}
 {[0,1,2,3,4].map(i=><g key={i} className="stroke-foreground/60" strokeWidth="1.25"><path d={`M${52+i*46} 51V235M52 ${51+i*46}H236`}/></g>)}
 <g className="fill-foreground text-[14px]"><text x="13" y="39">행</text><text x="250" y="39">출력</text><text x="170" y="264" textAnchor="middle">{active===0?"16조각 × 4칸 = 64칸":"10조각 × 4칸 = 40칸"}</text><text x="170" y="290" textAnchor="middle">{active===0?"모든 행의 평균 4.5":"허용 36칸 · 대각선 안 미래 4칸"}</text></g>
 </>:<>
 <text x="170" y="25" textAnchor="middle" className="fill-foreground text-[14px]">원래 위치 7이 읽는 여덟 값</text>
 {[1,2,3,4,5,6,7,8].map((v,i)=><g key={v}><rect x={14+i*39} y="44" width="36" height="38" rx="5" className={i<3?"fill-primary/15 stroke-primary":i<6?"fill-sky-100 stroke-sky-600 dark:fill-sky-950":"fill-amber-100 stroke-amber-600 dark:fill-amber-950"}/><text x={32+i*39} y="69" textAnchor="middle" className="fill-foreground text-[14px]">{v}</text></g>)}
 <path d="M71 88V111M188 88V111M286 88V111" className="stroke-foreground/60"/>
 {[{x:59,mean:"평균 2",weight:"× 3/8"},{x:170,mean:"평균 5",weight:"× 3/8"},{x:281,mean:"평균 7.5",weight:"× 2/8"}].map(s=><g key={s.x}><rect x={s.x-49} y="115" width="98" height="74" rx="8" className="fill-background stroke-border"/><text x={s.x} y="140" textAnchor="middle" className="fill-foreground text-[14px]">{s.mean}</text><text x={s.x} y="169" textAnchor="middle" className="fill-foreground text-[14px]">{s.weight}</text></g>)}
 <path d="M59 190V208H281V190M170 190V224" className="stroke-foreground/60" fill="none"/>
 <text x="170" y="251" textAnchor="middle" className="fill-foreground text-[16px]">합치면 4.5</text><text x="170" y="283" textAnchor="middle" className="fill-foreground text-[14px]">단순 평균 4.833333은 오답</text>
 </>}
 </svg><p className="mt-1 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{notes[active]}</p></div><AnimatedSceneControls {...scenes} labels={labels}/></div></VizFrame>;
}
