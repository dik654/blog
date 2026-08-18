import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { NegativeSamplingViz } from "../word2vec/viz/ModernWord2VecViz";

export default function Word2VecNegativeSamplingArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Negative sampling은 단어 확률을 근사하는 꼼수가 아니라 관측 pair와 noise pair를 구분하는 새 학습 문제입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Skip-gram의 flat softmax는 center 하나를 vocabulary의 모든 output row와 비교합니다. SGNS는 이 계산을 그대로 근사하지 않습니다. Corpus window에서 실제 관측한 pair에는 positive label을 주고, 별도의 noise distribution에서 뽑은 context에는 negative label을 줍니다. 한 step은 선택한 몇 개 row만 읽지만 결과 score는 정규화된 word probability가 아닙니다.</p></div>
      <TermBreakdown title="SGNS 한 step을 구성하는 용어" items={[
        { term: "Positive pair", description: "Corpus window에서 실제 함께 관찰한 center–context pair입니다.", example: "‘따뜻한 창가’에서 center=창가, context=따뜻한." },
        { term: "Noise pair", description: "Noise distribution에서 context를 뽑아 center와 임시로 결합한 label-0 pair입니다.", boundary: "실제로 corpus에 절대 나오지 않는다는 뜻은 아닙니다." },
        { term: "Negative count k", description: "Positive pair 하나당 비교할 noise contexts의 수입니다." },
        { term: "Sparse row update", description: "Center input row, positive output row와 sampled negative output rows만 이번 gradient에 참여합니다.", boundary: "같은 negative가 중복 sampling되는 처리 규칙도 결과에 영향을 줍니다." },
      ]} />
      <NegativeSamplingViz />
      <ContentBoundary article="word2vec-negative-sampling" />
    </section>

    <section id="sgns" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">SGNS는 positive dot score를 올리고 sampled negative dot score를 내립니다</h2>
      <ExplainedFormula question="Positive pair 하나와 negative k개는 어떤 방향의 loss를 만드나요?" idea={<p>Positive pair에는 label 1의 logistic likelihood를, negative pair에는 label 0의 likelihood를 붙입니다. 최대화할 log-likelihood 앞에 minus를 붙여 최소화 loss로 사용합니다.</p>} formula={String.raw`\mathcal L=-\log\sigma(s^+)-\sum_{i=1}^{k}\log\sigma(-s_i^-)`} annotatedFormula={String.raw`\begin{aligned}s^+&=\underbrace{{\mathbf v'_c}^{\!\top}\mathbf v_w}_{\text{관측 pair score}}\\s_i^-&=\underbrace{{\mathbf v'_{n_i}}^{\!\top}\mathbf v_w}_{\text{noise pair score}}\\p^+&=\underbrace{\sigma(s^+)}_{\text{label 1 확률}}\\p_i^-&=\underbrace{\sigma(-s_i^-)}_{\text{label 0 확률}}\\\mathcal L^+&=\underbrace{-\log p^+}_{\text{positive가 낮을 때 벌점}}\\\mathcal L^-&=\underbrace{-\sum_{i=1}^{k}\log p_i^-}_{\text{negative가 높을 때 벌점}}\\\mathcal L&=\underbrace{\mathcal L^++\mathcal L^-}_{\text{두 벌점을 합산}}\end{aligned}`} operations={[
        { expression: String.raw`{\mathbf v'_c}^{\top}\mathbf v_w`, annotation: ["center input row와 관측 context output row를 내적해", "positive compatibility를 계산"] },
        { expression: String.raw`\sigma(s^+)`, annotation: ["positive score를 0~1로 압축해", "label 1 likelihood로 읽음"] },
        { expression: String.raw`\sigma(-s_i^-)`, annotation: ["noise score의 부호를 뒤집어", "score가 낮을수록 label 0 likelihood가 커지게 함"] },
        { expression: String.raw`-\log(\cdot)`, annotation: ["정답 likelihood의 곱을 합으로 바꾸고", "높은 likelihood를 작은 최소화 loss로 변환"] },
      ]} terms={[
        { symbol: String.raw`\mathbf v_w`, name: "Center input row", description: "조건 word w의 input-table vector입니다." },
        { symbol: String.raw`\mathbf v'_c`, name: "Positive output row", description: "관측 context c의 output-table vector입니다." },
        { symbol: String.raw`\mathbf v'_{n_i}`, name: "Noise output row", description: "i번째 sampled context의 output-table vector입니다." },
        { symbol: "k", name: "Negative count", description: "Positive 하나당 sampling한 noise pair 수입니다." },
      ]} assumptions={["Noise samples는 명시한 distribution과 random seed로 뽑습니다.", "Duplicate negative와 accidental positive 처리 규칙을 run metadata에 남깁니다.", "표시한 식은 positive 하나당 negative terms를 합하는 convention입니다."]} interpretation="s⁺=1, negative scores가 0과 −1이면 positive 항은 −log σ(1), negative 항은 −log σ(0)와 −log σ(1)입니다. Gradient는 positive score를 높이고 두 negative scores를 낮추는 방향입니다." />
    </section>

    <section id="noise" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Noise distribution은 오답을 고르는 방식이면서 SGNS가 학습할 class prior입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Uniform sampling은 희귀 context도 고빈도 context와 같은 확률로 뽑습니다. Raw unigram sampling은 매우 흔한 context가 negatives를 거의 독점합니다. 원 Word2Vec recipe는 count에 3/4 power를 적용해 둘 사이의 분포를 만들었습니다. 이것은 보편 법칙이 아니라 corpus와 budget에 묶인 설계 선택입니다.</p></div>
      <ExplainedFormula question="Unigram count를 3/4 power로 바꾼 뒤 왜 다시 전체 합으로 나누나요?" idea={<p>Power는 고빈도와 저빈도 word 사이의 격차를 줄일 뿐 아직 probability가 아닙니다. 모든 transformed weights의 합으로 나눠야 vocabulary 전체 mass가 1이 됩니다.</p>} formula={String.raw`P_n(c)=f(c)^{3/4}\big/\sum_{u\in V}f(u)^{3/4}`} annotatedFormula={String.raw`\begin{aligned}a(c)&=\underbrace{f(c)^{3/4}}_{\substack{\text{빈도 격차를 줄인}\\\text{noise weight}}}\\Z&=\underbrace{\sum_{u\in V}a(u)}_{\text{전체 weight 합}}\\P_n(c)&=\underbrace{a(c)/Z}_{\substack{\text{합이 1이 되도록}\\\text{확률로 정규화}}}\end{aligned}`} operations={[
        { expression: String.raw`f(c)^{3/4}`, annotation: ["frequency를 1보다 작은 지수로 눌러", "고빈도 word의 상대 우세를 완화"] },
        { expression: String.raw`\sum_{u\in V}a(u)`, annotation: ["모든 candidate weight를 더해", "normalizer Z를 계산"] },
        { expression: String.raw`a(c)/Z`, annotation: ["각 weight를 전체 합으로 나눠", "합이 1인 sampling distribution 생성"] },
      ]} terms={[
        { symbol: String.raw`f(c)`, name: "Unigram count", description: "Corpus에서 context c가 나타난 횟수입니다." },
        { symbol: String.raw`a(c)`, name: "Smoothed weight", description: "3/4 power를 적용한 정규화 전 weight입니다." },
        { symbol: "Z", name: "Normalizer", description: "Vocabulary의 모든 smoothed weight 합입니다." },
        { symbol: String.raw`P_n(c)`, name: "Noise probability", description: "Context c를 negative로 sampling할 확률입니다." },
      ]} assumptions={["Count와 vocabulary revision이 고정되어 있습니다.", "3/4 exponent를 사용하는 원 recipe입니다.", "Sampling 구현의 replacement·deduplication 정책은 별도로 기록합니다."]} interpretation="Count가 10,000과 100이면 raw ratio는 100:1이지만 3/4 power 뒤 ratio는 약 31.6:1입니다. 고빈도 word를 여전히 더 자주 뽑되 독점을 완화합니다." />
    </section>

    <section id="subsampling" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Frequent-word subsampling은 loss 뒤가 아니라 pair를 만들기 전에 token occurrence를 버립니다</h2>
      <TermBreakdown title="Noise sampling과 subsampling을 혼동하지 않기" items={[
        { term: "Noise sampling", description: "만들어진 positive pair 옆에 label-0 contexts를 추가합니다.", boundary: "Output-row 비교 대상을 정합니다." },
        { term: "Frequent-word subsampling", description: "Window를 만들기 전에 고빈도 token occurrence 일부를 제거합니다.", boundary: "Positive pair 분포와 token 간 거리를 함께 바꿉니다." },
        { term: "Keep/drop receipt", description: "Frequency table, threshold, 식, seed와 corpus revision을 묶어 어떤 pair population을 학습했는지 재현합니다." },
      ]} />
      <ExplainedFormula
        question="고빈도 token을 얼마나 자주 버릴지는 어떤 식으로 정해지나요?"
        idea={
          <p>
            목표 threshold t보다 훨씬 자주 나오는 word일수록 corpus를 훑을 때
            그 occurrence를 window에 넣기 전에 더 높은 확률로 버립니다. t보다
            드물게 나오는 word는 사실상 거의 버리지 않습니다.
          </p>
        }
        formula={String.raw`P_{\mathrm{discard}}(w)=1-\sqrt{t/f(w)}`}
        annotatedFormula={String.raw`\begin{aligned}
r(w)&=\underbrace{t/f(w)}_{\text{threshold 대비 상대 빈도(w가 흔할수록 0에 가까움)}}\\
P_{\mathrm{discard}}(w)&=\underbrace{1-\sqrt{r(w)}}_{\text{r(w)가 작을수록(=흔할수록) 1에 가까운 폐기 확률}}
\end{aligned}`}
        operations={[
          {
            expression: String.raw`t/f(w)`,
            annotation: ["threshold를 실제 relative frequency로 나눠", "희귀할수록 1에, 흔할수록 0에 가까운 비율 생성"],
          },
          {
            expression: String.raw`\sqrt{r(w)}`,
            annotation: ["제곱근을 취해", "빈도 차이에 따른 비율 변화를 완만하게 만듦"],
          },
          {
            expression: String.raw`1-\sqrt{r(w)}`,
            annotation: ["1에서 빼서", "흔한 word일수록 큰 폐기 확률로 뒤집음"],
          },
        ]}
        terms={[
          {
            symbol: String.raw`f(w)`,
            name: "relative frequency",
            description: "전체 corpus token 수 대비 word w의 occurrence 비율입니다(count(w)/total_count).",
          },
          {
            symbol: "t",
            name: "threshold",
            description: "Subsampling 강도를 정하는 hyperparameter입니다. 원 논문은 약 1e-5를 씁니다.",
          },
          {
            symbol: String.raw`P_{\mathrm{discard}}(w)`,
            name: "폐기 확률",
            description: "Corpus를 훑을 때 word w의 각 occurrence를 window에 넣기 전에 버릴 확률입니다.",
          },
        ]}
        assumptions={[
          "f(w) ≤ t인 word는 이 식이 음수를 낼 수 있어, 실제 구현은 0으로 clip합니다(버리지 않음).",
          "이 식은 원 논문 식입니다. 공개된 원 C 구현(word2vec.c)은 이와 수학적으로 다른 keep-probability 식을 쓴다고 알려져 있습니다 — 논문 식과 released code가 정확히 일치하지 않는 점이 실전 재현에서 자주 놓치는 함정입니다.",
        ]}
        interpretation="t=1e-5, f(w)=1e-3(매우 흔한 word)이면 r=0.01, discard 확률은 1-0.1=0.9로 열 번 중 아홉 번을 버립니다. f(w)=1e-6(희귀 word)이면 r=10이라 sqrt(r)>1이 되어 discard 확률은 0으로 clip됩니다."
      />
      <div id="paper-negative-sampling" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Mikolov et al. — Distributed Representations of Words and Phrases" href="https://arxiv.org/abs/1310.4546">Negative sampling과 frequent-word subsampling을 제시한 후속 Word2Vec 연구입니다. 3/4 exponent와 threshold의 효과는 논문의 corpus·task·training budget 범위에서 해석해야 합니다.</CitationBlock></div>
    </section>
  </div>;
}
