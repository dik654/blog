import ExplainedFormula from "@/components/ui/explained-formula";
import ChunkingViz from "./viz/ChunkingViz";

export default function Chunking() {
  return (
    <section id="chunking" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Chunking은 글자 수를 맞추는 전처리가 아니라, 검색 단위와 인용 가능한 근거 단위의 경계를 정하는 작업입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
            문서 전체를 vector 하나로 만들면 서로 다른 주제가 섞이기 쉽습니다. 한 문장씩 자르면 조건과 예외가 흩어질 수 있습니다. 먼저 parser가 제목·문단·목록·표·code
            block과 원문 offset을 보존해야 합니다. 그 위에서 고정 token chunk를 baseline으로 두고 structure-aware 또는 parent–child
            방식을 비교합니다.
          </p>
        <p>Parent–child 방식은 작은 child로 검색 정밀도를 확보한 뒤, 그 child가 속한 더 큰 parent를 generation context로 복원합니다. 이때 overlap이 크다고 정답 coverage가 자동으로 좋아지지는 않습니다. 중복 chunk가 top-k를 차지해 서로 다른 근거를 밀어낼 수 있기 때문입니다.</p>
      </div>
      <ExplainedFormula
        question="Chunk 길이가 정답을 실제로 보존하는지 어떻게 계산할까요?"
        idea={<>평가 질문마다 사람이 표시한 정답 근거 span을 두고, 검색 또는 parent 복원 뒤 prompt에 남은 문자 구간과의 교집합을 잽니다. 여러 구간의 합집합을 사용해야 overlap을 두 번 세지 않습니다.</>}
        formula={String.raw`C_{\mathrm{span}}(q)=\frac{\left|A_q\cap\left(\bigcup_{c\in K_q}\operatorname{span}(c)\right)\right|}{|A_q|}`}
        annotatedFormula={String.raw`C_{\mathrm{span}}(q)=\underbrace{\frac{\left|A_q\cap\left(\bigcup_{c\in K_q}\operatorname{span}(c)\right)\right|}{|A_q|}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{\left|A_q\cap\left(\bigcup_{c\in K_q}\operatorname{span}(c)\right)\right|}{|A_q|}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","평가 질문마다"] },
        ]}
        terms={[
          { symbol: "A_q", name: "answer-support span", description: "질문 q의 답을 뒷받침하는 원문 문자 또는 token 위치 집합입니다." },
          { symbol: "K_q", name: "retained chunks", description: "검색·dedup·budgeting을 거쳐 최종 context에 남은 chunk 집합입니다." },
          { symbol: "span(c)", name: "source interval", description: "Chunk c가 원문에서 차지한 위치입니다." },
          { symbol: "C_span", name: "span coverage", description: "필요한 근거 중 최종 context가 보존한 비율이며 0부터 1 사이입니다." },
        ]}
        assumptions={["정답 span label이 source revision과 같은 좌표계를 사용합니다.", "중복 overlap은 합집합으로 한 번만 셉니다.", "문자 coverage가 1이어도 표 header·앞 문단 조건 같은 구조적 문맥이 충분하다는 보장은 없습니다."]}
        interpretation="정답 근거가 원문 100자이고 최종 context가 그중 80자를 보존했다면 coverage는 0.8입니다. 이 값을 chunk length·overlap·parent 복원 방식별로 비교합니다."
      />
      <div className="not-prose my-8"><ChunkingViz /></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
            각 chunk에는 source ID·revision·heading path·원문 offset·parser version·valid-time·ACL을 남깁니다. 표는 셀만 떼지
            않고 header와 row 관계를 복원할 수 있어야 합니다. 삭제된 원문에서 파생된 chunk와 vector까지 찾을 수 있어야 합니다.
          </p>
      </div>
    </section>
  );
}
