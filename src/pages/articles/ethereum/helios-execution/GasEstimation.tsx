import GasEstimationViz from './viz/GasEstimationViz';

export default function GasEstimation() {
  return (
    <section id="gas-estimation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        가스 추정 (경량 클라이언트 기반)
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: eth_call과 동일하게 revm으로 실행하되
          MDBX에서 상태를 읽는다.
          result.gas_used()에 마진을 더해 반환.<br />
          Helios: ProofDB 기반으로 동일한
          revm 실행을 수행한다. 차이는 DB 레이어뿐.
        </p>
        <p className="leading-7">
          estimate_gas() 내부 흐름:<br />
          1) ProofDB::new(&rpc, block) — 가상 DB 생성<br />
          2) Evm::builder().with_db(db).with_tx_env(tx) — 빌드<br />
          3) evm.transact() — 실행 후 gas_used 추출<br />
          4) gas_used * 1.1 — 10% 마진 추가
        </p>
        <p className="leading-7">
          마진이 필요한 이유: 블록 간 상태 변화로
          실제 실행 시 가스가 달라질 수 있다.<br />
          Helios는 증명 시점과 TX 포함 시점 사이
          지연이 있어 풀노드보다 불확실성이 크다.
        </p>
      </div>
      <div className="not-prose"><GasEstimationViz /></div>
    </section>
  );
}
