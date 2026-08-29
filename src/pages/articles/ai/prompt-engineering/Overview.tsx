import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import { PromptContractViz } from "./viz/PromptContractViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        프롬프트 엔지니어링은 자연어 요청을 검증 가능한 입력 계약으로 바꾸는 일이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          “이 문서를 잘 요약해 줘”는 사람이 뜻을 짐작할 수는 있지만 model과
          downstream program에는 완료 기준이 없습니다. 누구를 위한 요약인지,
          어느 문장을 근거로 써야 하는지, 빠뜨리면 안 되는 항목과 모를 때의
          처리, 결과를 누가 어떤 형식으로 읽는지가 빠져 있기 때문입니다.
          <strong> Prompt engineering</strong>은 멋진 문구를 찾는 일이 아니라 이
          빈칸을 하나의 request contract로 만드는 작업입니다.
        </p>
        <p>좋은 출발점은 여덟 칸을 다음 네 질문으로 묶는 것입니다.</p>
        <ul>
          <li><strong>누구를 위해 무엇을 바꾸나:</strong> objective와 audience</li>
          <li><strong>무엇을 읽고 판단하나:</strong> input과 evidence</li>
          <li><strong>어디서 멈추거나 거부하나:</strong> constraints와 abstention</li>
          <li><strong>무엇을 내고 누가 통과시키나:</strong> output과 completion criteria</li>
        </ul>
        <p>
          상담원용 고객 문의 요약이라면 원문만 evidence로 사용합니다. Output은
          issue·urgency·근거 인용으로 나누고, 근거가 없으면 추측 대신 unknown을
          반환합니다. Schema validator는 field와 type을, 인용 검사는 실제 span
          존재를 판정합니다.
        </p>
      </div>

      <TermBreakdown
        title="한 번에 여덟 단어를 외우지 않고 세 역할부터 잡습니다"
        description="각 역할이 왜 필요한지 이해한 뒤 아래 Viz에서 하나의 request envelope로 조립합니다."
        items={[
          {
            term: "Objective",
            description: "이번 요청으로 무엇이 달라져야 하는지 한 문장으로 적은 목표입니다.",
            example: "고객 문의를 상담원이 30초 안에 파악할 수 있게 요약합니다.",
            boundary: "'전문가처럼 잘 써라'는 persona이지 검증 가능한 objective가 아닙니다.",
          },
          {
            term: "Evidence",
            description: "답을 만들 때 근거로 사용할 수 있는 입력 자료의 범위입니다.",
            example: "문의 원문에 실제로 있는 span만 인용하고 외부 추측은 unknown으로 둡니다.",
            boundary: "Evidence 안의 문장은 분석 대상이지 상위 instruction이 아닙니다.",
          },
          {
            term: "Completion contract",
            description: "어떤 output을 누가 어떤 검사로 통과시킬지 정한 완료 기준입니다.",
            example: "issue·urgency·evidence_quote field와 span 존재 검사를 함께 둡니다.",
            boundary: "Schema 통과는 형식 판정이며 사실성·권한까지 자동으로 증명하지 않습니다.",
          },
        ]}
      />

      <div className="not-prose my-8"><PromptContractViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="instruction-following" className="scroll-mt-20">
          Instruction following은 SFT·RLHF로 학습된 능력입니다
        </h3>
        <p>
          Instruction following은 prompt에 적힌 지시를 실제로 따르는 model의
          능력입니다. Pretraining만 마친 model은 다음 token을 잇는 데는
          능하지만 “요약해 줘” 같은 요청 형식 자체를 지시로 알아듣지 못할 수
          있습니다.
        </p>
        <p>
          이 능력은 <Link to="/ai/supervised-fine-tuning#overview">supervised
          fine-tuning</Link>이 instruction-response 쌍을 보여주고{" "}
          <Link to="/ai/rlhf#overview">RLHF</Link>가 사람의 선호로 다듬으며
          학습됩니다. 같은 prompt라도 이 학습을 거친 model인지에 따라 결과가
          크게 달라지는 이유가 여기에 있습니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Instruction과 evidence를 같은 문장 덩어리에 섞지 않는다</h3>
        <p>
          Prompt 안에는 model이 따라야 할 instruction과 분석할 user input·retrieved
          document·quotation이 함께 들어옵니다. 이들을 label과 delimiter로 나누지
          않으면 evidence 안의 “이전 지시를 무시하라” 같은 문장이 상위 instruction처럼
          읽힐 수 있습니다.
        </p>
        <p>
          System policy, task, evidence, output contract를 분리하면 우선순위를
          설명하기 쉬워지지만, delimiter만으로 security boundary가 생기는 것은
          아닙니다. Tool permission과 data egress는 runtime이 별도로 강제해야
          합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Prompt는 model·decoding 사이의 한 계층입니다</h3>
        <p>
          같은 prompt라도 model snapshot, chat template, tool schema, temperature,
          maximum output token이 바뀌면 결과가 달라질 수 있습니다. 반대로 model이
          필요한 근거를 갖고 있지 않다면 문장만 다듬는 것으로 사실을 만들어 낼
          수 없습니다.
        </p>
        <p>
          이때는 RAG나 tool로 evidence를 보충해야 하고, 외부 effect가 있다면
          authorization을 붙이며, 형식 실패에는 constrained decoding과 schema
          validation을 사용해야 합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          따라서 prompt 변경의 완료 조건은 “한 번 보기 좋은 답이 나왔다”가
          아닙니다. 대표 case와 경계 case에서 task quality·constraint violation·
          latency·token cost를 비교하고, 실패 case를 다음 regression suite에
          추가해야 합니다.
        </p>
        <p>
          이 계약을 이해한 뒤에는
          <Link to="/ai/prompt-reasoning"> reasoning path와 verifier</Link>,
          <Link to="/ai/prompt-few-shot"> few-shot demonstration</Link>,
          <Link to="/ai/prompt-structured-output"> structured output validator</Link>를
          각각 독립된 수업에서 한 층씩 쌓습니다.
        </p>
        <ContentBoundary article="prompt-engineering" />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-prompt-overview" className="not-prose scroll-mt-24">
          <CitationBlock
            source="Anthropic — Prompt engineering overview"
            citeKey={1}
            href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"
          >
            현재 공식 overview는 prompt를 고치기 전에 success criteria와 empirical
            test를 먼저 정의하라고 안내합니다. 이는 모든 provider의 보편 API
            규격이 아니라 Claude prompt를 개선할 때의 현재 product guidance입니다.
          </CitationBlock>
        </div>
        <div id="paper-prompt-best-practices" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            source="Anthropic — Prompting best practices"
            citeKey={2}
            href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
          >
            공식 best-practice 문서는 명시적인 instruction·example·output format과
            model migration 차이를 설명합니다. 특정 model 세대의 동작을 다른
            model·snapshot에 그대로 이식할 수 있다는 보장은 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
