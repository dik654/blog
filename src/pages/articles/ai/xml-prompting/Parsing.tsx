import ParsingViz from './viz/ParsingViz';

export default function Parsing() {
  return (
    <section id="parsing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">파싱 성공과 정답 성공을 따로 판정한다</h2>
      <p className="mb-8 text-base leading-8 text-muted-foreground">
        닫는 태그가 있다고 값이 올바른 것은 아니다. 출력은 전송 완료, 문법 파싱,
        필드 검증, 의미 검증의 네 관문을 순서대로 통과해야 한다.
      </p>
      <div className="not-prose mb-8"><ParsingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>XML이면 XML parser를 쓴다</h3>
        <p className="leading-7">
          정규식은 태그와 속성, escape, 중첩, 같은 이름의 반복 요소를 모두 해석하는
          XML parser가 아니다. 단순 태그 하나만 뽑는 데 편해 보여도 깨진 출력을
          조용히 일부만 받아들이면 실패가 성공처럼 기록될 수 있다. XML을 출력
          계약으로 정했다면 표준 parser로 전체 문서를 파싱하고, 필요한 필드와 타입을
          별도 validator로 검사한다.
        </p>
        <h3>실패 원인을 보존한 채 제한적으로 복구한다</h3>
        <p className="leading-7">
          응답이 잘렸다면 transport failure, 닫는 태그가 없다면 syntax failure,
          필수 필드가 없으면 schema failure, confidence가 범위를 벗어나면 semantic
          failure다. 원인을 구분해야 같은 오류를 반복하지 않는다. 재시도할 때는
          validator 오류와 요구 schema를 다시 제공하고 횟수 제한을 둔다.
          regex나 관대한 parser로 몰래 성공 처리하는 fallback은 원본 오류를 숨긴다.
        </p>
        <h3>엄격한 기계 계약이면 schema output을 먼저 검토한다</h3>
        <p className="leading-7">
          공급자가 JSON Schema 기반 structured output을 제공한다면 필드 타입과
          필수 여부를 API 단계에서 강제하기 쉽다. XML은 긴 문서의 의미 구획에
          유용하지만, 항상 최종 기계 출력 형식이어야 하는 것은 아니다.
        </p>
      </div>
    </section>
  );
}
