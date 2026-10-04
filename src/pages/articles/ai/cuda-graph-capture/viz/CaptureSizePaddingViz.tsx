import {useAnimatedScenes} from "@/components/viz/useAnimatedScenes";
import {AnimatedSceneControls} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
const labels=["5→8","17→24","33→없음"] as const;
const titles=["5토큰 → 8자리","17토큰 → 24자리","33토큰 → 기록 없음"] as const;
const counts=[5,17,33];const sizes=[1,2,4,8,16,24,32];
const notes=[
"실제 5자리와 추가 3자리입니다. 추가/할당은 3/8=37.5%이고 추가/실제는 3/5=60%입니다. 지연 증가율은 별도로 측정합니다.",
"성긴 목록의 32자리 대신 24자리를 고릅니다. 추가 자리는 7개, 할당 자리의 약 29.17%입니다. 더 많은 크기를 준비하는 비용도 생깁니다.",
"33 이상인 준비된 크기가 없습니다. 32짜리 기록으로 실행하지 않습니다. 원문 선택기는 상한을 넘으면 NONE을 돌려줍니다."
];
export default function CaptureSizePaddingViz(){
 const scenes=useAnimatedScenes(3,6000);const s=scenes.active;const n=counts[s];const padded=sizes.find(v=>v>=n);const total=padded??33;
 return <VizFrame eyebrow="크기 선택 · 가정" title="입력이 모두 들어가는 준비된 크기를 찾습니다" description="준비한 목록은 1·2·4·8·16·24·32토큰입니다. 채운 칸은 실제 입력이고 점선 칸은 추가 자리입니다." note="크기 조건만 보여 주는 그림입니다. 실제 재생은 모드와 요청 구성, 추가 자리의 주소·길이 처리도 맞아야 합니다.">
 <div data-viz-canvas role="group" tabIndex={0} onKeyDown={scenes.onKeyDown} aria-label="실제 토큰과 할당 자리 비교" className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
 <div className="flex flex-none flex-col py-1"><h4 className="font-bold">{titles[s]}</h4>
 <svg viewBox="0 0 340 245" role="img" aria-label={titles[s]+"의 실제 자리와 추가 자리"} className="mt-1 h-auto max-h-72 w-full">
 <text x="170" y="25" textAnchor="middle" className="fill-foreground text-[14px]">{padded?"실제 "+n+" · 추가 "+(padded-n):"최대 32보다 1토큰 많음"}</text>
 {Array.from({length:total},(_,i)=><g key={i}><rect x={24+(i%8)*37} y={43+Math.floor(i/8)*32} width="33" height="28" rx="3" className={i<n?"fill-primary/20 stroke-primary":"fill-background stroke-border"} strokeDasharray={i>=n?"3 2":undefined}/><text x={40.5+(i%8)*37} y={63+Math.floor(i/8)*32} textAnchor="middle" className="fill-foreground text-[14px]">{i<n?i+1:"+"}</text></g>)}
 <text x="170" y="230" textAnchor="middle" className="fill-foreground text-[14px]">{padded?"선택 "+padded+" ≥ 실제 "+n:"선택 가능한 크기 없음 → NONE"}</text>
 </svg><p className="mt-1 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{notes[s]}</p></div>
 <AnimatedSceneControls {...scenes} labels={labels}/></div></VizFrame>;
}
