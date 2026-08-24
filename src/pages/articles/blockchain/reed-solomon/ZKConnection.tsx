import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function ZKConnection() {
  return (
    <section id="zk-connection" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        ZK에서는 byte 복구가 아니라 RS code에 대한 proximity를 검사한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          STARK 계열에서 oracle vector가 degree bound를 만족하는 polynomial
          evaluation에 가까운지 묻습니다. “가깝다”는 vector 자체가 low-degree라는
          뜻이 아니라, 소수 좌표를 바꾸면 어떤 low-degree codeword가 된다는
          Hamming-distance 주장입니다. Commitment opening, transcript challenge,
          query consistency가 함께 있어야 하며 단순 RS encoder만으로 proof가 되지
          않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Low-degree polynomial과 RS codeword membership은 어떻게 연결될까요?"
        idea="Domain D의 모든 점에서 degree&lt;k polynomial을 평가한 vector들의 집합을 code로 정의합니다. Membership은 정확한 등가이고 proximity는 이 집합까지의 상대 Hamming 거리를 별도로 잽니다."
        formula={String.raw`\operatorname{RS}[\mathbb F,D,k]=\{(p(x))_{x\in D}:\deg p<k\},\qquad \Delta(f,\operatorname{RS})=\min_c\frac{|\{x:f(x)\ne c_x\}|}{|D|}`}
        annotatedFormula={String.raw`\operatorname{RS}[\mathbb F,D,k]=\underbrace{\{(p(x))_{x\in D}:\deg p<k\},\qquad \Delta(f,\operatorname{RS})=\min_c\frac{|\{x:f(x)\ne c_x\}|}{|D|}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\{(p(x))_{x\in D}:\deg p<k\},\qquad \Delta(f,\operatorname{RS})=\min_c\frac{|\{x:f(x)\ne c_x\}|}{|D|}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Domain D의 모든 점에서 degree k","polynomial을 평가한 vector들의 집합을 code로","정의합니다."] },
        ]}
        terms={[
          { symbol: "D", name: "evaluation domain", description: "중복 없는 field points의 ordered set입니다." },
          { symbol: "k", name: "dimension bound", description: "허용 polynomial degree를 k 미만으로 제한합니다." },
          { symbol: "Δ", name: "relative distance", description: "가장 가까운 valid codeword와 다른 좌표 비율입니다." },
        ]}
        assumptions={[
          "Domain, degree bound, field와 encoding이 transcript와 commitment에 결속됩니다.",
          "Proximity test의 soundness는 protocol parameter와 proof에 따르며 distance 정의만으로 나오지 않습니다.",
        ]}
        interpretation="D 크기 16, k=4이면 rate는 1/4이고 exact RS codeword의 distance는 0입니다. 한 좌표가 다르면 Δ≤1/16이지만 그 vector 자체를 degree&lt;4 polynomial의 평가라고 결론 낼 수는 없습니다."
      />
      <div id="reed-solomon-release-gate" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>Implementation release gate</h3>
        <p>
          Profile/version, object digest, source/repair index를 receipt에 고정합니다.
          Golden encode/decode vector, 0·n−k erasure, distance 경계 안팎 error,
          duplicate/wrong index, malformed symbol, mixed object, timeout, crash/restart를
          base와 candidate에 재생해 bytes와 typed outcome parity를 확인합니다.
          ZK 사용은 domain·degree·commitment·challenge transcript를 추가로 고정하고
          <Link to="/crypto/fri"> FRI 정본</Link>의 proof vectors를 사용합니다.
          그 뒤에 throughput, peak memory, repair bandwidth를 비교합니다.
        </p>
      </div>
      <div id="paper-fri-2018" className="scroll-mt-24">
        <CitationBlock source="Ben-Sasson et al. (ICALP 2018) · Fast Reed-Solomon IOP of Proximity" href="https://doi.org/10.4230/LIPIcs.ICALP.2018.14" citeKey={3}>
          문제: RS code proximity를 prover에 선형 arithmetic, verifier에 logarithmic
          arithmetic으로 검사합니다. 기여: folding 기반 FRI IOPP와 해당
          complexity/soundness 분석을 제시합니다. 전제: 논문이 정한 field,
          domain, rate, oracle와 verifier randomness model입니다. 근거 범위: 원
          FRI protocol의 연구 결과입니다. 비주장: 임의 query 수가 특정 security
          bits를 주거나 Merkle/Fiat–Shamir 구현 전체가 자동으로 안전하다고
          일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
