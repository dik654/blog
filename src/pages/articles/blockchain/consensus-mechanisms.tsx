export default function ConsensusMechanisms() {
  return (
    <div className="space-y-12">
      <section id="overview">
        <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">개요</h2>
        <p className="text-muted-foreground leading-7">
          합의 알고리즘은 분산 네트워크에서 모든 노드가 동일한 상태에 동의하기 위한 메커니즘입니다.
          블록체인의 보안성과 탈중앙화를 결정하는 핵심 요소입니다.
        </p>
      </section>

      <section id="pow">
        <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Proof of Work</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          채굴자가 복잡한 수학 문제를 풀어 블록을 생성하는 방식입니다.
          Bitcoin이 대표적인 PoW 블록체인입니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2 text-green-700">장점</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 검증된 보안성 (15년+)</li>
              <li>• 높은 탈중앙화 수준</li>
              <li>• Sybil 공격 방어</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2 text-red-700">단점</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 높은 에너지 소비</li>
              <li>• 낮은 처리량 (TPS)</li>
              <li>• 채굴 중앙화 위험</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="pos">
        <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Proof of Stake</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          검증자가 자신의 토큰을 스테이킹하여 블록 생성에 참여하는 방식입니다.
          Ethereum 2.0이 PoS로 전환한 대표적 사례입니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2 text-green-700">장점</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 에너지 효율적</li>
              <li>• 높은 확장성</li>
              <li>• 빠른 트랜잭션 완결</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2 text-red-700">단점</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• "Rich get richer" 문제</li>
              <li>• Nothing-at-stake 문제</li>
              <li>• 상대적으로 짧은 검증 기간</li>
            </ul>
          </div>
        </div>
      </section>

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
            <tbody className="text-muted-foreground">
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
    </div>
  );
}
