import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { CodeModeRuntimeViz } from "../code-mode-viz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";

export default function CodeModeRuntimeContractsArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="먼저 runtime의 일"
          title="Model이 만든 program의 loop는 runtime이 실행하지만 외부 세계까지 결정적으로 만들지는 못한다"
        >
          Control flow의 반복 가능성과 tool response·network·time·external
          state의 비결정성을 먼저 분리합니다.
        </LessonHeader>
        <TermLesson
          name="Deterministic runtime control flow"
          oneLine="Loop·branch·sort·aggregation·bounded concurrency 같은 명시적 semantics를 매 단계 model 추론 대신 일반 runtime이 수행하는 특성입니다."
          shape="program counter → branch → loop → bounded fan-out"
          example="같은 array의 filter·sort·reduce는 같은 runtime rule로 반복하지만 API 응답은 달라질 수 있습니다."
          boundary="Control flow가 deterministic해도 tool response·clock·network·concurrent effect까지 동일해지는 것은 아닙니다."
        />
        <CodeModeRuntimeViz />
      </section>

      <section id="capability" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="열쇠를 요청 단위로"
          title="Type은 argument shape를 제한하고 capability는 program이 실제로 할 수 있는 일을 제한한다"
        >
          Typed SDK가 컴파일된다는 사실과 어떤 account·resource·operation이
          runtime에 연결됐는지를 분리합니다.
        </LessonHeader>
        <TermLesson
          name="Code Mode capability binding"
          oneLine="범용 network·credential 대신 요청에 필요한 typed tool·resource·account scope만 program API로 연결하는 authorization 경계입니다."
          shape="program → capability proxy → repo.read·issue.write"
          example="Issue 분석에는 target org의 read-only binding만 주고 shell·ambient network·host filesystem은 연결하지 않습니다."
          boundary="Typecheck는 side effect·credential scope·exfiltration을 막지 않으며 proxy의 server-side authorization이 필요합니다."
        />
      </section>

      <section id="result-contract" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="밖으로 나갈 결과"
          title="Local 처리가 끝나도 반환 schema·크기·redaction·provenance를 다시 제한한다"
        >
          Sandbox에 원본을 두는 것과 model로 안전한 결과를 내보내는 것은 다른
          경계입니다.
        </LessonHeader>
        <TermLesson
          name="Code Mode result · disclosure contract"
          oneLine="Final result의 schema·row count·byte budget·redaction·error detail·source provenance를 제한하는 출력 계약입니다."
          shape="local dataset → allowed fields → redact → size gate → result receipt"
          example="team,count,topIssueUrl만 최대 50 rows·32 KiB로 내보내고 source call IDs와 truncation flag를 붙입니다."
          boundary="Schema-valid result가 factual·complete·authorized하다는 뜻은 아니며 truncation은 omission 의미를 가져야 합니다."
        />
        <ExplainedFormula
          question="결과를 model 경계 밖으로 내보낼 때 무엇을 동시에 제한해야 할까요?"
          idea="허용 field를 고른 뒤 민감값을 제거하고, 행과 byte 두 budget을 모두 통과한 결과만 receipt와 함께 반환합니다."
          formula={String.raw`\mathrm{release}=\mathrm{schema}\land N\le N_{\max}\land B\le B_{\max}\land\mathrm{redacted}`}
          annotatedFormula={String.raw`\begin{aligned}Y_{\mathcal S}&=\underbrace{\operatorname{project}_{\mathcal S}(Y)}_{\text{허용 fields만 선택}}\\Y_{\mathrm{safe}}&=\underbrace{\operatorname{redact}(Y_{\mathcal S})}_{\text{민감값 제거}}\\r_N&=\underbrace{[N(Y_{\mathrm{safe}})\le N_{\max}]}_{\text{행 수 gate}}\\r_B&=\underbrace{[B(Y_{\mathrm{safe}})\le B_{\max}]}_{\text{byte gate}}\\\mathrm{release}&=\underbrace{r_N\land r_B\land\mathrm{receipt}(Y_{\mathrm{safe}})}_{\text{두 budget과 provenance를 함께 통과}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{project}_{\mathcal S}(Y)`,
              annotation: [
                "허용 schema의 fields만 선택해",
                "원본 disclosure surface 축소",
              ],
            },
            {
              expression: String.raw`N\le N_{\max}\land B\le B_{\max}`,
              annotation: [
                "행 수와 byte 제한을 모두 확인해",
                "context 폭증 방지",
              ],
            },
            {
              expression: String.raw`\mathrm{receipt}(Y_{\mathrm{safe}})`,
              annotation: [
                "source와 truncation을 함께 남겨",
                "누락·재현 경계 설명",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mathcal S`,
              name: "Allowed schema",
              description: "반환을 허용한 field 집합입니다.",
            },
            {
              symbol: "N",
              name: "Row count",
              description: "반환 결과의 row 수입니다.",
            },
            {
              symbol: "B",
              name: "Byte size",
              description: "직렬화된 반환 결과의 byte 크기입니다.",
            },
          ]}
          assumptions={[
            "Redaction rule과 source IDs가 versioned되어 있습니다.",
            "Error·truncation·omission semantics를 consumer가 구분합니다.",
          ]}
          interpretation="50-row limit만 지키고 한 row에 거대한 blob을 넣는 우회를 막으려면 row와 byte budget을 함께 검사해야 합니다."
        />
      </section>

      <section id="effects" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="Program 실행과 transaction 분리"
          title="다섯 write를 한 program에 적어도 세 번째 timeout 뒤 앞선 두 effect는 이미 남을 수 있다"
        >
          Retry 전에 committed·failed·unknown effect를 receipt로 구분하고
          idempotency·transaction·compensation의 owner를 정합니다.
        </LessonHeader>
        <TermLesson
          name="Code Mode effect · atomicity boundary"
          oneLine="Program process의 성공·실패와 여러 외부 write의 commit을 분리해 부분 성공·retry·idempotency·compensation·approval을 관리하는 경계입니다."
          shape="attempt → effect receipts {committed, unknown, not-started} → reconcile"
          example="Write 1·2 성공 뒤 write 3 timeout이면 1·2를 반복하지 않고 3의 receipt를 조회한 뒤 resume합니다."
          boundary="Try/catch와 program 재실행만으로 exactly-once effect나 cross-service transaction이 생기지 않습니다."
        />
        <ExplainedFormula
          question="Program retry 전에 어떤 external effects를 다시 실행해도 되는지 어떻게 고를까요?"
          idea="전체 plan에서 committed receipt가 있는 effect를 빼고, unknown outcome은 조회·조정한 뒤에만 retry set에 넣습니다."
          formula={String.raw`E_{\mathrm{retry}}=E_{\mathrm{plan}}\setminus E_{\mathrm{committed}}`}
          annotatedFormula={String.raw`\begin{aligned}K&=\underbrace{\{e:\mathrm{receipt}(e)=\mathrm{committed}\}}_{\text{완료 receipt가 있는 effects}}\\U&=\underbrace{\{e:\mathrm{receipt}(e)=?\}}_{\text{먼저 조회할 unknown effects}}\\B&=\underbrace{K\cup U}_{\text{blind retry에서 막을 집합}}\\E_{\mathrm{retry}}&=\underbrace{E_{\mathrm{plan}}\setminus B}_{\text{미시작 effect만 선택}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{e:\mathrm{receipt}(e)=\mathrm{committed}\}`,
              annotation: [
                "receipt가 완료를 증명한 effect를 모아",
                "중복 실행 금지 집합 생성",
              ],
            },
            {
              expression: String.raw`E_{\mathrm{known}}\cup E_{\mathrm{unknown}}`,
              annotation: [
                "완료와 미확정 outcome을 합쳐",
                "blind retry에서 제외",
              ],
            },
            {
              expression: String.raw`E_{\mathrm{plan}}\setminus(\cdots)`,
              annotation: [
                "전체 plan에서 제외 집합을 빼",
                "미시작 effect만 retry 후보로 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: "e",
              name: "External effect",
              description:
                "결제·write·삭제처럼 외부 service에 남는 한 동작입니다.",
            },
            {
              symbol: String.raw`E_{\mathrm{unknown}}`,
              name: "Unknown outcomes",
              description:
                "Timeout 때문에 성공 여부를 아직 확정하지 못한 effects입니다.",
            },
            {
              symbol: String.raw`E_{\mathrm{retry}}`,
              name: "Safe retry candidates",
              description: "완료·미확정 항을 제외한 재시도 후보입니다.",
            },
          ]}
          assumptions={[
            "각 effect에 stable idempotency key와 조회 가능한 receipt가 있습니다.",
            "Unknown outcome은 자동 실패로 간주하지 않습니다.",
          ]}
          interpretation="Write 1·2가 committed이고 3이 unknown이면 4·5만 즉시 retry 후보입니다. 3은 provider receipt를 먼저 조회하고, 필요하면 compensation이나 human approval로 보냅니다."
        />
        <div id="paper-tanstack-code-mode" className="scroll-mt-24">
          <CitationBlock
            source="TanStack AI — Code Mode"
            citeKey={1}
            href="https://tanstack.com/ai/latest/docs/code-mode/code-mode"
          >
            <EvidenceGrid
              problem="Typed tools를 반복·분기·병렬 program으로 조합하는 interface"
              contribution="TypeScript generation과 typed tool execution integration"
              assumptions="해당 library version·adapter·sandbox와 tool configuration"
              scope="TanStack 구현의 API와 type-oriented developer surface"
              notClaim="Type이 authorization·effect atomicity·privacy를 보장한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-cloudflare-runtime" className="scroll-mt-24">
          <CitationBlock
            source="Cloudflare — Code Mode for MCP"
            citeKey={2}
            href="https://blog.cloudflare.com/code-mode-mcp/"
          >
            <EvidenceGrid
              problem="Model-generated code에 MCP capability를 runtime binding으로 연결하는 문제"
              contribution="Typed binding과 sandbox execution surface의 구현 사례"
              assumptions="Cloudflare runtime·binding·sandbox와 문서 example"
              scope="해당 구현에서 program과 capability를 연결하는 경로"
              notClaim="외부 API의 multi-write atomicity나 exactly-once를 runtime이 제공한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="execution-loop" className="space-y-6">
        <LessonHeader
          number="04"
          eyebrow="부를 수 있는 것, 기다리는 시간, 되돌아오는 에러"
          title="Sandbox는 부를 수 있는 API·실행 시간을 제한하고 에러로 program을 스스로 고치게 한다"
        >
          Capability binding이 어떤 계정·자원 scope를 연결할지 정한다면, allowlisted
          API와 execution timeout은 그 안에서 애초에 무엇을 부를 수 있고 얼마나
          기다릴지를 제한합니다. 실행이 실패하면 그 결과를 model에 돌려주는
          feedback이 program repair를 가능하게 합니다.
        </LessonHeader>
        <TermLesson
          name="Sandbox allowlisted API surface"
          oneLine="Program이 호출할 수 있는 함수·모듈·endpoint를 미리 정한 목록으로만 열어, 목록 밖 이름은 program 이름공간에 아예 없는 것처럼 만드는 노출 방법입니다."
          shape="전체 host API 수백 개 → allowlist 통과 → program 이름공간에 노출된 API만"
          example="listIssues·getIssue 등 12개 함수만 노출하면 fs.unlink·net.connect를 포함한 나머지 수백 개 API는 이름 자체가 program에서 보이지 않습니다."
          boundary="Blocklist는 새 위험 API가 늘 때마다 갱신해야 하지만, allowlist도 capability binding의 계정·자원 scope 검사를 대신하지는 않습니다."
        />
        <TermLesson
          name="Sandbox execution timeout budget"
          oneLine="Program 실행에 최대 시간을 두고 그 시간을 넘기면 sandbox process를 강제 종료한 뒤 model에는 timeout error만 반환하는 실행 한도입니다."
          shape="program 실행 시작 → deadline 도달 → process 강제 종료 → timeout error 반환"
          example="Timeout을 5초로 두면 무한 loop나 느린 외부 호출이 그 이상 CPU를 붙잡지 못하지만, 이미 실행된 write가 committed인지는 timeout 응답만으로 알 수 없습니다."
          boundary="Timeout 응답을 process tree 종료나 외부 effect 무효과의 증거로 쓰지 않고, cgroup의 CPU·memory 총량 제한과는 별도 축입니다."
        />
        <TermLesson
          name="Code execution feedback loop"
          oneLine="Program 실행이 남긴 stdout·stderr·exception message를 다음 model 호출의 input에 그대로 붙여, model이 실패 원인을 보고 program을 다시 만들 수 있게 하는 되먹임 경로입니다."
          shape="program 실행 → stderr·exception 수집 → 다음 model 호출 input에 첨부"
          example="`TypeError: cannot read property 'id' of undefined`라는 stderr 한 줄을 다음 프롬프트에 그대로 붙이면 model은 어느 변수가 비어 있는지 짐작할 근거를 얻습니다."
          boundary="Feedback을 붙이는 것 자체가 model이 원인을 정확히 찾는다는 보장은 아니며, 민감한 stack trace는 result contract의 redaction을 거쳐야 합니다."
        />
        <TermLesson
          name="LLM program repair"
          oneLine="Code execution feedback으로 받은 에러 메시지를 근거로 model이 사람 개입 없이 program을 스스로 고쳐 다시 실행하는 mechanism입니다."
          shape="에러 program → feedback → model이 수정한 program → 재실행"
          example="재시도 예산을 3회로 두면, 같은 에러가 3번째 수정 후에도 반복될 때 loop를 멈추고 human escalation으로 넘겨야 합니다."
          boundary="반복 수정이 항상 수렴하지 않으며, 예산 없이 반복하면 매 시도가 다시 tool round-trip과 token 비용을 더합니다."
        />
        <AlgorithmBlock
          title="Code execution feedback → program repair loop"
          input={["초기 program", "allowlisted API·capability binding·timeout이 걸린 sandbox", "재시도 예산 N"]}
          steps={[
            { code: "result = sandbox.run(program)", note: "Allowlisted API와 execution timeout 안에서 program을 한 번 실행합니다." },
            { code: "if result.error: feedback = result.stderr", note: "실패하면 stdout 대신 stderr·exception message를 다음 입력으로 준비합니다." },
            { code: "program = model.repair(program, feedback)", note: "Model이 feedback을 보고 program을 스스로 고칩니다." },
            { code: "attempt += 1", note: "재시도 횟수를 예산 N과 비교할 수 있게 기록합니다." },
          ]}
          output="성공한 실행 결과 또는 재시도 예산 소진 뒤 human escalation"
          repeatUntil="result.error가 없거나 attempt가 예산 N에 도달할 때까지"
        />
        <ConceptLadderViz
          title="Code Mode runtime 계약"
          description="Control flow, authority, disclosure, effect, execution loop를 별도 gate로 통과합니다."
          steps={[
            { label: "Runtime", detail: "명시적 loop·branch를 실행합니다." },
            { label: "Capability", detail: "허용 tool·resource만 연결합니다." },
            { label: "Result", detail: "Schema·크기·redaction을 제한합니다." },
            {
              label: "Effect",
              detail: "Receipt로 partial commit을 조정합니다.",
            },
            {
              label: "Execution loop",
              detail: "API·시간을 제한하고 에러로 program을 고칩니다.",
            },
          ]}
        />
        <ContentBoundary article="code-mode-runtime-contracts" />
      </section>
    </article>
  );
}
