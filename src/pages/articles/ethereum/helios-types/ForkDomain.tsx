import ForkDomainViz from './viz/ForkDomainViz';

export default function ForkDomain() {
  return (
    <section id="fork-domain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Fork · ForkData · Domain 계산
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth(EL)에서 포크는 ChainSpec의 하드포크 블록 번호로 관리한다.
          CL에서는 Fork 구조체로 버전과 에폭을 추적한다.<br />
          Helios는 BLS 서명 검증 시 Domain을 계산하여
          포크 간 리플레이 공격을 방지한다.
        </p>
        <p className="leading-7">
          Domain 계산 과정:<br />
          1) Fork에서 current_version(4B) 추출<br />
          2) ForkData(version + genesis_validators_root) SSZ 해싱<br />
          3) domain_type(4B) + fork_data_root 앞 28B = Domain(32B)<br />
          4) compute_signing_root(msg, domain) → BLS 서명 메시지
        </p>
        <p className="leading-7">
          domain_type 종류: SYNC_COMMITTEE(0x07),
          BEACON_PROPOSER(0x00), BEACON_ATTESTER(0x01) 등.
          같은 메시지도 용도에 따라 다른 도메인을 사용한다.
        </p>
      </div>
      <div className="not-prose"><ForkDomainViz /></div>
    </section>
  );
}
