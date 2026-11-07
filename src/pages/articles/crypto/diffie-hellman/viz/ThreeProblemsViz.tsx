import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names(#security) — DLP·CDH·DDH의 입력과 답, 그리고 풀면 풀리는 방향.
 * 8·19·6·2는 8·19 사례의 값이며 후보 7만 비교용 가정입니다.
 */
const SCENES = [
  { label: "DLP: 횟수를 찾습니다", summary: "8 → 6", note: "공개값 A=8에서 곱한 횟수 a=6을 찾는 문제입니다. 이 값들은 문제의 모양을 보이려는 8·19 사례의 숫자입니다." },
  { label: "CDH: 공유값을 만듭니다", summary: "8, 19 → 2", note: "두 공개값만으로 공유값을 만들어 내는 문제입니다. 비밀 횟수 자체를 답으로 내놓을 필요는 없습니다." },
  { label: "DDH: 후보를 판별합니다", summary: "8, 19, 후보 → 맞다/아니다", note: "후보가 하나 주어졌을 때 그것이 진짜 공유값인지 가립니다. 후보 2라면 맞다, 후보 7(가정)이라면 아니다가 답입니다." },
  { label: "앞 문제를 풀면 뒤 문제가 풀립니다", summary: "DLP → CDH → DDH", note: "8에서 6을 찾으면 19⁶으로 공유값 2를 계산합니다. 공유값을 계산할 수 있으면 그 결과와 후보를 비교해 판정합니다." },
  { label: "반대 방향은 결론나지 않습니다", summary: "DLP가 어려워도 CDH는 미정", note: "DLP가 어렵다는 이유만으로 CDH가 어렵다고 결론낼 수 없습니다. CDH는 어려운데 DDH 판정은 쉬운 공간도 있으므로 보안 주장은 정확한 공간과 문제를 지정해야 합니다." },
] as const;

const PROBLEMS = [
  { code: "DLP", name: "이산로그 문제", given: "A=8", want: "a=6 찾기" },
  { code: "CDH", name: "계산 DH 문제", given: "A=8, B=19", want: "공유값 2 만들기" },
  { code: "DDH", name: "판별 DH 문제", given: "A=8, B=19, 후보", want: "공유값인지 가리기" },
] as const;

function Link({ state }: { state: "dim" | "forward" | "blocked" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-0.5 text-center text-xs leading-5 sm:w-20 sm:flex-col sm:gap-0 sm:py-1">
      <span aria-hidden className={`text-base leading-5 ${state === "dim" ? "text-muted-foreground/50" : state === "blocked" ? "font-bold text-red-700 dark:text-red-400" : "font-bold text-primary"}`}><span className="hidden sm:inline">{state === "blocked" ? "←✕" : "→"}</span><span className="sm:hidden">{state === "blocked" ? "↑✕" : "↓"}</span></span>
      <span className={state === "dim" ? "invisible" : state === "blocked" ? "font-bold text-red-700 dark:text-red-400" : "font-bold text-primary"}>{state === "blocked" ? "반대 방향은 결론 불가" : "풀면 풀림"}</span>
    </div>
  );
}

export default function ThreeProblemsViz() {
  return (
    <SceneShell
      eyebrow="세 가지 계산 문제"
      title="주어진 값과 답이 다른 세 문제, 풀리는 방향은 한쪽입니다"
      description="칸마다 공격자에게 주어진 값과 내놓아야 할 답을 적었습니다. 계산 규칙 5와 23은 세 문제 모두 공개이고, 화살표는 앞 문제의 해법이 뒤 문제를 푼다는 뜻입니다."
      ariaLabel="DLP, CDH, DDH 각각의 입력과 답, 그리고 해법이 이어지는 방향"
      scenes={SCENES}
      render={(active) => (
        <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
          {PROBLEMS.map((problem, index) => {
            const on = active === index || active >= 3;
            return (
              <div key={problem.code} className="contents">
                <div className={`rounded-lg border px-3 py-2 ${on ? "border-primary bg-background" : "border-border/50 opacity-50"}`}>
                  <p className="text-sm font-bold">{problem.code} <span className="text-xs font-normal text-muted-foreground">{problem.name}</span></p>
                  <dl className="mt-1.5 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-1 gap-y-0.5 text-xs leading-5 sm:block">
                    <dt className="text-muted-foreground">주어진 값</dt>
                    <dd className="font-mono sm:mb-1.5">{problem.given}</dd>
                    <dt className="text-muted-foreground">답</dt>
                    <dd className="font-semibold">{problem.want}</dd>
                  </dl>
                </div>
                {index < 2 && <Link state={active === 3 ? "forward" : active === 4 ? "blocked" : "dim"} />}
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
