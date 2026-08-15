import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { GroupedValidationViz } from "../cross-validation/viz/ModernCrossValidationViz";

export default function GroupedValidationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">여러 row가 같은 원인에서 나왔다면 row가 아니라 원인을 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">한 환자의 patch, 한 사용자의 session, 한 문서의 chunk는 서로 다른 row여도 같은 원인을 공유합니다. 배포에서 새 환자나 새 문서를 만난다면 같은 원인의 row가 train과 validation 양쪽에 나타나지 않게 해야 합니다.</p></div>
        <TermBreakdown title="Row에서 group으로 올라가는 순서" items={[
          { term: "Row", description: "Table이나 tensor에서 model input 하나로 저장된 관측입니다." },
          { term: "Entity", description: "여러 row를 생성한 실제 대상입니다.", example: "Patient C가 2,110 patch를 만들면 entity는 하나입니다." },
          { term: "Group key", description: "같은 partition으로 함께 움직일 shared-cause ID입니다.", boundary: "편리한 ID가 아니라 배포에서 새로울 원인을 고릅니다." },
          { term: "Independent evaluation unit", description: "Uncertainty와 근거 반복 수를 셀 때 사용하는 entity·site 단위입니다." },
        ]} />
        <GroupedValidationViz />
        <ContentBoundary article="grouped-validation" />
      </section>
      <section id="disjoint" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Train group과 validation group의 교집합을 0으로 만듭니다</h2>
        <ExplainedFormula
          question="Group split이 안전한지 가장 먼저 확인할 식은 무엇인가요?"
          idea={<p>각 partition에 들어간 row의 group ID를 집합으로 바꿉니다. 두 집합의 교집합을 구해 shared entity가 하나도 없는지 확인합니다.</p>}
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
        />
      </section>
      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">100,000 rows와 20 patients를 같은 sample size로 부르지 않습니다</h2>
        <ExplainedFormula
          question="독립 평가 단위 수는 왜 row 수가 아니라 고유 group 수인가요?"
          idea={<p>같은 entity의 반복 row는 오류를 함께 움직일 수 있습니다. 따라서 배포에서 새 entity 성능을 주장할 근거 반복은 validation에 들어간 고유 group의 개수입니다.</p>}
          formula={String.raw`n_{\mathrm{unit}}=|\{g_i:i\in V\}|`}
          annotatedFormula={String.raw`n_{\mathrm{unit}}=\underbrace{\left|\underbrace{\{g_i:i\in V\}}_{\text{validation row의 group ID를 중복 제거}}\right|}_{\text{새 entity 근거 반복 수를 셈}}`}
          operations={[{ expression: String.raw`\{g_i:i\in V\}`, annotation: ["validation group IDs를 모으고", "동일 entity 반복을 하나로 축약"] }, { expression: String.raw`|\cdot|`, annotation: ["고유 group 집합의 크기를 세어", "독립에 가까운 근거 단위 수 계산"] }]}
          terms={[{ symbol: "V", name: "Validation rows", description: "현재 평가 partition의 행입니다." }, { symbol: String.raw`n_{\mathrm{unit}}`, name: "Independent-unit count", description: "새 entity 성능 근거로 보고할 고유 group 수입니다." }]}
          assumptions={["Group 간 dependency가 작다는 근사입니다.", "Site나 household 같은 상위 dependency는 별도 보고합니다."]}
          interpretation="20 patients×5,000 patches는 100,000 rows지만 n_unit=20입니다."
        />
      </section>
      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Patient가 달라도 같은 household·site라면 더 높은 group이 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Group key는 한 번 정하고 끝나는 label이 아닙니다. Patient·household·hospital처럼 중첩된 원인을 그려 보고 실제 deployment novelty와 가장 가까운 층을 우선 격리합니다. Fold마다 group 수·row 수·class ratio·site coverage를 함께 보고합니다.</p></div>
        <div id="paper-group-split" className="not-prose mt-8"><CitationBlock source="scikit-learn — Grouped cross-validation iterators" citeKey={1} type="paper" href="https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-iterators-for-grouped-data">
          GroupKFold·StratifiedGroupKFold 등 group-aware splitter의 현재 의미를 설명합니다. 올바른 group key를 library가 찾아 준다는 뜻은 아닙니다.
        </CitationBlock></div>
      </section>
    </div>
  );
}
