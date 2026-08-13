import Math from "@/components/ui/math";
import VizFrame from "@/components/viz/VizFrame";

const lanes = [
  {
    key: "slope",
    group: "Leaky ReLU · PReLU",
    question: "음수에서 gradient가 0이 되는 문제",
    mechanism: "음수 쪽에도 기울기 a를 남긴다",
    formulas: ["a=0.01", "a_i\\;\\text{학습}"],
    result: "dead unit 위험 감소",
    caveat: "PReLU는 channel별 parameter가 늘고, 음수 noise도 통과한다.",
    color: "text-sky-700 dark:text-sky-300",
    border: "border-sky-500/30",
  },
  {
    key: "distribution",
    group: "ELU · SELU",
    question: "활성값의 평균 이동과 분산 변화",
    mechanism: "음수 포화 곡선으로 분포를 제어한다",
    formulas: ["\\alpha(e^x-1)", "\\lambda\\,\\mathrm{ELU}(x)"],
    result: "평균을 0 쪽으로 이동",
    caveat: "SELU의 자기정규화는 초기화·구조·dropout 조건까지 포함한다.",
    color: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-500/30",
  },
  {
    key: "smooth-gate",
    group: "GELU · SiLU · Mish",
    question: "0에서 hard하게 자르는 경계",
    mechanism: "입력 크기로 자기 자신을 부드럽게 gate한다",
    formulas: ["x\\Phi(x)", "x\\sigma(x)"],
    result: "매끄러운 local gradient",
    caveat: "exp·CDF 계열 연산이 들며 어떤 모델에서나 ReLU보다 낫다는 법칙은 없다.",
    color: "text-violet-700 dark:text-violet-300",
    border: "border-violet-500/30",
  },
  {
    key: "two-branch",
    group: "GLU · SwiGLU",
    question: "하나의 projection이 값과 선택을 모두 담당",
    mechanism: "gate branch와 value branch를 따로 만든다",
    formulas: ["\\mathrm{SiLU}(xW_g)", "\\odot\\;xW_v"],
    result: "feature별 조건부 통과",
    caveat: "scalar activation이 아니라 projection 하나가 추가되는 FFN 구조다.",
    color: "text-amber-700 dark:text-amber-300",
    border: "border-amber-500/30",
  },
] as const;

function Arrow() {
  return (
    <div aria-hidden="true" className="hidden items-center md:flex">
      <span className="h-px flex-1 bg-border" />
      <span className="ml-1 text-sm text-muted-foreground">›</span>
    </div>
  );
}

export default function ReLUFamilyViz() {
  return (
    <VizFrame
      eyebrow="같은 비교축으로 보기"
      title="ReLU 이후의 선택지는 서로 다른 병목을 겨냥한다"
      description="연도순 계보가 아니라, 무엇을 문제로 보고 계산 경로를 어떻게 바꿨는지 나란히 비교합니다."
      note="GELU·SiLU는 한 값에 적용하는 activation이고, SwiGLU는 두 projection을 곱하는 FFN입니다. 이 둘을 같은 비용으로 비교하면 안 됩니다."
    >
      <div className="space-y-7">
        {lanes.map((lane) => (
          <div
            key={lane.key}
            className="grid min-w-0 gap-4 border-b border-border/60 pb-7 last:border-0 last:pb-0 md:grid-cols-[minmax(0,0.9fr)_28px_minmax(0,1.1fr)_28px_minmax(0,0.95fr)] md:items-center md:gap-3"
          >
            <div className="min-w-0">
              <p className={`text-xs font-bold ${lane.color}`}>{lane.group}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
                {lane.question}
              </p>
            </div>
            <Arrow />
            <div className={`min-w-0 rounded-lg border ${lane.border} bg-background p-4`}>
              <p className="text-xs font-semibold text-muted-foreground">계산 경로의 변화</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
                {lane.mechanism}
              </p>
              <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                {lane.formulas.map((formula) => (
                  <span
                    key={formula}
                    className="max-w-full rounded-md border border-border/70 bg-muted/25 px-2.5 py-1 text-xs"
                  >
                    <Math>{formula}</Math>
                  </span>
                ))}
              </div>
            </div>
            <Arrow />
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{lane.result}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {lane.caveat}
              </p>
            </div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
