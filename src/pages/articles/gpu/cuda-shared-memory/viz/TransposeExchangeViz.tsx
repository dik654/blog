import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const scenes = [
  { label: "가져오기", title: "읽는 작업이 값을 공동 공간에 놓습니다", detail: "조각 안 열 3·행 5의 작업이 입력 2371번의 값 7을 읽어 공동 공간의 행 5·열 3에 놓습니다.", values: ["7", "7", "아직 쓰지 않음"] },
  { label: "기다리기", title: "모든 입력이 준비될 때까지 기다립니다", detail: "각 작업은 조각의 나머지 값도 놓습니다. 모두 준비된 뒤에만 다른 작업이 세로 방향으로 읽습니다.", values: ["7", "7 · 준비됨", "아직 쓰지 않음"] },
  { label: "내보내기", title: "다른 작업이 같은 값을 결과에 씁니다", detail: "조각 안 열 5·행 3의 작업이 공동 공간의 행 5·열 3을 읽습니다. 결과 행 3·열 37인 229번에 7을 씁니다.", values: ["7", "7", "7"] },
] as const;
const locations = [
  { name: "입력 표", coordinate: "행 37 · 열 3", offset: "2371번" },
  { name: "공동 공간", coordinate: "행 5 · 열 3", offset: "같은 칸에서 전달" },
  { name: "출력 표", coordinate: "행 3 · 열 37", offset: "229번" },
];
export default function TransposeExchangeViz() {
  const state = useAnimatedScenes(scenes.length, 2600);
  const scene = scenes[state.active];
  return <div tabIndex={0} onKeyDown={state.onKeyDown} aria-label="전치에서 값 하나의 이동" className="my-8 outline-offset-4">
    <figure data-viz="transpose-exchange" className="m-0 flex flex-col rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:p-5" style={{ height: "min(680px, calc(100svh - 140px))" }}>
      <figcaption className="mb-4 shrink-0 text-base font-semibold">64×64 표에서 같은 값 7을 따라갑니다</figcaption>
      <div data-viz-canvas className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-2">
          {locations.map((place,i)=><div key={place.name}>
            {i>0&&<div aria-hidden="true" className="py-1 text-center text-sm leading-none text-neutral-500">↓</div>}
            <div className={`grid min-h-14 grid-cols-[1fr_auto] gap-x-4 rounded-lg border p-2 ${i===state.active?"border-sky-500 bg-sky-50 dark:bg-sky-950":"border-neutral-200 dark:border-neutral-700"}`}>
              <div className="text-sm font-medium">{place.name} · {place.offset}</div>
              <div className="row-span-2 self-center text-sm font-semibold">{scene.values[i]}</div>
              <div className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">{place.coordinate}</div>
            </div>
          </div>)}
        </div>
        <div aria-live="polite" className="mt-4 min-h-32 text-sm leading-7">
          <div className="font-semibold">{scene.title}</div><div className="mt-2">{scene.detail}</div>
        </div>
      </div>
      <div data-viz-controls className="mt-4 shrink-0 border-t border-neutral-200 pt-3 dark:border-neutral-700">
        <p data-viz-mobile-controls className="text-center text-sm font-semibold sm:hidden">{state.active + 1}. {scene.label}</p>
        <div role="group" aria-label="이동 단계 선택" className="hidden grid-cols-3 gap-2 sm:grid">
          {scenes.map((s,i)=><button key={s.label} type="button" aria-pressed={state.active===i} onClick={()=>state.setActive(i)} className={`min-h-10 rounded-md border px-2 py-2 text-xs ${state.active===i?"border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100":"border-neutral-300 dark:border-neutral-700"}`}>{i+1}. {s.label}</button>)}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button type="button" onClick={()=>state.setActive(state.active-1)} className="min-h-10 rounded-md border px-2 text-xs">이전</button>
          <button type="button" disabled={state.reducedMotion} onClick={()=>state.setPlaying(!state.playing)} className="min-h-10 rounded-md border px-2 text-xs disabled:opacity-60">{state.reducedMotion?"재생 꺼짐":state.playing?"일시정지":"재생"}</button>
          <button type="button" onClick={()=>state.setActive(state.active+1)} className="min-h-10 rounded-md border px-2 text-xs">다음</button>
        </div>
        <div className="mt-2 text-xs leading-5 text-neutral-500">← → 단계 이동 · Space 재생/정지 · 주소 계산 예시</div>
      </div>
    </figure>
  </div>;
}
