import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ProvenanceDagViz } from "./viz/ModernExperimentViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 점수에서 실제 입력과 실행까지 돌아갈 수 있어야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>좋은 결과 숫자를 남겨도 어떤 자료와 설정으로 만들었는지 잃으면 다시 확인하기 어렵습니다. 같은 파일명이 다른 내용으로 덮어써지면 과거 점수의 근거도 바뀝니다.</p><p>
            이 글은 실패한 실행과 다시 성공한 실행을 나누고 그 성공이 만든 두 예측에서 입력까지 거슬러 가는 경로를 만듭니다. 무엇을 계산했고 실제로 몇 번 실행했는지 함께 남깁니다.
          </p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 조건과 실행과 결과를 화살표로 연결합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>먼저 실행 조건을 고정하고 실제 시도마다 별도의 식별자를 만듭니다. 입력과 출력 파일을 그 실행에 연결하고 보고서는 사용한 출력 파일을 가리키게 합니다. 결과에서 뒤로 따라가면 자료와 코드와 설정을 찾을 수 있어야 합니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>고정한 조건과 입력을 식별한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>실제 실행마다 고유 번호를 만든다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>만든 파일과 생산 실행을 연결한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>보고서에서 예측과 입력을 역추적한다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 실패 A1과 성공 A2를 덮어쓰지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>조건 묶음은 S1이라고 부릅시다. 입력 자료는 D1이라고 부릅시다. 첫 실행 A1은 실패했고 같은 조건을 다시 실행한 A2가 성공해 예측 [0.2,0.8]을 만들었습니다. 이 두 값의 평균은 0.50입니다. (가정)</p><p>다음 날 같은 파일 경로가 [0.1,0.9]로 바뀌어도 평균은 0.50입니다. 평균과 파일 이름만 남겼다면 과거 보고서가 어느 내용을 사용했는지 구별할 수 없습니다. A1과 A2라는 실행 번호, 그리고 각 파일의 내용을 함께 기록해야 합니다. (가정)</p></div></section>

<section id="inside-provenance" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 실험 조건과 실제 실행은 서로 다른 대상을 가리킵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>S1은 코드·자료·분할·공통 설정·실행 환경·명령의 고정된 묶음입니다. A1과 A2는 그 조건을 실제로 실행한 각각의 사건입니다. 같은 조건이라도 여러 번 실행할 수 있으므로 조건 식별자 하나로 실행을 덮어쓰지 않습니다.</p><p>입력 D1이 A2에서 읽혔고 A2가 예측 P2를 만들었으며 보고서 R2가 P2의 평균을 계산했다고 연결합니다. 목록에 이름만 나열하는 대신 누가 무엇을 읽고 만들었는지가 있어야 뒤로 따라갈 수 있습니다.</p></div></section>

<section id="why-identity" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 같은 이름과 크기와 평균도 같은 내용을 보장하지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>두 예측 배열은 모두 길이가 2이고 평균이 0.50입니다. 그러나 첫 행의 값은 0.2와 0.1로 다릅니다. 합계나 평균은 내용을 줄인 값이라 개별 예측을 복원할 수 없습니다.</p><p>파일 위치와 실제 내용도 구별합니다. 위치는 어디서 읽을지 알려 주고 내용의 digest는 읽은 바이트가 기록된 바이트와 같은지 확인하는 데 씁니다. 위치가 같아도 내용은 바뀔 수 있습니다.</p></div></section>

<section id="tracking-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 조건과 실행과 결과물에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>고정한 실험 조건이 experiment spec, 실제 실행 한 번이 attempt, 입력이나 출력으로 보존한 파일이 artifact입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Provenance edge", "description": "실행이 어떤 입력을 읽고 어떤 출력을 만들었는지 나타내는 관계입니다.", "boundary": "자료 목록만으로는 생산 경로가 완성되지 않습니다."}, {"term": "Content digest", "description": "정해진 바이트에 hash를 적용한 내용 식별값입니다.", "boundary": "신뢰할 기준 기록과 비교해야 하며 출처의 진위를 혼자 증명하지 않습니다."}, {"term": "Run ID", "description": "실제 실행을 다른 실행과 구분하는 고유 식별자입니다.", "boundary": "사용자가 붙인 같은 run name이나 seed를 대신 쓰지 않습니다."}]} /><ProvenanceDagViz /></section>

<section id="spec-attempt" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 같은 실행 좌표가 반복돼도 ID는 새로 만듭니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>이 글의 S1은 반복 비교를 묶는 공통 조건이라 seed·재시도 번호·worker를 따로 저장한다고 정합니다. 실제 실행에는 이 값들을 포함한 전체 설정도 보존합니다. 다른 설계에서 seed를 공통 config에 포함했다면 seed가 바뀔 때 조건 hash도 달라지는 것이 맞습니다.</p><p>seed 2·retry 0·worker 7이라는 좌표를 다음 날 다시 사용할 수 있습니다. 좌표만으로 실행의 유일성을 보장하지 말고 실행마다 고유 ID u를 발급합니다. A1 실패 기록과 A2 성공 기록은 서로 다른 u에 보관합니다. (가정)</p><p>조건을 hash하기 전에 필드 순서와 직렬화 형식, 기본값의 해석을 고정합니다. 외부 자료는 시점 또는 snapshot을 지정하고 비밀 원문 대신 필요한 제공자·버전·정책을 기록합니다.</p></div><ExplainedFormula
          question="Configuration이 같은 반복과 조건이 다른 실험을 어떻게 기계적으로 구분하나요?"
          idea={
            <p>
              정규화한 immutable inputs를 순서대로 직렬화해 spec digest를 만들고 seed·retry·worker와 고유 실행 ID를 붙여 실제 attempt를 구분합니다.
            </p>
          }
          formula={String.raw`d_s=H(\operatorname{encode}(c,d,s,g,e,k)),\quad a=(d_s,z,r,w,u)`}
          annotatedFormula={String.raw`\begin{aligned}b_s&=\underbrace{\operatorname{encode}(c,d,s,g,e,k)}_{\text{실행 조건을 정규 순서로 직렬화}}\\d_s&=\underbrace{H(b_s)}_{\text{조건 bytes를 immutable identity로 압축}}\\a&=\underbrace{(d_s,z,r,w,u)}_{\text{seed·retry·worker와 고유 실행 ID를 보존}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{encode}(c,d,s,g,e,k)`,
              annotation: [
                "code·data·split·config·environment·command를",
                "정해진 schema와 순서로 직렬화",
              ],
            },
            {
              expression: String.raw`H(b_s)`,
              annotation: [
                "정규화된 spec bytes를 hash해",
                "내용 기반 identity 생성",
              ],
            },
            {
              expression: String.raw`(d_s,z,r,w,u)`,
              annotation: [
                "같은 spec에 실행 좌표를 붙여",
                "고유 ID로 실제 실행을 별도 보존",
              ],
            },
          ]}
          terms={[
            {
              symbol: "c,d,s",
              name: "Code · data · split",
              description:
                "Code revision, immutable dataset과 split manifest입니다.",
            },
            {
              symbol: "g,e,k",
              name: "Config · environment · command",
              description:
                "Resolved config, image/dependencies/hardware, 실제 entry command입니다.",
            },
            {
              symbol: String.raw`d_s`,
              name: "Spec digest",
              description: "실행 조건 전체의 content identity입니다.",
            },
            {
              symbol: "z,r,w,u",
              name: "Seed · retry · worker · unique ID",
              description: "z·r·w는 실행 좌표이고 u는 각각의 실제 실행을 구분하는 고유 ID입니다.",
            },
          ]}
          assumptions={[
            "Mutable external input은 snapshot 또는 as-of version으로 고정합니다.",
            "Secret 원문은 제외하되 provider·secret version·policy를 기록합니다.",
            "Serialization schema와 default resolution도 versioning합니다.","반복을 묶는 이 글의 spec에서는 seed·retry·worker를 제외합니다. 각 attempt에는 seed를 포함한 실제 실행 설정 전체를 별도로 저장합니다.","같은 실행 좌표가 반복될 수 있으므로 u를 고유하게 발급합니다.",
          ]}
          interpretation="조건 S1에 같은 seed 2·retry 0·worker 7을 쓰더라도 실제 실행 A1과 A2에는 서로 다른 u를 발급합니다. seed가 조건 config에도 포함된 다른 설계라면 seed 변경은 spec digest도 바꿉니다."
        /></section>

<section id="artifact-reference" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 9바이트의 내용이 바뀌었는지 직접 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>줄바꿈 없는 UTF-8 문자열 [0.2,0.8]은 9바이트입니다. 실제 SHA-256 계산값은 <code className="break-all">3a865fbc8533680a422367dcd4fbd6acfabb3b8e449f419c40f146c1d8e1d9e4</code>입니다. 같은 방식의 [0.1,0.9]도 9바이트지만 <code className="break-all">79cd929e095901c3e5625aaee850c49564b962af3ecdf01a8877f7ad960def8e</code>가 나옵니다.</p><p>예측 P2에 저장 위치·내용 digest·행 ID 순서와 dtype 같은 schema·크기 9·생산 실행 A2를 연결합니다. 보고서 R2에서 P2를 읽어 기록된 digest와 비교하면 같은 경로가 새 내용으로 바뀐 경우를 찾을 수 있습니다.</p><p>digest 비교의 기준 기록 자체를 믿을 수 있어야 합니다. 파일과 기록을 함께 악의적으로 바꾸면 hash 일치만으로 진위를 보장하지 못합니다. 논리적인 값의 정규화 hash와 실제 저장 바이트 hash도 구별합니다.</p></div><ExplainedFormula
          question="URI가 바뀌거나 덮어써져도 과거 artifact를 같은 것으로 확인하려면 무엇이 필요한가요?"
          idea={
            <p>
              하나의 reference에 object 위치와 실제 bytes digest, 해석 schema, 크기, producer attempt를 담아 저장하고 소비 시 다시
              검증합니다.
            </p>
          }
          formula={String.raw`R_a=(u_a,H(B_a),\sigma_a,n_a,p_a)`}
          annotatedFormula={String.raw`\begin{aligned}d_a&=\underbrace{H(B_a)}_{\text{다운로드한 bytes의 내용 identity}}\\q_a&=\underbrace{\mathbf1[d_a=d_a^{\rm recorded}]}_{\text{기록된 digest와 실제 bytes 비교}}\\R_a&=\underbrace{(u_a,d_a,\sigma_a,n_a,p_a)}_{\text{위치·내용·schema·크기·producer 결합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`H(B_a)`,
              annotation: [
                "artifact bytes를 hash해",
                "위치와 독립적인 content identity 생성",
              ],
            },
            {
              expression: String.raw`\mathbf1[d_a=d_a^{\rm recorded}]`,
              annotation: [
                "실제 digest를 producer 기록과 비교해",
                "신뢰한 기록과 내용 일치 여부 검사",
              ],
            },
            {
              expression: String.raw`(u_a,d_a,\sigma_a,n_a,p_a)`,
              annotation: [
                "저장 위치와 semantic metadata를 묶어",
                "재생 가능한 artifact reference 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`u_a`,
              name: "URI",
              description: "Artifact object를 읽을 storage location입니다.",
            },
            {
              symbol: String.raw`B_a,d_a`,
              name: "Bytes · digest",
              description: "실제 serialized content와 그 hash입니다.",
            },
            {
              symbol: String.raw`\sigma_a`,
              name: "Schema",
              description:
                "Shape·row ID·class order·dtype 같은 해석 계약입니다.",
            },
            {
              symbol: String.raw`p_a`,
              name: "Producer",
              description: "Artifact를 만든 immutable attempt입니다.",
            },
          ]}
          assumptions={[
            "Logical content digest와 physical serialization digest의 범위를 구분합니다.",
            "Metadata보다 artifact retention이 짧아 dangling reference가 생기지 않게 합니다.",
            "Schema fixture로 row count·ID uniqueness·shape를 실제 검사합니다.",
          ]}
          interpretation="줄바꿈 없는 UTF-8 [0.2,0.8]은 9바이트이며 SHA-256은 3a865fbc…입니다. [0.1,0.9]도 9바이트지만 79cd929e…로 달라집니다. 같은 위치·크기·평균만으로 내용이 같다고 판단하지 않습니다."
        /></section>

<section id="paper-mlflow-lifecycle" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 공식 run_id 항목을 실제 실행에 대응시킵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>2026-10-04 확인한 MLflow REST API의 RunInfo는 run_id를 실행의 고유 식별자로 정의하고 run_name과 별도 필드로 둡니다. 우리 예의 A1과 A2도 각각의 실제 실행을 가리키도록 서로 다른 ID가 필요합니다. 아래 짧은 A1·A2는 설명용 이름이며 실제 발급 형식을 뜻하지 않습니다.</p></div><div id="source-mlflow-run-id" className="mt-8 scroll-mt-20"><CitationBlock source="MLflow REST API — RunInfo" citeKey={1} href="https://mlflow.org/docs/latest/api_reference/rest-api.html#runinfo"><q>Unique identifier for the run.</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>S1이라는 조건 이름을 두 실행의 run_id로 재사용하지 않습니다. 실패 A1과 성공 A2를 분리하고 P2의 생산자를 A2에 연결합니다. 도구를 사용했다는 사실만으로 모든 자료 버전과 내용 hash가 자동 수집되는 것은 아니므로 필요한 연결을 실제 기록해야 합니다.</p></div></div><div id="source-mlflow-artifact" className="mt-8 scroll-mt-20"><CitationBlock source="MLflow 2018 §3.1, 인쇄 p.41" citeKey={1} href="https://people.eecs.berkeley.edu/~alig/papers/mlflow.pdf"><q>mlflow.log_artifact("precision_recall.png")</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>원문은 결과 파일을 실행에 기록하는 실제 API 호출을 보여 줍니다. 같은 역할로 A2의 예측 파일 P2와 보고서를 연결할 수 있습니다. 2018년의 Tracking·Projects·Models 설계 설명과 현재의 세부 API 계약은 버전과 확인일을 구별합니다.</p></div></div>
<div id="mlflow-genai-evaluation" className="mt-10 scroll-mt-24">
  <h3 className="text-xl font-bold">같은 답변의 점수가 바뀌었다면 모델보다 채점자가 먼저 바뀌었을 수 있습니다</h3>
  <div className="prose prose-neutral max-w-none dark:prose-invert">
    <p>(가정) 고정된 고객 질문 100개와 고정된 답변 100개를 평가했습니다. 첫 실행의 통과율은 78%, 다음 실행은 86%였습니다. 그런데 두 번째 실행에서 평가 지침에 “간결성”을 추가하고 judge model도 바꿨습니다. 답변 bytes가 같아도 두 점수는 같은 자로 잰 결과가 아닙니다.</p>
    <p>생성 실행과 평가 실행을 분리합니다. 생성 실행은 어떤 prompt와 model이 어떤 trace를 만들었는지 남깁니다. 평가 실행은 고정된 trace 묶음에 어떤 기대값, scorer 코드, judge 지침과 judge model을 적용했는지 남깁니다. 채점자를 고칠 때 답변 생성까지 다시 돌리지 않아도 되지만, 어느 trace를 다시 채점했는지는 고정해야 합니다.</p>
  </div>
  <div className="not-prose my-6 max-w-full overflow-x-auto">
    <table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead><tr className="border-y border-border bg-muted/30"><th className="px-3 py-3">고정 대상</th><th className="px-3 py-3">식별값</th><th className="px-3 py-3">달라지면 새 비교 축이 되는 이유</th></tr></thead><tbody className="divide-y divide-border">{[
      ["평가 자료", "dataset revision·row ID", "질문과 기대값 모집단이 달라집니다."],
      ["생성 결과", "trace ID·application revision", "같은 채점자로 다른 답변을 잰 실험이 됩니다."],
      ["결정적 규칙", "scorer code digest", "길이·정규식·schema 판정 자체가 달라집니다."],
      ["의미 판정", "judge version·instructions·model", "같은 문장을 다른 기준과 model로 읽습니다."],
      ["실행 환경", "MLflow·provider version", "API default와 serialization이 바뀔 수 있습니다."],
    ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="px-3 py-3 leading-6 text-muted-foreground">{cell}</td>)}</tr>)}</tbody></table>
  </div>
  <pre className="not-prose my-6 max-w-full overflow-x-auto rounded-xl border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`from mlflow.genai.judges import make_judge

quality_v2 = make_judge(
    name="response_quality",
    instructions="Evaluate accuracy and completeness for {{ inputs }} and {{ outputs }}.",
    model="<pinned-provider-model>",
    feedback_value_type=str,
)
registered = quality_v2.register(experiment_id=experiment_id)

# generation을 다시 호출하지 않고 저장된 trace를 같은 입력으로 사용
traces = mlflow.search_traces(run_id=generation_run_id)
result = mlflow.genai.evaluate(data=traces, scorers=[registered])`}</code></pre>
  <div className="prose prose-neutral max-w-none dark:prose-invert">
    <p>위 코드는 현재 공식 API의 역할을 드러내는 최소 예입니다. Regression gate에는 “latest”를 암묵적으로 읽지 않고 scorer version을 고정합니다. 새 judge가 더 낫다고 판단되면 사람 평가와의 일치, 보호 slice, 비용과 parsing failure를 비교한 뒤 기준선을 새로 만듭니다.</p>
    <p>코드 기반 scorer는 저장된 trace를 빠르게 다시 평가하는 데 유용하지만, 현재 공식 문서에서 자동 production 평가와 같은 범위는 아닙니다. Offline benchmark의 통과율을 실시간 품질·latency·안전 monitoring의 대체물로 쓰지 않습니다.</p>
  </div>
  <CitationBlock source="MLflow · Registering and Versioning Scorers" citeKey={3} href="https://mlflow.org/docs/latest/genai/eval-monitor/scorers/versioning/">현재 문서는 scorer 이름 아래 version history를 만들고, 재현 가능한 regression test에는 특정 version을 고정하도록 안내합니다. 지원 scorer 종류도 서로 다르므로 prompt registry와 scorer registry의 역할을 구분합니다.</CitationBlock>
  <CitationBlock source="MLflow · Develop code-based scorers" citeKey={4} href="https://mlflow.org/docs/latest/genai/eval-monitor/scorers/custom/tutorial/">공식 개발 흐름은 application에서 trace를 먼저 만들고 저장한 뒤, 그 trace를 다시 사용해 scorer를 반복 평가합니다. 이 경로는 judge 변경과 application 변경을 한 run에 섞지 않게 해 줍니다.</CitationBlock>
</div></section>

<section id="provenance-receipt" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 실패 기록도 다음 선택의 근거입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A1에는 종료 코드와 마지막 단계, 오류 출력, 일부 생성된 파일을 남깁니다. A2만 보관하면 같은 조건에서 실패가 있었다는 사실과 복구 비용이 사라집니다. 종료 시 필수 파일이 실제로 존재하는지도 검사합니다.</p><p>다음 단계에서는 같은 실행 위에 학습 중 시간별 지표를 쌓습니다. <a href="/cs/ai/learning-curve-tracking">학습 곡선 추적</a>에서 지표 관측이 어느 단계와 실행을 가리키는지 이어서 다룹니다.</p></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 기록이 있어도 파일과 실행 환경이 사라지면 재생할 수 없습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>파일 보존 기간이 기록보다 짧으면 보고서가 삭제된 대상을 가리키게 됩니다. 실제 파일과 접근 권한, 해석할 코드·환경을 함께 보존해야 합니다. checksum은 파일을 복구해 주는 저장소가 아닙니다.</p><p>같은 seed와 자료라도 실행 장치나 비결정적 연산 때문에 결과가 달라질 수 있습니다. 추적은 당시 무엇을 했는지 확인할 근거이며 같은 값의 완벽한 재현이나 좋은 모델 품질을 자동 보장하지 않습니다.</p></div><ContentBoundary article="experiment-tracking" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 결과에서 입력까지 실제로 돌아갈 수 있나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 조건과 seed·retry·worker를 다시 썼습니다. 두 실행을 구별하려면 무엇을 추가해야 하나요? (답: 7절)</p><p>두 파일의 크기와 평균이 모두 같다면 내용이 같다고 결론내릴 수 있나요? (답: 8절)</p><p>성공 A2만 남기고 실패 A1을 지우면 어떤 근거가 사라지나요? (답: 10절)</p></div></section></div>; }
