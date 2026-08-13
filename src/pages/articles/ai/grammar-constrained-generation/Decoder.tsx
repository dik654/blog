import DecoderViz from "./viz/DecoderViz";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function Decoder() {
  return (
    <section id="decoder" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">문법 상태에서 token mask까지</h2>
      <div className="not-prose mb-8">
        <DecoderViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          XGrammar의 공개 workflow에서는 JSON Schema·regex·EBNF 등을 grammar로
          만들고, 모델 tokenizer 정보와 함께 compile한다. runtime의 stateful
          matcher는 직전 token을 accept한 뒤 다음 vocabulary mask를 채운다.
          mask가 금지한 token의 logit은 sampling 전에 음의 무한대로 보내 확률을
          0으로 만든다.
        </p>

        <ExplainedFormula
          question="현재 grammar에서 허용되지 않는 token의 생성 확률을 어떻게 0으로 만드는가?"
          idea={
            <p>
              Matcher state에서 허용 token 집합을 구하고, 그 밖의 token logit을
              −∞로 바꾼 뒤 softmax를 계산합니다. 선택한 token은 matcher가
              accept해 다음 state로 이동합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            A(s)&=\{i:\operatorname{valid}(s,v_i)\} \\
            \ell'_i&=\begin{cases}\ell_i,&i\in A(s)\\-\infty,&i\notin A(s)\end{cases} \\
            p_i&=\frac{e^{\ell'_i}}{\sum_j e^{\ell'_j}}
          \end{aligned}`}
          terms={[
            { symbol: "s", name: "matcher state", description: "현재 generated prefix와 열린 grammar rule을 추적하는 요청별 상태입니다." },
            { symbol: "v_i", name: "vocabulary token", description: "Model tokenizer vocabulary의 i번째 token이 담은 전체 byte/문자열입니다." },
            { symbol: "A(s)", name: "allowed token set", description: "State s에서 token 전체를 소비해도 유효 prefix가 되는 token index 집합입니다." },
            { symbol: "\\ell_i", name: "model logit", description: "Grammar mask 전 language model이 token i에 준 비정규화 점수입니다." },
            { symbol: "p_i", name: "masked probability", description: "허용 token만 남겨 다시 정규화한 sampling probability입니다." },
          ]}
          assumptions={[
            "Grammar가 원하는 schema를 정확히 표현하고 tokenizer vocabulary/byte semantics에 맞게 compile됐습니다.",
            "EOS·whitespace·UTF-8·string escape와 stop condition을 matcher가 올바르게 처리합니다.",
            "Floating-point −∞ mask가 sampler·top-k/top-p 이전의 올바른 순서에 적용됩니다.",
          ]}
          interpretation="금지 token은 softmax 분자가 0이 되어 선택되지 않습니다. 허용 집합 안에서는 원래 model logit의 상대 선호가 유지되지만, schema가 허용하는 값의 사실성이나 안전성까지 보장하지는 않습니다."
        />

        <h3 id="tokenizer-compilation" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          문자 grammar와 모델 token 사이에 compilation이 필요하다
        </h3>
        <p className="leading-7">
          모델은 한 글자씩만 생성하지 않는다. 하나의 token이 여러 문자, 공백,
          따옴표 일부를 함께 담을 수 있으므로 “다음 문자가 <code>{"}"}</code>
          인가”만 검사해서는 부족하다. grammar compiler는 tokenizer vocabulary와
          grammar 상태를 연결해 각 token 전체가 유효한 continuation인지
          계산하고, 반복되는 결과는 cache한다.
        </p>
        <div id="paper-xgrammar-decoding" className="scroll-mt-24">
          <CitationBlock source="XGrammar — Constrained Decoding" citeKey={2} href="https://xgrammar.mlc.ai/docs/start/constrained_decoding.html">
            Grammar compile·matcher state·token bitmask·accept 흐름의 공식 API를
            설명한다. 올바른 mask 사용은 형식 제약을 제공하지만 schema 밖의
            business invariant·authorization·truth를 검증하지 않는다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
