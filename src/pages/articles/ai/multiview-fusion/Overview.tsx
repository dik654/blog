import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import MultiviewFusionLocator from "./MultiviewFusionLocator";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <MultiviewFusionLocator />
      <h2 className="mb-6 text-2xl font-bold">같은 상품을 찍은 파일부터 한 묶음으로 만듭니다</h2>
      <OverviewViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          검수대에 운동화 한 켤레가 들어왔다고 하겠습니다. 정면 카메라는 RGB와 깊이를,
          나머지 카메라는 측면·밑창·위쪽 사진을 남깁니다. 이 파일들이 모두 같은 상품
          <code>shoe-017</code>을 가리킨다는 사실과 측면 카메라가 응답하지 않았다는 사실까지
          묶어야 모델의 입력 한 건이 완성됩니다. 이 글에서는 이 묶음이 어떻게 하나의
          ‘검수 필요’ 판정으로 바뀌는지 끝까지 따라갑니다.
        </p>
        <p>
          결합 위치는 세 군데입니다. 같은 좌표를 보는 RGB와 깊이는 입력 채널에서 합칠 수
          있습니다. 서로 다른 각도의 사진은 각각 표현을 만든 뒤 합칠 수 있습니다. 사진 속
          위치 관계까지 남기려면 패치 토큰 사이를 attention으로 연결할 수 있습니다. 이 세
          방법은 성능 순위가 아니라 <strong>어떤 관계가 보장되는가</strong>에 따라 갈립니다.
          <Link to="/cs/ai/cnn">CNN 인코더</Link>와 <Link to="/cs/ai/attention-theory">Q·K·V 계산</Link>은
          기존 글을 재사용하고, 여기서는 관측 묶음과 결합 경계만 새로 설명합니다.
        </p>
      </div>
      <ContentBoundary article="multiview-fusion" />
      <ExplainedFormula
        question="관측 수가 상품마다 달라도 입력 한 건을 어떻게 적을 수 있을까?"
        idea={<>관측값만 모으지 않고, 사용할 수 있는지 나타내는 유효성 표시와 좌표·시각·센서 정보를 한 tuple로 묶습니다. 판정값은 개별 사진이 아니라 이 관측 묶음 전체에 붙습니다.</>}
        formula={String.raw`\begin{aligned}
X_i&=\{(x_{iv},m_{iv},c_{iv})\}_{v=1}^{V_i},\\
\hat y_i&=F_\theta(X_i).
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
X_i&=\underbrace{\{(x_{iv},m_{iv},c_{iv})\}_{v=1}^{V_i}}_{\text{관측·유효성·메타데이터 묶음}},\\
\hat y_i&=\underbrace{F_\theta(X_i)}_{\text{관측 묶음 단위 예측}}.
\end{aligned}`}
        operations={[
          { expression: String.raw`\{(x_{iv},m_{iv},c_{iv})\}_{v=1}^{V_i}`, annotation: ["관측 v마다 값 x, 유효성 m, 좌표·시각 c를 함께 기록","관측 수 V_i가 달라도 한 상품 묶음","판정값 y_i는 사진 한 장이 아니라 묶음 전체에 붙음"] },
          { expression: String.raw`F_\theta(X_i)`, annotation: ["가변 개수의 관측을 받아 예측 하나를 출력","자료 분리도 같은 상품이 새지 않도록 식별자 단위로"] },
        ]}
        terms={[
          { symbol: "i,v", name: "묶음과 관측 번호", description: "i는 같은 대상을 묶은 관측 묶음, v는 그 안의 카메라·센서·시점 번호입니다." },
          { symbol: "xᵢᵥ", name: "관측값", description: "v번째 사진, 깊이 지도 또는 인코더가 읽을 원자료입니다." },
          { symbol: "mᵢᵥ", name: "유효성 표시", description: "관측이 실제로 존재하고 사용할 수 있는지 표시합니다. 값 0인 관측과 결측을 구분합니다." },
          { symbol: "cᵢᵥ", name: "관측 메타데이터", description: "카메라 ID·pose·촬영 시각·보정값·품질처럼 관측의 좌표와 의미를 설명합니다." },
          { symbol: "Fθ", name: "결합 예측기", description: "가변 개수의 관측과 메타데이터 묶음을 받아 상품 단위 예측을 만드는 전체 모델입니다." },
        ]}
        assumptions={["하나의 Xᵢ에 들어간 관측은 판정값 yᵢ가 가리키는 같은 대상·사건에 속합니다.", "유효성 표시와 메타데이터는 실제 예측 시점에도 같은 규칙으로 만들 수 있습니다.", "관측 수 Vᵢ가 고정인지 가변인지, 나열 순서가 의미인지 따로 선언합니다."]}
        interpretation="멀티뷰 데이터의 최소 단위는 사진 한 장이 아니라 관측 묶음 Xᵢ입니다. 따라서 학습·검증·시험 자료도 같은 상품의 관측과 파생본이 서로 다른 구간으로 새지 않도록 상품 식별자 단위로 나눕니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          고정 카메라 번호처럼 자리가 의미라면 순서 있는 묶음으로 다루고 카메라 ID를 보존합니다. 반대로
          촬영 순서가 임의인 상품 사진 모음이라면 집합으로 다루며, 나열 순서를 바꿔도 결과가
          같아야 합니다. 이 둘을 구분하지 않으면 data loader가 우연히 정한 파일 순서를 모델이
          의미 있는 신호처럼 외울 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="순서가 없는 관측 집합이라는 말은 모델 출력에 어떤 검사를 요구할까?"
        idea={<>같은 관측을 다른 순서로 나열해도 집합은 같습니다. 그러므로 묶음 전체에 판정 하나를 내는 함수는 어떤 순열을 적용해도 출력이 변하지 않아야 합니다.</>}
        formula={String.raw`\begin{aligned}
X_i'&=\pi X_i,\\
F_\theta(X_i')&=F_\theta(X_i)\quad(\forall\pi).
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
X_i'&=\underbrace{\pi X_i}_{\text{순서만 바꾼 관측 묶음}},\\
F_\theta(X_i')&=\underbrace{F_\theta(X_i)}_{\text{출력 불변}}\quad(\forall\pi).
\end{aligned}`}
        operations={[
          { expression: String.raw`\pi X_i`, annotation: ["관측 내용은 그대로 두고 나열 순서만 변경","[정면, 측면, 위쪽]→[위쪽, 정면, 측면]"] },
          { expression: String.raw`F_\theta(X_i)`, annotation: ["어떤 π를 넣어도 같은 출력이면 집합 처리","평균은 합과 분모가 같아 이 검사를 통과","순서 고정 이어 붙이기는 각 자리의 의미가 고정될 때만 사용"] },
        ]}
        terms={[
          { symbol: "π", name: "순열", description: "관측 내용은 그대로 둔 채 나열 순서만 바꾸는 일대일 재배열입니다." },
          { symbol: "πXᵢ", name: "순서를 바꾼 관측 묶음", description: "Xᵢ와 같은 관측을 다른 순서로 넣은 입력입니다." },
          { symbol: "Fθ", name: "관측 묶음 예측기", description: "관측 집합 전체에서 분류값이나 점수 하나를 만드는 함수입니다." },
        ]}
        assumptions={["과제의 판정값이 카메라 자리 순서가 아니라 관측 집합 전체에 붙습니다.", "카메라 ID·pose처럼 의미 있는 메타데이터는 해당 관측과 함께 이동합니다.", "순서별 출력이 필요한 과제라면 불변성이 아니라 입력과 같은 방식으로 재배열되는 등변성이 필요합니다."]}
        interpretation="평균 pooling은 순서를 바꿔도 합과 분모가 같아 이 조건을 만족합니다. 반면 표현을 [정면, 측면, 위쪽] 순서로 이어 붙이는 모델은 각 자리가 고정된 카메라를 뜻할 때만 올바릅니다."
      />
    </section>
  );
}
