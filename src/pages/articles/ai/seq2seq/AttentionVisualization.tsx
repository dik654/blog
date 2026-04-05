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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Attention Heatmap 해석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Attention Matrix 시각화 (Bahdanau 2015)
//
// 학습된 정렬 패턴들:
//
// 1. 일대일 단조 정렬 (Monotonic)
//    "I love you" → "나는 너를 사랑해"
//
//           I    love  you
//    나는   0.9  0.0   0.0
//    너를   0.0  0.1   0.9
//    사랑해 0.0  0.9   0.0
//
//    → 대각선 패턴
//
// 2. 순서 역전 (Reordering)
//    "I sold it yesterday" → "어제 나는 그것을 팔았다"
//
//              I    sold  it   yesterday
//    어제      0.0  0.0   0.0  0.9        ← 맨 뒤로
//    나는      0.9  0.0   0.0  0.0
//    그것을    0.0  0.0   0.9  0.0
//    팔았다    0.1  0.8   0.0  0.0
//
// 3. 다대일 (Many-to-one)
//    "New York" → "뉴욕"
//
//          New  York
//    뉴욕  0.5  0.5  ← 두 단어 평균
//
// 4. 일대다 (One-to-many)
//    "beautiful" → "아름다운"
//    여러 target 토큰이 같은 소스 참조

// 진단 도구로서:
//   - 번역 오류 시 attention 살펴봄
//   - 잘못된 정렬 → 학습 부족 신호
//   - 분산된 attention → 모호함
//
// 한계:
//   - Attention ≠ 정확한 설명
//   - 중요도는 gradient·Shapley value 필요
//   - "Attention is not Explanation" (Jain 2019)
//
// 그러나:
//   - 디버깅에 유용
//   - 모델 동작 직관 제공
//   - 시각적 임팩트 큼

// Transformer에서의 진화:
//   - Multi-head: 헤드마다 다른 패턴
//   - 각 레이어마다 attention matrix
//   - 12 layers × 12 heads = 144개 attention 행렬
//   - BertViz 등 도구로 분석 가능`}
        </pre>
        <p className="leading-7">
          요약 1: Attention heatmap은 <strong>학습된 단어 정렬</strong> 시각화 — 번역 품질 진단.<br />
          요약 2: <strong>단조·역전·다대일·일대다</strong> 다양한 정렬 패턴 자동 학습.<br />
          요약 3: Transformer의 <strong>144개 attention matrix</strong>가 이 방식의 확장판.
        </p>
      </div>
    </section>
  );
}
