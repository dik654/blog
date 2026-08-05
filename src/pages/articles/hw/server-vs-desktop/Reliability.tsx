import EccBitFlipViz from './viz/EccBitFlipViz';

const items = [
  { feat: 'ECC RDIMM', why: '1bit 자동 정정, 2bit 검출', risk: '비트 플립 → 학습 weight 손상, 합의 무결성 깨짐' },
  { feat: '이중 PSU (1+1)', why: '한 PSU 죽어도 무중단', risk: '단일 PSU 사고 → 전체 노드 다운, 검증자 missed attestation' },
  { feat: '핫스왑 디스크', why: 'RAID rebuild 온라인 진행', risk: '서비스 중단으로 디스크 교체 → SLA 위반' },
  { feat: 'BMC + iLO/iDRAC', why: '온도 · 전압 · 팬 원격 모니터링, OS 죽어도 접근', risk: '데이터센터 출입 없이 진단 불가' },
  { feat: '이중 네트워크 (LACP)', why: 'NIC 또는 스위치 한쪽 죽어도 연결 유지', risk: '단일 NIC 사고 = 노드 isolation' },
];

const failureRates = [
  { component: 'HDD', annual: '1~3%' },
  { component: 'SSD', annual: '0.5~2%' },
  { component: 'PSU', annual: '1~3%' },
  { component: 'RAM (bit error)', annual: '2~6 / GB / year' },
  { component: '팬', annual: '3~5%' },
  { component: 'CPU', annual: '< 0.1%' },
];

export default function Reliability() {
  return (
    <section id="reliability" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안정성: ECC · 핫스왑 · 이중 전원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 부품의 본질 가치는 안정성이다. 24/7 운영의 모든 fault tolerance는 이 다섯 가지에 기반한다.
        </p>
      </div>

      <EccBitFlipViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-6 mb-3">서버 안정성 5 종</h3>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['기능', '서버 이점', '없을 때 위험'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.feat}>
                  <td className="border border-border px-3 py-2 font-medium">{it.feat}</td>
                  <td className="border border-border px-3 py-2">{it.why}</td>
                  <td className="border border-border px-3 py-2 text-red-600 dark:text-red-400">{it.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실 운영 fault rate (24/7)</h3>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['컴포넌트', '연간 fault'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {failureRates.map((it) => (
                <tr key={it.component}>
                  <td className="border border-border px-3 py-2 font-medium">{it.component}</td>
                  <td className="border border-border px-3 py-2">{it.annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">MTBF 차이</h3>
        <ul className="leading-7">
          <li><strong>컨슈머</strong> — 50,000 ~ 100,000 시간 (~5~11 년).</li>
          <li><strong>엔터프라이즈</strong> — 200,000 ~ 1,000,000 시간 (~22~114 년). 2~10x 개선.</li>
          <li><strong>의미</strong> — 24/7 운영 1 년 = 8,760 시간. 컨슈머 PSU 의 5% 연간 fault → 100 노드 운영하면 매년 5 노드 PSU 교체.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">블록체인 운영의 경제 영향</h3>
        <ul className="leading-7">
          <li><strong>이더리움 검증자</strong> — RAM bit flip → wrong attestation → 슬래싱. ECC 한 줄로 막음.</li>
          <li><strong>Filecoin SP</strong> — PSU fault → 노드 다운 → WindowPoSt missed → fault fee.</li>
          <li><strong>RAID 손실</strong> → sealed sector 손실 → SectorTerminate + 페널티.</li>
          <li><strong>경제 계산</strong> — 단일 PSU $150 vs 이중 PSU $300, 1 회 fault 회피로 회수. 검증자/SP 운영자에게 무조건 이중.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Fault Tolerance 5 계층</h3>
        <ul className="leading-7">
          <li><strong>L1 컴포넌트</strong> — ECC · RAID · CRC.</li>
          <li><strong>L2 시스템</strong> — 이중 PSU · 핫스왑 디스크 · 팬 redundancy.</li>
          <li><strong>L3 네트워크</strong> — 이중 NIC + LACP · 이중 스위치.</li>
          <li><strong>L4 애플리케이션</strong> — 클러스터링 · 페일오버 · DVT (이더리움).</li>
          <li><strong>L5 지리적</strong> — 다중 데이터센터 · multi-region.</li>
        </ul>
      </div>
    </section>
  );
}
