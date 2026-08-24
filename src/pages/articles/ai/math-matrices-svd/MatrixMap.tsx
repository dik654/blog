import ExplainedFormula from "@/components/ui/explained-formula";

export default function MatrixMap() {
  return (
    <section id="matrix-map" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">행 하나는 input 전체를 읽어 output 좌표 하나를 만든다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          m×n 행렬 A는 n개 좌표를 받은 뒤 m개 좌표를 내는 linear map입니다. 각
          output은 A의 한 행과 input x의 dot product이며, 같은 A로 vector를 더하거나
          scalar 배율을 바꿔도 결과가 같은 방식으로 더해지고 늘어납니다. 이 성질이
          <code>A(αx+βz)=αAx+βAz</code>라는 linearity입니다.
        </p>
      </div>
      <ExplainedFormula
        question="2×2 행렬이 input의 두 좌표를 어떻게 새 좌표 두 개로 섞을까요?"
        idea={<>첫째 행과 x의 dot product가 첫 output, 둘째 행과 x의 dot product가 둘째 output이 됩니다. 따라서 행의 길이 n은 input dimension, 행의 수 m은 output dimension이어야 합니다.</>}
        formula={String.raw`A=\begin{bmatrix}2&1\\-1&3\end{bmatrix},\quad x=\begin{bmatrix}4\\2\end{bmatrix}\quad\Longrightarrow\quad Ax=\begin{bmatrix}2\cdot4+1\cdot2\\-1\cdot4+3\cdot2\end{bmatrix}=\begin{bmatrix}10\\2\end{bmatrix}`}
        annotatedFormula={String.raw`\underbrace{A}_{\text{m×n matrix 계산}}=\begin{bmatrix}2&1\\-1&3\end{bmatrix},\quad \underbrace{x}_{\text{input vector 계산}}=\begin{bmatrix}4\\2\end{bmatrix}\quad\Longrightarrow\quad \underbrace{Ax}_{\text{output vector 계산}}=\begin{bmatrix}2\cdot4+1\cdot2\\-1\cdot4+3\cdot2\end{bmatrix}=\begin{bmatrix}10\\2\end{bmatrix}`}
        operations={[
          { expression: String.raw`Ax`, annotation: ["output vector이(가) 식의 결과에 기여하는 방식을","계산합니다.","첫째 행과 x의 dot product가 첫 output, 둘째","행과 x의 dot product가 둘째 output이 됩니다."] },
          { expression: String.raw`A`, annotation: ["m×n matrix이(가) 식의 결과에 기여하는 방식을","계산합니다.","첫째 행과 x의 dot product가 첫 output, 둘째","행과 x의 dot product가 둘째 output이 됩니다."] },
          { expression: String.raw`x`, annotation: ["input vector이(가) 식의 결과에 기여하는 방식을","계산합니다.","첫째 행과 x의 dot product가 첫 output, 둘째","행과 x의 dot product가 둘째 output이 됩니다."] },
        ]}
        terms={[
          { symbol: "A", name: "m×n matrix", description: "n차원 input을 m차원 output으로 보내는 linear map입니다." },
          { symbol: "x", name: "input vector", description: "A의 column 수와 같은 n개 coordinate를 가져야 합니다." },
          { symbol: "Ax", name: "output vector", description: "A의 각 row와 x의 dot product를 차례로 모은 m차원 vector입니다." },
        ]}
        assumptions={["실수 좌표의 표준 matrix–column-vector convention을 사용합니다.", "Bias를 더한 Ax+b는 affine map이며 엄밀히는 origin을 보존하는 linear map과 구분합니다."]}
        interpretation="A는 input coordinate를 복사·scale·합성해 새 coordinate를 만듭니다. 숫자가 직사각형으로 배치됐다는 사실만으로 의미가 생기지는 않으며, row와 column axis가 각각 무엇을 나타내는지 함께 정해야 합니다."
      />
    </section>
  );
}
