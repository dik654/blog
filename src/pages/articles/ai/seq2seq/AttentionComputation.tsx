import AttentionCompViz from './viz/AttentionCompViz';

export default function AttentionComputation() {
  return (
    <section id="attention-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어텐션 계산 (구체적 숫자)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Step 1: Attention Score</h3>
        <p>
          s=[0.7, 0.3], h₁=[0.8, 0.2], h₂=[0.1, 0.9], h₃=[0.5, 0.5]<br />
          score₁ = 0.7×0.8 + 0.3×0.2 = <strong>0.62</strong><br />
          score₂ = 0.7×0.1 + 0.3×0.9 = <strong>0.34</strong><br />
          score₃ = 0.7×0.5 + 0.3×0.5 = <strong>0.50</strong>
        </p>

        <h3>Step 2: Softmax → 확률</h3>
        <p>
          softmax([0.62, 0.34, 0.50]) = [<strong>0.40</strong>, <strong>0.30</strong>, <strong>0.30</strong>]<br />
          합 = 1.0 — 각 인코더 상태에 부여할 가중치
        </p>

        <h3>Step 3: 가중합 → 컨텍스트 벡터</h3>
        <p>
          0.40×[0.8, 0.2] + 0.30×[0.1, 0.9] + 0.30×[0.5, 0.5]<br />
          = [0.32, 0.08] + [0.03, 0.27] + [0.15, 0.15]<br />
          = <strong>[0.50, 0.50]</strong> — 새 컨텍스트 벡터
        </p>

        <h3>Step 4: 디코더에 입력</h3>
        <p>
          새 컨텍스트 벡터 [0.50, 0.50] → 디코더 LSTM 입력<br />
          Softmax → 다음 단어 "고마워" 생성
        </p>
      </div>
      <div className="not-prose my-8">
        <AttentionCompViz />
      </div>
    </section>
  );
}
