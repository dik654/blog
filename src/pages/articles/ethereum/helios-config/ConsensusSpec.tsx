import ConsensusSpecViz from './viz/ConsensusSpecViz';

export default function ConsensusSpec() {
  return (
    <section id="consensus-spec" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        ConsensusSpec 파라미터
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth(EL)에는 ConsensusSpec이 없다.
          실행 레이어는 슬롯·에폭 개념을 직접 사용하지 않기 때문.
          대신 ChainSpec에 하드포크 블록 번호만 정의한다.<br />
          Helios는 CL 프로토콜을 직접 구현하므로
          ConsensusSpec이 필수이다.
        </p>
        <p className="leading-7">
          slots_per_epoch(32): 한 에폭 = 32슬롯 × 12초 = 6.4분.
          epochs_per_period(256): Sync Committee 교체 주기 = 256에폭 ≈ 27시간.<br />
          genesis_validators_root: 제네시스 시점 검증자 집합의 Merkle 루트.
          BLS 도메인 계산에 사용되어 체인 간 리플레이를 방지한다.
        </p>
        <p className="leading-7">
          fork_versions: 각 포크마다 4바이트 버전 코드.
          Bellatrix(0x02), Capella(0x03), Deneb(0x04).
          BLS 서명 검증 시 올바른 포크 버전을 사용해야 한다.
        </p>
      </div>
      <div className="not-prose"><ConsensusSpecViz /></div>
    </section>
  );
}
