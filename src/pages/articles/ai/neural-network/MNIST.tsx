import ExplainedFormula from "@/components/ui/explained-formula";
import MNISTExperimentViz from "./viz/MNISTExperimentViz";

export default function MNIST() {
  return (
    <>
      <section id="mnist" data-teach-level="7" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          7. 같은 계산을 784→128→10으로 넓히면 손글씨 분류기가 됩니다
        </h2>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            XOR 신경망은 입력 2개를 은닉값 2개로 바꾸고 답 하나를 냈습니다.
            MNIST의 28×28 흑백 이미지를 한 줄로 펴면 입력값이 784개가 됩니다.
            은닉값을 128개 만들고 숫자 0부터 9까지 로짓 10개를 내면 계산의
            종류는 같습니다. 달라지는 것은 행렬의 크기입니다.
          </p>
          <p>
            첫 가중치 행렬은 모든 픽셀 784개를 은닉 뉴런 128개와 연결합니다.
            둘째 가중치 행렬은 은닉값 128개를 숫자별 로짓 10개로 바꿉니다.
            배치가 64장이든 256장이든 같은 가중치를 공유하므로 학습할 숫자의
            개수는 바뀌지 않습니다. 대신 중간값을 저장할 메모리와 한 번에 하는
            계산량이 달라집니다.
          </p>
        </div>

        <ExplainedFormula
          question="784→128→10 신경망에는 학습할 가중치와 편향이 몇 개 있을까요?"
          idea={
            <>
              완전 연결 층마다 입력 수와 출력 수를 곱해 가중치 수를 세고, 출력
              하나마다 편향 하나를 더합니다.
            </>
          }
          formula={String.raw`N_1=784\times128+128,\qquad N_2=128\times10+10,\qquad N_\theta=N_1+N_2=101{,}770`}
          annotatedFormula={String.raw`N_1=\underbrace{784\times128}_{\text{픽셀과 은닉값의 연결}}+\underbrace{128}_{\text{은닉 편향}}=100{,}480,\qquad N_2=\underbrace{128\times10}_{\text{은닉값과 숫자 로짓의 연결}}+\underbrace{10}_{\text{출력 편향}}=1{,}290,\qquad N_\theta=\underbrace{100{,}480+1{,}290}_{101{,}770}`}
          operations={[
            {
              expression: String.raw`784\times128`,
              annotation: [
                "은닉 뉴런 128개가 각각",
                "입력 픽셀 784개와 연결됩니다",
              ],
            },
            {
              expression: String.raw`128\times10`,
              annotation: ["은닉값 128개를", "숫자별 로짓 10개로 섞습니다"],
            },
            {
              expression: String.raw`100{,}480+1{,}290`,
              annotation: [
                "두 층의 가중치와 편향을 모두 더합니다",
                "활성화 함수와 배치 크기는 이 수를 늘리지 않습니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "N_1",
              name: "첫째 층의 매개변수 수",
              description: "픽셀에서 은닉값으로 가는 가중치와 편향입니다.",
            },
            {
              symbol: "N_2",
              name: "출력층의 매개변수 수",
              description: "은닉값에서 숫자 로짓으로 가는 가중치와 편향입니다.",
            },
            {
              symbol: "N_\\theta",
              name: "전체 학습 매개변수 수",
              description: "두 층이 학습 중 바꾸는 숫자의 총합입니다.",
            },
          ]}
          assumptions={[
            "합성곱, 정규화, 임베딩 없이 완전 연결 층 두 개만 사용합니다.",
            "입력 이미지는 28×28을 784개 값으로 펼칩니다.",
          ]}
          interpretation="첫 층은 100,480개, 둘째 층은 1,290개여서 총 101,770개입니다. 배치 크기는 이 수를 바꾸지 않지만, 배치별 중간값과 기울기 메모리는 바꿉니다."
        />

        <MNISTExperimentViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>
            작은 실험의 목적은 높은 점수 하나가 아니라 계산 계약을 확인하는
            일입니다
          </h3>
          <p>
            학습 자료에서는 순전파로 로짓과 손실을 만듭니다. 역전파로 각
            가중치의 기울기를 구한 뒤 최적화 단계에서 숫자를 바꿉니다. 검증
            자료에서는 가중치를 바꾸지 않습니다. 전처리 방식과 자료 순서는
            고정하되, 학습 모드와 평가 모드의 역할을 분리해야 합니다.
          </p>
          <p>
            학습과 검증 정확도가 모두 낮으면 학습률, 입력 범위, 정답 연결,
            기울기부터 확인합니다. 학습만 높고 검증이 낮으면 과적합뿐 아니라
            자료 누출과 분포 차이를 확인합니다. 정확도가 높아도 혼동 행렬과
            오분류 이미지를 보면 특정 숫자 쌍이나 배경에 의존한 지름길을 찾을 수
            있습니다.
          </p>
        </div>
      </section>

      <section
        id="real-code"
        data-teach-level="8"
        className="mb-16 scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 실제 PyTorch 코드에서 같은 모양과 출력 약속을 확인합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            아래 코드는 입력을 784개 값으로 펴고, 완전 연결 층과 ReLU를 거쳐
            로짓 10개를 냅니다. 마지막에 softmax를 직접 붙이지 않습니다.
            <code>CrossEntropyLoss</code>가 원시 로짓을 받아 안정적으로
            log-softmax와 정답 채점을 함께 처리하기 때문입니다.
          </p>
        </div>
        <pre className="not-prose my-6 overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs leading-6">
          <code>{`model = nn.Sequential(
    nn.Flatten(),          # (B, 1, 28, 28) → (B, 784)
    nn.Linear(784, 128),   # (B, 784) → (B, 128)
    nn.ReLU(),             # 모양은 유지
    nn.Linear(128, 10),    # (B, 128) → (B, 10) 로짓
)

logits = model(images)
loss = nn.CrossEntropyLoss()(logits, labels)`}</code>
        </pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실제 <code>nn.Linear</code>은 가중치를
            <code>(out_features, in_features)</code> 모양으로 저장하고,
            <code>forward</code>에서 <code>F.linear(input, weight, bias)</code>
            를 호출합니다. 이 글의 행 벡터 표기 <code>XW+b</code>와 저장 모양이
            반대처럼 보이는 이유는 내부 계산이 전치된 가중치를 사용하기
            때문입니다.
          </p>
        </div>
        <div
          id="source-pytorch-linear"
          className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            고정 커밋의 공식 소스
          </p>
          <h3 className="mt-2 text-base font-bold text-foreground">
            PyTorch Linear은 출력×입력 모양의 가중치와 출력 길이의 편향을
            저장합니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            2026-10-14에 확인한 커밋에서 생성자는
            <code className="mx-1">(out_features, in_features)</code> 모양의
            가중치를 만들고, 입력 수에서 계산한 범위로 편향을 초기화합니다. 이
            소스는 저장 모양과 기본 초기화를 확인하는 근거입니다. GPU 커널의
            선택이나 모든 장치의 성능까지 설명하는 근거는 아닙니다.
          </p>
          <a
            href="https://github.com/pytorch/pytorch/blob/8ed12848bd2b7baba59d5dd8056d861173cd7702/torch/nn/modules/linear.py#L93-L126"
            className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            PyTorch Linear 고정 소스 보기
          </a>
        </div>
        <div
          id="paper-document-recognition"
          className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            원 논문을 적용할 범위
          </p>
          <h3 className="mt-2 text-base font-bold text-foreground">
            문서 인식 연구는 특징 추출과 분류를 함께 학습하는 체계를 보여 줍니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            LeCun 등의 1998년 연구는 합성곱 신경망과 기울기 기반 학습을 문서
            인식 과정에 연결했습니다. 이는 손글씨 자료에서 종단 간 학습의 효과를
            보여 준 사례입니다. 이미지를 펼친 이 교육용 MLP는 공간 구조를 쓰는
            합성곱 신경망과 다릅니다. MNIST 정확도가 실제 이미지 분포 변화의
            견고성을 보장하지도 않습니다.
          </p>
        </div>
      </section>

      <section
        id="prediction-questions"
        data-teach-level="9"
        className="mb-16 scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. 같은 사례를 바꾸면 다음 결과를 예측할 수 있나요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            XOR 입력 <code>(1,1)</code>은 OR·NAND 은닉값 중 무엇을 0으로 만들며,
            출력층에서 왜 최종 0이 될까요? (답: 2·5절)
          </p>
          <p>
            아핀 층 세 개 사이에 활성화 함수가 하나도 없다면 결정 경계가 더
            복잡해질까요? 가중치와 편향을 어떤 순서로 합칠지 설명해 보세요. (답:
            4절)
          </p>
          <p>
            배치 크기를 64에서 128로 늘리면 학습 매개변수 101,770개도 두 배가
            될까요? 784→128→10 모델에서 어떤 메모리가 늘어나는지 구분해 보세요.
            (답: 5·7절)
          </p>
          <p>
            한 이미지에 여러 물체 표지가 동시에 참일 수 있다면 로짓 10개에
            소프트맥스를 써야 할까요? 출력 약속을 먼저 설명해 보세요. (답: 6절)
          </p>
        </div>
      </section>
    </>
  );
}
