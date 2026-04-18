import AttentionMechViz from './viz/AttentionMechViz';
import S2SAttnViz from './viz/S2SAttnViz';
import M from '@/components/ui/math';

export default function AttentionMechanism() {
  return (
    <section id="attention-mechanism" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어텐션 메커니즘 도입</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Seq2Seq 한계 복습</h3>
        <p>
          50단어, 100단어 문장도 <strong>같은 크기의 벡터 하나</strong>에 압축<br />
          앞부분 정보가 사라지고, 문장이 길수록 번역 품질이 급감<br />
          핵심 문제: 인코더의 중간 은닉 상태를 전부 버린다
        </p>

        <h3>해결: 은닉 상태를 전부 보관</h3>
        <p>
          Bahdanau et al. (2015) — 인코더의 h₁, h₂, h₃를 <strong>전부 저장</strong><br />
          디코더가 매 스텝마다 "어디를 볼지" 선택 — 동적 컨텍스트 벡터 생성<br />
          고정 벡터 병목을 완전히 해소
        </p>

        <h3>3가지 점수 계산법</h3>
        <p>
          <strong>Dot Product</strong> — sᵀh, 가장 단순<br />
          <strong>General</strong> — sᵀWh, 학습 가능한 가중치 행렬 W 추가<br />
          <strong>Additive (Bahdanau)</strong> — vᵀtanh(W₁s + W₂h), 비선형 결합
        </p>
      </div>
      <div className="not-prose my-8">
        <AttentionMechViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Attention 동작 원리</h3>
        <S2SAttnViz />
        <M display>{'e_{tj} = \\text{score}(s_{t-1},\\, h_j), \\quad \\alpha_{tj} = \\frac{\\exp(e_{tj})}{\\sum_k \\exp(e_{tk})}, \\quad c_t = \\sum_j \\underbrace{\\alpha_{tj}}_{\\text{attention weight}} \\cdot h_j'}</M>
        <p className="leading-7">
          Score 함수: Dot <M>{'s^\\top h'}</M>, General <M>{'s^\\top W h'}</M>, Additive <M>{'v^\\top \\tanh(W_1 s + W_2 h)'}</M><br />
          핵심 차이: 기존 <M>{'c = h_T'}</M> (고정) vs Attention <M>{'c_t'}</M> (매 스텝 동적 재조합)
        </p>
        <p className="leading-7">
          요약 1: Attention의 핵심은 <strong>동적 context vector</strong> c_t — 매 스텝 다름.<br />
          요약 2: <strong>α_tj</strong>가 출력-입력 정렬을 자동 학습 — 해석 가능성 확보.<br />
          요약 3: Seq2Seq + Attention이 <strong>BLEU +7 point</strong> 개선 — 기계번역 혁명.
        </p>
      </div>
    </section>
  );
}
