import ExplainedFormula from "@/components/ui/explained-formula";
import LateFusionViz from "./viz/LateFusionViz";

export default function LateFusion() {
  return (
    <section id="late-fusion" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">관측별 표현을 만든 뒤 빠진 관측을 제외합니다</h2>
      <LateFusionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          정면·측면·밑창·위쪽 사진을 각각 인코더로 처리한 뒤 표현이나 예측값을 이어 붙이거나
          평균·최댓값·학습된 가중치로 합칩니다. 모두 RGB처럼 분포가 비슷하면 인코더
          가중치를 공유해 매개변수를 줄일 수 있고, RGB와 열화상처럼 성질이 다르면 별도
          인코더가 각 입력에 맞는 표현을 배울 수 있습니다.
        </p>
        <p>
          예측값 평균은 가장 단순한 기준선이며 기존 모델을 거의 바꾸지 않습니다. 표현을
          합치면 더 많은 관계를 배울 수 있지만 이어 붙인 차원과 판정 head가 커집니다.
          따라서 각 표현을 같은 차원으로 투영한 뒤 합치는 후보도 같은 조건에서 비교합니다.
        </p>
      </div>
      <ExplainedFormula
        question="일부 관측이 없을 때 학습된 gate는 어떻게 유효한 관측 사이에서만 가중치를 나눌까?"
        idea={<>각 인코더 출력 hᵥ에서 점수 aᵥ를 만들되, mask가 0인 관측은 softmax의 분자와 분모에서 제외합니다. 그 결과 남은 가중치의 합은 1이 됩니다.</>}
        formula={String.raw`\begin{aligned}
h_v&=e_v(x_v),\\
\alpha_v&=\frac{m_v\exp(a_v)}{\sum_j m_j\exp(a_j)},\\
h&=\sum_v\alpha_v h_v.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
h_v&=\underbrace{e_v(x_v)}_{\text{관측별 표현}},\\
\alpha_v&=\underbrace{\frac{m_v\exp(a_v)}{\sum_j m_j\exp(a_j)}}_{\text{누락을 제외한 softmax}},\\
h&=\underbrace{\sum_v\alpha_v h_v}_{\text{가중합 결합}}.
\end{aligned}`}
        operations={[
          { expression: String.raw`e_v(x_v)`, annotation: ["관측 v를 인코더로 같은 차원의 표현으로","입력이 비슷하면 가중치 공유, 다르면 분리"] },
          { expression: String.raw`\frac{m_v\exp(a_v)}{\sum_j m_j\exp(a_j)}`, annotation: ["mask 0인 관측은 분자·분모에서 빠짐","남은 관측의 가중치 합이 정확히 1","mask [1,0,1,1]이면 α₂=0"] },
          { expression: String.raw`\sum_v\alpha_v h_v`, annotation: ["유효한 관측 표현을 gate 가중치로 합산","공유 인코더와 대칭 집계기면 입력 순서에 불변","α가 커도 원인 중요도로 바로 읽지 않음"] },
        ]}
        terms={[
          { symbol: "eᵥ", name: "관측 인코더", description: "v번째 관측을 같은 차원의 표현 hᵥ로 바꿉니다. 입력 종류에 따라 가중치를 공유하거나 분리합니다." },
          { symbol: "aᵥ", name: "gate 점수", description: "현재 상품 묶음에서 관측 v에 배정할 상대 가중치의 logit입니다." },
          { symbol: "mᵥ", name: "관측 유효성", description: "사용 가능한 관측은 1, 누락 관측은 0인 표시입니다." },
          { symbol: "αᵥ", name: "누락을 제외한 정규화 가중치", description: "사용 가능한 관측끼리 합이 1이 되도록 정규화한 집계 가중치입니다." },
        ]}
        assumptions={["각 hᵥ의 차원과 크기가 집계할 수 있도록 맞춰져 있습니다.", "상품 묶음마다 최소 관측 하나가 있어 분모가 0이 되지 않습니다.", "Gate 점수는 예측을 위한 내부 변수이며 그 자체를 인과적 중요도로 해석하지 않습니다."]}
        interpretation="Mask [1,0,1,1]과 점수 [0,5,1,0.5]에서는 두 번째 관측의 가중치가 0이고 나머지는 약 [0.186,0.506,0.307]로 다시 정규화됩니다. 모든 관측이 공유 인코더를 지나고 메타데이터도 원소와 함께 이동한다면 이 가중합은 입력을 나열한 순서에 영향을 받지 않습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>순서와 가중치가 뜻하는 범위를 구분합니다</h3>
        <p>
          자리가 정보를 담는 고정 카메라라면 카메라 ID를 넣고 순서를 고정할 수 있습니다.
          반대로 순서가 없는 사진 모음이라면 평균이나 순서 불변 집계기를 사용하고, 입력
          순서를 바꿔도 예측이 유지되는지 시험합니다.
        </p>
        <p>
          학습된 가중치가 크다고 그 관측을 원인이나 사람에게 설명 가능한 중요도로 바로
          해석하지 않습니다. 특정 관측을 가렸을 때 실제 오차가 어떻게 변하는지 함께 봐야
          모델이 어느 정보에 의존하는지 확인할 수 있습니다.
        </p>
      </div>
      <div id="paper-mvcnn" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Multi-view CNN</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Su 등은 3차원 형상을 여러 2차원 렌더링으로 표현하고 각 화면에 CNN을 적용한 뒤
            view pooling으로 하나의 형상 표현을 만들었습니다. 이 결과는 렌더링된 화면으로
            3차원 형상을 인식한 논문의 조건 안에서만 근거가 됩니다. 서로 다른 센서의 보정이나
            임의의 관측 누락까지 해결했다는 뜻은 아닙니다.
          </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_iccv_2015/html/Su_Multi-View_Convolutional_Neural_ICCV_2015_paper.html" target="_blank" rel="noreferrer">View pooling 위치와 평가 범위 보기</a>
      </div>
    </section>
  );
}
