import FreezingViz from './viz/FreezingViz';

export default function Freezing() {
  return (
    <section id="freezing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">레이어 동결 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Pretrained 모델의 모든 레이어를 한꺼번에 학습하면 문제가 생긴다<br />
          하위 레이어(Conv1~2)의 범용 피처(에지 검출, 텍스처 인식)가 내 데이터의 노이즈에 오염되어 파괴<br />
          특히 데이터가 적을 때 — 전체 파라미터를 학습하면 과적합(overfitting) 확률이 급격히 증가
        </p>
        <p>
          <strong>레이어 동결(Freezing)</strong> — <code>requires_grad = False</code>로 특정 레이어의 가중치를 고정<br />
          gradient가 해당 레이어로 역전파되지 않으므로 학습 중에도 가중치가 변하지 않는다<br />
          부수 효과: gradient 계산 생략 → GPU 메모리 절약 + 학습 속도 향상
        </p>
      </div>
      <div className="not-prose my-8">
        <FreezingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Gradual Unfreezing</h3>
        <p>
          ULMFiT(Howard & Ruder, 2018)이 제안한 기법 — 마지막 레이어부터 순차적으로 해동<br />
          1단계: 분류 헤드만 학습 (1~2 epoch) → 헤드가 안정적인 gradient 신호를 보내기 시작<br />
          2단계: 마지막 transformer/conv 블록 해동 → 태스크 특화 피처 적응<br />
          3단계: 필요 시 전체 해동 → 미세한 피처 조정
        </p>
        <p>
          이 과정에서 <strong>Catastrophic Forgetting</strong>(파국적 망각)을 방지 —
          pretrained 지식이 갑작스러운 큰 gradient에 의해 덮어쓰이는 현상<br />
          점진적 해동은 각 레이어가 새 태스크에 부드럽게 적응할 시간을 부여
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">동결 비율 결정 기준</p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          데이터 &lt; 1K: 분류 헤드만 학습 (backbone 전체 freeze)<br />
          데이터 1K~10K: 상위 2~3 블록 해동 + Gradual Unfreezing<br />
          데이터 &gt; 10K: 전체 fine-tuning 가능 (단, 작은 LR 필수)<br />
          도메인 유사도가 낮으면 → 더 많이 해동해야 도메인 적응 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">PyTorch 구현 패턴</h3>
        <p>
          <code>model.backbone.requires_grad_(False)</code> — backbone 전체를 한 줄로 동결<br />
          <code>model.backbone.layer4.requires_grad_(True)</code> — 특정 블록만 선택적 해동<br />
          Optimizer에 동결되지 않은 파라미터만 전달:
          <code>{'filter(lambda p: p.requires_grad, model.parameters())'}</code><br />
          동결 해제 시점은 validation loss가 plateau에 도달했을 때가 적절
        </p>
        <p className="leading-7">
          요약: <strong>동결은 보험</strong> — 데이터가 적을수록 더 많이 동결하여 pretrained 지식을 보호<br />
          <strong>Gradual Unfreezing</strong>이 가장 안정적인 전략 — 순차적 해동으로 forgetting 방지
        </p>
      </div>
    </section>
  );
}
