import { motion } from 'framer-motion';

export default function LatentWalkSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">MNIST 2D 잠재 공간</text>
          {/* 좌표축 */}
          <line x1={100} y1={140} x2={400} y2={140} stroke="var(--border)" strokeWidth={0.8} />
          <line x1={100} y1={30} x2={100} y2={140} stroke="var(--border)" strokeWidth={0.8} />
          <text x={405} y={143} fontSize={8} fill="var(--muted-foreground)">z₁</text>
          <text x={96} y={28} fontSize={8} fill="var(--muted-foreground)">z₂</text>
          {/* 클러스터 */}
          {[
            { cx: 180, cy: 120, r: 16, label: '0', color: '#6366f1' },
            { cx: 320, cy: 50, r: 14, label: '1', color: '#3b82f6' },
            { cx: 150, cy: 70, r: 15, label: '3', color: '#10b981' },
            { cx: 260, cy: 90, r: 14, label: '5', color: '#f59e0b' },
            { cx: 220, cy: 55, r: 16, label: '7', color: '#ef4444' },
            { cx: 340, cy: 100, r: 13, label: '9', color: '#8b5cf6' },
            { cx: 290, cy: 70, r: 12, label: '4', color: '#ec4899' },
            { cx: 160, cy: 110, r: 11, label: '6', color: '#14b8a6' },
            { cx: 350, cy: 130, r: 13, label: '8', color: '#a855f7' },
            { cx: 230, cy: 130, r: 12, label: '2', color: '#f97316' },
          ].map((d) => (
            <g key={d.label}>
              <circle cx={d.cx} cy={d.cy} r={d.r} fill={`${d.color}12`} stroke={d.color} strokeWidth={0.5} />
              <text x={d.cx} y={d.cy + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={d.color}>{d.label}</text>
            </g>
          ))}
          {/* 원점 표시 */}
          <circle cx={250} cy={85} r={3} fill="var(--foreground)" />
          <text x={250} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">원점</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Latent Walk: 3 → 7 보간</text>
          {/* 시작점 */}
          <circle cx={80} cy={80} r={16} fill="#10b98118" stroke="#10b981" strokeWidth={1.2} />
          <text x={80} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">3</text>
          <text x={80} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[1.5, 0.5]</text>
          {/* 보간 경로 */}
          <line x1={96} y1={80} x2={364} y2={80} stroke="#6366f1" strokeWidth={1} strokeDasharray="4 2" />
          {/* 중간 단계 */}
          {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
            const cx = 80 + (380 - 80) * t;
            const labels = ['3', '2', '7', '7'];
            const opacity = 0.4 + t * 0.4;
            return (
              <g key={i}>
                <circle cx={cx} cy={80} r={10} fill="#6366f112" stroke="#6366f1" strokeWidth={0.6} />
                <text x={cx} y={84} textAnchor="middle" fontSize={9} fill="#6366f1" opacity={opacity}>{labels[i]}</text>
                <text x={cx} y={65} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">t={t}</text>
              </g>
            );
          })}
          {/* 끝점 */}
          <circle cx={380} cy={80} r={16} fill="#ef444418" stroke="#ef4444" strokeWidth={1.2} />
          <text x={380} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">7</text>
          <text x={380} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[-0.5, -1.5]</text>
          {/* 공식 */}
          <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            z = (1−t)·z_start + t·z_end,  t ∈ [0, 1]
          </text>
          <text x={240} y={148} textAnchor="middle" fontSize={9} fill="#10b981">부드러운 형태 변환 — 중간에도 유효한 숫자</text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">VAE 실무 응용</text>
          {/* 4개 응용 */}
          {[
            { x: 20, color: '#ef4444', title: '이상 탐지', sub: 'recon error\n= anomaly score' },
            { x: 140, color: '#3b82f6', title: '압축', sub: '고차원→저차원\nSD: 8배 압축' },
            { x: 260, color: '#10b981', title: '스타일 전환', sub: '콘텐츠 + 스타일\nlatent 결합' },
            { x: 370, color: '#f59e0b', title: '데이터 증강', sub: 'latent 섭동\n→ 유사 샘플' },
          ].map((d) => (
            <g key={d.title}>
              <rect x={d.x} y={35} width={100} height={80} rx={8} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <rect x={d.x} y={35} width={100} height={5} rx={2.5} fill={d.color} opacity={0.85} />
              <text x={d.x + 50} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={d.color}>{d.title}</text>
              {d.sub.split('\n').map((line, i) => (
                <text key={i} x={d.x + 50} y={74 + i * 12} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{line}</text>
              ))}
            </g>
          ))}
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            잠재 공간의 연속성이 모든 응용의 기반
          </text>
        </motion.g>
      )}
    </g>
  );
}
