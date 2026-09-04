import ExplainedFormula from "@/components/ui/explained-formula";
import LateFusionViz from "./viz/LateFusionViz";

export default function LateFusion() {
  return (
    <section id="late-fusion" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Late fusion은 view별 표현을 독립적으로 만든 뒤, 결측을 아는 집계 함수로 합칩니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 view를 encoder로 처리한 뒤 pooled feature나 prediction을 concat, mean, max 또는 learned gate로 결합합니다. view의
          modality와 image statistics가 비슷하면 encoder weight를 공유해 parameter를 줄일 수 있고 서로 다르면 독립 encoder가 각 분포에 맞게
          표현을 학습할 수 있습니다.
        </p>
        <p>
          Prediction-level averaging은 가장 단순한 baseline이고 pretrained model을 거의 수정하지 않습니다. feature-level fusion은
          더 많은 interaction을 학습하지만 concat dimension과 head capacity가 커질 수 있으므로 projection 뒤 공통 dimension으로 맞추는
          방법도 비교합니다.
        </p>
      </div>
      <ExplainedFormula
        question="일부 view가 없을 때 learned gate는 어떻게 유효한 view 사이에서만 weight를 나눌까?"
        idea={<>각 encoder output hᵥ에서 gate score aᵥ를 만들되, mask가 0인 view는 softmax의 분자와 분모에서 제외합니다. 그 결과 남은 weight의 합은 1이 됩니다.</>}
        formula={String.raw`\begin{aligned}
h_v&=e_v(x_v),\\
\alpha_v&=\frac{m_v\exp(a_v)}{\sum_j m_j\exp(a_j)},\\
h&=\sum_v\alpha_v h_v.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
h_v&=\underbrace{e_v(x_v),}_{\text{오른쪽 항으로 결과 계산}}\\
\alpha_v&=\underbrace{\frac{m_v\exp(a_v)}{\sum_j m_j\exp(a_j)},}_{\text{기준량당 비율}}\\
h&=\underbrace{\sum_v\alpha_v h_v.}_{\text{오른쪽 항으로 결과 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`e_v(x_v),`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","각 encoder output hᵥ에서 gate score","aᵥ를 만들되, mask가 0인 view는 softmax의","분자와 분모에서 제외합니다."] },
          { expression: String.raw`\frac{m_v\exp(a_v)}{\sum_j m_j\exp(a_j)},`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 encoder output hᵥ에서 gate score","aᵥ를 만들되, mask가 0인 view는 softmax의","분자와 분모에서 제외합니다."] },
          { expression: String.raw`\sum_v\alpha_v h_v.`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","각 encoder output hᵥ에서 gate score","aᵥ를 만들되, mask가 0인 view는 softmax의","분자와 분모에서 제외합니다."] },
        ]}
        terms={[
          { symbol: "eᵥ", name: "view encoder", description: "v번째 view를 공통 dimension의 feature hᵥ로 바꿉니다. Modality에 따라 weight를 공유하거나 분리합니다." },
          { symbol: "aᵥ", name: "gate score", description: "현재 sample에서 view v에 배정할 상대 weight의 logit입니다." },
          { symbol: "mᵥ", name: "view mask", description: "사용 가능한 view는 1, 결측 view는 0인 표시입니다." },
          { symbol: "αᵥ", name: "masked normalized weight", description: "사용 가능한 view끼리 합이 1이 되도록 정규화된 집계 weight입니다." },
        ]}
        assumptions={["각 hᵥ의 dimension과 scale이 집계 가능하도록 맞춰져 있습니다.", "Sample마다 최소 한 개의 view가 존재해 분모가 0이 되지 않습니다.", "Gate score는 prediction을 위한 내부 변수이며 그 자체를 causal importance로 해석하지 않습니다."]}
        interpretation="Mask가 [1,0,1]이면 두 번째 view의 weight는 정확히 0이고, 첫째와 셋째만 다시 정규화됩니다. 모든 encoder가 shared이고 view metadata도 원소와 함께 이동한다면 이 weighted sum은 입력 나열 순서에 영향을 받지 않습니다."
      />
      <div className="not-prose my-8"><LateFusionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>View mask와 permutation contract를 명시합니다</h3>
        <p>
          view 위치가 의미를 갖는 고정 camera라면 view ID embedding을 넣고 순서를 고정할 수 있습니다. 반대로 unordered set이라면 mean
          pooling이나 permutation-invariant aggregator를 사용해 입력 순서를 바꿔도 prediction이 유지되는지 test합니다.
        </p>
        <p>
          gating weight는 “설명 가능한 중요도”로 곧바로 해석하지 않습니다. 특정 view를 가렸을 때의 metric drop과 sample별 error를 함께 봐야 model이
          실제로 어떤 정보에 의존하는지 확인할 수 있습니다.
        </p>
      </div>
      <div id="paper-mvcnn" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Multi-view CNN</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Su 등은 3D shape를 여러 2D rendering으로 표현하고 각 view에 CNN을 적용한 뒤 view pooling으로 compact shape descriptor를
            만들었습니다. 이 결과는 rendered-view 기반 3D shape recognition 조건의 근거이며, 서로 다른 modality의 calibration이나 임의의
            missing-view 조합까지 해결했다는 뜻은 아닙니다.
          </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_iccv_2015/html/Su_Multi-View_Convolutional_Neural_ICCV_2015_paper.html" target="_blank" rel="noreferrer">View pooling 위치와 평가 범위 보기</a>
      </div>
    </section>
  );
}
