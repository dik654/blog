import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function ErrorCorrection() {
  return (
    <section id="error-correction" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Decode: erasure, error, malformed profile을 서로 다른 결과로 낸다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          위치를 아는 누락(erasure)은 k개의 검증된 symbol이 남으면 보간합니다.
          위치를 모르는 잘못된 값(error)은 위치와 값을 함께 찾아야 하므로 parity
          budget 두 칸을 씁니다. (n,k)의 distance 식과 proof idea는
          <Link to="/blockchain/erasure-coding#reed-solomon"> canonical 설명</Link>을
          재사용합니다. 구현 결과는 최소한 <code>Recovered</code>,
          <code>InsufficientSymbols</code>, <code>TooManyErrors</code>,
          <code>ProfileMismatch</code>, <code>MalformedSymbol</code>을 구분해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Error e개와 erasure s개를 함께 unique-decode할 수 있는 경계는 무엇일까요?"
        idea="Known erasure는 그 좌표를 비교에서 제외하면 되지만 unknown error는 두 후보 codeword 중 어느 쪽이 틀렸는지 분리해야 합니다. 그래서 error 하나가 distance 두 칸을 사용합니다."
        formula={String.raw`d_{\min}=n-k+1,\qquad 2e+s<d_{\min}\iff2e+s\le n-k`}
        terms={[
          { symbol: "e", name: "unknown-position errors", description: "값과 위치를 모두 decoder가 찾아야 하는 corruption 수입니다." },
          { symbol: "s", name: "known erasures", description: "위치는 알지만 값이 없는 symbol 수입니다." },
          { symbol: "d_min", name: "minimum distance", description: "서로 다른 두 codeword가 적어도 달라지는 좌표 수입니다." },
        ]}
        assumptions={[
          "평가점과 field가 올바른 (n,k) Reed–Solomon profile입니다.",
          "Unique decoding 경계이며 list decoding이나 adversarial authenticity 보장은 아닙니다.",
        ]}
        interpretation="(10,6)에서 e=1,s=2이면 4≤4라 경계 안입니다. e=2,s=1이면 5≤4가 거짓이므로 unique decode를 보장하지 않습니다. Decoder가 어떤 값을 내놓더라도 commitment와 대조하지 않으면 잘못된 object를 성공으로 오인할 수 있습니다."
      />
      <div id="berlekamp-welch" className="scroll-mt-24">
        <ExplainedFormula
          question="Unknown error 위치를 모른 채 polynomial을 어떻게 복원할까요?"
          idea="Error 위치에서는 0이 되는 locator E를 곱해 잘못된 관측을 지웁니다. N=Ep를 별도 미지 polynomial로 두면 각 관측에 대한 식이 coefficient에 선형이 되어 연립방정식으로 풀 수 있습니다."
          formula={String.raw`N(\alpha_i)=r_iE(\alpha_i),\quad \deg E\le t,\quad \deg N<k+t,\quad p=N/E`}
          terms={[
            { symbol: "r_i", name: "received symbol", description: "평가점 α_i에서 받은 값으로 일부는 틀릴 수 있습니다." },
            { symbol: "E(x)", name: "error locator", description: "Error 좌표 α_i에서 0이 되는 monic polynomial입니다." },
            { symbol: "N(x)", name: "combined numerator", description: "E(x)p(x)를 나타내도록 함께 푸는 polynomial입니다." },
            { symbol: "t", name: "error budget", description: "보통 floor((n−k)/2) 이하로 고정한 unique error 수입니다." },
          ]}
          assumptions={[
            "Error 수가 t 이하이고 α_i가 서로 다르며 연립방정식의 rank 조건을 만족합니다.",
            "해를 얻은 뒤 N이 E로 정확히 나뉘고 recovered p의 degree와 전체 mismatch 수를 다시 확인합니다.",
          ]}
          interpretation="GF(7), p(x)=2+3x의 [2,5,1,4]에서 index 2가 6으로 바뀌었다면 E(x)=x−2는 그 위치의 등식을 0=0으로 만들고 나머지 점이 N=Ep를 정합니다. Error budget을 넘으면 non-exact division이나 과도한 mismatch를 성공으로 바꾸지 않고 typed failure로 냅니다."
        />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Evaluation code와 cyclic/BCH decoder를 섞지 않는다</h3>
        <p>
          Syndrome·Berlekamp–Massey·Chien·Forney 경로는 특정 cyclic RS
          presentation과 generator/first-root convention을 전제로 합니다.
          임의 evaluation-point code에 <code>c(α^j)=0</code>을 그대로 적용하면
          틀립니다. 이 글은 일반 evaluation profile에는 Berlekamp–Welch를
          설명하고, cyclic decoder를 쓸 때는 generator polynomial·root offset·
          shortening convention을 별도 profile로 요구합니다.
        </p>
      </div>
    </section>
  );
}
