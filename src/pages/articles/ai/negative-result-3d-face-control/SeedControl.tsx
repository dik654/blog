import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ControlViz from "./viz/ControlViz";

export default function SeedControl() {
  return (
    <section id="seed-control" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">성공처럼 보이던 결과를 대조군 하나가 뒤집었습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          아직 안 써 본 수단이 하나 남아 있었습니다. 원본 픽셀에서 출발시키는 방법은 노이즈 비율이 오르면 제약이 녹지만 매 단계를 조건화하는 방식은 최대 노이즈에서도 제약이 유지됩니다.
        </p>

        <p className="leading-7">
          깊이 신호는 추정하지 않고 직접 뽑았습니다. 렌더 이미지에 깊이 추정기를 돌리면 그 추정기가 "얼굴이란 이렇게 생겼다"는 의견이 있는 두 번째 모델이 되어 측정하려는 누수를 스스로
          만듭니다. 그래서 래스터라이저의 깊이 버퍼에서 바로 꺼내고 윤곽도 픽셀이 아니라 깊이 불연속에서 뽑았습니다.
        </p>

        <p className="leading-7">
          결과가 성공처럼 보였습니다. 프롬프트·시드·샘플러·스텝을 네 얼굴에 완전히 고정하고 제어 맵만 바꿔
          강도를 세 단계로 쓸어 보니 유사도가 단조 감소합니다. 앞의 절벽과 달리 진짜 레버로 보였습니다.
        </p>

        <p className="leading-7">
          여기서 멈췄다면 성공이라고 썼을 것입니다. 최대 강도에서는 육안으로도 네 사람이고 여섯 쌍 중 다섯
          쌍이 다른 인물로 판정됐습니다.
        </p>
      </div>

      <ControlViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          시드를 고정해 둔 것이 검증되지 않은 가정이었습니다. 얼굴형이 유일한 변수처럼 보이게 만든 것이 바로
          그 고정입니다. 그래서 반대로 돌렸습니다. 같은 제어 맵에 시드만 바꿨습니다.
        </p>

        <p className="leading-7">
          얼굴형 넷을 통째로 바꿔 얻은 분리가 0.376이고, 얼굴형 하나를 고정한 채 시드만 넷으로 바꿔 얻은
          분리가 0.346과 0.300입니다. 세 값이 구분되지 않습니다.
        </p>

        <p className="leading-7">
          형태 지표도 같습니다. 얼굴 폭의 편차가 형태 넷에서 4.4퍼센트, 시드 넷에서 4.8퍼센트와
          4.5퍼센트입니다. 형태를 바꿔 얻은 것이 난수를 바꿔 얻는 것과 같은 크기라면, 그건 형태 제어가
          아닙니다.
        </p>

        <p className="leading-7">
          시드를 고정하는 습관이 재현성을 위해서는 옳지만 효과 검증에서는 함정이 될 수 있습니다. 교란을
          제거한 비교 설계는{" "}
          <Link to="/cs/ai/generative-measurement-controls#style-coverage">계측기 검증</Link>이 소유하고,
          여기서는 고정한 변수 자체가 결론을 만든 사례입니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 제어 강도 스윕과 시드 대조군 (2026-09-10, RTX 4090 48GB)"
        citeKey={3}
        href="https://github.com/dik654/blog"
      >
        제어 강도 0.60·0.85·1.00에서 쌍 평균이 0.676·0.376·0.229로 단조 감소했고 다른 인물 판정이 6쌍 중
        0·2·5였습니다. 같은 강도 0.85에서 얼굴형 넷을 바꾼 경우 0.376, 얼굴형을 고정하고 시드만 바꾼 경우
        0.346과 0.300으로 세 값이 구분되지 않았습니다. 얼굴 폭 편차도 형태 4.4퍼센트 대 시드 4.8·4.5퍼센트였습니다.
      </CitationBlock>
    </section>
  );
}
