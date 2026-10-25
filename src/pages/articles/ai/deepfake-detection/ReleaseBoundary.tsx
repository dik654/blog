import { CitationBlock } from "@/components/ui/citation";
import { DeepfakeMapReturn } from "./DeepfakePathLocator";
import ClaimBoundaryViz from "./viz/ClaimBoundaryViz";

export default function ReleaseBoundary() {
  return (
    <section id="release" data-teach-level="7" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">검증한 조건만 일반화 주장에 넣습니다</h2>
      <ClaimBoundaryViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>Unseen identity</strong>는 같은 사람이 학습 자료에 없었다는 뜻입니다.
          <strong> Unseen generator</strong>는 해당 생성 방법을 학습에서 가렸다는 뜻이고,
          <strong> unseen distribution path</strong>는 새 codec·resize·social re-encoding을
          시험했다는 뜻입니다. 셋 가운데 하나를 확인했다고 나머지까지 확인한 것은 아닙니다.
        </p>
        <p>
          이 사례의 검증 문장은 “학습에서 제외한 person-C·generator-Z와 social codec
          조건의 독립 원본 10개에서 mean loss 0.80을 측정했다”입니다. 아직 평가표에 없는
          미래 생성기는 unknown future domain으로 남습니다. 새 자료가 도착하면 기존
          문장을 넓히는 대신 새 domain과 support를 추가해 다시 측정합니다.
        </p>
      </div>
      <div id="paper-cnn-detection" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · CNN-generated image detection</p>
        <CitationBlock
          type="paper"
          citeKey={2}
          source="Wang et al. — CNN-Generated Images Are Surprisingly Easy to Spot... for Now"
          href="https://openaccess.thecvf.com/content_CVPR_2020/html/Wang_CNN-Generated_Images_Are_Surprisingly_Easy_to_Spot..._for_Now_CVPR_2020_paper.html"
        >
          <p className="text-sm leading-6 text-muted-foreground">
            이 연구는 ProGAN으로 만든 자료에 학습한 분류기가 당시 수집한 여러 CNN 생성
            모델로 일반화되는 결과를 보였습니다. 논문의 전처리·증강·생성 모델·자료 범위
            안에서 읽어야 하며, 이후의 모든 생성 방식에서 같은 성능을 보장한다는 근거는
            아닙니다.
          </p>
        </CitationBlock>
      </div>
      <DeepfakeMapReturn current="evaluation-map" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>같은 사례로 확인해 보세요</h3>
        <ol>
          <li>
            같은 frame의 crop과 JPEG가 train·test에 하나씩 있으면 파일 hash가 다른데도 왜
            누수인가요? (답: 2절)
          </li>
          <li>
            Domain 평균이 0.10·0.30·0.80이고 원본 수가 60·30·10개라면 전체 평균과
            worst-domain은 각각 얼마인가요? (답: 3절)
          </li>
          <li>
            Unseen identity test를 통과한 detector를 새 generator에도 일반화된다고 말할 수
            없는 이유는 무엇인가요? (답: 4절)
          </li>
        </ol>
      </div>
    </section>
  );
}
