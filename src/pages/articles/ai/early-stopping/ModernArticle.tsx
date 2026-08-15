import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { EarlyStoppingMechanismViz } from "../regularization-practice/viz/ModernRegularizationViz";

export default function EarlyStoppingArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Early stopping은 학습법이 아니라 trajectory에서 checkpoint를 고르는 상태 기계입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">먼저 validation event, best metric, minimum improvement, bad-event counter, patience를 하나씩 정의합니다. 그 뒤에야 언제 멈추고 어떤 artifact를 반환할지 조합합니다.</p></div>
      <TermBreakdown title="상태 기계의 다섯 값" items={[
        { term: "Validation event", description: "정해진 cadence에서 checkpoint 하나를 평가한 사건입니다.", example: "매 1000 update마다 val loss를 계산합니다." },
        { term: "Best metric b", description: "지금까지 선택 방향에서 가장 좋았던 값입니다.", example: "Loss를 최소화한다면 b=.38입니다." },
        { term: "Minimum improvement δ", description: "Noise를 개선으로 오인하지 않게 요구하는 최소 차이입니다.", example: "δ=.01이면 .375는 .38보다 충분히 좋지 않을 수 있습니다." },
        { term: "Bad-event counter c", description: "충분한 개선이 없었던 연속 evaluation 횟수입니다.", example: ".39,.40이면 c=2입니다." },
        { term: "Patience P", description: "Stop 전에 허용하는 bad event 수입니다.", example: "P=2이고 c=3이면 stop합니다.", boundary: "Update 수가 아니라 evaluation 횟수입니다." },
      ]} />
      <EarlyStoppingMechanismViz />
      <ContentBoundary article="early-stopping" />
    </section>
    <section id="state-machine" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Metric을 비교해 best 또는 bad counter 하나만 갱신합니다</h2>
      <ExplainedFormula question="각 validation event에서 state는 어떻게 바뀌나요?" idea={<p>Loss 최소화 기준에서는 새 metric이 best에서 δ보다 더 내려가야 개선입니다. 개선이면 best를 저장하고 counter를 0으로, 아니면 counter만 1 올립니다.</p>} formula={String.raw`I_j=[m_j<b_{j-1}-\delta]`} annotatedFormula={String.raw`\begin{aligned}I_j&=\underbrace{\mathbf 1[m_j<b_{j-1}-\delta]}_{\text{noise를 넘는 실제 개선인지 판정}}\\b_j&=\begin{cases}\underbrace{m_j}_{\text{새 best를 기록}},&I_j=1\\\underbrace{b_{j-1}}_{\text{이전 best 유지}},&I_j=0\end{cases}\\c_j&=\begin{cases}\underbrace{0}_{\text{개선했으므로 기다림 초기화}},&I_j=1\\\underbrace{c_{j-1}+1}_{\text{개선 없는 event를 누적}},&I_j=0\end{cases}\end{aligned}`} operations={[
        { expression: String.raw`m_j<b_{j-1}-\delta`, annotation: ["새 loss가 이전 best보다", "최소 개선폭 이상 낮은지 판정"] },
        { expression: String.raw`c_{j-1}+1`, annotation: ["연속 비개선 횟수를", "evaluation event마다 하나 누적"] },
      ]} terms={[
        { symbol: "m_j", name: "Current validation metric", description: "j번째 evaluation에서 관측한 loss입니다." },
        { symbol: "b_j", name: "Best metric", description: "j번째 event까지의 선택 기준 최적값입니다." },
        { symbol: "c_j", name: "Bad-event counter", description: "연속 비개선 evaluation 횟수입니다." },
      ]} assumptions={["Loss를 minimize하는 방향입니다.", "Evaluation cadence와 metric definition이 고정됩니다."]} interpretation=".42,.38,.39,.40,.41에서 δ=0이면 eval2가 best이고 이후 counter가 1,2,3으로 증가합니다." />
    </section>
    <section id="stop-and-restore" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Stop event는 last를 버리고 best artifact를 복원하라는 신호입니다</h2>
      <ExplainedFormula question="언제 멈추고 어느 checkpoint를 반환할까요?" idea={<p>Counter가 patience를 초과하면 현재 update를 더 진행하지 않습니다. 반환 index는 stop index가 아니라 metric이 가장 좋았던 evaluation입니다.</p>} formula={String.raw`j_{\mathrm{stop}}=\min\{j:c_j>P\},\quad j^*=\arg\min_k m_k`} annotatedFormula={String.raw`\begin{aligned}j_{\mathrm{stop}}&=\underbrace{\min\{j:c_j>P\}}_{\text{허용 비개선 횟수를 처음 넘은 event}}\\j^*&=\underbrace{\arg\min_{k\le j_{\mathrm{stop}}}m_k}_{\text{stop 이전 metric이 가장 좋았던 artifact}}\\\theta_{\mathrm{return}}&=\underbrace{\theta_{j^*}}_{\text{last가 아니라 immutable best를 복원}}\end{aligned}`} operations={[
        { expression: String.raw`\min\{j:c_j>P\}`, annotation: ["condition을 만족한 후보 중", "가장 이른 stop event를 선택"] },
        { expression: String.raw`\arg\min_k m_k`, annotation: ["평가한 checkpoint들을 비교해", "loss가 가장 낮은 index를 선택"] },
      ]} terms={[
        { symbol: "P", name: "Patience", description: "허용한 연속 비개선 event 수입니다." },
        { symbol: "j*", name: "Best evaluation index", description: "반환할 immutable snapshot의 index입니다." },
        { symbol: "θreturn", name: "Returned parameters", description: "새 process에서도 복원 가능한 best model state입니다." },
      ]} assumptions={["Best event마다 durable snapshot을 저장합니다.", "Metric direction과 tie rule이 고정됩니다."]} interpretation="P=2이면 eval5에서 c=3으로 stop하지만 eval2 checkpoint를 반환합니다." />
    </section>
    <section id="artifact" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Best artifact에는 model만 아니라 재현에 필요한 state를 묶습니다</h2>
      <TermBreakdown title="복원 receipt" items={[
        { term: "Model state", description: "선택된 evaluation의 immutable parameter snapshot입니다." },
        { term: "Optimizer·scheduler state", description: "Resume한다면 moment, LR clock, scaler까지 같은 trajectory를 이어 갑니다." },
        { term: "Data contract", description: "Preprocessing, label mapping, validation manifest digest를 저장합니다." },
        { term: "Selection receipt", description: "Metric, direction, δ, patience, cadence, best/stop index를 남깁니다." },
      ]} />
      <div id="paper-early-stopping" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Prechelt — Early Stopping — but when?" citeKey={1} type="paper" href="https://pubmed.ncbi.nlm.nih.gov/12662814/">여러 stopping criterion의 generalization과 training-time trade-off를 비교합니다. 특정 patience 값이 현대 모델의 보편 default라는 뜻은 아닙니다.</CitationBlock></div>
    </section>
  </div>;
}
