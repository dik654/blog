import PcieLanesViz from './viz/PcieLanesViz';

const cpuSpecs = [
  { attr: '소켓', server: 'LGA 4710 (Xeon 6) / SP5 (EPYC)', desktop: 'LGA 1700 / AM5' },
  { attr: '최대 코어', server: '128 P-core (Granite) / 192 (EPYC Turin)', desktop: '24 (i9) / 16 (Ryzen 9)' },
  { attr: 'PCIe lane', server: '96 (Xeon) / 128 (EPYC)', desktop: '20~24' },
  { attr: '메모리 채널', server: '12', desktop: '2' },
  { attr: '최대 메모리', server: '6 TB', desktop: '192 GB' },
  { attr: 'ECC', server: '필수 (RDIMM)', desktop: '제한적 (Ryzen PRO)' },
  { attr: 'TDP', server: '350~500W', desktop: '65~253W' },
];

export default function CPU() {
  return (
    <section id="cpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CPU: Xeon/EPYC vs Core/Ryzen</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 CPU 의 본질 차이는 <strong>PCIe lane 수 + 메모리 채널 수 + ECC</strong> 의 셋이다.
          <br />
          데스크톱은 게이밍 / 단일 GPU 워크스테이션에 최적화돼 lane 이 부족 — multi-GPU 또는 대량 NVMe 가 필요한 워크로드에는 부적합.
        </p>
      </div>

      <PcieLanesViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-6 mb-3">스펙 비교 (2024~2025 기준)</h3>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', '서버 (Xeon 6 / EPYC Turin)', '데스크톱 (i9 14900K / Ryzen 9950X)'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cpuSpecs.map((r) => (
                <tr key={r.attr}>
                  <td className="border border-border px-3 py-2 font-medium">{r.attr}</td>
                  <td className="border border-border px-3 py-2">{r.server}</td>
                  <td className="border border-border px-3 py-2">{r.desktop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 PCIe lane 이 결정적인가</h3>
        <ul className="leading-7">
          <li><strong>device 별 lane 점유</strong> — GPU x16, NVMe x4, 100G NIC x16. 한 번 연결되면 다른 device 는 줄여야 함.</li>
          <li><strong>데스크톱 24 lane 의 의미</strong> — GPU x16 + NVMe x4 가 끝. 둘째 GPU 추가하면 첫 GPU 가 x8 로 떨어짐.</li>
          <li><strong>서버 128 lane 의 의미</strong> — 8 GPU x16 동시 + NVMe 풀 + 다중 NIC. multi-GPU 학습의 표준.</li>
          <li><strong>chipset 우회</strong> — 데스크톱은 chipset 을 통해 추가 device 연결 가능하지만 chipset uplink 가 병목 (DMI x8 정도).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 채널의 의미</h3>
        <ul className="leading-7">
          <li><strong>데스크톱 2 채널</strong> — 약 90 GB/s bandwidth. 최대 192 GB.</li>
          <li><strong>서버 12 채널</strong> — 400+ GB/s bandwidth. 최대 6 TB.</li>
          <li><strong>워크로드 영향</strong> — Filecoin sealing PC1 의 메모리 bandwidth 의존. AI 학습의 host RAM 도 큼. RPC 노드의 cache.</li>
          <li><strong>NUMA</strong> — 듀얼 소켓 서버는 memory locality 인지 필수. <code>numactl</code> 로 워크로드 묶기.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">워크로드별 CPU 선택</h3>
        <ul className="leading-7">
          <li><strong>게이밍 / 일반 개발</strong> — 데스크톱 충분. 단일 코어 boost clock 이 핵심.</li>
          <li><strong>단일 GPU AI 실험</strong> — 데스크톱 OK. RTX 4090 + Ryzen 9950X.</li>
          <li><strong>multi-GPU 워크스테이션 / 학습</strong> — 서버 CPU 의무 (lane).</li>
          <li><strong>Filecoin SP (PC1 워커)</strong> — EPYC 64+ core. 단일 코어 + many-core 둘 다 필요.</li>
          <li><strong>K8s 워커 / RPC 호스트</strong> — EPYC Bergamo (128 core) 또는 Sierra Forest (288 E-core). 코어 밀도 우위.</li>
          <li><strong>이더리움 EL</strong> — 단일 코어 boost 가 핵심. 작은 EPYC 또는 high-clock Xeon.</li>
        </ul>
      </div>
    </section>
  );
}
