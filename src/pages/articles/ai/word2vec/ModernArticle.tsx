import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { word2vecTree } from "./fileTree";
import { Word2VecPairViz } from "./viz/ModernWord2VecViz";

export default function Word2VecArticle() {
  const sidebar = useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Word2Vec은 단어를 바로 이해하지 않고, word ID가 고른 row를 주변 단어와 함께 업데이트합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Tokenizer가 corpus를 word ID sequence로 만들면 각 ID는 embedding table의 한 row를 가리킵니다. 처음 row의 숫자는 무작위에 가깝습니다. 가까운 window에서 반복해서 관찰한 word–context pairs가 어떤 row끼리 높은 score를 가져야 하는지 학습하면서 좌표계가 생깁니다.</p></div>
      <TermBreakdown title="Corpus 문장에서 training pair까지 필요한 용어" items={[
        { term: "Vocabulary", description: "Word type과 integer ID의 고정 대응표입니다.", boundary: "ID 숫자 자체에는 의미나 거리가 없습니다." },
        { term: "Embedding row", description: "ID가 선택하는 d개의 trainable scalar입니다.", example: "ID 42는 W[42]의 300개 값을 읽습니다." },
        { term: "Center word", description: "현재 prediction example의 기준이 되는 가운데 token입니다." },
        { term: "Context word", description: "같은 sentence의 local window 안에서 center와 함께 관찰한 이웃 token입니다.", boundary: "Window가 가까움을 관찰할 뿐 동의어 label을 직접 주는 것은 아닙니다." },
      ]} />
      <Word2VecPairViz />
      <ContentBoundary article="word2vec" />
    </section>

    <section id="dual-tables" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">같은 word도 center일 때와 context일 때 서로 다른 table row를 사용합니다</h2>
      <TermBreakdown title="두 table을 한 줄씩 구분" items={[
        { term: "Input table W", description: "Word가 center·condition 역할일 때 읽는 V×d matrix입니다." },
        { term: "Output table W′", description: "Word가 예측 target·context 역할일 때 읽는 별도 V×d matrix입니다." },
        { term: "Pair score", description: "Center input row와 context output row의 dot product입니다.", boundary: "같은 ID라도 두 row는 다른 gradient를 받아 같지 않습니다." },
      ]} />
      <ExplainedFormula question="One-hot ID는 어떻게 input row 하나와 output row 하나를 고르나요?" idea={<p>ID 위치만 1인 one-hot vector를 table에 곱하면 다른 모든 row는 0이 되고 선택한 row만 남습니다. 구현은 같은 결과를 sparse gather로 계산합니다.</p>} formula={String.raw`\mathbf v_w=\mathbf o_w^\top W,\quad \mathbf v'_w=\mathbf o_w^\top W'`} annotatedFormula={String.raw`\begin{aligned}\mathbf o_w&=\underbrace{(0,\ldots,1_w,\ldots,0)}_{\text{word w의 row 주소}}\\\mathbf v_w&=\underbrace{\mathbf o_w^\top W}_{\substack{\text{center 역할의}\\\text{input row 선택}}}\\\mathbf v'_w&=\underbrace{\mathbf o_w^\top W'}_{\substack{\text{context 역할의}\\\text{output row 선택}}}\\s(w,c)&=\underbrace{{\mathbf v'_c}^{\!\top}\mathbf v_w}_{\text{두 역할 row의 pair score}}\end{aligned}`} operations={[
        { expression: String.raw`\mathbf o_w^\top W`, annotation: ["one-hot의 1인 위치만 남겨", "input table row를 선택"] },
        { expression: String.raw`\mathbf o_w^\top W'`, annotation: ["같은 ID로 별도 table을 읽어", "output role row를 선택"] },
        { expression: String.raw`{\mathbf v'_c}^{\top}\mathbf v_w`, annotation: ["center와 context 성분을 곱해 더하고", "관측 pair의 score를 계산"] },
      ]} terms={[
        { symbol: String.raw`\mathbf o_w`, name: "One-hot ID", description: "Vocabulary에서 word w의 위치만 1인 주소 vector입니다." },
        { symbol: "W", name: "Input table", description: "Center 역할의 trainable V×d matrix입니다." },
        { symbol: "W'", name: "Output table", description: "Context 역할의 별도 trainable V×d matrix입니다." },
        { symbol: "s(w,c)", name: "Pair score", description: "Center w와 context c의 역할별 row 내적입니다." },
      ]} assumptions={["Vocabulary ID 순서는 run과 artifact 전체에서 고정합니다.", "Input·output table은 같은 shape이어도 parameter를 공유하지 않습니다.", "Subword model처럼 여러 row를 합치는 경우는 별도 글에서 다룹니다."]} interpretation="V=5,d=3이면 W와 W′는 각각 5×3입니다. Word ID 2는 W[2]와 W′[2]를 따로 선택하며 두 row의 값과 용도는 서로 다릅니다." />
      <CodeViewButton
        onClick={() =>
          sidebar.open("onehot-as-gather", codeRefs["onehot-as-gather"])
        }
      />
    </section>

    <section id="window" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Dynamic window는 가까운 pair를 더 자주 보되 먼 pair도 일부 남깁니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Maximum radius가 c라고 해서 매 center마다 항상 ±c를 전부 쓰는 것은 아닙니다. 실제 radius r을 1부터 c 사이에서 뽑으면 거리 δ의 context는 r≥δ일 때만 포함됩니다. 가까운 δ=1은 모든 draw에 들어오고 가장 먼 δ=c는 한 draw에서만 들어옵니다.</p></div>
      <ExplainedFormula question="Maximum radius c에서 거리 δ인 context가 pair에 포함될 확률은 얼마인가요?" idea={<p>가능한 radius는 c개입니다. 그중 δ 이상인 radius가 c−δ+1개이므로 이 개수를 전체 c로 나눕니다.</p>} formula={String.raw`r\sim\operatorname{Unif}\{1,\ldots,c\},\quad P(\delta\text{ included})=(c-\delta+1)/c`} annotatedFormula={String.raw`\begin{aligned}r&\sim\underbrace{\operatorname{Unif}\{1,\ldots,c\}}_{\text{실제 radius 하나를 sampling}}\\I_\delta&=\underbrace{\mathbf 1[r\ge\delta]}_{\substack{\text{뽑은 radius가 거리 }\delta\text{에 닿을 때만}\\\text{pair에 포함}}}\\N_\delta&=\underbrace{c-\delta+1}_{\text{거리 }\delta\text{ 이상인 radius의 개수}}\\P(I_\delta=1)&=\underbrace{N_\delta/c}_{\text{포함 draw 수를 전체 draw 수로 나눔}}\end{aligned}`} operations={[
        { expression: String.raw`r\sim\operatorname{Unif}\{1,\ldots,c\}`, annotation: ["최대 반경 안에서 실제 반경을 뽑아", "example마다 window 크기를 바꿈"] },
        { expression: String.raw`\mathbf 1[r\ge\delta]`, annotation: ["radius가 context 거리까지 닿는지 비교해", "pair 포함 여부를 0·1로 만듦"] },
        { expression: String.raw`c-\delta+1`, annotation: ["거리값부터 c까지 가능한 값을 세어", "포함되는 radius draw 수를 계산"] },
        { expression: String.raw`N_\delta/c`, annotation: ["포함 draw를 전체 draw로 나눠", "거리별 sampling 확률로 정규화"] },
      ]} terms={[
        { symbol: "c", name: "Maximum radius", description: "한 방향에서 볼 수 있는 가장 먼 token 거리입니다." },
        { symbol: "r", name: "Actual radius", description: "이번 center에서 sampling한 실제 window 반경입니다." },
        { symbol: String.raw`\delta`, name: "Context distance", description: "Center와 context position 사이의 절대 거리입니다." },
        { symbol: String.raw`I_\delta`, name: "Inclusion indicator", description: "거리 δ pair가 이번 example에 들어오면 1입니다." },
      ]} assumptions={["Radius 1..c를 균일하게 sampling하는 단순 recipe입니다.", "Sentence boundary와 padding을 넘어 pair를 만들지 않습니다.", "다른 position weighting을 쓰면 이 확률도 달라집니다."]} interpretation="c=5이면 거리 1은 5/5, 거리 3은 3/5, 거리 5는 1/5로 포함됩니다. 이것은 가까운 문맥에 더 큰 관측 빈도를 주는 heuristic입니다." />
    </section>

    <section id="pairs" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Training pair는 corpus에서 저절로 생기지 않고 recipe가 만든 versioned artifact입니다</h2>
      <TermBreakdown title="Pair receipt에 남길 항목" items={[
        { term: "Corpus revision", description: "문장과 token 순서를 제공한 source snapshot·cutoff입니다." },
        { term: "Tokenizer·vocabulary", description: "문자열을 ID sequence와 sentence boundary로 바꾼 정확한 규칙입니다." },
        { term: "Window draw", description: "Maximum radius·dynamic sampling·position weighting입니다." },
        { term: "Frequency filter", description: "Minimum count와 frequent-token subsampling이 어떤 occurrence를 제거했는지 기록합니다." },
        { term: "Seed", description: "Window와 subsampling draw를 재현할 random stream identity입니다." },
      ]} />
      <div id="paper-word2vec-original" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Mikolov et al. — Efficient Estimation of Word Representations" href="https://arxiv.org/abs/1301.3781">CBOW와 Skip-gram을 큰 corpus에서 효율적으로 학습하는 구조를 제안한 원 연구입니다. 논문의 analogy 결과가 모든 언어에서 같은 window recipe를 정당화하지는 않습니다.</CitationBlock></div>
    </section>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ torch: word2vecTree }}
      projectMetas={{
        torch: {
          id: "torch",
          label: "PyTorch · Python",
          badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
        },
      }}
    />
  </div>;
}
