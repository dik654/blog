import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { FailureAblationViz } from "../llm-harness/viz/ModernHarnessViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 잘못된 자료를 읽는 문제에 무엇을 바꿔야 할까요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            작업자가 필요한 문서를 못 찾아 틀린 답을 냈습니다. 검토자를 더 붙이면 나아질 수도 있지만 문서의 위치가 잘못되어 있다면 원인은 그대로 남습니다. 어떤 부분을 고쳤을 때 실제
            결과가 달라지는지 확인해야 합니다.
          </p><p>
            이 글은 문서 찾기를 고치는 변경 하나를 넣고 어려웠던 작업과 원래 잘되던 작업에서 결과를 함께 비교합니다.
          </p></div></section><section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 같은 작업을 다시 실행해 달라진 부분을 비교합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            먼저 입력과 도구 결과, 기대 상태를 다시 재현할 수 있게 보관합니다. 의심하는 부품 하나만 바꾸어 같은 작업을 실행하고 개선된 결과와 새로 생긴 실패를 함께 기록합니다.
            마지막에는 실행 전에 정한 채택 조건을 적용합니다.
          </p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>실패한 실행과 기대 결과를 고정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>의심하는 변경 하나를 적용한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>같은 입력에서 이전과 새 결과를 비교한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>개선과 회귀와 비용으로 채택을 판정한다</span></li></ol></section><section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 성공은 3개에서 9개로 늘었지만 새 실패가 생겼습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>문서 찾기를 검사하는 작업 12개에서 기존 시스템은 3개를 성공했다고 합시다. 오래된 위치 안내를 고친 뒤 같은 12개에서 9개가 성공했습니다. 성공률은 3/12=25%에서 9/12=75%로 50%p 높아졌습니다. (가정)</p><p>원래 성공하던 다른 작업 20개도 다시 검사했더니 그중 1개가 실패했습니다. 새 실패 비율은 1/20=5%입니다. 이번 배포는 기존 성공의 회귀를 0%까지만 허용한다고 미리 정했으므로 새 변경을 바로 채택할 수 없습니다. (가정)</p></div></section><section id="inside-experiment" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 입력과 변경점과 판정 결과를 별도로 보관합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            비교 기록에는 같은 요청 입력, 모델 버전, 도구 응답, 실행 환경과 기대 결과가 필요합니다. 변경한 것은 문서의 위치와 현재 버전을 알려 주는 안내 한 곳입니다. 모델이나
            프롬프트까지 함께 바꾸면 어느 변경 때문에 결과가 달라졌는지 분리하기 어렵습니다.
          </p><p>각 작업에 이전 성공 여부와 변경 후 성공 여부를 한 쌍으로 남깁니다. 실제 자료를 찾았는지, 권한 때문에 읽지 못했는지, 읽고도 틀린 결과를 내놓았는지 실패 위치를 구분해야 다음 수정을 고를 수 있습니다.</p></div></section><section id="classify" data-teach-level="2" className="scroll-mt-20"><span id="failure-layer" className="scroll-mt-20" /><h2 className="mb-6 text-2xl font-bold">5. 자료 없음과 접근 거부에는 다른 수정이 필요합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>정본의 위치가 오래됐다면 안내와 최신성 확인을 고칩니다. 도구 인자가 잘못됐다면 입력 형식과 오류 응답을 고칩니다. 접근 권한이 없다면 허용된 범위와 필요한 승인 상태를 확인해야 하며 문장을 길게 쓰는 것만으로 권한을 만들 수는 없습니다.</p><p>
            결과가 틀렸는데 성공으로 판정됐다면 완료 검사가 문제일 수 있습니다. 먼저 실행 흔적을 보고 의심하는 지점을 정하고 같은 실패 문구가 나왔다는 이유만으로 모두 같은 원인이라고
            분류하지 않습니다.
          </p></div></section><section id="ablation-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 변경 하나의 기여를 확인하는 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>구성 요소 하나를 제거하거나 바꾸어 그 영향을 비교하는 실험을 ablation이라고 부릅니다. 실행을 다시 재현할 고정 입력 묶음은 replay fixture입니다. 원래 성공하던 동작이 깨지는 현상은 regression입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Failure layer", "description": "목표·자료·도구 형식·권한·판정·복구 중 실패가 발생한 책임 구간입니다.", "boundary": "실패 메시지 하나가 원인 계층을 확정하지는 않습니다."}, {"term": "Single change", "description": "원인을 비교하기 위해 다른 조건을 유지하고 바꾸는 한 축입니다.", "boundary": "모델·프롬프트·도구를 함께 바꾼 비교는 개별 기여를 분리하지 못합니다."}, {"term": "Paired ledger", "description": "같은 작업의 이전·이후 결과와 비용을 한 쌍으로 보관하는 기록입니다.", "boundary": "성공률 합계만 같아도 실패한 작업의 정체는 다를 수 있습니다."}, {"term": "Adoption gate", "description": "실행 전에 정한 개선·회귀·비용 등의 채택 기준입니다.", "boundary": "결과를 본 뒤 한도를 바꾸면 원래의 검사를 통과한 것이 아닙니다."}]} /><FailureAblationViz /></section><section id="ablation" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 50%p 개선과 5% 회귀를 각각 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>12개 대상에서 M₀=0.25, Mₖ=0.75이므로 차이는 0.50입니다. 이는 50%p 개선이며 성공률이 50%만 상대적으로 늘었다는 뜻과 다릅니다. 어느 6개가 추가로 성공했는지도 작업별 기록에서 확인합니다. (가정)</p><p>기존 성공 20개 중 1개가 실패해 Rₖ=0.05입니다. 허용 τ=0과 비교하면 회귀 조건을 어겨 G=0입니다. 새 실패의 입력과 결과를 보존하고 안내 변경이 다른 문서를 가린 것인지 확인합니다. 원래의 검사가 부당했다고 판단하더라도 변경 이유를 따로 기록해야 합니다. (가정)</p><p>아래 G는 개선과 회귀라는 두 조건의 결합입니다. 전체 배포 결정에는 지연·token 비용·외부 변경·권한 조건도 추가합니다. 품질이 좋아져도 실행 비용이 크게 늘었다면 별도 채택 기준을 확인해야 합니다.</p></div><ExplainedFormula
          question="새 장치가 실패를 고쳤지만 기존 성공을 망치지 않았는지 어떻게 비교하나요?"
          idea={
            <p>
              같은 fixture에서 candidate와 baseline의 target recovery를 빼고 기존 success regression은 별도 gate로 둡니다.
            </p>
          }
          formula={String.raw`\Delta_k=M_k-M_0,\quad G=I[\Delta_k>0]\land I[R_k\le\tau]`}
          annotatedFormula={String.raw`\begin{aligned}\Delta_k&=\underbrace{M_k-M_0}_{\text{장치 k의 순변화}}\\G&=\underbrace{\mathbf1[\Delta_k>0]}_{\text{target 개선}}\land\underbrace{\mathbf1[R_k\le\tau]}_{\text{회귀 한도 통과}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`M_k-M_0`,
              annotation: [
                "같은 fixture의 baseline을 빼",
                "장치 k 순기여 분리",
              ],
            },
            {
              expression: String.raw`\mathbf1[\Delta_k>0]\land\mathbf1[R_k\le\tau]`,
              annotation: ["개선과 회귀 한도를", "둘 다 release 조건으로"],
            },
          ]}
          terms={[
            {
              symbol: "M_k",
              name: "Candidate metric",
              description:
                "장치 k를 적용한 target failure의 성공 metric입니다.",
            },
            {
              symbol: "M_0",
              name: "Baseline metric",
              description: "동일 fixture의 기존 harness metric입니다.",
            },
            {
              symbol: "R_k",
              name: "Regression rate",
              description:
                "기존 success fixture가 candidate에서 실패한 비율입니다.",
            },
            {
              symbol: "tau",
              name: "Regression tolerance",
              description: "배포 전에 허용한 최대 회귀율입니다.",
            },
          ]}
          assumptions={[
            "Baseline과 candidate의 model·input·tool·runtime은 장치 k 외에 같습니다.",
            "Target metric과 regression set을 변경 전에 고정합니다.",
            "Latency·token·effect 비용도 paired ledger에 함께 둡니다.",
          ]}
          interpretation="12개 대상의 성공이 3→9이면 Δ=9/12−3/12=0.50입니다. 기존 성공 20개 중 1개가 실패하면 R=1/20=0.05이고 허용 τ=0을 넘어 G=0입니다. 이 두 조건 외의 비용·권한 검사도 별도로 필요합니다."
        /></section><section id="paper-harness-ablation" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 원문의 한 요소씩 제거하는 절차를 적용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Anthropic의 2026-03-24 글은 여러 부분을 한꺼번에 줄였을 때 기여를 구분하기 어려워, 구성 요소를 하나씩 제거하며 결과를 확인했다고 설명합니다. 여기의 안내 변경 실험도 다른 조건을 고정해 한 축을 비교하는 적용입니다.</p><p>원문은 모델이 바뀌면 예전에 필요했던 보조 구조의 가치도 달라질 수 있음을 사례로 설명합니다. 따라서 12개와 20개의 비교가 한 모델에서 성공해도 다른 모델의 자동 채택 근거가 되지는 않습니다. 원문의 사례가 아래 회귀율 식을 통계적으로 증명한 논문이라고 해석하지 않습니다.</p></div><div id="source-component-removal" className="mt-8 scroll-mt-20"><CitationBlock source="Anthropic — Iterating on the harness" citeKey={1} href="https://www.anthropic.com/engineering/harness-design-long-running-apps"><q>removing one component at a time</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>문서 안내를 고치는 비교와 검토자를 추가하는 비교를 각각 따로 실행합니다. 여러 변경을 동시에 한 결과만 남기면 3→9의 개선을 문서 안내 하나의 효과라고 귀속하기 어렵습니다.</p></div></div><AlgorithmBlock title="동일 fixture의 전후 비교 — 의사코드" input={["대상12개와 기존성공20개", "모델·도구·실행 조건 및 사전 기준"]} steps={[{"code": "baseline ← replay(fixed_cases, original_config)", "note": "대상별 성공·실패와 실제 변경을 보존합니다."}, {"code": "candidate ← replay(fixed_cases, one_change_config)", "note": "의심한 안내 경로 하나만 바꿉니다."}, {"code": "delta ← 9/12 − 3/12; regression ← 1/20", "note": "개선과 새 실패를 서로 다른 분모로 셉니다."}, {"code": "accept ← delta > 0 and regression <= 0", "note": "이 두 조건에서는 거절입니다. 비용 등 추가 조건도 검사합니다."}]} output="채택 여부와 실패별 기록" /></section><section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 한 번의 재생이 모든 부하의 기여를 증명하지는 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>모델의 무작위성이나 외부 서비스 변화가 크면 한 번의 결과 차이만으로 안정적인 효과를 확정하기 어렵습니다. 동일 조건의 반복과 작업별 변화, 실패의 심각도와 비용 분포를 함께 봅니다. 이미 본 fixture를 계속 보며 고쳤다면 새로운 작업에서 확인할 필요도 있습니다.</p><p>어떤 권한 거부는 정상 방어 결과입니다. 이를 실패율을 낮춘다는 이유로 우회하면 실험의 목표를 바꾼 것입니다. 기대 결과를 정할 때 허용되지 않은 실행은 거부가 정답인 사례로 넣습니다.</p></div><ContentBoundary article="harness-failure-ablation" /></section><section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 개선과 채택을 따로 판정할 수 있나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>대상 성공이 3/12에서 9/12로 늘고 기존 성공 중 1/20이 실패했습니다. 회귀 허용 0%에서 G는 무엇인가요? (답: 7절)</p><p>문서 안내와 모델과 도구를 동시에 바꿨습니다. 6개 추가 성공을 안내 변경의 기여로 확정할 수 있나요? (답: 8절)</p><p>자료 조회가 권한 때문에 거부됐습니다. 이 실패를 없애려고 안내 문장만 길게 쓰는 접근은 어떤 원인을 놓치나요? (답: 5절)</p></div></section></div>; }
