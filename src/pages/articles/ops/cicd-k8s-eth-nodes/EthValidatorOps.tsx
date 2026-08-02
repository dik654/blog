import EthNodeJwtViz from './viz/EthNodeJwtViz';

export default function EthValidatorOps() {
  return (
    <section id="eth-nodes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3. 이더리움 노드 운영 — EL · CL · Validator 분리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          The Merge 이후 이더리움 노드는 <strong>3 개의 독립 프로세스</strong>로 산다.
          <br />
          이 분리를 이해하지 못하면 운영 결정의 절반이 안 풀린다.
        </p>
      </div>
      <EthNodeJwtViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">3-1. 세 컴포넌트와 Engine API</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">컴포넌트</th>
              <th className="text-left py-2">역할</th>
              <th className="text-left py-2">대표 클라이언트</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2"><strong>Execution Layer (EL)</strong></td><td>EVM 실행, txpool, 상태 DB, JSON-RPC</td><td>Geth, Reth, Nethermind, Erigon, Besu</td></tr>
            <tr className="border-b"><td className="py-2"><strong>Consensus Layer (CL)</strong></td><td>비콘 체인, 포크 선택, attestation 집계</td><td>Prysm, Lighthouse, Teku, Nimbus, Lodestar</td></tr>
            <tr className="border-b"><td className="py-2"><strong>Validator Client (VC)</strong></td><td>BLS 서명(블록 제안 · 증명), 슬래싱 보호 DB</td><td>각 CL 의 부속 또는 독립 (Vouch 등)</td></tr>
          </tbody>
        </table>
        <p className="leading-7 mt-3">
          EL ↔ CL 사이는 <strong>Engine API</strong>(JWT 인증된 JSON-RPC) 로 통신한다.
          <br />
          CL 이 새 헤드를 받으면 <code>engine_newPayloadV*</code> 로 EL 에 실행 위임, <code>engine_forkchoiceUpdatedV*</code> 로 카논 헤드를 갱신.
          <br />
          블록 제안 차례면 CL 이 <code>engine_getPayloadV*</code> 로 EL 에 페이로드 빌드를 시키거나, MEV-Boost 를 통해 외부 빌더 블록을 받는다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-2. 노드 종류와 디스크 요구치 (2026 기준 근사)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">유형</th>
              <th className="text-left py-2">디스크</th>
              <th className="text-left py-2">용도</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2">Full Node (Snap sync)</td><td>~1.5 TB NVMe</td><td>최근 상태 + 헤더 전체. RPC, 검증자 백엔드</td></tr>
            <tr className="border-b"><td className="py-2">Archive Node</td><td>15+ TB (Geth) / 3~4 TB (Erigon)</td><td>모든 과거 상태 트라이. 인덱서, 분석</td></tr>
            <tr className="border-b"><td className="py-2">Light Client (Helios)</td><td>수백 MB</td><td>Sync Committee BLS 검증. 모바일/브라우저</td></tr>
          </tbody>
        </table>
        <p className="leading-7 mt-3">
          Erigon 의 staged sync + flat state 는 archive 를 4 TB 대로 줄이는 대신 RPC 호환성 일부를 trade.
          <br />
          Reth 도 archive 가 비교적 컴팩트(스태틱 파일 + MDBX). 디스크 비용이 절약되지만, history expiry(EIP-4444) 도입 로드맵을 따라가야 함.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-3. 하드웨어 권장</h3>
        <ul className="leading-7">
          <li><strong>CPU</strong> — 8 코어 이상, 단일 코어 성능이 중요(EVM 실행은 단일 스레드 비중 큼). AMD Ryzen 7900X / Intel i7-13700 급.</li>
          <li><strong>RAM</strong> — Full 32 GB, Archive 64 GB+. CL 만 따로 두면 16 GB 도 가능.</li>
          <li><strong>SSD</strong> — <strong>NVMe 필수</strong>. SATA SSD 는 attestation 마감을 못 맞춰 inclusion delay 가 늘어남. 4 KB random read IOPS 100k+ 권장. PLP(전원 손실 보호) 있는 엔터프라이즈급(Samsung PM9A3, Intel D7) 추천.</li>
          <li><strong>네트워크</strong> — 25 Mbps 이상 대칭, 월 트래픽 수 TB 여유. 데이터 캡 있는 회선은 금물.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-4. 동기화 모드</h3>
        <ul className="leading-7">
          <li><strong>Snap sync (EL 기본)</strong> — 헤더 다운로드 → 최근 상태 트라이 스냅샷 받음 → 그 이후만 실행. 수 시간 ~ 하루.</li>
          <li><strong>Full sync</strong> — 제네시스부터 모든 블록 재실행. 수 일 ~ 주.</li>
          <li><strong>Checkpoint sync (CL)</strong> — 신뢰 가능한 체크포인트 URL 에서 최근 finalized 상태 받고 시작. 비콘 체인 기본.</li>
          <li><strong>운영 팁</strong> — checkpoint sync 의 trust 는 약한 약속이라 동기화 후 백필(backfill)을 끝까지 돌려 자체 검증 데이터로 대체.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-5. MEV-Boost — 검증자 블록 제안의 외주</h3>
        <p className="leading-7">
          검증자가 블록 제안 슬롯을 받으면 두 가지 선택지가 있다.
          <br />
          (a) 내 EL 이 빌드한 페이로드 — 단순, MEV 수익 적음.
          <br />
          (b) MEV-Boost relay 를 통해 외부 빌더 블록 — 입찰가가 가장 높은 헤더 받음, payload reveal 시점에야 본문 확인.
        </p>
        <ul className="leading-7">
          <li><strong>multi-relay</strong> — Flashbots, bloXroute, Agnostic 등 여러 릴레이 동시 연결. 한 릴레이가 실패해도 다른 곳에서 받게.</li>
          <li><strong>fallback to local</strong> — 모든 릴레이가 timeout 이면 로컬 페이로드로 떨어진다. <code>min_bid</code> 를 너무 높이면 missed proposal 위험.</li>
          <li><strong>regulatory exposure</strong> — OFAC 필터링하는 릴레이만 쓰면 검열 검증자가 됨. 다양성 정책에 따라 censorship-resistant 릴레이 포함 검토.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-6. 검증자 키 종류 — 분리가 곧 안전</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">키</th>
              <th className="text-left py-2">서명 대상</th>
              <th className="text-left py-2">분실 / 탈취 영향</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2">Validator (signing) key (BLS)</td><td>블록 제안, attestation</td><td>슬래싱 가능 — 자산 일부 손실</td></tr>
            <tr className="border-b"><td className="py-2">Withdrawal credentials (BLS or 0x01)</td><td>출금 권한</td><td>스테이킹된 32 ETH 전체 가져갈 수 있음</td></tr>
            <tr className="border-b"><td className="py-2">Fee recipient address</td><td>실행 보상 받을 주소</td><td>설정 실수 시 보상이 엉뚱한 주소로 영구 유실</td></tr>
          </tbody>
        </table>
        <p className="leading-7 mt-3">
          Withdrawal credential 은 <code>0x01</code>(EL 주소형)로 설정해 콜드 월렛에 분리 보관.
          <br />
          Fee recipient 은 별도 핫월렛, validator 키는 HSM 또는 원격 서명자(Web3Signer)로.
          <br />
          서명 키와 출금 키를 같은 시드에서 파생시키되 <strong>저장 위치만큼은 절대 같이 두지 않는다</strong>.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-7. 클라이언트별 실전 커맨드라인</h3>
        <p className="leading-7">
          포지션 면접에서 &quot;실제 운영해 봤나&quot;를 가르는 가장 빠른 신호는 명령어와 플래그를 손으로 외우고 있느냐다.
        </p>
        <ul className="leading-7">
          <li><strong>Reth (EL)</strong> — <code>reth node --chain mainnet --datadir /data/reth --http --http.api eth,net,web3 --authrpc.jwtsecret /secrets/jwt.hex --metrics 0.0.0.0:9001 --full</code>. 추가로 <code>--prune.history.prune-mode distance:128</code> 같은 프루닝 정책. archive 면 <code>--prune.history.prune-mode disabled</code>.</li>
          <li><strong>Geth (EL)</strong> — <code>geth --syncmode snap --state.scheme path --datadir /data/geth --authrpc.jwtsecret /secrets/jwt.hex --metrics --pprof</code>. <code>--state.scheme path</code> 는 새 path-based DB(2024+ 권장) — hash-based 보다 디스크 30~40% 절약.</li>
          <li><strong>Lighthouse (CL)</strong> — <code>lighthouse bn --network mainnet --datadir /data/lh --execution-endpoint http://el:8551 --execution-jwt /secrets/jwt.hex --checkpoint-sync-url https://mainnet-checkpoint.publicnode.com --metrics --validator-monitor-auto</code>.</li>
          <li><strong>Prysm (CL)</strong> — <code>beacon-chain --datadir=/data/prysm --execution-endpoint=http://el:8551 --jwt-secret=/secrets/jwt.hex --checkpoint-sync-url=... --accept-terms-of-use --p2p-max-peers=70 --monitoring-host=0.0.0.0</code>.</li>
          <li><strong>Validator (Lighthouse 예)</strong> — <code>lighthouse vc --network mainnet --beacon-nodes http://bn1:5052,http://bn2:5052 --suggested-fee-recipient 0x... --builder-proposals --doppelganger-protection --metrics</code>. <code>--beacon-nodes</code> 다중 지정으로 BN failover, <code>--doppelganger-protection</code> 으로 더블 시작 방지.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-8. JWT · Engine API 설정 — 흔한 에러와 해결</h3>
        <p className="leading-7">
          EL ↔ CL 는 32 byte hex JWT secret 으로 인증. 양쪽이 같은 파일을 가리켜야 통신.
        </p>
        <ul className="leading-7">
          <li><strong>JWT 생성</strong> — <code>openssl rand -hex 32 &gt; /secrets/jwt.hex</code>. 파일 권한 0600, EL/CL 프로세스 사용자만 읽기.</li>
          <li><strong>증상: &quot;jwt token expired&quot; / &quot;jwt issuer mismatch&quot;</strong> — 노드 시계 어긋남. <code>chrony</code> 또는 <code>systemd-timesyncd</code> 항상 켬. 1 초 이상 어긋나면 거부.</li>
          <li><strong>증상: &quot;Engine API: connection refused&quot;</strong> — EL 의 <code>--authrpc.port 8551</code> 이 listening 인지, CL 의 <code>--execution-endpoint</code> 가 정확한 host:port 인지. 포트 8545(JSON-RPC) 와 8551(Engine API) 혼동이 가장 흔함.</li>
          <li><strong>증상: &quot;invalid forkchoice&quot;</strong> — EL 이 sync 안 끝났거나, EL/CL 의 fork 버전이 다름. <code>geth attach</code>로 <code>eth.syncing</code>, CL <code>/eth/v1/node/syncing</code>. EL 먼저 fully synced 만든 뒤 CL 재기동.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-9. 검증자 라이프사이클 — 입금 → 활성 → 출금</h3>
        <ol className="leading-7">
          <li><strong>키 생성</strong> — <code>staking-deposit-cli</code> 로 mnemonic 만들고 validator + withdrawal 키 페어 생성. <code>--eth1_withdrawal_address 0x...</code> 로 처음부터 0x01 자격증명 박는 게 표준.</li>
          <li><strong>32 ETH deposit</strong> — Beacon Deposit Contract(<code>0x00000000219ab540356cBB839Cbe05303d7705Fa</code>)에 <code>deposit_data.json</code> 으로 입금. 가스 비싼 시간 피하라.</li>
          <li><strong>Activation queue</strong> — 큐 길이에 따라 수 시간~수 일 대기. <code>beaconcha.in</code> 에서 status 추적.</li>
          <li><strong>Active 운영</strong> — 슬롯마다 attestation, ~매월 한 번 블록 제안 차례. 효율 99%+ 유지가 목표.</li>
          <li><strong>Voluntary exit</strong> — <code>lighthouse account validator exit</code> 또는 <code>prysmctl validator exit</code>. exit queue 진입(현재 ~2 일), exit 후 약 27 시간 동안 출금 불가.</li>
          <li><strong>Withdrawal</strong> — 0x01 자격증명이면 자동 출금(스윕 사이클로 며칠 내 도착). 0x00 인 옛 키는 <code>BLSToExecutionChange</code> 로 먼저 변환해야 출금 가능.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-10. 0x00 → 0x01 마이그레이션 — Capella 이후 필수</h3>
        <p className="leading-7">
          2026 년 현재 대부분 검증자가 0x01(EL 주소) 자격증명이지만, 2023 이전 셋업은 0x00(BLS) 으로 남아 있다.
          <br />
          0x00 은 출금 불가 — Capella 업그레이드 후 BLS-to-Execution-Change 로 한 번 변환 필요.
        </p>
        <ul className="leading-7">
          <li><strong>변환 도구</strong> — <code>staking-deposit-cli generate-bls-to-execution-change</code>. mnemonic + 출금 받을 EL 주소 입력.</li>
          <li><strong>실수 패턴</strong> — 변환 트랜잭션을 잘못된 EL 주소로 박으면 영구 잠김. 멀티시그 주소(GnosisSafe)로 받을 거면 그 주소가 같은 체인에 배포돼 있는지 먼저 확인.</li>
          <li><strong>일괄 처리</strong> — 검증자 수백 개면 한 트랜잭션에 여러 BLS-to-Execution-Change 묶기 가능. RPC 부하 고려해 분할.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-11. EIP-4844 블롭(blob) 운영 — Dencun 이후 디스크 부담</h3>
        <p className="leading-7">
          Dencun 업그레이드(2024 년 3월)로 블록당 최대 6 개 블롭(각 128 KB). L2 가 calldata 대신 blob 으로 데이터 가용성을 받으면서 비콘 노드 디스크 부담이 새로 생겼다.
        </p>
        <ul className="leading-7">
          <li><strong>블롭 보관 기간</strong> — 사양상 ~18 일(4096 epochs)만 가지고 폐기. 그 후엔 KZG 약속만 보존.</li>
          <li><strong>디스크 영향</strong> — 평균 3 blobs/block × 12s × 18d ≈ 50 GB. 피크에선 더 큼. CL 디스크 여유 100 GB+ 확보.</li>
          <li><strong>블롭 프루닝</strong> — Lighthouse <code>--prune-blobs</code>(기본 켬), Prysm <code>--blob-retention-epochs</code>. 풀 archive 가 필요한 인덱서 운영자만 retain.</li>
          <li><strong>blob 미배달 검증자 영향</strong> — 블록 제안 시 blob sidecar 까지 같이 배달해야 valid. MEV-Boost 도 blob 지원 relay 만 사용. 안 그러면 missed proposal.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-12. 실전 사고 시나리오 — 실제로 자주 만나는 것들</h3>
        <ul className="leading-7">
          <li><strong>EL 디스크 80% 도달</strong> — 알람. 즉시 옵션: (a) 디스크 확장(EBS expand · 신 NVMe 추가), (b) re-sync 새 디스크로 cutover. 절대 하지 말 것: <code>rm -rf</code> 로 옛 chaindata 삭제. <code>--prune</code> 옵션을 켰다가 끄는 식의 토글은 일부 클라이언트에서 corrupt 유발.</li>
          <li><strong>CL 이 attestation 놓치기 시작</strong> — peer count 점검(&lt; 20 = 페이지). 이어서 EL 이 syncing 인지 확인. JWT 인증 실패 로그 grep. 위 셋이 OK 면 네트워크 reorg 또는 long range fork 가능 — fork-choice 로그 확인.</li>
          <li><strong>ISP 정전 / 회선 끊김</strong> — standby 노드로 페일오버. 절대 액티브-액티브 금지. validator 가 다른 site 로 가기 전 슬래싱 보호 DB(<code>slashing_protection.json</code>) export → import 의 순. doppelganger detection 으로 첫 2~3 epoch 안 서명.</li>
          <li><strong>EL 크래시 + DB corrupt</strong> — Geth/Reth 가 unclean shutdown 후 시작 거부. 옵션: (a) 야간 LVM/ZFS 스냅샷에서 복구(시간 잠깐), (b) snap re-sync(수 시간), (c) checkpoint sync 로 fast-recover. 어느 쪽이든 CL 은 EL 회복 동안 그대로 두면 자동 재인증.</li>
          <li><strong>네트워크 reorg 7+ 블록</strong> — 정상 운영에서 거의 없음. 보고서: <code>fork choice</code> 로그 + <code>head_slot</code> 점프. 같은 시기 다른 운영자도 겪는지 Discord (Eth R&D) 에서 공감대 확인.</li>
          <li><strong>OFAC 필터 릴레이만 쓰다 검열 검증자 표시됨</strong> — <code>relays.censorship-resistant</code> 추가, mevwatch.info 에서 자기 점유율 확인. 정책 결정은 운영자/스테이킹 풀 거버넌스에 따라.</li>
          <li><strong>Validator 효율 95% 미만 지속</strong> — 위치(거리·지연) 문제, 디스크 IOPS, peer 품질, MEV-Boost 라우팅 중 어느 것 — rated.network 에서 비교. 보통 NVMe 교체 또는 BN 다중 연결로 해결.</li>
        </ul>
      </div>
    </section>
  );
}
