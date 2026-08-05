import WindowPostViz from './viz/WindowPostViz';

export default function PostAndIncidents() {
  return (
    <section id="post-incidents" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3. 증명 (PoSt) 운영과 실전 사고 시나리오</h2>
      <WindowPostViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Sealing 이 끝난 sector 는 영구히 두 종류의 증명을 만들어야 한다.
          <br />
          (1) <strong>WinningPoSt</strong> — block election 당첨 시 즉시 (~30 초 내) 만드는 증명. 못 만들면 블록 손실 (보상 손실).
          <br />
          (2) <strong>WindowPoSt</strong> — 24 시간 마다 모든 sector 의 활성 증명. 못 만들면 fault penalty (sector 별 잔고 일부 burn).
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-1. WinningPoSt — 실시간성 게이트</h3>
        <ul className="leading-7">
          <li><strong>트리거</strong> — 매 epoch (30 초) 마다 elect — SP 의 storage power 비례 확률. 당첨 시 그 epoch 끝나기 전 블록 + WinningPoSt 제출.</li>
          <li><strong>시간 budget</strong> — ~25 초. 그 안에 sector challenge 응답 (random 한 sector 의 leaf hash) + Groth16 proof.</li>
          <li><strong>자원</strong> — GPU + sealed sector cache (warm SSD) 에서 random read. cache 가 HDD 에 있으면 ~25 초 안에 못 만들고 블록 손실.</li>
          <li><strong>실수 패턴</strong> — sealed sector cache 를 HDD 에만 둠 → random read latency 가 timeout 유발. 반드시 SSD/NVMe 에 cache.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-2. WindowPoSt — 24 시간 마감의 다층 챌린지</h3>
        <ul className="leading-7">
          <li><strong>주기</strong> — 24 시간 / 48 partition (= 30 분 마다 한 partition 의 PoSt 제출).</li>
          <li><strong>partition</strong> — 최대 2349 sector. SP 가 큰 capacity 면 partition 수가 늘어남.</li>
          <li><strong>자원</strong> — 한 partition 의 모든 sector 에 대해 random challenge → cache read → Groth16 proof. GPU + warm SSD heavy.</li>
          <li><strong>마감 위험</strong> — partition 이 마감 안에 못 들어가면 그 partition 전체 fault. 보통 GPU 큐 적체 또는 sealed sector cache 손실이 원인.</li>
          <li><strong>대응</strong> — <code>lotus-miner proving deadlines</code> 로 다음 마감 추적, GPU 풀 SLA 99.9%+ 유지, cache 디스크 RAID 보호.</li>
          <li><strong>fault 시나리오</strong> — sector 한 개가 cache 손실 → recover (cache 재생성) 또는 declare fault (페널티 작음, 추후 복구). silent 방치 = 큰 페널티.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-3. GPU 풀 설계 — sealing + PoSt 공유 vs 분리</h3>
        <ul className="leading-7">
          <li><strong>공유 (소형 SP)</strong> — PC2/C2/PoSt 모두 같은 GPU 풀. 자원 효율 ↑, 단 sealing 폭주 시 PoSt 마감 위험.</li>
          <li><strong>분리 (큰 SP)</strong> — PoSt 전용 GPU 풀. WindowPoSt 마감 보장, 비용 ↑.</li>
          <li><strong>하이브리드</strong> — sealing GPU 풀 + 작은 PoSt 전용 GPU (1~2 개). PoSt 우선순위는 sealing scheduler 가 처리.</li>
          <li><strong>측정</strong> — peak hour (큰 partition + 동시 sealing) 에 GPU 큐 깊이 모니터링. 큐가 평소의 2 배 넘으면 PoSt 위험 신호.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-4. 실전 사고 시나리오</h3>
        <ul className="leading-7">
          <li><strong>Sealing 큐 폭주</strong> — PC1 워커 한 대 다운 → 큐 적체 → PC2/C2 GPU 유휴 → 봉인 throughput ↓. 옵션: standby 워커 즉시 합류, 영업 일시 중단으로 신규 sector 진입 차단.</li>
          <li><strong>SSD 마모 가속</strong> — TBW 추적 미흡 → 한 SSD 가 wear-out → 읽기 에러 → sealing fail. 모니터링 (smartctl wear leveling) + 6 개월 단위 교체 schedule.</li>
          <li><strong>WindowPoSt fault</strong> — 한 partition 의 GPU 처리 실패 → fault penalty. 즉시 진단: GPU 풀 status, sealed cache disk 상태. 다음 partition 이 같은 원인으로 fault 안 나게 GPU 풀 redundancy 확인.</li>
          <li><strong>Sealed sector data 손실</strong> — HDD 풀 다중 fail (RAIDZ2 한계 초과) → 영구 데이터 손실. <code>SectorTerminate</code> 로 chain 알림, 페널티 수용. 재발 방지: scrub 주기 단축 (월 → 격주), 새 디스크 교체 즉각.</li>
          <li><strong>Lotus daemon crash + chainstore corrupt</strong> — 노드 크래시 후 재기동 거부. 옵션: chainstore export/import 로 복구 (수 시간), 또는 snapshot 에서 fresh sync (1~2 일). sealed sector 데이터는 영향 없음 — daemon 만 재구축.</li>
          <li><strong>Filecoin upgrade (network version) 누락</strong> — Lotus 신 버전 안 올림 → 새 network version 부터 chain follow 못 함 → 모든 PoSt fault. 업그레이드 cadence (분기 1 회) 캘린더 의무.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-5. 모니터링 핵심 지표</h3>
        <ul className="leading-7">
          <li><strong>Sealing throughput</strong> — sectors/day. 목표 capacity 늘리려면 이 지표 추적.</li>
          <li><strong>Sealing slot 가용성</strong> — PC1/PC2/C2 워커별 점유율. 한 단계 점유율 100% 면 그게 병목.</li>
          <li><strong>SSD wear (smartctl Percentage Used)</strong> — 80% 도달 전 교체.</li>
          <li><strong>WindowPoSt 성공률</strong> — partition 별 success/fault. 100% 가 목표, 99% 도 운영 위험.</li>
          <li><strong>Storage power</strong> — chain 에 등록된 actual power. 목표 대비 추적.</li>
          <li><strong>Block won vs expected</strong> — block reward 의 실제 vs 확률 기대. 큰 격차면 WinningPoSt 실패 의심.</li>
          <li><strong>Lotus daemon 동기화</strong> — chain head 가 글로벌 head 와 일치하는지. 1 epoch 이상 뒤처지면 page.</li>
        </ul>
      </div>
    </section>
  );
}
