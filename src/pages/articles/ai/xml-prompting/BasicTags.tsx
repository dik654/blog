import { CitationBlock } from "@/components/ui/citation";
import BasicTagsViz from "./viz/BasicTagsViz";
import BasicTagsDetailViz from "./viz/BasicTagsDetailViz";

export default function BasicTags() {
  return (
    <section id="basic-tags" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        최소 문법을 알면 태그가 자료를 망가뜨리는 이유까지 보인다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          XML을 처음 본다면 element를 이름이 붙은 상자라고 생각하면 됩니다.
          <code>&lt;input&gt;</code>은 상자를 여는 start tag이고,
          <code>&lt;/input&gt;</code>은 같은 이름의 end tag입니다. 두 태그 사이의
          text나 다른 element가 그 상자의 내용입니다.
        </p>
        <p>
          XML document 전체를 parser로 읽으려면 가장 바깥에 하나의 root element가 있어야
          합니다. 여러 블록은 <code>&lt;request&gt;...&lt;/request&gt;</code> 같은 root 아래에 둡니다.
        </p>
        <p>
          중첩은 마지막에 연 상자를 먼저 닫는 순서를 지켜야 합니다. 이를
          <strong> proper nesting</strong>이라고 합니다.
          <code>&lt;request&gt;&lt;input&gt;환불&lt;/input&gt;&lt;/request&gt;</code>는
          올바르지만,
          <code>&lt;request&gt;&lt;input&gt;환불&lt;/request&gt;&lt;/input&gt;</code>은
          두 element가 교차하므로 parser가 거부합니다.
        </p>
        <p>
          Start/end tag의 대소문자도 같아야 하고, attribute value는
          <code> id=&quot;doc-1&quot;</code>처럼 quote로 감쌉니다. 이 최소 조건을 만족하면
          <strong> well-formed</strong> XML이라고 부릅니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <BasicTagsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>태그 이름은 번호가 아니라 역할을 설명한다</h3>
        <p>
          Prompt용 표준 태그 목록은 없으므로 task의 data model에 맞춰 vocabulary를
          정합니다. 정책 비교라면 <code>&lt;instructions&gt;</code>,{
          " "
          }
          <code>&lt;source_documents&gt;</code>, 반복되는{
          " "
          }
          <code>&lt;document&gt;</code>, <code>&lt;examples&gt;</code>,{
          " "
          }
          <code>&lt;output_requirements&gt;</code>처럼 이름만 보고 책임을 알 수 있게 합니다.
        </p>
        <p>
          <code>&lt;data1&gt;</code>과 <code>&lt;data2&gt;</code>는 순서를 바꾸는 순간 의미가
          흐려집니다. 역할을 나타내는 이름은 순서와 독립적으로 읽힙니다.
        </p>
        <p>
          이름을 길게 만든다고 자동으로 좋아지는 것은 아닙니다. 같은 역할에는 같은 tag를 쓰고 instruction과 source, example과 실제 input처럼 혼동될 경계만
          분리합니다. 한 문장짜리 질문에 다섯 겹의 wrapper를 붙이면 가독성과 token cost만 늘기 쉽습니다. 필요한 구조를 가장 적은 수의 element로 표현하는 편이
          낫습니다.
        </p>
        <pre className="whitespace-pre-wrap break-words">
          <code>{`<request id="policy-comparison-17">
  <instructions>두 정책의 적용 조건과 예외를 비교한다.</instructions>
  <source_documents>
    <document id="policy-a" source="handbook-v7">...</document>
    <document id="policy-b" source="faq-2026-08">...</document>
  </source_documents>
  <output_requirements>주장마다 document id를 인용한다.</output_requirements>
</request>`}</code>
        </pre>
      </div>

      <div className="not-prose my-8">
        <BasicTagsDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>외부 text는 markup과 분리해 serialize한다</h3>
        <p>
          Template에 user text를 문자열로 바로 이어 붙이면 text 속의{
          " "
          }
          <code>&amp;</code>와 <code>&lt;</code>가 entity나 새 tag의 시작으로
          해석될 수 있습니다. 예를 들어 <code>R&amp;D &lt; 5</code>라는 원문은
          XML character data에서 <code>R&amp;amp;D &amp;lt; 5</code>로 serialize해야 parser가
          다시 원문 <code>R&amp;D &lt; 5</code>로 복원합니다.
        </p>
        <p>
          Attribute에 double quote가 포함되면 <code>&amp;quot;</code>로 바꿉니다. Single quote
          attribute라면 필요한 경우 <code>&amp;apos;</code>를 사용합니다.
        </p>
        <p>
          이 치환을 손으로 여러 번 적용하면 double escaping이나 누락이 생기기
          쉬우므로 XML library의 element builder와 serializer를 사용합니다.
        </p>
        <p>
          CDATA는 긴 text를 편하게 넣을 수 있지만 종료 표식 <code>]]&gt;</code>를 그대로 담을
          수 없습니다. Parser 권한이나 prompt injection을 막는 security boundary도 아닙니다.
        </p>
        <p>
          data가 markup 구조를 바꾸지 못하게 serialize하는 일과 model이 그 내용의 지시를 따르지 않게 통제하는 일은 별개입니다.
        </p>

        <div id="paper-w3c-xml-10" className="not-prose scroll-mt-24">
          <CitationBlock
            source="W3C — Extensible Markup Language (XML) 1.0"
            citeKey={2}
            href="https://www.w3.org/TR/xml/"
          >
            W3C XML 1.0 규격은 document, element, attribute, character data,
            entity, well-formedness와 DTD validity의 문법 및 conforming processor의
            동작을 정의합니다. 여기서 얻을 수 있는 근거는 XML syntax와 processor
            판정 범위입니다. 문서 내용의 사실성·업무 타당성·안전성이나 LLM이 tag의
            의도를 반드시 따른다는 결론은 규격이 보장하지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
