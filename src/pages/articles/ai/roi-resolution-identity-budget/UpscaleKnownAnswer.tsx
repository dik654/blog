import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import UpscaleViz from "./viz/UpscaleViz";

export default function UpscaleKnownAnswer() {
  return (
    <section id="upscale-known-answer" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">픽셀 오차 지표는 가장 흐린 결과를 1등으로 뽑습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          확대 방법을 고를 때 흔히 "더 선명해 보이는가"로 판단합니다. 그런데 그 판단은 없던 디테일을 지어낸
          것과 원래 있던 것을 되살린 것을 구분하지 못합니다. 확대 모델도 생성 모델이므로 이 구분이 필요합니다.
        </p>

        <p className="leading-7">
          그래서 정답을 아는 실험으로 했습니다. 고해상 원본을 4분의 1로 줄여 각 방법에 복원시키고, 모델이
          본 적 없는 원본과 비교했습니다. 이제 "맞았는가"를 물을 수 있습니다.
        </p>

        <p className="leading-7">
          픽셀 오차 지표가 가장 흐린 결과를 1등으로 뽑았습니다. 보간법은 추측을 거부하기 때문에 평균적으로
          원본에 가깝고, 그래서 이 지표에서 이깁니다. 원본 엣지의 절반 남짓만 복원하면서 1등입니다.
        </p>

        <p className="leading-7">
          사람이 보는 것과 맞는 숫자는 원본 대비 엣지 에너지였습니다. 복원 전용 모델이 1.07배로 사실상 원본
          수준의 디테일을 되살렸고, 확대 사진을 보면 이유가 보입니다. 보간법이 피부를 빈칸으로 두는 자리에
          모공과 머리카락 한 올이 돌아옵니다.
        </p>
      </div>

      <UpscaleViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          이 실험이 하나를 더 걸러 냈습니다. 타일을 나눠 낮은 노이즈 비율로 다시 그리는 방식은 확대가 아니라
          재해석이었습니다. 0.25인데도 정체성이 0.781까지 떨어지고 엣지는 0.63배로 전용 모델보다도 낮습니다.
          되살리는 것이 아니라 매끈하게 다시 그립니다.
        </p>

        <p className="leading-7">
          결과를 도구로 옮길 때 방법 이름이 아니라 목적을 받게 했습니다. 이미 선명한 것을 크게 만들 때, 디테일이
          사라진 것을 되살릴 때, 미리보기를 빠르게 만들 때가 각각 다른 방법으로 갑니다. 마지막 것이 연산 장치를
          쓰지 않는 것은 의도한 선택입니다. 썸네일에 16초를 쓰는 것은 흐린 썸네일보다 나쁜 답입니다.
        </p>

        <p className="leading-7">
          호출하는 쪽에 "최고 품질"이라는 하나의 축을 제시하지 않은 이유도 같습니다. 이 측정에서 품질은 하나의
          축이 아니었습니다. 픽셀 오차로 1등인 방법과 엣지 복원으로 1등인 방법이 다르고, 시간은 0초에서
          16초까지 벌어집니다.
        </p>

        <p className="leading-7">
          답을 아는 입력으로 도구를 검증하는 절차 자체는{" "}
          <Link to="/ai/generative-measurement-controls#overview">계측기 검증</Link>이 소유합니다. 이 절은 그
          절차를 확대 방법 선택에 적용한 사례입니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 정답을 아는 확대 비교 (2026-09-11, RTX 4090 48GB)"
        citeKey={3}
        href="https://github.com/dik654/blog"
      >
        1184×1744 원본을 4분의 1로 줄여 복원시키고 원본과 비교했습니다. 보간법 픽셀 오차 31.2 dB·엣지
        0.55배·정체성 0.979·0초, 확대 전용 29.6·0.73배·0.949·2초, 복원 전용 28.5·1.07배·0.949·16초, 타일
        재생성 27.2·0.63배·0.781·28초였습니다. 한 소스에서의 비교이며 그림체와 열화 방식이 다르면 순위가
        달라질 수 있습니다.
      </CitationBlock>
    </section>
  );
}
