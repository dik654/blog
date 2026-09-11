import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import MetricViz from "./viz/MetricViz";

export default function PcsTask() {
  return (
    <section id="pcs-task" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">없는 개념을 없다고 답하는 것도 과제입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          개념 프롬프트 분할은 짧은 명사구나 예시 상자를 받아 그 개념에 해당하는 모든 인스턴스의 마스크와
          정체성을 내놓는 과제입니다. 여기서 "모든"과 "없으면 없다"가 둘 다 채점 대상입니다. 하나만 잘하면
          점수가 오르지 않도록 지표가 설계돼 있습니다.
        </p>

        <p className="leading-7">
          학습과 평가 데이터에는 사진에 실제로 없는 개념을 일부러 붙인 쌍이 들어갑니다. 어려운 부정 예시라고
          부르는 이 쌍이 없으면 모델은 무엇을 물어보든 그럴듯한 영역을 찾아내는 쪽으로 기울고, 실제 사용에서는
          그 습관이 곧바로 거짓 검출이 됩니다.
        </p>

        <p className="leading-7">
          평가 단위는 이미지와 명사구의 쌍입니다. 같은 사진이라도 물어본 개념이 다르면 다른 문항이고, 문항마다
          정답 마스크가 0개일 수도 여러 개일 수도 있습니다. 이 구조 때문에 위치 정확도와 존재 판단을 한 숫자로
          합치는 방식이 필요해집니다.
        </p>
      </div>

      <TermBreakdown
        title="이 과제에서 프롬프트가 될 수 있는 것"
        description="세 가지를 섞어 쓸 수 있고, 무엇을 주느냐에 따라 모델이 켜는 경로가 달라집니다."
        items={[
          {
            term: "짧은 명사구",
            description: "'줄무늬 고양이'처럼 개념을 가리키는 짧은 구입니다. 문장이 아니라 구 단위입니다.",
            example: "같은 사진에 같은 개념의 개체가 다섯이면 마스크 다섯 개와 서로 다른 정체성이 나옵니다.",
            boundary: "길고 복잡한 지시문을 처리하는 과제가 아닙니다. 관계나 조건이 들어간 표현은 범위 밖입니다.",
          },
          {
            term: "이미지 예시",
            description: "사진 안의 상자 하나를 긍정 또는 부정 예시로 주는 방식입니다.",
            example: "찾고 싶은 물체 하나를 상자로 지목하면 같은 종류를 모두 찾습니다.",
            boundary: "예시는 개념을 좁히는 신호이지 그 상자 안만 분할하라는 뜻이 아닙니다.",
          },
          {
            term: "점·상자 지목",
            description: "이전 세대와 같은 방식으로 특정 인스턴스 하나를 지목하는 프롬프트입니다.",
            example: "한 개체만 다듬고 싶을 때 씁니다.",
            boundary: "이 경로에서는 개념 존재 판단이 필요 없으므로 뒤에서 볼 존재 토큰을 쓰지 않습니다.",
          },
        ]}
      />

      <h3 id="cg-f1" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        위치 점수와 존재 점수를 곱해서 채점합니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          지표는 두 층으로 나뉩니다. 정답 마스크가 하나 이상 있는 문항에서 얼마나 잘 찾았는지를 재는 위치 지표와,
          개념이 있는지 없는지를 맞혔는지 재는 존재 지표입니다. 둘을 더하지 않고 곱하는 것이 핵심입니다.
        </p>

        <p className="leading-7">
          더하면 한쪽을 포기하고 다른 쪽으로 벌충할 수 있습니다. 무엇을 물어보든 마스크를 잔뜩 내놓는 모델은
          위치 지표에서 점수를 얻고 존재 지표에서 잃는데, 합으로 채점하면 순위가 뒤집히기 어렵습니다. 곱하면
          한쪽이 0에 가까울 때 전체가 0에 가까워집니다.
        </p>
      </div>

      <ExplainedFormula
        question="개념 단위 분할을 하나의 점수로 어떻게 만듭니까"
        idea="정답이 있는 문항에서의 위치 정확도와 있음·없음 판단의 상관계수를 곱해, 한쪽만 잘해서는 점수가 오르지 않게 만듭니다."
        formula={String.raw`\mathrm{cgF1} = 100 \times \mathrm{pmF1} \times \mathrm{IL\_MCC}`}
        annotatedFormula={String.raw`\mathrm{cgF1} = 100 \times \underbrace{\mathrm{pmF1}}_{\text{정답이 있는 문항의 위치 정확도}} \times \underbrace{\mathrm{IL\_MCC}}_{\text{있음·없음 판단}}`}
        operations={[
          {
            expression: String.raw`\mathrm{pmF1}`,
            annotation: [
              "정답 마스크가 하나 이상인 문항만 모아 계산한 micro F1입니다",
              "정답이 없는 문항은 여기 들어가지 않습니다",
            ],
          },
          {
            expression: String.raw`\mathrm{IL\_MCC}`,
            annotation: "문항마다 개념이 있었는지를 맞혔는지 보는 이진 판정의 상관계수이며 범위는 -1에서 1입니다",
          },
          {
            expression: String.raw`\mathrm{pmF1} \times \mathrm{IL\_MCC}`,
            annotation: "곱이므로 존재 판단이 무작위 수준이면 위치가 아무리 정확해도 전체 점수가 0으로 내려갑니다",
          },
        ]}
        terms={[
          { symbol: "cgF1", name: "개념 단위 종합 점수", description: "두 지표의 곱을 100배 한 값입니다." },
          { symbol: "pmF1", name: "양성 문항 micro F1", description: "정답 마스크가 있는 문항에서의 검출·분할 정확도입니다." },
          { symbol: "IL_MCC", name: "이미지 수준 상관계수", description: "있음·없음 이진 판정의 Matthews 상관계수입니다." },
        ]}
        assumptions={[
          "예측은 신뢰도 0.5를 넘는 것만 평가에 들어갑니다.",
          "한 문항은 이미지와 명사구의 쌍이며 정답 마스크 수는 0개일 수 있습니다.",
        ]}
        interpretation="이 지표가 높다는 것은 찾는 능력과 참는 능력이 함께 있다는 뜻입니다. 다만 두 지표를 곱으로 합쳤으므로 어느 쪽이 약한지는 값 하나만 봐서는 알 수 없고, 분해해서 봐야 합니다."
      />

      <MetricViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          평가 층을 나눠 보는 습관 자체는 이 과제만의 것이 아닙니다. 확률 예측과 임계값 결정을 분리해 보는
          일반 원칙은 <Link to="/ai/classification-metrics">분류 지표</Link>에서 다루며, 여기서는 그 분리가
          위치와 존재라는 두 축으로 나타난 형태입니다.
        </p>
      </div>
    </section>
  );
}
