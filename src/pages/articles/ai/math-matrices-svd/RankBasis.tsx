import ExplainedFormula from "@/components/ui/explained-formula";

export default function RankBasis() {
  return (
    <section id="rank-basis" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Rank는 output이 실제로 펼칠 수 있는 독립 방향의 수다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          행렬의 column이 여러 개여도 하나가 다른 column의 배수나 합으로 만들어진다면
          새로운 방향을 추가하지 못합니다. Rank는 독립적인 column 방향의 최대 수이며,
          linear map이 input 공간을 몇 차원의 output 부분공간으로 보낼 수 있는지
          나타냅니다. 모든 정보를 보존하려면 dimension만 클 것이 아니라 필요한 방향이
          서로 독립이어야 합니다.
        </p>
        <p>
          SVD는 이 독립 방향을 서로 직각이고 길이 1인 <strong>orthonormal
          basis</strong>로 고릅니다. 직각이면 dot product가 0이고 각 vector의 norm이
          1이므로 coordinate가 서로 섞이지 않으며, projection으로 각 방향의 기여를
          따로 읽을 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Column이 두 개여도 rank가 1일 수 있는 이유를 어떻게 확인할까요?"
        idea={<>둘째 column이 첫째 column의 두 배라면 어느 input을 넣어도 output은 첫째 column이 가리키는 직선 위에서만 움직입니다. 독립적으로 조절할 수 있는 output 방향은 하나뿐입니다.</>}
        formula={String.raw`A=\begin{bmatrix}1&2\\2&4\end{bmatrix}=\begin{bmatrix}1\\2\end{bmatrix}\begin{bmatrix}1&2\end{bmatrix},\qquad \operatorname{rank}(A)=1`}
        terms={[
          { symbol: "A", name: "rank-one matrix", description: "Column 두 개가 있지만 두 번째가 첫 번째의 2배인 matrix입니다." },
          { symbol: "uv^\top", name: "outer product", description: "Column vector u와 row vector vᵀ의 곱으로 한 방향의 row·column pattern을 만듭니다." },
          { symbol: "\operatorname{rank}(A)", name: "independent directions", description: "Column space 또는 row space의 dimension이며 두 값은 같습니다." },
        ]}
        assumptions={["Exact real arithmetic의 linear dependence를 설명합니다.", "Measured data에서는 작은 singular value를 noise로 볼지 signal로 볼지 tolerance와 task 기준이 필요합니다."]}
        interpretation="Matrix shape 2×2는 저장된 coordinate 수를 말하지만 rank 1은 실제 변화가 직선 하나에 갇힌다는 뜻입니다. Low-rank approximation은 이 구조가 정확하지 않고 근사적으로 나타날 때 사용합니다."
      />
    </section>
  );
}
