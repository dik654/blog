import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 최근 한 달 작업 20개에서 동사를 뽑아
 * 구현·SDK·이벤트·코드 디버깅은 DVA 쪽, 구성·감시·용량·백업·복구·망 진단은 SOA 쪽 점수에 더한다.
 * 비슷하면 지원 공고의 필수 항목과 증명하기 어려운 빈칸을 본다. 먼저 하나를 끝내고 공통 실습을 재사용한다.
 * 동사별 개수(13 : 7, 다른 달 10 : 10)는 모두 가정이다.
 */
type Side = "dva" | "soa";

const DVA_VERBS = ["구현", "SDK", "이벤트", "코드 디버깅"] as const;

const MONTH_A = [
  "구현", "구성", "SDK", "구현", "이벤트", "감시", "코드 디버깅", "구현", "SDK", "백업",
  "구현", "코드 디버깅", "구성", "이벤트", "용량", "구현", "감시", "SDK", "코드 디버깅", "망 진단",
] as const;
const MONTH_B = [
  "구현", "구성", "SDK", "감시", "이벤트", "복구", "코드 디버깅", "구성", "구현", "백업",
  "감시", "코드 디버깅", "용량", "이벤트", "망 진단", "구현", "구성", "SDK", "복구", "구현",
] as const;

const side = (verb: string): Side => ((DVA_VERBS as readonly string[]).includes(verb) ? "dva" : "soa");
const count = (tasks: readonly string[], target: Side) => tasks.filter((verb) => side(verb) === target).length;

const A_DVA = count(MONTH_A, "dva");
const A_SOA = count(MONTH_A, "soa");
const B_DVA = count(MONTH_B, "dva");
const B_SOA = count(MONTH_B, "soa");

const SCENES = [
  { label: "작업 20개에서 동사만 뽑습니다", summary: "제품 이름이 아니라 행동", tasks: MONTH_A, sorted: false, verdict: "", note: "최근 한 달의 작업 20개를 칸 하나씩 놓고, 무엇을 했는지 동사 하나로 줄였습니다. 칸의 동사 배치는 가정입니다." },
  { label: "두 경로로 나눠 셉니다", summary: `DVA ${A_DVA} : SOA ${A_SOA}`, tasks: MONTH_A, sorted: true, verdict: "DVA-C03부터", note: "구현·SDK·이벤트·코드 디버깅은 DVA 쪽, 구성·감시·용량·백업·복구·망 진단은 SOA 쪽에 더합니다. 이 달은 DVA 쪽이 많으므로 DVA-C03을 먼저 봅니다." },
  { label: "(가정) 다른 달: 점수가 비슷하면", summary: `DVA ${B_DVA} : SOA ${B_SOA}`, tasks: MONTH_B, sorted: true, verdict: "지원 공고 필수 항목 · 증명하기 어려운 빈칸으로 결정", note: "점수가 비슷하면 동사 개수로는 정하지 않습니다. 지원 공고의 필수 항목과, 실습으로 증명하기 어려운 빈칸을 보고 고릅니다." },
  { label: "하나를 끝내고 다음 시험으로", summary: "공통 실습 재사용", tasks: MONTH_A, sorted: true, verdict: "첫 시험 → 공통 실습(이벤트 API·단계 배포·경보·복구) → 다음 시험", note: "두 시험을 동시에 시작하지 않습니다. 먼저 하나를 끝내고, 그때 만든 공통 실습을 다음 시험에 다시 씁니다." },
] as const;

const CHIP: Record<Side, string> = {
  dva: "border-[#2563eb] text-[#2563eb] dark:text-[#93c5fd]",
  soa: "border-[#d97706] text-[#b45309] dark:text-[#fbbf24]",
};

function Chips({ tasks, tone }: { tasks: readonly string[]; tone: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-1 sm:grid-cols-5">
      {tasks.map((verb, index) => (
        <span key={index} className={`truncate rounded border px-1 py-1 text-center text-[11px] leading-4 sm:text-xs ${tone ? CHIP[side(verb)] : "border-border text-muted-foreground"}`}>
          {verb}
        </span>
      ))}
    </div>
  );
}

export default function VerbTallyViz() {
  return (
    <SceneShell
      eyebrow="업무 동사 세기"
      title="최근 작업 20개의 동사로 첫 시험을 고릅니다"
      description="칸 하나가 최근 한 달의 작업 하나입니다. 파란 칸은 DVA(개발) 쪽, 주황 칸은 SOA(운영) 쪽 동사입니다. 동사의 개수와 배치는 예시입니다(가정)."
      ariaLabel="작업 20개의 동사를 DVA와 SOA 쪽으로 나눠 세고, 비슷하면 공고로 정하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tasks = scene.tasks as readonly string[];
        if (!scene.sorted) {
          return (
            <div className="min-w-0">
              <Chips tasks={tasks} tone={false} />
            </div>
          );
        }
        const dva = tasks.filter((verb) => side(verb) === "dva");
        const soa = tasks.filter((verb) => side(verb) === "soa");
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: "DVA 쪽", items: dva, tone: "dva" as Side },
                { name: "SOA 쪽", items: soa, tone: "soa" as Side },
              ].map((group) => (
                <div key={group.name} className="min-w-0 rounded-md border border-border p-2">
                  <p className="mb-2 flex items-baseline justify-between text-xs font-semibold">
                    <span>{group.name}</span>
                    <span className={`text-base font-bold ${group.tone === "dva" ? "text-[#2563eb] dark:text-[#93c5fd]" : "text-[#b45309] dark:text-[#fbbf24]"}`}>{group.items.length}</span>
                  </p>
                  <Chips tasks={group.items} tone />
                </div>
              ))}
            </div>
            <p className="rounded-md border border-border px-3 py-2 text-sm font-semibold">{scene.verdict}</p>
          </div>
        );
      }}
    />
  );
}
