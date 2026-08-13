import ExplainedFormula from "@/components/ui/explained-formula";
import FinalStrategyViz from "./viz/FinalStrategyViz";

export default function Final() {
  return (
    <section id="final" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        마감 단계에서는 새 아이디어를 더하기보다 선택 편향과 제출 재현 실패를 줄입니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          후보는 single-fold 최고점이 아니라 OOF 평균과 fold/slice 흔들림, 오류 다양성, 추론 비용과 재현 가능성으로 좁힙니다.
          Ensemble은 같은 OOF 행에서 error가 덜 겹치는 후보만 검토하고, 단순히 비슷한 model을 많이 더하지 않습니다. Weight와
          stacking의 세부 원리는 <a href="/ai/ensemble-methods">앙상블 글</a>로 이어집니다.
        </p>
        <p>
          Public leaderboard 점수는 test 일부에 대한 반복 가능한 피드백이므로 볼 때마다 새 validation signal처럼 작동합니다.
          제출 결과를 보고 feature나 weight를 바꾸었다면 그 선택도 decision log에 기록하고, 사전에 정한 제출 budget과 local
          gate 없이 public score만 추종하지 않습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Public score를 확인한 뒤 후보를 계속 바꾸는 일을 어떻게 감사 가능한 budget으로 만들까요?"
        idea={
          <>
            제출 횟수만 세지 않고, leaderboard 결과가 다음 후보 선택에 실제로 사용된 adaptive feedback event를 셉니다. 단순
            schema 검사는 별도 dry run으로 분리하고, 각 feedback에는 이전 가설과 다음 결정의 연결을 남깁니다.
          </>
        }
        formula={String.raw`B_{\mathrm{used}}=\sum_{m=1}^{M}\mathbf{1}[\,\mathrm{LB}_m\ \text{changed the next decision}\,],\qquad B_{\mathrm{used}}\le B_{\mathrm{predeclared}}`}
        terms={[
          { symbol: "M", name: "number of submissions", description: "대회 서버에 보낸 전체 제출 파일 수입니다." },
          { symbol: "LB_m", name: "leaderboard feedback", description: "m번째 제출에서 관측한 public score 또는 rank입니다." },
          { symbol: "B_used", name: "adaptive feedback used", description: "후속 model·feature·weight 선택을 바꾼 피드백 횟수입니다." },
          { symbol: "B_predeclared", name: "feedback budget", description: "대회 전에 팀이 정한 최대 adaptive decision 횟수입니다." },
        ]}
        assumptions={[
          "Budget은 overfitting을 수학적으로 제거하는 보장이 아니라 adaptive exposure를 제한하고 기록하는 운영 규칙입니다.",
          "Public/private split의 sample 생성·metric·shift가 다르면 gap은 feedback 횟수 외 원인도 가질 수 있습니다.",
          "플랫폼이 score rounding·submission limit·reliable leaderboard mechanism을 제공하더라도 local validation을 대체하지 않습니다.",
        ]}
        interpretation="제출 20개 중 public 결과를 보고 다음 선택을 바꾼 경우가 6번이면 B_used=6입니다. 이유 없는 미세 조정을 멈추고 남은 budget을 독립적인 큰 가설에 씁니다."
      />

      <div className="not-prose my-8">
        <FinalStrategyViz />
      </div>

      <div id="paper-ladder" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · The Ladder: A Reliable Leaderboard for Machine Learning Competitions</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문은 참가자가 leaderboard 결과를 반복해서 보고 다음 submission을 고르는 adaptive evaluation에서 holdout에 overfit할
          수 있다는 문제를 정의하고, 제한적으로 점수를 공개하는 Ladder와 leaderboard accuracy 보장을 제안했습니다. 참가자
          입장에서는 public score를 독립 test처럼 취급하면 안 된다는 근거이며, 단순 제출 횟수 제한만으로 private 성능이 보장된다는
          뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v37/blum15.html" target="_blank" rel="noreferrer">PMLR 논문과 PDF 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          최종 submission manifest에는 candidate/run ID, code·data·split·preprocess·checkpoint checksum, OOF report, full-data retrain
          여부, inference environment, row ID/order, missing·range 검사와 제출 파일 checksum을 넣습니다. Full-data retraining은 fold
          model과 학습 조건이 다르므로 새 artifact로 취급하며, 결과가 나쁘면 되돌릴 수 있도록 선택 후보를 미리 고정합니다.
        </p>
      </div>
    </section>
  );
}
