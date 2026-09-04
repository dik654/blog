import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DeepfakeDatasetViz } from "../deepfake-detection/viz/ModernDeepfakeViz";

export default function DeepfakeDatasetGovernanceArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Dataset 크기는 frame 수보다 독립 source·identity와 사용 권한으로
          설명합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Video 한 개에서 수천 frames를 만들면 파일 수는 커지지만 새로운 사람·촬영 환경·generator evidence는 늘지 않습니다. 인터넷에서 접근 가능하다는 사실이
            얼굴을 조작하고 재배포할 consent가 있다는 뜻도 아닙니다. Source asset·person identity·consent scope와 모든 derivatives는
            하나의 provenance chain으로 연결합니다.
          </p>
        </div>
        <TermBreakdown
          title="Governed dataset의 기본 단위"
          items={[
            {
              term: "Source asset",
              description:
                "파생 조작을 만들기 전 consented original video입니다.",
            },
            {
              term: "Person identity",
              description:
                "Likeness 사용·삭제 요청의 주체와 split group을 연결하는 ID입니다.",
            },
            {
              term: "Derivative lineage",
              description:
                "Generator·checkpoint·prompt·codec·crop으로 만든 모든 파생본의 parent chain입니다.",
            },
            {
              term: "Consent scope",
              description:
                "조작·연구·재배포·상업 이용과 보유 기간을 각각 허용·금지한 범위입니다.",
            },
          ]}
        />
        <DeepfakeDatasetViz />
        <ContentBoundary article="deepfake-dataset-governance" />
      </section>

      <section id="provenance" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Source에서 generator output과 codec derivative까지 parent pointer를
          끊지 않습니다
        </h2>
        <TermBreakdown
          title="Provenance manifest의 필드"
          items={[
            {
              term: "Identity",
              description:
                "Dataset ID, source asset ID, person ID와 capture session입니다.",
            },
            {
              term: "Permission",
              description:
                "Consent revision, license, allowed uses, expiry와 deletion scope입니다.",
            },
            {
              term: "Generation",
              description:
                "Generator family·checkpoint, manipulation type와 code revision입니다.",
            },
            {
              term: "Distribution",
              description:
                "Codec·quality, resize·crop와 social-platform processing입니다.",
            },
            {
              term: "Evaluation",
              description: "Split, holdout axes와 parent group checksum입니다.",
            },
          ]}
        />
      </section>

      <section id="coverage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Generator×codec×resolution cell마다 frame이 아닌 독립 source group을
          셉니다
        </h2>
        <ExplainedFormula
          question="Coverage matrix의 한 cell에 같은 source의 파생본을 중복 없이 어떻게 세나요?"
          idea={
            <p>
              Cell 조건을 만족하는 samples에서 source-group IDs만 뽑아 set으로 중복을 제거합니다. 그 set의 크기가 독립 coverage count입니다.
            </p>
          }
          formula={String.raw`N_{gcr}=|\{u_i:(g_i,c_i,r_i)=(g,c,r)\}|`}
          annotatedFormula={String.raw`\begin{aligned}I_{gcr}&=\underbrace{\{i:g_i=g,\ c_i=c,\ r_i=r\}}_{\text{지정 cell의 samples 선택}}\\U_{gcr}&=\underbrace{\{u_i:i\in I_{gcr}\}}_{\text{sample에서 source group ID 추출}}\\\widetilde U_{gcr}&=\underbrace{\operatorname{unique}(U_{gcr})}_{\text{같은 source derivatives 중복 제거}}\\N_{gcr}&=\underbrace{|\widetilde U_{gcr}|}_{\text{독립 source groups를 count}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`(g_i,c_i,r_i)=(g,c,r)`,
              annotation: [
                "generator·codec·resolution을 비교해",
                "한 coverage cell의 samples 선택",
              ],
            },
            {
              expression: String.raw`\{u_i:i\in I_{gcr}\}`,
              annotation: [
                "선택 samples에서 parent group을 읽어",
                "file 수를 source IDs로 변환",
              ],
            },
            {
              expression: String.raw`\operatorname{unique}(U_{gcr})`,
              annotation: [
                "반복 source IDs를 하나로 접어",
                "frames·derivatives의 중복 제거",
              ],
            },
            {
              expression: String.raw`|\widetilde U_{gcr}|`,
              annotation: [
                "남은 set 원소를 세어",
                "독립 evidence coverage 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "g",
              name: "Generator",
              description:
                "Manipulation family 또는 exact checkpoint slice입니다.",
            },
            {
              symbol: "c",
              name: "Codec",
              description: "Raw·H.264·JPEG·social re-encode 조건입니다.",
            },
            {
              symbol: "r",
              name: "Resolution",
              description: "평가 전에 선언한 spatial size bucket입니다.",
            },
            {
              symbol: String.raw`u_i`,
              name: "Source group ID",
              description: "Sample i의 원본 clip·identity group입니다.",
            },
          ]}
          assumptions={[
            "모든 derivative가 parent source group ID를 보존합니다.",
            "Unknown generator·codec을 임의의 known cell에 넣지 않습니다.",
            "작은 count에는 uncertainty와 minimum-support rule을 함께 둡니다.",
          ]}
          interpretation="한 source에서 JPEG frames 1,000개를 만들었어도 해당 cell의 source coverage는 1입니다. B-generator×social-codec cell이 0이면 그 조건의 robustness를 주장할 수 없습니다."
        />
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Consent·삭제 요청·빈 coverage cell을 model release claim과 함께
          versioning합니다
        </h2>
        <TermBreakdown
          title="Dataset release gate"
          items={[
            {
              term: "Permission gate",
              description:
                "모든 source와 derivatives의 현재 use scope가 이번 release를 허용합니다.",
            },
            {
              term: "Deletion closure",
              description:
                "Withdrawal된 person의 source, generated outputs, crops, caches와 trained-artifact 처리 범위를 추적합니다.",
            },
            {
              term: "Coverage disclosure",
              description:
                "0·low-support·unknown cells를 표에 그대로 남깁니다.",
            },
            {
              term: "Claim boundary",
              description:
                "실제로 독립 test evidence가 있는 cells만 model card claim에 포함합니다.",
            },
          ]}
        />
        <div id="paper-dfdc" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Dolhansky et al. — DFDC Dataset"
            href="https://arxiv.org/abs/2006.07397"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 대규모 face-swap detection과 challenge를
                위한 consented video data가 필요합니다.
              </p>
              <p>
                <strong>기여.</strong> Likeness manipulation에 동의한 actors,
                여러 manipulation과 100,000개 이상 clips를 제공합니다.
              </p>
              <p>
                <strong>가정.</strong> DFDC actor
                population·capture·manipulation·competition split을 전제로
                합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> Dataset construction과 challenge
                analysis입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> DFDC만으로 모든
                demographic·generator를 포괄하거나 영상 진위를 증명한다는 뜻은
                아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
