import TripletViz from './viz/TripletViz';

export default function Triplet() {
  return (
    <section id="triplet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Triplet Loss & Hard Negative Mining</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Triplet Loss</strong> — FaceNet(Schroff et al., 2015)에서 제안.
          Anchor(a), Positive(p), Negative(n) 세 샘플의 삼중항으로 학습.<br />
          목표: d(a,p) + margin {'<'} d(a,n). 즉 positive가 negative보다 최소 margin만큼 더 가까워야 함.
        </p>

        <h3>Triplet Loss 수식</h3>
        <p>
          L = max(0, d(a,p) - d(a,n) + α)<br />
          d(x,y) = ||f(x) - f(y)||₂ — 유클리드 거리. f는 인코더.<br />
          α (margin) — 일반적으로 0.2~1.0. α가 클수록 positive-negative 간격을 넓게 강제.<br />
          max(0, ·)로 이미 조건을 만족하는 삼중항(easy triplet)은 gradient가 0 → 학습에 기여 안 함.
        </p>

        <h3>삼중항의 세 가지 유형</h3>
        <p>
          <strong>Easy Triplet</strong> — d(a,n) {'>'} d(a,p) + α. 이미 잘 분리됨. loss = 0. 학습 기여 없음.<br />
          <strong>Semi-hard Triplet</strong> — d(a,p) {'<'} d(a,n) {'<'} d(a,p) + α. 분리되었지만 margin 미달.<br />
          <strong>Hard Triplet</strong> — d(a,n) {'<'} d(a,p). negative가 positive보다 더 가까움. loss 가장 큼.
        </p>

        <h3>Hard Negative Mining</h3>
        <p>
          전체 삼중항 중 대부분이 easy → 랜덤 샘플링은 비효율적.<br />
          <strong>Offline Mining</strong> — 전체 데이터 임베딩 계산 → 가장 어려운 negative 탐색. 비용이 크지만 정확.<br />
          <strong>Online Mining (Batch Hard)</strong> — 배치 내에서 가장 먼 positive + 가장 가까운 negative 선택.
          PK 샘플링(P개 클래스 × K개 샘플) 사용. P=18, K=4면 배치 72개에서 삼중항 자동 구성.
        </p>

        <h3>Semi-hard Mining이 더 안정적인 이유</h3>
        <p>
          Hard negative만 쓰면 학습 초기에 collapsed embedding(모든 점이 한 곳으로 수렴) 위험.<br />
          Semi-hard는 "아직 margin을 채우지 못한" 적절한 난이도 — FaceNet 논문에서도 semi-hard 권장.<br />
          실전에서는 warm-up(초기 semi-hard) → anneal(점진적 hard 비율 증가) 전략이 가장 안정적.
        </p>
      </div>

      <div className="not-prose my-8">
        <TripletViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>실전 팁:</strong> Triplet loss는 pair 구성이 복잡 — 최근에는 InfoNCE(SimCLR)나 SupCon이 더 많이 쓰임.
            다만 얼굴 인식, 재식별(re-identification) 등 메트릭 학습 특화 도메인에서는 여전히 강력.
          </p>
        </div>
      </div>
    </section>
  );
}
