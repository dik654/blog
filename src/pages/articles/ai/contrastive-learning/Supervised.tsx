import ContrastiveFormula from './ContrastiveFormula';

export default function Supervised() {
  return (
    <section id="supervised" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Supervised Contrastive Loss</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SupCon(Supervised Contrastive Learning)</strong> — Khosla et al. (2020).
          라벨 정보를 활용해 같은 클래스의 <strong>모든 샘플</strong>을 positive로 취급.<br />
          SimCLR는 positive가 1쌍뿐이지만, SupCon은 배치 내 같은 클래스 전부가 positive.
        </p>

        <h3>SupCon Loss 수식</h3>
        <p>
          SimCLR의 한 positive view 대신 같은 label을 가진 batch sample 전체를 positive 집합으로 둔다.
          따라서 한 batch에 class별 sample이 최소 두 개 이상 들어와야 학습 신호가 생긴다.
        </p>
      </div>
      <ContrastiveFormula
        latex={String.raw`\underbrace{\mathcal L_i}_{\text{anchor i의 supervised contrastive 손실}}=-\underbrace{\frac{1}{|P(i)|}\sum_{p\in P(i)}}_{\text{같은 label positive를 평균}}\log\frac{\overbrace{\exp(\operatorname{sim}(z_i,z_p)/\tau)}^{\text{positive 점수}}}{\underbrace{\sum_{k\ne i}\exp(\operatorname{sim}(z_i,z_k)/\tau)}_{\text{batch의 모든 경쟁 후보}}}`}
        meaning="이 식은 anchor와 같은 label을 가진 positive들을 하나씩 당기고 평균한다. positive 집합으로 평균하는 이유는 같은 class의 여러 변형을 하나의 neighborhood로 만들기 위해서이고, 분모에 모든 후보를 두는 이유는 다른 class와의 상대적 경계를 함께 학습하기 위해서다."
        symbols={[
          ['P(i)', 'batch에서 anchor i와 같은 label을 가진 positive index 집합'],
          ['|P(i)|', 'anchor i가 가진 positive 개수'],
          ['z_i, z_p', 'anchor와 positive의 normalized projection'],
          ['tau', 'similarity score의 temperature'],
          ['k', 'anchor를 제외한 batch의 모든 비교 후보'],
        ]}
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>CrossEntropy와의 비교</h3>
        <p>
          CE는 출력층 logit을 직접 최적화 — 표현 학습과 분류가 결합되어 있음.<br />
          SupCon은 표현(representation) 학습과 분류를 분리: 1단계에서 SupCon으로 인코더 학습 →
          2단계에서 frozen encoder 위에 linear classifier 학습.<br />
          원 논문은 고정된 CIFAR와 ImageNet protocol에서 cross-entropy baseline보다 나은 결과와 corruption robustness를 보고한다.
          이 결과가 제조 데이터의 모든 label noise에 그대로 성립하는 것은 아니며, 동일 split과 동일 backbone으로 다시 검증해야 한다.
        </p>

        <h3>왜 더 Robust한가</h3>
        <p>
          CE는 잘못된 라벨 하나가 gradient를 직접 오염시킴.<br />
          SupCon은 같은 클래스의 <strong>여러 positive와 평균</strong>으로 학습 → 개별 노이즈 라벨의 영향이 희석.<br />
          또한 임베딩 공간에서 클래스 내 분산(intra-class variance)을 줄이는 방향으로 학습하므로,
          결정 경계(decision boundary)가 더 넓고 안정적.
        </p>

        <h3>실전 적용 주의점</h3>
        <p>
          배치 내 클래스 다양성이 핵심 — 한 클래스만 가득하면 negative가 부족.<br />
          Batch에 class별 positive가 들어오도록 sampler를 설계하고 class imbalance와 minority oversampling을 별도 기록한다.<br />
          Temperature가 너무 작으면 가까운 hard negative와 label noise에 집중해 불안정해질 수 있으므로 holdout과 gradient 지표로 고른다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>핵심 인사이트:</strong> SupCon은 "CE의 상위 호환"이 아니라 "표현 학습 전용 도구".
            최종 분류기는 여전히 CE로 학습. 두 단계 파이프라인이 번거롭지만, 표현 품질에서 일관된 우위.
          </p>
        </div>
      </div>
    </section>
  );
}
