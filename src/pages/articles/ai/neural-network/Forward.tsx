import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import TensorShapeTraceViz from "./viz/TensorShapeTraceViz";

export default function Forward() {
  return (
    <section id="forward" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        5. XOR 네 상태를 행렬 하나로 묶어 같은 길을 통과시킵니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          지금까지는 <code>(1,0)</code> 하나를 따라갔습니다. 실제 계산에서는 네
          상태를 네 번 따로 처리하지 않고 행으로 쌓습니다. 입력 행렬
          <code>X</code>의 모양은 <code>4×2</code>입니다. 첫 축 4는 자료 수,
          둘째 축 2는 입력값 수입니다.
        </p>
        <p>
          은닉 뉴런이 OR과 NAND 두 개이므로 첫 가중치 행렬의 모양은
          <code>2×2</code>입니다. 곱한 결과는 <code>4×2</code>가 됩니다. 출력
          뉴런은 하나이므로 둘째 가중치의 모양은 <code>2×1</code>이고, 최종
          점수는 <code>4×1</code>입니다. 자료 수 4는 그대로 남고, 마지막 축만
          층의 뉴런 수에 맞춰 바뀝니다.
        </p>
      </div>

      <ExplainedFormula
        question="자료 B개를 한 층에 한꺼번에 넣으면 어떤 축이 사라지고 어떤 축이 남을까요?"
        idea={
          <>
            입력 특성 축 <code>D_in</code>과 가중치의 첫 축을 곱해 더합니다.
            자료 축 <code>B</code>는 유지되고, 새 특성 축 <code>D_out</code>이
            남습니다.
          </>
        }
        formula={String.raw`X\in\mathbb R^{B\times D_{\rm in}},\quad W\in\mathbb R^{D_{\rm in}\times D_{\rm out}},\quad b\in\mathbb R^{D_{\rm out}},\qquad A=\phi(XW+b)\in\mathbb R^{B\times D_{\rm out}}`}
        annotatedFormula={String.raw`\underbrace{X}_{B\times D_{\rm in}}\underbrace{W}_{D_{\rm in}\times D_{\rm out}}=\underbrace{XW}_{B\times D_{\rm out}},\qquad \underbrace{A}_{B\times D_{\rm out}}=\underbrace{\phi\!\left(XW+\overbrace{b}^{\text{각 행에 더함}}\right)}_{\text{모양은 유지하고 값만 변환}}`}
        operations={[
          {
            expression: String.raw`XW`,
            annotation: [
              "D_in개의 입력값을 곱하고 더해",
              "자료마다 D_out개의 새 점수를 만듭니다",
            ],
          },
          {
            expression: "b",
            annotation: [
              "길이 D_out인 편향을",
              "B개의 모든 행에 같은 방식으로 더합니다",
            ],
          },
          {
            expression: String.raw`\phi(XW+b)`,
            annotation: [
              "행렬 모양 B×D_out은 그대로 두고",
              "각 점수를 다음 층의 값으로 바꿉니다",
            ],
          },
        ]}
        terms={[
          {
            symbol: "B",
            name: "묶음 크기 (batch size)",
            description: "같은 가중치로 함께 처리하는 자료 수입니다.",
          },
          {
            symbol: "D_{\\rm in}",
            name: "입력 너비",
            description: "한 자료가 현재 층에 건네는 값의 개수입니다.",
          },
          {
            symbol: "D_{\\rm out}",
            name: "출력 너비",
            description: "현재 층이 자료마다 새로 만드는 값의 개수입니다.",
          },
        ]}
        assumptions={[
          "자료 한 건을 행으로 놓는 2차원 표기입니다.",
          "이미지와 문장처럼 축이 더 많으면 앞쪽 축을 유지하고 마지막 특성 축에 같은 계산을 적용할 수 있습니다.",
        ]}
        interpretation="XOR에서는 B=4, D_in=2, D_out=2입니다. X는 4×2, W₁은 2×2, 은닉값 A₁은 4×2입니다. 다음 W₂가 2×1이므로 최종 예측은 4×1입니다."
      />

      <TensorShapeTraceViz />

      <AlgorithmBlock
        title="XOR 네 상태를 은닉층과 출력층에 차례로 넣는 절차 (의사코드)"
        input={[
          "X=[(0,0),(1,0),(0,1),(1,1)] · 모양 4×2",
          "W₁=[[1,−1],[1,−1]], b₁=(−0.5,1.5); W₂=(1,1)ᵀ, b₂=−1.5",
        ]}
        steps={[
          {
            code: "Z₁ ← XW₁+b₁ = [(-0.5,1.5),(0.5,0.5),(0.5,0.5),(1.5,-0.5)]",
            note: "첫 열은 OR 점수, 둘째 열은 NAND 점수입니다.",
          },
          {
            code: "A₁ ← H(Z₁) = [(0,1),(1,1),(1,1),(1,0)]",
            note: "점수가 0보다 큰 곳만 1로 바꿔 은닉 좌표를 만듭니다.",
          },
          {
            code: "Z₂ ← A₁W₂+b₂ = [−0.5,0.5,0.5,−0.5]",
            note: "두 은닉값이 모두 1인 행만 양수입니다.",
          },
          {
            code: "ŷ ← H(Z₂) = [0,1,1,0]",
            note: "네 XOR 정답과 같은 순서의 예측이 나옵니다.",
          },
          {
            code: "compare(ŷ,y) ← [맞음,맞음,맞음,맞음]",
            note: "한 입력만 확인하지 않고 같은 행 순서의 정답 전체와 대조합니다.",
          },
        ]}
        output="은닉 표현 모양 4×2 · 최종 예측 모양 4×1 · 오답 0개"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>모양이 맞아도 값의 크기는 무너질 수 있습니다</h3>
        <p>
          순전파(forward pass)는 현재 가중치로 입력에서 예측까지 값을 계산하는
          과정입니다. 행렬 모양이 모두 맞아도 층을 지날 때 값이 계속 커지거나
          작아지면 학습이 불안정해집니다. 가중치를 모두 0으로 시작하면 같은 층의
          뉴런들이 같은 값을 냅니다. 같은 기울기까지 받으므로 서로 다른 역할로
          갈라지기 어렵습니다.
        </p>
        <p>
          (가정) 서로 독립이고 분산이 1인 입력이 100개 있습니다. 이를 분산 1인
          가중치와 곱해 더하면 활성화 전 값의 분산은 약 100까지 커질 수
          있습니다. 가중치 분산을 입력 수의 역수인 <code>1/100</code> 정도로
          두면 출발 분산을 약 1로 맞출 수 있습니다. Xavier와 He 초기화는 이
          생각을 활성화 함수와 입력·출력 수에 맞게 조정한 출발점입니다.
        </p>
      </div>

      <div
        id="paper-glorot-initialization"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          원 논문을 같은 질문에 적용합니다
        </p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          Glorot와 Bengio의 초기화는 깊이를 지나는 신호의 출발 크기를 맞춥니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          2010년 연구는 시그모이드(sigmoid) 계열 신경망에서 윗층의 포화와 느린
          학습을 분석했습니다. 입력 수와 출력 수를 함께 반영한 초기 크기도
          제안했습니다. 이는 해당 활성화 함수와 실험 조건에서 얻은 출발점입니다.
          ReLU, 정규화, 잔차 연결이 있는 모든 구조에서 같은 분포가 최적이라는
          뜻은 아닙니다.
        </p>
      </div>
    </section>
  );
}
