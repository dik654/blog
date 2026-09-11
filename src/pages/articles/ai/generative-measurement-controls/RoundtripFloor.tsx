import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FloorViz from "./viz/FloorViz";

export default function RoundtripFloor() {
  return (
    <section id="roundtrip-floor" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">마스크 밖 변화량은 모델이 아니라 오토인코더를 재고 있었습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          마스크를 주고 그 안만 바꾸라고 했을 때, 모델이 약속을 지켰는지는 마스크 밖 픽셀의 평균 변화량으로
          잽니다. 저는 이 숫자를 모델의 미덕으로 여러 문서에 인용했습니다. 어떤 모델이 0.6이고 어떤 모델이
          2.8이니 앞쪽이 덜 침범한다는 식이었습니다.
        </p>

        <p className="leading-7">
          그런데 잠재 공간에서 도는 확산 편집은 입력 이미지 전체를 오토인코더로 압축하고 출력 전체를 다시
          복원합니다. 복원은 손실이 있는 연산이라, 아무것도 바꾸라고 하지 않은 자리에서도 픽셀이
          달라집니다. 그러면 마스크 밖 숫자에는 모델이 한 일과 압축·복원이 한 일이 섞여 있습니다.
        </p>

        <p className="leading-7">
          섞인 양을 재는 방법은 간단합니다. 샘플링도 프롬프트도 마스크도 없이 인코딩하고 디코딩만 해서 그
          차이를 보면 됩니다. 그 값이 모든 마스크 밖 수치의 바닥입니다. 그보다 작은 값은 무동작과 구별되지
          않습니다.
        </p>
      </div>

      <FloorViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          결과가 열 하나를 통째로 무효화했습니다. 제가 기록한 침범 0.6·0.7·1.0·2.0·2.8·2.9는 각 모델이 쓰는
          오토인코더의 바닥값 0.60·0.60·0.94·2.11·2.75·2.75와 거의 같았습니다. 차감하면 실제 누출은 전 모델
          0.00에서 0.15 사이로 사실상 동일합니다.
        </p>

        <p className="leading-7">
          즉 일곱 모델 전부 마스크를 잘 지키고 있었고 제가 매긴 순위는 실력 차이가 아니라 어느 오토인코더를 로드하는지였습니다. 같은 오토인코더를 공유하는 모델들끼리 값이 붙어 있었다는
          사실을 진작 이상하게 봤어야 했습니다.
        </p>

        <p className="leading-7">
          감사하는 도중에 제 감사가 한 번 틀릴 뻔했습니다. 처음엔 별도의 스타일 소스 네 장으로 바닥값을 쟀는데,
          같은 오토인코더가 애니에서 1.01이고 3D에서 2.88이었습니다. 바닥값이 이미지에 크게 의존한다는
          뜻이라, 다른 그림의 바닥값을 빼는 건 지금 감사하는 실수를 반복하는 것입니다. 폐기하고 원래 표가 실제로
          쓴 두 장에서 다시 쟀습니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 오토인코더 왕복 바닥값 (2026-09-11, RTX 4090 48GB)"
        citeKey={2}
        href="https://github.com/dik654/blog"
      >
        샘플링·프롬프트·마스크 없이 인코딩과 디코딩만 수행해 마스크 밖 평균 절대 변화를 측정했습니다. 표가
        실제로 쓴 두 소스에서 오토인코더별로 0.60·0.94·2.11·2.75(전신 프레임), 1.18·1.83·2.74·3.84(얼굴
        프레임)였고, 별도의 네 스타일 소스에서는 같은 오토인코더가 0.49에서 2.88까지 흩어졌습니다. 바닥값은
        이미지에 의존하므로 다른 그림에서 잰 값을 차감하면 안 됩니다.
      </CitationBlock>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          살아남은 수치와 죽은 수치가 갈립니다. 모델 간 침범 비교는 전부 무효가 됐고 마스크 안 변화량은 바닥값이 마스크 밖에만 해당하므로 그대로 삽니다. 오토인코더를 거치지 않는 제거
          모델의 수치도 그대로이고 같은 모델·같은 소스로 두 번 돌려 그 차이를 본 값도 바닥값이 상쇄되어 살아남습니다.
        </p>

        <p className="leading-7">
          이 구분이 다음 절의 주제로 이어집니다. 차이를 재는 지표는 이런 오염에 면역이고 절대값을 재는 지표는
          취약합니다. 오토인코더의 압축과 복원이 왜 손실을 만드는지는{" "}
          <Link to="/ai/vae#vae-loss">VAE</Link>가 소유하며, 이 절은 그 손실이 편집 벤치마크의 한 열을 어떻게
          오염시키는지만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
