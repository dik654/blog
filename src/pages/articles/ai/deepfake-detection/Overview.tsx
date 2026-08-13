import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">딥페이크 탐지의 목표는 익숙한 가짜를 맞히는 것이 아니라, 처음 보는 생성·유통 경로에서 오류를 통제하는 것입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          특정 generator와 codec의 흔적을 학습한 detector는 같은 dataset에서 높은
          점수를 낼 수 있습니다. 그러나 새로운 generation pipeline, 재인코딩,
          crop과 resize를 만나면 그 흔적이 바뀌므로 실제 목표는 보지 못한 조작과
          유통 경로에서 false positive·false negative를 통제하는 것입니다. 따라서
          detector 이름을 고르기 전에 <strong>무엇을 unseen으로 남길지</strong>부터
          평가 계약으로 고정해야 합니다.
        </p>
        <p>
          파이프라인은 source video와 identity 기준 split, face track 추출,
          frame·frequency·temporal signal, video-level aggregation과 calibration으로
          이어집니다. 같은 원본이나 사람이 split 사이에 겹치면 model이 manipulation
          대신 identity와 촬영 환경을 기억할 수 있습니다.
        </p>
      </div>
      <ContentBoundary article="deepfake-detection" />
      <ExplainedFormula
        question="같은 영상의 파생본과 같은 인물이 train·test에 함께 들어가지 않았음을 어떻게 표현할까?"
        idea={<>각 clip의 source와 identity를 group key로 묶습니다. Split 사이 group 집합의 교집합이 비어 있어야 detector가 같은 원본·인물을 기억해 얻는 점수를 줄일 수 있습니다.</>}
        formula={String.raw`G_{\mathrm{train}}\cap G_{\mathrm{val}}=G_{\mathrm{train}}\cap G_{\mathrm{test}}=\varnothing`}
        terms={[
          { symbol: "Gtrain", name: "training groups", description: "Training에 들어간 source clip·person identity·capture session의 group key 집합입니다." },
          { symbol: "Gval,Gtest", name: "held-out groups", description: "Model 선택과 최종 평가에 사용하지만 training에는 나타나지 않는 group 집합입니다." },
          { symbol: String.raw`\cap=\varnothing`, name: "disjointness", description: "같은 group key가 두 split에 동시에 존재하지 않는다는 조건입니다." },
        ]}
        assumptions={["Group key가 resize·crop·re-encoding처럼 같은 source에서 나온 파생본을 추적합니다.", "Identity holdout과 generator holdout은 서로 다른 일반화 질문이므로 각각 manifest에 표시합니다.", "Duplicate·near-duplicate 검사는 metadata뿐 아니라 perceptual similarity도 함께 사용합니다."]}
        interpretation="Split이 file 단위로만 분리돼도 같은 source clip의 frame과 재인코딩본이 양쪽에 있으면 이 조건을 깨뜨립니다. Dataset name이 다르다는 사실도 source independence를 자동 보장하지 않습니다."
      />
      <div className="not-prose my-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          뒤에서는 detection failure를 포함한 face preprocessing, 주파수 특징의
          조건부 유효성, backbone보다 중요한 benchmark contract, consent와
          provenance를 갖춘 dataset 구축으로 내려갑니다. Detector score는 진위의
          증명서가 아니라 추가 검토를 위한 신호로 취급합니다.
        </p>
      </div>
      <ExplainedFormula
        question="평균 성능이 좋아도 특정 generator·codec에서 무너지는 detector를 어떻게 드러낼까?"
        idea={<>평가 domain별 risk를 따로 계산하고 가장 큰 값을 함께 보고합니다. 평균은 자주 등장하는 쉬운 domain에 끌릴 수 있지만 worst-group risk는 취약한 조건을 숨기지 않습니다.</>}
        formula={String.raw`R_{\mathrm{worst}}(\theta)=\max_{d\in\mathcal D_{\mathrm{eval}}}\frac1{|I_d|}\sum_{i\in I_d}\ell(f_\theta(x_i),y_i)`}
        terms={[
          { symbol: "d", name: "evaluation domain", description: "Generator family·codec·resolution·capture condition처럼 사전에 선언한 slice입니다." },
          { symbol: "Iᵈ", name: "domain sample indexes", description: "Domain d에 속하는 독립 source·identity의 평가 sample index입니다." },
          { symbol: "ℓ", name: "evaluation loss", description: "모든 domain에서 같은 prediction과 label 정의로 계산하는 error입니다." },
          { symbol: "Rworst", name: "worst-domain risk", description: "평가 domain 가운데 평균 loss가 가장 큰 조건입니다." },
        ]}
        assumptions={["Domain label은 model prediction을 본 뒤 유리하게 만들지 않고 평가 전에 정의합니다.", "Domain마다 충분한 독립 sample과 confidence interval을 보고합니다.", "현재 D_eval 밖의 미래 manipulation까지 보장하는 값으로 해석하지 않습니다."]}
        interpretation="전체 평균 AUC 하나 대신 known generator, unseen generator, raw, social re-encode를 나눠 보면 model이 manipulation보다 dataset source나 codec을 구분했는지 진단할 수 있습니다."
      />
      <div id="paper-faceforensics" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · FaceForensics++</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Rössler 등은 네 종류의 facial manipulation과 여러 compression 조건을 포함한 benchmark를 만들고 사람과 여러 detector를 비교했습니다. 이는 통일된 benchmark와 compression 평가의 근거이며, 이후 등장한 모든 생성 방식이나 in-the-wild 유통 경로까지 일반화된다는 증거는 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_ICCV_2019/html/Rossler_FaceForensics_Learning_to_Detect_Manipulated_Facial_Images_ICCV_2019_paper.html" target="_blank" rel="noreferrer">Manipulation·compression·benchmark 범위 보기</a>
      </div>
    </section>
  );
}
