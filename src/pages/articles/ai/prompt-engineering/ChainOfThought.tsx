import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { ReasoningPathsViz } from "./viz/ReasoningPathsViz";

export default function ChainOfThought() {
  return (
    <section id="chain-of-thought" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Chain-of-Thought는 중간 reasoning을 유도하지만 정답 증명서는 아니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          산술 word problem이나 여러 조건을 조합하는 symbolic task는 최종 answer를
          한 번에 생성하기보다 중간 식과 상태를 순서대로 만들 때 더 잘 풀리는
          경우가 있습니다. <strong>Chain-of-Thought(CoT) prompting</strong>은 worked
          reasoning demonstration이나 단계적 instruction으로 이런 intermediate
          sequence를 유도하는 방법입니다. 반면 단순 사실 검색에서는 긴 reasoning보다
          source retrieval과 citation 검사가 더 직접적인 verifier일 수 있습니다.
        </p>
      </div>

      <TermBreakdown
        title="Reasoning 글에서 먼저 구분할 세 대상"
        description="중간 문장, 최종 답, 외부 판정을 분리해야 조합 단계에서 역할이 섞이지 않습니다."
        items={[
          {
            term: "Reasoning path",
            description: "문제에서 answer까지 model이 생성한 중간 식·상태·자연어 단계입니다.",
            example: "거리=속력×시간을 고르고 단위를 맞춘 뒤 숫자를 대입하는 한 풀이입니다.",
            boundary: "읽기 좋은 path가 실제 내부 causal trace이거나 정답 증명서라는 뜻은 아닙니다.",
          },
          {
            term: "Answer marginalization",
            description: "여러 path의 문장을 섞지 않고 path마다 추출한 최종 answer의 빈도를 합치는 추정입니다.",
            example: "42가 4표, 40이 2표, 41이 1표라면 tie rule에 따라 42를 선택합니다.",
            boundary: "같은 잘못된 전제를 공유하면 agreement가 커도 모두 틀릴 수 있습니다.",
          },
          {
            term: "External verifier",
            description: "Model 설명 밖에서 계산·단위·source span·tool permission을 판정하는 절차입니다.",
            example: "산술은 executable test, 검색은 citation span, action은 runtime authorization으로 확인합니다.",
            boundary: "Verifier가 검사하지 않는 사실성·정책 항목까지 자동으로 보장하지 않습니다.",
          },
        ]}
      />

      <div className="not-prose my-8"><ReasoningPathsViz /></div>
      <ContentBoundary article="prompt-reasoning" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CoT를 적용할 때는 answer accuracy와 explanation faithfulness를 구분해야
          합니다. Model이 출력한 reasoning은 answer와 함께 생성된 자연어 output이며,
          내부 계산의 완전한 causal trace라고 보장되지 않습니다. 계산은 executable
          code나 unit test로, 검색은 source span으로, 계획은 실제 environment
          observation으로 검증하는 편이 안전합니다.
        </p>
        <div id="paper-chain-of-thought" className="not-prose scroll-mt-24">
          <CitationBlock source="Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" citeKey={1} href="https://arxiv.org/abs/2201.11903">
            원 논문은 few-shot worked reasoning이 arithmetic·commonsense·symbolic
            benchmark에서 성능을 높인 결과를 보고했습니다. 해당 model scale·example·
            task·decoding 조건의 empirical result이며 모든 task의 일반 법칙이나
            reasoning faithfulness 보장은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <ExplainedFormula
        question="여러 reasoning path가 서로 다른 최종 답을 낼 때 self-consistency는 무엇을 계산할까요?"
        idea={<p>
            같은 question에서 K개의 path와 answer를 sampling한 뒤 answer y를 낸 sample 수를 합산해 가장 많이 지지된 값을 고릅니다. Reasoning
            문장을 평균내는 것이 아니라 최종 answer에 대해 sample marginalization을 근사합니다.
          </p>}
        formula={String.raw`\hat y=\arg\max_{y}\sum_{k=1}^{K}\mathbf{1}\!\left[a_k=y\right]`}
        annotatedFormula={String.raw`\begin{aligned}
v_k(y)&=\underbrace{\mathbf 1[a_k=y]}_{\text{k번째 answer가 y이면 1}}\\[3pt]
c(y)&=\underbrace{\sum_{k=1}^{K}v_k(y)}_{\text{K개 path의 표를 합산}}\\[3pt]
\hat y&=\underbrace{\arg\max_y c(y)}_{\text{표가 가장 많은 answer 선택}}
\end{aligned}`}
        operations={[
          {
            expression: String.raw`\mathbf 1[a_k=y]`,
            annotation: ["각 path의 answer가", "후보 y와 같은지 0 또는 1로 바꿉니다"],
          },
          {
            expression: String.raw`\sum_{k=1}^{K}\mathbf 1[a_k=y]`,
            annotation: ["K개 indicator를 더해", "후보 y의 표 수를 셉니다"],
          },
          {
            expression: String.raw`\arg\max_y`,
            annotation: ["후보별 표 수를 비교해", "가장 큰 answer를 선택합니다"],
          },
        ]}
        terms={[
          { symbol: "K", name: "sample count", description: "같은 question에서 서로 다른 decoding path를 생성한 횟수입니다." },
          { symbol: "a_k", name: "sampled answer", description: "k번째 reasoning path에서 추출한 최종 answer입니다." },
          { symbol: "\\mathbf{1}[a_k=y]", name: "indicator", description: "k번째 answer가 후보 y와 같으면 1, 아니면 0입니다." },
          { symbol: "\\hat y", name: "selected answer", description: "sample frequency가 가장 큰 answer이며 tie rule은 별도로 정해야 합니다." },
        ]}
        assumptions={[
          "Answer extraction과 equivalence rule을 먼저 고정합니다. '42'와 '42.0'을 같은 답으로 볼지 명시해야 합니다.",
          "Sampling temperature·top-p·K·model·prompt를 고정하고 token·latency 비용을 함께 기록합니다.",
          "Sample이 독립이거나 다수 answer가 정답이라는 보장은 없으므로 외부 verifier와 abstention 기준을 둡니다.",
        ]}
        interpretation="7개 answer가 42, 42, 40, 42, 41, 42, 40이면 frequency가 4인 42를 선택합니다. 하지만 네 path가 같은 잘못된 premise를 공유할 수 있으므로 agreement는 correctness certificate가 아닙니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-self-consistency" className="not-prose scroll-mt-24">
          <CitationBlock source="Self-Consistency Improves Chain of Thought Reasoning" citeKey={2} href="https://arxiv.org/abs/2203.11171">
            Self-consistency는 greedy path 하나 대신 여러 path를 sampling하고 answer를
            합치는 decoding 전략입니다. 논문의 benchmark 향상은 해당 sample 수와
            decoding 조건에 한정되며 K배에 가까운 compute 비용과 correlated error를
            함께 평가해야 합니다.
          </CitationBlock>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-cot-faithfulness" className="not-prose scroll-mt-24">
          <CitationBlock source="Language Models Don't Always Say What They Think" citeKey={3} href="https://arxiv.org/abs/2305.04388">
            이 연구는 multiple-choice task에 biasing feature를 넣고 answer가 바뀐
            경우 CoT가 그 영향을 언급하는지 측정해 unfaithful explanation 사례를
            보고했습니다. 모든 CoT가 거짓이라는 결론이 아니라, 자연어 explanation
            하나만으로 causal faithfulness를 인증할 수 없다는 근거입니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
