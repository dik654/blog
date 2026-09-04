import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import { PredictionObjectiveViz } from "../word2vec/viz/ModernWord2VecViz";

export default function Word2VecPredictionObjectivesArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CBOW와 Skip-gram은 같은 window를 반대 방향의 prediction examples로 바꿉니다</h2>
      <TermBreakdown title="예측 방향을 정하는 세 용어" items={[
        { term: "CBOW", description: "여러 context words를 한 representation으로 모아 center word 하나를 예측합니다." },
        { term: "Skip-gram", description: "Center word 하나에서 각 context word를 별도 target으로 예측합니다." },
        { term: "Hierarchical softmax", description: "Target word를 vocabulary leaf로 두고 root→leaf binary decisions의 확률을 곱합니다.", boundary: "Flat softmax의 같은 parameter를 단순히 빠르게 계산하는 것은 아닙니다." },
      ]} />
      <PredictionObjectiveViz />
      <ContentBoundary article="word2vec-prediction-objectives" />
    </section>

    <section id="cbow" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">CBOW는 context rows를 평균해 center-word logits 하나를 만듭니다</h2>
      <ExplainedFormula question="서로 다른 수의 context words를 어떻게 한 center prediction으로 모으나요?" idea={<p>Valid context positions의 input rows를 더하고 context 수로 나눠 평균 h를 만듭니다. Output table과의 내적으로 vocabulary logits를 만든 뒤 softmax에서 실제 center probability를 읽습니다.</p>} formula={String.raw`\mathbf h_t=|C_t|^{-1}\sum_{j\in C_t}\mathbf v_{w_j},\quad P(w_t\mid C_t)=\operatorname{softmax}(W'\mathbf h_t)_{w_t}`} annotatedFormula={String.raw`\begin{aligned}C_t&=\underbrace{\{j:0<|j-t|\le r\}}_{\text{center를 뺀 context 위치}}\\\mathbf s_t&=\underbrace{\sum_{j\in C_t}\mathbf v_{w_j}}_{\text{context input rows를 합산}}\\\mathbf h_t&=\underbrace{\mathbf s_t/|C_t|}_{\text{context 수로 평균}}\\\boldsymbol\ell_t&=\underbrace{W'\mathbf h_t}_{\text{모든 center 후보 score}}\\P(w_t\mid C_t)&=\underbrace{\operatorname{softmax}(\boldsymbol\ell_t)_{w_t}}_{\text{정답 center의 확률}}\end{aligned}`} operations={[
        { expression: String.raw`\sum_{j\in C_t}\mathbf v_{w_j}`, annotation: ["window 안 context rows를 더해", "주변 정보를 한 합으로 모음"] },
        { expression: String.raw`\mathbf s_t/|C_t|`, annotation: ["context 개수로 나눠", "window 크기 차이를 평균으로 정규화"] },
        { expression: String.raw`W'\mathbf h_t`, annotation: ["평균 context를 모든 output rows와 비교해", "vocabulary logits 생성"] },
        { expression: String.raw`\operatorname{softmax}(\boldsymbol\ell_t)_{w_t}`, annotation: ["logits를 합 1의 분포로 바꾸고", "실제 center 위치의 확률을 선택"] },
      ]} terms={[
        { symbol: String.raw`C_t`, name: "Context positions", description: "Center t를 제외한 실제 window 위치입니다." },
        { symbol: String.raw`\mathbf h_t`, name: "CBOW context", description: "순서를 버리고 평균한 context representation입니다." },
        { symbol: "W'", name: "Output table", description: "Center candidates의 score를 만드는 V×d matrix입니다." },
        { symbol: String.raw`\boldsymbol\ell_t`, name: "Vocabulary logits", description: "각 word type의 정규화 전 score입니다." },
      ]} assumptions={["Position weight와 hidden nonlinearity가 없는 기본 CBOW입니다.", "Context order를 사용하지 않습니다.", "Dynamic window에 따라 실제 context 수가 달라집니다."]} interpretation="CBOW는 한 window를 한 example로 압축해 빠르지만 각 context의 순서와 개별 contribution을 잃습니다." />
    </section>

    <section id="skipgram" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Skip-gram은 center 하나에서 context마다 별도의 loss를 만듭니다</h2>
      <ExplainedFormula question="Center w_t에서 window context 여러 개를 예측할 때 loss는 어떻게 쌓이나요?" idea={<p>각 context c는 center-conditioned vocabulary probability의 별도 target입니다. 각 pair의 negative log probability를 더하거나 평균해 center의 loss를 만듭니다.</p>} formula={String.raw`\mathcal L_t=-|C_t|^{-1}\sum_{j\in C_t}\log P(w_j\mid w_t)`} annotatedFormula={String.raw`\begin{aligned}\ell_{tj}&=\underbrace{{\mathbf v'_{w_j}}^{\!\top}\mathbf v_{w_t}}_{\text{center와 context의 dot score}}\\p_{tj}&=\underbrace{\operatorname{softmax}(W'\mathbf v_{w_t})_{w_j}}_{\text{context j의 vocabulary 확률}}\\e_{tj}&=\underbrace{-\log p_{tj}}_{\text{정답 context가 낮으면 큰 penalty}}\\\mathcal L_t&=\underbrace{|C_t|^{-1}\sum_{j\in C_t}e_{tj}}_{\text{context별 error를 평균}}\end{aligned}`} operations={[
        { expression: String.raw`{\mathbf v'_{w_j}}^\top\mathbf v_{w_t}`, annotation: ["center input과 context output row를 내적해", "pair score를 계산"] },
        { expression: String.raw`\operatorname{softmax}(W'\mathbf v_{w_t})_{w_j}`, annotation: ["모든 후보를 공동 정규화하고", "관측 context 확률을 선택"] },
        { expression: String.raw`-\log p_{tj}`, annotation: ["작은 정답 확률을 큰 양의 값으로 바꿔", "최소화할 error 생성"] },
        { expression: String.raw`|C_t|^{-1}\sum_j e_{tj}`, annotation: ["pair errors를 더해 context 수로 나눠", "center마다 같은 평균 단위로 비교"] },
      ]} terms={[
        { symbol: String.raw`\mathbf v_{w_t}`, name: "Center input row", description: "현재 조건 word의 input embedding입니다." },
        { symbol: String.raw`\mathbf v'_{w_j}`, name: "Context output row", description: "관측 context target의 output embedding입니다." },
        { symbol: String.raw`p_{tj}`, name: "Context probability", description: "Center t에서 context j를 예측한 categorical probability입니다." },
        { symbol: String.raw`\mathcal L_t`, name: "Center loss", description: "Window context pair errors의 평균입니다." },
      ]} assumptions={["정확한 flat softmax를 사용하는 기본 Skip-gram입니다.", "Context pairs의 평균·합 reduction을 run마다 고정합니다.", "Rare-word 이점은 corpus·subsampling·budget에 따라 달라집니다."]} interpretation="Radius 2에서 context가 네 개면 center 하나가 네 categorical examples를 만듭니다. 이 방향 차이가 CBOW의 한-example averaging과 다릅니다." />
    </section>

    <section id="hierarchical" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Hierarchical softmax는 word probability를 root-to-leaf decision 곱으로 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Vocabulary word를 binary tree의 leaf에 놓으면 target word에 도달하려면 path의 각 node에서 왼쪽·오른쪽 결정을 내려야 합니다. Leaf probability는 path decision probabilities의 곱입니다. Balanced tree라면 V개 logits 대신 약 log₂V개의 node score를 계산합니다.</p><p>그러나 tree가 parameter sharing과 오류 구조를 정하므로 flat softmax와 같은 distribution을 그대로 근사하는 단순 캐시가 아닙니다.</p></div>
      <ExplainedFormula
        question="Leaf word의 확률은 path 위 node들의 sigmoid를 어떻게 곱해서 나오나요?"
        idea={
          <p>
            Root에서 target leaf까지 내려가며 각 internal node에서 "기준
            자식으로 가는가"를 하나의 sigmoid로 예측합니다. Leaf에 도달할
            확률은 그 경로 위 모든 결정 확률의 곱입니다.
          </p>
        }
        formula={String.raw`P(w\mid w_I)=\prod_{j=1}^{L(w)-1}\sigma\!\Big([\![n(w,j+1)=\mathrm{ch}(n(w,j))]\!]\cdot {v'_{n(w,j)}}^{\!\top} v_{w_I}\Big)`}
        annotatedFormula={String.raw`\begin{aligned}
s_j&=\underbrace{{v'_{n(w,j)}}^{\!\top} v_{w_I}}_{\text{현재 node 벡터와 input word 벡터의 내적}}\\
\mathrm{sign}_j&=\underbrace{[\![n(w,j+1)=\mathrm{ch}(n(w,j))]\!]}_{\text{실제로 간 자식이 기준 자식이면 +1, 아니면 -1}}\\
P(w\mid w_I)&=\underbrace{\prod_{j=1}^{L(w)-1}\sigma(\mathrm{sign}_j\cdot s_j)}_{\text{root부터 leaf 직전까지 각 node의 결정 확률을 모두 곱함}}
\end{aligned}`}
        operations={[
          {
            expression: String.raw`{v'_{n(w,j)}}^{\top} v_{w_I}`,
            annotation: ["현재 path node의 벡터와", "input word 벡터를 내적해 raw score 계산"],
          },
          {
            expression: String.raw`[\![n(w,j+1)=\mathrm{ch}(n(w,j))]\!]`,
            annotation: ["실제로 내려간 자식이 기준 자식과 같은지로", "부호를 +1 또는 -1로 정함"],
          },
          {
            expression: String.raw`\sigma(\mathrm{sign}_j\cdot s_j)`,
            annotation: ["부호 있는 score를", "이 node에서 그 방향으로 갈 확률로 변환"],
          },
          {
            expression: String.raw`\prod_{j=1}^{L(w)-1}(\cdot)`,
            annotation: ["root부터 leaf 바로 위까지", "모든 node 결정 확률을 곱함"],
          },
        ]}
        terms={[
          { symbol: String.raw`L(w)`, name: "path 길이", description: "Root에서 leaf w까지 거치는 node 개수입니다." },
          { symbol: String.raw`n(w,j)`, name: "j번째 path node", description: "Root(n(w,1))부터 leaf 바로 위 node까지, w로 가는 경로의 j번째 internal node입니다." },
          { symbol: String.raw`\mathrm{ch}(n)`, name: "기준 자식", description: "Node n의 두 자식 중 항상 같은 쪽(예: 왼쪽)을 '기준'으로 고정해 부호를 정의합니다." },
          { symbol: String.raw`v'_{n(w,j)}`, name: "node의 output vector", description: "Leaf가 아니라 internal node마다 따로 갖는 학습 parameter입니다." },
          { symbol: String.raw`v_{w_I}`, name: "input word vector", description: "조건으로 주어진 input word(CBOW는 평균 context, Skip-gram은 center)의 embedding입니다." },
        ]}
        assumptions={[
          "각 leaf가 정확히 한 vocabulary word에 대응하는 binary tree를 가정합니다.",
          "모든 leaf path 확률의 합이 1이 되려면 tree가 확률 공간을 정확히 분할해야 합니다(각 internal node에서 왼쪽·오른쪽 확률의 합이 1).",
        ]}
        interpretation="Flat softmax의 V번 연산 대신, 이 곱은 균형 tree라면 약 log₂V번의 sigmoid 연산만 필요합니다. 다만 이 확률은 flat softmax를 근사하는 값이 아니라 tree 구조 자체가 정의하는 별도의 분포입니다."
      />
      <p className="text-sm leading-7 text-muted-foreground">
        Tree 모양이 확률 공간을 정하므로 어떤 word를 어디에 놓을지가
        중요합니다. Word2vec은 임의 binary tree가 아니라, corpus frequency로
        직접 tree를 구성하는 Huffman coding을 씁니다.
      </p>
      <AlgorithmBlock
        title="Huffman tree 구성 — 빈도가 높을수록 짧은 경로"
        input={["Vocabulary word별 corpus frequency count"]}
        steps={[
          {
            code: "heap = [Leaf(word, freq) for word, freq in vocab_freq.items()]",
            note: "각 word를 자신의 frequency를 weight로 갖는 leaf node로 초기화합니다.",
          },
          {
            code: "heapify(heap)  # frequency 기준 min-heap",
            note: "Frequency가 가장 작은 두 node를 항상 먼저 꺼낼 수 있도록 min-heap으로 정렬합니다.",
          },
          {
            code: "while len(heap) > 1:\n    a = heappop(heap)\n    b = heappop(heap)",
            note: "현재 남은 node 중 frequency가 가장 작은 두 개를 꺼냅니다 — 흔한 word가 아니라 희귀한 word부터 먼저 묶습니다.",
          },
          {
            code: "parent = InternalNode(freq=a.freq + b.freq, left=a, right=b)\nheappush(heap, parent)",
            note: "두 node를 자식으로 갖는 새 internal node를 만들어 합산 frequency로 다시 heap에 넣습니다.",
          },
        ]}
        output="heap[0] — 전체 vocabulary를 leaf로 갖는 단일 root node"
        repeatUntil="heap에 root 하나만 남을 때까지 반복합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          매 iteration마다 가장 작은 두 frequency를 먼저 합치는 greedy 선택은 Huffman의 고전적 보장을 그대로 물려받습니다. 결과 tree의 가중 경로
          길이(frequency × path 길이의 합)를 가능한 tree 중 최소로 만든다는 보장입니다. 자연어 word frequency는 skew가 극심해 소수의 흔한 단어가 대부분의
          학습 example을 차지합니다. 이 흔한 단어들에 짧은 경로를 몰아주면 balanced tree(모든 word에 같은 경로 길이)보다 학습 한 번당 평균 sigmoid 연산 수가
          더 줄어듭니다.
        </p>
      </div>
      <div id="paper-word2vec-objectives" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Mikolov et al. — Efficient Estimation of Word Representations" href="https://arxiv.org/abs/1301.3781#page=3">CBOW·Skip-gram prediction direction과 hierarchical softmax를 큰 vocabulary 학습에 사용한 원 연구입니다. 당시 speed·analogy 결과는 논문의 corpus와 구현 조건에 제한됩니다.</CitationBlock></div>
    </section>
  </div>;
}
