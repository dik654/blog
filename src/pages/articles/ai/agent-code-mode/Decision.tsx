const rows = [
  ["API 한 번 조회", "직접 tool call", "program·sandbox overhead가 더 큼"],
  ["소수 단계, 매 단계 의미 판단", "Agent tool loop", "중간 판단이 핵심"],
  [
    "대량 행 filter·sort·group",
    "Code Mode",
    "중간 데이터를 context 밖에서 처리",
  ],
  [
    "독립 tool 병렬 조회",
    "Code Mode 또는 framework 병렬 호출",
    "Promise.all·fan-out에 적합",
  ],
  [
    "결제·삭제·배포",
    "결정적 workflow + 승인",
    "자유 program보다 effect 통제가 우선",
  ],
] as const;

export default function Decision() {
  return (
    <section id="decision" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">언제 쓰고 언제 쓰지 않는가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Code Mode는 direct tool calling을 대체하는 상위 버전이 아니다. 한 요청
          안에서 반복·분기·병렬 처리·대량 데이터 축소가 얼마나 큰지, 그리고 외부
          effect를 얼마나 강하게 통제해야 하는지로 선택한다.
        </p>

        <div data-viz="code-mode-decision-ledger" className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="hidden grid-cols-[1fr_13rem_1.35fr] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>작업</span><span>기본 선택</span><span>이유</span>
          </div>
          <div className="divide-y divide-border/70">
            {rows.map(([task, choice, reason]) => (
              <article key={task} className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[1fr_13rem_1.35fr] md:gap-4">
                <div><span className="text-[11px] font-semibold text-muted-foreground md:hidden">작업</span><p className="text-sm font-semibold">{task}</p></div>
                <div><span className="text-[11px] font-semibold text-muted-foreground md:hidden">기본 선택</span><p className="text-sm">{choice}</p></div>
                <div className="min-w-0"><span className="text-[11px] font-semibold text-muted-foreground md:hidden">이유</span><p className="break-words text-sm text-muted-foreground">{reason}</p></div>
              </article>
            ))}
          </div>
        </div>

        <p className="leading-7">
          실전에서는 혼합이 자연스럽다. agent가 먼저 의미를 판단해 필요한 tool을
          고르고, 대량 처리는 Code Mode program에 맡긴 뒤, 고위험 effect만
          하네스의 승인 checkpoint로 되돌린다. 모델·CPU·DB·policy engine이 각각
          잘하는 일을 맡는 것이 핵심이다.
        </p>
      </div>
    </section>
  );
}
