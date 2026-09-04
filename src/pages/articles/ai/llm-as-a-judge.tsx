import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import PositionBiasViz from "./llm-as-a-judge/viz/LlmAsAJudgeViz";

/**
 * LLM-as-a-judge 는 rubric 과 순서로 판정이 갈립니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LlmAsAJudgeArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LLM-as-a-judge 는 사람 평가를 대신할 판정자를 model 로 세웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Human evaluation 은 사람이 직접 읽고 점수를 매기거나 승패를 가르는, 가장 신뢰할
            기준선이지만 느리고 비쌉니다. LLM-as-a-judge 는 그 판정을 또 다른 LLM(judge
            model)에게 맡겨 비용을 크게 낮추는 대신, judge 자신의 편향을 새로운 위험으로
            들여옵니다.
          </p>
          <p>
            <Link to="/ai/llm-evaluation-criteria-and-methods#pointwise-pairwise-ranking">
              앞 글
            </Link>{" "}
            의 pairwise·pointwise 비교는 판정자가 누구인지 정하지 않았습니다. 이 글은 그 판정자
            자리에 사람 대신 model 을 놓았을 때 rubric 을 어떻게 주고, 어떤 bias 가 생기며,
            그것을 사람 기준과 어떻게 맞추는지를 봅니다.
          </p>
          <p>
            Judge 의 신뢰도는 사람과의 agreement rate 로 잽니다. GPT-4 를 judge 로 쓴 MT-Bench
            비교는 사람과 85% 로 일치했는데, 이는 사람 두 명끼리의 일치율 81% 와 비슷한
            수준입니다. Chatbot Arena 비교에서는 87%, 단일 답변 채점에서는 95% 까지 올랐습니다.
          </p>
        </div>
        <TermBreakdown
          title="판정자의 두 자리"
          description="같은 pairwise·pointwise 질문에 누가 답하느냐가 다릅니다."
          items={[
            { term: "Human Evaluation", description: "사람이 직접 읽고 점수나 승패를 매기는 평가입니다.", example: "rater 두 명의 일치율 81%(MT-Bench)", boundary: "신뢰도는 높지만 규모를 키우기 어렵고 비용이 큽니다." },
            { term: "LLM-as-a-Judge · Judge Model", description: "판정을 또 다른 LLM 에게 맡기는 방법과 그 model 자신입니다.", example: "GPT-4 judge 가 사람과 85% 일치(MT-Bench)", boundary: "사람만큼 신뢰할 수 있는지는 judge 마다, task 마다 다시 재야 합니다." },
          ]}
        />
        <ContentBoundary article="llm-as-a-judge" />
      </section>

      <section id="rubric" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Evaluation Rubric 은 judge 에게 무엇을 볼지 명시한 지시문입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Evaluation rubric 은 judge 에게 어떤 기준(정확성·관련성·깊이 등)을 어떤 순서와
            척도로 볼지 미리 적어 주는 지시문입니다. Rubric 없이 "어느 쪽이 더 나은가요"만
            물으면 judge 는 길이나 어조 같은 표면 특징에 기대기 쉽습니다.
          </p>
          <p>
            G-Eval 은 rubric 설계 쪽에서 답을 찾았습니다. 평가 기준을 단계별 질문으로 풀어 쓰고 judge 가 그 순서를 따라 생각을 적은 뒤(chain-of-thought)
            정해진 양식으로 점수를 채우게(form-filling) 합니다. 요약 품질 평가에서 사람과 Spearman 상관 0.514 를 기록해 이전 자동 metric 들을 앞섰습니다.
          </p>
          <p>
            Rubric 이 있어도 judge 가 그것을 실제로 따르는지는 별개 문제입니다. 다음 절의
            position·verbosity·self-preference bias 는 모두 rubric 이 있는 상태에서도 관찰된
            현상입니다.
          </p>
        </div>
        <div id="paper-geval" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Liu, Iter, Xu, Wang, Xu, Zhu · G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment"
            citeKey={1}
            href="https://arxiv.org/abs/2303.16634"
          >
            2023 년 논문은 평가 기준을 chain-of-thought 로 전개하고 정해진 양식으로 점수를
            채우게 하는 form-filling rubric 을 GPT-4 judge 에 결합해, 요약 품질 평가에서
            사람과 Spearman 상관 0.514 를 기록했다고 저자가 보고했습니다. 결과는 논문이
            평가한 요약 task 와 GPT-4 버전에 한정됩니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="Evaluation Rubric"
          items={[
            { term: "Evaluation Rubric", description: "judge 가 볼 기준과 척도, 판단 순서를 미리 적은 지시문입니다.", example: "G-Eval 의 CoT + form-filling, Spearman 0.514", boundary: "Rubric 을 줘도 judge 가 표면 특징에 흔들리지 않는다는 보장은 없습니다." },
          ]}
        />
      </section>

      <section id="position-bias" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Position Bias 는 순서를 바꾸면 같은 답이 다르게 판정되는 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Judge bias 는 정답의 실제 품질과 무관하게 judge 의 판정을 한쪽으로 치우치게 하는
            체계적 오차입니다. 가장 뚜렷한 예가 position bias 로, 같은 두 답변을 A·B 순서만
            바꿔 다시 넣어도 judge 의 승자가 바뀌는 현상입니다.
          </p>
          <p>
            MT-Bench 논문은 같은 답변 쌍의 순서를 바꿔 두 번 판정했을 때 GPT-4 가 두 판정에서
            같은 답을 고른 비율(consistency)이 65.0%, 먼저 제시된 쪽을 고른 비율이 30.0% 라고
            보고했습니다. GPT-3.5 는 일관성 46.2%·첫 위치 편향 50.0%, Claude-v1 은 일관성
            23.8%·첫 위치 편향 75.0% 로 더 심했습니다.
          </p>
          <p>
            대응은 판정을 한 번으로 끝내지 않는 것입니다. 같은 쌍을 두 순서 모두로 judge 에게
            넣어, 두 판정이 같은 답을 가리킬 때만 그 결과를 신뢰하고 엇갈리면 tie 나 재판정으로
            처리합니다.
          </p>
        </div>
        <div id="paper-mtbench" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zheng, Chiang, Sheng, et al. · Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena"
            citeKey={2}
            href="https://arxiv.org/abs/2306.05685"
          >
            2023 년 논문은 GPT-4·GPT-3.5·Claude-v1 을 judge 로 세워 순서를 바꾼 반복 판정으로
            position bias(일관성 65.0/46.2/23.8%), 반복 목록 공격으로 verbosity bias(GPT-4
            실패율 8.7%, GPT-3.5·Claude-v1 91.3%), 같은 model 답변 선호 경향으로
            self-enhancement bias(GPT-4 +10%p, Claude-v1 +25%p 승률)를 측정하고, GPT-4 judge
            와 사람의 일치율이 85~95% 라고 보고했습니다. Self-enhancement 수치는 표본이 적어
            저자 스스로 통계적으로 확정하지 못한다고 밝혔습니다.
          </CitationBlock>
        </div>
        <PositionBiasViz />
        <AlgorithmBlock
          title="Pairwise judge 호출: 순서를 두 번 바꿔 position bias 상쇄"
          input={["답변 쌍 (a, b)", "judge model 함수 judge(first, second) → 승자"]}
          steps={[
            { code: "verdict1 ← judge(a, b)", note: "a 를 먼저 제시한 순서로 한 번 판정합니다." },
            { code: "verdict2 ← judge(b, a)", note: "내용은 그대로 두고 제시 순서만 바꿔 다시 판정합니다." },
            { code: "if verdict1 == verdict2: winner ← verdict1", note: "두 판정이 같은 답을 가리키면 순서와 무관한 결과로 받아들입니다." },
            { code: "else: winner ← tie · flag for re-judge", note: "판정이 엇갈리면 승자를 정하지 않고 tie 로 남기거나 재판정합니다." },
          ]}
          output="Position-consistent 승자, 또는 tie/재판정 flag"
        />
        <TermBreakdown
          title="Judge Bias 와 Position Bias"
          items={[
            { term: "Judge Bias", description: "답의 실제 품질과 무관하게 판정을 치우치게 하는 체계적 오차입니다.", example: "순서·길이·출처 같은 표면 신호에 반응", boundary: "rubric 이 있어도 사라지지 않고 별도로 측정·상쇄해야 합니다." },
            { term: "Position Bias", description: "제시 순서를 바꾸면 같은 내용의 판정이 달라지는 편향입니다.", example: "Claude-v1 일관성 23.8%, 첫 위치 편향 75.0%", boundary: "한 번의 순서로만 판정하면 이 편향을 확인할 수 없습니다." },
          ]}
        />
      </section>

      <section id="verbosity-self-preference" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Verbosity Bias 는 길이를, Self-Preference Bias 는 출처를 우대합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Verbosity bias 는 rubric 이 요구하는 품질과 무관하게 더 길고 장황한 답을 judge 가
            우대하는 편향이고, self-preference bias 는 judge 가 자신과 같은 model 계열이 낸
            답을 우대하는 편향입니다. 둘 다 <Link to="#paper-mtbench">앞 절 MT-Bench 실험</Link>
            에서 함께 측정됐습니다.
          </p>
          <p>
            반복되는 목록으로 분량만 늘리고 내용은 비슷한 공격 답변에 대해, GPT-4 judge 는
            8.7% 만 속아 넘어갔지만 GPT-3.5 와 Claude-v1 은 91.3% 의 경우에 그 장황한 답을 더
            높게 쳤습니다. Rubric 에 길이 기준이 없어도 분량 자체가 신호로 쓰인 것입니다.
          </p>
          <p>
            Self-preference bias 는 GPT-4 judge 가 자기 계열 답을 평균보다 10%p 높은 승률로, Claude-v1 judge 는 25%p 높은 승률로 골랐다는
            관찰에서 나왔습니다. 다만 저자들은 표본이 적어 이 차이가 우연인지 진짜 편향인지 통계적으로 확정하지 못한다고 밝혔습니다. GPT-3.5 judge 는 자기 선호가 거의
            없었습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="왜 장황한 답이 유리해지나요?"
          preview="Rubric 이 분량에 대해 말한 바가 없으면 judge 는 길이를 노력이나 성실함의 대리 신호로 쓰기 쉽고, 짧고 정확한 답보다 길고 반복적인 답을 더 꼼꼼해 보인다고 판정하기 쉽습니다."
        >
          <p>
            사람 평가자도 같은 함정에 빠지지만 judge model 은 그 경향이 rubric 문구 하나로 쉽게 재현·증폭된다는 점이 다릅니다. "자세히 설명하라"는 지시가 rubric
            에 있으면 분량 편향이 더 커집니다.
          </p>
          <p>
            대응은 rubric 에 "같은 정보량이면 짧은 답을 우대한다"처럼 분량에 대한 명시적 규칙을
            넣거나, 길이를 맞춘 답변 쌍으로만 verbosity bias 를 따로 측정해 판정에서 그 성분을
            빼는 것입니다.
          </p>
        </ProgressiveDetail>
        <TermBreakdown
          title="Verbosity Bias 와 Self-Preference Bias"
          items={[
            { term: "Verbosity Bias", description: "품질과 무관하게 더 긴 답을 judge 가 우대하는 편향입니다.", example: "반복 목록 공격에 GPT-3.5·Claude-v1 91.3% 속음", boundary: "GPT-4 도 8.7% 는 속아, 완전히 면역인 judge 는 없습니다." },
            { term: "Self-Preference Bias", description: "judge 가 자기 계열 model 의 답을 우대하는 편향입니다.", example: "GPT-4 judge +10%p, Claude-v1 judge +25%p 승률", boundary: "MT-Bench 저자도 표본 부족으로 통계적 확정은 하지 못했습니다." },
          ]}
        />
      </section>

      <section id="calibration" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Judge Calibration 은 human agreement 로 judge 를 사람 기준에 맞추는 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Judge calibration 은 judge 의 판정을 그대로 믿지 않는 데서 출발합니다. 사람이 매긴 기준과 얼마나 일치하는지(agreement rate, 상관계수)를 먼저
            잽니다. 그 결과를 보고 이 judge 를 쓸지, rubric 을 고칠지, 비대칭을 어떻게 보정할지를 정합니다.
          </p>
          <p>
            앞서 본 숫자들이 이 calibration 의 결과입니다. GPT-4 judge 는 MT-Bench 에서 사람과 85%, Chatbot Arena 에서 87%(단일 답변 채점은
            95%) 일치했고, G-Eval 은 요약에서 사람과 Spearman 0.514 를 기록했습니다. 이 숫자가 사람-사람 일치율(81%)보다 높으니 judge 는 적어도 사람 두
            명이 서로 다투는 정도로는 신뢰할 만합니다. 물론 언제나 옳다는 보장은 여기 없습니다.
          </p>
          <p>
            Calibration 은 세 가지를 조합합니다. Rubric 으로 볼 기준을 고정하고 순서를 두 번 돌려 position bias 를 상쇄한 뒤, 사람 labeled
            sample 로 agreement rate 를 주기적으로 재확인합니다. 세 조각 중 하나만 있으면 judge 의 판정은 특정 task·model 조합에서만 우연히 맞을 위험이
            남습니다.
          </p>
        </div>
        <TermBreakdown
          title="Judge Calibration"
          items={[
            { term: "Judge Calibration", description: "Judge 의 판정을 사람 기준과의 agreement rate·상관계수로 검증·보정하는 작업입니다.", example: "GPT-4 judge 85~95% 일치, G-Eval Spearman 0.514", boundary: "한 번 잰 agreement rate 가 다른 task·model 조합에서도 유지된다고 가정하면 안 됩니다." },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 두 글은 <Link to="/ai/llm-evaluation-criteria-and-methods#problem">criteria·metric</Link> 을
            정하고, 그것을 <Link to="/ai/llm-evaluation-criteria-and-methods#pointwise-pairwise-ranking">
            pointwise·pairwise·ranking
            </Link> 으로 비교하며, reference 가 없을 때 그 비교를 judge model 에게 맡기고
            calibration 으로 검증하는 순서를 다뤘습니다. 이 세 조각이 갖춰져야 "평가했다"는
            말이 재현 가능한 근거를 갖습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
