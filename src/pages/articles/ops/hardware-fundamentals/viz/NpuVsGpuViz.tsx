/**
 * GPU vs NPU vs 특화 가속기 — 아키텍처 차이.
 */
export default function NpuVsGpuViz() {
  const W = 720;
  const H = 360;

  const types = [
    {
      name: 'GPU (NVIDIA H100 · AMD MI300X)',
      color: '#76b900',
      x: 20, y: 60, w: 220,
      properties: [
        { k: '용도', v: '범용 병렬 연산' },
        { k: '연산 단위', v: 'CUDA core · Tensor core · SM' },
        { k: '메모리', v: 'HBM3/3e (4-8 TB/s)' },
        { k: '소프트웨어', v: 'CUDA · ROCm · PyTorch' },
        { k: '강점', v: '학습 + 추론 + HPC + graphics' },
        { k: '약점', v: '특화 가속기 대비 효율 ↓' },
      ],
    },
    {
      name: 'NPU (TPU · Trainium · Gaudi)',
      color: '#3b82f6',
      x: 250, y: 60, w: 220,
      properties: [
        { k: '용도', v: 'AI 학습/추론 특화' },
        { k: '연산 단위', v: 'systolic array · matrix unit' },
        { k: '메모리', v: 'HBM + on-chip SRAM' },
        { k: '소프트웨어', v: 'XLA · Neuron SDK · Habana' },
        { k: '강점', v: '같은 워크로드에 GPU 대비 효율' },
        { k: '약점', v: 'graphics 불가, ecosystem 좁음' },
      ],
    },
    {
      name: 'LPU · WSE (Groq · Cerebras)',
      color: '#ec4899',
      x: 480, y: 60, w: 220,
      properties: [
        { k: '용도', v: 'LLM 추론 ultra-low latency' },
        { k: '연산 단위', v: 'deterministic dataflow / wafer' },
        { k: '메모리', v: 'on-chip SRAM only' },
        { k: '소프트웨어', v: '벤더 컴파일러 (자체)' },
        { k: '강점', v: 'token/s 압도적 (10x+)' },
        { k: '약점', v: '학습 어려움, lock-in 높음' },
      ],
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">AI 가속기 3 종 — GPU vs NPU vs 특화 (LPU · WSE)</text>

        {types.map((t) => (
          <g key={t.name}>
            <rect x={t.x} y={t.y} width={t.w} height={250} rx={8}
              fill={t.color} fillOpacity={0.06} stroke={t.color} strokeWidth={1.4} />
            <text x={t.x + t.w / 2} y={t.y + 24} textAnchor="middle" fontSize={11} fontWeight={700} fill={t.color}>{t.name}</text>

            {t.properties.map((p, i) => {
              const y = t.y + 50 + i * 32;
              return (
                <g key={p.k}>
                  <rect x={t.x + 10} y={y} width={t.w - 20} height={28} rx={3}
                    fill={t.color} fillOpacity={0.06} stroke={t.color} strokeWidth={0.4} />
                  <text x={t.x + 18} y={y + 12} fontSize={9} fontWeight={700} fill={t.color}>{p.k}</text>
                  <text x={t.x + 18} y={y + 23} fontSize={9} fill="var(--muted-foreground)">{p.v}</text>
                </g>
              );
            })}
          </g>
        ))}

        <text x={W / 2} y={335} textAnchor="middle" fontSize={9} fontStyle="italic" fill="var(--muted-foreground)">
          선택 기준 — 학습 = GPU, 대규모 추론 = LPU/WSE 검토, 단일 클라우드 락이면 NPU 가성비
        </text>
      </svg>
    </div>
  );
}
