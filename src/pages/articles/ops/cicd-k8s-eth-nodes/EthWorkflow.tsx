import WorkflowViz from './viz/EthWorkflowViz';

export default function EthWorkflow() {
  return (
    <section id="eth-workflow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">표준 워크플로우 — 신 검증자 추가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          새 검증자 키 1 개를 생성해 운영에 진입시키는 표준 절차.
          <br />
          한 단계라도 잘못하면 슬래싱 위험 또는 출금 영구 잠김으로 직결되는 영역.
        </p>
      </div>
      <WorkflowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">단계 1 — Mnemonic 생성 (오프라인)</h3>
        <ul className="leading-7">
          <li>오프라인 머신에서 <code>staking-deposit-cli new-mnemonic</code>. 인터넷 연결 차단된 환경 (air-gap).</li>
          <li>Mnemonic 24 단어 — 강철판 (Cryptosteel · Billfodl) 에 새겨 물리 금고. 종이는 화재/습기 위험.</li>
          <li>Shamir secret sharing (예: 3-of-5) 으로 분산 보관 가능 — 단일 도난/분실 위험 ↓.</li>
          <li>잃으면 영구 손실 — withdrawal 권한이 mnemonic 에 묶임.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 2 — 키 생성 (validator + withdrawal)</h3>
        <ul className="leading-7">
          <li><code>staking-deposit-cli generate</code> — mnemonic 입력, 검증자 수, withdrawal address.</li>
          <li><code>--eth1_withdrawal_address 0x...</code> 명시 — 처음부터 0x01 자격증명 (출금 가능).</li>
          <li>출력: <code>deposit_data.json</code> + 키스토어 파일 (BLS 서명 키, 비밀번호로 암호화).</li>
          <li>검증 — withdrawal address 가 본인 통제 하인지 (멀티시그면 같은 체인 배포 확인). 한 번 박으면 변경 불가.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 3 — 32 ETH Deposit</h3>
        <ul className="leading-7">
          <li>Beacon Deposit Contract (<code>0x00000000219ab540356cBB839Cbe05303d7705Fa</code>) 에 <code>deposit_data.json</code> broadcast.</li>
          <li>가스 비싼 시간 피함 — etherscan gas tracker.</li>
          <li>여러 검증자면 batch deposit (한 트랜잭션에 묶기) — 가스 절약.</li>
          <li>트랜잭션 수신 확인 → activation queue 진입.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 4 — Activation queue 추적</h3>
        <ul className="leading-7">
          <li>큐 길이에 따라 수 시간 ~ 수 일 대기 (현재 ~수 시간 수준).</li>
          <li>beaconcha.in 에서 status 추적 — pending → active.</li>
          <li>activation 직전 — 다음 단계 (BN 연결 + VC 셋업) 준비 완료 상태여야 함.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 5 — VC 또는 Web3Signer 에 키 등록</h3>
        <ul className="leading-7">
          <li>키스토어 파일 + 비밀번호를 VC 의 <code>--keystore</code> 디렉토리에 배치.</li>
          <li>또는 Web3Signer 의 <code>--key-store-path</code> 에 배치 + 슬래싱 보호 PostgreSQL 연결.</li>
          <li>HA Web3Signer 면 모든 인스턴스가 같은 PostgreSQL 공유 (별 DB 두면 슬래싱).</li>
          <li>키 파일 권한 0600, VC 사용자만 읽기.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 6 — VC 시작 (doppelganger 활성화)</h3>
        <ul className="leading-7">
          <li><code>lighthouse vc --doppelganger-protection</code> — 2~3 epoch 동안 attestation 만 듣기.</li>
          <li>같은 키가 다른 곳에서 활동 중이면 시작 거부 — 더블 시작 방어선.</li>
          <li>BN 다중 연결 — <code>--beacon-nodes http://bn1,http://bn2,http://bn3</code>. 한 BN 죽어도 다른 곳에서 받음.</li>
          <li>fee recipient 명시 — <code>--suggested-fee-recipient 0x...</code> (별도 핫월렛 권장).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 7 — 첫 attestation 검증</h3>
        <ul className="leading-7">
          <li>activation 후 첫 1~2 epoch 동안 attestation 정상 발생 확인.</li>
          <li>beaconcha.in 에서 검증자 페이지 → recent attestations.</li>
          <li>Inclusion delay 1 슬롯 = 정상. 2+ 슬롯 = 네트워크 지연 의심 (BN peer 점검).</li>
          <li>없는 attestation = 즉시 진단 (BN 연결 · 키 등록 · doppelganger 결과).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 8 — MEV-Boost 통합 (선택)</h3>
        <ul className="leading-7">
          <li>MEV-Boost daemon 시작 — 여러 relay 등록 (Flashbots · bloXroute · censorship-resistant 옵션).</li>
          <li>VC 에 <code>--builder-proposals</code> 활성.</li>
          <li><code>min_bid</code> 튜닝 — 너무 높으면 missed proposal, 낮으면 MEV 손실.</li>
          <li>local fallback 항상 살아 있게 (모든 relay 실패 시).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 9 — 모니터링 + 알람 셋업</h3>
        <ul className="leading-7">
          <li>Prometheus scrape — VC 의 <code>/metrics</code>. <code>validator_inclusion_distance</code>, <code>missed_attestations</code> 핵심.</li>
          <li>Grafana 대시보드 — 검증자별 효율, peer count, JWT 인증 실패.</li>
          <li>알람 — peer &lt; 20 = warn, head 격차 4 슬롯 = page, JWT 실패 = page.</li>
          <li>외부 검증 — beaconcha.in alerting 또는 rated.network. 자가 모니터링이 거짓말할 때 잡아줌.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 10 — DR 페어 셋업 (선택, 운영 규모에 따라)</h3>
        <ul className="leading-7">
          <li>Standby 노드 다른 데이터센터 / 리전. 슬래싱 보호 DB 동기화 메커니즘.</li>
          <li>페일오버 절차 문서화 + 분기 1 회 game day 검증.</li>
          <li>대규모 운영자면 DVT (Obol Charon · SSV) 도입 검토 — 단일 노드 fail 무영향.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 11 — 첫 1주 모니터링 + 효율 점검</h3>
        <ul className="leading-7">
          <li>rated.network — 효율 점수 95%+ 목표.</li>
          <li>missed attestation 률 분석 — 1% 이하면 정상.</li>
          <li>인근 운영자 (같은 ASN · 같은 클라이언트) 와 비교.</li>
          <li>이상 신호 시 BN 연결 / NVMe IOPS / peer 다양화 점검.</li>
        </ul>
      </div>
    </section>
  );
}
