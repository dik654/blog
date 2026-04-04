import DALayerCompareViz from './viz/DALayerCompareViz';

export default function DALayer() {
  return (
    <section id="da-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DA 레이어: Celestia, EigenDA, Avail</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          모듈러 블록체인에서 DA 레이어는 실행/합의와 분리된 데이터 가용성 전용 인프라다.<br />
          이더리움의 EIP-4844가 자체 DA를 제공한다면, 외부 DA 레이어는 더 높은 처리량을 목표로 한다.
        </p>
        <p className="leading-7">
          <strong>Celestia</strong>는 2D Reed-Solomon(다항식 평가 기반 이레이저 코딩) + Namespaced Merkle Tree로 DAS를 구현한다.<br />
          블록 크기가 커져도 라이트 노드의 검증 비용은 로그 스케일로 증가한다.
        </p>
        <p className="leading-7">
          <strong>EigenDA</strong>는 EigenLayer 위에 구축되어 리스테이킹된 ETH로 DA를 보장한다.<br />
          노드별 데이터 분산 저장 + KZG 커밋먼트로 검증하며, 이더리움 보안을 상속한다.
        </p>
        <p className="leading-7">
          <strong>Avail</strong>은 Polkadot 기반 DA 체인으로, 최대 4MB 블록 + KZG DAS를 지원한다.<br />
          앱별 네임스페이스로 데이터를 격리하고, Nomad 라이트 클라이언트로 검증한다.
        </p>
        <p className="leading-7">
          세 프로젝트 모두 KZG 커밋먼트를 사용하지만, 합의 메커니즘과 데이터 분배 전략이 다르다.<br />
          이더리움 EIP-4844의 <code>kzg4844</code> 패키지와 동일한 수학적 기반(BLS12-381, 페어링 친화적 타원곡선)을 공유한다.
        </p>
      </div>
      <div className="not-prose"><DALayerCompareViz /></div>
    </section>
  );
}
