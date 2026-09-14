import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import WindingViz from "./viz/WindingViz";

export default function WindingBug() {
  return (
    <section id="winding-bug" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">추측을 멈추고 숫자를 재자 진짜 버그가 나왔습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          2차 메쉬는 부속물을 전부 없애고 구체 하나의 정점을 밀고 당겨 만들었습니다. 눈은 실제로 파인 홈이고
          눈썹은 물체가 아닌 융기이며 턱은 같은 두개골의 테이퍼입니다. 그런데 렌더하면 특징 없는 매끈한
          덩어리만 나왔습니다.
        </p>

        <p className="leading-7">
          변형 진폭이 부족하다고 보고 두 번 키웠습니다. 그대로였습니다. 세 번째로 키우기 전에 멈추고 숫자를
          재기로 했습니다.
        </p>

        <p className="leading-7">
          두 가지를 쟀습니다. 먼저 코가 실제로 존재하는지 — 중심선의 최대 깊이가 1.181이고 옆면이 0.850이니
          코는 분명히 있었습니다. 그다음 그 면들이 카메라를 향하는지 — 앞쪽에 있는 면 5,986개 중 법선이
          카메라를 향한 것이 0개였습니다.
        </p>

        <p className="leading-7">
          면 감김 순서가 뒤집혀 있었습니다. 래스터라이저가 앞면을 버리고 뒤통수 안쪽을 그리고 있었던
          것입니다. 진폭을 아무리 키워도 보일 리가 없었습니다.
        </p>
      </div>

      <WindingViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          더 중요한 것은 1차 메쉬도 같은 버그였다는 점입니다. 조립식이라 각 부품의 뒷면 실루엣이 우연히
          얼굴처럼 보였을 뿐이었습니다. 1차 결과를 정상으로 여기고 그 위에 해석을 쌓고 있었습니다.
        </p>

        <p className="leading-7">
          여기서 배운 것은 두 가지입니다. 하나는 눈으로 봤을 때 "그럴듯한" 것이 정상이라는 증거가 아니라는
          것이고, 다른 하나는 같은 조정을 두 번 했는데 변화가 없으면 세 번째로 넘어가지 말고 재야 한다는
          것입니다.
        </p>

        <p className="leading-7">
          이 습관이 이 시리즈 전체에서 반복됩니다. 답을 아는 입력을 계측기에 통과시키는 절차는{" "}
          <Link to="/cs/ai/generative-measurement-controls#overview">계측기 검증</Link>이 소유하고, 여기서는
          그 절차가 렌더링 파이프라인에도 똑같이 적용된 사례입니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 메쉬 법선 방향 진단 (2026-09-10, RTX 4090 48GB)"
        citeKey={1}
        href="https://github.com/dik654/blog"
      >
        중심선 최대 깊이 1.181과 옆면 0.850으로 코 형태가 존재함을 확인했고, 카메라 쪽에 있는 면 5,986개 중
        법선이 카메라를 향한 것이 0개여서 면 감김 순서가 뒤집혀 있음을 특정했습니다. 1차 조립식 메쉬도 같은
        버그였으며 부품별 뒷면 실루엣이 우연히 얼굴처럼 보였습니다.
      </CitationBlock>
    </section>
  );
}
