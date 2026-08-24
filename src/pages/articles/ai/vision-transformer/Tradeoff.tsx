import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TradeoffViz from "./viz/TradeoffViz";

export default function Tradeoff() {
  return (
    <section id="tradeoff" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CNN과 ViT의 공정 비교는 architecture가 아니라 전체 recipe와 deployment budget을 맞추는 실험입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Target label 수 하나로 “이 지점부터 ViT가 유리하다”는 경계를 만들 수는
          없습니다. Pretraining corpus·objective, input resolution, augmentation,
          optimizer, update 수, model capacity와 tuning trial 수가 모두 달라질 수 있기
          때문입니다. Available pretrained checkpoint를 실제 배포 input과 같은
          split에서 fine-tune하고 seed별 paired difference로 비교합니다.
        </p>
      </div>
      <ExplainedFormula
        question="서로 다른 architecture 후보의 validation gain과 실행 비용을 어떻게 같은 선택표에 놓을까?"
        idea={<>같은 seed에서 후보 B와 기준 A의 metric 차이를 먼저 구해 initialization·sampling 변동을 짝지어 제거합니다. 그 뒤 품질, latency, memory가 제품 제약을 동시에 만족하는지 확인합니다.</>}
        formula={String.raw`\begin{aligned}
\Delta_s&=m(B;s)-m(A;s),\\
\overline\Delta&=\frac1S\sum_{s=1}^{S}\Delta_s,\\
\overline\Delta&>\delta_{\min},\\
L_{95}(B)&\le L_{\max},\qquad M(B)\le M_{\max}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\Delta_s&=\underbrace{m(B;s)-m(A;s),}_{\text{변화량 계산}}\\
\overline\Delta&=\underbrace{\frac1S\sum_{s=1}^{S}\Delta_s,}_{\text{변화량 계산}}\\
\overline\Delta&>\underbrace{\delta_{\min},}_{\text{경계 후보 선택}}\\
L_{95}(B)&\le L_{\max},\qquad M(B)\le M_{\max}.
\end{aligned}`}
        operations={[
          { expression: String.raw`m(B;s)-m(A;s),`, annotation: ["paired quality metric이(가) 식의 결과에","기여하는 방식을 계산합니다.","같은 seed에서 후보 B와 기준 A의 metric 차이를","먼저 구해 initialization·sampling 변동을"] },
          { expression: String.raw`\frac1S\sum_{s=1}^{S}\Delta_s,`, annotation: ["인접한 level의 차이를 남겨 변화량을 계산합니다.","같은 seed에서 후보 B와 기준 A의 metric 차이를","먼저 구해 initialization·sampling 변동을","짝지어 제거합니다."] },
          { expression: String.raw`\delta_{\min},`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","같은 seed에서 후보 B와 기준 A의 metric 차이를","먼저 구해 initialization·sampling 변동을","짝지어 제거합니다."] },
        ]}
        terms={[
          { symbol: "m(A;s)", name: "paired quality metric", description: "같은 split·seed·search budget에서 후보 A가 얻은 target metric입니다." },
          { symbol: "Δ̄", name: "mean paired gain", description: "S개 같은 seed 쌍에서 후보 B가 기준 A보다 얻은 평균 품질 차이입니다." },
          { symbol: "δ_min", name: "minimum useful gain", description: "측정 변동과 운영 복잡도를 감수할 만큼 필요한 최소 품질 이득입니다." },
          { symbol: "L₉₅,M", name: "latency and memory", description: "고정 runtime·batch·warmup 조건에서 측정한 p95 latency와 peak device memory입니다." },
        ]}
        assumptions={["A와 B는 같은 target split·input contract·seed set·update/tuning budget을 사용합니다.", "Metric 방향은 클수록 좋다고 두었으며 loss라면 차이 부호를 바꿉니다.", "Latency·memory는 target accelerator·runtime·batch·precision·concurrency 조건을 함께 기록합니다."]}
        interpretation="Average accuracy가 조금 높아도 uncertainty보다 작거나 latency SLO를 넘으면 제품 선택의 근거가 되지 않습니다. Architecture 논문은 후보를 만들고 이 paired receipt가 선택을 끝냅니다."
      />
      <div className="not-prose my-8"><TradeoffViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Resolution·backbone·augmentation을 함께 비교하는 실행 순서는
          <Link to="/ai/image-classification-pipeline">이미지 분류 파이프라인 글</Link>을
          따릅니다. ViT에서는 patch size와 position grid, stochastic depth,
          attention implementation과 quantization support를 추가 열로 둡니다. FLOPs는
          후보를 줄이는 proxy일 뿐이며 target compiler와 batch에서 측정한 latency를
          대신하지 않습니다.
        </p>
      </div>
    </section>
  );
}
