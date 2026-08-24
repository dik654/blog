import ExplainedFormula from "@/components/ui/explained-formula";
import GenerationViz from "./viz/GenerationViz";

export default function Generation() {
  return (
    <section id="generation" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Generation 단계는 검색 결과를 붙여 넣는 단계가 아니라, 제한된 token 예산에 근거를 배치하고 답변·인용·거절 규칙을 실행하는 단계입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Prompt의 전체 길이에는 system instruction, 대화 기록, 질문, 문서 metadata와 output 여유가 함께 들어갑니다. 먼저 중복 chunk를 source span 기준으로 합치고, 표 header나 parent context처럼 해석에 필요한 부분을 복원합니다. 그다음 query별 근거 가치와 token cost를 보고 예산 안에 배치합니다.</p>
      </div>
      <ExplainedFormula
        question="Context window를 넘지 않으면서 문서에 얼마를 쓸 수 있는지 어떻게 계산할까요?"
        idea={<>모델 최대 길이에서 문서가 아닌 입력과 예약한 출력 길이를 먼저 뺍니다. 남은 예산 안에서만 chunk를 선택해야 truncation이 마지막 근거를 조용히 잘라내지 않습니다.</>}
        formula={String.raw`\begin{aligned}
B_{\mathrm{docs}}&=L_{\max}-L_{\mathrm{system}}-L_{\mathrm{history}}\\
&\quad-L_{\mathrm{query}}-L_{\mathrm{output}}\\
\sum_{c\in K_q}\ell(c)&\le B_{\mathrm{docs}}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\underbrace{B_{\mathrm{docs}}}_{\text{chunk token cost 계산}}&=\underbrace{L_{\max}-L_{\mathrm{system}}-L_{\mathrm{history}}}_{\text{경계 후보 선택}}\\
&\quad-L_{\mathrm{query}}-L_{\mathrm{output}}\\
\sum_{c\in K_q}\ell(c)&\le B_{\mathrm{docs}}
\end{aligned}`}
        operations={[
          { expression: String.raw`L_{\max}-L_{\mathrm{system}}-L_{\mathrm{history}}`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","모델 최대 길이에서 문서가 아닌 입력과 예약한 출력 길이를","먼저 뺍니다."] },
          { expression: String.raw`B_{\mathrm{docs}}`, annotation: ["chunk token cost이(가) 식의 결과에 기여하는","방식을 계산합니다.","모델 최대 길이에서 문서가 아닌 입력과 예약한 출력 길이를","먼저 뺍니다."] },
        ]}
        terms={[
          { symbol: "L_max", name: "model context limit", description: "Input과 output을 합친 tokenizer 기준 최대 길이입니다." },
          { symbol: "L_system,L_history,L_query", name: "non-document input", description: "System·대화·현재 질문이 차지하는 token 수입니다." },
          { symbol: "L_output", name: "reserved output", description: "답변이 잘리지 않도록 미리 비워 둔 생성 token 수입니다." },
          { symbol: "ell(c)", name: "chunk token cost", description: "구분자와 source metadata까지 포함한 chunk c의 실제 serialized 길이입니다." },
        ]}
        assumptions={["Serving에 쓰는 동일 tokenizer와 chat template로 길이를 계산합니다.", "Model context limit가 길어도 모든 위치의 근거 활용 성능이 같다고 가정하지 않습니다.", "Budget selection은 ACL·dedup·valid-time 검사를 통과한 chunk에만 적용합니다."]}
        interpretation="최대 8,192 token에서 system 500, history 1,000, query 200, output 1,500을 예약하면 문서 예산은 4,992입니다. Chunk 합이 이를 넘으면 우연한 tail truncation 대신 명시적 선택 규칙을 적용합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>관련 근거가 prompt 가운데에 있을 때 활용률이 떨어지는 <em>lost in the middle</em>은 long-context model에서도 관찰될 수 있습니다. 따라서 정답 위치를 앞·중간·뒤로 바꾸는 intervention을 평가하고, 특정 ordering trick을 모든 query의 규칙으로 고정하지 않습니다.</p>
        <p>Retrieved text는 instruction이 아니라 신뢰하지 않는 data로 경계를 표시합니다. “이전 지시를 무시하라” 같은 문장이 source 안에 있어도 실행하지 않도록 하고, citation ID는 모델이 자유롭게 만든 문자열이 아니라 제공한 chunk ID 목록에서만 허용합니다. Tool은 application이 허용한 권한과 egress allowlist 안에서만 호출하며, 생성 결과도 citation ID와 output schema validator를 통과시킵니다. 근거가 없거나 source끼리 충돌하면 답을 꾸미기보다 부족한 근거와 확인할 source를 알려주는 abstention policy가 필요합니다.</p>
      </div>
      <div className="not-prose my-8"><GenerationViz /></div>
      <div id="reading-lost-middle" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 연구 · Lost in the Middle</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Liu 등은 multi-document QA와 key–value retrieval에서 relevant information의 위치를 바꾸어 성능을 비교했고, 많은 모델이 앞과 끝보다 가운데 정보를 덜 안정적으로 활용하는 현상을 관찰했습니다. 이 결과는 “항상 가운데가 실패한다”는 법칙이 아니라 model·task·context 구성별 position intervention이 필요하다는 근거입니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2307.03172" target="_blank" rel="noreferrer">평가 task와 위치별 결과 보기</a>
      </div>
    </section>
  );
}
