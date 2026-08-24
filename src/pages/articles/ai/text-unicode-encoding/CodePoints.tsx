import ExplainedFormula from "@/components/ui/explained-formula";

export default function CodePoints() {
  return (
    <section id="code-points" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Code point는 문자 목록의 번호이고 grapheme cluster는 사용자가 보는 경계다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Unicode는 문자·기호에 <code>U+XXXX</code> 형태의 code point 번호를 부여합니다. 그러나 code point 하나가 언제나 화면의 한 글자는 아닙니다. <code>e</code> 뒤에 combining acute accent를 붙인 두 code point는 화면에서 é 한 글자로 보일 수 있고, emoji의 피부색·성별·가족 조합도 여러 code point를 하나의 extended grapheme cluster로 표시할 수 있습니다.
        </p>
        <p>
          수치로 비교하면 차이가 더 분명합니다. 합성형 <code>é</code>는 <code>U+00E9</code> 한 개이므로 code point 1개, grapheme 1개이며 UTF-8에서는 <code>C3 A9</code> 2 byte입니다. 분해형 <code>e</code>+<code>U+0301</code>은 code point 2개이고 UTF-8에서는 <code>65 CC 81</code> 3 byte이지만, 화면에서는 여전히 grapheme 1개로 묶일 수 있습니다. 따라서 두 문자열은 똑같이 보이더라도 normalization 전의 byte sequence와 code-point 길이는 다릅니다.
        </p>
      </div>
      <ExplainedFormula
        question="문자열 길이를 셀 때 왜 답이 하나로 고정되지 않을까?"
        idea={<>같은 text를 사용자가 보는 grapheme, Unicode code point, UTF-8 byte라는 서로 다른 경계로 나누기 때문입니다. 어떤 길이를 썼는지 좌표계를 함께 적어야 합니다.</>}
        formula={String.raw`N_{\mathrm{grapheme}}\;\not=\;N_{\mathrm{code\ point}}\;\not=\;N_{\mathrm{UTF\text{-}8\ byte}}\quad\text{in general}`}
        annotatedFormula={String.raw`N_{\mathrm{grapheme}}\;\not=\underbrace{\;N_{\mathrm{code\ point}}\;\not=\;N_{\mathrm{UTF\text{-}8\ byte}}\quad\text{in general}}_{\text{encoded storage length 계산}}`}
        operations={[
          { expression: String.raw`\;N_{\mathrm{code\ point}}\;\not=\;N_{\mathrm{UTF\text{-}8\ byte}}\quad\text{in general}`, annotation: ["encoded storage length이(가) 식의 결과에","기여하는 방식을 계산합니다.","같은 text를 사용자가 보는 grapheme, Unicode","code point, UTF-8 byte라는 서로 다른 경계로"] },
        ]}
        terms={[
          { symbol: "N_{\\mathrm{grapheme}}", name: "displayed units", description: "사용자 cursor 이동과 삭제에 가까운 text cluster 수입니다." },
          { symbol: "N_{\\mathrm{code\\ point}}", name: "Unicode scalar sequence length", description: "Unicode 번호 sequence의 원소 수입니다." },
          { symbol: "N_{\\mathrm{UTF\\text{-}8\\ byte}}", name: "encoded storage length", description: "UTF-8로 직렬화했을 때 차지하는 byte 수입니다." },
        ]}
        assumptions={["Grapheme boundary는 Unicode text segmentation 규칙과 구현 version에 따라 판정합니다."]}
        interpretation="‘세 번째 문자’나 ‘길이 10’이라는 말만으로는 충분하지 않습니다. UI cursor인지, Unicode 처리인지, file/network offset인지 목적을 먼저 고정합니다."
      />
      <div id="paper-unicode-segmentation" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">표준 읽기 · 사용자에게 보이는 text 경계</p>
        <p className="mt-2 text-sm font-semibold">Unicode Standard Annex #29 — Unicode Text Segmentation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Code point sequence에서 grapheme cluster·word·sentence boundary를 판정하는 기본 규칙과 확장 규칙을 정의합니다. Font가 그리는 glyph 수나 모든 언어의 의미론적 ‘글자’를 하나의 영구 규칙으로 고정한다는 뜻은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://www.unicode.org/reports/tr29/" target="_blank" rel="noreferrer">최신 Unicode text segmentation 규격 보기</a>
      </div>
    </section>
  );
}
