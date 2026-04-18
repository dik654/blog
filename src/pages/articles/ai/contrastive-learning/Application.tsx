import ApplicationViz from './viz/ApplicationViz';

export default function Application() {
  return (
    <section id="application" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">임베딩 품질 향상 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대조 학습의 실전 가치 — "더 좋은 임베딩"을 만들어 downstream task 전반의 성능을 올리는 것.<br />
          분류, 검색, 클러스터링, 이상 탐지 모두 임베딩 품질에 의존.
        </p>

        <h3>유전체 임베딩 개선 사례</h3>
        <p>
          유전체 언어 모델(gLM)에서 변이 효과 예측이 핵심 과제.<br />
          <strong>기본 접근</strong> — 사전학습된 gLM으로 시퀀스 임베딩 추출 → cosine similarity로 wild-type과 변이 비교.<br />
          <strong>문제</strong> — 사전학습은 마스크 예측(MLM) 목적 → 변이 민감도에 최적화되지 않음.
          유사한 변이도 임베딩 거리가 비슷 → 병원성 변이(pathogenic) vs 양성 변이(benign) 구분이 어려움.
        </p>
        <p>
          <strong>대조 학습 적용</strong> — 같은 유전자의 wild-type + benign 변이 = positive pair.<br />
          wild-type + pathogenic 변이 = hard negative. margin 기반으로 병원성 변이를 임베딩 공간에서 밀어냄.<br />
          결과: Spearman 상관 0.45 → 0.62로 향상 (DMS 벤치마크 기준).
        </p>

        <h3>Cosine Distance로 변이 민감도 측정</h3>
        <p>
          d(wt, mut) = 1 - cos(f(wt), f(mut)).<br />
          d가 클수록 변이가 기능에 큰 영향 → 병원성 가능성 높음.<br />
          대조 학습 후 d 분포: benign 변이의 평균 d = 0.05, pathogenic 변이의 평균 d = 0.23 → 명확한 분리.
        </p>

        <h3>Fine-tuning with Contrastive Objective</h3>
        <p>
          <strong>Stage 1: Contrastive Pre-training</strong> — gLM 인코더 위에 projection head 추가.
          positive: 같은 유전자/benign 변이 쌍. negative: 다른 유전자 또는 pathogenic 변이.<br />
          <strong>Stage 2: Task Head</strong> — projection head 제거, frozen encoder 위에 regression head.
          DMS score 직접 예측 → MSE loss.<br />
          <strong>Stage 3: Joint Fine-tuning</strong> — contrastive loss + regression loss 가중합으로 전체 fine-tuning.
          λ_cl = 0.3, λ_reg = 0.7이 경험적 최적.
        </p>

        <h3>범용 적용 패턴</h3>
        <p>
          1) 도메인 사전학습 모델 확보 (BERT, ESM-2, ProtTrans 등)<br />
          2) 도메인 pair 정의 — positive/negative 기준 설계가 가장 중요한 단계<br />
          3) Contrastive fine-tuning (SupCon 또는 Triplet) → 임베딩 품질 검증 (t-SNE, kNN accuracy)<br />
          4) Downstream head 추가 → task 성능 측정
        </p>
      </div>

      <div className="not-prose my-8">
        <ApplicationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>핵심 인사이트:</strong> 대조 학습은 "모델을 바꾸는 것"이 아니라 "학습 신호를 바꾸는 것".
            기존 인코더 위에 contrastive objective를 추가하는 것만으로 임베딩 품질이 크게 개선.
            pair 설계가 도메인 전문성이 필요한 유일한 지점.
          </p>
        </div>
      </div>
    </section>
  );
}
