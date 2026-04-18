import DomainShiftViz from './viz/DomainShiftViz';

export default function DomainShift() {
  return (
    <section id="domain-shift" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도메인 차이가 클 때의 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          전이학습의 효과는 소스 도메인과 타깃 도메인의 유사도에 비례<br />
          ImageNet(자연 사진) → 애완동물 분류: 도메인 유사 → 전이 효과 극대<br />
          ImageNet(자연 사진) → 의료 X-ray: 도메인 차이 큼 → 하위 피처(에지)만 유효, 상위 피처는 무용
        </p>
        <p>
          <strong>Domain Shift</strong>(도메인 시프트) — 소스와 타깃의 데이터 분포 차이<br />
          이미지: 자연광 vs X-ray 조명, RGB vs 그레이스케일, 일상 객체 vs 세포/조직<br />
          텍스트: 일반 뉴스 vs 의학 논문, 영어 문법 vs 유전체 서열 패턴<br />
          Domain shift가 클수록 단순 fine-tuning의 성능이 급감
        </p>
      </div>
      <div className="not-prose my-8">
        <DomainShiftViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Continued Pretraining: 도메인 코퍼스로 추가 사전학습</h3>
        <p>
          가장 효과적인 대응 — 일반 pretrained 모델을 도메인 데이터로 추가 사전학습<br />
          NLP: 도메인 텍스트로 MLM(Masked Language Modeling) 추가 수행<br />
          CV: 도메인 이미지로 MAE(Masked Autoencoder) 또는 contrastive learning 추가 수행
        </p>
        <p>
          BioBERT: PubMed 논문 18억 토큰으로 BERT 추가학습 → 의료 NER F1 +2.3%<br />
          SciBERT: Semantic Scholar 논문으로 추가학습 → 과학 QA 정확도 +3.1%<br />
          ClinicalBERT: MIMIC-III 임상기록으로 추가학습 → 재입원 예측 AUC +5%
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Domain Adaptation 기법</h3>
        <p>
          <strong>MMD</strong>(Maximum Mean Discrepancy) — 소스·타깃 피처 분포의 평균 차이를 손실에 추가<br />
          loss = task_loss + lambda * MMD(source_features, target_features)<br />
          피처 공간에서 두 도메인의 분포가 가까워지도록 유도
        </p>
        <p>
          <strong>DANN</strong>(Domain-Adversarial Neural Network) — 도메인 판별기 + Gradient Reversal Layer<br />
          피처 추출기가 도메인을 구분하지 못하는 표현을 학습하도록 적대적 훈련<br />
          GAN과 유사한 원리 — 판별기를 속이는 방향으로 피처 학습
        </p>
        <p>
          <strong>Self-training</strong> — 소스로 학습한 모델이 타깃 데이터에 pseudo-label 부여 → 재학습<br />
          타깃에 레이블이 없을 때(Unsupervised Domain Adaptation) 특히 유효<br />
          반복할수록 pseudo-label 품질이 향상되어 도메인 적응이 진행됨
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 사례: 환경 변동 대응</h3>
        <p>
          구조물 안전 모니터링 대회 — Train 데이터는 고정 환경(20C, 습도 50%), Test는 변동 환경<br />
          온도·습도 변화가 센서 데이터에 영향 → 고정 환경에서 학습한 모델이 변동 환경에서 성능 저하<br />
          이것이 전형적인 <strong>환경 도메인 시프트</strong> 문제
        </p>
        <p>
          대응 전략 3가지:<br />
          1) <strong>환경 변수 피처화</strong> — 온도·습도를 모델 입력에 추가하여 환경 조건을 명시적으로 학습<br />
          2) <strong>환경 Augmentation</strong> — 학습 시 온도·습도 변동을 시뮬레이션하는 노이즈 추가<br />
          3) <strong>Domain Adaptation</strong> — MMD로 고정 환경과 변동 환경의 피처 분포 정렬
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">도메인 시프트 대응 체크리스트</p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          1) 소스-타깃 분포 차이를 시각화로 확인 (t-SNE/UMAP)<br />
          2) 도메인 차이 작으면: 기본 fine-tuning으로 충분<br />
          3) 도메인 차이 크면: Continued Pretraining → Domain Adaptation 순서 적용<br />
          4) 타깃 레이블 없으면: Self-training 또는 DANN이 유일한 선택지
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          핵심: 도메인 시프트를 <strong>"인식"하고 명시적으로 대응</strong>해야 한다<br />
          단순 fine-tuning은 도메인 차이에 무방비 — Continued Pretraining과 Domain Adaptation을 병행<br />
          환경 변동·데이터 분포 변화는 실전에서 가장 흔한 성능 저하 원인
        </p>
      </div>
    </section>
  );
}
