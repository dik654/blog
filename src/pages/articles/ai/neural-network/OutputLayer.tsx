export default function OutputLayer() {
  return (
    <section id="output-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">출력층 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">회귀 문제</h3>
        <p>
          출력층 활성화 함수: <strong>항등 함수(identity)</strong> — 값을 그대로 출력<br />
          예시: 집값 예측, 온도 예측 등 연속값<br />
          손실 함수: MSE(Mean Squared Error, 평균 제곱 오차)
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2클래스 분류</h3>
        <p>
          출력 노드 1개 + <strong>sigmoid</strong> — 0~1 사이 확률 하나만 출력<br />
          0.5 기준으로 양성/음성 판별<br />
          손실 함수: Binary Cross-Entropy
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">다중 클래스 분류</h3>
        <p>
          클래스 수만큼 출력 노드 + <strong>softmax</strong><br />
          모든 출력의 합 = 1인 확률 분포로 변환<br />
          예시: 개/고양이/새 → [0.7, 0.2, 0.1]<br />
          손실 함수: Categorical Cross-Entropy
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">조합 정리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">문제 유형</th>
                <th className="border border-border px-4 py-2 text-left">활성화</th>
                <th className="border border-border px-4 py-2 text-left">손실 함수</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2">회귀</td>
                <td className="border border-border px-4 py-2">항등 함수</td>
                <td className="border border-border px-4 py-2">MSE</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2">2클래스</td>
                <td className="border border-border px-4 py-2">sigmoid</td>
                <td className="border border-border px-4 py-2">Binary CE</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2">다중 클래스</td>
                <td className="border border-border px-4 py-2">softmax</td>
                <td className="border border-border px-4 py-2">Categorical CE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
