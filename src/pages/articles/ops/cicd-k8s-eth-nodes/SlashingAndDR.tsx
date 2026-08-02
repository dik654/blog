import SlashingDefenseViz from './viz/SlashingDefenseViz';
import MevBoostViz from './viz/MevBoostViz';

export default function SlashingAndDR() {
  return (
    <section id="slashing-dr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">4. 슬래싱 보호 · 클라이언트 다양성 · DR</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Rejamong 의 가이드가 1 순위로 꼽은 두 가지 — <strong>클라이언트 다양성</strong>과 <strong>슬래싱 방지</strong>.
          <br />
          이 둘은 단일 장애 원인이 자산 손실로 직결되는 영역이라, 운영 규모와 무관하게 모든 검증자에게 적용된다.
        </p>
      </div>
      <SlashingDefenseViz />
      <MevBoostViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">4-1. 슬래싱 가능한 행위</h3>
        <ul className="leading-7">
          <li><strong>Double proposal</strong> — 같은 슬롯에 두 개의 다른 블록 제안. 보통 같은 키가 두 노드에서 동시에 깨어났을 때 발생.</li>
          <li><strong>Double vote (attestation)</strong> — 같은 target epoch 에 두 개의 다른 head 에 투표. 페일오버 직후 가장 흔한 슬래싱 사유.</li>
          <li><strong>Surround vote</strong> — 새 attestation 의 source/target 구간이 이전 attestation 의 구간을 감싸거나 감싸짐. 시간 동기화 깨졌을 때 발생.</li>
        </ul>
        <p className="leading-7">
          벌은 0.5~1 ETH 의 즉시 burn + 8192 epoch(약 36 일) 동안의 correlation 패널티.
          <br />
          상관 슬래싱(같은 시점 다수 위반)일수록 패널티 비율이 가중 — 여러 검증자를 같은 키 매니저에서 운영하면 한 사고에 통째로 털린다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-2. 다층 슬래싱 보호</h3>
        <ol className="leading-7">
          <li><strong>VC 내장 DB</strong> — 모든 클라이언트는 <code>slashing_protection.json</code>(EIP-3076) 형태의 서명 이력을 유지. 파일 변조나 손상은 즉시 시작 거부.</li>
          <li><strong>원격 서명자(Remote Signer)</strong> — Web3Signer, Dirk 같은 별도 프로세스로 키를 모으고, 서명 요청을 자체 슬래셔 DB 와 대조 후 수행. VC 가 침해돼도 서명자가 한 번 더 막음.</li>
          <li><strong>Doppelganger detection</strong> — 검증자 시작 시 2~3 epoch 동안 attestation 만 듣고, 같은 키가 이미 활동 중이면 시작 거부. 페일오버 사고 1 위 방어선.</li>
          <li><strong>Slashing import/export</strong> — 마이그레이션할 땐 반드시 보호 DB 도 같이 옮기고, 받은 쪽에서 검증. 빈 DB 로 띄우면 surround vote 위험.</li>
        </ol>
        <p className="leading-7">
          액티브-액티브 페일오버는 절대 금물. 검증자는 항상 <strong>액티브-스탠바이</strong> + 수동 승격 + DB 동기화 후 시작.
          <br />
          자동 페일오버를 굳이 원한다면 DVT 로 가야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-3. DVT — Distributed Validator Technology</h3>
        <p className="leading-7">
          BLS 임계값 서명(<code>m-of-n</code>)으로 검증자 키를 여러 노드가 분할 보유.
          <br />
          예: 4 노드 중 3 개가 살아 있으면 정상 서명, 한 노드 다운/침해는 무영향.
          <br />
          대표 구현: <strong>Obol Charon</strong>, <strong>SSV.network</strong>, <strong>Diva</strong>.
        </p>
        <ul className="leading-7">
          <li><strong>장점</strong> — 단일 키 노출 없음(키 자체가 분할 분산), 노드 단일 장애 시에도 missed attestation 없이 운영.</li>
          <li><strong>단점</strong> — 운영 복잡도 ↑, 노드 간 합의 추가 지연(서명 합의 라운드), 운영자 간 신뢰 모델 설계 필요.</li>
          <li><strong>적합 상황</strong> — 기관 운영, 규제 감사 대비, 기약자 다중 운영자 모델, 99.99% SLA 약속.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-4. 클라이언트 다양성 — 합의 버그가 있을 때만 의미가 산다</h3>
        <p className="leading-7">
          한 클라이언트 점유율이 2/3 를 넘으면 그 클라이언트의 합의 버그 한 번에 네트워크가 파이널라이즈를 잃는다.
          <br />
          그 시점에 같은 클라이언트 쓰는 검증자는 모두 잘못된 체인에 vote → 대규모 슬래싱.
        </p>
        <ul className="leading-7">
          <li><strong>EL/CL 둘 다 분산</strong> — 둘 다 마이너 클라이언트 조합이 가장 안전(예: Reth + Lighthouse, Nethermind + Teku).</li>
          <li><strong>대규모 운영자라면 페어를 나눠</strong> — 같은 운영자가 여러 클라이언트 페어를 동시 운영, 한 페어 버그 시 다른 페어가 영향 흡수.</li>
          <li><strong>업그레이드 카나리</strong> — 새 버전은 5~10% 검증자에 먼저 1 주, 문제 없으면 단계적 확산. 메인 검증자에 신버전을 첫날 박지 말 것.</li>
        </ul>
        <p className="leading-7">
          현재 점유율 데이터는 <code>clientdiversity.org</code>, <code>ethernodes.org</code> 에서 주기적으로 확인.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-5. 모니터링 스택</h3>
        <ul className="leading-7">
          <li><strong>메트릭</strong> — Prometheus + Grafana. EL/CL/VC 가 다 <code>/metrics</code> 노출. <code>validator_inclusion_distance</code>, <code>missed_attestations</code>, <code>head_slot</code> 격차 핵심.</li>
          <li><strong>외부 검증</strong> — beaconcha.in alerting, rated.network 효율 점수. 자가 모니터링이 거짓말할 때 외부에서 잡아줌.</li>
          <li><strong>알람 임계</strong> — head 가 1 슬롯 이상 뒤처짐 = warn, 4 슬롯 = page, peers &lt; 20 = warn, JWT 인증 실패 = page.</li>
          <li><strong>로그 집계</strong> — Loki 또는 ELK. CL 의 <code>fork choice</code> 로그는 사고 후 포렌식 핵심.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-6. 백업 · 디재스터 리커버리</h3>
        <ul className="leading-7">
          <li><strong>지역 분산</strong> — primary 와 standby 를 다른 데이터센터/리전. 단일 ISP·전력·시설 사고에 동시 다운 안 되게.</li>
          <li><strong>슬래싱 DB 백업</strong> — 검증자 DB 는 자주 스냅샷, 다만 <strong>복원 시 항상 가장 최신</strong>으로. 옛날 DB 로 되살리면 surround vote 위험.</li>
          <li><strong>키 복구 절차</strong> — withdrawal mnemonic 은 강철판에 새겨 물리 금고. signing key 는 Shamir secret sharing(예: 3-of-5) 으로 분산.</li>
          <li><strong>런북</strong> — 페일오버 / 키 재발급 / 노드 교체 시나리오 각각의 단계별 절차를 문서화. 사고 시 패닉 → 슬래싱 1 위 원인.</li>
          <li><strong>훈련(game day)</strong> — 분기 1 회 모의 페일오버 + DB 복구. 처음 해보는 게 진짜 사고면 늦다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-7. 솔로 vs 기관 — 같은 원칙, 다른 규모</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">관점</th>
              <th className="text-left py-2">솔로 스테이커</th>
              <th className="text-left py-2">기관 운영자</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2">키 관리</td><td>하드웨어 월렛 + 단일 노드</td><td>HSM / Web3Signer / DVT 의무</td></tr>
            <tr className="border-b"><td className="py-2">클라이언트</td><td>마이너 클라이언트 단일 페어로 충분</td><td>2~3 페어 분산 운영</td></tr>
            <tr className="border-b"><td className="py-2">DR</td><td>홈 + 클라우드 콜드 스탠바이</td><td>다중 리전 + 게임데이</td></tr>
            <tr className="border-b"><td className="py-2">규제</td><td>거의 무관</td><td>OFAC 정책, 감사, KYC, 지역 라이선스</td></tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-8. Web3Signer · Vouch — 기관급 원격 서명자 셋업</h3>
        <p className="leading-7">
          기관 검증자는 키를 VC 프로세스에 두지 않는다. 별도 원격 서명자 프로세스가 키를 보유하고, VC 는 RPC 로 서명을 요청한다.
        </p>
        <ul className="leading-7">
          <li><strong>Web3Signer</strong> — Consensys 의 stateless 원격 서명자. <code>--key-store-path</code> 로 keystore 디렉토리, <code>--slashing-protection-db-url=jdbc:postgresql://...</code> 로 DB 연결. 자체 슬래싱 DB 가 VC 와 별개로 한 번 더 검증.</li>
          <li><strong>Vouch (Attestant)</strong> — 다중 BN 동시 질의 후 빠른 응답 우선 사용 + Dirk(원격 서명자) 통합. 대규모 운영자가 latency p99 를 깎을 때 표준 선택.</li>
          <li><strong>Dirk</strong> — Vouch 의 분산 서명자. 키 sharding(임계 서명) 지원으로 노드 한 대 침해는 서명 불가능하게.</li>
          <li><strong>설정 함정 1</strong> — Web3Signer 의 슬래싱 DB 가 VC 의 로컬 DB 와 분리되면 두 개의 진실 — VC 가 따로 서명 시도하다 충돌. VC 의 로컬 DB 비활성화 옵션을 명시.</li>
          <li><strong>설정 함정 2</strong> — Web3Signer 가 다중 인스턴스로 떠 있으면(고가용성), 각각이 자기 슬래싱 DB 를 보면 같은 서명 두 번 — 슬래싱. <strong>HA 의 경우 모두 같은 PostgreSQL 을 공유</strong>해야 한다.</li>
          <li><strong>HSM 통합</strong> — YubiHSM2, Thales Luna 같은 HSM 에 BLS 키를 넣는 것이 가능하지만 BLS 12-381 지원 HSM 이 제한적이라 검증자 쪽은 아직 Web3Signer + 디스크 keystore + 강한 OS 격리가 더 흔함.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-9. 슬래싱 패널티 수치 시나리오</h3>
        <p className="leading-7">
          벌은 행위 자체의 즉시 burn 과 그 이후의 correlation 패널티 두 층이다.
        </p>
        <ul className="leading-7">
          <li><strong>최소 패널티 (단일 검증자, 다른 슬래싱 없음)</strong> — 약 0.5 ~ 1 ETH 즉시 burn. 32 ETH 잔고면 ~3% 손실.</li>
          <li><strong>중간 시나리오 (10 검증자가 같은 시점)</strong> — correlation 보너스가 작아 ~1 ETH 씩 burn + 약 36 일간 attestation 보상 손실. 운영 손실 ~5%.</li>
          <li><strong>최악 시나리오 (1000+ 검증자가 같은 시점)</strong> — correlation penalty 가 폭발적으로 증가, 검증자당 최대 32 ETH 전부 burn 가능 (whistleblower reward 차감). Lido 슬래싱 사고 같은 케이스에서 운영자가 stETH holder 에 보상해야 함.</li>
          <li><strong>Inactivity leak (다른 메커니즘)</strong> — 슬래싱은 아니지만 finality 잃은 동안 검증자 잔고가 quadratic 으로 줄어듦. 4 epoch 이상 finality 안 나면 자동 발동, 비활성 검증자만 페널티. 25% 가 동시 다운되면 며칠 내 그들의 잔고가 0 에 수렴해 강제 exit — 살아있는 검증자가 다시 2/3 에 도달하면 리커버.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-10. 실제 슬래싱 사고 케이스</h3>
        <ul className="leading-7">
          <li><strong>Staked.us (2023.03)</strong> — 인프라 마이그레이션 중 같은 키가 새/구 인스턴스 동시 활성. 75 검증자 슬래시 (~75 ETH 손실). 교훈: <code>doppelganger detection</code> 항상 켤 것, 마이그레이션 전 옛 인스턴스 완전 종료 확인.</li>
          <li><strong>Coinbase 슬래싱 사건</strong> — 인프라 변경 직후 attestation surround 발생. 적은 수지만 고객 신뢰 측면에서 컸다. 후속: PR 이 자동으로 protection DB 를 검증하도록 CI 게이트 추가.</li>
          <li><strong>RockX (2022.12)</strong> — 인터넷 라우팅 사고로 두 데이터센터가 서로 안 보이는 split-brain → 양쪽이 서로 죽었다고 판단 → 둘 다 attestation. 38 검증자 슬래시. 교훈: 액티브-스탠바이는 split-brain 검출 메커니즘(witness 노드 또는 외부 의존성)을 같이 두자.</li>
          <li><strong>Lido NodeOperator 사고 (수차례)</strong> — Lido 의 운영자 풀 중 하나가 슬래시 → DAO 가 손실 보전, 운영자는 신뢰 점수 강등, 키 회수. 교훈: 다중 운영자 풀 구조에선 평판이 직접 자본화 됨 — 운영자는 슬래싱 보험 가입.</li>
          <li><strong>Prysm 0.3.x 합의 버그 (2022)</strong> — Prysm 단일 클라이언트가 만든 잘못된 chain 에 vote 한 검증자들이 일시적 위험. finalize 안 된 시점에 사용자 인지 → 패치 → 회복. 교훈: 클라이언트 한 개 점유율 임계 넘지 않게 분산.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-11. 한국 인프라에서의 추가 고려사항</h3>
        <ul className="leading-7">
          <li><strong>지연(latency) 영향</strong> — 한국에서 글로벌 mesh 까지 RTT 가 미국 동부 ~150 ms, 유럽 ~200 ms. attestation inclusion delay 에 직접 반영 — peer 선택 시 지리적으로 가까운 KR/JP/SG 노드 비중 늘리기.</li>
          <li><strong>peer 다양성</strong> — <code>--target-peers</code> 를 70+ 로, <code>discv5</code> 가 자연스럽게 좋은 peer 를 잡지만 모니터링으로 확인. 같은 ASN 에 peer 몰리면 ISP 사고 시 동시 단절.</li>
          <li><strong>국내 회선 SLA</strong> — KT/SKB 비즈니스 회선의 보장 가용성과 트래픽 캡 확인. 백업 회선은 다른 ISP 로(KT + LG U+ 같이).</li>
          <li><strong>한국 가상자산 사업자(VASP) 등록 영향</strong> — 한국 거래소·수탁사가 검증자 운영하면 트래블룰, 자금세탁방지(FATF), 가상자산이용자보호법 적용. OFAC 같은 외부 제재 정책과 별도로 국내 법적 의무가 추가됨.</li>
          <li><strong>스테이블코인 운영자라면</strong> — 가상자산이용자보호법 + 향후 스테이블코인 관련 법안에서 발행자/수탁자가 인프라 가용성·보안에 대해 입증 책임. 운영 로그·감사 trail 보존 의무가 검증자 운영 기록에까지 미칠 가능성.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-12. 사고 발생 시 30 분 행동 플레이북</h3>
        <ol className="leading-7">
          <li><strong>0~2 분</strong> — 페이지 받음. 알람 메시지에서 영향 검증자 수, 사고 유형(missed attestation · double vote · 노드 다운) 확인. 이 단계에서 절대 수동으로 노드 재시작 금지 — 슬래싱 위험 가중.</li>
          <li><strong>2~5 분</strong> — 외부 검증: beaconcha.in 에서 영향 검증자 status 확인. 같은 시기 글로벌 사고인지(eth-r&d Discord, 다른 운영자 알람) 빠르게 체크.</li>
          <li><strong>5~15 분</strong> — 사고 유형별 분기. (a) 노드 다운: standby 로 페일오버 절차 시작 — 옛 인스턴스 완전 종료 확인 후 새 인스턴스 시작. (b) double vote 의심: 즉시 모든 인스턴스 정지, 슬래싱 DB 진단, 살아 있는 인스턴스 한 개만 재개. (c) 합의 버그 의심: 다른 클라이언트로 페일오버 (사전 준비된 standby 페어).</li>
          <li><strong>15~30 분</strong> — 회복 검증. attestation 정상 발생 확인, peer 정상 회복, 효율 점수 회복 추세 확인. 사고 카운터(검증자 수 × 시간) 기록.</li>
          <li><strong>사고 후 24 시간 내</strong> — 포스트모템 작성. 5 why · 시간선 · 변경 사항 · 다음 액션. 같은 사고 못 일어나게 시스템 변경.</li>
        </ol>
      </div>
    </section>
  );
}
