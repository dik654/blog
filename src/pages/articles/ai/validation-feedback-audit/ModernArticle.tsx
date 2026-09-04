import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ValidationFeedbackViz } from "../cross-validation/viz/ModernCrossValidationViz";

export default function ValidationFeedbackAuditArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Local CV와 public score가 다르면 숫자 차이와 선택 순서 차이를 먼저 분리합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Local .80과 public .76이라는 offset만으로 split이 틀렸다고 결론 내릴 수 없습니다. 같은 후보들을 두 평가가 비슷한 순서로 고르는지, metric·row mapping·preprocessing이 같은지부터 확인해야 합니다.</p></div>
        <TermBreakdown title="Mismatch audit의 네 기록" items={[
          { term: "Score offset", description: "같은 후보의 local score와 external score의 절대 차이입니다." },
          { term: "Rank agreement", description: "후보 쌍의 우열 방향을 두 평가가 얼마나 같은 방향으로 판단하는지 나타냅니다." },
          { term: "Protocol adaptation", description: "External feedback을 본 뒤 split·metric·feature·candidate filter를 바꾼 사건입니다." },
          { term: "Frozen holdout", description: "그 선택과 변경에 한 번도 사용하지 않은 마지막 평가 data입니다." },
        ]} />
        <ValidationFeedbackViz />
        <ContentBoundary article="validation-feedback-audit" />
      </section>
      <section id="agreement" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">후보 두 개씩의 우열 방향이 같은 비율을 계산합니다</h2>
        <ExplainedFormula
          question="Pairwise agreement .8은 어떻게 계산하고 무엇을 뜻하나요?"
          idea={<p>후보 a와 b의 local score 차이 부호와 public score 차이 부호를 비교합니다. 의미 있는 tolerance 밖에서 두 부호가 같으면 한 쌍의 선택 방향이 일치합니다.</p>}
          formula={String.raw`A=|\mathcal P|^{-1}\sum_{(a,b)\in\mathcal P}\mathbf 1[\operatorname{sgn}_\tau(\Delta^{L}_{ab})=\operatorname{sgn}_\tau(\Delta^{P}_{ab})]`}
          annotatedFormula={String.raw`\begin{aligned}\Delta^L_{ab}&=\underbrace{s^L_a-s^L_b}_{\text{local에서 후보 a와 b의 우열}}\\\Delta^P_{ab}&=\underbrace{s^P_a-s^P_b}_{\text{public에서 같은 쌍의 우열}}\\m_{ab}&=\underbrace{\mathbf1[\operatorname{sgn}_\tau(\Delta^L_{ab})=\operatorname{sgn}_\tau(\Delta^P_{ab})]}_{\text{tolerance 밖의 방향 일치만 1}}\\A&=\underbrace{|\mathcal P|^{-1}\sum_{(a,b)\in\mathcal P}m_{ab}}_{\text{비교한 후보 쌍에서 일치 비율 계산}}
\end{aligned}`}
          operations={[
            { expression: String.raw`s_a-s_b`, annotation: ["같은 평가 안에서 두 후보를 빼", "선택 방향을 추출"] },
            { expression: String.raw`\operatorname{sgn}_\tau(\Delta)`, annotation: ["작은 noise는 tie로 두고", "의미 있는 양·음 방향만 표시"] },
            { expression: String.raw`|\mathcal P|^{-1}\sum m_{ab}`, annotation: ["방향 일치 indicator를 더한 뒤", "비교한 후보 쌍 수로 정규화"] },
          ]}
          terms={[
            { symbol: String.raw`s^L,s^P`, name: "Local·public scores", description: "같은 metric direction으로 정렬한 후보 score입니다." },
            { symbol: String.raw`\tau`, name: "Tie tolerance", description: "Noise보다 작은 차이를 동점으로 보는 사전 기준입니다." },
            { symbol: String.raw`\mathcal P`, name: "Candidate pairs", description: "두 평가에 모두 존재하는 비교 후보 쌍입니다." },
          ]}
          assumptions={["Metric direction과 candidate identity가 두 평가에서 같습니다.", "Public feedback으로 후보 집합을 만든 경우 adaptive bias를 별도로 기록합니다."]}
          interpretation="10쌍 중 8쌍의 방향이 같으면 A=.8입니다. Private leaderboard 순서가 보장된다는 뜻은 아닙니다."
        />
      </section>
      <section id="adaptation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Public feedback 뒤 protocol을 바꿨다면 bug fix도 adaptation으로 기록합니다</h2>
        <TermBreakdown title="변경 receipt에 남길 항목" items={[
          { term: "Observed feedback", description: "어느 submission·score·error slice를 보고 변경을 시작했는지 기록합니다." },
          { term: "Mismatch hypothesis", description: "Metric parity, row mapping, group/time shift 중 무엇을 의심했는지 씁니다." },
          { term: "Protocol change", description: "Split·preprocess·metric·candidate filter의 before/after revision입니다." },
          { term: "Feedback budget", description: "Holdout 결과가 후속 결정을 바꾼 횟수와 사전 한도입니다." },
        ]} />
      </section>
      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Audit는 적응 편향을 지우지 않으므로 unused holdout으로 닫습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            metric fixture→row checksum→preprocess parity→group/time shift→pairwise direction을 검사한 뒤 protocol을
            동결합니다. 그 과정에서 보지 않은 기간·site·private test에서 마지막으로 확인하고 결과를 본 뒤 다시 바꾸면 새 holdout이 필요합니다.
          </p></div>
        <div id="paper-validation-feedback" className="not-prose mt-8"><CitationBlock source="Blum & Hardt — The Ladder" citeKey={1} type="paper" href="https://proceedings.mlr.press/v37/blum15.html">
          반복적·적응적 submission이 leaderboard holdout에 overfit하는 문제와 score 공개 제한을 다룹니다. 특정 대회의 private score나 일반적인 unbiasedness를 보장하는 근거는 아닙니다.
        </CitationBlock></div>
      </section>
    </div>
  );
}
