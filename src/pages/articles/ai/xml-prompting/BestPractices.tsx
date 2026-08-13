import { Link } from "react-router-dom";
import BestPracticesViz from "./viz/BestPracticesViz";
import BestPracticesDetailViz from "./viz/BestPracticesDetailViz";

export default function BestPractices() {
  return (
    <section id="best-practices" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        XML을 채택하기 전에 같은 task에서 대안 형식과 비교한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          형식은 취향이 아니라 입력의 모양과 결과를 소비하는 주체에 맞춰
          선택합니다. 여러 source document와 example을 사람이 함께 읽고 stable
          ID로 인용해야 한다면 XML-like tag가 경계를 드러내기 좋습니다. 짧은
          설명과 목록은 Markdown이나 plain text가 더 읽기 쉽고, program이 typed
          record를 받아야 한다면 JSON Schema 또는 provider의 native structured
          output이 대체로 단순합니다. XML이 항상 정확하거나 JSON이 항상 비싸다는
          보편적인 순위는 없습니다.
        </p>
        <p>
          입력 delimiter와 output serialization도 같은 형식일 필요는 없습니다.
          예를 들어 여러 문서는 XML tag로 나누어 model에 전달하되, 결과는 native
          JSON structured output으로 받을 수 있습니다. Prompt의 request contract와
          demonstration selection은
          <Link to="/ai/prompt-engineering"> prompt-engineering 정본 글</Link>에서
          정하고, 이 글에서는 그 contract를 XML로 표현하고 안전하게 소비하는
          부분만 맡습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <BestPracticesViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>같은 조건의 paired eval로 형식을 고른다</h3>
        <p>
          먼저 실제 production 분포에서 정상 사례, 긴 문서, reserved character,
          누락 evidence, injection 문구, malformed output과 경계값을 포함한 task set을
          만듭니다. 그런 다음 model snapshot, system instruction, task 내용,
          decoding parameter와 retry budget은 고정하고 delimiter 또는 output format만
          Markdown·XML·JSON·native structured output으로 바꿉니다. 같은 input마다
          결과를 짝지어 비교해야 형식 이외의 차이를 줄일 수 있습니다.
        </p>
        <p>
          평가는 task accuracy만 보지 않습니다. Parse success와 schema compliance,
          domain·evidence violation, injection slice의 policy failure, input/output token,
          p50·p95 latency와 retry rate를 함께 기록합니다. XML tag가 늘린 token 수는
          prompt 구조와 tokenizer마다 달라지므로 고정된 10%나 20%로 가정하지 않고
          실제 request에서 측정합니다. 사람이 읽는 작업이라면 reviewer time과
          오류를 찾는 데 걸린 시간도 유용한 metric입니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <BestPracticesDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>배포 기준과 rollback 조건을 미리 적는다</h3>
        <p>
          새 형식은 “샘플 몇 개가 좋아 보였다”가 아니라 acceptance gate를 통과해야
          합니다. 예를 들어 기존 대비 task quality는 낮아지지 않고, parse failure와
          semantic violation은 정해진 상한 아래이며, p95 latency와 token cost는
          운영 예산 안에 있어야 한다고 정할 수 있습니다. Canary traffic에서 이
          기준을 다시 확인하고, 위반이 생기면 이전 prompt·parser·model snapshot으로
          되돌릴 수 있도록 version을 함께 저장합니다.
        </p>
        <p>
          Model이나 provider가 바뀌면 같은 regression suite를 다시 실행합니다.
          특정 Claude version에서 권장된 XML pattern이 다른 model에도 같은 효과를
          낸다고 가정할 수 없고, tokenizer·chat template·native structured output
          기능이 달라지면 비용과 실패 양상도 바뀝니다. 실패 사례는 prompt 문구로
          덮기 전에 framing, parser, schema, domain, policy 중 어느 단계의 문제인지
          분류해야 다음 변경의 범위를 작게 유지할 수 있습니다.
        </p>

        <h3>배포 전에는 다음 질문에 모두 답할 수 있어야 한다</h3>
        <ul>
          <li>
            Tag 이름이 instruction, untrusted data, example, output requirement의
            실제 역할을 설명하며 같은 역할에 일관되게 쓰였는가?
          </li>
          <li>
            Dynamic text와 attribute는 library serializer를 거치고, 반복 record의
            ID uniqueness와 citation reference를 validator가 확인하는가?
          </li>
          <li>
            Output은 size/frame, hardened parse, allowlist/schema, domain/evidence,
            policy를 거친 뒤에만 downstream action으로 전달되는가?
          </li>
          <li>
            DTD·external entity·network access를 끄고 size·depth·expansion·time
            limit과 parser version을 실제 공격 fixture로 검증했는가?
          </li>
          <li>
            XML과 대안 형식을 같은 task set에서 비교했으며 model 변경 시 canary와
            rollback 기준이 남아 있는가?
          </li>
        </ul>
        <p>
          이 질문에 답할 수 있다면 XML prompting을 단순한 태그 문법이 아니라
          delimiter 설계, 안전한 serialization, validator와 regression evaluation이
          이어지는 하나의 운영 계약으로 이해한 것입니다. 생성 단계의 문법 보장을
          더 깊게 비교하려면
          <Link to="/ai/grammar-constrained-generation">
            {" "}grammar-constrained generation
          </Link>
          으로 이어가면 됩니다.
        </p>
      </div>
    </section>
  );
}
