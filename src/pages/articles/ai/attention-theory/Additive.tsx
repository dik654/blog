import ExplainedFormula from "@/components/ui/explained-formula";

export default function Additive() {
  return (
    <section id="additive" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Additive attention: 작은 신경망으로 정렬 점수 만들기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Bahdanau attention은 이전 decoder state와 각 encoder hidden state를
          같은 attention 공간으로 투영한 뒤, 작은 feed-forward network로
          alignment score를 계산한다. 두 투영 결과를 더해서 점수를 만들기 때문에
          <strong> additive attention</strong>이라고 부른다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Score에서 context까지</h3>
      </div>

      <ExplainedFormula
        question="decoder state와 encoder state의 차원이 달라도 위치별 compatibility를 어떻게 학습할까?"
        idea={<>두 state를 공통 attention space로 따로 투영한 뒤 더하고 tanh를 적용합니다. 마지막 vector va가 그 joint feature를 scalar score로 읽습니다.</>}
        formula={String.raw`\begin{aligned}z_{ti}&=W_qs_{t-1}+W_kh_i\\e_{ti}&=v_a^\top\tanh(z_{ti})\\\alpha_{ti}&=\operatorname{softmax}_i(e_{ti})\\c_t&=\sum_i\alpha_{ti}h_i\end{aligned}`}
        terms={[
          { symbol: "s_{t-1}", name: "decoder state", description: "다음 target token을 만들기 직전의 query 역할입니다." },
          { symbol: "h_i", name: "encoder state", description: "source i 위치의 key이자 이 기본형에서는 value로도 사용합니다." },
          { symbol: "W_q,W_k", name: "learned projections", description: "서로 다른 입력 차원을 같은 attention hidden dimension으로 옮깁니다." },
          { symbol: "v_a", name: "score readout", description: "tanh feature를 한 개의 alignment logit으로 줄입니다." },
        ]}
        assumptions={["기본 Bahdanau 계열 표기이며 논문·구현에 따라 bias와 state index 표기가 달라질 수 있습니다."]}
        interpretation="‘additive’는 최종 score들을 더한다는 뜻이 아니라 projected query와 key를 더해 작은 network로 compatibility를 학습한다는 뜻입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>W_q</code>와 <code>W_k</code>가 차원이 다른 decoder state와
          encoder state를 같은 공간으로 옮기고, <code>v_a</code>가 각 위치의
          결과를 scalar score로 줄인다. Softmax는 모든 source 위치를 함께
          비교하므로, <code>α_ti</code>는 현재 출력 시점에서 각 입력 위치가
          차지하는 상대적인 비중이다.
        </p>

        <h3>정렬을 배우지만, 설명 자체는 아니다</h3>
        <p>
          번역 모델을 별도의 단어 정렬 label 없이 학습해도 attention weight에서
          source와 target의 대응 패턴이 나타날 수 있다. 다만 weight가 크다는
          사실만으로 모델의 인과적 판단 근거를 모두 설명할 수 있는 것은 아니다.
          Attention map은 유용한 진단 신호이지만 완전한 explanation으로 취급하지
          않는 것이 안전하다.
        </p>
        <p>
          이 주의점은 해석 가능성 연구에서도 논쟁이 이어졌다.
          <a href="https://aclanthology.org/N19-1357/" target="_blank" rel="noreferrer"> Jain과 Wallace</a>는
          서로 다른 attention distribution이 비슷한 prediction을 만들 수 있음을
          보였고, 후속 연구는 explanation의 정의와 평가 조건을 더 엄밀히 나눠야
          한다고 지적했다. 따라서 attention map은 alignment를 관찰하는 자료로는
          유용하지만 단독 causal attribution으로 단정하지 않는다.
        </p>
      </div>

      <div id="paper-bahdanau" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">논문 읽기 · Additive attention</p>
        <p className="mt-2 text-sm font-semibold">Neural Machine Translation by Jointly Learning to Align and Translate</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Fixed-length source vector의 병목을 문제로 두고, decoder가 출력할 때마다 encoder annotation의 soft alignment와 context를 함께 학습했습니다. Alignment label 없이 나타난 attention pattern은 진단 근거이지만, weight만으로 prediction의 완전한 인과 설명을 얻었다는 주장은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://arxiv.org/abs/1409.0473" target="_blank" rel="noreferrer">원 논문과 alignment 식 보기</a>
      </div>

      <div id="paper-attention-explanation" className="not-prose my-8 border-l border-border pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">논문 읽기 · 해석의 경계</p>
        <p className="mt-2 text-sm font-semibold">Attention is not Explanation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">서로 크게 다른 attention distribution이 비슷한 prediction을 만들 수 있는 사례를 통해 attention weight를 곧바로 feature importance나 causal explanation으로 동일시하는 해석을 비판합니다. 이는 attention map이 언제나 쓸모없다는 결론이 아니라 explanation의 정의와 검증 방법을 별도로 요구한다는 결과입니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://aclanthology.org/N19-1357/" target="_blank" rel="noreferrer">논문과 실험 범위 보기</a>
      </div>
    </section>
  );
}
