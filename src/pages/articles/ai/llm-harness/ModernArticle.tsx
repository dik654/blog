import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import { HarnessBoundaryViz } from "./viz/ModernHarnessViz";

export default function LlmHarnessArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LLM harness는 model 바깥의 실행 시스템입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Model은 다음 action을 <strong>제안</strong>할 수 있습니다. 그러나
            어떤 identity가 어느 resource를 바꿔도 되는지, effect가 실제로
            일어났는지, 언제 run을 끝낼지는 runtime이 강제해야 합니다.
          </p>
        </div>
        <span id="agent-scaffold" className="scroll-mt-20" />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 model 제안·runtime 권한·executor·observation을 매 step 반복하는
            기본 구조를 <strong>agent scaffold</strong>라 부릅니다. 어떤
            business task를 맡기든 새로 짜지 않고 재사용하는 loop 뼈대와
            상태 관리 부분입니다.
          </p>
          <p>
            가령 문서 요약 agent와 배포 agent는 만드는 결과물이 다르지만 propose→authorize→execute→observe 4단계와 다음 step에 넘길 state
            형식은 같은 scaffold를 씁니다. Scaffold가 바뀌는 부분은 여기에 꽂히는 tool 목록과 verifier뿐입니다.
          </p>
        </div>
        <TermBreakdown
          title="한 action을 실행 결과로 바꾸는 네 주체"
          items={[
            {
              term: "Model",
              description:
                "현재 context에서 다음 action과 argument를 제안합니다.",
              example: "deploy(project=A)를 출력합니다.",
              boundary: "제안은 authority나 실행 완료 receipt가 아닙니다.",
            },
            {
              term: "Runtime",
              description:
                "Identity·target·operation·approval을 policy와 비교합니다.",
              example:
                "workspace-write는 허용하지만 production deploy는 승인 전 거절합니다.",
            },
            {
              term: "Executor",
              description:
                "허용된 action을 실제 tool·filesystem·API에 적용합니다.",
              example:
                "Stable operation key로 deployment API를 한 번 호출합니다.",
            },
            {
              term: "Observation",
              description:
                "Result·error·effect receipt·verifier 판정을 다음 step에 돌려줍니다.",
              example:
                "Deployment ID와 target revision, health result를 반환합니다.",
            },
          ]}
        />
        <HarnessBoundaryViz />
        <ContentBoundary article="llm-harness" />
      </section>
      <section id="proposal-runtime" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Tool schema를 말할 수 있는 능력과 실행 권한은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prompt의 “삭제하지 마라”나 typed function argument는 authorization이 아닙니다. Runtime은 current identity와
            resource scope를 다시 검사하고 외부 write에는 stable operation key와 receipt를 요구해야 합니다.
          </p>
          <p>
            여기서 schema가 답하는 질문은 “argument 모양이 맞는가”입니다. 반면
            capability는 “현재 identity가 이 resource에 이 operation을 실행해도
            되는가”를 답합니다. 두 질문을 분리해야 model이 유효한 JSON을 만들었다는
            이유만으로 실제 write가 허용되는 일을 막을 수 있습니다.
          </p>
        </div>
      </section>
      <section id="operation-roles" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          도구 이름보다 operation이 가진 권한을 먼저 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 “파일 도구”라도 목록을 읽는 operation과 내용을 바꾸는 operation은 실패했을 때의 결과가 다릅니다. 계산기는 수식을 정확히 계산할 수 있지만 입력한 세율이
            실제 문서에 있는 사실인지 결정할 권한은 없습니다. 그래서 실행 경계는 tool family가 아니라 이번 step에서 맡은 역할로 나누는 편이 모델과 adapter가 바뀌어도
            안정적입니다.
          </p>
          <p>
            Office Secretary의 dogfooding에서는 이 차이를 네 역할로 일반화했습니다.
            각 역할은 다음 역할에 넘길 수 있는 evidence와 실패 뒤 다시 열 수 있는
            operation이 다릅니다.
          </p>
        </div>
        <TermBreakdown
          title="Operation을 네 역할로 나누면 무엇이 달라지나요?"
          items={[
            {
              term: "Observation selector",
              description:
                "허용된 root와 scope 안에서 현재 상태를 읽고, 이후 판단이 참조할 evidence를 만듭니다.",
              example:
                "Exact path의 실제 파일 metadata를 읽어 path·size·revision을 observation으로 반환합니다.",
              boundary:
                "새 상태를 만들거나 관찰되지 않은 사실을 보충할 권한은 없습니다.",
            },
            {
              term: "Deterministic transform",
              description:
                "사용자 입력이나 검증된 observation에 있는 피연산자만 계산·정렬·형식화합니다.",
              example:
                "문서에서 확인된 금액과 세율로 합계를 계산하고 중간값과 최종값을 구분합니다.",
              boundary:
                "계산 성공이 입력 사실의 진실성을 증명하지는 않습니다.",
            },
            {
              term: "Creative artifact",
              description:
                "문서·슬라이드·답변처럼 열린 형태의 산출물을 만들되, 별도 validator가 검사할 typed field를 함께 냅니다.",
              example:
                "본문과 source ID를 가진 문서 초안을 저장한 뒤 문장 수·필수 근거·금지 필드를 검사합니다.",
              boundary:
                "Writer의 자연어 완료 선언은 artifact 검사를 대체하지 않습니다.",
            },
            {
              term: "State mutation",
              description:
                "승인·precondition·backup·journal이 묶인 transaction 경계 안에서만 외부 상태를 바꿉니다.",
              example:
                "파일 변경 plan을 보여 주고 one-use 승인을 받은 뒤 backup과 undo 기록을 남깁니다.",
              boundary:
                "실행 전 조건이 없거나 결과가 불명확하면 성공으로 보고하지 않습니다.",
            },
          ]}
        />
      </section>
      <section id="feedback-loop" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          결과는 문자열보다 typed observation으로 돌아옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “성공한 것 같다” 대신 exit status, created resource identity,
            checksum, verifier result와 retry classification을 돌려줘야 다음
            action과 종료를 구분할 수 있습니다. 이 loop를 실제 작업 단위로 묶는
            방법은 <a href="/ai/agent-run-contract">run contract 글</a>에서
            이어집니다.
          </p>
          <p>
            읽기 결과도 예외가 아닙니다. 선택한 업무 ID, 적용 규칙, 중간 계산과 최종값이 자유문자열 draft를 거치는 동안 바뀔 수 있으므로 최종 답변 직전까지 역할이 붙은
            field로 보존해야 합니다. 자연어 presenter는 이 envelope를 읽어 설명할 수 있지만 새 수치나 식별자를 만들 수 없습니다.
          </p>
        </div>
      </section>
      <section id="artifact-repair" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          복잡한 산출물은 한 번에 생성하지 않고 위반한 부분만 고칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            로컬 Claude 산출물의 작업 기록을 보면 높은 품질의 HTML·DOCX가 one-shot으로 나온 것이 아니었습니다. 요구를 확인하고 현재 artifact를 읽고 typed
            writer로 저장한 뒤 schema·render·fresh-reader 같은 독립 검사를 거쳐 실패한 구간만 좁게 수정했습니다. 여기서 재사용할 것은 Claude의 숨은
            사고과정이나 특정 prompt가 아니라 외부에서 관찰하고 재실행할 수 있는 loop입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Typed artifact를 독립 검사와 targeted patch로 교정하는 절차"
          input={[
            "사용자 목표와 acceptance condition",
            "현재 source·artifact·environment observation",
            "typed artifact schema와 independent validators",
            "허용된 patch scope·retry budget·effect policy",
          ]}
          steps={[
            {
              code: "contract ← clarify(goal, acceptance, missing_inputs)",
              note: "완료 조건과 비어 있는 입력을 먼저 고정합니다.",
            },
            {
              code: "evidence ← observe(allowed_sources, current_artifact)",
              note: "추측 대신 현재 상태를 읽고 source identity를 보존합니다.",
            },
            {
              code: "artifact ← write_typed(contract, evidence)",
              note: "자유문자열만 넘기지 않고 필수 field와 역할을 구조화합니다.",
            },
            {
              code: "violations ← validate_independently(artifact, contract)",
              note: "Writer의 self-report와 분리된 schema·render·test·reader 검사를 실행합니다.",
            },
            {
              code: "patch ← repair_only(artifact, violations, observed_context)",
              note: "전체를 다시 생성하지 않고 실패한 field·구간만 수정합니다.",
            },
            {
              code: "receipt ← revalidate(patch, unchanged_invariants)",
              note: "고친 위반과 기존에 통과한 항목의 회귀를 함께 확인합니다.",
            },
          ]}
          repeatUntil="필수 validator가 모두 통과하거나 retry budget이 끝나 사람에게 근거·미완료 항목과 함께 넘길 때까지 반복합니다."
          output="versioned artifact + validator receipt + unresolved violations"
        />
        <ProgressiveDetail
          title="왜 self-critique만으로는 독립 검사가 되지 않나요?"
          preview="같은 model과 context가 초안을 만들고 판정하면 같은 누락을 다시 보지 못할 수 있어, artifact 밖의 oracle이 필요합니다."
        >
          <p>
            DOCX package validator, compiler, test, browser render처럼 결과를 직접 읽는 검사는 생성 문장의 그럴듯함과 무관하게 실패를 잡습니다.
            자연어 품질처럼 결정적 oracle이 없는 항목도 새 context의 reader나 rubric judge를 사용할 수 있지만 그 score는 raw artifact와
            transcript 감사를 대체하지 않습니다.
          </p>
          <p>
            Office Secretary의 held-out 자동 평가는 처음에 20/20을 통과시켰지만 수동 transcript 감사에서 structured-output 실패와 잘린
            장문을 발견했습니다. 그래서 top-line score 뒤에는 실패 원문과 tool result를 표본 감사하는 단계가 남아야 합니다.
          </p>
        </ProgressiveDetail>
      </section>
      <section id="model-change" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          모델이 좋아져도 하네스 불변식은 남고, 불필요한 보정만 제거합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모델이 발전하면 tool 설명을 더 잘 따르고 긴 작업도 덜 흔들릴 수 있습니다.
            그렇다고 identity 확인, one-use approval, idempotency, receipt와 독립
            verifier를 model에게 되돌려 줄 수는 없습니다. 이들은 모델 지능이 아니라
            외부 effect의 권한과 사실성을 소유하기 때문입니다.
          </p>
          <p>
            반대로 특정 model의 실수를 막으려고 붙인 prompt 반복, tool shim과 retry는 영구 규칙으로 고정하면 안 됩니다. 같은 frozen fixture에서 장치
            하나를 제거하고 correctness·tool call·token·latency·새 실패를 함께 비교해 model이 이미 흡수한 보정은 줄여야 합니다.
          </p>
          <span id="harness-quality" className="scroll-mt-20" />
          <p>
            같은 model이라도 <strong>harness quality</strong>에 따라 실제
            성능이 크게 갈립니다. Tool 설명이 argument 예시까지 주는지,
            에러 메시지가 “실패했습니다” 대신 어떤 필드가 왜 거부됐는지
            말해 주는지, 재시도 로직이 같은 실수를 무한 반복하지 않고
            원인을 바꿔 재시도하는지가 harness quality를 가릅니다.
          </p>
          <p>
            앞서 본 9B·27B 비교가 이 관점을 그대로 보여 줍니다. 같은
            9B model이 strict-count 요구를 0/27에서 27/27로 옮긴 것은
            model이 좋아져서가 아니라 cardinality 검사를 deterministic
            renderer로 옮긴 harness 쪽 변화였습니다. Model quality를
            고정해도 harness quality만으로 결과가 이렇게 바뀔 수 있습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Office Secretary의 9B·27B 실측은 무엇을 보여 주고, 무엇은 말하지 않나요?"
          preview="Raw model의 우위와 agent system의 최종 품질은 다르며, 결정적인 형식 문제는 runtime으로 옮길 수 있었습니다."
        >
          <p>
            2026-08-21의 strict-count fixture에서 <code>qwen36-27b-fp8</code>은
            27/27, <code>qwen35-9b</code>은 0/27이었습니다. 두 checkpoint는 크기뿐
            아니라 세대와 FP8 여부도 달라 “27B가 항상 낫다”는 비교로 읽을 수 없습니다.
          </p>
          <p>
            같은 exact-32 요구를 deterministic renderer로 옮기자 9B 구성의 agent도 exact case 27/27과 표현 변형 135/135를 통과했고 그
            slice의 model call, tool call과 token은 0이 됐습니다. 이는 작은 model의 일반 추론 우위를 뜻하지 않습니다. Model이 판단할 필요가 없는
            cardinality·serialization을 runtime owner에게 옮기면 해당 실패 class를 model scale과 분리할 수 있다는 한 controlled
            fixture입니다.
          </p>
          <p>
            원문 환경과 표는 <a href="https://github.com/dik654/ojs-agents/blob/c6b0fb756aa66a33e9f0b1cd4a53c2ee1202a618/products/office-secretary/experiments/MODEL_SIZE_DECISION.md">project measurement record</a>에
            고정돼 있습니다.
          </p>
        </ProgressiveDetail>
      </section>
      <section id="paper-effective-agents" className="scroll-mt-20">
        <div className="not-prose space-y-4">
          <CitationBlock
            source="Anthropic — Building effective agents"
            citeKey={1}
            href="https://www.anthropic.com/engineering/building-effective-agents"
          >
            Workflow와 agent를 구분하고 단순한 구조에서 관측된 필요에 따라
            routing·parallelization·evaluation을 추가합니다. 모든 agent
            architecture의 표준 분류나 보편 성능 보장은 아닙니다.
          </CitationBlock>
          <CitationBlock
            source="Anthropic — Writing effective tools for AI agents"
            citeKey={2}
            href="https://www.anthropic.com/engineering/writing-tools-for-agents"
          >
            실제 workload에서 tool 선택·parameter·call 수·result 처리와 raw
            transcript를 함께 보고, tool boundary와 high-signal response를 반복
            개선합니다. 특정 tool 목록이 모든 agent에 최적이라는 주장은 아닙니다.
          </CitationBlock>
          <CitationBlock
            source="Anthropic — Demystifying evals for AI agents"
            citeKey={3}
            href="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
          >
            안정된 eval environment에서 outcome grader뿐 아니라 transcript,
            tool-call, token·latency metric을 함께 추적합니다. Top-line score 하나가
            trajectory와 side effect의 correctness를 모두 대표하지는 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
