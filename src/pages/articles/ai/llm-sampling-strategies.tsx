import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LlmSamplingStrategiesViz from "./llm-sampling-strategies/viz/LlmSamplingStrategiesViz";

/**
 * Sampling 전략은 temperature 로 분포를 바꾸고 top-k·top-p 로 자릅니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LlmSamplingStrategiesArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Sampling 전략은 결정적 tie-break 과 확률 재정규화 축의 선택입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM 이 다음 token 을 고르는 규칙은 두 갈래로 나뉩니다. Greedy 와 beam search 는 점수가
            가장 높은 후보를 그대로 고르는 결정적 tie-break 이고, temperature·top-k·top-p 는
            확률 분포를 자르고 다시 정규화한 뒤 표본을 뽑는 확률적 규칙입니다. 이 글은 후자의 세
            규칙과, 추론에 더 많은 연산을 써서 품질을 사는 test-time compute 축을 다룹니다.
          </p>
          <p>
            확률적 규칙은 한 step 안에서 순서대로 적용됩니다. Logit 을 temperature 로 나눠 분포의
            뾰족함을 조절하고, top-k 나 top-p 로 일부 token 만 남긴 뒤, 남은 확률을 다시 1로
            정규화해 그 위에서 표본을 뽑습니다. 이 네 단계가 이 글이 다루는 전부입니다.
          </p>
          <p>
            이 결정은{" "}
            <Link to="/ai/seq2seq#decoder">autoregressive decoding</Link> 의 한 step 마다
            반복되고, 자르는 대상인 확률 분포는{" "}
            <Link to="/ai/softmax#overview">softmax normalization</Link> 이 이미 만들어 둔
            것입니다. 이 글은 그 분포를 어떻게 자르고 다시 쓰는지를 봅니다.
          </p>
        </div>
        <AlgorithmBlock
          title="한 decode step: logits → temperature → truncation → renormalize → sample"
          input={["logits z (vocab 크기)", "temperature T", "truncation 방식과 파라미터(k 또는 p)"]}
          steps={[
            { code: "z' ← z / T", note: "Temperature 로 logit 간격을 좁히거나 넓힙니다. T<1 은 상위 token 에 더 몰리게, T>1 은 평평하게 만듭니다." },
            { code: "p ← softmax(z')", note: "조절된 logit 을 softmax 로 확률 분포로 바꿉니다." },
            { code: "V ← truncate(p, method, param)", note: "Top-k 면 확률 상위 k 개, top-p 면 누적 확률이 param 이상이 되는 최소 집합을 남깁니다." },
            { code: "p' ← renormalize(p, V)", note: "V 안의 확률만 합이 1이 되도록 다시 나눕니다. V 밖은 0입니다." },
            { code: "token ← sample(p')", note: "재정규화된 분포 p' 에서 하나를 뽑아 다음 step 의 조건에 더합니다." },
          ]}
          output="선택된 token 하나 (다음 step 의 prefix 에 추가)"
        />
        <LlmSamplingStrategiesViz />
        <TermBreakdown
          title="결정 축의 두 갈래"
          description="같은 분포를 두고 그대로 최댓값을 고르느냐, 자르고 다시 표본을 뽑느냐가 갈립니다."
          items={[
            { term: "결정적 tie-break", description: "Greedy 는 매 step 확률이 가장 높은 token 을 그대로 고르고, beam search 는 누적 score 상위 몇 개의 경로를 끝까지 유지합니다.", example: "Beam width 4 면 후보 경로 4개를 끝까지 유지", boundary: "같은 입력에 항상 같은 출력을 내지만 반복되거나 짧고 일반적인 문장에 수렴하기 쉽습니다." },
            { term: "확률적 규칙", description: "분포를 temperature 로 바꾸고 top-k 나 top-p 로 자른 뒤, 재정규화된 분포에서 표본을 뽑습니다.", example: "T=0.7, top-p=0.9 조합이 흔한 기본값", boundary: "표본추출이라 같은 prefix 에서도 매번 다른 token 이 나올 수 있습니다." },
          ]}
        />
        <ContentBoundary article="llm-sampling-strategies" />
      </section>

      <section id="temperature" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Temperature 는 truncation 이전에 분포의 뾰족함을 먼저 조절합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Temperature T 는 logit 을 T 로 나눠 softmax 에 넣는 변환으로, T&lt;1 이면 상위 token 에
            확률이 더 몰리고 T&gt;1 이면 token 사이 확률 차이가 줄어 분포가 평평해집니다. 이
            변환 자체는{" "}
            <Link to="/ai/softmax#temperature">기존 글</Link> 이 정의했고, 이 글은 그 결과가
            top-k·top-p 의 입력으로 어떻게 들어가는지만 봅니다.
          </p>
          <p>
            5개 token 분포 [0.50, 0.20, 0.15, 0.10, 0.05] 에 T=0.5 를 적용하면
            [0.769, 0.123, 0.069, 0.031, 0.008] 로 1등 token 에 더 몰리고, T=2 를 적용하면
            [0.340, 0.215, 0.186, 0.152, 0.107] 로 다섯 token 의 확률이 서로 가까워집니다.
          </p>
          <p>
            Logit 을 T 로 나눈 뒤 다시 softmax 하는 이 변환은 원래 확률 p_i 를 p_i^(1/T) 로 올리고
            다시 정규화한 것과 같은 결과를 냅니다. 뒤에 나오는 top-k 와 top-p 는 이렇게 조절된
            분포 위에서 몇 개의 token 을 남길지를 정합니다.
          </p>
        </div>
      </section>

      <section id="top-k" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Top-k truncation 은 확률 순서로 정확히 k 개만 남기고 나머지를 지웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Top-k sampling 은 확률이 큰 순서로 k 개 token 만 남기고 나머지는 0으로 만든 뒤, 남은
            k 개의 합이 1이 되도록 다시 정규화하는 방법입니다. k 는 분포 모양과 무관한 고정 값이라
            아주 평평한 분포에서도 정확히 k 개만 남습니다.
          </p>
          <p>
            원본 분포 [0.50, 0.20, 0.15, 0.10, 0.05] 에 k=2 를 적용하면 A, B 만 남고 나머지 세
            token 은 확률 0이 됩니다. 남은 합 0.7 로 나누면 A=0.714, B=0.286 이 되어, C 의 0.15 가
            B 의 0.2 와 크게 다르지 않아도 그대로 버려집니다.
          </p>
        </div>
        <ExplainedFormula
          question="Top-k truncation 은 분포를 어떻게 자르고 다시 정규화하나요?"
          idea="확률이 큰 순서로 k 개까지만 남기고 나머지를 0으로 만든 뒤, 남은 k 개의 합이 1이 되도록 나눕니다."
          formula={String.raw`V^{(k)}=\operatorname{top\text{-}k}_i(p_i),\qquad p'_i=\frac{p_i\,[i\in V^{(k)}]}{\sum_{j\in V^{(k)}}p_j}`}
          annotatedFormula={String.raw`V^{(k)}=\underbrace{\operatorname{top\text{-}k}_i(p_i)}_{\text{확률 상위 }k\text{개 index}},\qquad p'_i=\frac{\overbrace{p_i\,[i\in V^{(k)}]}^{\text{집합 밖은 0}}}{\underbrace{\sum_{j\in V^{(k)}}p_j}_{\text{남은 확률의 합으로 나눔}}}`}
          operations={[
            { expression: String.raw`V^{(k)}=\operatorname{top\text{-}k}_i(p_i)`, annotation: ["확률이 큰 순서로 정렬해", "상위 k 개 token 의 index 집합을 고름"] },
            { expression: String.raw`p_i\,[i\in V^{(k)}]`, annotation: ["집합 안의 token 은 원래 확률을 두고", "집합 밖은 0으로 만듦"] },
            { expression: String.raw`\sum_{j\in V^{(k)}}p_j`, annotation: ["남은 k 개 확률의 합을 구해", "그 합으로 나눠 다시 1로 만듦"] },
          ]}
          terms={[
            { symbol: "k", name: "Truncation 크기", description: "매 step 고정된 값으로, 분포 모양과 무관하게 정확히 k 개를 남깁니다." },
            { symbol: "p_i", name: "원본 확률", description: "Temperature 가 이미 적용된 softmax 출력입니다." },
            { symbol: String.raw`V^{(k)}`, name: "남기는 index 집합", description: "확률 상위 k 개의 index 로, 크기가 항상 k 로 고정됩니다." },
          ]}
          assumptions={["Tie 가 있으면 구현별로 처리 규칙(정렬 안정성 등)이 다릅니다.", "k 는 분포 모양과 무관한 고정 값이라 아주 평평한 분포에서도 k 개만 남습니다."]}
          interpretation="분포 [0.5, 0.2, 0.15, 0.1, 0.05]에 k=2 를 적용하면 남는 건 A, B 뿐이고 합 0.7 로 나눠 0.714, 0.286 이 됩니다. C 의 0.15 는 B 의 0.2 와 큰 차이가 없어도 버려집니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Fan 외 (2018) 는 이야기 생성에서 k=10 을 썼습니다. Beam search 는 흔한 구절만 반복해
            짧고 일반적인 문장을 만들고, 순수 표본추출은 학습 때 보지 못한 낮은 확률 단어를 가끔
            뽑아 생성을 망가뜨리므로, k 로 그 위험만 잘라내면서 다양성은 남긴다는 것이 근거였습니다.
          </p>
        </div>
        <div id="paper-top-k-sampling" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Fan, Lewis, Dauphin · Hierarchical Neural Story Generation"
            citeKey={1}
            href="https://arxiv.org/abs/1805.04833"
          >
            2018년 논문은 조건부 이야기 생성에서 beam search 가 흔한 구절을 반복해 짧고 일반적인
            문장을 만드는 문제와, 순수 표본추출이 학습 때 보지 못한 낮은 확률 단어를 뽑아 생성을
            망가뜨리는 문제를 함께 지적하고, 확률 상위 k=10 개 token 만 남겨 표본을 뽑는 top-k
            sampling 을 채택했습니다. 사람 평가자가 2:1 비율로 비계층적 baseline 보다 선호한
            결과는 저자 자기보고이며 story generation task 에 한정됩니다.
          </CitationBlock>
        </div>
      </section>

      <section id="top-p" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Top-p(nucleus) truncation 은 누적 확률로 남길 개수를 매번 다시 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Top-p sampling 은 확률을 큰 순서로 누적하다가 그 합이 p 를 넘는 순간까지의 token 만
            남기고 재정규화하는 방법입니다. 분포가 뾰족하면 적은 수만, 평평하면 많은 수를 남겨
            top-k 처럼 개수를 고정하지 않습니다.
          </p>
          <p>
            같은 분포 [0.50, 0.20, 0.15, 0.10, 0.05] 에 p=0.8 을 적용하면 A+B=0.70 으로 아직
            부족해 C 까지 더한 0.85 에서 넘습니다. 남는 건 A, B, C 세 개고 0.588, 0.235, 0.176 으로
            재정규화되어, 같은 분포에 top-k=2 를 적용했을 때보다 하나 더 남습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Top-p(nucleus) truncation 은 남길 token 수를 어떻게 정하나요?"
          idea="확률을 큰 순서로 누적하다가 합이 p 를 넘는 순간까지의 token 만 남기므로, 분포가 뾰족하면 적게, 평평하면 많이 남습니다."
          formula={String.raw`V^{(p)}=\min\Big\{S:\sum_{i\in S}p_i\ge p\Big\},\qquad p'_i=\frac{p_i\,[i\in V^{(p)}]}{\sum_{j\in V^{(p)}}p_j}`}
          annotatedFormula={String.raw`V^{(p)}=\underbrace{\min\Big\{S:\sum_{i\in S}p_i\ge p\Big\}}_{\text{누적 확률이 }p\text{를 넘는 최소 상위 집합}},\qquad p'_i=\frac{\overbrace{p_i\,[i\in V^{(p)}]}^{\text{집합 밖은 0}}}{\underbrace{\sum_{j\in V^{(p)}}p_j}_{\text{남은 확률의 합으로 나눔}}}`}
          operations={[
            { expression: String.raw`\sum_{i\in S}p_i\ge p`, annotation: ["확률을 큰 순서로 누적하다가", "합이 threshold p 를 넘는 지점을 찾음"] },
            { expression: String.raw`V^{(p)}=\min\{S:\dots\}`, annotation: ["그 지점까지의 token 만 남긴 집합을", "V^(p) 로 둠 (크기는 매 step 다름)"] },
            { expression: String.raw`\sum_{j\in V^{(p)}}p_j`, annotation: ["남은 token 확률의 합으로 나눠", "다시 1이 되도록 재정규화"] },
          ]}
          terms={[
            { symbol: "p", name: "누적 확률 threshold", description: "0과 1 사이의 값으로, 논문은 실험적으로 0.95 를 씁니다." },
            { symbol: String.raw`V^{(p)}`, name: "남기는 index 집합", description: "누적 확률이 p 를 처음 넘는 지점까지의 token 으로, 크기가 매 step 달라집니다." },
            { symbol: "p_i", name: "원본 확률", description: "Temperature 가 이미 적용된 softmax 출력입니다." },
          ]}
          assumptions={["항상 확률 내림차순으로 누적하며, 동률이면 top-k 와 같은 정렬 안정성 문제가 남습니다.", "Threshold p 를 정하는 이론적 규칙은 없고 논문은 실험으로 0.95 를 골랐습니다."]}
          interpretation="분포 [0.5, 0.2, 0.15, 0.1, 0.05]에 p=0.8 을 적용하면 A+B=0.7 로 부족해 C 까지 더해 0.85 로 넘습니다. 남는 건 A, B, C 세 개이고 0.588, 0.235, 0.176 으로 재정규화됩니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Greedy 나 top-k=40 같은 좁은 truncation 은 반복(degeneration)을 만듭니다. 한 번
            반복된 구절은 다음 step 에서 확률이 더 올라가는 positive feedback 이 있어, 결정적
            규칙일수록 그 구절을 계속 고르게 됩니다.
          </p>
          <div className="not-prose my-6 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-semibold">방법</th>
                  <th className="py-2 pr-4 font-semibold">Perplexity</th>
                  <th className="py-2 pr-4 font-semibold">Self-BLEU</th>
                  <th className="py-2 font-semibold">반복률</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 text-foreground">사람 텍스트</td>
                  <td className="py-2 pr-4">12.38</td>
                  <td className="py-2 pr-4">0.31</td>
                  <td className="py-2">0.28%</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 text-foreground">Nucleus p=0.95</td>
                  <td className="py-2 pr-4">13.13</td>
                  <td className="py-2 pr-4">0.32</td>
                  <td className="py-2">0.36%</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 text-foreground">Top-k=40</td>
                  <td className="py-2 pr-4">6.88</td>
                  <td className="py-2 pr-4">0.39</td>
                  <td className="py-2">0.78%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-foreground">순수 표본추출</td>
                  <td className="py-2 pr-4">22.73</td>
                  <td className="py-2 pr-4">0.28</td>
                  <td className="py-2">0.22%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Nucleus p=0.95 는 이 세 지표 모두에서 사람 텍스트에 가장 가깝습니다. Top-k=40 은
            반복률이 사람의 세 배 가까이 높고, 순수 표본추출은 perplexity 가 사람보다 훨씬 높아
            문장이 덜 일관됩니다. Holtzman 외 (2020) 가 GPT-2 large 로 측정한 수치입니다.
          </p>
        </div>
        <div id="paper-nucleus-sampling" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Holtzman, Buys, Du, Forbes, Choi · The Curious Case of Neural Text Degeneration"
            citeKey={2}
            href="https://arxiv.org/abs/1904.09751"
          >
            2020년 ICLR 논문은 우도가 높은 디코딩(greedy·beam search)이 오히려 반복적이고 이상한
            텍스트를 만드는 neural text degeneration 을 지적하고, 누적 확률이 threshold p 를 넘는
            최소 상위 집합에서만 표본을 뽑는 nucleus sampling 을 제시했습니다. GPT-2 large 로
            측정한 perplexity·self-BLEU·반복률 표는 저자 자기보고이며 p=0.95 는 실험으로 고른
            값입니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="Top-k 와 top-p 의 차이"
          description="둘 다 분포를 자르고 재정규화하지만, 무엇을 고정하는지가 다릅니다."
          items={[
            { term: "Top-k", description: "항상 k 개를 남겨 계산이 예측 가능하지만, 분포가 평평하면 너무 많이 자르고 뾰족하면 너무 적게 자를 수 있습니다.", example: "원본 분포에서 k=2 는 항상 정확히 2개", boundary: "고정 k 가 모든 step 의 분포 모양에 맞지 않을 수 있습니다." },
            { term: "Top-p", description: "누적 확률 기준으로 남는 개수가 매 step 달라져 분포 모양에 스스로 맞춰집니다.", example: "T=2 로 평평해진 분포에서 p=0.8 은 4개까지 남김", boundary: "Threshold p 자체는 실험으로 고르는 값이라 최적값의 이론적 근거는 없습니다." },
          ]}
        />
      </section>

      <section id="test-time-compute" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Test-time compute 는 학습이 아니라 추론에서 연산을 더 써 품질을 삽니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Test-time compute 는 model parameter 를 고정한 채 추론 시점에 더 많은 연산(여러 후보
            생성, 더 긴 reasoning, 탐색)을 써서 답의 품질을 올리는 축입니다. 지금까지 다룬
            temperature·top-k·top-p 가 한 step 의 분포를 다루는 것과 달리, 이 축은 여러 step 이나
            여러 후보에 걸친 연산 배분을 다룹니다.
          </p>
          <p>
            이 연산을 문제 난이도에 맞게 배분하는 것이 compute-optimal scaling 입니다. 쉬운
            문제에 배분을 몰아 쓰면 낭비고, 어려운 문제에 너무 적게 쓰면 애초에 답이 나오지
            않습니다.
          </p>
          <p>
            Snell 외 (2024) 는 문제 난이도에 test-time compute 를 적응적으로 배분하는
            compute-optimal 전략이 고정 배분보다 최대 4배 효율적이고, 쉽거나 중간 난이도인
            문제에서는 test-time compute 만으로 14배 더 큰 model 과 동등한 정확도를 낼 수 있다고
            보고했습니다. 어려운 문제에서는 여전히 pretraining 쪽 투자가 유리했습니다.
          </p>
          <p>
            구체적으로 몇 개의 후보를 만들고 어떻게 고를지(best-of-N), 후보들을 tree 로 넓히고
            가지치기할지(tree search), 틀린 답을 스스로 고칠지(self-correction)는 다음 글이
            다룹니다. 이 글은 그 세 방법이 공유하는 축의 정의만 닫습니다.
          </p>
        </div>
        <div id="paper-test-time-compute-scaling" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Snell, Lee, Xu, Kumar · Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters"
            citeKey={3}
            href="https://arxiv.org/abs/2408.03314"
          >
            2024년 논문은 test-time compute 를 문제 난이도에 맞춰 배분하는 compute-optimal
            전략이 고정 전략 대비 최대 4배 효율적이고, PRM 기반 탐색과 순차 revision 을 난이도별로
            섞으면 쉽거나 중간 난이도 문제에서 test-time compute 만으로 14배 큰 model 과 동등한
            정확도를 낼 수 있다고 보고했습니다. PaLM 2-S 계열과 MATH benchmark 기준이며 어려운
            문제에서는 pretraining 이 여전히 유리했습니다.
          </CitationBlock>
        </div>
        <ProgressiveDetail
          title="실무에서는 어떤 조합을 기본값으로 쓰나요?"
          preview="Sampling 을 쓰는 대화·생성형 서비스는 T=0.7~1.0 에 top-p=0.9 안팎을 기본으로 두고 top-k 는 극단적인 낮은 확률 token 을 막는 안전망으로만 남겨 둡니다. 평가나 재현성이 중요하면 greedy 로 고정하고, 정확도가 더 필요하면 test-time compute 를 늘립니다."
        >
          <p>
            네 값은 서로 다른 실패를 막습니다. T 가 너무 낮으면 반복이, 너무 높으면 문법이
            깨지는 표본이 늘고, top-k 가 너무 작으면 다양성이 죽고 top-p 가 너무 크면 저확률
            token 이 다시 섞입니다. 자기 workload 의 반복률과 문법 오류율을 재는 것이 기본값을
            정하는 유일한 방법입니다.
          </p>
          <p>
            Test-time compute 는 이 네 값과 독립적으로 조절할 수 있는 다섯 번째 축입니다. 같은
            top-p=0.9 설정으로 후보를 하나만 뽑을 수도, 여러 개 뽑아 그중 하나를 고를 수도
            있습니다. 그 선택 방법은 다음 글에서 다룹니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
