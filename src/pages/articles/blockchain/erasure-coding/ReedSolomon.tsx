import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import RSCodingViz from "./viz/RSCodingViz";

export default function ReedSolomon() {
  return (
    <section id="reed-solomon" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Reed–Solomon은 source를 다항식으로 보고 서로 다른 점의 평가값을
        저장합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          가장 작은 계산부터 보겠습니다. GF(7)에서 source 두 개를 계수 2와 3으로
          잡으면 차수 1 다항식은 <code>p(x)=2+3x</code>입니다. x=0,1,2,3에서
          평가하면 y=2,5,1,4가 됩니다. 모든 값은 7로 나눈 나머지이며, (1,5)와
          (3,4)처럼 서로 다른 두 점만 남아도 원래 직선을 복원합니다.
        </p>
      </div>
      <RSCodingViz />

      <ExplainedFormula
        question="서로 다른 k개의 평가점이 왜 차수 k-1 이하 다항식을 하나로 결정할까요?"
        idea="각 관측점에서는 1이고 나머지 관측점에서는 0인 Lagrange basis를 만든 뒤, 관측값을 가중해 더합니다. 서로 다른 두 다항식이 같은 k개 점을 지난다면 그 차이는 k개 root를 가진 차수 k-1 이하 다항식이므로 영다항식뿐입니다."
        formula={String.raw`\begin{aligned}
p(x)&=\sum_{i=0}^{k-1}y_iL_i(x)\\[4pt]
L_i(x)&=\prod_{j\ne i}\frac{x-x_j}{x_i-x_j}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
p(x)&=\underbrace{\sum_{i=0}^{k-1}y_iL_i(x)}_{\text{Lagrange basis 계산}}\\[4pt]
L_i(x)&=\underbrace{\prod_{j\ne i}\frac{x-x_j}{x_i-x_j}}_{\text{기준량당 비율}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{i=0}^{k-1}y_iL_i(x)`, annotation: ["Lagrange basis이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 관측점에서는 1이고 나머지 관측점에서는 0인","Lagrange basis를 만든 뒤, 관측값을 가중해"] },
          { expression: String.raw`\prod_{j\ne i}\frac{x-x_j}{x_i-x_j}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 관측점에서는 1이고 나머지 관측점에서는 0인","Lagrange basis를 만든 뒤, 관측값을 가중해","더합니다."] },
        ]}
        terms={[
          {
            symbol: "x_i",
            name: "Evaluation point",
            description: "Field 안에서 중복되지 않는 symbol 위치입니다.",
          },
          {
            symbol: "y_i",
            name: "Evaluation value",
            description: "해당 위치에서 받은 encoded symbol 값입니다.",
          },
          {
            symbol: "L_i(x)",
            name: "Lagrange basis",
            description:
              "x_i에서는 1, 다른 관측점에서는 0이 되는 basis polynomial입니다.",
          },
          {
            symbol: "p(x)",
            name: "Recovered polynomial",
            description: "Source를 나타내는 차수 k-1 이하 다항식입니다.",
          },
        ]}
        assumptions={[
          "x_i가 서로 달라 모든 x_i-x_j가 0이 아니며 field inverse가 존재합니다.",
          "평가값과 위치가 같은 field·generator profile에서 왔습니다.",
          "이 식은 위치가 알려진 erasure 복원입니다. 알 수 없는 corruption은 locator를 찾는 추가 decoding이 필요합니다.",
        ]}
        interpretation="GF(7)의 (1,5),(3,4)에서 기울기는 (4-5)/(3-1)=6×2^{-1}=6×4=3이고 절편은 2이므로 p(x)=2+3x를 되찾습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>MDS와 error budget은 같은 말이 아닙니다</h3>
        <p>
          (n,k) Reed–Solomon code의 minimum distance는 <code>d=n-k+1</code>
          입니다. 위치를 아는 erasure를 s개, 위치를 모르는 잘못된 symbol을
          e개라고 할 때 일반적인 unique decoding 경계는 <code>2e+s&lt;d</code>,
          즉 <code>2e+s≤n-k</code>입니다. (10,6)에서 erasure 네 개는 복원할 수
          있지만, error 두 개가 이미 parity budget 네 칸을 모두 사용합니다.
          그래서 production decoder는 checksum·commitment로 corruption을
          erasure로 바꿀 수 있는지 먼저 봅니다.
        </p>
        <p>
          “Systematic”은 source symbol이 codeword에 그대로 포함된다는 배치
          방식입니다. 다항식 평가라는 수학적 정의만으로 저장 배열의 앞 k칸이
          자동으로 원문이 되는 것은 아니며, generator matrix와 encoding
          profile을 고정해야 합니다. Field 크기와 symbol packing 역시 구현마다
          다르므로 GF(2^8)을 모든 Reed–Solomon 또는 Ethereum blob의 보편적
          field라고 부르지 않습니다.
        </p>
      </div>

      <div id="paper-rfc5510-reed-solomon" className="scroll-mt-24">
        <CitationBlock
          source="RFC 5510 · Reed-Solomon Forward Error Correction Schemes"
          href="https://www.rfc-editor.org/rfc/rfc5510.html"
          citeKey={1}
        >
          문제: packet erasure channel에서 RS profile과 wire parameter를
          상호운용 가능하게 정해야 합니다. 기여: GF(2^m) systematic RS FEC, code
          rate, symbol identity와 MDS 복원 규칙을 규정합니다. 전제: RFC의
          field·block·symbol profile을 사용합니다. 근거 범위: 해당 packet FEC
          scheme과 일반 MDS 직관입니다. 비주장: 모든 RS implementation의
          field·성능·blockchain 사용법을 고정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
