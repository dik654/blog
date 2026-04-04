export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: DHT 공격 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DHT는 공개 네트워크이므로 누구나 참여할 수 있다. 이것이 공격 표면이 된다.
          <br />
          주요 공격: Sybil(가짜 노드 대량 생성), Eclipse(특정 노드를 악성 피어로 포위).
        </p>
        <p>
          go-ethereum은 여러 방어를 구현한다:
          <br />
          <strong>IP 쿼터</strong> — 같은 /24 서브넷에서 버킷당 2개, 테이블 전체 10개까지만.
          <br />
          <strong>재검증</strong> — 죽은 노드를 빠르게 걸러내어 공격자가 테이블을 장악하기 어렵게.
          <br />
          <strong>Kademlia 자체 특성</strong> — 노드 ID가 제곱근적으로 분포하여 특정 영역 독점이 어려움.
        </p>
      </div>
    </section>
  );
}
