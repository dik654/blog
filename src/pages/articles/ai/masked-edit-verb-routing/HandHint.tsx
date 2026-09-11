import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import HintViz from "./viz/HintViz";

export default function HandHint() {
  return (
    <section id="hand-hint" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">손으로 그은 선을 살리는 모델은 하나뿐이었습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          없던 것을 더하는 동작에는 두 가지 방식이 있습니다. 말로 설명해 모델이 만들어 내게 하거나, 대충 선을
          그려 주고 그것을 사진처럼 바꾸라고 하거나. 포토샵을 쓰는 사람이 실제로 하는 것은 후자인데, 모델이
          그 선을 실제로 참고하는지는 확인해 본 적이 없었습니다.
        </p>

        <p className="leading-7">
          확인 방법은 같은 모델에 두 번 돌리는 것입니다. 한 번은 힌트 없이, 한 번은 뺨에 거친 선을 그어 준
          채로. 나머지는 전부 같게 두면 두 값의 차이가 곧 그 모델이 드로잉에서 가져간 양입니다.
        </p>

        <p className="leading-7">
          이 설계에는 부수적인 이점이 있습니다. 같은 모델·같은 소스로 두 번 돌린 값의 차이라 공통 오염항이 상쇄됩니다. 오토인코더가 만드는 바닥값이 두 실행에 똑같이 들어가므로 빼면
          사라집니다. 절대값 비교가 무효화된 이 표에서 유일하게 그대로 살아남는 수치입니다.
        </p>
      </div>

      <HintViz />

      <ExplainedFormula
        question="모델이 드로잉을 참고했는지 어떻게 압니까"
        idea="같은 조건에서 힌트만 넣고 뺀 두 실행의 차이를 보면, 두 실행에 공통으로 들어가는 오염항이 상쇄되고 드로잉이 기여한 양만 남습니다."
        formula={String.raw`\Delta_m = A_m^{\text{hint}} - A_m^{\text{plain}}`}
        annotatedFormula={String.raw`\Delta_m = \underbrace{A_m^{\text{hint}}}_{\text{선을 그어 준 실행}} - \underbrace{A_m^{\text{plain}}}_{\text{같은 조건, 힌트 없음}}`}
        operations={[
          {
            expression: String.raw`A_m = \frac{1}{|M|}\sum_{p \in M} |y_p - x_p|`,
            annotation: [
              "마스크 M 안에서 출력과 입력의 평균 절대 차이입니다",
              "단위는 8비트 채널 기준 /255입니다",
            ],
          },
          {
            expression: String.raw`A^{\text{hint}} - A^{\text{plain}}`,
            annotation: [
              "두 실행에 공통으로 들어가는 오토인코더 왕복 오차가 상쇄됩니다",
              "남는 것은 드로잉이 결과에 기여한 양뿐입니다",
            ],
          },
          {
            expression: String.raw`\Delta_m \approx 0`,
            annotation: "그 모델이 그어 준 선을 사실상 무시했다는 뜻입니다",
          },
        ]}
        terms={[
          { symbol: "M", name: "마스크", description: "편집이 허용된 픽셀 집합입니다." },
          { symbol: String.raw`A_m`, name: "마스크 안 변화량", description: "그 영역이 얼마나 달라졌는지입니다." },
          { symbol: String.raw`\Delta_m`, name: "힌트 기여", description: "드로잉을 넣고 뺀 두 실행의 차이입니다." },
        ]}
        assumptions={[
          "두 실행이 힌트 외에는 완전히 같다고 가정합니다. 시드·스케줄·해상도가 하나라도 다르면 상쇄가 성립하지 않습니다.",
          "차이가 크다는 것이 그린 대로 나왔다는 뜻은 아닙니다. 크기만 재는 값이라 방향은 그림으로 확인해야 합니다.",
        ]}
        interpretation="식이 말하는 것은 차이를 재는 비교가 절대값 비교보다 오염에 강하다는 점입니다. 같은 표의 다른 열이 오토인코더 차이로 무효화됐는데도 이 열은 그대로 쓸 수 있는 이유가 여기 있습니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          결과는 한 모델만 뚜렷합니다. 절제형 모델이 10.26에서 12.13으로 +1.87을 냈고 다섯 모델은 −0.13에서 +0.16 사이로 사실상 0이었습니다. 그림으로 확인하면 이
          차이가 무엇인지 분명합니다. 그 모델에서만 그어 준 선이 아문 흉터의 모양을 따라가고 나머지는 선을 지우고 자기 방식대로 다시 그립니다.
        </p>

        <p className="leading-7">
          여기서 원본 기록의 수치 하나를 바로잡습니다. 저는 이 결과를 "한 모델만 +1.9이고 나머지는 ±0.2"로
          적어 뒀는데, 다시 계산하니 보수형 모델이 4.46에서 5.51로 +1.05였습니다. 다섯 모델이 ±0.2인 것은
          맞지만 여섯 번째는 아니었습니다.
        </p>

        <p className="leading-7">
          다만 이 +1.05는 해석이 다릅니다. 두 값 모두 그 모델의 무동작 범위 안에 있어서 움직인 그림에 선이 더해진 것이 아니라 거의 아무것도 하지 않는 상태에서 조금 덜 아무것도
          하지 않은 것에 가깝습니다. 절제형 모델의 +1.87은 10.26이라는 실제로 변한 바닥 위에서 얻은 값이라 성격이 다릅니다.
        </p>

        <p className="leading-7">
          그래도 "나머지 ±0.2"라는 요약은 틀렸으므로 고칩니다. 이 수정 자체가 이 시리즈의 방법론과 같은
          모양입니다 — 요약을 믿지 말고 원본 값을 다시 계산해 보는 것입니다. 차분 지표의 오염 내성은{" "}
          <Link to="/ai/generative-measurement-controls#roundtrip-floor">계측기 검증</Link>이 소유합니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 손 힌트 유무 A/B (2026-09-11, RTX 4090 48GB)"
        citeKey={2}
        href="https://github.com/dik654/blog"
      >
        같은 모델·소스·마스크·프롬프트·시드로 힌트 유무만 바꿔 일곱 모델을 각각 두 번 실행했습니다. 마스크 안
        변화량 차이는 절제형 +1.87, 보수형 +1.05, 나머지 다섯은 −0.13에서 +0.16이었습니다. 차이의 크기만
        재는 값이므로 그린 대로 나왔는지는 그림으로 따로 확인해야 합니다.
      </CitationBlock>
    </section>
  );
}
