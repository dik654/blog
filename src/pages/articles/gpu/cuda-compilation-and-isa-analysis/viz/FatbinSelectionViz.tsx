import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
const scenes = [
 {label:"A100 · 둘 다",gpu:"A100 · 8.0",native:true,ptx:true,result:"sm_80 cubin 사용",detail:"같은 major의 sm_80 cubin이 맞습니다. 장치 코드를 바로 읽는 경로라 이 PTX를 JIT할 필요가 없습니다."},
 {label:"H100 · 둘 다",gpu:"H100 · 9.0",native:false,ptx:true,result:"compute_90 PTX를 JIT",detail:"sm_80 cubin은 major가 달라 맞지 않습니다. PTX를 지원하는 driver가 H100용 기계 코드로 변환합니다."},
 {label:"H100 · PTX 없음",gpu:"H100 · 9.0",native:false,ptx:false,result:"실행할 이미지 없음",detail:"sm_80 cubin은 맞지 않고 PTX도 없습니다. 이 함수의 장치 코드를 선택할 수 없어 실행에 실패합니다."},
] as const;
export default function FatbinSelectionViz(){
 const state=useAnimatedScenes(scenes.length,2800);const s=scenes[state.active];
 return <div tabIndex={0} onKeyDown={state.onKeyDown} aria-label="배포 이미지와 GPU의 선택" className="my-8 outline-offset-4">
 <figure data-viz="fatbin-selection" className="m-0 flex flex-col rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:p-5" style={{height:"min(670px, calc(100svh - 140px))"}}>
  <figcaption className="mb-3 shrink-0 text-base font-semibold">같은 배포 파일을 어느 GPU가 받습니까?</figcaption>
  <div data-viz-canvas className="min-h-0 flex-1 overflow-y-auto pr-1">
   <div className="rounded-lg border border-neutral-300 p-3 dark:border-neutral-700"><div className="mb-2 text-sm font-semibold">배포 파일의 두 자리</div><div className="grid grid-cols-2 gap-2 text-sm"><div className="rounded border p-2">sm_80 cubin<br/><span className="text-neutral-500">항상 포함</span></div><div className="rounded border p-2">compute_90 PTX<br/><span className="text-neutral-500">{s.ptx?"포함":"빠짐"}</span></div></div></div>
   <svg aria-hidden="true" className="mx-auto h-7 w-6" viewBox="0 0 24 28"><path d="M12 0v23m-5-5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
   <div className="rounded-full border border-sky-400 bg-sky-50 px-4 py-2 text-center text-sm dark:bg-sky-950">대상: {s.gpu}</div>
   <svg aria-hidden="true" className="mx-auto h-7 w-6" viewBox="0 0 24 28"><path d="M12 0v23m-5-5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
   <div className={`rounded-lg border p-3 text-center text-sm font-semibold ${s.native||s.ptx?"border-emerald-500 bg-emerald-50 dark:bg-emerald-950":"border-amber-500 bg-amber-50 dark:bg-amber-950"}`}>{s.result}</div>
   <div aria-live="polite" className="mt-4 min-h-24 text-sm leading-7">{s.detail}</div>
  </div>
  <div data-viz-controls className="mt-3 shrink-0 border-t pt-3">
   <p data-viz-mobile-controls className="text-center text-sm font-semibold sm:hidden">{state.active + 1}. {s.label}</p>
   <div role="group" aria-label="장치와 내용물 선택" className="hidden grid-cols-3 gap-2 sm:grid">{scenes.map((v,i)=><button key={v.label} type="button" aria-pressed={state.active===i} onClick={()=>state.setActive(i)} className={`min-h-11 rounded-md border px-1 py-2 text-xs ${state.active===i?"border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100":"border-neutral-300 dark:border-neutral-700"}`}>{v.label}</button>)}</div>
   <div className="mt-2 grid grid-cols-3 gap-2"><button type="button" onClick={()=>state.setActive(state.active-1)} className="min-h-10 rounded-md border text-xs">이전</button><button type="button" disabled={state.reducedMotion} onClick={()=>state.setPlaying(!state.playing)} className="min-h-10 rounded-md border text-xs disabled:opacity-60">{state.reducedMotion?"재생 꺼짐":state.playing?"일시정지":"재생"}</button><button type="button" onClick={()=>state.setActive(state.active+1)} className="min-h-10 rounded-md border text-xs">다음</button></div>
   <div className="mt-2 text-xs leading-5 text-neutral-500">← → 선택 · Space 재생/정지 · 일반 대상·지원 driver 가정</div>
  </div>
 </figure></div>;
}
