import M from '@/components/ui/math';
import ReverseModeGPSScene from './viz/ReverseModeGPSScene';
import ForwardVsReverseScene from './viz/ForwardVsReverseScene';

export default function ReverseModeAutodiff() {
  return (
    <section id="reverse-mode-autodiff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reverse-Mode Autodiff — GPS 모델로 따라가기</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        앞에서 순전파·softmax·CE·chain rule 을 따로따로 풀어봤다.<br />
        이제 이 모든 단계를 <strong>하나의 계산 그래프</strong>로 묶어, 경도 <M>{'x = -3.7'}</M> 이 들어간 순간부터<br />
        6 개 gradient 가 손에 쥐어지는 순간까지 숫자로 끝까지 따라간다.
      </p>

      <ReverseModeGPSScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3 className="text-xl font-semibold mt-6 mb-3">모델을 그래프로 다시 그리기</h3>
        <p>
          GPS 분류기는 "뉴런 3개·가중치 6개"로 소개됐지만, 학습 관점에서는 <strong>연산 노드 4층</strong>의 DAG 로 읽어야 한다.
        </p>
        <M display>{'\\underbrace{x}_{\\text{① 입력}} \\;\\to\\; \\underbrace{z_i = w_i \\cdot x + b_i}_{\\text{② 선형층}} \\;\\to\\; \\underbrace{p_i = \\mathrm{softmax}(z)_i}_{\\text{③ Softmax}} \\;\\to\\; \\underbrace{L = -\\log(p_{\\text{true}})}_{\\text{④ Cross-Entropy loss}}'}</M>
        <p>
          노드는 연산, 간선은 데이터. 뉴런 하나하나를 따로 보지 않고 <strong>연산과 의존 관계</strong>를 그린다.
        </p>
        <p>
          그래프로 보면 backward 가 왜 "역방향"인지가 명확해진다.<br />
          forward 는 <M>{'x'}</M>에서 <M>{'L'}</M>로, 화살표 방향대로 값을 계산한다.<br />
          backward 는 같은 간선을 거꾸로 타고, 각 파라미터가 <M>{'L'}</M>에 얼마나 기여했는지(=gradient) 를 전달한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">순전파 — 숫자로 따라가기</h3>
        <p>
          초기 가중치 <M>{'w = [0.3,\\, 0.1,\\, -0.2]'}</M>, 편향 <M>{'b = [0.2,\\, 0.1,\\, 0.3]'}</M> 로 시작한다고 하자.<br />
          입력 <M>{'x = -3.7'}</M> (Madrid 경도) 한 개만 집어넣어 보면:
        </p>
        <M display>{'\\begin{aligned} z_m &= 0.3 \\cdot (-3.7) + 0.2 = \\mathbf{-0.91} \\\\ z_p &= 0.1 \\cdot (-3.7) + 0.1 = \\mathbf{-0.27} \\\\ z_b &= -0.2 \\cdot (-3.7) + 0.3 = \\mathbf{+1.04} \\end{aligned}'}</M>
        <p>
          softmax 를 지나면 <M>{'p = [0.10,\\, 0.19,\\, 0.71]'}</M>.<br />
          모델은 <strong>Berlin 이라고 답하고 있고, 정답은 Madrid</strong>. 교차엔트로피 손실은 <M>{'L = -\\log(0.10) = 2.30'}</M>.
        </p>
        <p>
          여기서 중요한 포인트는, 앞으로 gradient 를 계산할 때 쓸 값들이 <strong>이 forward pass 도중에 전부 저장되어야 한다</strong>는 점이다.
          <br />
          <M>{'x'}</M> 자체, 각 <M>{'z_i'}</M>, 각 <M>{'p_i'}</M>, 그리고 정답 one-hot <M>{'y'}</M>.
          이 중 어느 하나라도 버리면 backward 에서 재계산해야 한다. Reverse mode 의 메모리 비용은 여기서 발생한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Backward — <M>{'\\mathrm{d}L/\\mathrm{d}L = 1'}</M> 부터 거꾸로</h3>
        <p>
          역방향의 <strong>출발점은 항상 출력 노드에서 자기 자신에 대한 미분</strong>, 즉 <M>{'\\mathrm{d}L/\\mathrm{d}L = 1'}</M>. 이게 시드값이다.<br />
          다음 단계는 이 시드를 <M>{'p'}</M> 로 한 단계 끌어내려서 <M>{'\\mathrm{d}L/\\mathrm{d}p_i'}</M> 를 얻는 것.
        </p>
        <p>
          일반적으로 softmax + CE 는 서로 맞물려 미분이 복잡해 보이지만, 합쳐서 풀면{' '}
          <strong>gradient 가 곧 <M>{'(p - y)'}</M></strong> 로 떨어진다 — 이 아티클의 "역전파 수식 전개"에서 유도한 결과.<br />
          정답이 Madrid 이므로 <M>{'y = [1,\\, 0,\\, 0]'}</M>:
        </p>
        <M display>{'\\begin{aligned} \\mathrm{d}L/\\mathrm{d}z_m &= 0.10 - 1 = \\mathbf{-0.90} \\\\ \\mathrm{d}L/\\mathrm{d}z_p &= 0.19 - 0 = \\mathbf{+0.19} \\\\ \\mathrm{d}L/\\mathrm{d}z_b &= 0.71 - 0 = \\mathbf{+0.71} \\end{aligned}'}</M>
        <p>
          부호의 의미가 그대로 학습 신호다.<br />
          <M>{'\\mathrm{d}L/\\mathrm{d}z_m'}</M> 이 음수라는 건 <strong><M>{'z_m'}</M> 을 키우면 loss 가 준다</strong>는 뜻. 정답이 Madrid 이니 당연한 방향.<br />
          <M>{'\\mathrm{d}L/\\mathrm{d}z_b'}</M> 가 양수라는 건 <strong><M>{'z_b'}</M> 를 줄여야 한다</strong>는 신호. 모델이 Berlin 을 잘못 자신 있게 답했으니 그 확률을 낮추라는 피드백.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Local 미분을 곱해 파라미터까지</h3>
        <p>
          <M>{'\\mathrm{d}L/\\mathrm{d}z_i'}</M> 까지 왔으면, 각 노드에서 <strong>local 미분</strong>만 곱해 한 칸 더 내려간다. 선형층 <M>{'z_i = w_i \\cdot x + b_i'}</M> 에서:
        </p>
        <M display>{'\\begin{aligned} \\partial z_i / \\partial w_i &= \\underbrace{x}_{\\text{입력 그대로 (= -3.7)}} \\\\ \\partial z_i / \\partial b_i &= \\underbrace{1}_{\\text{편향은 항상 1 의 영향력}} \\end{aligned}'}</M>
        <p>
          Chain rule 이 요구하는 것은 <strong>upstream × local</strong>. 둘을 곱하면 끝이다:
        </p>
        <M display>{'\\begin{aligned} \\mathrm{d}L/\\mathrm{d}w_m &= (-0.90) \\cdot (-3.7) = \\mathbf{+3.33} \\\\ \\mathrm{d}L/\\mathrm{d}w_p &= (+0.19) \\cdot (-3.7) = \\mathbf{-0.70} \\\\ \\mathrm{d}L/\\mathrm{d}w_b &= (+0.71) \\cdot (-3.7) = \\mathbf{-2.63} \\\\[4pt] \\mathrm{d}L/\\mathrm{d}b_m &= -0.90, \\quad \\mathrm{d}L/\\mathrm{d}b_p = +0.19, \\quad \\mathrm{d}L/\\mathrm{d}b_b = +0.71 \\end{aligned}'}</M>
        <p>
          <strong><M>{'x'}</M> 가 음수</strong>라는 점이 부호 반전을 만든다는 걸 주목.<br />
          <M>{'\\mathrm{d}L/\\mathrm{d}z_m'}</M> 은 음수였는데 <M>{'(-3.7)'}</M> 을 곱하니 <M>{'\\mathrm{d}L/\\mathrm{d}w_m'}</M> 은 양수가 된다.<br />
          Gradient descent 는 <M>{'w \\leftarrow w - \\eta \\cdot \\mathrm{d}L/\\mathrm{d}w'}</M> 이므로 <M>{'w_m'}</M> 은 감소한다 — 그러면 <M>{'z_m = w_m \\cdot (-3.7) + b_m'}</M> 은 오히려{' '}
          <strong>커진다</strong>. 입력 부호에 따라 "<M>{'w'}</M> 를 키우라"와 "<M>{'w'}</M> 를 줄이라"가 뒤집힌다는 점은 직관을 배신하기 쉬우므로 수식으로 확인.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Forward mode 와 Reverse mode — 비대칭의 기원</h3>
        <p>
          자동미분에는 두 전략이 있다. 입력 방향으로 편미분을 밀어 올리는 <strong>forward mode</strong>, 출력에서 시작해 역방향으로 훑어 내리는 <strong>reverse mode</strong>.<br />
          같은 계산 그래프를 쓰지만 "어느 축으로 seed 를 주입하느냐" 가 다르다.
        </p>
        <p>
          Forward mode 는 입력 하나를 고정해 편미분 <M>{'\\partial / \\partial x_i'}</M> 를 순전파 방향으로 동시 전파한다.<br />
          입력이 <M>{'N'}</M> 개면 <M>{'N'}</M> 번의 순전파가 필요 — 매번 다른 입력을 seed 로 삼아야 하므로.
        </p>
        <p>
          Reverse mode 는 출력 <M>{'L'}</M> 에서 <M>{'\\mathrm{d}L/\\mathrm{d}L = 1'}</M> 을 주입해 역방향 한 번으로 <strong>모든 입력에 대한 편미분을 동시에</strong> 얻는다.<br />
          순전파 1 회 + 역전파 1 회로 작업 종료. 입력 수와 무관하게 비용이 일정하다.
        </p>

        <ForwardVsReverseScene />

        <p className="mt-4">
          신경망의 파라미터 수 <M>{'N'}</M> 을 떠올리면 이 비대칭이 얼마나 큰지 직관적이다.<br />
          <strong>GPT-4 수준의 수천억 파라미터</strong>에 forward mode 를 적용하면 한 step 당 수천억 번의 순전파. Reverse mode 는 여전히 두 번(forward + backward).<br />
          <strong>수천억 배의 연산량 차이</strong>. 이 한 가지 이유로 DNN 학습의 기본 도구가 reverse mode 로 고정됐다.
        </p>
        <p>
          동작 원리의 핵심은 <strong>계산 그래프</strong> 에 있다.<br />
          순전파 때 각 연산 노드의 <strong>입력값과 local gradient</strong> 를 메모리에 저장해 둔다.<br />
          역전파 때 출력 노드에서 <M>{'\\mathrm{d}L/\\mathrm{d}L = 1'}</M> 로 시작해 chain rule 을 적용하며 gradient 를 역방향으로 누적한다.<br />
          각 노드가 하는 일은 단순하다 — <strong>"위에서 내려온 gradient × 자신의 local gradient"</strong> 를 아래 노드로 전달.
        </p>
        <p>
          Forward mode 도 완전히 사라진 건 아니다. 입력이 <strong>적고</strong> 출력이 <strong>많은</strong> 반대 구조 (예: Jacobian 전체가 필요한 물리 시뮬레이션 sensitivity 분석) 에서는 forward 가 유리하다.<br />
          하지만 신경망은 항상 "많은 입력 · 스칼라 loss" 구조이므로, reverse 가 본질적으로 맞다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPS 예제에서 한 번의 backward 로 6 개 동시 획득</h3>
        <p>
          이 모델은 파라미터가 <strong>6 개(<M>{'w'}</M> 3 개 + <M>{'b'}</M> 3 개)</strong>, 출력은 <strong>scalar loss 1 개</strong>.<br />
          Forward mode autodiff 로 같은 6 개 gradient 를 얻으려면 <strong>순전파를 6 번</strong> 돌려야 한다 — 파라미터 하나를 "이 방향으로 조금 움직였다"고 가정하고 그게 loss 에 준 영향을 forward 로 계산하는 식.
        </p>
        <p>
          Reverse mode 는 반대다. <M>{'\\mathrm{d}L/\\mathrm{d}L = 1'}</M> 이라는 <strong>출력 쪽 시드 하나</strong>로 시작해, 그래프를 거꾸로 한 번 타고 내려오면서 <strong>모든 파라미터의 gradient 를 동시에 축적</strong>한다. 경로가 한 번이라 총 연산량은 대략 forward 한 번과 비슷하다.
        </p>
        <p>
          이 비대칭이 신경망에 결정적이다. 실제 모델은 파라미터가 수억~수천억, loss 는 여전히 scalar 하나.<br />
          6 개와 6 번은 별 차이 없지만, <strong>10억 개 파라미터 × 10억 번의 순전파</strong>는 현실적으로 불가능하다.<br />
          Reverse mode 한 번의 backward 로 끝낼 수 있기 때문에 딥러닝이 성립한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">분기와 합산 — 같은 노드로 gradient 가 여러 경로로 흐를 때</h3>
        <p>
          GPS 모델은 아주 단순해 분기가 잘 안 보이는데, softmax 는 사실 <strong>이미 분기 합산의 전형</strong>이다.<br />
          <M>{'p_i = e^{z_i} / \\sum_j e^{z_j}'}</M> — 각 <M>{'p_i'}</M> 는 <strong>모든</strong> <M>{'z_j'}</M> 에 의존한다.
          Scene에서 <M>{'p'}</M> 레이어와 <M>{'z'}</M> 레이어를 연결하는 점선 교차가 바로 이 의존성.
        </p>
        <p>
          backward 에서 이게 의미하는 바: <M>{'z_m'}</M> 에 들어오는 gradient 는 <M>{'p_m \\to z_m'}</M> 경로뿐 아니라{' '}
          <M>{'p_p \\to z_m'}</M>, <M>{'p_b \\to z_m'}</M> 경로도 포함한다. 일반 규칙은{' '}
          <strong>같은 노드로 들어오는 모든 backward 간선의 gradient 를 합산</strong>.
        </p>
        <p>
          softmax + CE 를 묶어서 푼 결과 <M>{'(p - y)'}</M> 가 된 것도, 이 3 경로의 합이 우아하게 정리된 덕분이다.<br />
          일반 autodiff 프레임워크는 이 합산을 노드마다 자동으로 수행한다 — 사용자가 <code>z.grad += ...</code> 같은 accumulation 을 직접 쓸 일이 없는 이유.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Reverse-mode 가 DNN 에 "최적"인 진짜 이유</p>
          <p>
            <strong>VJP (vector-Jacobian product) 우위</strong>: 함수 <M>{'f \\colon \\mathbb{R}^n \\to \\mathbb{R}^m'}</M> 의 Jacobian 은 <M>{'m \\times n'}</M>.<br />
            Reverse mode 는 <strong>행 하나</strong>(<M>{'v^{\\top} J'}</M>)를 싸게 계산 — scalar output 이면 행이 1 개라 완벽.<br />
            Forward mode 는 <strong>열 하나</strong>(<M>{'J v'}</M>)를 싸게 계산 — input 이 1 차원이면 유리하지만 DNN 은 그 반대.
          </p>
          <p className="mt-2">
            <strong>메모리 trade-off</strong>:<br />
            reverse 는 backward 가 필요한 모든 중간값을 forward 에서 저장해야 함 → activation memory 가 병목.<br />
            gradient checkpointing 은 이걸 완화하는 기법 — 일부 activation 을 버리고 backward 시 재계산.
          </p>
          <p className="mt-2">
            <strong>PyTorch 와의 연결</strong>:<br />
            <code>loss.backward()</code> = 이 알고리즘의 C++ 구현 호출.<br />
            각 tensor 가 자기 생성에 쓰인 연산과 입력을 <code>grad_fn</code> 에 기록 → 호출 시점에 역방향 순회.<br />
            <code>.grad</code> 에 누적되는 것도 위에서 본 "같은 노드로 들어오는 경로 합산" 그대로.
          </p>
          <p className="mt-2">
            <strong>이 GPS 예제의 의미</strong>:<br />
            파라미터 6 개짜리 장난감 모델이지만, 실제 Transformer 를 포함한 모든 모던 학습이 똑같은 경로를 타고 gradient 를 얻는다.<br />
            숫자가 커지고 그래프가 깊어질 뿐, "<M>{'\\mathrm{d}L/\\mathrm{d}L = 1'}</M> 에서 거꾸로 한 번"이라는 본질은 변하지 않는다.
          </p>
        </div>
      </div>
    </section>
  );
}
