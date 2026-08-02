import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function ForwardMathSection() {
  return (
    <div className="not-prose mt-4">
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Forward process: 직접 noisy sample 만들기</h4>
        <div>
          <p className="text-xs text-muted-foreground mb-1">원본 신호와 Gaussian noise 를 누적 비율로 섞는다</p>
          <M display>{'x_t = \\underbrace{\\sqrt{\\bar\\alpha_t}}_{\\text{signal}} \\cdot x_0 + \\underbrace{\\sqrt{1-\\bar\\alpha_t}}_{\\text{noise}} \\cdot \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, I)'}</M>
          <FormulaNote
            meaning={'이 식은 step t의 이미지를 원본 신호와 표준 Gaussian noise의 선형 결합으로 직접 만든다. 계수에 sqrt를 붙이는 이유는 분산 비율을 맞추기 위해서다. signal 분산은 alpha_bar_t만큼 남기고, 나머지 1-alpha_bar_t를 noise 분산으로 채워 전체 스케일을 안정적으로 유지한다.'}
            symbols={[
              ['x_0', '깨끗한 원본 이미지 또는 latent. forward process의 출발점이다.'],
              ['x_t', 't번째 noisy sample. 학습 때 U-Net에 입력되는 중간 상태다.'],
              ['alpha_bar_t', 'alpha_s=1-beta_s를 1..t까지 곱한 누적 signal 비율이다. 중간 step을 모두 실행하지 않고도 x_t를 만들게 해준다.'],
              ['epsilon ~ N(0,I)', '표준 Gaussian noise. 목표 noise가 단순 분포라 reverse 모델을 MSE로 학습할 수 있다.'],
              ['sqrt 계수', '분산을 나눠 갖게 하는 계수다. signal과 noise의 세기를 같은 단위로 섞기 위해 제곱근을 쓴다.'],
            ]}
          />
          <p className="text-xs text-muted-foreground mt-2">
            각 step 의 noise 가 Gaussian 이고 서로 독립이면 합쳐도 Gaussian 이다. 그래서 여러 step 을 실제로 지나지 않고
            <M>{'\\bar\\alpha_t=\\prod_s(1-\\beta_s)'}</M> 하나로 <M>{'x_t'}</M> 를 직접 샘플링한다.
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Simple loss: 넣은 noise 를 다시 맞춘다</p>
          <M display>{'L_{\\text{simple}} = \\mathbb{E}\\Big[\\|\\underbrace{\\epsilon}_{\\text{true noise}} - \\underbrace{\\epsilon_\\theta(x_t, t)}_{\\text{predicted noise}}\\|^2\\Big]'}</M>
          <FormulaNote
            meaning={'loss는 이미지를 직접 맞추지 않고 forward에서 넣은 noise와 모델이 예측한 noise의 차이를 줄인다. ||.||^2를 쓰는 이유는 각 픽셀/latent 차원의 오차를 양수로 만들고 큰 오차를 더 크게 벌하기 위해서다. 기대값 E는 여러 이미지, timestep, noise sample에서 평균적으로 같은 방향을 학습하라는 뜻이다.'}
            symbols={[
              ['epsilon', 'forward에서 실제로 샘플링해 넣은 정답 noise다.'],
              ['epsilon_theta(x_t,t)', '모델이 현재 noisy state와 timestep을 보고 예측한 noise다.'],
              ['||epsilon - epsilon_theta||^2', 'noise 예측 오차의 제곱합이다. 부호가 다른 오차를 상쇄하지 않고 크기로 벌한다.'],
              ['E[...]', '데이터, timestep, noise draw 전체에 대한 평균 학습 목표다.'],
            ]}
          />
          <p className="text-xs text-muted-foreground mt-2">
            실제 <M>{'\\epsilon'}</M> 은 forward 에서 직접 뽑은 값이라 정답 label 처럼 쓸 수 있다.
            image 전체를 맞추는 대신 noise 방향을 맞추면 objective 가 MSE 로 끝난다.
          </p>
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="text-sm text-muted-foreground">
          각 step 의 noise 크기 <M>{'\\beta_t'}</M> 를 어떻게 놓느냐가 schedule 이다.
          Linear 는 <M>{'\\beta_1'}</M> 에서 <M>{'\\beta_T'}</M> 까지 거의 직선으로 키운다.
          Cosine 은 <M>{'\\bar\\alpha_t'}</M> 를 부드럽게 줄여 signal 이 갑자기 사라지지 않게 한다.
        </p>
      </div>
    </div>
  );
}
