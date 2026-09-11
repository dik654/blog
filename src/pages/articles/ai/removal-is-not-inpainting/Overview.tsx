import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import RemoveViz from "./viz/RemoveViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">지우기는 인페인팅의 한 종류가 아닙니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          편집 동작을 나눠 전부 돌렸을 때 칸 하나가 통째로 비었습니다. 지우기입니다. 설치된 확산 모델 일곱 개가
          전부 영역을 비우는 대신 그럴듯한 다른 물건을 그려 넣었습니다. 초록 띠를 없애 달라고 하면 버클 달린
          갈색 벨트를 만들어 놓습니다.
        </p>

        <p className="leading-7">
          일곱 개가 같은 방식으로 실패했다는 점이 중요합니다. 모델을 더 좋은 것으로 바꿔 푸는 문제가 아니라
          디노이저라는 도구의 성질이라는 뜻입니다. 마스크를 주고 그 안을 채우라고 하면 채웁니다. "아무것도
          없음"은 채울 수 있는 대상이 아닙니다.
        </p>

        <p className="leading-7">
          이 글은 그 결론에 도달하기까지 디퓨전에 최대한 유리한 조건을 준 과정과 답이 왜 다른 종류의 모델이었는지, 그리고 그 모델을 도구로 만들 때 프롬프트를 받지 않게 설계한 이유를
          다룹니다. 마지막으로 가장 그럴듯해 보였던 2단계 조합이 왜 기각됐는지까지입니다.
        </p>

        <ContentBoundary article="removal-is-not-inpainting" />

        <p className="leading-7">
          판정 근거를 먼저 밝혀 둡니다. 이 회차에는 자동 판정기가 없습니다. 시도한 계측기 둘이 각자의 대조군에서 실패했기 때문입니다. 그래서 성공 판단은 네 그림체 대조표를 눈으로 본
          것과 마스크 밖 변화량 두 가지에 기대고 있습니다. "몇 퍼센트에서 실패하는가" 같은 정량 주장은 하지 않습니다.
        </p>

        <p className="leading-7">
          동작을 나누는 분류와 마스크 확장의 방향은{" "}
          <Link to="/ai/masked-edit-verb-routing">편집 동작과 모델 라우팅</Link>이, 계측기 대조군과 바닥값은{" "}
          <Link to="/ai/generative-measurement-controls">계측기 검증</Link>이 소유합니다.
        </p>
      </div>

      <RemoveViz />
    </section>
  );
}
