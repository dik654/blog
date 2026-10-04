import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { MultiFidelityViz } from "../hyperparameter-tuning/viz/ModernHpoViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 모든 후보를 끝까지 돌리기 전에 일부에 자원을 더 줍니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>설정이 많으면 모두 같은 시간 동안 학습시키기 어렵습니다. 짧게 실행한 결과로 계속 볼 후보를 고르면 자원을 아낄 수 있지만 늦게 좋아지는 후보를 놓칠 수도 있습니다.</p><p>이 글은 아홉 후보를 세 후보, 한 후보로 줄이는 과정을 추적합니다. 남긴 후보의 학습량과 실제 추가 비용을 따로 계산하고 멈춘 후보 중 어떤 가능성을 잃었는지 확인합니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 같은 진척에서 비교하고 일부만 더 학습합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>모든 후보를 정한 첫 지점까지 실행합니다. 같은 시험으로 점수를 비교해 일부를 남기고 남은 후보에게 다음 지점까지 자원을 줍니다. 중단 기록도 보존하며 일부는 끝까지 확인해 정책의 놓침을 조사합니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>공통 진척 좌표를 정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>같은 지점의 점수를 비교한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>일부 후보만 다음 지점으로 보낸다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>중단 후보의 놓친 가능성을 조사한다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 아홉 후보를 1·3·9단위에서 비교합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            한 자원 단위를 1,000번의 갱신으로 둡니다. A부터 I까지 아홉 후보를 1단위 학습한 점수는 아래 표와 같습니다. 클수록 좋고 매번 상위 1/3만 계속합니다. (가정)
          </p><p>
            A·B·C가 3단위까지 간 뒤 점수가 0.65·0.63·0.61이라면 A만 9단위까지 갑니다. 마지막 A의 점수는 0.70이라고 합시다. 도중에 B가 멈췄다는 사실만으로
            9단위의 B가 나빴다고 결론낼 수는 없습니다. (가정)
          </p></div><div className="my-8 overflow-x-auto"><table className="w-full border-collapse text-left text-base"><caption className="mb-3 text-left text-muted-foreground">같은 1단위에서 얻은 가정 점수</caption><thead><tr><th className="border-b p-3">후보</th><th className="border-b p-3">점수·클수록 좋음</th></tr></thead><tbody><tr><td className="border-b p-3">A</td><td className="border-b p-3 tabular-nums">0.60</td></tr><tr><td className="border-b p-3">B</td><td className="border-b p-3 tabular-nums">0.59</td></tr><tr><td className="border-b p-3">C</td><td className="border-b p-3 tabular-nums">0.58</td></tr><tr><td className="border-b p-3">D</td><td className="border-b p-3 tabular-nums">0.57</td></tr><tr><td className="border-b p-3">E</td><td className="border-b p-3 tabular-nums">0.56</td></tr><tr><td className="border-b p-3">F</td><td className="border-b p-3 tabular-nums">0.55</td></tr><tr><td className="border-b p-3">G</td><td className="border-b p-3 tabular-nums">0.54</td></tr><tr><td className="border-b p-3">H</td><td className="border-b p-3 tabular-nums">0.53</td></tr><tr><td className="border-b p-3">I</td><td className="border-b p-3 tabular-nums">0.52</td></tr></tbody></table></div></section>

<section id="inside-rungs" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 각 관측에 후보와 진척과 상태를 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            첫 비교 표에는 아홉 후보의 1단위 점수만 들어갑니다. 다음 표에는 살아남은 세 후보의 3단위 점수만 넣습니다. 1단위의 높은 점수와 3단위의 낮은 점수를 같은 순위표에서 직접
            비교하지 않습니다.
          </p><p>중단된 후보에는 어디서 어떤 규칙으로 멈췄는지 남깁니다. 실행 오류로 점수가 없는 경우도 따로 구분합니다. 후보 수 감소와 함께 완료·중단·실패 수가 어떻게 변했는지 보존해야 비용과 놓침을 다시 계산할 수 있습니다.</p></div></section>

<section id="why-coordinate" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 같은 epoch라는 이름만으로 비교 기준이 같지는 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            같은 자료를 한 번 도는 동안 배치 32는 128보다 더 자주 갱신할 수 있습니다. 자료 전체를 한 번 봤다는 양은 같아도 갱신 횟수는 다릅니다. 갱신 수·처리 토큰·사용 시간
            중 무엇을 같게 비교하려는지 먼저 정합니다.
          </p><p>이 사례는 갱신 수를 공통 좌표로 삼았습니다. 같은 갱신 수가 모든 후보의 계산 비용까지 같다는 뜻은 아닙니다. 학습 방법과 배치가 달라진다면 선택한 좌표가 목적에 맞는지 다시 검사합니다.</p></div></section>

<section id="pruning-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 평가 깊이와 비교 지점과 중단 정책에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>후보를 얼마나 깊게 평가했는지가 fidelity입니다. 비교하는 사전 자원 지점은 rung이고 다음 자원을 주지 않고 멈추는 정책은 pruning입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Successive halving", "description": "같은 지점에서 일부 후보만 남기며 다음 자원을 늘리는 절차입니다.", "boundary": "halving이라는 이름이어도 여기서는3배 축소·확대를 사용합니다."}, {"term": "Survivor", "description": "현재 비교를 통과해 다음 자원을 받는 후보입니다.", "boundary": "최종 최적 후보라고 증명된 것은 아닙니다."}, {"term": "False prune", "description": "중단했을 후보가 정한 최종 예산에서는 채택 가능했을 사건입니다.", "boundary": "끝까지 확인하지 않은 후보의 결과는 알 수 없습니다."}]} /><p className="mt-6 text-base text-muted-foreground">
            아래 개념도는 같은 규칙을 27개에서 시작한 더 큰 가정 사례입니다. 본문의 9개 계산과 후보 수를 구별합니다.
          </p><MultiFidelityViz /></section>

<section id="successive-halving" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 후보 수는 3으로 나누고 목표 깊이는 3배 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            처음 수 9를 3으로 나누면 다음은 3, 다시 나누면 1입니다. 후보당 누적 목표는 1에서 3, 다시 9가 됩니다. 일반적으로 정한 감소 비율로 나눈 뒤 후보 수를 정수로
            내립니다. 동점이 생겼을 때의 선발 순서도 미리 고정합니다.
          </p><p>
            27개에서 시작하면 같은 규칙으로 27@r→9@3r→3@9r입니다. 이 표현은 후보 수와 후보당 누적 자원을 보여 줍니다. 새로 쓴 자원을 세려면 이어 학습했는지 다시
            시작했는지를 추가로 알아야 합니다. (가정)
          </p></div><ExplainedFormula
          question="Rung가 올라갈 때 후보 수와 후보당 resource는 어떻게 변하나요?"
          idea={
            <p>
              각 단계에서 상위 1/η만 남기고 살아남은 configuration에 이전 단계의 η배 resource를 줍니다.
            </p>
          }
          formula={String.raw`n_j=\lfloor n_0\eta^{-j}\rfloor,\quad r_j=r_0\eta^j`}
          annotatedFormula={String.raw`\begin{aligned}n_j&=\underbrace{\left\lfloor\frac{n_0}{\eta^j}\right\rfloor}_{\substack{\text{rung마다 후보 수를}\eta\text{ 비율로 축소}}}\\r_j&=\underbrace{r_0\eta^j}_{\substack{\text{살아남은 후보의 resource를}\eta\text{ 배씩 확대}}}\\B_j&=\underbrace{n_jr_j}_{\text{해당 후보의 누적 목표량 합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`n_0/\eta^j`,
              annotation: [
                "초기 후보 수를 rung별 감소율로 나눠",
                "현재 비교할 후보 수 계산",
              ],
            },
            {
              expression: String.raw`r_0\eta^j`,
              annotation: [
                "초기 resource에 rung별 배율을 곱해",
                "survivor 한 개의 평가 깊이 계산",
              ],
            },
            {
              expression: String.raw`n_jr_j`,
              annotation: [
                "후보 수와 후보당 resource를 곱해",
                "누적 목표량 합이며 추가 비용과 구별",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`n_0`,
              name: "Initial candidates",
              description: "첫 rung에서 시작하는 configurations 수입니다.",
            },
            {
              symbol: String.raw`r_0`,
              name: "Initial resource",
              description: "첫 intermediate evaluation까지의 자원입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Reduction factor",
              description:
                "후보 축소와 resource 확대에 쓰는 1보다 큰 비율입니다.",
            },
            {
              symbol: "j",
              name: "Rung index",
              description: "0부터 시작하는 resource 단계입니다.",
            },
          ]}
          assumptions={[
            "같은 rung의 scores가 같은 validation fixture에서 비교 가능합니다.",
            "Early rank가 final rank와 어느 정도 연결됩니다.",
            "Checkpoint resume가 training semantics를 바꾸지 않습니다.","j는 살아 있는 후보가 남고 정한 최대 자원을 넘지 않는 단계까지입니다. 동점 처리도 미리 정합니다.",
          ]}
          interpretation="9개를1단위에서 시작하고 η=3이면9@1 →3@3 →1@9입니다. n_jr_j는 각 단계 후보의 누적 목표량 합이고 재개 시 새로 쓰는 비용의 합이 아닙니다."
        /></section>

<section id="resource-accounting" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 누적 목표 9와 새로 쓰는 6을 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            모델 상태를 보존해 이어 학습한다고 합시다. 첫 단계는 9×1=9단위, 다음은 3×(3−1)=6단위, 마지막은 1×(9−3)=6단위입니다. 실제 추가 학습량 합은
            21단위입니다. 모두 9단위까지 학습하는 81단위보다 60단위 적습니다. (가정)
          </p><p>
            각 단계를 처음부터 다시 실행하면 9×1+3×3+1×9=27단위입니다. 각 단계의 후보 수와 누적 목표의 곱을 그대로 더하면 이 재시작 비용을 계산한 셈입니다. 평가·저장·복구
            비용은 이 단순 갱신 수 계산에 포함하지 않았습니다. (가정)
          </p></div></section>

<section id="paper-hyperband" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 원문의 안쪽 반복에 같은 후보 수와 자원을 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Hyperband 논문 알고리즘 1의 안쪽 반복은 남은 후보 수와 자원 목표를 계산한 뒤 상위 일부를 남깁니다. 원문은 작은 손실이 좋은 방향이고 앞 사례는 큰 점수가 좋으므로
            같은 순서를 쓰려면 손실을 1−점수처럼 바꿔 읽습니다.
          </p></div><div id="source-halving" className="mt-8 scroll-mt-20"><CitationBlock source="Hyperband — Algorithm 1, lines5–6, PDF p.8" citeKey={1} href="https://jmlr.org/papers/volume18/16-558/16-558.pdf"><q>nᵢ = ⌊nη<sup>−i</sup>⌋, rᵢ = rη<sup>i</sup></q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            n=9, r=1, η=3을 넣으면 i=0·1·2에서 후보 수 9·3·1, 자원 1·3·9가 나옵니다. R=9인 가장 공격적인 bracket도 이 경로를 갖습니다. 원문 전체는
            다른 초기 후보 수와 자원의 조합도 반복하며 이 한 경로가 Hyperband 전체는 아닙니다. (가정)
          </p></div></div></section>

<section id="false-prune-audit" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 멈춘 표본 20개 중 4개를 놓쳤다면 분모는 20입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>완료된 사전 실험 곡선에 중단 규칙을 적용하면 어느 후보를 잘랐을지 재현할 수 있습니다. 실제 중단 후보 일부를 따로 끝까지 실행해도 놓침을 조사할 수 있습니다. 같은 최종 품질 기준과 필수 조건을 먼저 정합니다.</p><p>
            중단 100개 중 무작위로 고른 20개를 끝까지 실행했더니 4개가 채택 가능했다고 합시다. 관측 비율은 4/20=20%입니다. 나머지 80개는 관측하지 않았으므로 4/100으로
            나누거나 전체 놓친 수가 4라고 쓰지 않습니다. (가정)
          </p><p>
            유망해 보이는 후보만 골라 조사하면 그 20%를 전체로 그대로 확장할 수 없습니다. 표본 추출 방식과 가중치, 표본 크기와 불확실성을 보고합니다. 아래 비율의 분모는 중단 후보
            수이며 실제 채택 가능 후보 전체를 분모로 삼는 일반적인 false negative rate와 다릅니다.
          </p></div><ExplainedFormula
          question="Pruner가 놓친 late bloomer 비율은 어떻게 계산하나요?"
          idea={
            <p>
              정책이 중단했을 후보 중 full-budget 결과가 최종 채택 기준을 통과한 수를 세어 정책이 중단할 후보 수로 나눕니다.
            </p>
          }
          formula={String.raw`\widehat q_{\rm missed\mid pruned}=\frac{\sum_{i\in\mathcal C}\mathbf1[P_i=1,F_i=1]}{\sum_{i\in\mathcal C}\mathbf1[P_i=1]}`}
          annotatedFormula={String.raw`\begin{aligned}P_i&=\underbrace{\mathbf1[\text{policy prunes }i]}_{\text{감사에서 재현한 중단 결정}}\\F_i&=\underbrace{\mathbf1[y_i(R)\ge\tau_F]\,c_i}_{\text{최종 품질과 필수 조건 통과}}\\N_m&=\underbrace{\sum_{i\in\mathcal C}P_iF_i}_{\text{감사 표본의 놓친 후보 수}}\\N_p&=\underbrace{\sum_{i\in\mathcal C}P_i}_{\text{감사 표본의 중단 후보 수}}\\\widehat q_m&=\underbrace{N_m/N_p}_{\text{관측된 중단 중 채택 가능 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[\text{policy prunes }i]`,
              annotation: [
                "중간 score와 rule을 비교해",
                "중단 결정의 binary indicator 생성",
              ],
            },
            {
              expression: String.raw`P_iF_i`,
              annotation: [
                "중단 결정과 final feasibility를 함께 요구해",
                "false prune 사건만 표시",
              ],
            },
            {
              expression: String.raw`N_{\rm missed}/\sum_iP_i`,
              annotation: [
                "놓친 finalist 수를 전체 중단 수로 나눠",
                "pruning miss rate 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`P_i`,
              name: "Prune decision",
              description: "Policy가 trial i를 중단할지 나타냅니다.",
            },
            {
              symbol: String.raw`F_i`,
              name: "Finalist outcome",
              description:
                "Full budget 결과가 hard constraints와 quality 기준을 통과했는지 나타냅니다.",
            },
            {
              symbol: String.raw`N_{\rm missed}`,
              name: "Missed finalists",
              description: "중단 때문에 잃었을 채택 가능 후보 수입니다.",
            },
          ]}
          assumptions={[
            "Audit cohort 일부는 full budget까지 실행해 counterfactual outcome을 관측합니다.",
            "Finalist criterion은 pruning 결과를 보기 전에 고정합니다.",
            "Model family·schedule별 miss rate도 함께 확인합니다.","C는 끝까지 확인한 감사 cohort이고 분모 N_p>0이어야 합니다. c_i는 필수 조건을 통과하면1, 아니면0인 지시자입니다.","전체 중단 집단으로 확장하려면 표본 추출 방식과 불확실성을 확인합니다. 이 분모는 실제 양성 수인 일반 FNR과 다릅니다.",
          ]}
          interpretation="중단100개 중 무작위20개를 끝까지 조사해4개가 채택 가능했다면 관측 비율은4/20=20%입니다. 4/100이 아니며 나머지80개의 결과를 안다는 뜻도 아닙니다."
        /><div id="source-prune-envelope" className="mt-8 scroll-mt-20"><CitationBlock source="Hyperband — §3.1, PDF p.7" citeKey={1} href="https://jmlr.org/papers/volume18/16-558/16-558.pdf"><q>more resources are needed to differentiate between the two configurations</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            원문은 중간값과 최종값의 차이를 감싸는 범위가 넓거나 최종 후보의 차이가 작으면 구별에 더 많은 자원이 든다고 설명합니다. B의 3단위 0.63만 보고 9단위 결과를 안다고 할
            수 없는 이유입니다. 여기의 20개 표본 감사는 그 위험을 확인하기 위한 별도 운영 설계이며 논문이 20%라는 값을 보장하거나 이 감사 비율을 제안했다는 뜻은 아닙니다.
          </p></div></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 늦게 좋아지는 후보와 재개 상태를 따로 검사합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            3단위 점수 0.63으로 멈춘 B를 따로 끝까지 실행했더니 0.85라고 합시다. 최종 채택 기준 0.80을 통과하므로 이 감사에서는 놓친 후보입니다. 초기 순위만으로 최종
            순위를 보장할 수 없으며 유예 기간과 중단 강도를 조절할 근거가 됩니다. (가정)
          </p><p>이어 학습할 때 모델 가중치만 복구하고 갱신기·난수·스케줄 상태를 잃으면 처음부터 같은 절차를 이어 간 것이 아닐 수 있습니다. 갱신 수의 절약과 실제 시간·복구 비용도 따로 보고 최종 후보는 정한 전체 예산과 독립 평가에서 확인합니다.</p></div><ContentBoundary article="multi-fidelity-pruning" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 줄인 후보와 절약한 자원과 놓친 후보를 구별했나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            9@1→3@3→1@9를 이어 학습할 때 추가 자원은 왜 27이 아니라 21단위인가요? (답: 8절)
          </p><p>
            중단 100개 중 20개만 끝까지 확인해 4개가 채택 가능했습니다. 관측 비율의 분모는 무엇인가요? (답: 10절)
          </p><p>
            3단위에서 멈춘 B가 9단위에서는 0.85였다면 초기 순위에 대해 무엇을 알 수 있나요? (답: 11절)
          </p></div></section></div>; }
