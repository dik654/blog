import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { TuningContractViz } from "./viz/ModernHpoViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 같은 시험을 거친 설정을 고르고 새 시험으로 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>학습률이나 모델의 깊이를 바꾸면 결과도 바뀝니다. 여러 설정을 시험했을 때 가장 좋았던 숫자만 남기면 얼마나 많은 시도를 했고 어떤 조건으로 골랐는지 알 수 없습니다.</p><p>이 글은 설정 세 개를 같은 조건에서 비교해 하나를 고르는 과정을 따릅니다. 선택에 쓰는 시험과 선택이 끝난 뒤 성능을 보고할 시험을 나누고 전체 탐색 비용을 함께 계산합니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 조건을 정하고 시험하고 고른 뒤 별도로 평가합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>비교할 자료와 계산법, 후보당 학습량과 종료 조건을 먼저 정합니다. 그 안에서 여러 설정을 실행해 점수를 모으고 가장 좋은 후보를 고릅니다. 고른 절차를 고정한 뒤 선택에 사용하지 않은 자료로 평가합니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>자료·평가법·학습량을 고정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>후보들을 실행하며 누적 비용을 센다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>선택용 점수로 한 후보를 고른다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>닫아 둔 자료로 최종 절차를 평가한다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 세 설정 중 B를 고르지만 보고할 숫자는 따로 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            학습률만 다른 A·B·C를 같은 자료 분할과 계산법으로 평가한다고 합시다. 후보마다 2,000번 갱신하고 같은 seed 정책을 사용합니다. 비용은 각각 10 GPU분, 선택용
            손실은 0.24·0.20·0.22이며 작을수록 좋습니다. (가정)
          </p><p>
            탐색 예산 30 GPU분을 모두 쓰고 B를 고릅니다. 이후 별도로 예약한 자원으로 고정된 B 절차를 독립 자료에서 평가한 손실은 0.23이라고 합시다. 선택할 때 본 0.20과
            마지막 시험의 0.23을 함께 남깁니다. (가정)
          </p></div></section>

<section id="inside-study" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 설정과 실행과 선택 결과를 다른 기록으로 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>각 설정에 학습률과 고정 조건을 적고 실제 실행마다 고유 번호를 붙입니다. 실행 기록에는 쓴 자료, 완료한 갱신 수, 실패 여부, 점수와 비용이 들어갑니다. 실패하거나 다시 실행한 기록도 지우지 않습니다.</p><p>
            B를 고른 결정에는 어떤 A·B·C 점수표를 보았는지 연결합니다. 마지막 평가 기록은 그 뒤에 붙입니다. 이 연결이 있어야 0.23이 어느 설정과 어느 선택 과정의 결과인지
            설명할 수 있습니다.
          </p></div></section>

<section id="why-contract" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 더 오래 학습한 효과가 설정의 효과와 섞이지 않게 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            A는 2,000번, B는 20,000번 갱신했다면 점수 차이는 학습률과 학습량의 차이를 함께 포함합니다. 이 예에서는 학습률만 바꿔 비교하므로 후보별 갱신 수를 고정합니다.
            (가정)
          </p><p>같은 갱신 수가 항상 같은 계산 비용이나 처리 토큰을 뜻하는 것은 아닙니다. 배치 크기까지 바꾸는 실험이라면 어떤 자원 좌표를 같게 비교할지 목적에 맞게 다시 정합니다. 여러 seed를 쓴다면 개수와 집계 규칙도 사전에 고정합니다.</p></div></section>

<section id="tuning-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 설정 묶음과 실행과 선택용 평가에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>시험 전에 정하는 학습률 같은 값이 hyperparameter이고 그 묶음이 configuration입니다. 학습 중 자료를 보고 바뀌는 모델 가중치는 parameter입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Trial", "description": "한 설정을 정해진 자료·학습량·seed 정책으로 평가하는 실행입니다.", "boundary": "실패와 재시도는 별도 실행 이력으로 보존합니다."}, {"term": "Study", "description": "같은 목적과 공간 개정 아래 모은 실행과 선택의 이력입니다.", "boundary": "점수 계산법이나 범위를 바꾸면 개정 사실을 남깁니다."}, {"term": "Validation", "description": "여러 후보 중 무엇을 고를지 판단하는 평가입니다.", "boundary": "여러 번 고르는 데 쓴 최저 점수를 독립 평가처럼 해석하지 않습니다."}, {"term": "Outer evaluation", "description": "선택이 끝날 때까지 쓰지 않은 자료에서 고정된 절차를 평가합니다.", "boundary": "결과를 보고 다시 바꾸면 그 자료도 선택에 쓰인 것입니다."}]} /><TuningContractViz /></section>

<section id="selection-contract" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 후보별 10을 누적해 30을 확인한 뒤 B를 고릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            세 실행의 비용을 더하면 10+10+10=30 GPU분입니다. 각 후보 비용이 30보다 작다는 검사만으로는 전체 예산을 지킬 수 없습니다. 같은 비용의 넷째 후보를 추가하면
            40이 됩니다. 실패한 실행이 자원을 썼다면 그 비용도 합칩니다. (가정)
          </p><p>
            실제로 유효한 점수를 얻은 A·B·C만 비교하면 0.20인 B가 최소입니다. 관측하지 않은 모든 설정 가운데 최선이라고 증명한 것은 아닙니다. 동점 처리도 사전에 정한 규칙을
            따릅니다.
          </p></div><ExplainedFormula
          question="여러 configurations 중 무엇을 고르고 최종 위험은 어디에서 계산하나요?"
          idea={
            <p>
              같은 계약으로 실행한 후보 중 validation risk가 가장 작은 설정을
              선택합니다. 그 설정으로 고정한 procedure는 선택에 쓰지 않은 outer
              data에서 다시 평가합니다.
            </p>
          }
          formula={String.raw`\widehat\lambda=\arg\min_{\lambda\in\mathcal S_T}\widehat R_{\rm val}(A_\lambda),\quad \widehat R_{\rm final}=\widehat R_{\rm outer}(A_{\widehat\lambda})`}
          annotatedFormula={String.raw`\begin{aligned}C_T&=\underbrace{\sum_{i\in\mathcal A_T}c_i}_{\text{시도 전체의 누적 비용}}\\C_T&\le\underbrace{T}_{\text{전체 탐색 예산}}\\v_\lambda&=\underbrace{\widehat R_{\rm val}(A_\lambda)}_{\text{같은 선택용 평가}}\\\widehat\lambda&=\underbrace{\arg\min_{\lambda\in\mathcal S_T}v_\lambda}_{\text{유효하게 평가한 후보 중 선택}}\\\widehat R_{\rm final}&=\underbrace{\widehat R_{\rm outer}(A_{\widehat\lambda})}_{\text{선택에 쓰지 않은 자료로 평가}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sum_{i\in\mathcal A_T}c_i\le T`,
              annotation: [
                "실패를 포함한 시도의 누적 비용을 비교해",
                "총 예산을 지킨 실제 평가 집합을 기록",
              ],
            },
            {
              expression: String.raw`\arg\min_{\lambda\in\mathcal S_T}\widehat R_{\rm val}(A_\lambda)`,
              annotation: [
                "같은 validation risk들을 비교해",
                "선택할 configuration을 반환",
              ],
            },
            {
              expression: String.raw`\widehat R_{\rm outer}(A_{\widehat\lambda})`,
              annotation: [
                "선택된 설정을 고정하고",
                "사용하지 않은 data에서 final risk 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\lambda`,
              name: "Configuration",
              description: "한 trial을 규정하는 hyperparameter 묶음입니다.",
            },
            {
              symbol: String.raw`\mathcal S_T`,
              name: "Evaluated set",
              description: "예산 T 안에서 실제 관측한 후보 집합입니다.",
            },
            {
              symbol: String.raw`A_\lambda`,
              name: "Configured procedure",
              description:
                "설정만 다르고 split·metric·resource는 같은 학습 절차입니다.",
            },
            {
              symbol: String.raw`\widehat R_{\rm outer}`,
              name: "Outer risk",
              description: "선택에 사용하지 않은 evaluation data의 risk입니다.",
            },
          ]}
          assumptions={[
            "모든 trial이 같은 fold manifest·metric code·resource 단위를 사용합니다.",
            "Candidate 수가 늘면 best validation score의 우연한 낙관도 커질 수 있습니다.",
            "Outer score를 본 뒤 변경하면 새 독립 평가가 필요합니다.","A_T는 비용을 쓴 전체 실행이고 S_T는 그중 동일 계약의 유효 점수가 있는 후보 집합입니다. 재시도 비용도 합산합니다.","GPU분처럼 합할 수 있는 자원 예산 T를 사용합니다. 벽시계 한도와 후보별 학습량은 별도 제약입니다.",
          ]}
          interpretation="A/B/C를 각10 GPU분으로 유효하게 평가하면 누적30이고 S_T={A,B,C}입니다. 손실0.24·0.20·0.22에서 B를 고른 뒤 별도 독립 평가0.23을 보고합니다."
        /></section>

<section id="trial-budget" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 좋은 영역을 놓칠 확률에서 탐색 횟수를 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            각 무작위 추첨이 목표를 만족하는 영역에 들어갈 확률을 0.05라고 가정합니다. 한 번 놓칠 확률은 0.95입니다. 같은 분포에서 독립적으로 세 번 뽑으면 모두 놓칠 확률은
            0.95³이고 한 번 이상 맞힐 확률은 1−0.95³=0.142625입니다. (가정)
          </p><p>
            같은 가정으로 20회면 약 64.15%,60회면 약 95.39%입니다. 실제 좋은 영역의 크기를 알고 있다는 뜻은 아닙니다. 앞 결과에 따라 다음 후보를 바꾸는 탐색에는 고정된
            0.05와 독립성 가정을 그대로 적용할 수 없습니다.
          </p></div><ExplainedFormula
          question="한 trial이 좋은 영역을 만날 확률이 p일 때 N회 중 한 번 이상 성공할 확률은 얼마인가요?"
          idea={
            <p>
              한 번 놓칠 확률을 먼저 구하고 독립적인 N회가 모두 놓칠 확률을 만든 뒤 전체 확률 1에서 뺍니다.
            </p>
          }
          formula={String.raw`P(\text{hit})=1-(1-p)^N`}
          annotatedFormula={String.raw`\begin{aligned}q&=\underbrace{1-p}_{\text{한 번의 miss 확률}}\\q_N&=\underbrace{q^N}_{\text{N회 모두 miss}}\\P_{\rm hit}&=\underbrace{1-q_N}_{\text{전부 실패한 경우 제거}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-p`,
              annotation: [
                "전체 probability mass에서 유망 영역을 빼",
                "한 번의 miss probability 계산",
              ],
            },
            {
              expression: String.raw`q^N`,
              annotation: [
                "독립 miss probability를 N번 곱해",
                "모든 trial이 실패할 확률 계산",
              ],
            },
            {
              expression: String.raw`1-q_N`,
              annotation: [
                "전체 경우에서 모두 놓친 경우를 빼",
                "적어도 한 번 hit할 확률 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "p",
              name: "Promising-region mass",
              description:
                "Sampling distribution에서 목표 이상 영역이 차지하는 확률입니다.",
            },
            {
              symbol: "N",
              name: "Independent trials",
              description:
                "같은 distribution에서 독립적으로 뽑은 후보 수입니다.",
            },
            {
              symbol: String.raw`q_N`,
              name: "All-miss probability",
              description: "N회가 모두 유망 영역 밖에 놓일 확률입니다.",
            },
          ]}
          assumptions={[
            "Trial draws가 독립이고 p가 고정된 단순 모델입니다.",
            "실제 p를 안다는 뜻이 아니라 budget 감각을 위한 계산입니다.",
            "Invalid configuration은 feasible space에서 제거하거나 별도 failure probability로 기록합니다.",
          ]}
          interpretation="p=.05라면 N=20의 hit probability는 약 64%, N=60은 약 95%입니다. Search algorithm 이름만 바꿔서는 작은 p를 보상할 수 없습니다."
        /></section>

<section id="paper-random-search" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 논문이 고르는 것도 실제로 시험한 후보 중 하나입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Bergstra·Bengio의 2012 논문 282쪽 식(4)는 실제 시험한 유한 후보 집합에서 평가 함수가 가장 작은 설정을 택합니다. 전 공간의 이상적 최적화와 실제 선택을
            근사 기호로 구분합니다.
          </p></div><div id="source-random-selection" className="mt-8 scroll-mt-20"><CitationBlock source="Random Search for Hyper-Parameter Optimization — p.282, equation (4)" citeKey={1} href="https://jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf"><q>argmin<sub>λ∈&#123;λ<sup>(1)</sup>…λ<sup>(S)</sup>&#125;</sub> Ψ(λ) ≡ λ̂</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            원문의 후보 집합에 A·B·C를 넣고 Ψ 값을 0.24·0.20·0.22로 놓으면 λ̂는 B입니다. 이 식은 관측하지 않은 설정의 점수를 알려 주지 않으며 평가값 0.20이
            실제 미래 위험과 같다는 보장도 하지 않습니다. (가정)
          </p></div></div></section>

<section id="outer-evaluation" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 마지막 평가를 본 뒤 바꾸면 새 선택 과정이 됩니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            B의 독립 평가 0.23을 보고 학습률을 다시 고르면 그 자료도 선택 과정에 들어갑니다. 변경 이유와 새 공간 개정을 기록하고 최종 성능을 확인할 새 독립 자료를 마련해야
            합니다. 이미 본 결과를 없었던 것처럼 숨기지 않습니다.
          </p><p>완료 기록에는 자료 분할·평가 코드·공간 버전·후보당 학습량·총 실행과 실패·종료 규칙·선택 설정·독립 결과를 함께 남깁니다. 마지막 재학습의 자료 범위와 seed 정책도 고정합니다.</p></div><div id="source-random-evaluation" className="mt-8 scroll-mt-20"><CitationBlock source="Random Search for Hyper-Parameter Optimization — §2.2, p.285" citeKey={1} href="https://jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf"><q>Ψ<sup>(valid)</sup>(λ), Ψ<sup>(test)</sup>(λ)</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            논문은 validation과 test의 성능 함수부터 별도로 정의합니다. 이 사례의 0.20은 전자, 닫아 둔 자료의 0.23은 후자에 대응합니다. 논문이 뒤에서 여러 근접
            후보의 선택 불확실성을 가중 평균하는 방법까지 제안한다는 점은 별도이며 이 글의 단일 B 보고와 같다고 주장하지 않습니다. (가정)
          </p></div></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 비교 계약이 맞아도 작은 시험의 불확실성은 남습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>후보를 많이 시험하면 우연히 좋은 선택용 점수를 만날 가능성도 커집니다. 여러 seed의 변동과 평가 자료의 크기를 함께 보고 최저 숫자 하나로 선택의 안정성을 단정하지 않습니다.</p><p>일부 축만 성능에 크게 영향을 준다면 격자보다 무작위 탐색이 그 축의 값을 다양하게 볼 수 있습니다. 원 논문의 분석과 실험은 이런 기준선의 가치를 보여 주지만 모든 문제에서 항상 최선인 탐색기를 보장하지 않습니다.</p></div><ContentBoundary article="hyperparameter-tuning" /><p className="mt-6 text-base"><a href="/cs/ai/adaptive-hyperparameter-search" className="underline">앞 관측을 다음 제안에 사용하는 적응형 탐색</a>으로 이어집니다.</p></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 선택과 보고와 총비용을 구분할 수 있나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            각각 10 GPU분인 후보를 네 번 실행했습니다. 각 비용이 30보다 작으므로 전체 예산 30을 지킨 것인가요? (답: 7절)
          </p><p>
            독립 추첨의 좋은 영역 확률이 0.05라면 세 번 중 한 번 이상 들어갈 확률은 얼마인가요? (답: 8절)
          </p><p>
            독립 평가 0.23을 보고 설정을 다시 바꿨습니다. 그 평가를 그대로 마지막 시험이라고 불러도 될까요? (답: 10절)
          </p></div></section></div>; }
