import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
const labels = ["두 묶음 · 순서대로", "두 묶음 · 겹쳐서", "네 묶음 · 반복"];
export const schedules = [
  [[0,2,7,9],[9,11,16,18]],
  [[0,2,7,9],[2,4,12,14]],
  [[0,2,7,9],[2,4,12,14],[9,11,17,19],[14,16,22,24]],
];
const descriptions = [
  "A가 돌아온 9ms 뒤 B를 보냅니다. 마지막 결과는 18ms에 옵니다.",
  "A를 계산하는 동안 B를 보냅니다. B의 계산은 A가 끝나는 7ms부터 시작하고 결과는 14ms에 옵니다.",
  "자리 두 개를 번갈아 씁니다. A가 돌아온 9ms에 그 자리에 C를 보냅니다. 결과 간격은 5ms이고 네 번째는 24ms에 옵니다.",
];
export default function OrderedPipelineViz() {
  const s = useAnimatedScenes(3, 3200);
  const jobs = schedules[s.active];
  return <figure data-viz="ordered-pipeline" className="my-8 border-y border-border py-4">
    <figcaption className="mb-3 text-sm leading-6">같은 2·5·2ms를 0–24ms 축에서 비교합니다. 이동 통로 두 개와 계산 자리 하나를 가정했습니다.</figcaption>
    <div data-viz-canvas tabIndex={0} role="group" aria-label="작업 순서와 버퍼 재사용 시간표" onKeyDown={s.onKeyDown} className="flex h-[min(590px,calc(100svh-150px))] flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-3">
        {["보내기", "계산", "가져오기"].map((kind,row) => <div key={kind} className="mb-4">
          <p className="mb-2 text-sm">{kind}</p><div className="relative h-9 border-y border-border">
            {jobs.map(([h,hEnd,kEnd,dEnd],j)=>{const start=row===0?h:row===1?kEnd-5:kEnd;const end=row===0?hEnd:row===1?kEnd:dEnd;return <div key={j} style={{left:`${start/24*100}%`,width:`${(end-start)/24*100}%`}} className={`absolute top-0 flex h-9 items-center justify-center border border-primary text-xs ${j%2===0?'bg-primary/15':'bg-background'}`} title={`${String.fromCharCode(65+j)} ${start}–${end}ms`}>{String.fromCharCode(65+j)}</div>})}
          </div>
        </div>)}
        <div className="flex justify-between font-mono text-xs"><span>0</span><span>6</span><span>12</span><span>18</span><span>24ms</span></div>
        <p className="mt-5 text-sm leading-6">{descriptions[s.active]}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs leading-5">{jobs.map(([h,he,ke,de],j)=><p key={j}><strong>{String.fromCharCode(65+j)}</strong> 보내기 {h}–{he}<br/>계산 {ke-5}–{ke}<br/>가져오기 {ke}–{de}ms</p>)}</div>
      </div><AnimatedSceneControls {...s} labels={labels}/>
    </div>
  </figure>;
}
