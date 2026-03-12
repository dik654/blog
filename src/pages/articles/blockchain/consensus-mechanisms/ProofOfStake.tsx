export default function ProofOfStake() {
  return (
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
  );
}
