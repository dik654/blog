import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TrackerViz from "./viz/TrackerViz";

export default function VideoTracker() {
  return (
    <section id="video-tracker" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">영상에서는 매 프레임의 검출과 기존 궤적을 잇습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          영상 처리는 두 흐름이 만나는 구조입니다. 한쪽은 이전 프레임까지 따라오던 궤적을 현재 프레임으로
          옮기는 추적이고, 다른 쪽은 현재 프레임에서 개념 프롬프트로 새로 찾는 검출입니다. 둘을 겹침 정도로
          맞춰 같은 개체면 정체성을 잇고, 짝이 없는 검출은 새 궤적으로 만듭니다.
        </p>

        <p className="leading-7">
          추적 쪽은 이전 세대의 메모리 구조를 그대로 씁니다. 지나간 프레임에서 그 개체가 어떻게 보였는지를
          메모리에 쌓아 두고, 현재 프레임 특징이 그 메모리를 참조해 마스크를 갱신합니다. 시각 backbone은 고정한
          채 이 부분만 학습하므로 검출기와 같은 특징 위에서 동작합니다.
        </p>

        <p className="leading-7">
          이 구조가 만드는 고유한 실패가 있습니다. 검출은 프레임마다 독립이라 잠깐 놓치면 궤적이 끊기고, 추적은
          한 번 잘못 붙으면 그 오류를 계속 끌고 갑니다. 그래서 두 신호를 맞춰 볼 장치가 따로 필요합니다.
        </p>

        <p className="leading-7">
          하나는 궤적마다 최근 구간에서 검출과 얼마나 자주 짝지어졌는지를 점수로 매기는 것입니다. 오래
          이어졌는데 요즘 검출이 붙지 않는 궤적은 신뢰도를 낮춥니다. 다른 하나는 신뢰도 높은 검출 마스크로
          추적기를 주기적으로 다시 프롬프트해 누적된 편차를 되돌리는 것입니다.
        </p>
      </div>

      <TrackerViz />

      <div className="mt-6">
        <ProgressiveDetail
          title="왜 검출만으로 영상을 처리하지 않나요"
          preview="프레임마다 독립으로 검출하면 마스크는 나오지만 같은 개체라는 정체성이 남지 않습니다. 과제 정의가 정체성을 요구합니다."
        >
          <p className="leading-7">
            개념 프롬프트 분할의 출력에는 마스크뿐 아니라 고유 정체성이 포함됩니다. 프레임별 검출 결과를 이어
            붙이려면 어차피 프레임 사이 대응을 정해야 하고, 그 대응을 겹침만으로 정하면 빠르게 움직이거나 잠시
            가려지는 개체에서 끊깁니다.
          </p>
          <p className="leading-7">
            메모리를 가진 추적기는 가려진 구간을 넘어 같은 개체를 이어 줄 여지를 만듭니다. 대신 메모리가 잘못된
            외형을 학습하면 그 오류가 지속되므로, 앞에서 말한 재프롬프트가 짝으로 필요합니다.
          </p>
          <p className="leading-7">
            영상에서 어떤 구간을 어떻게 뽑아 다루는지는{" "}
            <Link to="/ai/video-clip-sampling">비디오 클립 샘플링</Link>이 다루는 별도 주제이며, 여기서는
            프레임 단위 연결만 설명합니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
