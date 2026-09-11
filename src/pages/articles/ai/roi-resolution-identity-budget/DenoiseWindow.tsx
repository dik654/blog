import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import WindowViz from "./viz/WindowViz";

export default function DenoiseWindow() {
  return (
    <section id="denoise-window" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">노이즈 비율이 레버인 모델과 절벽인 모델이 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          원본을 얼마나 남길지 정하는 값은 직관적으로 연속적인 손잡이처럼 보입니다. 조금 낮추면 조금 더
          남고, 조금 올리면 조금 더 바뀔 것 같습니다. 실제로는 모델 종류에 따라 완전히 다르게 동작합니다.
        </p>

        <p className="leading-7">
          지시를 받아 편집하도록 학습된 모델에서는 레버가 아니라 절벽입니다. 0.55와 0.75에서는 변환 자체가
          일어나지 않고 원본이 살짝 부드러워질 뿐이며, 1.0에서만 결과가 나옵니다. 부분적으로 섞는 구간이
          없습니다.
        </p>

        <p className="leading-7">
          이 모델들은 일반적인 이미지 대 이미지 변환기가 아니라 지시 편집기라서, 부분 노이즈가 원본 잠재를
          거의 그대로 남깁니다. 그래서 중간값이 "조금 변환"이 아니라 "변환 안 함"이 됩니다.
        </p>

        <p className="leading-7">
          일반 생성 모델에서는 레버가 맞습니다. 다만 창이 좁습니다. 한 모델은 0.25에서만 정체성을 지키고
          0.40에서 이미 다른 사람이 됐습니다. 다른 모델은 0.40까지 버텼고 0.55에서 무너졌습니다.
        </p>
      </div>

      <WindowViz />

      <TermBreakdown
        title="두 종류의 모델과 그에 맞는 사용법"
        description="같은 파라미터가 다른 의미를 갖습니다. 종류를 먼저 확인해야 설정이 의미를 가집니다."
        items={[
          {
            term: "지시 편집 모델",
            description: "무엇을 바꿀지 문장으로 받아 편집하도록 학습됐습니다.",
            example: "카메라를 뒤로 돌리라는 지시를 이해하고 뷰를 바꿉니다.",
            boundary: "부분 노이즈가 레버로 동작하지 않습니다. 중간값은 변환 자체를 막습니다.",
          },
          {
            term: "일반 생성 모델",
            description: "프롬프트에서 이미지를 만들며 부분 노이즈로 원본을 섞을 수 있습니다.",
            example: "게임 그림 느낌의 패널을 사진 질감으로 바꾸는 데 쓸 수 있습니다.",
            boundary: "쓸 수 있는 창이 좁고 모델마다 다릅니다. 창 밖에서는 인물이 바뀝니다.",
          },
          {
            term: "확대 전용 모델",
            description: "저해상에서 고해상을 복원하도록 학습됐습니다.",
            example: "패널을 두 배로 올릴 때 인물 변화가 거의 없습니다.",
            boundary: "복원이지 창작이 아니므로 없던 디테일을 요구하면 안 됩니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          창의 폭이 모델 선택 기준이 됩니다. 두 일반 생성 모델을 같은 패널에 같은 조건으로 걸어 보면, 0.25에서
          0.531과 0.683, 0.40에서 0.237과 0.490으로 갈립니다. 뒤쪽 모델이 창도 넓고 정체성도 더 남깁니다.
        </p>

        <p className="leading-7">
          여기서 앞 글의 결론 하나를 좁힙니다. 지시 편집 모델에서 노이즈 비율이 절벽이라는 관찰을 두고 "이
          파라미터는 레버가 아니다"라고 일반화했는데, 그건 그 모델 종류에 대한 이야기였습니다. 일반 생성
          모델에서는 레버가 맞고 다만 창이 좁습니다.
        </p>

        <p className="leading-7">
          편집 동작을 어느 모델로 보낼지의 표는{" "}
          <Link to="/ai/masked-edit-verb-routing#routing-gate">편집 동작과 모델 라우팅</Link>이 소유합니다.
          이 절은 그 표에 들어가는 값 중 노이즈 비율의 유효 구간만 다뤘습니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 노이즈 비율 스윕 (2026-09-11, RTX 4090 48GB)"
        citeKey={2}
        href="https://github.com/dik654/blog"
      >
        지시 편집 모델에서 0.55와 0.75는 변환이 일어나지 않고 1.0에서만 결과가 나왔습니다. 일반 생성 모델
        둘을 같은 얼굴 패널에 걸었을 때 정체성이 0.25에서 0.531과 0.683, 0.40에서 0.237과 0.490, 0.55에서
        0.090과 0.253이었습니다. 판정 임계값은 별도 글이 정한 0.40을 씁니다.
      </CitationBlock>
    </section>
  );
}
