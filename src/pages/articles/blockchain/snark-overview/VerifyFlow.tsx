import Math from '@/components/ui/math';

export default function VerifyFlow() {
  return (
    <section id="verify-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검증 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          증명 생성은 오프체인에서 한 번이지만, 검증은 온체인에서 <strong>모든 노드</strong>가 실행한다
          <br />
          따라서 SNARK 시스템 선택의 핵심 기준은 검증 비용이다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          <a href="/blockchain/groth16" className="text-indigo-400 hover:underline">Groth16</a> 검증
        </h3>
        <p>
          증명 <Math>{'(A, B, C) \\in \\mathbb{G}_1 \\times \\mathbb{G}_2 \\times \\mathbb{G}_1'}</Math>에 대해
          페어링 등식 하나를 검증한다
        </p>
        <Math display>{'e(A, B) = e(\\alpha, \\beta) \\cdot e(\\sum_i a_i \\cdot L_i, \\gamma) \\cdot e(C, \\delta)'}</Math>
        <p>
          페어링 3회 + 공개 입력에 대한 MSM 1회로 완료된다
          <br />
          회로 크기에 완전히 무관한 <Math>{'O(1)'}</Math> 검증이다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          <a href="/blockchain/plonk" className="text-indigo-400 hover:underline">PLONK</a> 검증
        </h3>
        <p>
          KZG commitment의 opening proof를 검증한다
          <br />
          pairing 2회 + 공개 입력 처리가 필요하다
          <br />
          Groth16보다 증명이 약간 크지만 universal setup이라는 이점이 있다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          <a href="/blockchain/stark-theory" className="text-indigo-400 hover:underline">STARK</a> 검증
        </h3>
        <p>
          FRI(Fast Reed-Solomon IOP) 쿼리를 검증한다
          <br />
          Merkle path를 따라가며 low-degree 여부를 확인하므로 <Math>{'O(\\log^2 n)'}</Math> 복잡도다
          <br />
          페어링이 필요 없어 양자 컴퓨터에도 안전하지만, 증명 크기가 수십~수백 KB로 크다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Ethereum 가스 비용 비교</h3>
      </div>

      <div className="overflow-x-auto not-prose">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium">시스템</th>
              <th className="py-3 px-4 text-left font-medium">증명 크기</th>
              <th className="py-3 px-4 text-left font-medium">검증 복잡도</th>
              <th className="py-3 px-4 text-left font-medium">가스 비용 (approx)</th>
              <th className="py-3 px-4 text-left font-medium">Trusted Setup</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-foreground">Groth16</td>
              <td className="py-3 px-4">128 B (2 G1 + 1 G2)</td>
              <td className="py-3 px-4"><Math>{'O(1)'}</Math></td>
              <td className="py-3 px-4">~200K gas</td>
              <td className="py-3 px-4">회로별</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-foreground">PLONK</td>
              <td className="py-3 px-4">~400 B</td>
              <td className="py-3 px-4"><Math>{'O(1)'}</Math></td>
              <td className="py-3 px-4">~300K gas</td>
              <td className="py-3 px-4">Universal</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-foreground">FFLONK</td>
              <td className="py-3 px-4">~256 B</td>
              <td className="py-3 px-4"><Math>{'O(1)'}</Math></td>
              <td className="py-3 px-4">~250K gas</td>
              <td className="py-3 px-4">Universal</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-foreground">STARK</td>
              <td className="py-3 px-4">~50-200 KB</td>
              <td className="py-3 px-4"><Math>{'O(\\log^2 n)'}</Math></td>
              <td className="py-3 px-4">~500K-5M gas</td>
              <td className="py-3 px-4">없음</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="text-sm text-muted-foreground">
          STARK의 높은 가스 비용 때문에 실제로는 STARK 증명을 SNARK로 래핑하는 방식이 널리 쓰인다
          <br />
          StarkNet, Polygon zkEVM 등이 이 &quot;STARK inside SNARK&quot; 패턴을 사용한다
        </p>
      </div>
    </section>
  );
}
