import ExplainedFormula from "@/components/ui/explained-formula";

export default function Utf8() {
  return (
    <section id="utf-8" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">UTF-8은 code point 번호를 1~4 byte로 직렬화하는 규칙이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Code point는 추상적인 번호이고 UTF-8은 그 번호를 file과 network에 놓을 byte sequence로 바꿉니다. ASCII 범위는 한 byte를 그대로 사용하고 더 큰 code point는 선두 byte와 continuation byte로 나눕니다. 이 prefix pattern 덕분에 byte stream의 중간에서도 문자의 시작을 구분할 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="UTF-8 byte 수가 문자와 언어에 따라 달라지는 이유는 무엇일까?"
        idea={<>작은 code point는 payload bit가 적어 한 byte에 들어가고, 더 큰 번호는 payload를 여러 byte에 나눕니다. ASCII는 1 byte, 한글 음절 ‘가’ U+AC00은 3 byte입니다.</>}
        formula={String.raw`\mathrm{UTF8}(U+0041)=\mathtt{41}_{16}\;(1\ byte),\qquad \mathrm{UTF8}(U+AC00)=\mathtt{EA\ B0\ 80}_{16}\;(3\ bytes)`}
        annotatedFormula={String.raw`\mathrm{UTF8}(U+0041)=\underbrace{\mathtt{41}_{16}\;(1\ byte),\qquad \mathrm{UTF8}(U+AC00)=\mathtt{EA\ B0\ 80}_{16}\;(3\ bytes)}_{\text{code point A 계산}}`}
        operations={[
          { expression: String.raw`\mathtt{41}_{16}\;(1\ byte),\qquad \mathrm{UTF8}(U+AC00)=\mathtt{EA\ B0\ 80}_{16}\;(3\ bytes)`, annotation: ["code point A이(가) 식의 결과에 기여하는 방식을","계산합니다.","작은 code point는 payload bit가 적어 한","byte에 들어가고, 더 큰 번호는 payload를 여러"] },
        ]}
        terms={[
          { symbol: "U+0041", name: "code point A", description: "ASCII와 같은 번호를 유지해 UTF-8 한 byte 0x41이 됩니다." },
          { symbol: "U+AC00", name: "code point 가", description: "Payload bit를 세 UTF-8 byte 0xEA 0xB0 0x80에 나눕니다." },
          { symbol: String.raw`\mathtt{hex}`, name: "hexadecimal byte notation", description: "한 byte를 00부터 FF까지 두 자리 16진수로 표시합니다." },
        ]}
        assumptions={["Unicode scalar value를 RFC 3629의 well-formed UTF-8로 encoding합니다."]}
        interpretation="Byte-level tokenizer는 모든 UTF-8 text를 256개 byte alphabet으로 내릴 수 있지만, 같은 화면 글자가 여러 byte token으로 길어질 수 있습니다."
      />
      <div id="paper-utf8" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">표준 읽기 · UTF-8 byte encoding</p>
        <p className="mt-2 text-sm font-semibold">RFC 3629 — UTF-8, a transformation format of ISO 10646</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Unicode scalar value를 1~4 octet으로 encoding하는 형식과 유효 범위·금지 sequence를 규정합니다. Grapheme boundary, font rendering이나 tokenizer merge rule을 정의하는 문서는 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://www.rfc-editor.org/rfc/rfc3629" target="_blank" rel="noreferrer">RFC 원문 보기</a>
      </div>
    </section>
  );
}
