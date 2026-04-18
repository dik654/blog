import { motion } from 'framer-motion';

export default function GANMathSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">최적해 유도 (Goodfellow 2014)</text>
          {/* D* 공식 */}
          <rect x={40} y={24} width={400} height={28} rx={6} fill="#6366f110" stroke="#6366f1" strokeWidth={1} />
          <text x={240} y={43} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">
            D*(x) = p_data(x) / (p_data(x) + p_g(x))
          </text>
          {/* D*를 V에 대입 */}
          <line x1={240} y1={52} x2={240} y2={65} stroke="var(--foreground)" strokeWidth={0.8} />
          <rect x={60} y={65} width={360} height={28} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
          <text x={240} y={84} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
            V(G) = −log(4) + 2 · JSD(p_data ‖ p_g)
          </text>
          {/* JSD 특성 */}
          <rect x={60} y={105} width={170} height={28} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <text x={145} y={123} textAnchor="middle" fontSize={9} fill="#f59e0b">JSD ≥ 0 (항상 비음수)</text>
          <rect x={250} y={105} width={170} height={28} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={335} y={123} textAnchor="middle" fontSize={9} fill="#10b981">JSD = 0 iff p_data = p_g</text>
          <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            전역 최솟값 −log(4) ≈ −1.386 → 완벽한 생성 분포
          </text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">Generator 구조</text>
          {/* 입력 z */}
          <circle cx={40} cy={75} r={14} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
          <text x={40} y={72} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">z</text>
          <text x={40} y={82} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">100d</text>
          {/* 단계 */}
          {[
            { x: 80, w: 60, label: 'Dense', sub: '1024', color: '#10b981' },
            { x: 155, w: 50, label: '4x4', sub: '64ch', color: '#10b981' },
            { x: 220, w: 55, label: '8x8', sub: '32ch', color: '#10b981' },
            { x: 290, w: 60, label: '16x16', sub: '16ch', color: '#10b981' },
            { x: 365, w: 65, label: '32x32', sub: '3ch', color: '#3b82f6' },
          ].map((d, i) => (
            <g key={i}>
              <rect x={d.x} y={55} width={d.w} height={40} rx={4} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <text x={d.x + d.w / 2} y={73} textAnchor="middle" fontSize={8} fontWeight={600} fill={d.color}>{d.label}</text>
              <text x={d.x + d.w / 2} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
              {i < 4 && (
                <line x1={d.x + d.w} y1={75} x2={[155, 220, 290, 365][i]} y2={75} stroke={d.color} strokeWidth={0.6} />
              )}
            </g>
          ))}
          <line x1={54} y1={75} x2={80} y2={75} stroke="#f59e0b" strokeWidth={0.8} />
          {/* 활성화 */}
          <text x={120} y={108} textAnchor="middle" fontSize={8} fill="#10b981">ReLU + BatchNorm</text>
          <text x={240} y={108} textAnchor="middle" fontSize={8} fill="#10b981">ConvTranspose (stride=2)</text>
          <text x={397} y={108} textAnchor="middle" fontSize={8} fill="#3b82f6">tanh</text>
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            랜덤 노이즈 → 점진적 해상도 확대 → 이미지 생성
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">Discriminator 구조</text>
          {/* 입력 이미지 */}
          <rect x={20} y={55} width={60} height={40} rx={4} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={50} y={73} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">32x32</text>
          <text x={50} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">3ch</text>
          {/* 축소 단계 */}
          {[
            { x: 100, w: 55, label: '16x16', sub: '16ch', color: '#ef4444' },
            { x: 170, w: 50, label: '8x8', sub: '32ch', color: '#ef4444' },
            { x: 235, w: 50, label: '4x4', sub: '64ch', color: '#ef4444' },
            { x: 300, w: 60, label: 'Flatten', sub: '1024', color: '#ef4444' },
          ].map((d, i) => (
            <g key={i}>
              <rect x={d.x} y={55} width={d.w} height={40} rx={4} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <text x={d.x + d.w / 2} y={73} textAnchor="middle" fontSize={8} fontWeight={600} fill={d.color}>{d.label}</text>
              <text x={d.x + d.w / 2} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
              {i < 3 && (
                <line x1={d.x + d.w} y1={75} x2={[170, 235, 300][i]} y2={75} stroke={d.color} strokeWidth={0.6} />
              )}
            </g>
          ))}
          <line x1={80} y1={75} x2={100} y2={75} stroke="#ef4444" strokeWidth={0.8} />
          {/* 출력 */}
          <line x1={360} y1={75} x2={390} y2={75} stroke="#ef4444" strokeWidth={0.8} />
          <rect x={390} y={60} width={60} height={30} rx={15} fill="#ef444418" stroke="#ef4444" strokeWidth={1.2} />
          <text x={420} y={79} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">0/1</text>
          {/* 활성화 */}
          <text x={145} y={108} textAnchor="middle" fontSize={8} fill="#ef4444">LeakyReLU(0.2)</text>
          <text x={280} y={108} textAnchor="middle" fontSize={8} fill="#ef4444">Conv (stride=2)</text>
          <text x={420} y={108} textAnchor="middle" fontSize={8} fill="#ef4444">Sigmoid</text>
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            이미지 → 점진적 해상도 축소 → 진짜/가짜 판별
          </text>
        </motion.g>
      )}
    </g>
  );
}
