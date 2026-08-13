export default function Comparison() {
  const rows = [
    ["Sybil 비용", "Hash work·energy·hardware", "Bonded stake·key custody·penalty"],
    ["후보·vote 검증", "Hash target과 full block validity", "Signature·eligibility·state transition·attestation"],
    ["Fork choice", "Valid branch의 cumulative work", "Protocol별 stake-weighted head rule"],
    ["Finality", "Confirmation depth에 따른 probabilistic risk", "Supermajority checkpoint 기반 explicit finality 가능"],
    ["위반 evidence", "대체로 competing work와 reorg trace", "Equivocation 등 slashable signed messages"],
    ["핵심 자원 위험", "Hash concentration·energy price·network propagation", "Stake concentration·custody·correlated client failure"],
  ] as const;

  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        선택은 체인 이름이 아니라 위협 모델과 운영 ledger로 결정한다
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map(([axis, pow, pos]) => (
          <article key={axis} className="min-w-0 border-t border-border pt-4">
            <h3 className="text-sm font-bold">{axis}</h3>
            <dl className="mt-3 grid min-w-0 gap-3 text-sm">
              <div className="min-w-0 border-l border-border pl-3">
                <dt className="font-mono text-[11px] font-semibold text-primary">PoW</dt>
                <dd className="mt-1 break-words leading-6 text-muted-foreground">{pow}</dd>
              </div>
              <div className="min-w-0 border-l border-border pl-3">
                <dt className="font-mono text-[11px] font-semibold text-primary">PoS</dt>
                <dd className="mt-1 break-words leading-6 text-muted-foreground">{pos}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <h3>Release gate는 같은 fault trace에서 paired로 비교합니다</h3>
        <p>
          Candidate protocol을 고를 때 “PoW는 느리고 PoS는 빠르다” 같은 표만으로는 부족합니다.
          같은 transaction workload·node count·geography·binary·config에서 network partition,
          delayed block/vote, equivocation, validator/miner outage, restart와 corrupted local state를
          주입합니다. Conflicting finalized history는 0건이어야 하고, head reorg depth·recovery
          time·resource cost·participation concentration을 함께 기록합니다.
        </p>
        <p>
          Throughput은 execution·data availability·block size·hardware·network와 결합된 결과라
          consensus family만의 고정 상수가 아닙니다. 따라서 기존 글의 “PoW 7 TPS, PoS 100K
          TPS”처럼 서로 다른 chain·layer·workload의 숫자는 삭제하고 동일 조건 측정만 채택
          근거로 사용합니다.
        </p>
      </div>

      <div id="paper-eip-3675" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">규격 읽기 · 실제 전환 경계</p>
        <p className="mt-2 text-sm font-semibold">EIP-3675: Upgrade consensus to Proof-of-Stake</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 Ethereum Mainnet의 execution layer를 PoW block production에서 Beacon Chain
          PoS consensus로 전환하는 것입니다. Terminal PoW block과 이후 block validity·fork-choice
          연결을 규정합니다. PoW와 PoS 전체 성능을 보편적으로 비교하는 benchmark는 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://eips.ethereum.org/EIPS/eip-3675" target="_blank" rel="noreferrer">EIP-3675 보기</a>
      </div>
    </section>
  );
}
