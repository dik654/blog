import ExplainedFormula from "@/components/ui/explained-formula";
import CVLBViz from "./viz/CVLBViz";

export default function CVLB() {
  return (
    <section id="cv-lb" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CV와 leaderboard가 다르면 public 점수에 맞추기 전에 두 평가가 같은 질문을 하는지 확인합니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Local CV와 leaderboard의 절대값이 다른 이유는 metric 구현, row mapping, preprocessing·inference parity, group/time/category
          shift, 작은 public sample, 적응적 제출 등 여러 가지입니다. Public score 한 번에 맞춰 split을 바꾸면 그 subset의 정보를
          local validation에 간접적으로 주입할 수 있습니다.
        </p>
        <p>
          먼저 동일 candidate의 local과 public score가 같은 방향으로 움직이는지 봅니다. 절대 score offset이 있어도 더 나은
          local 후보가 public에서도 대체로 더 낫다면 선택 기능은 남아 있습니다. 반대로 후보 순서가 자주 뒤집히면 원인을
          family·slice·time별로 분해합니다.
        </p>
      </div>

      <ExplainedFormula
        question="두 평가의 절대값이 달라도 후보 선택 순서가 얼마나 일치하는지 어떻게 셀까요?"
        idea={
          <>
            후보 쌍마다 local 차이와 leaderboard 차이의 부호가 같은지 셉니다. Metric 방향은 모두 “클수록 좋음”으로 맞춘 뒤,
            동점이나 측정 오차 이내 차이는 사전에 정한 규칙으로 제외하거나 반점 처리합니다.
          </>
        }
        formula={String.raw`A_{\mathrm{rank}}=\frac{1}{\binom{M}{2}}\sum_{a<b}\mathbf{1}\!\left[(s_a^{\mathrm{CV}}-s_b^{\mathrm{CV}})(s_a^{\mathrm{LB}}-s_b^{\mathrm{LB}})>0\right]`}
        terms={[
          { symbol: "M", name: "submitted candidates", description: "동일한 local protocol과 제출 mapping을 가진 후보 수입니다." },
          { symbol: "s^CV", name: "local score", description: "Frozen local validation에서 계산한 후보 점수입니다." },
          { symbol: "s^LB", name: "leaderboard score", description: "같은 후보의 public leaderboard 점수입니다." },
          { symbol: "A_rank", name: "pairwise direction agreement", description: "후보 쌍 중 두 평가에서 우열 방향이 같은 비율입니다." },
        ]}
        assumptions={[
          "후보는 leaderboard 결과를 보기 전에 생성됐거나 adaptive 여부를 별도 표시해야 합니다.",
          "Public sample이 작으면 score difference 자체가 noisy하므로 tolerance와 uncertainty를 함께 둡니다.",
          "Agreement가 높아도 private distribution이 같다는 보장은 없고, 반복 제출은 public holdout에 overfit할 수 있습니다.",
        ]}
        interpretation="10개 후보 쌍 중 8개의 우열이 같으면 A_rank=.8입니다. 절대 점수 offset보다 선택 순서가 꽤 유지된다는 근거지만 독립 holdout을 대체하지는 않습니다."
      />

      <div className="not-prose my-8">
        <CVLBViz />
      </div>

      <div id="standard-sklearn-cv" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 · scikit-learn cross-validation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 문서는 KFold·StratifiedKFold·GroupKFold·StratifiedGroupKFold·TimeSeriesSplit 등 splitter가 보존하는 제약과 API를
          설명하며, classical KFold가 i.i.d. sample을 가정해 time series에서 부적절한 평가를 만들 수 있음을 명시합니다. 현재
          설치 version의 splitter parameter와 metadata routing을 확인해야 하며, library class 선택만으로 올바른 group ID·cutoff가
          자동 생성되지는 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://scikit-learn.org/stable/modules/cross_validation.html" target="_blank" rel="noreferrer">Splitter 가정과 현재 API 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Protocol을 바꿀 때는 mismatch 가설, 변경 전후 candidate 순서, public feedback 사용 여부와 변경 시점을 기록합니다.
          여러 번 조정한 CV는 그 자체가 public data에 fit된 절차이므로, 마지막에는 protocol 선택에 쓰지 않은 private holdout 또는
          다음 기간·새 site에서 결론이 유지되는지 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
