import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { InstructionBoundaryViz } from "../context-engineering/viz/ModernContextEngineeringViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 읽은 문장이 실행 권한으로 바뀌면 안 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            받은 이메일을 요약해 달라고 했는데 그 이메일 안에 고객 정보를 다른
            주소로 보내라는 문장이 들어 있다면 어떻게 해야 할까요. 내용을 읽는
            과정과 행동을 허용하는 과정이 섞이면 외부 문서가 작업의 목적을 바꿀
            수 있습니다.
          </p>
          <p>
            분석할 자료와 사용자의 요청을 구분하고 실제 전송 가능 여부는 실행
            환경에서 확인합니다. 이 글은 악성 문장이 섞인 이메일 한 통을 읽는
            동안 어떤 정보가 어디까지 갈 수 있는지 추적합니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 문서는 분석으로, 행동 제안은 권한 검사로 보냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            사용자의 요청과 외부 자료를 출처가 구분된 채 읽습니다. 모델이 만든
            행동 제안은 별도의 검사로 보냅니다. 실행 담당자는 허용된 행동만
            수행하고 결과를 다음 판단에 돌려줍니다.
          </p>
          <p>
            자료에 쓴 명령문은 이 흐름을 건너뛸 수 없습니다. 문장이 설득력 있어
            보이는지와 실제 자원에 접근할 수 있는지는 다른 문제입니다. 작은
            예에서 금지되는 이동을 표시해 보겠습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>요청과 자료의 출처를 구분한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>다음 행동을 제안한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>형식·권한·대상을 검사한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>허용된 행동의 결과만 돌려준다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 이메일 한 통과 고객 정보 100건이 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            사용자는 이메일 1통의 요약만 요청했습니다. 실행 환경은 그 이메일
            읽기와 요약 반환을 허용하지만 고객 정보 100건의 외부 전송은 허용하지
            않습니다. 이메일에 고객 목록을 외부 주소로 보내라는 문장이 들어
            있다고 합시다. 수와 주소는 가정입니다. (가정)
          </p>
          <p>
            모델이 그 문장을 잘못 따르더라도 실제 전송은 0건이어야 합니다.
            요약은 이메일 내용을 다루되 고객 목록을 읽거나 전송하는 권한을 새로
            만들지 않습니다. 성공 기준은 모델이 나쁜 문장을 보지 않는 것이
            아니라 허용하지 않은 행동이 실행되지 않는 것입니다. (가정)
          </p>
        </div>
      </section>

      <section
        id="inside-boundary"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 모양·권한·현재 조건을 따로 묻습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실행 검사에서 먼저 요청의 필드와 값의 모양이 맞는지 확인합니다.
            다음에는 지금 요청한 주체에게 고객 목록을 읽고 내보낼 권한이 있는지
            확인합니다. 마지막으로 수신 대상과 현재 승인 조건을 검사합니다.
          </p>
          <p>
            필드가 모두 있어도 권한이 없으면 멈춥니다. 권한이 있어도 다른 수신
            주소를 쓰면 허용되지 않을 수 있습니다. 검사 결과와 실제 전송 기록을
            남겨야 나중에 무엇이 막혔는지 알 수 있습니다.
          </p>
        </div>
      </section>

      <section id="why-boundary" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 문장을 잘 따르는 능력만으로는 전송을 막지 못합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            외부 문서의 지시를 무시하라고 모델에게 설명하면 올바른 판단에 도움이
            됩니다. 그러나 모델이 설명을 어겼을 때에도 전송을 막으려면 실제 호출
            경로에 검사가 있어야 합니다. 이 검사가 빠진 다른 도구나 재시도
            경로가 있다면 우회가 가능합니다.
          </p>
          <p>
            거부 결과는 전송 성공으로 돌려주지 않습니다. 권한 때문에 실행하지
            않았다는 사실을 반환해 다음 판단이 실제 상태를 알게 합니다. 의미를
            해석하는 층과 행동을 강제하는 층을 구분했으니 이제 이름을 붙입니다.
          </p>
        </div>
      </section>

      <section id="three-layers" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 지시·외부 자료·실행 검사는 역할이 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모델에게 목표와 행동 원칙을 전달하는 메시지가 instruction입니다.
            분석 대상으로 받은 이메일은 untrusted data입니다. 실제 호출을
            허용하거나 거부하는 실행 검사가 runtime enforcement입니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Instruction",
              description: "목표·완료 조건·행동 원칙을 모델에게 전달합니다.",
              boundary: "메시지 자체가 파일·네트워크 권한을 만들지는 않습니다.",
            },
            {
              term: "Untrusted data",
              description: "요약·분석·인용하려고 읽은 외부 자료입니다.",
              boundary:
                "그 안의 명령문은 권한을 부여한 사용자의 요청과 같지 않습니다.",
            },
            {
              term: "Runtime enforcement",
              description:
                "실행 환경이 형식·주체 권한·대상과 정책을 검사해 강제합니다.",
              boundary:
                "모든 실행 경로를 거쳐야 하며 빠진 경로는 우회점이 됩니다.",
            },
            {
              term: "Effect receipt",
              description:
                "실제로 실행한 행동·대상·식별자·결과를 남기는 기록입니다.",
              boundary: "실행 제안과 실제 전송 완료는 다른 상태입니다.",
            },
            {
              term: "Prompt injection",
              description:
                "외부 입력의 문장을 지시로 오인하도록 유도하는 공격입니다.",
              boundary:
                "문자열 필터 하나로 모든 변형을 막는다고 보장하지 않습니다.",
            },
          ]}
        />
        <InstructionBoundaryViz />
      </section>

      <section id="request-trace" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          7. 형식이 맞아도 권한이 없으면 100건은 나가지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력은 user_request=이메일 요약, data=email-1입니다. 외부 문장을
            따른 잘못된 제안이 export(customers=100,
            destination=outside.example)로 만들어졌다고 합시다. 필드 모양 검사는
            1이지만 현재 주체의 내보내기 권한 검사는 0입니다. (가정)
          </p>
          <p>
            실행 환경은 allow=0을 반환하고 전송을 호출하지 않습니다. 다음 관측은
            status=denied, sent=0입니다. 요약 권한이 남아 있으면 이메일 내용만
            요약할 수 있습니다. 외부 전송이 거부됐다고 요약까지 성공했다고
            꾸미지 않습니다. (가정)
          </p>
          <p>
            최종 전송 수는 처음 정한 0건과 맞아야 합니다. 모델의 제안 기록과
            실제 실행 기록을 나누어 두면 잘못된 시도와 실제 유출을 구분할 수
            있습니다. 다음 절에서 이 결정을 식과 보안 지침에 대응합니다.
          </p>
        </div>
      </section>

      <section id="attack-path" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          8. 독립된 세 조건을 모두 통과해야 실행합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            아래 식은 형식·권한·현재 정책을 모두 요구하는 설계입니다. 사례의
            권한 값이 0이면 다른 값과 무관하게 1∧0∧정책값=0입니다. 이는 모델의
            확률적 판단을 정확도로 바꾸는 식이 아니라 애플리케이션의 실행
            조건입니다.
          </p>
          <p>
            공식 보안 지침은 도구 호출을 사용자 권한과 현재 대화 상태에
            대조하도록 요구합니다. 지시문을 바꾸는 것과 실행 권한을 확인하는
            것을 분리하는 이유입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Retrieved data가 tool call을 유도해도 왜 바로 실행하지 않나요?"
          idea={
            <p>
              Model proposal을 실행 후보로만 취급하고 구조가 맞는지·caller가
              권한이 있는지·현재 policy가 허용하는지 각각 검사합니다. 하나라도
              거짓이면 effect를 만들지 않습니다.
            </p>
          }
          formula={String.raw`\mathrm{allow}(a)=V_{schema}(a)\land V_{auth}(a,u)\land V_{policy}(a,s)`}
          annotatedFormula={String.raw`\begin{aligned}a'&=\underbrace{V_{schema}(a)}_{\substack{\text{input shape·type}\\\text{검증}}}\\p&=\underbrace{V_{auth}(a,u)}_{\substack{\text{caller capability}\\\text{확인}}}\\g&=\underbrace{V_{policy}(a,s)}_{\substack{\text{destination·redaction}\\\text{approval policy 적용}}}\\\mathrm{allow}(a)&=\underbrace{a'\land p\land g}_{\substack{\text{세 gate가 모두 참일 때}\\\text{effect 허용}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`V_{schema}(a)`,
              annotation: [
                "model proposal을 parser에 넣어",
                "허용된 tool input shape인지 검사",
              ],
            },
            {
              expression: String.raw`V_{auth}(a,u)`,
              annotation: [
                "caller identity와 capability를 비교해",
                "이 action을 실행할 권한이 있는지 검사",
              ],
            },
            {
              expression: String.raw`V_{policy}(a,s)`,
              annotation: [
                "현재 runtime state를 반영해",
                "destination·redaction·approval 정책 적용",
              ],
            },
            {
              expression: String.raw`a'\land p\land g`,
              annotation: [
                "독립 gate를 AND로 결합해",
                "모두 통과한 effect만 실행",
              ],
            },
          ]}
          terms={[
            {
              symbol: "a",
              name: "Proposed action",
              description: "Model이 제안한 tool call입니다.",
            },
            {
              symbol: "u",
              name: "Caller identity",
              description: "현재 request와 capability owner입니다.",
            },
            {
              symbol: "s",
              name: "Runtime state",
              description: "Policy version·approval·destination 상태입니다.",
            },
          ]}
          assumptions={[
            "Validator 실패는 빈 성공이 아니라 명시적 reject observation으로 돌아갑니다.",
            "권한과 policy는 prompt 밖의 application state에서 조회합니다.",
            "외부 write는 stable operation ID와 effect receipt를 남깁니다.",
          ]}
          interpretation="Email이 고객 목록 전송을 요구해도 caller에게 export capability가 없으면 authorization gate에서 중단합니다."
        />
        <div id="paper-owasp-prompt-injection" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="OWASP — LLM Prompt Injection Prevention Cheat Sheet, Agent-Specific Defenses"
            citeKey={1}
            href="https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html#agent-specific-defenses"
          >
            <q>
              Validate tool calls against user permissions and session context
            </q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              100건 전송 제안을 현재 사용자의 요약 전용 권한과 대조하면
              거부됩니다. 권한은 이메일 본문에 적힌 주장으로 갱신하지 않고 실행
              환경의 정책에서 읽습니다. 이 예는 해당 지침의 적용이며 전체
              시스템이 모든 공격에 안전하다는 증명은 아닙니다. (가정)
            </p>
          </div>
        </div>
        <AlgorithmBlock
          title="전송 제안을 실행하기 전 검사 (의사코드)"
          input={["제안한 행동·현재 사용자·실행 정책"]}
          steps={[
            {
              code: "if invalid_shape(action): return rejected",
              note: "필수 필드와 허용된 값을 확인합니다.",
            },
            {
              code: "if not authorized(user, action): return denied",
              note: "현재 주체의 실제 권한을 조회합니다.",
            },
            {
              code: "if not permitted_destination(action): return denied",
              note: "대상과 승인 상태를 확인합니다.",
            },
            {
              code: "result ← execute(action); record(result)",
              note: "모든 검사를 통과한 행동만 실행하고 결과를 남깁니다.",
            },
          ]}
          output="명시적 거부 또는 실행 결과"
        />
      </section>

      <section id="release" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          9. 재시도와 다른 실행 경로도 같은 검사를 거쳐야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            직접 호출은 막았지만 다른 작업자나 확장 기능이 같은 전송을 할 수
            있다면 경계가 열려 있습니다. 재시도, 위임, 저장해 둔 승인 결과에서도
            현재 대상과 권한을 확인합니다. 승인은 특정 대상과 변경에 연결되어야
            합니다.
          </p>
          <p>
            권한이 지나치게 넓으면 검사를 올바르게 구현해도 원치 않는 행동이
            허용될 수 있습니다. 최소 권한과 필요한 데이터만 읽는 설계를 함께
            적용합니다. 로그에 민감한 원문을 무제한 저장하는 것 역시 별도 정보
            노출이 됩니다.
          </p>
          <p>
            이 사례는 고객 목록 전송 1경로의 동작을 설명합니다. 실제 검수는 공격
            문장 수뿐 아니라 도달 가능한 실행 경로와 관측한 유출 여부를 확인해야
            합니다.
          </p>
        </div>
        <ContentBoundary article="context-instruction-boundaries" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 어느 값이 실행을 막을까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            형식 검사는 통과했지만 요약 전용 사용자입니다. 100건 전송의 allow
            값과 실제 전송 수는 얼마인가요? (답: 7절)
          </p>
          <p>
            이메일 본문에 관리자가 허용했다는 문장이 있습니다. 그것만으로 권한
            값을 1로 바꿀 수 있나요? (답: 8절)
          </p>
          <p>
            직접 전송 경로는 막았지만 재시도 경로가 정책 검사를 건너뜁니다. 어떤
            검증이 더 필요한가요? (답: 9절)
          </p>
        </div>
      </section>
    </div>
  );
}
