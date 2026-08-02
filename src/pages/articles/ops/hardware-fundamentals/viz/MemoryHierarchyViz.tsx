/**
 * 메모리 계층 — DDR5 · HBM3 · HBM3e · HBF · GDDR · 그리고 SSD/HDD.
 */
export default function MemoryHierarchyViz() {
  const W = 720;
  const H = 380;

  const layers = [
    { name: 'L1/L2 Cache', sub: 'CPU/GPU 내부 SRAM · ns 단위', size: '수백 KB ~ 수 MB', bw: '수 TB/s', cost: '극고가', color: '#ef4444' },
    { name: 'L3 Cache', sub: 'CPU 패키지 내 · 3D V-Cache 가능', size: '~수백 MB', bw: '수백 GB/s', cost: '고가', color: '#f59e0b' },
    { name: 'HBM3 / HBM3e', sub: 'GPU 다이 옆 stack · 1024-bit 인터페이스', size: '80~192 GB/GPU', bw: '3~8 TB/s', cost: 'GPU 가격의 큰 비중', color: '#8b5cf6' },
    { name: 'GDDR6X / GDDR7', sub: '컨슈머 GPU 의 외부 메모리', size: '24~32 GB', bw: '1~1.8 TB/s', cost: '중', color: '#3b82f6' },
    { name: 'DDR5 / MRDIMM', sub: '시스템 메모리 (CPU 채널)', size: '수십 GB ~ TB 급', bw: '100~700 GB/s', cost: '저~중', color: '#10b981' },
    { name: 'HBF (High Bandwidth Flash)', sub: 'NAND 기반 + HBM 인터페이스 (실험)', size: 'TB 급 / GPU', bw: '~수백 GB/s', cost: '미정 (개발 중)', color: '#06b6d4' },
    { name: 'NVMe SSD', sub: '영속 저장소 · PCIe 5.0 x4', size: 'TB 급', bw: '14 GB/s', cost: '저', color: '#94a3b8' },
    { name: 'HDD', sub: 'cold 보관 · CMR / SMR / HAMR', size: '~20+ TB', bw: '~250 MB/s', cost: '극저', color: '#475569' },
  ];

  const itemH = 36;
  const yStart = 50;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">메모리 계층 — 빠를수록 작고 비싸다 (HBM 의 위치)</text>

        {layers.map((l, i) => {
          const y = yStart + i * (itemH + 2);
          // bandwidth 시각화 — width 비례
          return (
            <g key={l.name}>
              <rect x={20} y={y} width={680} height={itemH} rx={4}
                fill={l.color} fillOpacity={0.07} stroke={l.color} strokeWidth={0.8} />
              <text x={32} y={y + 14} fontSize={10} fontWeight={700} fill={l.color}>{l.name}</text>
              <text x={32} y={y + 28} fontSize={8.5} fill="var(--muted-foreground)">{l.sub}</text>
              {/* 우측 spec */}
              <text x={400} y={y + 14} fontSize={9} fill="var(--muted-foreground)">크기:</text>
              <text x={460} y={y + 14} fontSize={9} fontWeight={600} fill={l.color}>{l.size}</text>
              <text x={400} y={y + 28} fontSize={9} fill="var(--muted-foreground)">대역폭:</text>
              <text x={460} y={y + 28} fontSize={9} fontWeight={600} fill={l.color}>{l.bw}</text>
              <text x={620} y={y + 21} fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">{l.cost}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
