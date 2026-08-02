import TripletViz from './viz/TripletViz';
import ContrastiveFormula from './ContrastiveFormula';

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
          Margin은 positive와 negative 사이에 확보하려는 최소 거리 차이다.
          Dataset과 embedding normalization에 따라 distance scale이 달라지므로 고정된 보편값으로 외우지 않는다.
        </p>
      </div>
      <ContrastiveFormula
        latex={String.raw`\underbrace{\mathcal L_{\mathrm{triplet}}}_{\text{삼중항 손실}}=\max\!\left(0,\underbrace{d(a,p)}_{\text{positive 거리}}-\underbrace{d(a,n)}_{\text{negative 거리}}+\underbrace{\alpha}_{\text{확보할 최소 간격}}\right)`}
        meaning="이 식은 anchor-positive 거리가 anchor-negative 거리보다 margin alpha만큼 작도록 만든다. 왜 max(0, ·)를 쓰냐면 이미 충분히 분리된 easy triplet에는 더 이상 gradient를 주지 않고, 경계를 위반한 triplet에만 학습을 집중하기 위해서다."
        symbols={[
          ['a', '비교 기준 anchor embedding'],
          ['p', 'anchor와 같은 의미나 같은 원인의 positive embedding'],
          ['n', 'anchor와 달라야 하는 negative embedding'],
          ['d', 'embedding 사이의 거리 함수'],
          ['alpha', 'positive와 negative 사이에 요구하는 최소 margin'],
        ]}
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
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
          PK 샘플링(P개 클래스 × K개 샘플)을 사용할 수 있다.
          예를 들어 P=18, K=4로 구성하면 배치 72개 안에서 삼중항을 만들 수 있지만, 이는 설명용 예시이며 FaceNet의 고정 권장값이 아니다.
        </p>

        <h3>Semi-hard Mining이 더 안정적인 이유</h3>
        <p>
          Hard negative만 쓰면 학습 초기에 collapsed embedding(모든 점이 한 곳으로 수렴) 위험.<br />
          Semi-hard는 "아직 margin을 채우지 못한" 적절한 난이도 — FaceNet 논문에서도 semi-hard 권장.<br />
          실제 mining 정책은 label noise와 batch 구성에 따라 달라지므로 easy, semi-hard, hard 비율과 collapse 지표를 함께 기록한다.
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
