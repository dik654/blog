import AttentionMechViz from './viz/AttentionMechViz';

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
    </section>
  );
}
