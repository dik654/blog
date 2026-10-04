import { useState } from "react";

const lengths = [10, 9, 12];
export default function ThreadAssignmentViz() {
  const [length, setLength] = useState(10);
  const [candidate, setCandidate] = useState(9);
  const block = Math.floor(candidate / 4);
  const local = candidate % 4;
  const valid = candidate < length;
  return <><figure data-viz="thread-assignment" className="my-8 [&_p]:my-0 rounded-xl border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
    <figcaption className="mb-4 font-semibold">같은 네 자리 묶음에서 배열 길이만 바꿔 봅니다</figcaption>
    <div role="group" aria-label="배열 길이 선택" className="mb-5 flex flex-wrap gap-2">
      {lengths.map(n=><button key={n} type="button" aria-pressed={length===n} onClick={()=>setLength(n)} className={`min-h-11 rounded-lg border px-4 py-2 text-sm ${length===n?"border-sky-600 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100":"border-neutral-300 dark:border-neutral-700"}`}>{n}칸</button>)}
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      {[0,1,2].map(b=><div key={b} className="flex min-w-0 items-center gap-3 rounded-lg border border-neutral-200 p-2 sm:block sm:p-3 dark:border-neutral-700">
        <p className="w-16 shrink-0 text-sm font-medium sm:mb-3 sm:w-auto">묶음 {b} · 시작 {b*4}번</p>
        <div role="group" aria-label={`묶음 ${b}의 후보 번호`} className="grid flex-1 grid-cols-4 gap-1">
          {[0,1,2,3].map(t=>{const i=b*4+t;return <button key={i} type="button" aria-label={`후보 ${i}, ${i<length?"배열 안":"배열 밖"}`} aria-pressed={candidate===i} onClick={()=>setCandidate(i)} className={`min-h-11 rounded border text-sm ${candidate===i?"border-sky-600 ring-2 ring-sky-500 ring-offset-1":"border-neutral-200 dark:border-neutral-700"} ${i<length?"bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100":"bg-neutral-100 text-neutral-500 dark:bg-neutral-900"}`}>{i}</button>})}
        </div>
      </div>)}
    </div>
    <div aria-live="polite" className="mt-5 min-h-[195px] sm:min-h-[162px] rounded-lg bg-neutral-50 p-4 text-sm leading-7 dark:bg-neutral-900">
      <p>묶음 {block} × 네 자리 + 내부 위치 {local} = 후보 {candidate}</p>
      <p>{candidate} &lt; {length}은 {valid?"참":"거짓"}입니다.</p>
      <p>{valid?`입력 ${candidate} + ${candidate*10} → 합 ${candidate*11} 기록`:"입력·결과 배열에 접근하지 않습니다."}</p>
      <p>접근 {length}개 · 건너뜀 {12-length}개</p>
    </div>
    </figure><p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가정한 입력은 첫 배열의 값이 번호와 같고 둘째 배열의 값은 그 열 배입니다. 빈 후보를 눌러도 새 데이터가 생기지 않습니다. 장치 실행 시간을 측정한 그림은 아닙니다.</p>
  </>;
}
