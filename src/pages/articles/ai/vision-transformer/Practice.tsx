import PracticeViz from './viz/PracticeViz';

export default function Practice() {
  return (
    <section id="practice" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전: timm 라이브러리 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이론을 코드로 옮길 때 <strong>timm(PyTorch Image Models)</strong> 라이브러리가 사실상 표준이다.
          Ross Wightman이 관리하는 이 라이브러리는 900개 이상의 사전학습 모델을 통일된 인터페이스로 제공.
          모델 생성 → 데이터 변환 → 학습을 최소한의 코드로 시작할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">모델 선택 가이드</h3>
        <p>
          ViT 계열 모델은 목적에 따라 선택이 갈린다.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">목적</th>
                <th className="border border-border px-4 py-2 text-left">모델</th>
                <th className="border border-border px-4 py-2 text-left">ImageNet</th>
                <th className="border border-border px-4 py-2 text-left">FLOPs</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['최고 정확도', 'swin_large_patch4_window12_384', '87.3%', '47.0G'],
                ['균형 (추천)', 'vit_base_patch16_224', '84.5%', '17.6G'],
                ['메모리 절약', 'deit_small_distilled_patch16_224', '81.2%', '4.6G'],
                ['최고 속도', 'vit_small_patch16_224', '79.4%', '4.6G'],
                ['고해상도', 'swin_base_patch4_window7_224', '83.5%', '15.4G'],
              ].map(([purpose, model, acc, flops]) => (
                <tr key={model}>
                  <td className="border border-border px-4 py-2 font-medium">{purpose}</td>
                  <td className="border border-border px-4 py-2 font-mono text-xs">{model}</td>
                  <td className="border border-border px-4 py-2">{acc}</td>
                  <td className="border border-border px-4 py-2">{flops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Fine-tuning 핵심 전략</h3>
        <p>
          ViT를 fine-tune할 때 CNN과 다른 점이 있다. 핵심 4가지:
        </p>
        <p>
          <strong>1) 학습률</strong>: ViT는 CNN보다 낮은 학습률이 필요 — 1e-5 ~ 5e-5 (CNN: 1e-3 ~ 1e-4).
          사전학습된 어텐션 패턴이 높은 학습률에서 쉽게 파괴되기 때문.
        </p>
        <p>
          <strong>2) Layer-wise LR Decay</strong>: 얕은 층(일반적 특징)은 낮은 학습률, 깊은 층(태스크 특화)은 높은 학습률.
          decay factor=0.65가 기본 — 12번째 레이어 LR = base_lr, 1번째 레이어 LR = base_lr × 0.65¹¹.
          이 전략으로 얕은 층의 범용 패턴을 보존하면서 깊은 층만 빠르게 적응시킨다.
        </p>
        <p>
          <strong>3) Warmup</strong>: 전체 에폭의 5-10% 동안 학습률을 0에서 선형 증가 → 이후 코사인 감쇠(Cosine Annealing).
          ViT는 CNN보다 학습 초기 불안정성이 크므로 warmup이 필수적.
        </p>
        <p>
          <strong>4) 해상도 변경</strong>: 224에서 학습된 모델을 384로 fine-tune하면 성능 향상(+1~2%).
          단, 위치 임베딩의 길이가 달라지므로 <strong>이중선형 보간(bicubic interpolation)</strong>으로 위치 임베딩을 리사이즈해야 한다.
          timm에서는 이 과정이 자동으로 처리된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">대회 활용 전략</h3>
        <p>
          <strong>앙상블</strong>: CNN(ConvNeXt) + ViT(Swin) 혼합이 단일 아키텍처보다 항상 우수.
          서로 다른 귀납 편향이 상호 보완 — CNN은 로컬 텍스처, ViT는 글로벌 구조에 강하다.
          가중 평균(0.4:0.6)이나 스태킹(2단계 메타 모델)으로 결합.
        </p>
        <p>
          <strong>TTA(Test-Time Augmentation)</strong>: 수평 반전 + 멀티크롭(5-crop 또는 10-crop).
          ViT는 CNN보다 TTA 효과가 큼(+0.5~1.0%) — 어텐션 패턴이 증강된 이미지에서 더 다양한 관점을 포착.
        </p>
        <p>
          <strong>Progressive Resizing</strong>: 224 → 320 → 384로 단계적 해상도 증가.
          작은 해상도에서 빠르게 수렴 → 큰 해상도에서 미세 조정.
          ViT에서 특히 효과적 — 위치 임베딩이 점진적으로 적응하며 학습 시간 30-40% 절약.
        </p>
      </div>

      <div className="not-prose my-8"><PracticeViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          실전 요약 1: timm으로 ViT 모델 3줄 코드로 시작 — 모델 생성, 변환, 추론.<br />
          실전 요약 2: Fine-tuning은 낮은 학습률 + Layer-wise LR Decay + Warmup이 핵심.<br />
          실전 요약 3: 대회에서는 CNN + ViT 앙상블 + TTA + Progressive Resizing 조합이 최적.
        </p>
      </div>
    </section>
  );
}
