import { useState } from "react";

const stages = [
  { label: "현재 작업", input: "결제 migration · payment-17 실패", check: "새 session이 다음 행동을 고르는 데 필요한가?", output: "schema 수정이라는 next action과 미해결 test를 working state에 남김", note: "목표만 남기고 payment-17을 빼면 새 session은 같은 결정을 복원하지 못할 수 있습니다." },
  { label: "장기 기억", input: "사용자는 한국어 설명을 선호함", check: "여러 session에 쓸 가치·보존 동의·expiry가 있는가?", output: "source와 delete path가 있는 preference만 long-term memory에 저장", note: "이번 migration의 실패 상태와 사용자 선호는 보관 수명이 다릅니다. 한 배열에 같은 만료 규칙으로 넣지 않습니다." },
  { label: "원문 보관", input: "backup artifact://bk-42 · 긴 tool log", check: "요약 뒤에도 원문과 backup을 다시 열어야 하는가?", output: "artifact URI·digest·access scope를 checkpoint에서 참조", note: "압축은 원문 참조를 남기지만 forgetting은 복원 대상을 지웁니다. 두 연산을 같은 삭제로 취급하지 않습니다." },
  { label: "다시 시작", input: "필수 key 6개 중 4개가 복원된 새 context", check: "goal·payment-17·backup·next action이 모두 있는가?", output: "4/6이면 계속 실행하지 않고 원문을 열어 state를 보충", note: "Recall이 높아도 다음 행동이 틀릴 수 있습니다. Resume 평가는 실제 행동 성공까지 함께 봅니다." },
];

export default function MemoryTraceViz() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return (
    <figure data-viz-canvas className="my-8 rounded-xl border p-4 sm:p-6" aria-label="결제 migration 기록의 수명에 따른 저장과 복원 과정">
      <figcaption className="mb-4 text-base font-semibold">payment-17 실패를 새 session이 복원하는 네 단계 · 가정 사례</figcaption>
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
