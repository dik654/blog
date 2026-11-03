import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "다섯 행",
  "선택·집계",
  "문장 고정",
  "8칸 확장",
  "sumcheck",
  "한 점 평가",
  "opening",
  "검증 경계",
] as const;

const SCENES = [
  {
    question: "검증하려는 SQL 결과는 어떤 작은 사례에서 시작할까요?",
    answer: "공식 test의 다섯 행을 그대로 씁니다. b=99인 앞 네 행만 선택해 c를 더하면 410이고, 선택된 행 수는 4입니다.",
    state: "WHERE b=99 → SUM(c)=410 · COUNT(*)=4",
    confirmed: "Proof는 SQL 문장만이 아니라 구체적인 반환 table 〈410,4〉의 정당성을 확인합니다.",
    next: "다섯 행에서 410과 4가 나온다는 뜻을 식으로 만드는 방법",
    phase: 0,
  },
  {
    question: "WHERE와 SUM·COUNT의 뜻을 가장 단순하게 쓰면 무엇일까요?",
    answer: "각 행의 b가 99이면 selector를 1, 아니면 0으로 둡니다. selector와 c를 곱해 더하면 410이고 selector 자체를 더하면 4입니다.",
    state: "s=[1,1,1,1,0] · Σ(s·c)=410 · Σs=4",
    confirmed: "선택 조건과 결과를 같은 행별 장부로 연결했습니다.",
    next: "이 장부가 다른 query나 다른 결과에 재사용되지 않게 하는 방법",
    phase: 1,
  },
  {
    question: "Prover가 임의수를 보기 전에 무엇을 고정해야 할까요?",
    answer: "현재 코드는 setup hash, 직렬화된 proof plan, 반환 결과, 각 표 길이, 참조 열 commitment, 시작 행과 round message를 순서대로 transcript에 넣습니다.",
    state: "setup → plan → result → lengths → column commitments → messages",
    confirmed: "현재 구현은 하나의 table root가 아니라 필요한 열 commitments와 길이를 직접 transcript에 묶습니다.",
    next: "행이 다섯 개인데 sumcheck가 왜 세 변수를 쓰는지",
    phase: 2,
  },
  {
    question: "다섯 행을 왜 여덟 꼭짓점짜리 공간에 놓을까요?",
    answer: "다섯 위치를 주소로 표현하려면 3 bits가 필요합니다. 그래서 2³=8칸을 만들고, 길이 indicator가 뒤 세 padding 칸을 실제 행처럼 쓰지 못하게 합니다.",
    state: "5 rows → ceil(log₂5)=3 variables → 8 Boolean vertices",
    confirmed: "Padding은 빈 공간일 뿐이며 table length도 검증 문장의 일부입니다.",
    next: "여덟 칸의 합 관계를 모두 보내지 않고 줄이는 방법",
    phase: 3,
  },
  {
    question: "Sumcheck는 여덟 칸을 어떻게 한 점으로 줄일까요?",
    answer: "세 라운드에서 한 변수씩 verifier challenge로 고정합니다. 각 라운드의 일변수 다항식 합이 직전 주장과 맞아야 하므로 전체 합 주장은 마지막 임의점의 값 하나로 압축됩니다.",
    state: "cube sum → r₁ → r₂ → r₃ → claim at r=(r₁,r₂,r₃)",
    confirmed: "Sumcheck는 행 전체를 열지 않고도 잘못된 합을 임의점에서 들킬 가능성이 높게 만듭니다.",
    next: "마지막 한 점의 값이 실제 committed columns에서 왔는지 확인하는 방법",
    phase: 4,
  },
  {
    question: "임의점에서는 무엇을 다시 계산하고 비교할까요?",
    answer: "Verifier는 proof plan을 그 점에서 다시 평가합니다. 반환 result의 MLE 평가와 일치하는지, 그리고 재구성한 sumcheck 식이 마지막 subclaim과 같은지 따로 확인합니다.",
    state: "plan_eval(r)=result_eval(r) · sumcheck_eval(r)=expected_eval(r)",
    confirmed: "‘반환값이 맞다’와 ‘sumcheck가 맞다’는 서로 다른 두 검사입니다.",
    next: "제출된 평가값이 commitment에 속한다는 마지막 확인",
    phase: 5,
  },
  {
    question: "마지막 opening은 꼭 Dory여야 할까요?",
    answer: "아닙니다. QueryProof는 CommitmentEvaluationProof라는 generic 경계를 사용합니다. Dory, HyperKZG, inner-product 계열처럼 그 trait를 구현한 방식이 마지막 batch evaluation proof를 맡을 수 있습니다.",
    state: "QueryProof<CP> · CP::new(...) · CP.verify_batched_proof(...) ",
    confirmed: "Dory는 선택 가능한 opening 방식 중 하나이지 Proof of SQL 전체의 고정 이름이 아닙니다.",
    next: "암호 검증이 성공해도 애플리케이션이 따로 확인할 것",
    phase: 6,
  },
  {
    question: "Proof가 통과하면 최신 데이터와 모든 SQL 의미까지 보장될까요?",
    answer: "아닙니다. 검증자는 같은 plan·result·length·commitments·setup을 썼다는 범위만 확인합니다. 최신 snapshot 선택, commitment 배포, 지원 SQL, privacy와 데이터 가용성은 애플리케이션 정책입니다.",
    state: "cryptographic validity ≠ freshness · availability · universal SQL · automatic ZK",
    confirmed: "Proof의 의미는 검증에 넣은 외부 commitments와 정책의 신뢰 범위를 넘지 않습니다.",
    next: "고정 commit·지원 문법·negative tests·비용을 묶은 release gate",
    phase: 7,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) => `${LABELS[index]}. ${scene.question} ${scene.answer} 이 장면에서 ${scene.confirmed}`,
);

const ROWS = [
  ["0", "99", "101", "1", "101"],
  ["1", "99", "102", "1", "102"],
  ["2", "99", "103", "1", "103"],
  ["3", "99", "104", "1", "104"],
  ["4", "0", "105", "0", "0"],
] as const;

const TRANSCRIPT = ["setup", "plan", "result", "lengths", "columns", "rounds"] as const;
const CHECKS = ["result MLE", "sumcheck", "opening"] as const;

export default function ProofSQLFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="공식 aggregate test · 5행"
      title="410과 4가 committed columns의 query 결과가 되는 길을 따라갑니다"
      description="같은 다섯 행을 유지한 채 selector·transcript·3-round sumcheck·generic opening·외부 정책 경계를 차례로 봅니다."
      note="수치와 query는 sxt-proof-of-sql commit f28544df의 aggregate_exec_test.rs를 따릅니다. 단순 Σ(sᵢcᵢ)는 SQL 의미를 보여 주는 장부이며 실제 구현은 aggregate 열을 beta로 접은 ZeroSum subpolynomial을 사용합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="Proof of SQL 여덟 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div data-viz-scene-stage className="min-h-[66rem] space-y-4 sm:min-h-[57rem] lg:min-h-[44rem] xl:min-h-[41rem]">
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`min-w-0 border px-1 py-2 text-center text-[9px] font-black ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/25 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.45fr)_minmax(15rem,0.55fr)]">
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">지금 생긴 꼬리 질문 · {LABELS[scenes.active]}</p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.question}</h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.answer}</p>
              </article>
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">이 장면의 상태</p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5">{scene.state}</p>
              </article>
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">같은 다섯 행을 끝까지 유지</p>
                <div className="mt-3 overflow-hidden border border-border">
                  <div className="grid grid-cols-5 bg-muted/30 text-center text-[8px] font-black text-muted-foreground">
                    {["row", "b", "c", "s", "s·c"].map((cell) => <div key={cell} className="p-1.5">{cell}</div>)}
                  </div>
                  {ROWS.map((row) => (
                    <div key={row[0]} className="grid grid-cols-5 border-t border-border text-center font-mono text-[9px]">
                      {row.map((cell, index) => (
                        <div key={`${row[0]}-${index}`} className={`p-1.5 ${scene.phase >= 1 && index >= 3 ? "bg-primary/[0.05] font-black" : ""}`}>{cell}</div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[9px] font-black">
                  <div className="border border-border p-2">SUM(c) = 410</div>
                  <div className="border border-border p-2">COUNT(*) = 4</div>
                </div>
              </article>

              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">5행과 8칸을 구별</p>
                <div className="mt-3 grid grid-cols-4 gap-1 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-8">
                  {Array.from({ length: 8 }, (_, index) => (
                    <div
                      key={index}
                      className={`min-w-0 border p-2 text-center font-mono text-[8px] font-black ${
                        index < 5 ? "border-primary/50 bg-primary/[0.05]" : "border-dashed border-border text-muted-foreground"
                      }`}
                    >
                      {index < 5 ? `row ${index}` : "pad"}
                    </div>
                  ))}
                </div>
                <p className="mt-3 break-keep text-[10px] leading-5 text-muted-foreground">
                  {scene.phase >= 3 ? "3개의 Boolean 변수로 8칸을 주소화하고, 길이 5를 나타내는 chi가 padding을 구분합니다." : "행 수가 2의 거듭제곱이 아닐 때도 같은 다항식 공간을 사용합니다."}
                </p>
              </article>
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">Transcript에 먼저 묶이는 순서</p>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  {TRANSCRIPT.map((item, index) => (
                    <div key={item} className={`min-w-0 border p-2 text-center text-[8px] font-black ${scene.phase >= 2 && index <= Math.min(scene.phase + 2, 5) ? "border-primary/55 bg-primary/[0.05]" : "border-border"}`}>
                      {index + 1}. {item}
                    </div>
                  ))}
                </div>
              </article>
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">Verifier의 서로 다른 세 검사</p>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  {CHECKS.map((item, index) => (
                    <div key={item} className={`min-w-0 border p-2 text-center text-[8px] font-black ${scene.phase >= 5 + index ? "border-emerald-500/55 bg-emerald-500/[0.05]" : "border-border"}`}>
                      {index + 1}. {item}
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">새로 확정된 결과</p>
                <p className="mt-2 break-keep text-xs font-semibold leading-5">{scene.confirmed}</p>
              </article>
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300">다음 꼬리 질문</p>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{scene.next}</p>
              </article>
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="Proof of SQL 검증 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
