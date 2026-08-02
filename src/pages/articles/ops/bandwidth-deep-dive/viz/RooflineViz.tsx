/**
 * Roofline model — compute peak vs memory bandwidth ceiling.
 * Operational Intensity (FLOPs/byte) 가 한계 결정.
 */
export default function RooflineViz() {
  const W = 720;
  const H = 380;
  const padL = 70;
  const padR = 30;
  const padT = 50;
  const padB = 60;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // log scale
  const xMin = 0.1, xMax = 1000;
  const yMin = 1, yMax = 2000;
  const logX = (v: number) => padL + (Math.log10(v) - Math.log10(xMin)) / (Math.log10(xMax) - Math.log10(xMin)) * plotW;
  const logY = (v: number) => padT + plotH - (Math.log10(v) - Math.log10(yMin)) / (Math.log10(yMax) - Math.log10(yMin)) * plotH;

  // H100 example: peak compute 989 TFLOPS (FP16), memory bw 3.35 TB/s
  const peakCompute = 989;
  const bw = 3350; // GB/s
  // ridge point = peakCompute / bw (FLOPs/byte)
  const ridge = peakCompute * 1000 / bw; // ~295

  // 워크로드 점들
  const workloads = [
    { name: 'LLM decode\n(memory bound)', oi: 1, color: '#ef4444' },
    { name: 'GEMM small batch', oi: 10, color: '#f59e0b' },
    { name: 'GEMM batch=32', oi: 100, color: '#10b981' },
    { name: 'GEMM 큰 batch\n(compute bound)', oi: 500, color: '#3b82f6' },
    { name: 'Attention\nflash-attn', oi: 50, color: '#8b5cf6' },
  ];

  // memory ceiling line (compute = OI * bw)
  // y = oi * bw / 1000 (TFLOPS)
  const ceilingPts = [];
  for (let oi = xMin; oi <= ridge; oi *= 1.2) {
    ceilingPts.push(`${logX(oi)},${logY(Math.min(peakCompute, oi * bw / 1000))}`);
  }
  ceilingPts.push(`${logX(ridge)},${logY(peakCompute)}`);
  ceilingPts.push(`${logX(xMax)},${logY(peakCompute)}`);

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Roofline Model — H100 (peak 989 TFLOPS · BW 3.35 TB/s)</text>

        {/* axes */}
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="var(--muted-foreground)" strokeWidth={0.8} />
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="var(--muted-foreground)" strokeWidth={0.8} />

        {/* x labels */}
        {[0.1, 1, 10, 100, 1000].map((v) => (
          <g key={`x-${v}`}>
            <line x1={logX(v)} y1={padT + plotH} x2={logX(v)} y2={padT + plotH + 3} stroke="var(--muted-foreground)" strokeWidth={0.5} />
            <text x={logX(v)} y={padT + plotH + 16} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}
        <text x={padL + plotW / 2} y={padT + plotH + 38} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
          Operational Intensity (FLOPs / byte) — log scale
        </text>

        {/* y labels */}
        {[1, 10, 100, 1000].map((v) => (
          <g key={`y-${v}`}>
            <line x1={padL - 3} y1={logY(v)} x2={padL} y2={logY(v)} stroke="var(--muted-foreground)" strokeWidth={0.5} />
            <text x={padL - 6} y={logY(v) + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}
        <text x={20} y={padT + plotH / 2} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)" transform={`rotate(-90 20 ${padT + plotH / 2})`}>
          달성 TFLOPS — log scale
        </text>

        {/* roofline */}
        <polyline points={ceilingPts.join(' ')}
          fill="none" stroke="#3b82f6" strokeWidth={2} />

        {/* compute ceiling label */}
        <text x={logX(ridge) - 10} y={logY(peakCompute) - 10} textAnchor="end" fontSize={9} fontWeight={700} fill="#3b82f6">
          compute ceiling 989 TFLOPS
        </text>

        {/* memory bound region */}
        <rect x={padL} y={padT} width={logX(ridge) - padL} height={plotH}
          fill="#ef4444" fillOpacity={0.05} />
        <text x={(padL + logX(ridge)) / 2} y={padT + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          MEMORY BOUND
        </text>
        <text x={(padL + logX(ridge)) / 2} y={padT + 32} textAnchor="middle" fontSize={9} fill="#ef4444">
          bandwidth 가 한계
        </text>

        {/* compute bound region */}
        <rect x={logX(ridge)} y={padT} width={padL + plotW - logX(ridge)} height={plotH}
          fill="#3b82f6" fillOpacity={0.05} />
        <text x={(logX(ridge) + padL + plotW) / 2} y={padT + 54} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          COMPUTE BOUND
        </text>
        <text x={(logX(ridge) + padL + plotW) / 2} y={padT + 68} textAnchor="middle" fontSize={9} fill="#3b82f6">
          tensor core 가 한계
        </text>

        {/* ridge point */}
        <circle cx={logX(ridge)} cy={logY(peakCompute)} r={4} fill="#f59e0b" stroke="#fff" strokeWidth={1.4} />
        <text x={logX(ridge) + 8} y={logY(peakCompute) + 17} fontSize={9} fontWeight={700} fill="#f59e0b">
          ridge point OI ≈ {Math.round(ridge)}
        </text>

        {/* 워크로드 점 */}
        {workloads.map((w) => {
          const achievedTflops = Math.min(peakCompute, w.oi * bw / 1000);
          const labelOffset = w.oi > ridge ? 72 : 4;
          return (
            <g key={w.name}>
              <circle cx={logX(w.oi)} cy={logY(achievedTflops)} r={5}
                fill={w.color} fillOpacity={0.7} stroke="#fff" strokeWidth={1.2} />
              {w.name.split('\n').map((line, i) => (
                <text key={i} x={logX(w.oi) + 8} y={logY(achievedTflops) + labelOffset + i * 11}
                  fontSize={8.5} fill={w.color} fontWeight={600}>{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
