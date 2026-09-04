import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DeepfakePreprocessViz } from "../deepfake-detection/viz/ModernDeepfakeViz";

export default function DeepfakePreprocessingLineageArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Face crop은 중립적 전처리가 아니라 detector가 볼 evidence를 선택하는
          첫 번째 model입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            얼굴을 찾은 frame만 분류기에 보내고 실패 frame을 지우면 쉬운 pose와 큰 얼굴만 남습니다. crop 뒤 classifier의 accuracy가 높아도 원
            video를 안정적으로 읽었다고 말할 수 없는 상태입니다. Decode·detect·identity track·align·crop을 별도 단계로 보고 성공과 실패를 모두
            source timestamp에 연결합니다.
          </p>
        </div>
        <TermBreakdown
          title="Source frame에서 classifier input까지"
          items={[
            {
              term: "Eligible frame",
              description:
                "평가 시간 구간에서 decode에 성공해 denominator에 들어가는 source timestamp입니다.",
            },
            {
              term: "Face detection",
              description:
                "한 frame 안에서 face box와 confidence를 찾는 단계입니다.",
            },
            {
              term: "Identity track",
              description:
                "여러 frame의 boxes가 같은 사람인지 시간축으로 연결한 sequence입니다.",
            },
            {
              term: "Valid crop",
              description:
                "크기·pose·track·margin 규칙을 통과해 classifier에 실제 들어간 image입니다.",
            },
          ]}
        />
        <DeepfakePreprocessViz />
        <ContentBoundary article="deepfake-preprocessing-lineage" />
      </section>

      <section id="detection-track" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Detection box와 identity track을 같은 성공으로 세지 않습니다
        </h2>
        <TermBreakdown
          title="단계별 실패를 구분"
          items={[
            {
              term: "Decode failure",
              description: "요청 timestamp의 frame을 읽지 못했습니다.",
            },
            {
              term: "No face",
              description:
                "Frame은 있지만 validity threshold를 넘는 face box가 없습니다.",
            },
            {
              term: "Track switch",
              description: "연속 boxes가 중간에 다른 identity로 바뀌었습니다.",
            },
            {
              term: "Invalid crop",
              description:
                "Face가 너무 작거나 margin·landmark transform 뒤 usable pixels가 부족합니다.",
            },
          ]}
        />
      </section>

      <section id="coverage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          성공한 crop 수를 원래 eligible frame 수로 나눠 evidence coverage를
          계산합니다
        </h2>
        <ExplainedFormula
          question="실패 frame을 삭제하지 않고 track coverage에 남기는 계산은 무엇인가요?"
          idea={
            <p>
              각 eligible timestamp에서 요구 identity의 valid crop이 있으면 1,
              없으면 0으로 둡니다. 이 indicator 합을 전체 eligible frame 수로
              나눕니다.
            </p>
          }
          formula={String.raw`C_{\rm track}=T^{-1}\sum_{t=1}^{T}I_t`}
          annotatedFormula={String.raw`\begin{aligned}I_t&=\underbrace{\mathbf 1[\text{valid crop at }t]}_{\text{timestamp별 성공을 0·1로 표시}}\\N_{\rm ok}&=\underbrace{\sum_{t=1}^{T}I_t}_{\text{valid crop timestamps를 합산}}\\C_{\rm track}&=\underbrace{N_{\rm ok}/T}_{\text{eligible 전체로 나눠 coverage 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf 1[\text{valid crop}]`,
              annotation: [
                "각 timestamp의 stage 결과를 검사해",
                "성공 1·실패 0으로 보존",
              ],
            },
            {
              expression: String.raw`\sum_t I_t`,
              annotation: [
                "성공 indicators를 더해",
                "classifier가 본 timestamps 수 계산",
              ],
            },
            {
              expression: String.raw`N_{\rm ok}/T`,
              annotation: [
                "성공 수를 원래 eligible 수로 나눠",
                "조용한 삭제를 coverage 감소로 노출",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T",
              name: "Eligible frames",
              description: "평가 구간의 전체 denominator입니다.",
            },
            {
              symbol: String.raw`I_t`,
              name: "Valid-crop indicator",
              description:
                "요구 identity의 crop이 classifier input까지 도달하면 1입니다.",
            },
            {
              symbol: String.raw`C_{\rm track}`,
              name: "Track coverage",
              description: "원본 시간축 중 classifier가 실제 읽은 비율입니다.",
            },
          ]}
          assumptions={[
            "모든 후보 model에서 같은 timestamps를 denominator로 사용합니다.",
            "Track switch와 duplicate face의 validity rule을 미리 고정합니다.",
            "Coverage가 낮은 video를 평가 목록에서 삭제하지 않습니다.",
          ]}
          interpretation="100 eligible frames 중 detection 80, identity-consistent track 70, valid crop 62라면 final coverage는 .62입니다. 62 crops의 높은 accuracy만으로 100-frame video 판정을 주장할 수 없습니다."
        />
      </section>

      <section id="lineage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          최종 crop에 source timestamp와 모든 transform·failure owner를 붙입니다
        </h2>
        <TermBreakdown
          title="Crop lineage receipt"
          items={[
            {
              term: "Source pointer",
              description: "Video checksum, timestamp, decode revision입니다.",
            },
            {
              term: "Detection",
              description:
                "Detector revision, box coordinates, confidence와 typed failure입니다.",
            },
            {
              term: "Track",
              description:
                "Track ID, identity consistency, switch·gap 상태입니다.",
            },
            {
              term: "Transform",
              description:
                "Landmarks, alignment matrix, crop margin, resize와 interpolation입니다.",
            },
            {
              term: "Output",
              description:
                "Crop checksum, classifier revision과 coverage denominator link입니다.",
            },
          ]}
        />
        <div
          id="paper-deepfake-preprocess"
          className="not-prose mt-8 scroll-mt-24"
        >
          <CitationBlock
            type="paper"
            citeKey={1}
            source="DeepfakeBench · unified preprocessing"
            href="https://papers.nips.cc/paper_files/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Detector마다 다른 preprocessing과
                metric이 model 비교를 왜곡합니다.
              </p>
              <p>
                <strong>기여.</strong> 통일 data management와
                implementation·evaluation protocol을 제공합니다.
              </p>
              <p>
                <strong>가정.</strong> 포함된 datasets·detectors와 공개
                revision을 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 논문이 재현한 benchmark
                pipeline입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 특정 face detector·crop이 모든
                배포 영상에 최적이라는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
