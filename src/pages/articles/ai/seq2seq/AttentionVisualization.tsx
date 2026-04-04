import AttentionHeatmapViz from './viz/AttentionHeatmapViz';

export default function AttentionVisualization() {
  return (
    <section id="attention-visualization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어텐션 히트맵</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>어텐션 가중치 시각화</h3>
        <p>
          번역 결과에서 각 출력 단어가 어떤 입력 단어에 집중했는지 확인<br />
          행 = 출력 단어 (한국어), 열 = 입력 단어 (영어)<br />
          색이 진할수록 높은 어텐션 가중치
        </p>

        <h3>해석 예시</h3>
        <p>
          "고마워" 생성 시 — "Thank"에 <strong>0.45</strong>로 가장 높은 어텐션<br />
          "요" 생성 시 — "you"에 <strong>0.50</strong>으로 집중<br />
          EOS 생성 시 — "!"에 0.70 — 문장 끝 신호에 반응
        </p>

        <h3>어텐션의 인사이트</h3>
        <p>
          모델이 어떤 입력 단어에 주목하는지 <strong>해석 가능</strong><br />
          번역 오류 시 어텐션 분포를 보면 원인을 추적할 수 있다<br />
          이 해석 가능성이 Transformer의 Multi-Head Attention으로 이어진다
        </p>
      </div>
      <div className="not-prose my-8">
        <AttentionHeatmapViz />
      </div>
    </section>
  );
}
