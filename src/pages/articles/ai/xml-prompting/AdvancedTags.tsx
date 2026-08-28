import { Link } from "react-router-dom";
import AdvancedTagsViz from "./viz/AdvancedTagsViz";
import AdvancedTagsDetailViz from "./viz/AdvancedTagsDetailViz";

export default function AdvancedTags() {
  return (
    <section id="advanced-tags" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        반복되는 문서와 example에는 순서가 아니라 identity가 필요하다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          문서 하나는 <code>&lt;document&gt;</code>로 감싸면 되지만 문서가 스무
          개라면 “세 번째 문서”라는 위치만으로는 안정적으로 인용하기 어렵습니다.
          검색 순위가 바뀌거나 일부 문서가 빠지는 순간 같은 번호가 다른 자료를
          가리키기 때문입니다.
        </p>
        <p>
          반복 record는 <code>&lt;documents&gt;</code> container 아래에 둡니다. 각
          <code> &lt;document&gt;</code>에는 <code>id</code>와 <code>source</code>처럼 안정된
          identity를 부여합니다.
        </p>
        <p>
          Output citation도 이 ID를 참조하게 해야 model의 주장과 application-side 원문 조회가
          같은 record를 가리킬 수 있습니다.
        </p>
        <pre className="whitespace-pre-wrap break-words">
          <code>{`<documents>
  <document id="policy-v7-s3" source="employee-handbook">
    <content>...</content>
  </document>
  <document id="faq-42" source="hr-faq">
    <content>...</content>
  </document>
</documents>`}</code>
        </pre>
        <p>
          Attribute 이름을 <code>id</code>로 썼다고 XML processor가 자동으로
          uniqueness를 확인하는 것은 아닙니다. DTD나 XSD에서 ID type과 reference 관계를
          선언하거나 application validator가 중복 ID와 존재하지 않는 citation을 검사해야 합니다.
        </p>
        <p>
          ID에는 민감한 내부 경로나 임시 access token을 넣지 않습니다. Log와 재시도에서도
          안전하게 유지할 수 있는 opaque identifier를 사용합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <AdvancedTagsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Example은 input과 expected output을 한 record로 묶는다</h3>
        <p>
          Few-shot example도 같은 원리로 구성합니다. 여러 input을 먼저 모은 뒤
          여러 output을 따로 나열하면 어느 쌍이 대응하는지 순서에 의존하게 됩니다.
          대신 <code>&lt;examples&gt;</code> 아래에서 example 하나마다 input과
          expected output을 함께 묶습니다.
        </p>
        <p>
          예시는 label의 의미, 경계 사례, abstention과 output format을 보여 주는 장치입니다.
          어떤 사례를 고르고 순서를 어떻게 검증할지는
          <Link to="/ai/prompt-engineering#few-shot"> few-shot 정본 글</Link>이
          소유합니다.
        </p>
        <p>
          이 글에서는 예시 record가 서로 섞이지 않도록 직렬화하는 범위에만 집중합니다.
        </p>
        <pre className="whitespace-pre-wrap break-words">
          <code>{`<examples>
  <example id="refund-with-order-id">
    <input>주문 A-104를 취소하고 싶습니다.</input>
    <expected_output>
      <request_type>refund</request_type>
      <order_id>A-104</order_id>
    </expected_output>
  </example>
  <example id="missing-evidence">
    <input>지난번 주문을 취소해 주세요.</input>
    <expected_output>
      <request_type>refund</request_type>
      <order_id status="unknown" />
    </expected_output>
  </example>
</examples>`}</code>
        </pre>
        <p>
          Dynamic text를 넣을 때는 앞 절의 serializer를 그대로 사용합니다. CDATA로
          감싸더라도 <code>]]&gt;</code> 종료 표식은 처리해야 하며, tag처럼 보이는
          문장이 의미상 안전해지는 것은 아닙니다. 구조를 보존하는 escaping과
          untrusted content를 지시로 실행하지 않게 하는 runtime 방어를 한 기능으로
          묶지 않는 것이 중요합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <AdvancedTagsDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>조건·반복·tool 실행은 XML이 아니라 runtime이 수행한다</h3>
        <p>
          XML은 tree 모양의 data를 표현할 수 있지만 program의 control flow를
          실행하지는 않습니다. 예를 들어
          <code>&lt;if confidence=&quot;low&quot;&gt;review&lt;/if&gt;</code>라고 적는
          것은 model에게 의도를 설명할 뿐입니다. 조건을 결정적으로 판정하거나 review queue에
          넣는 code가 아닙니다.
        </p>
        <p>
          반복, 분기, retry budget, tool permission, database write와 network egress는
          application code나 agent runtime에 남깁니다.
        </p>
        <p>
          실전에서는 model이 <code>confidence</code>, <code>status</code>,
          <code>requested_action</code>처럼 검증 가능한 candidate를 반환하게 하고,
          runtime이 type과 허용 값을 확인한 뒤 다음 state를 선택합니다.
        </p>
        <p>
          그러면 prompt는 “무엇을 읽고 무엇을 제안할지”에 집중하고, system은 “무엇을 실제로
          실행할 수 있는지”를 코드와 policy로 통제합니다. XML을 작은 workflow language처럼
          확장할수록 두 책임이 섞이고 테스트하기 어려워집니다.
        </p>
      </div>
    </section>
  );
}
