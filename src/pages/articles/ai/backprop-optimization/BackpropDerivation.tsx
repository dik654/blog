import M from '@/components/ui/math';
import BackpropDerivScene from './viz/BackpropDerivScene';
import BackpropMathScene from './viz/BackpropMathScene';

export default function BackpropDerivation() {
  return (
    <section id="backprop-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">역전파 수식 전개</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        소프트맥스 + 교차엔트로피를 합쳐 미분하면 놀랍도록 단순해진다.<br />
        결론부터 말하면 <M>{'\\partial L / \\partial z_i = p_i - y_i'}</M> — 예측 확률에서 정답 one-hot 을 뺀 값이 그대로 gradient.
      </p>
      <BackpropDerivScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Softmax 의 정의부터</h3>
        <p>
          분류기의 마지막 레이어가 logits <M>{'z = (z_1, \\ldots, z_K)'}</M> 를 내놓았다고 하자.
          이걸 확률 벡터로 바꾸는 표준 연산이 softmax:
        </p>
        <M display>{'p_i = \\frac{\\overbrace{e^{z_i}}^{\\text{i 번째 logit 양수화}}}{\\underbrace{\\sum_{j=1}^{K} e^{z_j}}_{\\text{전체 클래스 정규화}}}'}</M>
        <p>
          여기서 <M>{'z_i \\in \\mathbb{R}'}</M> 는 i 번째 클래스의 raw score (logit, 스칼라).<br />
          <M>{'p_i \\in (0, 1)'}</M> 는 i 번째 클래스일 확률이며 <M>{'\\sum_i p_i = 1'}</M> 가 자동으로 성립.<br />
          분자의 <M>{'e^{z_i}'}</M> 로 양수화 + 분모의 <M>{'\\sum_j e^{z_j}'}</M> 로 정규화 — 이 두 연산이 logit 을 확률 simplex 로 옮긴다.
          <M>K</M> 는 클래스 개수 (GPS 예제에서는 3: Madrid/Paris/Berlin).
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cross-Entropy Loss 의 정의</h3>
        <p>
          정답 라벨을 one-hot 벡터 <M>{'y = (y_1, \\ldots, y_K)'}</M> 로 표현 — 정답 클래스만 1, 나머지는 0.
          예측 확률 <M>p</M> 와 정답 <M>y</M> 사이의 손실은:
        </p>
        <M display>{'L = -\\sum_{i=1}^{K} \\underbrace{y_i}_{\\text{one-hot, 정답만 1}} \\cdot \\underbrace{\\log p_i}_{\\text{모델 확률의 로그}}'}</M>
        <p>
          <M>{'y_i \\in \\{0, 1\\}'}</M> 가 one-hot 이므로 사실상 합은 한 항만 살아남는다 — 정답 클래스 <M>{'i^*'}</M> 에 대해 <M>{'L = -\\log p_{i^*}'}</M>.<br />
          직관: 정답 클래스의 예측 확률이 1 에 가까울수록 <M>{'-\\log p_{i^*}'}</M> 는 0 에 수렴, 0 에 가까울수록 무한대로 발산.
          모델이 정답을 확신할수록 loss 가 작다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Softmax Jacobian — 이게 어려워 보이는 이유</h3>
        <p>
          Backward 에 필요한 것은 <M>{'\\partial p_i / \\partial z_k'}</M>. Softmax 는 분모에 <strong>모든</strong> <M>{'z_j'}</M> 가 들어가 있어
          <M>p_i</M> 가 <M>{'z_k \\; (k \\neq i)'}</M> 에도 의존한다. 이 교차 의존이 Jacobian 을 행렬로 만든다.
        </p>
        <p>
          몫의 미분법을 적용. 분자를 <M>{'f = e^{z_i}'}</M>, 분모를 <M>{'g = \\sum_j e^{z_j}'}</M> 로 놓고 <M>{'z_k'}</M> 로 편미분:
        </p>
        <M display>{"\\left(\\frac{f}{g}\\right)' = \\frac{\\overbrace{f'g}^{\\text{분자 미분 × 분모}} - \\overbrace{fg'}^{\\text{분자 × 분모 미분}}}{\\underbrace{g^2}_{\\text{분모 제곱}}}"}</M>
        <ul>
          <li><strong>대각 (<M>{'i = k'}</M>)</strong>: <M>{'f\' = e^{z_i}'}</M>, <M>{'g\' = e^{z_k} = e^{z_i}'}</M> → 정리하면 <M>{'\\partial p_i / \\partial z_i = p_i(1 - p_i)'}</M></li>
          <li><strong>비대각 (<M>{'i \\neq k'}</M>)</strong>: <M>{'f\' = 0'}</M> (분자가 <M>{'z_i'}</M> 만 포함), <M>{'g\' = e^{z_k}'}</M> → <M>{'\\partial p_i / \\partial z_k = -p_i p_k'}</M></li>
        </ul>
        <p>
          두 경우를 크로네커 델타 <M>{'\\delta_{ik}'}</M> (<M>{'i = k'}</M> 이면 1, 아니면 0) 로 묶으면 한 줄 공식:
        </p>
        <M display>{'\\frac{\\partial p_i}{\\partial z_k} = p_i \\bigl(\\underbrace{\\delta_{ik}}_{i=k \\text{ 일 때 1, 아니면 0}} - \\underbrace{p_k}_{\\text{전체 정규화 효과}}\\bigr)'}</M>
        <p>
          이 공식이 말하는 것: <strong>p_i 를 키우는 방향은 z_i 방향</strong> (대각항의 +), <strong>p_i 를 줄이는 방향은 다른 모든 z_k 방향</strong> (비대각의 -).
          Softmax 는 전체 합이 1 이라는 제약 때문에, 하나를 키우면 자동으로 나머지가 줄어드는 "zero-sum" 구조다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Chain rule 로 합성 — CE + Softmax 의 마법</h3>
        <p>
          이제 <M>{'\\partial L / \\partial z_k'}</M> 를 구한다. Chain rule:
        </p>
        <M display>{'\\frac{\\partial L}{\\partial z_k} = \\sum_{i=1}^{K} \\underbrace{\\frac{\\partial L}{\\partial p_i}}_{\\text{CE 미분}} \\cdot \\underbrace{\\frac{\\partial p_i}{\\partial z_k}}_{\\text{Softmax Jacobian}}'}</M>
        <p>
          합산이 필요한 이유는 앞서 본 것처럼 <M>{'z_k'}</M> 가 <strong>모든</strong> <M>{'p_i'}</M> 에 영향을 주기 때문.
          각 항을 채워 넣자.
        </p>
        <p>
          CE 에서 직접 미분: <M>{'\\partial L / \\partial p_i = -y_i / p_i'}</M>. Softmax Jacobian 을 대입:
        </p>
        <M display>{'\\frac{\\partial L}{\\partial z_k} = \\sum_i \\underbrace{\\left(-\\frac{y_i}{p_i}\\right)}_{\\text{CE 미분}} \\cdot \\underbrace{p_i(\\delta_{ik} - p_k)}_{\\text{Softmax Jacobian}} = \\underbrace{-\\sum_i y_i(\\delta_{ik} - p_k)}_{p_i \\text{ 가 분자·분모에서 상쇄}}'}</M>
        <p>
          <M>{'p_i'}</M> 가 분자·분모에서 상쇄되는 게 핵심. 이제 합을 분해:
        </p>
        <M display>{'\\frac{\\partial L}{\\partial z_k} = \\underbrace{-\\sum_i y_i \\delta_{ik}}_{= -y_k \\text{ (델타가 } i=k \\text{ 일 때만 살아남음)}} + \\underbrace{p_k \\sum_i y_i}_{= p_k \\cdot 1 \\text{ (one-hot 합 = 1)}} = -y_k + p_k'}</M>
        <p>
          <M>{'\\sum_i y_i \\delta_{ik} = y_k'}</M> (델타가 <M>{'i = k'}</M> 일 때만 살아남음), <M>{'\\sum_i y_i = 1'}</M> (one-hot 의 정의).
          따라서:
        </p>
        <M display>{'\\frac{\\partial L}{\\partial z_k} = \\underbrace{p_k}_{\\text{모델 확신}} - \\underbrace{y_k}_{\\text{정답 지시}}'}</M>
        <p>
          이게 그 유명한 결과. <strong>예측 확률에서 정답을 뺀 벡터</strong> — 더 단순할 수 없는 형태.<br />
          벡터로 쓰면 <M>{'\\nabla_z L = p - y'}</M>. 부호까지 해석: 정답 클래스 <M>{'i^*'}</M> 는 <M>{'y_{i^*} = 1 > p_{i^*}'}</M> 이므로 gradient 가 음수 → <M>{'z_{i^*}'}</M> 를 키우는 방향으로 업데이트.
          오답 클래스는 <M>{'y_k = 0 < p_k'}</M> 이므로 양수 → 줄이는 방향.
        </p>
      </div>

      <BackpropMathScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="mt-6">
          위 Scene은 Jacobian 행렬의 대각·비대각 원소가 실제 숫자로 어떻게 채워지는지, 그리고 chain rule 합산이 합쳐지면서 교차항이 소거되는 과정을 한 프레임씩 보여준다.
          수식만 보면 추상적이지만 특정 <M>p</M>, <M>y</M> 값에서 합이 무엇으로 수렴하는지 눈으로 확인하면 "왜 p-y 로 떨어지는가"가 손에 잡힌다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 softmax+CE 를 같이 쓰는가</p>
          <p>
            <strong>수학적 우아함</strong>: gradient 가 <M>{'p - y'}</M> 로 단순 — 역전파 시작점이 곱셈·로그 없이 뺄셈 한 번.<br />
            <strong>수치 안정성</strong>: <M>{'\\log p_i = z_i - \\log \\sum_j e^{z_j}'}</M> 로 쓰면 logsumexp trick 이 적용돼 overflow 방지.
            실제로 PyTorch 의 <code>cross_entropy</code> 는 logit 을 받아 내부에서 log-softmax 를 수행 (이중 softmax 금지).<br />
            <strong>의미적 대칭</strong>: softmax 가 logit → probability 변환, CE 가 그 probability 와 정답의 KL-divergence 를 측정. 두 연산이 자연스럽게 결합.
          </p>
          <p className="mt-2">
            <strong>대안 조합들</strong>:<br />
            - Sigmoid + BCE (<M>{'L = -[y \\log \\sigma(z) + (1-y)\\log(1-\\sigma(z))]'}</M>): binary classification, gradient 는 똑같이 <M>{'\\sigma(z) - y'}</M><br />
            - Hinge loss (<M>{'L = \\max(0, 1 - y z)'}</M>): SVM 계열<br />
            - Focal loss (<M>{'L = -(1 - p_{i^*})^\\gamma \\log p_{i^*}'}</M>): 클래스 불균형 해결<br />
            - Label smoothing: <M>y</M> 를 one-hot 대신 <M>{'(1-\\epsilon) y + \\epsilon/K'}</M> 로 완화
          </p>
          <p className="mt-2">
            <strong>실무 팁</strong>:<br />
            - 모델 출력은 항상 logits 로 (raw scores)<br />
            - Probability 가 필요하면 <strong>추론 시에만</strong> softmax 적용<br />
            - Loss function 이 softmax 를 내부 처리 → 모델에서 softmax 빼기<br />
            - 이중 softmax 는 gradient 가 <M>{'p(p - y)'}</M> 로 변질되어 학습이 망가지는 흔한 실수
          </p>
        </div>
      </div>
    </section>
  );
}
