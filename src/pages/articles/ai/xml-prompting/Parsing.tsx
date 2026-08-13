import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ParsingViz from "./viz/ParsingViz";
import ParsingDetailViz from "./viz/ParsingDetailViz";

export default function Parsing() {
  return (
    <section id="parsing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Model의 XML 출력은 parse 성공 뒤에도 세 번 더 검사해야 한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Model completion은 신뢰할 수 없는 text입니다. XML을 요청했더라도 앞뒤에
          설명을 붙이거나 tag를 빠뜨리고, 예상하지 않은 element와 attribute를
          만들 수 있습니다. 따라서 output을 곧바로 업무 로직에 넘기지 않고,
          먼저 byte·character size와 허용된 최상위 frame 수를 확인합니다. 계약이
          <code>&lt;result&gt;</code> 하나라면 그 밖의 text를 조용히 무시하지 말고
          명시적인 framing error로 기록해야 합니다.
        </p>
        <p>
          그다음 strict XML parser로 well-formedness를 검사합니다. 중첩 구조는
          임의 깊이가 될 수 있고 escaped character와 같은 이름의 반복 element도
          있으므로, 정규표현식으로 tag 사이를 잘라내는 방식은 일반 XML parser를
          대신할 수 없습니다. Parse error를 “관대한 parser→regex” 순서로 조용히
          복구하면 model이 만든 잘못된 구조가 서로 다른 의미로 실행될 수 있으므로,
          실패 원인을 typed error로 보존하는 편이 안전합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ParsingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Well-formed, schema-valid, domain-valid는 서로 다른 판정이다</h3>
        <p>
          Parser가 XML tree를 만들었다고 내용까지 맞는 것은 아닙니다. 첫째,
          allowlist와 schema 단계에서 허용된 element·attribute, required field,
          type, cardinality와 추가 field 금지를 검사합니다. XML 1.0에서
          <em> valid</em>는 선언된 DTD를 만족한다는 규범적 의미이고, 실무에서는
          XSD·Relax NG 또는 application schema를 선택할 수도 있습니다. 어느
          방식을 쓰는지 계약에 명시해야 “valid”라는 말이 무엇을 가리키는지
          분명해집니다.
        </p>
        <p>
          둘째, domain validation은 값이 실제 업무 세계에서 가능한지 확인합니다.
          <code>&lt;refund&gt;&lt;amount&gt;-100&lt;/amount&gt;&lt;/refund&gt;</code>는
          well-formed이고 schema가 signed integer를 허용하면 schema-valid일 수도
          있지만, 환불액이 음수일 수 없다는 업무 규칙에는 실패합니다. Product ID가
          catalog에 실제로 있는지, citation ID가 input document를 가리키는지,
          evidence span이 원문에 존재하는지도 이 단계에서 확인합니다.
        </p>
        <p>
          셋째, policy validation은 값이 현재 caller 권한과 실행 정책에 맞는지
          판정합니다. 구조와 금액이 모두 정상이어도 이 사용자가 환불을 승인할
          권한이 없으면 side effect를 실행하지 않습니다. 결국 파이프라인은
          <strong>
            size/frame→parse→allowlist/schema→domain/evidence→policy→typed result
          </strong>
          로 이어지며, 각 단계가 서로 다른 실패를 설명해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ParsingDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Retry는 실패 원인과 최대 횟수가 정해진 복구 경로다</h3>
        <p>
          닫는 tag 하나가 빠진 syntax error라면 error location과 기대 root를
          포함해 한 번 재생성할 수 있고, 필수 field 누락이면 누락 field만 알려 줄
          수 있습니다. 반면 존재하지 않는 상품 ID나 근거 없는 citation은 문법을
          다시 요청해도 해결되지 않으므로 evidence 재검색, abstention 또는 human
          review로 전환해야 합니다. Retry count와 누적 token·latency budget을 정하고,
          한도를 넘으면 명시적으로 실패하게 해야 무한 재시도와 silent repair를
          피할 수 있습니다.
        </p>
        <p>
          문법 위반 자체를 생성 단계에서 줄여야 하고 XML을 선택할 특별한 이유가
          없다면 JSON Schema 같은 native structured output이 더 단순할 수 있습니다.
          Parser와 grammar state로 invalid token을 막는 원리는
          <Link to="/ai/grammar-constrained-generation">
            {" "}grammar-constrained generation
          </Link>
          에서 CFG·token mask부터 확인할 수 있습니다. 다만 constrained decoding도
          domain value와 권한을 검증하지는 않으므로 뒤쪽 validator는 그대로
          필요합니다.
        </p>

        <h3>Untrusted XML은 DTD와 external entity부터 차단한다</h3>
        <p>
          XML의 <strong>entity</strong>는 이름을 다른 text로 치환하는 기능입니다.
          Parser가 untrusted document의 DTD와 external entity를 허용하면 entity가
          local file이나 URL을 읽도록 만들 수 있고, 그 결과 file disclosure,
          SSRF와 denial of service가 발생할 수 있습니다. 이를 XXE(XML External
          Entity)라고 부릅니다. Prompt에 태그를 쓰는 것 자체와 server가 untrusted
          XML을 parser로 읽는 것은 다른 threat surface이며, 후자에는 parser
          hardening이 필요합니다.
        </p>
        <p>
          기본 원칙은 DTD와 general·parameter external entity resolution,
          external DTD, XInclude와 network access를 사용하지 않는 것입니다. 문서
          size, element depth, attribute·text 길이, entity expansion, CPU time과
          memory에도 limit를 둡니다. “Billion Laughs”처럼 작은 입력에서 entity를
          반복 확장해 memory를 소진시키는 공격은 외부 network를 쓰지 않아도
          발생하므로 XXE 설정 하나만으로 끝나지 않습니다. 사용하는 language
          binding과 underlying parser, 예를 들어 Python의 pyexpat/Expat version을
          함께 기록하고 공격 fixture로 실제 설정을 테스트합니다.
        </p>

        <div id="paper-python-xml-security" className="not-prose scroll-mt-24">
          <CitationBlock
            source="Python documentation — XML vulnerabilities"
            citeKey={3}
            href="https://docs.python.org/3/library/xml.html#xml-vulnerabilities"
          >
            Python 문서는 stdlib XML module과 underlying Expat에서 고려할 entity
            expansion, external entity, large token 등 XML vulnerability의 영향과
            version 조건을 정리합니다. 이 표는 사용하는 Python·parser·Expat
            version이 해당 조건과 일치할 때의 출발점이며, 모든 parser의 default가
            같거나 application 전체 threat model이 자동으로 해결된다는 뜻은
            아닙니다.
          </CitationBlock>
        </div>

        <div id="paper-owasp-xxe" className="not-prose scroll-mt-24">
          <CitationBlock
            source="OWASP — XML External Entity Prevention Cheat Sheet"
            citeKey={4}
            href="https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html"
          >
            OWASP는 attacker-controlled DTD와 external entity가 local file
            disclosure, SSRF와 denial of service로 이어지는 문제를 다루며, DTD와
            entity resolution을 기본적으로 끄고 parser별 안전한 configuration을
            확인하도록 권고합니다. 이는 XXE 방어 지침이며, entity expansion 외의
            모든 resource exhaustion, business validation, prompt injection 또는
            tool authorization까지 해결하는 주장은 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
