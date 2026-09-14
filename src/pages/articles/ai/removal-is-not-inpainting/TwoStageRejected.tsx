import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import TwoStageViz from "./viz/TwoStageViz";

export default function TwoStageRejected() {
  return (
    <section id="two-stage-rejected" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">싼 모델로 지우고 비싼 모델로 다시 그리는 조합은 기각했습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          전용 망은 구멍을 비우지만 그 안의 질감을 뭉갭니다. 그러면 지우기는 전용 망에 맡기고 다시 그리기만
          확산 모델에 넘기면 깨끗해지지 않을까. 자연스러운 생각이고 커뮤니티에도 이 조합이 돌아다닙니다.
          그대로 배선해 네 그림체 전부에서 쟀습니다.
        </p>

        <p className="leading-7">
          단순히 붙이면 실패한다는 건 이미 알고 있었습니다. 전용 망이 남긴 매끈한 면을 확산 모델이 보면 "여기
          뭔가 있어야 한다"는 사전지식이 작동합니다. 일곱 모델이 전부 띠 자리에 벨트를 만들어 넣었던 그
          사전지식입니다.
        </p>

        <p className="leading-7">
          그래서 다시 그리기가 구멍을 채우지 못하게 막는 문을 세 가지로 놓고 문 자체를 비교했습니다. 구멍
          전체를 여는 것, 경계 띠만 여는 것, 경계 띠에 마스크 값으로 시작 시각을 픽셀마다 다르게 주는 것입니다.
          세 번째는 이론상 경계만 보고 안쪽은 건드릴 수 없어야 합니다.
        </p>
      </div>

      <TwoStageViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          그림이 숫자를 뒤집었습니다. 세 번째 문을 적용한 3D 결과가 마스크 안 변화 93.2로 전 팔 중 가장 높게
          나왔습니다. 가장 철저히 지운 것처럼 읽히는 숫자인데, 확대해 보면 흰 띠를 새로 만들어 붙인 것이었습니다.
          지운 물건을 되살린 결과가 최고점을 받은 셈입니다.
        </p>

        <p className="leading-7">
          왜 막지 못했는지도 분명합니다. 이 방식은 어디를 바꿀지는 강제하지만 무엇을 그릴지는 강제하지 않습니다. 경계 띠에서 시작한 생성이 안쪽으로 번질 여지가 남아 있었습니다. 그
          여지를 사전지식이 채웠습니다.
        </p>

        <p className="leading-7">
          나머지 팔에서는 반대 문제가 나왔습니다. 구멍 전체를 연 것과 경계 띠만 연 것의 마스크 안 변화량이
          소수점 첫째 자리까지 같습니다. 문을 좁혔는데 결과가 그대로라는 것은 그 문이 결과에 아무 영향을 주지
          않았다는 뜻입니다.
        </p>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          실행 전에 스크립트 주석에 예측을 적어 뒀습니다. "이음새는 애초에 이 모델의 문제가 아니다. 눈에 보이는
          약점은 구멍 안의 뭉개진 질감이고, 이음새만 여는 문은 구조적으로 거기 닿을 수 없다. 숫자가 좋아지는데
          질감이 그대로면 정직한 해석은 고장나지 않은 것을 고쳤다는 것이다."
        </p>

        <p className="leading-7">
          그대로 됐습니다. 이 절차가 없었다면 "경계 띠 게이트가 마스크 밖 변화를 줄였다"는 그럴듯한 결론을 쓸 수도 있었습니다. 실제로 바닥값을 차감하면 다시 그리기가 마스크 밖으로
          새는 양은 0.04에서 0.33으로 사실상 0이라 그 방향으로 읽을 근거가 숫자에는 있었습니다.
        </p>

        <p className="leading-7">
          결론은 열두 칸 전부에서 전용 망 단독보다 나은 칸이 없다는 것입니다. 더 좋아지지 않으면서 시간은 두 배에서 여덟 배가 되고 한 칸에서는 지운 물건이 돌아왔습니다.
        </p>

        <p className="leading-7">
          기각의 범위는 좁게 적습니다. 다시 그리기에 쓴 것이 증류된 빠른 모델이라, 여기서 기각된 것은 정확히는
          "싼 모델로 지우고 또 싼 모델로 다시 그리기"입니다. 마스크 밖 변화량을 바닥값으로 나눠 읽는 방법은{" "}
          <Link to="/cs/ai/generative-measurement-controls#roundtrip-floor">계측기 검증</Link>이 소유합니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 2단계 조합의 세 가지 게이트 (2026-09-11, RTX 4090 48GB)"
        citeKey={3}
        href="https://github.com/dik654/blog"
      >
        네 그림체 × 세 게이트 열두 칸에서 전용 망 단독보다 나은 칸이 없었습니다. 구멍 전체를 연 팔과 경계 띠만
        연 팔의 마스크 안 변화량이 소수점 첫째 자리까지 같았고(38.3/38.3·33.0/33.0·61.3/61.5·56.0/56.1),
        마스크 값으로 시작 시각을 나눈 팔은 3D에서 93.2로 가장 높았으나 띠를 새로 그린 결과였습니다. 시간은
        단독 1~3초에서 5~20초가 됐습니다.
      </CitationBlock>
    </section>
  );
}
