import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FunctionalVsSemanticViz from "./llm-evaluation-criteria-and-methods/viz/LlmEvaluationCriteriaAndMethodsViz";

/**
 * LLM 평가는 criteria·metric·비교 방식 세 층으로 나뉩니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LlmEvaluationCriteriaAndMethodsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LLM 평가는 criteria·metric·비교 방식 세 층의 조합입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM 을 평가한다는 것은 한 번의 판단이 아니라 세 질문에 차례로 답하는 일입니다. 무엇을
            잴지(criteria), 그것을 어떻게 숫자로 바꿀지(metric), 여러 output 을 어떤 단위로
            비교할지(pointwise·pairwise·ranking)를 정해야 비로소 하나의 평가 방법이 완성됩니다.
          </p>
          <p>
            <Link to="/ai/prompt-structured-output#structured-output">앞 글</Link> 은 output
            이 parse→schema→domain 사다리를 통과하는지를 봤습니다. 이 글은 그 판정을 통과한
            output 이 얼마나 좋은지를 무엇으로 재고 무엇과 비교할지, 즉 사다리 다음에 오는
            질문을 다룹니다.
          </p>
          <p>
            HELM 은 30 개 model 을 42 개 시나리오에서 정확도·보정·강건성·공정성·편향·독성·효율성
            7 개 criteria 로 나눠 재고, BIG-bench 는 204 개 task 마다 서로 다른 정답 형식과
            metric 을 씁니다. 같은 model 도 어떤 criteria 와 metric 을 고르느냐에 따라 결론이
            달라지는 이유가 여기 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="세 층의 질문"
          description="평가 방법 하나는 이 세 질문에 대한 답의 조합입니다."
          items={[
            { term: "Criteria (무엇을)", description: "정확성·안전성·간결성처럼 잴 성질의 축입니다.", example: "정확성, 유해성, 응답 길이 적절성", boundary: "Criteria 하나만으로는 점수가 나오지 않습니다." },
            { term: "Metric (어떻게 숫자로)", description: "criteria 에 실제 값을 매기는 계산 방법입니다.", example: "exact match, F1, BERTScore, pass@1", boundary: "같은 criteria 라도 metric 선택에 따라 값이 달라집니다." },
            { term: "비교 방식 (무엇과)", description: "output 하나·둘·여럿 가운데 무엇을 견주는지입니다.", example: "pointwise 절대 점수, pairwise 승률, ranking 순서", boundary: "metric 값이 있어야 비교할 재료가 생깁니다." },
          ]}
        />
        <ContentBoundary article="llm-evaluation-criteria-and-methods" />
      </section>

      <section id="criteria-metric" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Criteria 는 잴 대상, Metric 은 그것을 숫자로 바꾸는 함수입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Evaluation criteria 는 정확성·안전성·간결성처럼 어떤 성질을 잴지 정하는 축이고,
            evaluation metric 은 그 성질에 실제 숫자를 매기는 계산 방법입니다. 같은 criteria 라도
            metric 을 무엇으로 고르느냐에 따라 같은 output 이 다른 점수를 받습니다.
          </p>
          <p>
            가령 정답을 추출하는 task 에서 정확성이라는 criteria 를 정확한 문자열 일치(exact
            match)로 잴 수도, 겹치는 단어 비율(F1)로 잴 수도 있습니다. 1,000 개 샘플 중 정답과
            완전히 같은 문자열이 850 개면 exact match 는 0.85 이지만, 표현이 달라도 핵심 단어가
            겹치면 부분 점수를 주는 F1 은 이보다 높게 나오기도 합니다.
          </p>
          <p>
            HELM 은 이 구분을 시나리오 설계에 그대로 반영합니다. 시나리오마다 잴 criteria 목록을
            먼저 정하고, 그 각각에 대응하는 metric 을 지정한 뒤에야 model 을 채점합니다.
          </p>
        </div>
        <div id="paper-helm" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Liang, Bommasani, et al. · Holistic Evaluation of Language Models (HELM)"
            citeKey={1}
            href="https://arxiv.org/abs/2211.09110"
          >
            2022 년 논문은 정확도·보정·강건성·공정성·편향·독성·효율성 7 개 criteria 를 42 개
            시나리오와 30 개 model 조합에 적용해, criteria 마다 대응하는 metric 을 명시하는
            holistic evaluation 틀을 제시했습니다. 21 개 시나리오는 이전 주류 평가에 없던 새
            조합이며, 결과는 논문이 실제로 평가한 model·시나리오 조합에 한정됩니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="Criteria 와 Metric 의 관계"
          description="Criteria 는 질문, metric 은 그 질문에 대한 채점표입니다."
          items={[
            { term: "Evaluation Criteria", description: "무엇을 잴지 정하는 성질의 축입니다.", example: "정확성, 유해성, 형식 준수", boundary: "criteria 이름만으로는 채점 방법이 정해지지 않습니다." },
            { term: "Evaluation Metric", description: "criteria 를 실제 숫자로 계산하는 함수입니다.", example: "정확성 → exact match 0.85 또는 F1 0.9 대", boundary: "metric 을 바꾸면 같은 output 의 순위도 바뀔 수 있습니다." },
          ]}
        />
      </section>

      <section id="functional-vs-semantic" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Functional Correctness 는 실행으로, Semantic Similarity 는 거리로 잽니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Functional correctness 는 output 을 직접 실행하거나 채점 규칙에 넣어 통과·실패로
            판정하는 정확성이고, semantic similarity evaluation 은 output 과 참조문의 embedding
            거리로 연속값 점수를 매기는 정확성입니다. 전자는 표현이 달라도 동작이 맞으면
            통과이고, 후자는 동작을 몰라도 문장이 비슷하면 높은 점수를 줍니다.
          </p>
          <p>
            코드 생성에서 흔한 metric 은 pass@k 입니다. 같은 문제에 k 개 sample 을 뽑아 그 중
            하나라도 unit test 를 모두 통과하면 성공으로 세는 이진 판정입니다. Codex 12B 는
            HumanEval 문제에서 pass@1 28.8%, pass@100 70.2% 를 보고했습니다. 한 번만 뽑으면
            28.8% 가 맞았지만, 100 개 중 하나만 맞아도 인정하는 기준으로는 70.2% 로 오릅니다.
          </p>
        </div>
        <FunctionalVsSemanticViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Semantic similarity evaluation 의 대표 예는 BERTScore 입니다. Reference 문장과
            candidate 문장의 각 token 을 contextual embedding 으로 바꾼 뒤, 상대 문장에서 가장
            가까운 token 과 코사인 유사도를 매칭해 recall·precision·F1 을 계산합니다.
          </p>
        </div>
        <ExplainedFormula
          question="BERTScore 의 F1 은 어떻게 계산되나요?"
          idea="각 token 을 상대 문장에서 코사인 유사도가 가장 높은 token 과 매칭해, 정답 token 기준 평균(recall)과 생성 token 기준 평균(precision)을 낸 뒤 조화평균합니다."
          formula={String.raw`R_{\text{BERT}}=\frac{1}{|x|}\sum_{x_i\in x}\max_{\hat{x}_j\in \hat{x}} x_i^{\top}\hat{x}_j,\quad P_{\text{BERT}}=\frac{1}{|\hat{x}|}\sum_{\hat{x}_j\in \hat{x}}\max_{x_i\in x} x_i^{\top}\hat{x}_j,\quad F_{\text{BERT}}=\frac{2P_{\text{BERT}}R_{\text{BERT}}}{P_{\text{BERT}}+R_{\text{BERT}}}`}
          annotatedFormula={String.raw`R_{\text{BERT}}=\frac{1}{|x|}\sum_{x_i\in x}\underbrace{\max_{\hat{x}_j\in \hat{x}} x_i^{\top}\hat{x}_j}_{\text{정답 token 이 찾은 가장 가까운 생성 token}},\quad P_{\text{BERT}}=\frac{1}{|\hat{x}|}\sum_{\hat{x}_j\in \hat{x}}\underbrace{\max_{x_i\in x} x_i^{\top}\hat{x}_j}_{\text{생성 token 이 찾은 가장 가까운 정답 token}},\quad F_{\text{BERT}}=\underbrace{\frac{2P_{\text{BERT}}R_{\text{BERT}}}{P_{\text{BERT}}+R_{\text{BERT}}}}_{\text{precision·recall 조화평균}}`}
          operations={[
            { expression: String.raw`\max_{\hat{x}_j\in \hat{x}} x_i^{\top}\hat{x}_j`, annotation: ["정답 token x_i 와 코사인 유사도가 가장 높은", "생성 token 하나를 greedy 로 고름"] },
            { expression: String.raw`\frac{1}{|x|}\sum_{x_i\in x}(\cdot)`, annotation: ["token 별 최댓값을 정답 문장 길이로 평균해", "recall R_BERT 를 얻음"] },
            { expression: String.raw`\frac{2PR}{P+R}`, annotation: ["precision 과 recall 을 조화평균해", "한쪽만 높아도 F1 이 크게 오르지 않게 함"] },
          ]}
          terms={[
            { symbol: "x_i", name: "정답 token embedding", description: "reference 문장의 i 번째 token 을 contextual embedding 으로 바꾼 값입니다." },
            { symbol: String.raw`\hat{x}_j`, name: "생성 token embedding", description: "candidate 문장의 j 번째 token embedding 입니다." },
            { symbol: String.raw`F_{\text{BERT}}`, name: "BERTScore F1", description: "recall·precision 을 모두 반영한 최종 유사도 점수입니다." },
          ]}
          assumptions={["임베딩은 미리 정규화되어 내적이 코사인 유사도와 같다고 둡니다.", "매칭은 각 token 이 상대 문장에서 가장 가까운 token 하나에만 greedy 로 붙는 것이라 전역 최적 bipartite matching 은 아닙니다."]}
          interpretation="WMT18 세그먼트 수준 상관관계에서 EN→DE 는 BERTScore 0.550 대 BLEU 0.415, EN→RU 는 0.353 대 0.228 로 사람 판단과 더 가깝게 움직였습니다. 이 값은 저자가 보고한 특정 언어쌍·연도의 결과이며 모든 상황에서 같은 격차가 난다는 뜻은 아닙니다."
        />
        <div id="paper-bertscore" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zhang, Kishore, Wu, Weinberger, Artzi · BERTScore: Evaluating Text Generation with BERT"
            citeKey={2}
            href="https://arxiv.org/abs/1904.09675"
          >
            2019 년 논문은 exact match 대신 contextual embedding 의 코사인 유사도로 token 을
            매칭해 recall·precision·F1 을 계산하는 semantic similarity metric 을 제시했습니다.
            WMT18 기계번역 363 개 system 출력에서 system 수준 상관관계는 EN↔DE .999/.989(BLEU
            .971/.981), 세그먼트 수준은 EN→DE .550(BLEU .415)로 사람 판단과 더 가까웠다고
            저자가 보고했습니다. 결과는 평가된 언어쌍과 metric 조합에 한정됩니다.
          </CitationBlock>
        </div>
        <div id="paper-codex" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Chen, Tworek, Jun, et al. · Evaluating Large Language Models Trained on Code (Codex)"
            citeKey={3}
            href="https://arxiv.org/abs/2107.03374"
          >
            2021 년 논문은 HumanEval 164 개 문제의 unit test 통과 여부로 채점하는 pass@k 를
            code 생성 model 의 functional correctness metric 으로 제시하고, Codex 12B 가
            pass@1 28.8%, pass@100 70.2% 를 기록했다고 저자가 보고했습니다. 수치는 이 논문이
            명시한 HumanEval 문제 집합과 model 크기에 한정되며 다른 code benchmark 로 그대로
            옮길 수 있다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="Functional Correctness 와 Semantic Similarity"
          items={[
            { term: "Functional Correctness", description: "실행 또는 채점 규칙으로 통과·실패를 정하는 이진 판정입니다.", example: "unit test 5개 중 3개 통과 → pass@1 근사 0.6", boundary: "표현이 정답과 달라도 동작이 맞으면 만점이라 부분 점수가 없습니다." },
            { term: "Semantic Similarity Evaluation", description: "embedding 거리로 연속값 유사도를 매기는 판정입니다.", example: "BERTScore F1 0.0~1.0 사이 실수", boundary: "문장이 비슷해도 실제 동작이나 사실이 맞다고 보장하지 않습니다." },
          ]}
        />
      </section>

      <section id="reference-based-vs-free" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Reference-Based 는 정답과, Reference-Free 는 정답 없이 비교합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Reference-based evaluation 은 사람이 만든 정답(reference)과 output 을 비교해 점수를
            내고, reference-free evaluation 은 정답 문장 없이 input 과 규칙, 또는 별도 판정자만
            으로 output 을 봅니다. 정답을 만드는 비용과 채점의 재현성이 이 축을 가릅니다.
          </p>
          <p>
            가장 단순한 reference-based metric 은 exact match 입니다. Output 문자열이 reference
            와 완전히 같으면 1, 다르면 0 으로 재는 이진 metric 으로, 1,000 개 추출 결과 중 850
            개가 정답과 정확히 같으면 exact match rate 는 0.85 입니다. 표현만 다른 정답은 전부
            0 으로 떨어집니다.
          </p>
          <p>
            Functional correctness 는 이 축에서 애매한 자리에 있습니다. Unit test 라는 참조
            사양은 있지만 정답 output 문자열은 없어 reference-free 쪽에 가깝고, exact match 나
            BERTScore 처럼 정답 텍스트 자체가 필요한 metric 만 순수한 reference-based 입니다.
          </p>
          <p>
            Reference 없는 평가는 정답 데이터를 만들지 않아도 새 task 에 빠르게 적용되지만,
            판정 기준을 규칙이나 또 다른 model 에 맡기는 대가가 있습니다. 그 판정자를 LLM
            자신으로 쓰는 방법은 다음 글에서 다룹니다.
          </p>
        </div>
        <div id="paper-big-bench" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Srivastava, et al. · Beyond the Imitation Game (BIG-bench)"
            citeKey={4}
            href="https://arxiv.org/abs/2206.04615"
          >
            2022 년 논문은 132 개 기관 450 명이 만든 204 개 task 를 모아, task 마다 서로 다른
            참조 정답과 채점 방식(정확한 문자열 일치, 객관식 정답 등)을 쓰는 대규모 benchmark
            를 제시했습니다. 전문가 평가자 팀이 모든 task 를 직접 풀어 사람 기준선을 함께
            보고했으며, 결과는 논문이 실제로 평가한 model·task 조합에 한정됩니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="Reference 축의 세 자리"
          items={[
            { term: "Exact Match", description: "output 이 reference 와 완전히 같은지만 보는 이진 metric 입니다.", example: "1,000개 중 850개 완전 일치 → 0.85", boundary: "표현만 다른 정답도 전부 0점 처리됩니다." },
            { term: "Reference-Based Evaluation", description: "정답 텍스트와 비교해 점수를 내는 평가입니다.", example: "exact match, BERTScore, ROUGE", boundary: "정답이 여러 형태로 존재하는 open-ended task 에서는 reference 하나로 부족합니다." },
            { term: "Reference-Free Evaluation", description: "정답 텍스트 없이 input·규칙·판정자로 output 을 보는 평가입니다.", example: "unit test 실행, 유해성 분류기, judge model", boundary: "판정 기준 자체의 정확성과 편향을 별도로 검증해야 합니다." },
          ]}
        />
        <ProgressiveDetail
          title="Reference 가 있어도 애매한 경우가 있나요?"
          preview="번역·요약처럼 정답이 여러 개 가능한 open-ended task 는 reference 하나만으로 부족해, 여러 reference 를 모으거나 semantic similarity 로 여유를 두는 절충이 흔합니다."
        >
          <p>
            기계번역은 같은 원문에 여러 타당한 번역이 존재해 reference 하나와의 exact match 는
            지나치게 가혹합니다. BLEU 나 BERTScore 처럼 부분 점수를 주는 metric, 또는 reference
            여러 개를 모아 그 중 하나와만 맞아도 인정하는 multi-reference 방식이 이 문제를
            완화합니다.
          </p>
          <p>
            그래도 reference 자체가 편향되거나 시대에 뒤떨어지면 metric 값이 실제 품질과
            어긋납니다. Reference 의 출처와 작성 기준을 본문에 남기지 않으면 나중에 그 숫자가
            무엇을 뜻하는지 아무도 재현할 수 없습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="pointwise-pairwise-ranking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Pointwise 는 절대 점수, Pairwise 는 승률, Ranking 은 순서를 냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Pointwise evaluation 은 output 하나에 독립적으로 절대 점수를 매기고, pairwise
            evaluation 은 두 output 을 맞대어 승패만 정하며, ranking evaluation 은 여러 output
            을 한 번에 전체 순서로 정렬합니다. 세 방식은 같은 재료에서 서로 다른 정보를 만들어
            집계 방법과 필요한 호출 수가 달라집니다.
          </p>
          <p>
            Pointwise 는 rater 나 judge 가 output 마다 1~5 점을 매기고 평균을 냅니다. Model A 의
            응답 100 개 평균이 4.2/5 면 그 값 하나로 전체 품질을 요약합니다. 문제는 채점자마다
            척도가 달라 어떤 rater 의 4점이 다른 rater 의 5점과 같은 품질일 수 있다는 점입니다.
          </p>
          <p>
            Pairwise 는 A 와 B 의 같은 질문 응답을 나란히 놓고 어느 쪽이 나은지만 묻습니다.
            100 번의 비교에서 A 가 62 번 이겼다면 win rate 는 0.62 로, 절대 점수 없이도 두
            model 의 상대적 우열을 알려줍니다. 척도 차이가 없어 pointwise 보다 일관적이라고
            보고되지만, 후보가 n 개면 비교 쌍이 최대 C(n,2) 개로 늘어납니다.
          </p>
          <p>
            Ranking evaluation 은 여러 후보를 한 번에 순서로 매깁니다. Pairwise 승수를 모아
            순위를 매길 수도, judge 에게 후보 목록을 통째로 주고 순서를 받을 수도 있습니다.
            다만 pairwise 결과를 순위로 합칠 때 A&gt;B&gt;C&gt;A 처럼 순환이 생기면 하나의
            전체 순서로 정리되지 않는 한계가 있습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Pairwise 비교로 win rate 집계하기"
          input={["후보 output 집합 O = {o_1, …, o_n}", "두 output 을 받아 승자를 정하는 judge 함수"]}
          steps={[
            { code: "pairs ← all (o_i, o_j), i≠j — 또는 무작위 표본", note: "n 이 크면 전체 C(n,2) 쌍 대신 표본을 뽑아 judge 호출 수를 줄입니다." },
            { code: "for (o_i, o_j) in pairs: winner ← judge(o_i, o_j)", note: "judge 는 rubric 이나 model 이며 한 쌍마다 승자 하나만 돌려줍니다." },
            { code: "wins[winner] += 1; total[o_i] += 1; total[o_j] += 1", note: "각 후보가 참가한 비교 수와 이긴 수를 따로 셉니다." },
            { code: "win_rate[o] ← wins[o] / total[o]", note: "참가 횟수로 나눠야 표본이 적은 후보가 과대평가되지 않습니다." },
          ]}
          output="후보별 win rate — 순위로 쓰려면 이 값으로 정렬하되 순환(A>B>C>A) 여부를 먼저 확인"
        />
        <TermBreakdown
          title="세 비교 방식의 자리"
          items={[
            { term: "Pointwise Evaluation", description: "output 하나에 독립적인 절대 점수를 매깁니다.", example: "100개 응답 평균 4.2/5", boundary: "채점자·시점마다 척도가 달라 절대값을 그대로 비교하기 어렵습니다." },
            { term: "Pairwise Evaluation", description: "두 output 을 겨뤄 승패만 정합니다.", example: "100번 비교 중 62승 → win rate 0.62", boundary: "후보 수가 늘면 비교 쌍이 제곱으로 늘어납니다." },
            { term: "Ranking Evaluation", description: "여러 output 을 한 번에 전체 순서로 정렬합니다.", example: "pairwise 승수를 모아 순위 산출", boundary: "순환 승패가 있으면 하나의 전체 순서로 안 모입니다." },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 글은 이 reference-free·pairwise 자리에 LLM 자신을 판정자로 세우는{" "}
            <Link to="/ai/llm-as-a-judge#overview">LLM-as-a-judge</Link> 를 다룹니다. Judge 가
            어떤 rubric 을 쓰고, 순서를 바꾸면 판정이 얼마나 뒤집히는지를 봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}
