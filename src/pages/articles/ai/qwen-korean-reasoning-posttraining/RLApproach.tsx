import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import RLApproachViz from "./viz/RLApproachViz";

const SNAPSHOT = [
  ["출발 checkpoint", "Smoothie Qwen3 14B"],
  ["SFT data", "30,000 samples"],
  ["SFT compute·context", "8×H100 · 32K context"],
  ["RL group", "질문당 12 rollouts"],
  ["reward weights", "accuracy 1.0 · 나머지 0.2"],
  ["학습 관찰", "verifiable-only 약 220 step collapse · oracle-guided 약 1,000 step"],
] as const;

const BENCHMARKS = [
  ["GPQA-Diamond", "60.15", "62.12", "64.6"],
  ["HumanEval", "56.09", "60.36", "66.46"],
] as const;

export default function RLApproach() {
  return (
    <section id="rl-approach" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SFT는 경로 예시를 주고, RL은 후보 사이의 선호를 바꿉니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          특정 token의 출력 확률을 낮추는 것과 reasoning trace 전체를 한국어로
          만들면서 정답 품질을 유지하는 것은 서로 다른 문제입니다. 한국어
          reasoning 연구는 Smoothie Qwen3 14B 위에 곧바로 RL을 얹지 않고,
          먼저 <strong>SFT</strong>로 따라 할 경로를 보여 준 다음
          <strong> Oracle-Guided Dr.GRPO</strong>로 정확성·형식·언어·길이의
          상대 선호를 조정했습니다.
        </p>
        <p>
          고정 사례로 보면 SFT example은 “9,600÷3=3,200”이라는 한국어 연구용
          trace, 최종 정답 3,200원, 요청된 번역 “首尔”을 함께 보여 줍니다. RL은
          같은 질문에서 여러 후보를 생성하고, 이 계약을 더 잘 지킨 후보의
          probability를 높입니다. 관련 기초는 <Link to="/ai/supervised-fine-tuning">SFT 정본</Link>, <Link to="/ai/rlhf">RLHF 정본</Link>, 구현 맥락은 <Link to="/ai/open-r1">Open-R1 정본</Link>에서 이어서 볼 수 있습니다.
        </p>
        <p>
          여기서 “reasoning”은 논문이 학습 데이터와 출력 형식으로 명시한 research trace입니다. 이 사례를 일반 제품이 숨겨진 chain-of-thought를 노출해야
          한다는 권장으로 옮기면 안 됩니다. 운영 제품은 final answer와 짧고 검증 가능한 근거만 노출하고 내부 평가는 별도 계약으로 설계하면 됩니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <RLApproachViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>1단계: SFT로 한국어 reasoning의 출발 분포를 만듭니다</h3>
        <p>
          논문은 reasoning과 일반 prompt를 섞은 한국어 30,000 samples로 SFT를 수행했습니다. reasoning subset은 DeepSeek-R1 출력에서,
          나머지 예시와 prompt seed는 DeepSeek-V3-0324에서 가져왔으며 수학·과학·프로그래밍 문제를 포함합니다. 이 데이터는 문제 풀이 pattern과 언어를 동시에
          보여 준 distillation recipe이지, 한국어 표현만 가르친 데이터가 아닙니다.
        </p>
        <p>
          Decoder-only 모델의 response-only SFT에서는 prompt token의 loss를 mask해 학습 대상에서 빼고 정답 response token의
          negative log-likelihood(NLL)를 줄이는 방식으로 demonstration을 따라 하게 만듭니다. 즉 고정된 정답 예시를 모방하는 신호입니다. 다음 RL 단계는
          현재 policy가 새로 생성한 여러 후보의 reward를 비교하므로 data source가 다릅니다. 실제 mask 범위와 template은 사용한 trainer 설정으로
          확인해야 합니다.
        </p>
        <p>
          연구 설정은 14B checkpoint, 8×H100, 32K context를 사용했습니다. 이
          숫자는 재현 조건이지 모든 팀이 따라야 할 최소 사양이나 최적 recipe가
          아닙니다. 데이터 provenance, train/validation 분리, 다른 언어·코드
          능력의 회귀를 자체 환경에서 다시 확인해야 합니다.
        </p>

        <h3>2단계: 서로 다른 목적을 하나의 reward로 합칩니다</h3>
        <p>
          정답 여부만 reward로 주면 형식과 언어가 흔들릴 수 있고, 언어 일관성만
          주면 한국어로 쓴 오답이 높은 점수를 받을 수 있습니다. 논문은 네
          sub-reward를 가중합하되 accuracy를 가장 크게 두었습니다. overlong
          항은 bonus가 아니라 threshold 이후 음수가 되는 soft penalty이므로,
          식의 각 <code>r_k</code>가 모두 양수라고 가정하면 안 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="정확도·형식·언어·길이처럼 단위가 다른 평가를 한 policy reward로 어떻게 합칠까요?"
        idea={
          <>
            각 기준을 독립된 sub-reward로 계산하고 중요도 weight를 곱해 더합니다.
            그러면 total reward의 변화가 어느 항에서 왔는지 raw component와 함께
            진단할 수 있습니다.
          </>
        }
        formula={String.raw`R(x,y)=\sum_{k=1}^{K}w_k r_k(x,y)`}
        annotatedFormula={String.raw`R(x,y)=\underbrace{\sum_{k=1}^{K}w_k r_k(x,y)}_{\text{sub-reward 계산}}`}
        operations={[
          { expression: String.raw`\sum_{k=1}^{K}w_k r_k(x,y)`, annotation: ["sub-reward이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 기준을 독립된 sub-reward로 계산하고 중요도","weight를 곱해 더합니다."] },
        ]}
        terms={[
          { symbol: "x", name: "query", description: "한국어 질문과 번역 예외처럼 model이 지켜야 할 요청입니다." },
          { symbol: "y", name: "candidate output", description: "연구용 reasoning trace와 final answer를 포함한 하나의 sampled 응답입니다." },
          { symbol: "r_k", name: "sub-reward", description: "accuracy, format, language consistency, overlong penalty 중 k번째 평가 신호입니다." },
          { symbol: "w_k", name: "reward weight", description: "각 신호가 total reward에 미치는 상대 비중입니다." },
          { symbol: "R", name: "total reward", description: "group 안에서 candidate를 비교하고 policy update에 사용하는 최종 점수입니다." },
        ]}
        assumptions={[
          "논문 snapshot은 w_acc=1.0, w_format=w_lang=w_overlong=0.2를 사용했으며 보편적인 최적값이 아닙니다.",
          "Accuracy checker와 language detector가 false positive·false negative를 낼 수 있으므로 raw reward와 사람이 확인한 calibration set이 필요합니다.",
          "정상 중국어 번역 ‘首尔’을 language 위반에서 제외하도록 요청·구간 단위 예외가 reward contract에 포함되어야 합니다.",
        ]}
        interpretation="고정 사례에서 계산이 틀리면 한국어 형식이 완벽해도 accuracy 1.0을 얻지 못합니다. 반대로 3,200원이 맞아도 reasoning trace의 언어·형식과 번역 예외 처리는 별도 항으로 관찰됩니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>3단계: 같은 질문의 12개 후보를 평균보다 나은지 비교합니다</h3>
        <p>
          GRPO는 하나의 질문에서 여러 candidate를 sampling하고 각 reward가 group 평균보다 높은지 낮은지로 update 방향을 정합니다. 절대 reward가
          높더라도 같은 질문의 다른 후보가 모두 더 높으면 그 후보는 상대적으로 나쁜 예입니다. 이 연구에서는 질문당 12 rollouts를 사용했습니다.
        </p>
      </div>

      <ExplainedFormula
        question="같은 질문에서 생성한 후보 i가 group 평균보다 얼마나 좋은지 어떻게 나타낼까요?"
        idea={
          <>
            Group의 mean reward를 기준선으로 두고 candidate reward에서 뺍니다.
            평균보다 좋은 candidate는 양의 advantage, 나쁜 candidate는 음의
            advantage를 받아 policy probability를 올리거나 내리는 방향을 만듭니다.
          </>
        }
        formula={String.raw`\bar r=\frac{1}{G}\sum_{j=1}^{G}r_j,\qquad A_i=r_i-\bar r`}
        annotatedFormula={String.raw`\bar r=\underbrace{\frac{1}{G}\sum_{j=1}^{G}r_j,\qquad A_i=r_i-\bar r}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{1}{G}\sum_{j=1}^{G}r_j,\qquad A_i=r_i-\bar r`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Group의 mean reward를 기준선으로 두고","candidate reward에서 뺍니다."] },
        ]}
        terms={[
          { symbol: "G", name: "group size", description: "같은 query에서 sampling한 candidate 수이며 논문 설정에서는 12입니다." },
          { symbol: "r_i", name: "candidate reward", description: "i번째 output의 composite reward입니다." },
          { symbol: "r̄", name: "group mean reward", description: "같은 query의 candidate reward 평균입니다." },
          { symbol: "A_i", name: "group-centered advantage", description: "candidate i가 같은 질문의 평균보다 좋은지 나타내는 상대 신호입니다." },
        ]}
        assumptions={[
          "Group 안 reward가 모두 같으면 모든 A_i가 0이어서 그 query에서는 상대 선호 신호가 생기지 않습니다.",
          "Dr.GRPO는 논문 설명 기준으로 group reward 표준편차로 A_i를 다시 나누지 않습니다.",
          "Advantage만으로 전체 objective가 끝나는 것은 아니며 실제 update에는 policy ratio, clipping 등 RL objective가 함께 들어갑니다.",
        ]}
        interpretation="예를 들어 reward가 [1.0, 0.7, 0.4]라면 평균 0.7이고 advantage는 [0.3, 0, −0.3]입니다. 값의 절대 의미보다 같은 질문 안의 상대 순위가 학습 신호가 됩니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Dr.GRPO가 뺀 두 정규화 항의 의미</h3>
        <p>
          원 논문이 채택한 Dr.GRPO는 group reward의 표준편차로 advantage를 나누지
          않고, objective의 response-length normalization도 제거합니다. 논문은
          이 두 항이 질문별 reward scale과 출력 길이에 따른 bias를 만들 수 있어
          token-level gradient를 왜곡한다고 설명합니다. 따라서 위 식은
          <code>(r_i-r̄)/σ_r</code>가 아니라 raw group-centered advantage입니다.
        </p>
        <p>
          이것은 “정규화는 언제나 나쁘다”는 일반 법칙이 아니라 Dr.GRPO 논문과 이 한국어 연구가 채택한 algorithm claim입니다. 표준편차를 없애면 작은 reward 차이가
          자동 증폭되지 않지만 reward scale 설계가 더 중요해지고 length normalization을 없애도 별도의 overlong penalty와 길이 distribution
          monitoring은 여전히 필요합니다.
        </p>

        <h3>oracle judge는 ground truth가 아니라 reward의 두 번째 측정기입니다</h3>
        <p>
          연구진의 verifiable-only run은 약 220 step에서 accuracy reward가 거의 0으로 떨어지는 collapse를 보였습니다. 형식 checker가 정답의
          의미를 충분히 판별하지 못하자 policy가 허점을 이용했고 같은 질문의 후보 다양성도 줄었습니다. 이후 더 큰 frozen model을 oracle judge로 붙여 주로
          accuracy reward를 재검토했고 같은 hyperparameter 비교에서 약 1,000 step까지 안정적으로 진행됐다고 보고합니다.
        </p>
        <p>
          oracle은 학습 대상 policy와 별개의 frozen evaluator일 뿐입니다. 이름과 달리 완전한 정답지가 아니며, 수학 checker의 오탐·누락을 의미 판단으로
          보정합니다. judge 자체의 편향·환각·provider 상관 실패를 calibration set으로 측정하지 않으면 잘못된 reward를 더 그럴듯하게 만들 수 있습니다.
        </p>
        <p>
          재현할 때는 checker와 oracle이 충돌하면 accuracy reward를 교체하는지, 일정 범위로 clamp하는지, 두 값을 결합하는지를 구현 계약으로 명시합니다.
          Checker version, oracle model snapshot, judge prompt와 override·clamp 규칙을 하나의 reward receipt로 고정해야 학습
          곡선 변화가 policy 개선인지 측정기 변경인지 구분합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Paper experiment snapshot</p>
        <dl className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SNAPSHOT.map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
              <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
              <dd className="mt-1 break-words text-sm font-semibold leading-6">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          위 숫자는 논문의 단일 experiment snapshot입니다. model size와 data, reward, judge가 다른 환경에 그대로 적용할 recipe나 인과 효과
          크기가 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <p className="text-sm font-bold">논문 benchmark table 중 두 행</p>
        <div role="table" aria-label="논문 benchmark 일부" className="mt-3 overflow-hidden rounded-xl border border-border">
          <div role="row" className="hidden grid-cols-4 gap-3 border-b border-border bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground sm:grid">
            <div role="columnheader">Benchmark</div><div role="columnheader">Base</div><div role="columnheader">SFT</div><div role="columnheader">RL</div>
          </div>
          {BENCHMARKS.map(([name, base, sft, rl]) => (
            <div key={name} role="row" className="grid min-w-0 gap-3 border-b border-border/70 p-4 last:border-b-0 sm:grid-cols-4 sm:items-center">
              <div role="cell" className="min-w-0 break-words text-sm font-semibold">{name}</div>
              {[["Base", base], ["SFT", sft], ["RL", rl]].map(([label, value]) => (
                <div key={label} role="cell" className="flex min-w-0 items-baseline justify-between gap-3 text-sm sm:block">
                  <span className="text-xs text-muted-foreground sm:hidden">{label}</span>
                  <span className="font-mono tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          논문이 보고한 accuracy snapshot입니다. Base→SFT→RL 사이에는 data와 training stage, oracle reward가 함께 바뀌었으므로 표의 차이를
          “한국어 reasoning 하나가 만든 인과 효과”로 분리할 수 없습니다.
        </p>
      </div>

      <div
        id="paper-qwen-korean-rl"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · 한국어 reasoning SFT/RL</p>
        <CitationBlock
          source="Lee et al. — Making Qwen3 Think in Korean with Reinforcement Learning"
          citeKey={4}
          type="paper"
          href="https://arxiv.org/abs/2508.10355"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Qwen3 14B가 한국어 질문에 final은 한국어로 답해도 연구용 reasoning trace에서 영어로 전환되거나 reward checker를 이용하는 현상을 다룹니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> 한국어 reasoning SFT로 warm start한 뒤 composite reward와 frozen oracle judge를 결합한 Dr.GRPO로 candidate 선호를 조정합니다.</p>
            <p><strong>전제·실험 조건:</strong> Smoothie Qwen3 14B, 30k SFT data, 논문이 정의한 tagged reasoning format, math-centric RL data, 12 rollouts와 명시된 compute·hyperparameter 범위입니다.</p>
            <p><strong>근거 범위:</strong> verifiable-only와 oracle-guided run의 training trajectory, 공개 benchmark와 qualitative trace에 대한 사례 연구입니다.</p>
            <p><strong>비주장:</strong> oracle judge가 객관적 ground truth이거나, hidden chain-of-thought 공개가 제품 요구이며, 표의 개선이 다른 model·language에 그대로 이전된다는 주장은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 단계까지 가려면 출력 표면 문제가 아니라 reasoning trace와 과제 품질의 반복 가능한 실패가 있어야 합니다. 그보다 가벼운 서비스 요구라면 다음 절의 runtime
          guard가 더 직접적일 수 있습니다. 학습 모델을 배포한 뒤에도 long-tail 실패를 관찰하는 마지막 방어선은 별도로 필요합니다.
        </p>
      </div>
    </section>
  );
}
