export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — Filecoin Storage Provider 의 운영 본질</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Filecoin SP (Storage Provider) 운영은 일반적인 블록체인 노드와 본질적으로 다르다.
          <br />
          노드가 블록을 검증하는 게 아니라 <strong>고객 데이터 (TB~PB) 를 봉인 (sealing) 하고 주기적 증명 (PoSt) 을 만드는</strong> 게 본업이다.
          <br />
          그 과정에서 발생하는 자원 패턴 — 거대한 HDD 풀 + Groth16 연산을 위한 SSD 임시 영역 + 고대역폭 GPU — 은 Eth 검증자나 일반 K8s 워크로드와 완전히 다른 인프라 결정을 요구한다.
        </p>
        <p className="leading-7">
          핵심 운영 결정은 셋이다. (1) 봉인 파이프라인이 어떻게 SSD/GPU/CPU 를 시간차로 점유하는지 알고 풀을 설계, (2) 봉인 후 32 GiB · 64 GiB 섹터를 어디에 영구 보관할지 (HDD 직결 vs JBOD vs 분산 FS), (3) 매 24 시간 WindowPoSt 마감을 놓치면 페널티이므로 큐 / 증명 GPU / 네트워크 가용성의 SLA 를 어떻게 보장할지.
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>봉인 파이프라인</strong> — PreCommit1/2 · Commit1/2 의 5 단계 + Groth16 · SDR 의 자원 사용 패턴</li>
          <li><strong>SSD 마모와 데이터 흐름</strong> — sealing scratch 가 SSD 에 가하는 write 양 + 수명 계산 + zfs/lvm 패턴</li>
          <li><strong>스토리지 계층</strong> — sealed sector 의 영구 보관 · cache 분리 · JBOD vs 분산 FS · garbage collection</li>
          <li><strong>증명 (PoSt) 운영</strong> — WinningPoSt 의 실시간성 + WindowPoSt 의 24 시간 마감 + GPU 풀 설계</li>
          <li><strong>실전 사고 시나리오</strong> — sealing 큐 폭주 · SSD 마모 가속 · WindowPoSt fault · 섹터 손실 복구</li>
        </ol>
      </div>
    </section>
  );
}
