import { useState } from "react";

const stages = [
  { label: "현재 작업", input: "업무 7 · 목표와 실패한 검사", check: "지금 실행을 계속할 때 필요한가?", output: "다음 행동과 미해결 문제를 working state에 남김", note: "설명용 업무 7의 현재 상태입니다. 실행이 끝나면 폐기하거나 다음 실행이 읽을 checkpoint로 넘길지 결정합니다." },
  { label: "장기 기억", input: "업무 7에서 확인한 사용자 선호", check: "보존 동의·출처·유효기간이 있는가?", output: "조건을 충족한 사실만 memory로 저장", note: "여러 session에 쓸 사실에는 갱신과 삭제 규칙이 필요합니다. 이번 작업에서 잠깐 쓰인 값을 모두 영구 사실로 바꾸지 않습니다." },
  { label: "원문 보관", input: "업무 7의 긴 로그와 수정 파일", check: "나중에 원문을 다시 확인해야 하는가?", output: "외부 artifact에 보관하고 주소·해시로 참조", note: "요약에는 필요한 결론과 원문 위치를 남깁니다. 주소와 해시는 같은 자료인지 확인하는 단서이며 접근 권한은 별도로 검사합니다." },
  { label: "다시 시작", input: "새 context가 읽은 업무 7의 기록", check: "목표·결정·미완료와 원문을 복원했는가?", output: "같은 다음 행동을 수행하는지 replay로 확인", note: "문장을 잘 회상하는지만 보지 않습니다. 새 실행이 실제로 올바른 행동을 이어 가는지 확인해야 resume 품질을 판단할 수 있습니다." },
];

export default function MemoryTraceViz() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return (
    <figure data-viz-canvas className="my-8 rounded-xl border p-4 sm:p-6" aria-label="기록의 수명에 따른 저장과 복원 과정">
      <figcaption className="mb-4 text-base font-semibold">업무 7의 기록은 어디로 가는가 · 가정 사례</figcaption>
      <div className="h-[26rem] sm:h-[22rem]" aria-live="polite">
        <ol className="space-y-2 text-sm leading-6">
          {[["현재 기록", stage.input], ["확인할 조건", stage.check], ["다음 저장·동작", stage.output]].map(([label, value], i) => (
            <li key={label}>
              {i > 0 && <div className="mb-2 pl-4 text-neutral-500" aria-hidden="true">↓</div>}
              <div className="min-h-16 border-l-2 border-sky-400 pl-4"><span className="block font-semibold">{label}</span><span>{value}</span></div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{stage.note}</p>
      </div>
      <div data-viz-controls className="flex flex-wrap gap-2" aria-label="기록 처리 단계">
        {stages.map((item, i) => <button key={item.label} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className="rounded border px-3 py-2 text-sm aria-pressed:border-sky-500 aria-pressed:bg-sky-50 dark:aria-pressed:bg-sky-950">{item.label}</button>)}
      </div>
    </figure>
  );
}
