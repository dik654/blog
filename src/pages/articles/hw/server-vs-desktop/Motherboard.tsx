import IpmiBmcViz from './viz/IpmiBmcViz';

const features = [
  { feat: '듀얼 / 쿼드 소켓', desc: 'CPU 2+ 개 → PCIe / 메모리 채널 두 배', desktop: '단일 소켓만' },
  { feat: 'IPMI / BMC', desc: '전원 OFF 에도 원격 콘솔 · BIOS · 펌웨어 업데이트', desktop: '없음 (S0 idle 만)' },
  { feat: '핫스왑 베이', desc: 'NVMe / SAS 디스크 운영 중 교체', desktop: '없음 (재부팅 필요)' },
  { feat: 'PCIe 슬롯 밀도', desc: '4U 기준 8~16 슬롯 (PLX 스위치)', desktop: 'ATX 4~5 슬롯' },
  { feat: 'PSU redundancy', desc: '1+1 또는 2+2 구성', desktop: '단일 PSU' },
  { feat: '폼 팩터', desc: '1U/2U/4U 랙 · SSI EEB', desktop: 'ATX / mATX / ITX' },
];

export default function Motherboard() {
  return (
    <section id="motherboard" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메인보드: 듀얼 소켓 · IPMI · PCIe 밀도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 메인보드의 핵심 차이는 <strong>원격 관리 (BMC) · 듀얼 소켓 · PCIe 슬롯 밀도</strong>의 셋이다.
          <br />
          데이터센터에서 수백 대를 운영하려면 사람이 직접 가지 않고도 모든 작업을 처리할 수 있어야 한다 — 이것이 BMC 의 본질이다.
        </p>
      </div>

      <IpmiBmcViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-6 mb-3">기능 비교</h3>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['기능', '서버 메인보드', '데스크톱'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.feat}>
                  <td className="border border-border px-3 py-2 font-medium">{f.feat}</td>
                  <td className="border border-border px-3 py-2">{f.desc}</td>
                  <td className="border border-border px-3 py-2">{f.desktop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">듀얼 소켓의 효과</h3>
        <ul className="leading-7">
          <li><strong>자원 두 배</strong> — 코어 192 → 384, 메모리 6 TB → 12 TB, PCIe 128 → 256 lane.</li>
          <li><strong>NUMA</strong> — Non-Uniform Memory Access. 다른 소켓 메모리는 cross-socket interconnect (Intel UPI · AMD Infinity Fabric) 경유 → latency ↑.</li>
          <li><strong>NUMA-aware 워크로드</strong> — DB · 메모리 heavy 앱은 한 소켓에 묶기 (<code>numactl</code>). NUMA-unaware (JVM · Node.js) 는 단일 소켓이 단순.</li>
          <li><strong>Quad 소켓</strong> — Intel SGI UV · HPE Superdome. 10 TB+ 메모리, in-memory DB / SAP HANA 같은 특화 워크로드.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">PCIe 슬롯 밀도와 PLX 스위치</h3>
        <ul className="leading-7">
          <li><strong>PLX (PCIe switch)</strong> — 1 lane 을 여러 device 에 분배. 약간의 latency 추가지만 슬롯 8+ 가능.</li>
          <li><strong>4U GPU 서버</strong> — 8~10 GPU 슬롯 (Supermicro AS-4125GS-TNRT 같은 모델).</li>
          <li><strong>1U/2U</strong> — 2~4 슬롯. 컴퓨트 밀도 우선 (CPU + RAM heavy).</li>
          <li><strong>riser 카드</strong> — 슬롯 방향을 90° 꺾어 1U 에 PCIe 카드 장착. 폼팩터 절약.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">비용 차이</h3>
        <ul className="leading-7">
          <li><strong>데스크톱 메인보드</strong> — $150 ~ $700.</li>
          <li><strong>서버 메인보드</strong> — $600 ~ $3,000+. 안정성 프리미엄 + 엔터프라이즈 지원 + 긴 보증.</li>
          <li><strong>BMC 가 가격의 큰 비중</strong> — 별도 칩 + 펌웨어 + 보안 검증.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">BMC 보안 함정</h3>
        <ul className="leading-7">
          <li><strong>BMC 기본 비밀번호</strong> — 출고 시 admin/admin. 인터넷 노출 즉시 침해.</li>
          <li><strong>네트워크 격리</strong> — BMC 전용 management VLAN. production 네트워크와 분리.</li>
          <li><strong>펌웨어 업데이트</strong> — BMC 자체에 RCE CVE 가 다수 (Supermicro · iLO). 정기 업데이트 필수.</li>
          <li><strong>Redfish API</strong> — 옛 IPMI 대신. 인증 강화 + REST 표준.</li>
        </ul>
      </div>
    </section>
  );
}
