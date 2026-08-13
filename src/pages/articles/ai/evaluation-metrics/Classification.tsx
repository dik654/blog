import ExplainedFormula from "@/components/ui/explained-formula";
import ClassificationMetricsViz from "./viz/ClassificationMetricsViz";

export default function Classification() {
  return (
    <section id="classification" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">분류에서는 순서를 잘 세우는 능력, probability의 의미, 실제 action을 따로 평가합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          ROC-AUC와 PR-AUC는 threshold를 움직이며 positive를 negative보다 앞에 놓는 ranking 능력을 봅니다. Log loss와 Brier score는
          0.8이라는 숫자를 probability로 믿을 수 있는지 평가합니다. Precision·recall·F1·specificity는 선택한 threshold에서 이미 내린
          hard decision을 평가합니다. 세 층은 서로 대체할 수 없습니다.
        </p>
        <p>
          예를 들어 모든 positive score가 모든 negative보다 높지만 0.51과 0.49에 몰려 있는 model은 ranking은 완벽할 수 있습니다.
          그러나 probability로서 0.51이 맞는지는 별도 문제입니다. 반대로 잘 calibrated된 probability도 비용과 처리 용량에 맞는
          threshold를 정하지 않으면 운영 decision이 나쁠 수 있습니다. Class prevalence와 PR/ROC의 자세한 관계, confusion matrix와
          비용 threshold는 <a href="/ai/imbalanced-data">불균형 데이터 글</a>의 정본 설명을 연결해 사용합니다.
        </p>
      </div>

      <div className="not-prose my-8"><ClassificationMetricsViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Probability를 평가할 때는 <em>strictly proper scoring rule</em>이 중요합니다. 실제 positive probability가 p일 때 다른 숫자 q를
          보고해서 기대 loss를 더 줄일 수 없다면 proper하고, p에서만 유일하게 최소가 되면 strictly proper합니다. 이 성질 덕분에 model이
          confidence를 일부러 과장하거나 축소할 유인을 줄일 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Brier loss는 왜 실제 positive probability를 그대로 보고하도록 유도할까요?"
        idea={<>Y가 0 또는 1이고 실제 positive probability가 p라고 두면, 임의의 예측 q가 만든 기대 Brier loss는 정직한 예측 p의 loss보다 정확히 (q−p)²만큼 큽니다.</>}
        formula={String.raw`\mathbb E[(Y-q)^2\mid X=x]-\mathbb E[(Y-p)^2\mid X=x]=(q-p)^2\ge 0,\qquad p=\Pr(Y=1\mid X=x)`}
        terms={[
          { symbol: "Y", name: "binary outcome", description: "Positive면 1, negative면 0인 실제 결과입니다." },
          { symbol: "p", name: "true conditional probability", description: "입력 x에서 실제로 positive가 될 조건부 확률입니다." },
          { symbol: "q", name: "reported probability", description: "Model이 positive probability라고 내놓은 0에서 1 사이의 값입니다." },
          { symbol: "Brier loss", name: "squared probability error", description: "한 사례에서 (Y−q)²로 계산하는 probability prediction loss입니다." },
        ]}
        assumptions={[
          "Binary outcome과 같은 evaluation population의 조건부 probability를 가정합니다.",
          "Model family가 p를 정확히 표현할 수 있다는 보장이 아니라 scoring rule의 population 성질입니다.",
          "Calibration뿐 아니라 resolution·ranking·subgroup performance를 함께 평가합니다.",
        ]}
        interpretation="q가 p와 다르면 차이의 제곱만큼 기대 loss가 반드시 늘어납니다. 다만 finite sample에서는 우연히 다른 q가 더 좋아 보일 수 있고, distribution shift 뒤의 p는 달라질 수 있습니다."
      />

      <div id="paper-proper-scoring-rules" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Strictly Proper Scoring Rules, Prediction, and Estimation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Gneiting과 Raftery는 probabilistic forecast를 평가하는 proper scoring rule의 일반 이론, convex function과의 관계, 여러 예를
          정리했습니다. 핵심은 관측된 한 건을 잘 맞힌 confidence가 아니라 예측 분포를 반복해서 평가할 때 정직한 distribution report가
          기대 score에서 유리해야 한다는 것입니다. 이 이론이 finite test set의 모든 subgroup calibration을 자동 보장하는 것은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1198/016214506000001437" target="_blank" rel="noreferrer">논문 출판 정보 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Test report에는 ranking metric, proper probability score, 선택한 operating point의 confusion counts와 expected cost를 나란히
          둡니다. Threshold·calibrator는 validation 또는 OOF prediction으로 정하고 test에서는 다시 맞추지 않습니다. 전체 평균 아래에
          class·지역·장비·시간 slice와 alert volume을 함께 두어야 실제 처리량과 특정 집단의 실패를 발견할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
