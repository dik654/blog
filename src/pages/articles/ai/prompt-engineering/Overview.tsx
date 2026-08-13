import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";
import { PrinciplesViz, HistoryViz } from "./viz/OverviewDetailViz";

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
        <p>
          좋은 출발점은 objective·audience·input·evidence·constraints·output·
          abstention·completion criteria의 여덟 칸입니다. 예를 들어 상담원을 위한
          고객 문의 요약이라면 원문만 evidence로 사용하고, issue·urgency·근거
          인용을 output으로 요구하며, 근거가 없으면 추측 대신 unknown을 반환하게
          합니다. 그다음 schema validator가 field와 type을 확인하고 인용 검사는
          evidence에 실제 span이 있는지 확인합니다.
        </p>
      </div>

      <div className="not-prose my-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Instruction과 evidence를 같은 문장 덩어리에 섞지 않는다</h3>
        <p>
          Prompt 안에는 model이 따라야 할 instruction과 분석할 user input·retrieved
          document·quotation이 함께 들어옵니다. 이들을 label과 delimiter로 나누지
          않으면 evidence 안의 “이전 지시를 무시하라” 같은 문장이 상위 instruction처럼
          읽힐 수 있습니다. System policy, task, evidence, output contract를 분리하면
          우선순위를 설명하기 쉬워지지만, delimiter만으로 security boundary가 생기는
          것은 아닙니다. Tool permission과 data egress는 runtime이 별도로 강제해야
          합니다.
        </p>
      </div>

      <div className="not-prose my-8"><PrinciplesViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Prompt는 model·context·decoder·validator 사이의 한 계층이다</h3>
        <p>
          같은 prompt라도 model snapshot, chat template, tool schema, temperature,
          maximum output token이 바뀌면 결과가 달라질 수 있습니다. 반대로 model이
          필요한 근거를 갖고 있지 않다면 문장만 다듬는 것으로 사실을 만들어 낼
          수 없습니다. 이때는 RAG나 tool로 evidence를 보충해야 하고, 외부 effect가
          있다면 authorization을 붙이며, 형식 실패에는 constrained decoding과
          schema validation을 사용해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8"><HistoryViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          따라서 prompt 변경의 완료 조건은 “한 번 보기 좋은 답이 나왔다”가
          아닙니다. 대표 case와 경계 case에서 task quality·constraint violation·
          latency·token cost를 비교하고, 실패 case를 다음 regression suite에
          추가해야 합니다. 이 글의 뒤쪽에서는 reasoning, structured output,
          demonstration과 evaluation을 이 계약의 서로 다른 부품으로 다룹니다.
        </p>
        <ContentBoundary article="prompt-engineering" />
      </div>
    </section>
  );
}
