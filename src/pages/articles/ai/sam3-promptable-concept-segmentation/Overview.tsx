import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import PromptShiftViz from "./viz/PromptShiftViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">프롬프트의 단위가 자리에서 이름으로 바뀝니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이전 세대의 Segment Anything은 "여기"를 가리키면 그 자리의 물체 하나를 잘라 줬습니다. 점이나 상자를
          찍으면 마스크 하나가 나오는 구조입니다. SAM 3는 프롬프트를 "노란 스쿨버스" 같은 짧은 명사구로 받고,
          그 개념에 해당하는 모든 인스턴스를 찾아 각각 마스크와 고유 정체성을 함께 돌려줍니다.
        </p>

        <p className="leading-7">
          이 차이는 사용 방식만 바꾸는 것이 아닙니다. 자리를 가리키는 프롬프트는 "거기에 무언가 있다"를 사람이
          이미 확인해 준 상태에서 시작합니다. 이름을 주는 프롬프트는 모델이 먼저 그 개념이 사진에 있는지부터
          판단해야 하고, 있다면 몇 개인지, 서로 다른 개체인지까지 스스로 정해야 합니다.
        </p>

        <p className="leading-7">
          그래서 이 글의 중심 질문은 하나입니다. 찾는 능력과 세는 능력을 한 모델 안에서 어떻게 나눠 맡기고,
          그 결과를 무엇으로 채점하는가입니다. 답의 핵심은 존재 여부만 전담하는 토큰 하나와, 위치 점수와 존재
          점수를 곱으로 결합하는 채점 방식에 있습니다.
        </p>

        <ContentBoundary article="sam3-promptable-concept-segmentation" />

        <p className="leading-7">
          공개 규모도 이 과제 정의에서 나옵니다. 학습·평가용 데이터는 이미지와 영상을 합쳐 400만 개의 고유
          명사구를 담고 있고, 여기에는 일부러 사진에 없는 개념을 붙인 부정 예시가 함께 들어갑니다. 없는 것을
          없다고 답하는 능력이 채점 대상이기 때문입니다.
        </p>

        <p className="leading-7">
          순서는 이렇습니다. 먼저 과제와 채점 지표를 정확히 정의하고, 프롬프트가 이미지 표현을 어떻게 바꾸는지
          본 뒤, 존재 판단을 분리한 토큰을 봅니다. 이어서 영상에서 검출과 추적을 잇는 방식, 마지막으로 이
          규모의 라벨을 만든 방법과 남은 한계로 마무리합니다.
        </p>

        <p className="leading-7">
          분류·검출·분할이 각각 어떤 출력 형태를 약속하는지는{" "}
          <Link to="/cs/ai/vision-task-spatial-contracts#output-shapes">비전 과제의 공간 계약</Link>이, 텍스트로
          영역을 지목하는 일반적인 grounding 개념은{" "}
          <Link to="/cs/ai/multimodal-retrieval-and-visual-grounding">멀티모달 검색과 grounding</Link>이 이미
          설명합니다. 이 글은 그 위에서 개념 단위 분할에만 생기는 문제를 다룹니다.
        </p>
      </div>

      <PromptShiftViz />
    </section>
  );
}
