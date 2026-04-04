export default function Comparison() {
  return (
    <section id="comparison">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">비교 분석</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left font-medium">항목</th>
              <th className="py-3 px-4 text-left font-medium">PoW</th>
              <th className="py-3 px-4 text-left font-medium">PoS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-foreground">에너지 소비</td>
              <td className="py-3 px-4">높음</td>
              <td className="py-3 px-4">낮음</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-foreground">처리 속도</td>
              <td className="py-3 px-4">~7 TPS</td>
              <td className="py-3 px-4">~100K TPS</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4 font-medium text-foreground">진입 장벽</td>
              <td className="py-3 px-4">하드웨어 비용</td>
              <td className="py-3 px-4">토큰 스테이킹</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-foreground">대표 체인</td>
              <td className="py-3 px-4">Bitcoin</td>
              <td className="py-3 px-4">Ethereum 2.0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
