import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ShapeViz from "./viz/ShapeViz";

export default function ShapeSurvival() {
  return (
    <section id="shape-survival" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">더 조잡한 메쉬가 형태를 더 잘 보존했습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          감김 순서를 고치자 2차 메쉬에서 눈두덩과 코와 입과 눈썹 융기가 보이기 시작했습니다. 네 형태도
          여전히 뚜렷이 구분됩니다. 그런데 사진으로 바꾸고 나니 결과가 서로 수렴했습니다.
        </p>

        <p className="leading-7">
          역설적으로 훨씬 조잡했던 1차 조립식 메쉬가 형태를 더 잘 보존했습니다. 실루엣과 비율이 확실히
          살아남아 하나는 넓고 둥글게, 다른 하나는 길고 좁게 나왔습니다.
        </p>

        <p className="leading-7">
          대신 다른 대가를 치렀습니다. 턱 타원체가 콧수염처럼, 눈썹 상자가 검은 막대로 그대로 복사됐습니다.
          모델 탓이 아니라 머리에 부속물이 붙어 있는 메쉬 탓입니다.
        </p>

        <p className="leading-7">
          설명은 단순합니다. 극단적인 실루엣은 모델에게 선택지를 주지 않습니다. 부드럽게 다듬어진 형태는 모델의 사전이 개입할 여지가 생기고 그 사전이 평균 쪽으로 끌어당깁니다.
        </p>
      </div>

      <ShapeViz />

      <ExplainedFormula
        question="3차원에서 벌려 놓은 차이가 출력에 얼마나 남습니까"
        idea="입력 형태들 사이의 상대 편차와 출력 형태들 사이의 상대 편차를 같은 지표로 재서 나누면, 그 기하 신호가 파이프라인을 통과하며 얼마나 감쇠했는지가 나옵니다."
        formula={String.raw`\eta = \frac{\mathrm{CV}_{\text{out}}}{\mathrm{CV}_{\text{in}}}, \quad \mathrm{CV} = \frac{\sigma}{\mu}`}
        annotatedFormula={String.raw`\eta = \frac{\overbrace{\mathrm{CV}_{\text{out}}}^{\text{출력 형태들의 상대 편차}}}{\underbrace{\mathrm{CV}_{\text{in}}}_{\text{3차원 입력의 상대 편차}}}`}
        operations={[
          {
            expression: String.raw`\mathrm{CV}_{\text{in}} = 64.8\%`,
            annotation: [
              "네 3차원 얼굴의 폭 대 높이 비를 일부러 크게 벌려 놓은 값입니다",
              "눈으로도 명백히 다른 형태들입니다",
            ],
          },
          {
            expression: String.raw`\mathrm{CV}_{\text{out}} = 1.6\%`,
            annotation: "사진으로 바뀐 뒤 같은 지표를 다시 재면 이만큼만 남습니다",
          },
          {
            expression: String.raw`\eta \approx 0.025`,
            annotation: "기하 변화의 약 97퍼센트가 사라졌다는 뜻입니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\mathrm{CV}`, name: "변동 계수", description: "표준편차를 평균으로 나눈 상대 편차입니다." },
          { symbol: String.raw`\eta`, name: "신호 전달률", description: "입력의 형태 차이가 출력에 남은 비율입니다." },
        ]}
        assumptions={[
          "폭 대 높이 비 하나로 형태 차이를 대표할 수 있다고 가정합니다. 다른 지표에서는 전달률이 다를 수 있습니다.",
          "네 얼굴 표본이라 편차 추정이 거칠습니다. 순위가 아니라 자릿수를 읽는 용도입니다.",
        ]}
        interpretation="식이 말하는 것은 이 경로가 형태를 조금 약하게 전달하는 것이 아니라 사실상 전달하지 못한다는 점입니다. 남은 2.5퍼센트는 다음 절에서 보듯 시드 노이즈와 구분되지 않는 크기입니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          얼굴 임베딩으로도 같은 결론이 나옵니다. 네 결과의 여섯 쌍을 재니 최솟값이 0.728이었습니다. 판정 임계값의 두 배 근처라 얼굴 인식 시스템에 넣으면 넷 다 같은 사람으로
          등록됩니다.
        </p>

        <p className="leading-7">
          처음에 이걸 "부분 성공"이라고 적었는데 후한 판정이었습니다. 사전에 세운 합격 기준은 넷이 모두
          구분되는 것이었고, 여섯 쌍 전부가 같은 사람으로 나오는 결과는 그 기준에 명확히 미달합니다.
        </p>

        <p className="leading-7">
          다음 지렛대로 원본 픽셀에서 출발시키는 방법을 시도했지만 이 모델에서는 레버가 아니라 절벽이었습니다.
          중간값에서는 변환 자체가 일어나지 않고 최대값에서만 사진이 되는데, 거기서는 형태가 사라집니다.
          모델 종류에 따라 이 파라미터의 성질이 다르다는 점은{" "}
          <Link to="/cs/ai/roi-resolution-identity-budget#denoise-window">해상도 예산</Link>이 소유합니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 형태 신호 전달률과 정체성 (2026-09-10, RTX 4090 48GB)"
        citeKey={2}
        href="https://github.com/dik654/blog"
      >
        네 3차원 얼굴의 폭 대 높이 비 편차 64.8퍼센트가 출력에서 1.6퍼센트로 줄었습니다. 결과 네 장의 여섯 쌍
        정체성이 0.728에서 0.910 사이로 전부 같은 사람 범위였습니다. 네 얼굴 표본이라 편차 추정이 거칠고
        자릿수를 읽는 용도입니다.
      </CitationBlock>
    </section>
  );
}
