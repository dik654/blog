export default function ProofOfWork() {
  return (
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
  );
}
