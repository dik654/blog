/**
 * PCIe lanes — Desktop 24 vs EPYC 128 시각화.
 * 각 device 별 lane 점유로 multi-GPU/NVMe 의 한계 명확.
 */
export default function PcieLanesViz() {
  const W = 720;
  const H = 380;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">PCIe Lanes — Desktop 24 lane vs Server 128 lane</text>

        {/* Desktop */}
        <g>
          <rect x={20} y={50} width={330} height={310} rx={8}
            fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={1.4} />
          <text x={185} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">Desktop (Ryzen 9950X · LGA 1700)</text>
          <text x={185} y={84} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">총 24 PCIe 5.0 lane</text>

          {/* CPU 박스 */}
          <rect x={140} y={100} width={90} height={36} rx={4}
            fill="#f59e0b" fillOpacity={0.25} stroke="#f59e0b" strokeWidth={1.2} />
          <text x={185} y={123} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">CPU</text>

          {/* Devices */}
          {/* GPU 1 */}
          <line x1={185} y1={136} x2={75} y2={170} stroke="#f59e0b" strokeWidth={1.4} />
          <rect x={35} y={170} width={80} height={32} rx={3}
            fill="#f59e0b" fillOpacity={0.18} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={75} y={186} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">GPU 1</text>
          <text x={75} y={197} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">x16 (16 lane)</text>

          {/* NVMe 1 */}
          <line x1={185} y1={136} x2={185} y2={170} stroke="#f59e0b" strokeWidth={1.4} />
          <rect x={145} y={170} width={80} height={32} rx={3}
            fill="#f59e0b" fillOpacity={0.18} stroke="#f59e0b" strokeWidth={0.8} />
          <text x={185} y={186} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">NVMe 1</text>
          <text x={185} y={197} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">x4 (4 lane)</text>

          {/* NVMe 2 (chipset 공유) */}
          <line x1={185} y1={136} x2={295} y2={170} stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" />
          <rect x={255} y={170} width={80} height={32} rx={3}
            fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={0.6} strokeDasharray="2 2" />
          <text x={295} y={186} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">NVMe 2</text>
          <text x={295} y={197} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">chipset 공유</text>

          {/* 사용 lane bar */}
          <text x={40} y={235} fontSize={9} fill="var(--muted-foreground)">사용 lane (24 중 20)</text>
          <rect x={40} y={245} width={290} height={18} rx={3} fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={0.4} />
          {/* GPU = 16/24 */}
          <rect x={40} y={245} width={193} height={18} rx={3} fill="#f59e0b" fillOpacity={0.55} />
          {/* NVMe = 4/24 */}
          <rect x={233} y={245} width={48} height={18} rx={0} fill="#f59e0b" fillOpacity={0.35} />
          <text x={185} y={258} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">GPU x16 + NVMe x4 = full</text>

          <text x={185} y={290} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#ef4444">⚠ multi-GPU 시 두 GPU 가 x8/x8 로 분할</text>
          <text x={185} y={306} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">3+ GPU 불가 · NVMe 늘리면 GPU bandwidth ↓</text>
          <text x={185} y={325} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">메모리 2 channel · 최대 192 GB DDR5</text>
          <text x={185} y={342} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">Filecoin sealing · 다중 GPU AI 부적합</text>
        </g>

        {/* Server */}
        <g>
          <rect x={370} y={50} width={330} height={310} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.4} />
          <text x={535} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">Server (EPYC 9654 · SP5)</text>
          <text x={535} y={84} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">총 128 PCIe 5.0 lane</text>

          {/* CPU */}
          <rect x={490} y={100} width={90} height={36} rx={4}
            fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={1.2} />
          <text x={535} y={123} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">CPU</text>

          {/* 8 GPU */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const x = 388 + (i % 4) * 75;
            const y = 162 + Math.floor(i / 4) * 38;
            return (
              <g key={i}>
                <line x1={535} y1={136} x2={x + 30} y2={y} stroke="#10b981" strokeWidth={0.8} opacity={0.4} />
                <rect x={x} y={y} width={60} height={26} rx={3}
                  fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={0.6} />
                <text x={x + 30} y={y + 13} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">GPU {i + 1}</text>
                <text x={x + 30} y={y + 22} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">x16</text>
              </g>
            );
          })}

          {/* lane bar */}
          <text x={388} y={262} fontSize={9} fill="var(--muted-foreground)">사용 lane (128 중 128)</text>
          <rect x={388} y={272} width={294} height={18} rx={3} fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={0.4} />
          <rect x={388} y={272} width={294} height={18} rx={3} fill="#10b981" fillOpacity={0.55} />
          <text x={535} y={285} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">8 × GPU x16 = 128 lane</text>

          <text x={535} y={310} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#10b981">✓ 8 GPU full bandwidth + NVMe 별도</text>
          <text x={535} y={326} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">메모리 12 channel · 최대 6 TB DDR5</text>
          <text x={535} y={342} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">검증자 · sealing · multi-GPU 학습 표준</text>
        </g>
      </svg>
    </div>
  );
}
