import { motion } from 'framer-motion';

const specs = [
  { attr: '크기', val: '2.5인치 (15mm 두께)' },
  { attr: '인터페이스', val: 'PCIe 4.0 x4 (U.2 커넥터, SFF-8639)' },
  { attr: '최대 순차 읽기', val: '~7 GB/s' },
  { attr: '전력', val: '~15-25W' },
  { attr: '내구성', val: '3+ DWPD (엔터프라이즈)' },
  { attr: '핫스왑', val: '서버 백플레인 지원' },
];

export default function U2() {
  return (
    <section id="u2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">U.2: 서버/엔터프라이즈 (핫스왑, 전력)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          U.2는 2.5인치 금속 케이스로 열 분산이 뛰어나고 핫스왑을 지원합니다.<br />
          엔터프라이즈 등급(3+ DWPD)으로 봉인 같은 연속 쓰기 워크로드에 적합합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">U.2</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <motion.tr key={s.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{s.attr}</td>
                  <td className="border border-border px-3 py-2">{s.val}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">물리 스펙</h3>
        <ul className="leading-7">
          <li>2.5 인치 금속 enclosure</li>
          <li>15mm 두께 (HDD 7mm 대비)</li>
          <li>SFF-8639 커넥터</li>
          <li>PCIe 4 lane</li>
          <li>hot-swap 가능</li>
          <li>서버 chassis 전면 접근</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">M.2 대비 장점</h3>
        <ul className="leading-7">
          <li>더 나은 열 관리 (금속 enclosure)</li>
          <li>hot-swap 가능</li>
          <li>더 높은 전력 예산 (25W) → 더 빠른 NAND 구동</li>
          <li>지속 성능 + thermal throttling 없음</li>
          <li>엔터프라이즈 내구성</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">서버 통합</h3>
        <ul className="leading-7">
          <li>SFF-8639 백플레인</li>
          <li>tool-less 트레이</li>
          <li>indicator LED</li>
          <li>RAID 컨트롤러</li>
          <li>2U chassis 에 24~36 드라이브</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">엔터프라이즈 기능</h3>
        <ul className="leading-7">
          <li>Power Loss Protection (PLP)</li>
          <li>Multi-namespace 지원</li>
          <li>NVMe-MI 관리</li>
          <li>end-to-end 데이터 보호</li>
          <li>높은 DWPD (3~10)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">PLP 동작</h3>
        <p className="leading-7">
          보드 위 커패시터로 ~50ms 전력 예비. 정전 발생 시 write cache 를 NAND 로 flush 해 데이터 손실 방지. DB / 파일시스템에 결정적.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2024 인기 모델</h3>
        <ul className="leading-7">
          <li>Samsung PM9A3 U.2 — $250/TB</li>
          <li>Intel D7-P5520 — $280/TB</li>
          <li>Kioxia CD8-V — $300/TB</li>
          <li>Micron 9400 MAX — $400/TB (고 DWPD)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">용량</h3>
        <ul className="leading-7">
          <li>960 GB, 1.92 TB, 3.84 TB, 7.68 TB</li>
          <li>15.36 TB</li>
          <li>30.72 TB (고밀도)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">용도</h3>
        <ul className="leading-7">
          <li>서버 스토리지, DB 서버</li>
          <li>Filecoin sealing</li>
          <li>가상화, 스토리지 어레이</li>
          <li>고 IOPS 워크로드</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능</h3>
        <p className="leading-7">
          엔터프라이즈 M.2 와 유사한 7 GB/s 순차 + 1.5M IOPS random. 단, <strong>지속 성능</strong>이 다릅니다 — thermal throttling 없음, 100% duty cycle 가능.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Filecoin SP 시나리오</h3>
        <p className="leading-7">
          PC1 sealing — 64-core CPU 가 sector 당 ~352 GiB 생성, NVMe cache 로 쓰기. 지속 1~2 GB/s 필요. U.2 가 여유 있게 처리, 높은 DWPD 로 수년간 유지.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">M.2 대비 단점</h3>
        <ul className="leading-7">
          <li>더 비싸다 ($250~$400/TB)</li>
          <li>U.2 백플레인 필요</li>
          <li>대부분 데스크톱 미지원</li>
          <li>물리 footprint 큼</li>
          <li>25W 전력 사용</li>
        </ul>
        <p className="leading-7">
          U.2: <strong>2.5-inch, 25W, hot-swap, 3-10 DWPD</strong>.<br />
          Power Loss Protection (PLP capacitors) 내장.<br />
          $250-400/TB, Filecoin SP 표준, 100% duty cycle.
        </p>
      </div>
    </section>
  );
}
