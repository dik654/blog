import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DeepfakeSourceRiskViz } from "./viz/ModernDeepfakeViz";

export default function DeepfakeDetectionArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          딥페이크 평가의 첫 단위는 file이 아니라 같은 현실 장면에서 나온 source
          group입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 source video에서 frame을 자르고, 얼굴을 crop하고, JPEG로 다시
            저장하면 서로 다른 파일이 많이 생깁니다. 그러나 이 파일들은 같은
            사람·배경·촬영 장비를 공유합니다. 파생본이 train과 test에 갈라지면
            detector는 조작보다 source를 기억할 수 있습니다. 그래서 model을
            고르기 전에 무엇을 한 group으로 묶고 무엇을 처음 보는 domain으로
            남길지 정합니다.
          </p>
        </div>
        <TermBreakdown
          title="File 목록을 평가 계약으로 바꾸는 용어"
          items={[
            {
              term: "Source clip",
              description:
                "파생 frame·crop·재인코딩이 나오기 전의 원본 촬영 단위입니다.",
            },
            {
              term: "Derivative",
              description:
                "같은 source에서 만든 frame, face crop, resize, codec encode입니다.",
              boundary: "파일 hash가 달라도 독립 sample은 아닙니다.",
            },
            {
              term: "Identity group",
              description:
                "같은 사람·capture session을 split 사이에서 추적하는 key입니다.",
            },
            {
              term: "Evaluation domain",
              description:
                "Generator family, codec, resolution, capture condition처럼 평가 전에 선언한 slice입니다.",
            },
          ]}
        />
        <DeepfakeSourceRiskViz />
        <ContentBoundary article="deepfake-detection" />
      </section>

      <section id="source-groups" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          같은 source와 identity의 모든 파생본을 한 split에 넣습니다
        </h2>
        <ExplainedFormula
          question="Train과 test가 같은 source·identity evidence를 공유하지 않는 조건은 무엇인가요?"
          idea={
            <p>
              각 파일을 source ID와 person ID가 포함된 group key로 바꿉니다.
              Split마다 group key 집합을 만들고 교집합이 비어 있는지 검사합니다.
            </p>
          }
          formula={String.raw`G_{\rm train}\cap G_{\rm test}=\varnothing`}
          annotatedFormula={String.raw`\begin{aligned}g_i&=\underbrace{(s_i,p_i)}_{\text{source와 person을 한 key로 묶음}}\\G_{\rm tr}&=\underbrace{\{g_i:i\in\mathrm{train}\}}_{\text{training group 집합}}\\G_{\rm te}&=\underbrace{\{g_i:i\in\mathrm{test}\}}_{\text{test group 집합}}\\O&=\underbrace{G_{\rm tr}\cap G_{\rm te}}_{\text{두 split이 공유한 group}}\\\operatorname{pass}&=\underbrace{\mathbf 1[|O|=0]}_{\text{공유 group이 없을 때만 통과}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`(s_i,p_i)`,
              annotation: [
                "source와 identity를 결합해",
                "파생본이 공유할 group key 생성",
              ],
            },
            {
              expression: String.raw`G_{\rm tr}\cap G_{\rm te}`,
              annotation: [
                "train·test key를 교차해",
                "양쪽에 들어간 source evidence 탐색",
              ],
            },
            {
              expression: String.raw`|O|=0`,
              annotation: [
                "overlap 개수를 세어 0과 비교하고",
                "source-independent split만 승인",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`s_i`,
              name: "Source ID",
              description: "Sample i가 파생된 원본 clip identifier입니다.",
            },
            {
              symbol: String.raw`p_i`,
              name: "Person ID",
              description:
                "Sample i에 나타난 identity 또는 consented actor identifier입니다.",
            },
            {
              symbol: "O",
              name: "Overlap groups",
              description: "Train과 test가 공유한 source·identity keys입니다.",
            },
          ]}
          assumptions={[
            "Crop·resize·codec derivatives가 원 source ID를 보존합니다.",
            "Near-duplicate 검사는 metadata와 perceptual fingerprint를 함께 사용합니다.",
            "Generator holdout과 identity holdout을 별도 manifest 축으로 표시합니다.",
          ]}
          interpretation="Person 17의 원본, face crop과 JPEG 버전이 하나라도 양 split에 있으면 O는 비지 않습니다. 파일 단위 random split은 이 실패를 쉽게 숨깁니다."
        />
      </section>

      <section id="domain-risk" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          평균 score 옆에 가장 취약한 generator·codec domain의 risk를 둡니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Raw known-generator sample이 많으면 전체 평균은 좋아 보일 수
            있습니다. 그러나 unseen generator를 social codec으로 재인코딩한
            domain에서 error가 크면 실제 유통 환경의 약점은 그대로입니다.
            Domain은 결과를 본 뒤 유리하게 쪼개지 않고 평가 전에 선언합니다.
          </p>
        </div>
        <ExplainedFormula
          question="여러 evaluation domains 중 숨기면 안 되는 가장 큰 평균 loss는 어떻게 계산하나요?"
          idea={
            <p>
              먼저 domain마다 같은 loss의 평균을 냅니다. 그런 다음 domain means
              가운데 가장 큰 값을 선택합니다.
            </p>
          }
          formula={String.raw`R_{\rm worst}=\max_{d\in\mathcal D}R_d`}
          annotatedFormula={String.raw`\begin{aligned}S_d&=\underbrace{\{i:x_i\in d\}}_{\text{domain d의 sample indexes}}\\L_d&=\underbrace{\sum_{i\in S_d}\ell_i}_{\text{domain 안 loss를 합산}}\\R_d&=\underbrace{L_d/|S_d|}_{\text{독립 sample 수로 평균}}\\R_{\rm worst}&=\underbrace{\max_{d\in\mathcal D}R_d}_{\text{가장 취약한 domain을 선택}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sum_{i\in S_d}\ell_i`,
              annotation: [
                "같은 domain의 errors를 더해",
                "slice별 총 loss 계산",
              ],
            },
            {
              expression: String.raw`L_d/|S_d|`,
              annotation: [
                "독립 sample 수로 나눠",
                "domain 크기 차이를 평균으로 정규화",
              ],
            },
            {
              expression: String.raw`\max_d R_d`,
              annotation: [
                "domain means 중 가장 큰 값을 골라",
                "평균이 숨긴 취약 조건을 노출",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mathcal D`,
              name: "Evaluation domains",
              description: "미리 선언한 generator·codec·capture slices입니다.",
            },
            {
              symbol: String.raw`\ell_i`,
              name: "Sample loss",
              description:
                "모든 domain에서 같은 label·score 의미로 계산한 error입니다.",
            },
            {
              symbol: String.raw`R_{\rm worst}`,
              name: "Worst-domain risk",
              description: "선언한 domains 중 가장 큰 평균 loss입니다.",
            },
          ]}
          assumptions={[
            "Domain마다 독립 source 수와 confidence interval을 보고합니다.",
            "모든 domain에서 같은 prediction target과 loss를 사용합니다.",
            "관측하지 않은 미래 generator의 upper bound로 해석하지 않습니다.",
          ]}
          interpretation="Domain means가 .10, .30, .80이면 전체 평균이 .25여도 worst-domain risk는 .80입니다. 배포 claim은 .25가 아니라 .80의 조건을 함께 말해야 합니다."
        />
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Unseen이라는 말 뒤에 무엇을 가렸고 무엇은 아직 모르는지 붙입니다
        </h2>
        <TermBreakdown
          title="일반화 claim을 좁히는 네 줄"
          items={[
            {
              term: "Unseen identity",
              description: "같은 사람의 영상이 training에 없었습니다.",
              boundary: "새 generator를 뜻하지 않습니다.",
            },
            {
              term: "Unseen generator",
              description: "해당 generation family가 training에 없었습니다.",
              boundary: "새 identity·codec까지 동시에 보장하지 않습니다.",
            },
            {
              term: "Unseen distribution path",
              description: "새 codec·resize·social re-encoding을 포함합니다.",
            },
            {
              term: "Unknown future domain",
              description: "현재 evaluation set에 없는 조작입니다.",
              boundary: "현재 worst-domain risk로 수치 보장하지 않습니다.",
            },
          ]}
        />
        <div id="paper-faceforensics" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Rössler et al. — FaceForensics++"
            href="https://openaccess.thecvf.com/content_ICCV_2019/html/Rossler_FaceForensics_Learning_to_Detect_Manipulated_Facial_Images_ICCV_2019_paper.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 서로 다른 facial manipulation detector를
                공통 data·compression 조건에서 비교합니다.
              </p>
              <p>
                <strong>기여.</strong> 네 manipulation과 여러 compression
                level의 benchmark를 제공합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 source
                videos·manipulations·preprocessing을 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 해당 benchmark의 detector·human
                comparison입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 이후 모든 generator와 in-the-wild
                유통 경로를 보장하지 않습니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
