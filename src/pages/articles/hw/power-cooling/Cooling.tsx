import { motion } from 'framer-motion';

const methods = [
  { method: '블로워', dir: '전→후 직선 배기', pros: '서버 랙 에어플로 호환', cons: '소음 큼, 냉각 효율 보통' },
  { method: '오픈에어', dir: '히트싱크 + 팬 사방 확산', pros: '냉각 효율 높음, 저소음', cons: '서버 랙 부적합 (주변 과열)' },
  { method: 'AIO 수냉', dir: '라디에이터로 열 이동', pros: '고밀도 구성 가능', cons: '펌프 고장 위험, 유지보수' },
  { method: '커스텀 수냉', dir: '서버용 CoolIT/Asetek', pros: '최고 냉각 성능', cons: '높은 비용, 전문 설치 필요' },
];

export default function Cooling() {
  return (
    <section id="cooling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">냉각: 블로워 vs 오픈에어 vs 수냉</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          냉각 방식 선택은 서버 환경에서 가장 중요한 설계 결정입니다.<br />
          블로워는 랙 에어플로에 맞고, 오픈에어는 데스크톱 전용입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['냉각 방식', '열 방향', '장점', '단점'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <motion.tr key={m.method} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{m.method}</td>
                  <td className="border border-border px-3 py-2">{m.dir}</td>
                  <td className="border border-border px-3 py-2">{m.pros}</td>
                  <td className="border border-border px-3 py-2">{m.cons}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Air Cooling</h3>
        <ul className="leading-7">
          <li><strong>Blower (서버 랙)</strong> — axial fan, single direction. front intake, rear exhaust. 표준 rack airflow 호환. 고 RPM (10K+) 시끄럽다. A100, H100 SXM, 서버 GPU 에 사용.</li>
          <li><strong>Open-air (컨슈머)</strong> — 다수 fan, radial. 주변 공기 가열, 개방 공간 필요. 단일 GPU 에는 더 조용하고 효과적. RTX 4090, 5090.</li>
          <li><strong>Tower Cooler (CPU)</strong> — heatpipe + fin + fan. CPU 효과적, 대형 폼팩터. 150~250W 발산.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Water Cooling</h3>
        <ul className="leading-7">
          <li><strong>AIO (All-in-One)</strong> — 펌프 + radiator 통합. 설치 쉽고 중간 성능. 360mm radiator ≈ ~400W GPU. 펌프 고장 위험.</li>
          <li><strong>Custom Loop</strong> — waterblock + reservoir + 펌프. 다수 컴포넌트 냉각, air 대체 최고 성능. 설치 복잡, 유지보수 필요.</li>
          <li><strong>Direct-to-Chip (DTC)</strong> — CPU/GPU 위 water cold plate. 40~60°C coolant. 엔터프라이즈 등급. CoolIT, Asetek, NVIDIA MGX. H100 표준 냉각.</li>
          <li><strong>Rear Door Heat Exchanger</strong> — rack 뒷문에 water-cooled door. passive cooling, 50~100 kW/rack. rack 변경 최소.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Immersion Cooling</h3>
        <ul className="leading-7">
          <li><strong>Single-phase</strong> — 절연 유체 (mineral oil) 에 서버 전체 침지. 자연 대류, 조용하고 효율적.</li>
          <li><strong>Two-phase</strong> — fluorocarbon 이 CPU 에서 끓음 (상변화 냉각). 최고 효율, 복잡하고 비싸다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 비교</h3>
        <ul className="leading-7">
          <li>Air — 최대 30 kW/rack</li>
          <li>Water DTC — 100 kW/rack</li>
          <li>Immersion — 200+ kW/rack</li>
          <li>미래 — 500+ kW/rack</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Filecoin SP 일반 구성</h3>
        <ul className="leading-7">
          <li>air-cooled 4U 서버</li>
          <li>hot/cold aisle containment</li>
          <li>CRAC 유닛</li>
          <li>10~20 kW/rack</li>
          <li>표준 데이터센터로 충분</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">AI/HPC (H100, B200)</h3>
        <ul className="leading-7">
          <li>direct-to-chip water 필수</li>
          <li>50~100 kW/rack</li>
          <li>특수 설비 필요</li>
          <li>비용 상승</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">냉각 비용 경제학</h3>
        <ul className="leading-7">
          <li>Air — $2K~$3K/year per kW</li>
          <li>Water — $1K~$1.5K/year per kW</li>
          <li>Immersion — $0.5K~$1K/year per kW</li>
          <li>5년 누적으로 절감 amortize</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">열 재활용</h3>
        <p className="leading-7">
          water cooling → district heating 으로 활용. server farm + greenhouse 결합. Nordic 데이터센터 사례. 지속가능성 이점.
        </p>
        <p className="leading-7">
          냉각: <strong>air (30 kW/rack) → water (100 kW/rack) → immersion (200+ kW/rack)</strong>.<br />
          Filecoin SP: air + hot/cold aisle 충분.<br />
          AI training: direct-to-chip water 필수 (H100/B200).
        </p>
      </div>
    </section>
  );
}
