import FeatureVsFinetuneViz from './viz/FeatureVsFinetuneViz';

export default function FeatureVsFinetune() {
  return (
    <section id="feature-vs-finetune" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Feature Extraction vs Full Fine-tuning</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          전이학습에는 두 가지 주요 접근법이 존재한다<br />
          <strong>Feature Extraction</strong> — pretrained backbone을 완전히 동결하고, 마지막 분류 헤드만 학습<br />
          <strong>Full Fine-tuning</strong> — 모든 레이어를 작은 LR로 미세조정
        </p>
        <p>
          Feature Extraction에서 backbone은 고정된 피처 추출기 역할 — 입력을 2048차원(ResNet) 또는 768차원(BERT) 벡터로 변환<br />
          이 벡터 위에 간단한 분류기(FC + Softmax)를 얹어 학습<br />
          학습 파라미터가 전체의 1% 미만이므로 빠르고, 과적합 위험이 낮다
        </p>
      </div>
      <div className="not-prose my-8">
        <FeatureVsFinetuneViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">데이터 규모에 따른 성능 교차점</h3>
        <p>
          데이터 &lt; 1K — Feature Extraction이 안전한 선택<br />
          적은 데이터로 전체 파라미터를 학습하면 과적합이 불가피<br />
          고정 피처 + 간단한 분류기가 일반화 성능에서 우위
        </p>
        <p>
          데이터 &gt; 10K — Fine-tuning이 우세해지기 시작<br />
          충분한 데이터가 있으면 backbone의 피처를 도메인에 맞게 조정하는 것이 이득<br />
          특히 도메인 차이가 클 때(ImageNet → 의료) — 고정 피처로는 표현력 한계
        </p>
        <p>
          데이터 1K~10K — 그레이존<br />
          Gradual Unfreezing으로 상위 블록만 선택적으로 해동하는 절충안이 가장 효과적<br />
          Validation loss를 모니터링하며 과적합 조짐이 보이면 더 많이 동결
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 결정 프로세스</h3>
        <p>
          1단계: <strong>Feature Extraction으로 시작</strong> — 기준선(baseline) 확보. 5분이면 결과 확인<br />
          2단계: 성능 부족 시 <strong>Gradual Unfreezing</strong> — 상위 블록부터 순차 해동<br />
          3단계: 데이터 충분 + 도메인 차이 큰 경우 <strong>Full Fine-tuning</strong> — 작은 LR + Warmup 필수
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">컴퓨팅 자원 고려</p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          Feature Extraction: GPU 메모리 적게 사용 (gradient 저장 불필요) → 노트북 GPU로도 가능<br />
          Fine-tuning: 전체 gradient 저장 필요 → VRAM 2~3배 증가. Mixed Precision(fp16)으로 절반 절약 가능<br />
          Edge device 배포 시 — Feature Extraction으로 backbone을 ONNX 변환 후 분류기만 온디바이스 학습
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약: <strong>단순한 것부터 시작</strong>이 원칙 — Feature Extraction → Gradual Unfreezing → Full Fine-tuning 순서<br />
          데이터 규모와 도메인 유사도가 결정 기준 — 과적합 모니터링이 전환 시점의 핵심 신호
        </p>
      </div>
    </section>
  );
}
