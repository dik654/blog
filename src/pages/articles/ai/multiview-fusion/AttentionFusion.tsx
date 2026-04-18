import AttentionFusionViz from './viz/AttentionFusionViz';

export default function AttentionFusion() {
  return (
    <section id="attention-fusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Attention 기반 퓨전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Attention Fusion — Cross-attention(교차 주의)으로 뷰 간 정보를 <strong>동적으로 교환</strong><br />
          Late Fusion이 피처 벡터를 단순 concat하는 것과 달리, 어떤 뷰의 어떤 영역이 중요한지 <strong>입력마다 다르게</strong> 결정<br />
          Transformer의 self-attention을 뷰 간 관계 모델링에 적용한 것으로, NLP에서 입증된 메커니즘을 CV로 확장
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Attention 메커니즘</h3>
        <p>
          View 1의 피처맵에서 <strong>Query(Q)</strong>를 생성하고, View 2의 피처맵에서 <strong>Key(K), Value(V)</strong>를 생성<br />
          "View 1의 각 패치가 View 2의 어떤 패치를 참조해야 하는지" — attention weight로 결정<br />
          수식: <code>Attention(Q, K, V) = softmax(Q · K^T / sqrt(d_k)) · V</code><br />
          Q는 "무엇을 찾을지"(질의), K는 "무엇과 비교할지"(키), V는 "실제 전달할 정보"(값)<br />
          결과: View 1의 피처가 View 2의 관련 정보로 <strong>보강(augmented)</strong>된 새로운 피처 f1'
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">양방향 Cross-Attention</h3>
        <p>
          단방향(View1→View2)만으로는 View 2가 View 1의 정보를 활용하지 못함<br />
          <strong>양방향</strong>: View1→View2 + View2→View1을 동시에 수행 → 두 뷰 모두 상대방의 정보로 보강<br />
          구현: 두 번의 cross-attention 연산, 또는 교차로 Q/KV 역할을 바꿔 수행<br />
          추가 연산 비용이 2배지만, 양쪽 뷰의 정보가 완전히 교환되어 표현 품질이 크게 향상
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head Cross-Attention</h3>
        <p>
          단일 attention head는 한 가지 관계만 학습 — multi-head로 <strong>여러 관계를 병렬 학습</strong><br />
          Head 0: 질감 매칭 (비슷한 텍스처 영역 연결)<br />
          Head 1: 구조적 대응 (같은 물리적 위치의 다른 각도 매핑)<br />
          Head 2: 색상 일관성 (조명 차이에도 같은 객체 인식)<br />
          Head 3: 경계 정보 (엣지 패턴의 연속성 확인)<br />
          각 헤드 출력을 concat → W_o로 투영하여 원래 차원으로 복원
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">실전 적용</h3>
        <p>
          구조물 안정성 대회 — ViT(Vision Transformer) 백본으로 각 뷰를 패치 토큰으로 분할한 뒤 cross-attention<br />
          의료영상 — 정면·측면 X-ray의 cross-attention으로 3D 구조 추론<br />
          자율주행 — 6개 카메라 뷰를 pairwise cross-attention으로 360도 인식<br />
          주의점: 패치 수 N에 대해 O(N^2) 복잡도 → 패치 크기를 크게 하거나 linear attention 변형 사용
        </p>
      </div>

      <div className="not-prose my-8"><AttentionFusionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: Cross-attention은 <strong>Q(한 뷰)·K(다른 뷰)</strong> 내적으로 뷰 간 관련 영역을 자동 매핑<br />
          요약 2: 양방향 + Multi-head로 <strong>다양한 관계 유형</strong>(질감, 구조, 색상)을 동시에 학습<br />
          요약 3: Attention Fusion은 Early/Late 대비 <strong>가장 유연하고 강력</strong>하지만 연산 비용과 데이터 요구량이 높다
        </p>
      </div>
    </section>
  );
}
