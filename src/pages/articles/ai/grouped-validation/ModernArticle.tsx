import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { GroupedValidationViz } from "../cross-validation/viz/ModernCrossValidationViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 한 사람의 기록을 처음 보는 사람처럼 평가하지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 사람에게서 얻은 여러 기록은 서로 닮을 수 있습니다. 일부를 배우고 나머지를 맞히면 그 사람에게 익숙해진 효과가 포함됩니다. 처음 보는 사람에게 쓸 시스템이라면 그 사람의 기록 전체를 학습에서 빼야 합니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 같은 대상의 기록을 함께 옮깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>각 기록이 어느 대상에서 나왔는지 붙입니다. 학습할 대상과 평가할 대상을 나눈 뒤 대상에 속한 모든 기록을 함께 옮깁니다. 마지막에는 겹치는 대상이 없는지 확인하고 행 수와 대상 수를 따로 셉니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>각 기록의 원래 대상을 찾는다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>학습 대상과 평가 대상을 나눈다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>같은 대상의 기록을 통째로 옮긴다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>겹침과 대상 수를 검사한다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. C의 세 기록은 모두 평가 쪽에 둡니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A·B·C·D에게 각각 2·2·3·1개 기록이 있다고 합시다. A·B의 4행으로 학습하고 C·D의 4행으로 평가합니다. 처음 보는 대상을 평가하기 위한 가정이며 실제 의료 성능 자료는 아닙니다. (가정)</p><p>C의 기록 하나를 학습 쪽에 옮기고 나머지 두 개를 평가한다면 C는 양쪽에 나타납니다. 전체 행 수가 그럴듯해도 처음 보는 대상이라는 조건은 깨집니다. 반면 C의 세 기록을 함께 두면 대상 겹침을 피할 수 있습니다. (가정)</p></div></section>

<section id="inside-groups" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 행 번호와 원래 대상의 번호를 별도로 보존합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>행의 식별자는 A의 첫 기록과 두 번째 기록을 구별합니다. 대상 식별자는 두 기록을 함께 움직이게 합니다. 분할할 때는 대상 식별자를 사용하고 예측을 원래 순서로 붙일 때는 행 식별자를 사용합니다.</p><p>평가 결과에도 두 식별자를 남겨야 C의 세 예측을 묶고 D의 한 예측과 비교할 수 있습니다. 파일명이나 행 번호가 달라도 원래 자료를 잘라 만든 기록이면 같은 대상에 속할 수 있습니다.</p></div></section>

<section id="why-groups" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 비슷한 기록을 기억한 성과가 섞이는 것을 막습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>사람마다 고유한 측정 특징이 남아 있다면 모델은 일반적인 관계보다 사람을 알아보는 단서를 배울 수 있습니다. C의 한 기록을 학습에 넣으면 C의 다른 기록이 쉬워져 새 사람의 성능을 과대평가할 수 있습니다.</p><p>대상을 통째로 빼면 이런 경로를 줄일 수 있습니다. 실제 배포가 이미 아는 사람의 다음 기록을 예측하는 문제라면 새로운 사람을 빼는 질문과 다르므로 시간과 사용 조건을 다시 정합니다.</p></div></section>

<section id="group-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 기록을 묶는 키와 평가 단위에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>입력 하나로 저장한 기록이 row이며 여러 기록을 만든 대상이 entity입니다. 같은 대상의 기록을 묶어 옮기는 식별자가 group key입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Group-disjoint split", "description": "학습과 평가의 그룹 식별자가 겹치지 않는 분할입니다.", "boundary": "올바른 공유 원인을 식별자로 선택해야 합니다."}, {"term": "Independent evaluation unit", "description": "근거 반복의 크기를 셀 때 사용하는 독립에 가까운 대상 단위입니다.", "boundary": "같은 병원이나 가구의 상위 의존성이 남으면 완전한 독립은 아닙니다."}, {"term": "GroupKFold", "description": "주어진 그룹을 유지하며 평가 묶음을 바꾸는 공식 분할기입니다.", "boundary": "어떤 식별자가 실제 공유 원인인지는 찾아 주지 않습니다."}]} /><GroupedValidationViz /></section>

<section id="disjoint" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 집합의 교집합으로 C가 섞였는지 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>올바른 학습 집합의 대상은 &#123;A,B&#125;이고 평가 집합의 대상은 &#123;C,D&#125;입니다. 교집합은 공집합이므로 겹침 검사를 통과합니다. C 한 행을 옮겼다면 학습 대상이 &#123;A,B,C&#125;가 되어 교집합은 &#123;C&#125;입니다. (가정)</p><p>이 검사는 그룹 경계 하나를 확인합니다. 미래 정보가 들어갔는지, 전처리를 전체 자료로 학습했는지는 별도로 검사해야 합니다.</p></div><ExplainedFormula
          question="Group split이 안전한지 가장 먼저 확인할 식은 무엇인가요?"
          idea={<p>
            각 partition에 들어간 row의 group ID를 집합으로 바꾼 뒤 두 집합의 교집합을 구해 shared entity가 하나도 없는지 확인합니다.
          </p>}
          formula={String.raw`G_{\mathrm{train}}\cap G_{\mathrm{valid}}=\varnothing`}
          annotatedFormula={String.raw`\begin{aligned}G_{\mathrm{train}}&=\underbrace{\{g_i:i\in T\}}_{\text{train rows의 shared-cause ID를 수집}}\\G_{\mathrm{valid}}&=\underbrace{\{g_j:j\in V\}}_{\text{validation rows의 ID를 수집}}\\\mathcal L_G&=\underbrace{G_{\mathrm{train}}\cap G_{\mathrm{valid}}}_{\text{양쪽에 나타난 leakage group}}=\varnothing
\end{aligned}`}
          operations={[
            { expression: String.raw`\{g_i:i\in T\}`, annotation: ["train row에서 group key만 모아", "중복을 제거한 집합 생성"] },
            { expression: String.raw`\{g_j:j\in V\}`, annotation: ["validation row에서도", "같은 key space의 집합 생성"] },
            { expression: String.raw`G_{\mathrm{train}}\cap G_{\mathrm{valid}}`, annotation: ["두 집합에 동시에 있는 ID를 찾아", "shared-cause leakage를 검출"] },
          ]}
          terms={[
            { symbol: String.raw`g_i`, name: "Group key", description: "Row i를 만든 patient·device·document·site ID입니다." },
            { symbol: "T,V", name: "Train·validation row sets", description: "현재 fold의 두 row partition입니다." },
            { symbol: String.raw`\mathcal L_G`, name: "Leaked groups", description: "두 partition에 동시에 나타난 group 집합입니다." },
          ]}
          assumptions={["모든 row에 stable group key가 있습니다.", "Group key가 실제 shared cause를 충분히 표현합니다."]}
          interpretation="Patient C의 patch가 하나라도 양쪽에 있으면 교집합은 {C}가 되어 split을 거부합니다."
        /></section>

<section id="evidence" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 평가 행 4개를 독립된 사람 4명처럼 세지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>C는 세 번 관측됐고 D는 한 번 관측됐습니다. 두 사람이 서로 독립에 가깝다는 가정 아래 새 대상에 대한 근거 반복은 2명입니다. C의 세 행이 비슷하게 틀리면 행 네 개를 독립이라고 두는 불확실성 계산은 지나치게 낙관적일 수 있습니다.</p><p>C 손실이 0·0·0이고 D 손실이 1이라면 행 평균은 0.25, 대상별 같은 무게의 평균은 0.50입니다. 어떤 평균을 사용할지는 배포 목적에 맞춰 먼저 정합니다. 규모가 커져도 같은 문제여서 20명에게 각 5,000개 기록을 얻으면 100,000행과 20명을 모두 보고합니다. (가정)</p></div><ExplainedFormula
          question="독립 평가 단위 수는 왜 row 수가 아니라 고유 group 수인가요?"
          idea={<p>
            같은 entity의 반복 row는 오류를 함께 움직일 수 있습니다. 배포에서 새 entity 성능을 주장할 근거 반복은 validation에 들어간 고유 group의
            개수입니다.
          </p>}
          formula={String.raw`n_{\mathrm{unit}}=|\{g_i:i\in V\}|`}
          annotatedFormula={String.raw`n_{\mathrm{unit}}=\underbrace{\left|\underbrace{\{g_i:i\in V\}}_{\text{validation row의 group ID를 중복 제거}}\right|}_{\text{새 entity 근거 반복 수를 셈}}`}
          operations={[{ expression: String.raw`\{g_i:i\in V\}`, annotation: ["validation group IDs를 모으고", "동일 entity 반복을 하나로 축약"] }, { expression: String.raw`|\cdot|`, annotation: ["고유 group 집합의 크기를 세어", "독립에 가까운 근거 단위 수 계산"] }]}
          terms={[{ symbol: "V", name: "Validation rows", description: "현재 평가 partition의 행입니다." }, { symbol: String.raw`n_{\mathrm{unit}}`, name: "Independent-unit count", description: "새 entity 성능 근거로 보고할 고유 group 수입니다." }]}
          assumptions={["Group 간 dependency가 작다는 근사입니다.", "Site나 household 같은 상위 dependency는 별도 보고합니다."]}
          interpretation="C의 3행과 D의 1행을 평가하면 행은 4개지만 n_unit=2입니다. 별도 규모 예에서 20명×5,000개 기록은 100,000행이고 고유 대상은 20명입니다."
        /></section>

<section id="paper-group-split" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 공식 API는 그룹을 한 번씩 평가에 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>scikit-learn 1.7.2 GroupKFold 설명은 하나의 그룹이 전체 평가 묶음 중 정확히 한 곳에 나타나도록 정합니다. 서로 다른 그룹 수가 분할 수 이상이어야 하며 그룹 순서를 임의로 기대하지 말라고 명시합니다.</p></div><div id="source-group-once" className="mt-8 scroll-mt-20"><CitationBlock source="scikit-learn 1.7.2 — GroupKFold" citeKey={1} href="https://scikit-learn.org/1.7/modules/generated/sklearn.model_selection.GroupKFold.html"><q>Each group will appear exactly once in the test set</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>groups=[A,A,B,B,C,C,C,D]를 넘기면 같은 C가 학습과 평가로 갈라지지 않게 검사할 수 있습니다. 이 글의 A·B 대 C·D는 이해용 분할이며 API가 항상 그 순서로 출력한다는 약속이 아닙니다. 그룹이 4개이므로 n_splits=5는 허용되지 않습니다.</p></div></div><AlgorithmBlock title="공식 API를 사용하는 검증 예 — 이 글의 예시 코드" input={["행 8개와 해당 groups", "n_splits=2"]} steps={[{"code": "for train, valid in GroupKFold(n_splits=2).split(X, y, groups):", "note": "공식 API로 반환된 각 인덱스 묶음을 사용합니다."}, {"code": "assert set(groups[train]).isdisjoint(set(groups[valid]))", "note": "NumPy 배열 groups를 가정합니다. 같은 대상이 양쪽에 없는지 검사합니다."}, {"code": "report(len(valid), len(set(groups[valid])))", "note": "평가 행 수와 고유 대상 수를 따로 남깁니다."}]} output="분할별 대상 겹침 검사와 크기 기록" /></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 같은 병원이라는 더 큰 공유 원인이 남을 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A와 C가 다른 환자여도 같은 병원의 측정 습관을 공유할 수 있습니다. 새 병원 배포가 목표면 병원 식별자를 더 바깥 경계로 격리해야 합니다. 시간 방향도 필요하면 대상 분리 위에 함께 적용합니다.</p><p>그룹별 행 수와 정답 비율이 다르면 평가 묶음의 크기나 클래스 구성이 달라집니다. StratifiedGroupKFold는 그룹을 유지하면서 클래스 비율을 맞추려는 도구지만 모든 조건의 완벽한 균형을 보장하지 않습니다. 분할별 대상 수·행 수·정답 비율·장소 구성을 확인합니다.</p></div><ContentBoundary article="grouped-validation" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 행 수와 대상 수를 구별할 수 있나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>C의 기록 하나만 학습에 옮겼습니다. 대상 교집합은 무엇이 되나요? (답: 7절)</p><p>C의 세 행과 D의 한 행을 평가했다면 독립에 가까운 대상 수는 얼마인가요? (답: 8절)</p><p>서로 다른 환자가 모두 같은 병원에서 왔습니다. 새 병원의 성능을 주장하려면 무엇을 더 나누어야 하나요? (답: 10절)</p></div></section></div>; }
