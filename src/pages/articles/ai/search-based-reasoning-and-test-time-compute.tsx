import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SearchBasedReasoningAndTestTimeComputeViz from "./search-based-reasoning-and-test-time-compute/viz/SearchBasedReasoningAndTestTimeComputeViz";

/**
 * Test-time compute: best-of-N · tree search · self-correction
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function SearchBasedReasoningAndTestTimeComputeArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Search-based reasoning 은 후보 여러 개를 만들고 검증·탐색으로 답을 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Test-time compute 를 쓰는 방법으로는 후보를 N 개 독립적으로 만들어 verifier 로 하나를 고르는 best-of-N, 중간 단계마다 후보를 넓히고
            가지치기하는 tree search, 이미 낸 답을 스스로 다시 검토하는 self-correction 이 있습니다. 이 글은 셋을 search-based reasoning 이라는
            한 축의 서로 다른 구현으로 봅니다.
          </p>
          <p>
            세 방법은 같은 재료를 씁니다.{" "}
            <Link to="/ai/llm-sampling-strategies#test-time-compute">Test-time compute</Link> 로
            산 여분의 연산, 후보를 평가할 verifier 나 self-evaluation, 그리고 그 평가를 바탕으로
            후보를 고르거나 좁히는 규칙입니다.
          </p>
          <p>
            여기서 말하는 verifier 는{" "}
            <Link to="/ai/open-r1#reward-system">math parser·code test·sandbox 같은 versioned
            verifier measurement</Link> 이거나,{" "}
            <Link to="/ai/agent-verification#layers">결정적 검사부터 judge 까지 쌓은 layered
            verification</Link> 의 한 층일 수 있습니다. 신호가 있느냐 없느냐가 이 글에서 세
            방법의 성패를 가르는 가장 큰 변수입니다.
          </p>
          <p>
            Snell 외 (2024) 는 같은 test-time compute 예산에서 두 접근을 비교했습니다. 쉬운 문제에서는 답을 순차적으로 고쳐 나가는 revision 이 유리해
            64개 revision 이 256개 독립 샘플과 같은 정확도를 냈습니다. 중간 난이도 문제에서는 PRM 으로 방향을 잡는 tree·beam search 가 유리해 16개
            평가만으로 64개 독립 샘플과 같은 효율이 나왔습니다.
          </p>
        </div>
        <SearchBasedReasoningAndTestTimeComputeViz />
        <TermBreakdown
          title="세 방법이 후보를 다루는 시점"
          description="언제 후보를 만들고, 언제 평가하고, 언제 좁히는지가 다릅니다."
          items={[
            { term: "사전 병렬 생성", description: "Best-of-N 은 N 개 후보를 동시에 만들고 사후에 verifier 로 하나를 고릅니다.", example: "N=8 후보를 한 번에 생성", boundary: "후보끼리 정보를 주고받지 않아 중간에 방향을 바꾸지 못합니다." },
            { term: "단계별 분기·가지치기", description: "Tree search 는 매 단계마다 후보를 넓히고 평가해 유망한 것만 남깁니다.", example: "Branching b=5, depth d=3", boundary: "평가 호출 수가 b·d 에 비례해 늘어납니다." },
            { term: "사후 재검토", description: "Self-correction 은 이미 낸 답을 model 스스로 다시 비평하고 고칩니다.", example: "Self-Refine 은 외부 verifier 없이 자기 피드백만 씁니다.", boundary: "외부 신호가 없으면 개선이 보장되지 않고 오히려 나빠질 수 있습니다." },
          ]}
        />
        <ContentBoundary article="search-based-reasoning-and-test-time-compute" />
      </section>

      <section id="best-of-n" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Best-of-N 은 N 개 후보를 독립적으로 만들고 verifier 로 하나를 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Best-of-N 에서는 model 이 같은 prompt 로 N 개의 candidate 를 서로 독립적으로 생성하고 verifier 가 매긴 점수가 가장 높은 하나를 고릅니다.
            후보 사이에 정보 교환이 없어 tree search 보다 구현이 단순합니다.
          </p>
          <p>
            N 을 늘리면 후보 중 정답이 하나라도 있을 확률(pass@N)은 오릅니다. 그 정답을 실제로 골라내는 일은 verifier 의 정확도에 달려 있습니다. Verifier 가
            완벽하지 않으면 pass@N 만큼 정답률이 오르지 않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="N 과 verifier 정확도가 best-of-N 의 기대 정답률을 어떻게 정하나요?"
          idea="적어도 하나의 정답 candidate 가 나올 확률(pass@N)에, verifier 가 정답이 있을 때 그것을 실제로 골라내는 확률을 곱한 것이 기대 정답률입니다."
          formula={String.raw`\mathrm{pass@}N=1-(1-p)^N,\qquad \mathrm{Acc}(N)=q\cdot\mathrm{pass@}N`}
          annotatedFormula={String.raw`\mathrm{pass@}N=\underbrace{1-(1-p)^N}_{\text{적어도 하나가 정답일 확률}},\qquad \mathrm{Acc}(N)=\underbrace{q}_{\text{정답이 있을 때 verifier 가 그것을 고를 확률}}\cdot\mathrm{pass@}N`}
          operations={[
            { expression: String.raw`(1-p)^N`, annotation: ["N 개 후보가 모두 틀릴 확률을 구하고", "1 에서 빼 적어도 하나가 맞을 확률을 얻음"] },
            { expression: String.raw`q\cdot\mathrm{pass@}N`, annotation: ["정답이 존재할 확률에", "verifier 가 그 정답을 실제로 골라내는 정확도 q 를 곱함"] },
          ]}
          terms={[
            { symbol: "p", name: "Pass@1", description: "Candidate 하나가 정답일 확률입니다." },
            { symbol: "N", name: "후보 수", description: "서로 독립적으로 생성하는 candidate 개수입니다." },
            { symbol: "q", name: "Verifier 선택 정확도", description: "정답 candidate 가 있을 때 verifier 가 그것을 최고 점수로 고르는 조건부 정확도입니다." },
          ]}
          assumptions={["Candidate 는 서로 독립이고 같은 p 를 공유한다고 둡니다. 실제로는 같은 prompt 에서 뽑아 상관이 생길 수 있습니다.", "q 는 verifier 의 선택 정확도를 이진 사건으로 단순화한 것이고, 실제 PRM·ORM 은 연속 점수를 냅니다."]}
          interpretation="p=0.3, N=8 이면 pass@8=1-0.7⁸=0.942 입니다. Verifier 정확도 q=0.9 면 실제 기대 정답률은 0.848 로, 후보를 늘려도 verifier 가 완벽하지 않으면 오라클 상한 0.942 에 못 미칩니다."
        />
        <AlgorithmBlock
          title="Best-of-N with verifier: N 개 candidate 를 만들고 점수로 하나를 고름"
          input={["prompt x", "policy model π", "verifier V (PRM 또는 ORM)", "후보 수 N"]}
          steps={[
            { code: "for i in 1..N: y_i ← sample(π(x))", note: "같은 prompt 에서 N 개 candidate 를 서로 독립적으로 생성합니다." },
            { code: "for i in 1..N: s_i ← V(x, y_i)", note: "Verifier 가 각 candidate 에 점수를 매깁니다. PRM 은 단계별 점수를 모으고, ORM 은 최종 답만 봅니다." },
            { code: "y* ← argmax_i s_i", note: "점수가 가장 높은 candidate 하나를 선택합니다." },
          ]}
          output="선택된 candidate y*"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Lightman 외 (2023) 는 MATH 문제에서 N=1860 개 candidate 를 만들어 두 종류의 verifier 를 비교했습니다. 각 reasoning step 에
            점수를 매기는 PRM 은 선택 정확도 78.2%로 최종 답만 보는 ORM 의 72.4%와 다수결 투표 69.6%보다 정확했습니다.
          </p>
          <p>
            다수결 투표는 verifier 없이 가장 많이 나온 답을 고르는{" "}
            <Link to="/ai/prompt-reasoning#chain-of-thought">self-consistency</Link> 방식입니다.
            Verifier 가 있는 best-of-N 이 그 다수결보다도 나은 선택을 할 수 있다는 것이 이
            수치의 의미입니다.
          </p>
        </div>
        <div id="paper-lets-verify-step-by-step" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Lightman, Kosaraju, Burda, Edwards, Baker, Lee, Leike, Schulman, Sutskever, Cobbe · Let's Verify Step by Step"
            citeKey={1}
            href="https://arxiv.org/abs/2305.20050"
          >
            2023년 논문은 최종 답만 채점하는 outcome reward model(ORM)과 각 reasoning step 을
            채점하는 process reward model(PRM)을 비교하고, PRM800K 데이터셋으로 학습한 PRM 이
            MATH best-of-1860 재순위화에서 ORM·다수결 투표보다 정확하게 정답 candidate 를
            고른다는 것을 보였습니다. 78.2%(PRM)·72.4%(ORM)·69.6%(다수결)는 저자 자기보고이며
            수학 reasoning 도메인에 한정됩니다.
          </CitationBlock>
        </div>
      </section>

      <section id="tree-search" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tree search 는 단계마다 후보를 넓히고 평가해 가지치기합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tree search 는 매 depth 마다 유지 중인 상태 각각에서 k 개의 다음 단계 후보(생각)를 만듭니다. Evaluator 가 점수를 매기면 상위 b 개만 다음
            depth 로 넘어갑니다. Best-of-N 과 달리 중간 상태를 평가해 방향을 바꿀 수 있습니다.
          </p>
          <p>
            Tree of Thoughts 의 Game of 24 실험은 b=5, k=5, depth d=3 을 썼습니다. Root 에서 k=5 개 생각을 평가해 b=5 개를 남기고 이후
            두 depth 는 유지 중인 b=5 개 상태마다 k=5 개씩 새로 만들어 평가합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Branching k, 유지 폭 b, depth d 인 tree search 는 몇 개의 후보를 평가하나요?"
          idea="첫 depth 는 root 하나에서 k 개를 만들고, 이후 depth 는 유지 중인 b 개 상태마다 k 개씩 새로 만들어 평가합니다."
          formula={String.raw`E(b,k,d)=k+(d-1)\,b\,k`}
          annotatedFormula={String.raw`E(b,k,d)=\underbrace{k}_{\text{root 에서 만든 첫 depth 후보}}+\underbrace{(d-1)\,b\,k}_{\text{이후 depth 마다 유지 상태 }b\text{개}\times k\text{개 후보}}`}
          operations={[
            { expression: "k", annotation: ["Root(상태 1개)에서", "k 개의 다음 단계 후보를 만들어 평가"] },
            { expression: String.raw`(d-1)\,b\,k`, annotation: ["남은 d-1 개 depth 마다", "유지 중인 b 개 상태 × k 개 후보를 평가"] },
          ]}
          terms={[
            { symbol: "b", name: "유지 폭(beam width)", description: "각 depth 에서 다음으로 넘기는 상태 수입니다." },
            { symbol: "k", name: "Branching factor", description: "상태 하나당 만드는 다음 단계 후보 수입니다." },
            { symbol: "d", name: "Tree 깊이", description: "탐색을 반복하는 depth 수입니다." },
          ]}
          assumptions={["매 depth 마다 유지 상태 수가 정확히 b 개라고 가정합니다. 초반 depth 는 이보다 적을 수 있습니다.", "Evaluator 호출 비용이 후보마다 같다고 둡니다."]}
          interpretation="b=k=5, d=3 이면 E=5+2×5×5=55 개 후보를 평가합니다. Tree of Thoughts 가 Game of 24 에서 보고한 completion 5.5k token 은 이 55 개 후보에 각각 100 token 안팎이 든 것과 맞아떨어집니다."
        />
        <AlgorithmBlock
          title="Beam/tree search 한 step: 유지 상태를 넓히고 다시 가지치기"
          input={["유지 중인 상태 집합 S (크기 ≤ b)", "policy π", "evaluator V", "branching k"]}
          steps={[
            { code: "candidates ← {}", note: "이번 depth 에서 평가할 후보 집합을 비웁니다." },
            { code: "for s in S: for j in 1..k: candidates ← candidates ∪ {expand(s, π)}", note: "유지 중인 상태마다 k 개의 다음 단계 후보를 만듭니다." },
            { code: "scores ← {V(c) : c ∈ candidates}", note: "각 후보를 evaluator 로 평가합니다. Tree of Thoughts 는 sure/maybe/impossible 분류를, PRM 은 스칼라 점수를 씁니다." },
            { code: "S' ← top-b(candidates, scores)", note: "점수가 높은 상위 b 개만 다음 depth 로 남깁니다(가지치기)." },
          ]}
          output="다음 depth 로 넘어갈 상태 집합 S' (크기 ≤ b)"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Tree of Thoughts 는 Game of 24 에서 GPT-4 + chain-of-thought 의 성공률 4%를 74%로 올렸습니다. Evaluator 는 각 생각을
            sure/maybe/impossible 로 분류하도록 model 에 요청합니다. 노이즈를 줄이려고 후보마다 3회 샘플링해 점수를 모읍니다.
          </p>
        </div>
        <div id="paper-tree-of-thoughts" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yao, Yu, Zhao, Shafran, Griffiths, Cao, Narasimhan · Tree of Thoughts: Deliberate Problem Solving with Large Language Models"
            citeKey={2}
            href="https://arxiv.org/abs/2305.10601"
          >
            2023년 논문은 chain-of-thought 의 단일 경로 생성을 일반화해, 중간 사고 단위를 여러
            개 만들고 evaluator 로 평가해 유망한 것만 남기며 탐색하는 tree of thoughts 를
            제시했습니다. Game of 24 에서 b=5, k=5, depth 3 을 쓴 성공률 74%(GPT-4 CoT baseline
            4%)는 저자 자기보고이며 Game of 24·창작 글쓰기·미니 크로스워드 세 과제에 한정됩니다.
          </CitationBlock>
        </div>
      </section>

      <section id="self-correction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Self-correction 은 외부 신호 없이는 개선을 보장하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Self-correction 은 model 이 자신의 답을 스스로 비평하고 고치는 절차입니다. Self-Refine 에서는 같은 model 이 생성자·평가자·수정자 역할을 모두
            맡아 피드백-수정 loop 를 반복하는데 별도 학습이나 verifier 없이 7개 과제에서 평균 20%p 가까운 절대 개선을 보고했습니다.
          </p>
          <p>
            Huang 외 (2023) 가 외부 신호 없이 자기 능력만으로 답을 고치는 intrinsic self-correction 을 GSM8K·CommonSenseQA·
            HotpotQA 에 적용했더니 reasoning 과제에서는 모든 model·모든 benchmark 에서 정확도가 오히려 떨어졌다고 보고했습니다.
          </p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-semibold">Model · Benchmark</th>
                  <th className="py-2 pr-4 font-semibold">Round 0</th>
                  <th className="py-2 pr-4 font-semibold">Round 1</th>
                  <th className="py-2 font-semibold">Round 2</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 text-foreground">GPT-3.5 · GSM8K</td>
                  <td className="py-2 pr-4">75.9%</td>
                  <td className="py-2 pr-4">75.1%</td>
                  <td className="py-2">74.7%</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 text-foreground">GPT-3.5 · CommonSenseQA</td>
                  <td className="py-2 pr-4">75.8%</td>
                  <td className="py-2 pr-4">38.1%</td>
                  <td className="py-2">41.8%</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 text-foreground">GPT-4 · GSM8K</td>
                  <td className="py-2 pr-4">95.5%</td>
                  <td className="py-2 pr-4">91.5%</td>
                  <td className="py-2">89.0%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-foreground">GPT-4 · HotpotQA</td>
                  <td className="py-2 pr-4">49.0%</td>
                  <td className="py-2 pr-4">49.0%</td>
                  <td className="py-2">43.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            두 결과는 과제 종류에서 갈립니다. Self-Refine 이 개선을 본 과제에는 길이·감정·코드 스타일처럼 model 스스로 점검할 기준이 있지만 Huang 외가 하락을 본
            과제는 정답이 하나인 reasoning 이라 model 자신의 비평이 맞는 답을 틀린 답으로 바꾸기 쉽습니다.
          </p>
          <p>
            이 차이가 self-correction 의 경계입니다.{" "}
            <Link to="/ai/agent-verification#layers">결정적 검사나 환경 관측 같은 외부
            verifier</Link> 가 있으면 self-correction 은 그 신호를 따라 안정적으로 개선되지만,
            model 자신의 판단만으로는{" "}
            <Link to="/ai/prompt-reasoning#chain-of-thought">reasoning 과 정답 사이의 책임
            경계</Link> 를 스스로 넘어설 수 없습니다.
          </p>
        </div>
        <div id="paper-self-refine" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Madaan, Tandon, Gupta, Hallinan, Gao, Wiegreffe, Alon, Dziri, Prabhumoye, Yang, Gupta, Majumder, Hermann, Welleck, Yazdanbakhsh, Clark · Self-Refine: Iterative Refinement with Self-Feedback"
            citeKey={3}
            href="https://arxiv.org/abs/2303.17651"
          >
            2023년 논문은 같은 model 이 생성자·평가자·수정자를 겸해 feedback-refine loop 를
            반복하는 self-refine 을 제시했습니다. 추가 학습·강화학습·외부 verifier 없이 대화
            생성·수학 reasoning 등 7개 과제에서 평균 약 20%p 절대 개선은 저자 자기보고이며,
            자기 피드백의 신뢰성에 대한 이론적 보장은 없습니다.
          </CitationBlock>
        </div>
        <div id="paper-self-correction-limits" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Huang, Chen, Mishra, Zheng, Yu, Song, Zhou · Large Language Models Cannot Self-Correct Reasoning Yet"
            citeKey={4}
            href="https://arxiv.org/abs/2310.01798"
          >
            2023년 논문은 외부 신호 없이 자신의 내재적 능력만으로 답을 고치는 intrinsic
            self-correction 을 GSM8K·CommonSenseQA·HotpotQA 에서 GPT-3.5·GPT-4 로 실험해, 모든
            model·모든 benchmark 에서 self-correction 후 정확도가 하락한다고 보고했습니다.
            CommonSenseQA 의 75.8%→38.1% 같은 큰 하락은 저자 자기보고이며, 외부 verifier 나
            gold label 을 준 조건에서는 다루지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          세 방법은 verifier 유무와 후보를 다루는 시점으로 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Best-of-N 은 병렬로 만들어 사후에 고릅니다. Tree search 는 단계마다 넓히고 가지치기하며 self-correction 은 이미 낸 답을 다시 검토합니다. 셋
            다 verifier 나 self-evaluation 의 신뢰도에 결과가 갇힙니다.
          </p>
        </div>
        <TermBreakdown
          title="세 전략의 verifier 의존도"
          description="같은 test-time compute 예산이라도 verifier 품질에 따라 유리한 전략이 다릅니다."
          items={[
            { term: "Best-of-N", description: "Verifier 정확도 q 가 기대 정답률의 상한을 정합니다. N 을 늘려도 q 를 넘지 못합니다.", example: "q=0.6 이면 N 을 아무리 늘려도 정답률은 0.6 근처에 머묾", boundary: "후보가 서로 독립이라는 가정이 sampling 방식에 따라 깨질 수 있습니다." },
            { term: "Tree search", description: "중간 단계를 평가할 수 있어 오류를 일찍 버릴 수 있지만, 평가 호출 수가 b·k·d 에 비례해 늘어납니다.", example: "b=k=5, d=3 에서 평가 55회", boundary: "Evaluator 가 중간 상태를 잘못 판단하면 정답으로 가는 가지를 일찍 잘라낼 수 있습니다." },
            { term: "Self-correction", description: "외부 신호가 있으면 안정적이고, 없으면 개선을 보장하지 못합니다.", example: "GPT-4 GSM8K 는 두 라운드 뒤 95.5%→89.0%", boundary: "Reasoning 처럼 정답이 하나인 과제에서는 자기 비평이 맞는 답을 뒤집을 위험이 큽니다." },
          ]}
        />
        <ProgressiveDetail
          title="같은 예산에서 어떤 전략을 고르나요?"
          preview="Verifier 가 저렴하고 정확하면 best-of-N, 중간 단계를 점수 매길 수 있으면 tree search, 컴파일러·테스트 같은 외부 신호가 있으면 self-correction 을 더합니다. 외부 신호가 전혀 없는 reasoning 에 self-correction 만 쓰는 것은 위험합니다."
        >
          <p>
            판단은 verifier 가 무엇을 볼 수 있는지에서 시작합니다. 최종 답만 채점할 수 있으면 ORM 기반 best-of-N, 중간 step 을 채점할 수 있으면 PRM 기반
            tree·beam search 가 자연스럽고, 둘 다 없이 model 자신의 판단만 있다면 그 판단이 정말 정답과 상관되는지부터 따로 확인한 다음에 self-correction
            을 씁니다.
          </p>
          <p>
            <Link to="/ai/llm-sampling-strategies#test-time-compute">Test-time compute 축 자체의
            정의</Link>는 앞 글이 다뤘습니다. 이 글은 그 축 위에서 실제로 검증하고 탐색하는 세
            방법과, 각 방법이 verifier 품질에 얼마나 갇히는지를 닫습니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
