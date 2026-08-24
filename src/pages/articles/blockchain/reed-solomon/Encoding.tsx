import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import CodePanel from "@/components/ui/code-panel";

const encodeCode = `fn encode(profile: &Profile, source: &[Symbol]) -> Result<Vec<Shard>, Error> {
    require(source.len() == profile.k);
    require(profile.points_are_distinct());
    let p = profile.source_to_polynomial(source)?;
    let values = profile.points.iter().map(|x| p.evaluate(*x)).collect();
    attach(profile.id, object_digest(source), values)
}`;

export default function Encoding() {
  return (
    <section id="encoding" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Encoding: source를 하나의 profile 아래 n개 indexed symbol로 만든다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          작은 계산은 정본을 재사용해 확인하겠습니다. GF(7)에서
          <code>p(x)=2+3x</code>를 x=0,1,2,3에 평가하면
          <code>[2,5,1,4]</code>입니다. 이 예는 coefficient-form source입니다.
          Systematic encoder는 별도의 invertible transform이나 generator matrix를
          사용해 source를 그대로 배치할 수 있으므로 “첫 k개가 언제나 원문”이라고
          추측하면 안 됩니다.
        </p>
      </div>
      <ExplainedFormula
        question="Coefficient source가 어떤 codeword로 변환되는지 한 식으로 어떻게 고정할까요?"
        idea="k개 source symbol을 degree&lt;k polynomial의 coefficient로 놓고 profile에 기록한 서로 다른 n개 point에서 평가합니다."
        formula={String.raw`p(x)=\sum_{j=0}^{k-1}m_jx^j,\qquad c_i=p(\alpha_i)\quad(0\le i<n)`}
        annotatedFormula={String.raw`p(x)=\underbrace{\sum_{j=0}^{k-1}m_jx^j,\qquad c_i=p(\alpha_i)\quad(0\le i<n)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`\sum_{j=0}^{k-1}m_jx^j,\qquad c_i=p(\alpha_i)\quad(0\le i<n)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","k개 source symbol을 degree k","polynomial의 coefficient로 놓고","profile에 기록한 서로 다른 n개 point에서"] },
        ]}
        terms={[
          { symbol: "m_j", name: "source symbol", description: "같은 field에서 해석한 j번째 coefficient입니다." },
          { symbol: "α_i", name: "evaluation point", description: "Profile이 순서까지 고정한 서로 다른 n개 field elements입니다." },
          { symbol: "c_i", name: "encoded symbol", description: "Shard index i에 결속할 evaluation value입니다." },
          { symbol: "k/n", name: "code rate", description: "전체 symbol 중 source 정보 차원의 비율입니다." },
        ]}
        assumptions={[
          "n≤|F|이고 평가점 α_i는 모두 서로 다릅니다.",
          "Coefficient/evaluation/systematic source mapping과 padding을 profile에 기록합니다.",
          "이 계산은 integrity나 authenticity를 제공하지 않으므로 object digest·commitment가 별도로 필요합니다.",
        ]}
        interpretation="GF(7) 예의 rate는 2/4=1/2이고 extra storage는 (4−2)/2=100%입니다. 같은 네 값을 x 순서 [3,2,1,0]으로 저장하면 bytes는 같아 보여도 index 의미가 바뀌므로 profile mismatch입니다."
      />
      <CodePanel title="Profile-bound encoding 의사코드" code={encodeCode} defaultOpen annotations={[
        { lines: [1, 3], color: "sky", note: "shape와 distinct-point gate" },
        { lines: [4, 5], color: "emerald", note: "mapping 뒤 ordered evaluation" },
        { lines: [6, 6], color: "amber", note: "profile/object identity를 output에 결속" },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Erasure 복원에서 k개의 정확한 point-value pair를
          <Link to="/crypto/lagrange#formula"> Lagrange 보간</Link>에 넘길 수
          있습니다. 알 수 없는 error가 섞이면 아무 k개를 고르는 방식은
          corruption을 그대로 통과시키므로 다음 section의 decoder가 필요합니다.
        </p>
      </div>
      <div id="paper-rfc5510-reed-solomon" className="scroll-mt-24">
        <CitationBlock source="RFC 5510 · Reed-Solomon Forward Error Correction Schemes" href="https://www.rfc-editor.org/rfc/rfc5510.html" citeKey={2}>
          문제: packet erasure channel에서 RS FEC의 field·symbol·block profile을
          상호운용합니다. 기여: GF(2^m) systematic encoding과 source/repair
          symbol 식별, MDS recovery contract를 규정합니다. 전제: RFC가 정한
          제한과 parameter signaling을 사용합니다. 근거 범위: 이 packet FEC
          profile입니다. 비주장: 모든 RS code가 GF(2^8)이거나 같은 systematic
          layout을 쓰며 corruption authentication까지 제공한다고 말하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
