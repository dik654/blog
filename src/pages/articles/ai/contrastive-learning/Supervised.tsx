import SupervisedViz from './viz/SupervisedViz';

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
          {'L_i = -1/|P(i)| · Σ_{p∈P(i)} log( exp(sim(z_i, z_p)/τ) / Σ_{k≠i} exp(sim(z_i, z_k)/τ) )'}<br />
          P(i) = 배치 내에서 i와 같은 클래스인 샘플 집합.<br />
          분모는 i를 제외한 모든 샘플(positive + negative) — InfoNCE와 동일 구조.<br />
          분자에서 P(i)의 각 positive에 대해 개별적으로 log를 취한 뒤 평균 — 이것이 핵심 차이.
        </p>

        <h3>CrossEntropy와의 비교</h3>
        <p>
          CE는 출력층 logit을 직접 최적화 — 표현 학습과 분류가 결합되어 있음.<br />
          SupCon은 표현(representation) 학습과 분류를 분리: 1단계에서 SupCon으로 인코더 학습 →
          2단계에서 frozen encoder 위에 linear classifier 학습.<br />
          결과: CIFAR-10에서 CE 95.0% vs SupCon 96.0%. CIFAR-100에서 CE 75.3% vs SupCon 76.5%.
          특히 라벨 노이즈(label noise)에 강건 — 노이즈 40%에서 CE 대비 8% 이상 우위.
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
          Balanced sampling 필수: 클래스당 K개씩 균등 샘플링 (K=4~8 권장).<br />
          Temperature τ = 0.07~0.1이 일반적. τ가 너무 작으면 hard negative에만 집중 → 불안정.
        </p>
      </div>

      <div className="not-prose my-8">
        <SupervisedViz />
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
