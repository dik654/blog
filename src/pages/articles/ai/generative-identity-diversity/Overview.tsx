import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import DiversityViz from "./viz/DiversityViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 질문에 세 번 다르게 답했고 세 번 다 틀렸습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          서로 다른 인물을 원하는 만큼 만들어 내려면 무엇을 흔들어야 하는가. 이 질문에 회차마다 다른 답을 냈고 매번 다음 측정이 앞의 답을 뒤집었습니다. 결론보다 뒤집힌 과정이 더 쓸모
          있는 기록이라 그대로 남깁니다.
        </p>

        <p className="leading-7">
          첫 답은 "모델당 한 명"이었습니다. 한 모델에서 아무리 뽑아도 새 인물이 나오지 않고 모델을 바꿔야
          달라진다는 결론이었는데, 그 실험은 프롬프트를 고정한 채 시드만 돌린 것이었습니다.
        </p>

        <p className="leading-7">
          둘째 답은 "프롬프트당 한 명"이었습니다. 한 모델에서 여섯 개의 다른 묘사로 만든 여섯 얼굴이 전부 별개 인물로 나왔기 때문입니다. 그런데 여섯 명은 열다섯 쌍이고 열다섯
          쌍으로는 10퍼센트 수준의 충돌률을 볼 수 없습니다.
        </p>

        <p className="leading-7">
          셋째 답은 "묘사 일흔두 개가 실질적으로 여섯 개"였습니다. 규모를 키워 보니 절반 넘게 충돌했고 성별과 나이를 고정하면 셋 중 하나가 같은 사람이었습니다. 이번에는 측정 대상이
          문제였습니다.
        </p>

        <ContentBoundary article="generative-identity-diversity" />

        <p className="leading-7">
          이 글은 그 세 번의 정정을 순서대로 따라가고 마지막에 남은 답을 정리합니다. 영향력은 프롬프트가 가장 크고 그다음이 모델이며 시드는 사실상 0인데, 프롬프트가 닿을 수 있는 범위
          자체를 가중치가 정한다는 것이 결론입니다.
        </p>

        <p className="leading-7">
          정체성 판정 임계값과 계측기의 스타일 적용 범위는{" "}
          <Link to="/cs/ai/generative-measurement-controls">계측기 검증</Link>이, 참조로 정체성을 주입하는
          방식은 <Link to="/cs/ai/reference-identity-pose-separation#attention-injection">정체성과 포즈 분리</Link>가
          소유합니다.
        </p>
      </div>

      <DiversityViz />
    </section>
  );
}
