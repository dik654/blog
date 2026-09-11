import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import TermBreakdown from "@/components/articles/term-breakdown";
import { codeRefs } from "./codeRefs";
import ResizeViz from "./viz/ResizeViz";

export default function Preprocessing({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="preprocessing" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">전처리는 정보를 버리는 단계입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          모델은 고정된 크기의 텐서를 받습니다. 그래서 사진을 넣기 전에 반드시 크기를 맞추는데, 이 과정은
          중립적인 변환이 아니라 무엇을 남기고 무엇을 버릴지 정하는 결정입니다. 가로로 긴 사진을 정사각형에
          욱여넣으면 비율이 왜곡되고, 가운데만 잘라내면 가장자리가 아예 사라집니다.
        </p>

        <p className="leading-7">
          어느 쪽이 나은지는 무엇을 검색하느냐에 달려 있습니다. 물체의 형태가 중요한 과제라면 비율 왜곡이
          손해입니다. 가운데에 주제가 놓이는 사진이 대부분이라면 자르기가 오히려 배경 잡음을 덜어 줍니다. 문제는
          이 선택이 색인 전체에 일관되게 적용돼야 한다는 점입니다.
        </p>

        <p className="leading-7">
          기본값은 대부분 학습 때 쓰던 설정을 그대로 따릅니다. 참조 구현을 열어 보면 크기와 보간 방식, 정규화
          상수가 모델별로 박혀 있습니다. 여기서 벗어난 전처리를 쓰면 모델이 학습 중에 본 적 없는 분포의 입력이
          들어가고, 그 차이는 조용히 검색 품질로 나타납니다.
        </p>
      </div>

      <ResizeViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("image-processor", codeRefs["image-processor"])} />
        <span className="text-xs text-muted-foreground">기본 크기·보간·정규화 상수와 연산 순서</span>
      </div>

      <h3 id="resize-crop" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        같은 설정이라도 순서가 다르면 결과가 다릅니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          참조 구현은 값 스케일 조정, 크기 변경, 정규화의 순서를 고정해 둡니다. 순서를 바꾸면 같은 상수를 써도
          결과가 달라집니다. 정규화를 먼저 하고 리사이즈하면 보간이 평균을 뺀 값 위에서 일어나 가장자리 처리가
          달라지기 때문입니다.
        </p>

        <p className="leading-7">
          축소할 때 계단 현상을 줄이는 처리를 켜는지도 실제로 영향을 줍니다. 고해상도 사진을 224픽셀로 줄이면
          픽셀을 버리는 양이 많은데, 이 처리를 끄면 가는 무늬가 엉뚱한 패턴으로 바뀌어 그 자체가 특징처럼
          인코딩될 수 있습니다.
        </p>

        <p className="leading-7">
          한 가지 흔한 사고가 있습니다. 색인을 만들 때와 질의를 넣을 때 전처리가 다른 경우입니다. 색인은 배치
          파이프라인에서, 질의는 웹 서버에서 처리되는 구성이라면 라이브러리 버전만 달라도 보간 결과가 미세하게
          갈립니다. 두 경로가 같은 전처리를 쓰는지 확인하는 일이 모델 교체보다 먼저입니다.
        </p>
      </div>

      <TermBreakdown
        title="크기를 맞추는 세 가지 방식"
        description="무엇을 버릴지가 방식마다 다릅니다."
        items={[
          {
            term: "비율 무시 리사이즈",
            description: "가로세로를 각각 목표 크기로 늘이거나 줄입니다. 모든 픽셀이 남지만 형태가 왜곡됩니다.",
            example: "16:9 사진을 정사각형으로 만들면 사람이 옆으로 퍼져 보입니다.",
            boundary: "형태가 판별 근거인 과제에서는 손해가 큽니다.",
          },
          {
            term: "짧은 변 맞춤 후 중앙 자르기",
            description: "비율을 유지한 채 줄인 뒤 가운데를 잘라냅니다. 형태는 보존되지만 가장자리가 사라집니다.",
            example: "가장 흔한 기본값이며 참조 구현도 이 조합을 제공합니다.",
            boundary: "주제가 가장자리에 있는 사진에서는 정작 찾으려던 대상이 잘려 나갑니다.",
          },
          {
            term: "여백 채우기",
            description: "비율을 유지한 채 남는 자리를 단색으로 채웁니다. 아무것도 버리지 않습니다.",
            example: "문서 이미지처럼 잘리면 안 되는 대상에 씁니다.",
            boundary: "여백이 입력의 상당 부분을 차지하면 그 자체가 패턴이 되어 임베딩에 섞입니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          고정 크기를 강제하는 구조 자체를 바꾸려는 연구도 있습니다. 여러 해상도의 사진을 패치 시퀀스로 이어
          붙여 한 배치에 담으면 비율을 왜곡하지 않고도 학습할 수 있다는 접근입니다. 다만 이 방식으로 학습한
          모델을 써야 그 이점을 얻고, 고정 크기로 학습된 기존 백본에는 적용되지 않습니다.
        </p>
      </div>

      <CitationBlock
        source="Dehghani et al. — Patch n' Pack: NaViT, a Vision Transformer for any Aspect Ratio and Resolution (arXiv 2307.06304)"
        citeKey={1}
        type="paper"
        href="https://arxiv.org/abs/2307.06304"
      >
        고정 해상도로 맞추는 관행 대신 임의의 해상도와 종횡비를 패치 시퀀스 패킹으로 처리하는 학습 방식을
        제안한 논문입니다. 보고된 효율과 견고성 개선은 그 방식으로 학습한 모델에 해당하며, 고정 크기로 학습된
        백본의 전처리를 바꿔도 같은 이득이 난다는 뜻이 아닙니다.
      </CitationBlock>
    </section>
  );
}
