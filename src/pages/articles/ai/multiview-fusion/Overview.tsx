import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">멀티뷰 학습은 image를 많이 넣는 기법이 아니라, 같은 대상을 본 관측 묶음을 정의하는 문제에서 시작합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          상품의 앞·옆 사진, 한 환자를 촬영한 여러 영상, RGB와 depth처럼 한 대상을
          서로 다른 관점에서 관측한 값은 한 장에 없는 정보를 보완합니다. 그러나
          model은 파일 이름만 보고 같은 대상을 알아내지 못합니다. 먼저 <strong>어떤
          관측들이 한 sample인지</strong>, 좌표와 시각은 어떻게 맞추는지, 일부 view가
          없을 때 무엇으로 표시할지를 data pipeline이 보장해야 합니다.
        </p>
        <p>
          이 글에서 fusion은 세 경계로 나눕니다. 좌표가 맞는 raw input을 channel로
          합치는 early fusion, view별 feature를 만든 뒤 집계하는 late fusion, 그리고
          spatial token 사이의 관계를 학습하는 attention fusion입니다. <Link to="/ai/cnn">CNN의
          image tensor와 encoder</Link>, <Link to="/ai/attention-theory">Q·K·V와
          self-attention</Link>은 각 정본을 재사용하고, 여기서는 view sample 계약과
          결합 위치가 만드는 가정에 집중합니다.
        </p>
      </div>
      <ContentBoundary article="multiview-fusion" />
      <ExplainedFormula
        question="관측 수가 sample마다 달라도 한 개의 멀티뷰 sample을 어떻게 적을 수 있을까?"
        idea={<>각 view의 관측값만 모으지 않고, 보이는지 나타내는 mask와 좌표·시각·센서 정보를 담은 metadata를 한 tuple로 묶습니다. Label은 개별 image가 아니라 이 episode 전체에 붙습니다.</>}
        formula={String.raw`\begin{aligned}
X_i&=\{(x_{iv},m_{iv},c_{iv})\}_{v=1}^{V_i},\\
\hat y_i&=F_\theta(X_i).
\end{aligned}`}
        terms={[
          { symbol: "i,v", name: "sample and view index", description: "i는 같은 대상·사건을 묶은 episode, v는 그 안의 camera·sensor·시점 index입니다." },
          { symbol: "xᵢᵥ", name: "view observation", description: "v번째 view의 image, depth map 또는 encoder가 읽을 원자료입니다." },
          { symbol: "mᵢᵥ", name: "availability mask", description: "관측이 실제로 존재하고 사용할 수 있는지 표시합니다. 값 0인 관측과 결측을 구분합니다." },
          { symbol: "cᵢᵥ", name: "view metadata", description: "Camera ID·pose·timestamp·calibration·quality처럼 관측의 좌표와 의미를 설명합니다." },
          { symbol: "Fθ", name: "fusion predictor", description: "가변 개수의 view tuple을 받아 episode 수준 prediction을 만드는 전체 model입니다." },
        ]}
        assumptions={["하나의 Xᵢ 안에 들어간 view들은 label yᵢ가 가리키는 같은 대상·사건에 속합니다.", "Availability와 metadata는 prediction 시점에도 같은 정의로 생성할 수 있습니다.", "View 수 Vᵢ가 고정인지 가변인지, 순서가 의미인지 여부는 별도로 선언합니다."]}
        interpretation="멀티뷰 dataset의 최소 단위는 image 파일 한 장이 아니라 episode Xᵢ입니다. 따라서 train·validation·test split도 같은 identity의 episode가 서로 다른 split으로 새지 않도록 group 단위로 만들어야 합니다."
      />
      <div className="not-prose my-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          고정 camera 번호처럼 순서 자체가 의미라면 tuple로 다루고 view ID를
          보존합니다. 반대로 여러 각도의 사진처럼 입력 순서가 임의라면 set으로
          다루며, 순서를 바꿔도 결과가 같아야 합니다. 이 둘을 구분하지 않으면
          dataset loader의 정렬 순서를 model이 의미 있는 신호로 외울 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="순서가 없는 view set이라는 말은 model output에 어떤 검사를 요구할까?"
        idea={<>같은 원소를 다른 순서로 나열한 permutation은 같은 set입니다. 그러므로 분류처럼 episode 전체에 한 값을 내는 함수는 어떤 permutation을 적용해도 output이 변하지 않아야 합니다.</>}
        formula={String.raw`F_\theta(\pi X_i)=F_\theta(X_i)\qquad\text{for every permutation }\pi`}
        terms={[
          { symbol: "π", name: "permutation", description: "View 내용은 그대로 둔 채 나열 순서만 바꾸는 일대일 재배열입니다." },
          { symbol: "πXᵢ", name: "reordered episode", description: "Xᵢ와 같은 view들을 다른 순서로 입력한 sample입니다." },
          { symbol: "Fθ", name: "episode predictor", description: "Set 전체에서 class·score처럼 하나의 output을 만드는 함수입니다." },
        ]}
        assumptions={["Task label이 camera slot의 순서가 아니라 view 집합 전체에 붙습니다.", "View ID·pose처럼 실제 의미가 있는 metadata는 각 view와 함께 이동합니다.", "순서별 output을 요구하는 task라면 invariance가 아니라 같은 방식으로 재배열되는 equivariance가 필요합니다."]}
        interpretation="평균 pooling은 순서를 바꿔도 합과 분모가 같아 이 조건을 만족합니다. 반면 feature를 [front, side, top] 순서로 concat하는 model은 slot 의미가 고정된 경우에만 올바른 선택입니다."
      />
    </section>
  );
}
