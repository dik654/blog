import { motion } from 'framer-motion';

export default function DeterministicVsProbSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="#6366f1">AE: 결정론적 매핑</text>
          {/* AE 흐름 */}
          <rect x={40} y={30} width={50} height={26} rx={4} fill="#6366f110" stroke="#6366f1" strokeWidth={0.8} />
          <text x={65} y={47} textAnchor="middle" fontSize={9} fill="#6366f1">x</text>
          <line x1={90} y1={43} x2={120} y2={43} stroke="#6366f1" strokeWidth={1} />
          <text x={105} y={38} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Encoder</text>
          <circle cx={140} cy={43} r={6} fill="#6366f120" stroke="#6366f1" strokeWidth={1.5} />
          <text x={140} y={46} textAnchor="middle" fontSize={8} fontWeight={700} fill="#6366f1">z</text>
          <text x={140} y={62} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">단일 점</text>

          {/* 잠재 공간 시각화 (점들 + 구멍) */}
          <rect x={180} y={26} width={120} height={80} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={40} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">AE 잠재 공간</text>
          {/* 흩어진 점들 */}
          {[[200, 55], [220, 70], [210, 85], [250, 50], [260, 75], [280, 60], [270, 90]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={2.5} fill="#6366f1" opacity={0.6} />
          ))}
          {/* 구멍 영역 */}
          <circle cx={235} cy={70} r={12} fill="none" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={235} y={73} textAnchor="middle" fontSize={7} fill="#ef4444">구멍</text>

          {/* 경고 */}
          <rect x={320} y={40} width={140} height={50} rx={6} fill="#ef444408" stroke="#ef4444" strokeWidth={0.6} strokeDasharray="4 3" />
          <text x={390} y={58} textAnchor="middle" fontSize={9} fill="#ef4444">구멍에서 샘플링</text>
          <text x={390} y={72} textAnchor="middle" fontSize={9} fill="#ef4444">→ 쓰레기 이미지</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">VAE: 확률적 매핑</text>
          {/* VAE 흐름 */}
          <rect x={20} y={30} width={40} height={26} rx={4} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={40} y={47} textAnchor="middle" fontSize={9} fill="#10b981">x</text>
          <line x1={60} y1={43} x2={78} y2={38} stroke="#10b981" strokeWidth={0.8} />
          <line x1={60} y1={43} x2={78} y2={50} stroke="#10b981" strokeWidth={0.8} />
          <rect x={78} y={28} width={30} height={16} rx={8} fill="#10b98118" stroke="#10b981" strokeWidth={0.8} />
          <text x={93} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981">μ</text>
          <rect x={78} y={48} width={30} height={16} rx={8} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
          <text x={93} y={60} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">σ²</text>
          {/* 가우시안 분포 그림 */}
          <circle cx={140} cy={43} r={12} fill="#10b98115" stroke="#10b981" strokeWidth={1.2} />
          <circle cx={140} cy={43} r={6} fill="#10b98130" stroke="#10b981" strokeWidth={0.8} />
          <text x={140} y={46} textAnchor="middle" fontSize={7} fontWeight={600} fill="#10b981">z</text>
          <text x={140} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">~N(μ,σ²)</text>

          {/* 잠재 공간 시각화 (연속 분포) */}
          <rect x={180} y={26} width={120} height={80} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={40} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">VAE 잠재 공간</text>
          {/* 연속 분포 (동심원) */}
          <circle cx={240} cy={72} r={30} fill="#10b98108" stroke="#10b981" strokeWidth={0.3} />
          <circle cx={240} cy={72} r={20} fill="#10b98112" stroke="#10b981" strokeWidth={0.3} />
          <circle cx={240} cy={72} r={10} fill="#10b98120" stroke="#10b981" strokeWidth={0.5} />
          <text x={240} y={75} textAnchor="middle" fontSize={7} fill="#10b981">연속</text>

          {/* 결과 */}
          <rect x={320} y={40} width={140} height={50} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={390} y={58} textAnchor="middle" fontSize={9} fill="#10b981">어디서든 샘플링</text>
          <text x={390} y={72} textAnchor="middle" fontSize={9} fill="#10b981">→ 유의미한 이미지</text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">MNIST 잠재 공간 비교</text>
          {/* AE 잠재 공간 */}
          <rect x={20} y={26} width={200} height={90} rx={6} fill="var(--card)" stroke="#6366f1" strokeWidth={0.8} />
          <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">AE: 분리된 섬</text>
          {/* 클러스터들 (분리) */}
          {[
            { cx: 50, cy: 60, label: '0' }, { cx: 80, cy: 55, label: '1' },
            { cx: 110, cy: 80, label: '3' }, { cx: 140, cy: 65, label: '5' },
            { cx: 170, cy: 90, label: '7' }, { cx: 190, cy: 55, label: '9' },
          ].map((d) => (
            <g key={d.label}>
              <circle cx={d.cx} cy={d.cy} r={8} fill="#6366f112" stroke="#6366f1" strokeWidth={0.5} />
              <text x={d.cx} y={d.cy + 3} textAnchor="middle" fontSize={7} fill="#6366f1">{d.label}</text>
            </g>
          ))}
          {/* 보간 실패 */}
          <line x1={80} y1={55} x2={140} y2={65} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={110} y={53} textAnchor="middle" fontSize={7} fill="#ef4444">보간 실패</text>

          {/* VAE 잠재 공간 */}
          <rect x={240} y={26} width={220} height={90} rx={6} fill="var(--card)" stroke="#10b981" strokeWidth={0.8} />
          <text x={350} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">VAE: 연속 분포</text>
          {/* 겹치는 클러스터 */}
          {[
            { cx: 290, cy: 70, label: '0' }, { cx: 310, cy: 60, label: '1' },
            { cx: 330, cy: 80, label: '3' }, { cx: 350, cy: 65, label: '5' },
            { cx: 370, cy: 75, label: '7' }, { cx: 390, cy: 60, label: '9' },
          ].map((d) => (
            <g key={d.label}>
              <circle cx={d.cx} cy={d.cy} r={12} fill="#10b98108" stroke="#10b981" strokeWidth={0.3} />
              <text x={d.cx} y={d.cy + 3} textAnchor="middle" fontSize={7} fill="#10b981">{d.label}</text>
            </g>
          ))}
          {/* 보간 성공 */}
          <line x1={310} y1={60} x2={370} y2={75} stroke="#10b981" strokeWidth={1} />
          <text x={340} y={55} textAnchor="middle" fontSize={7} fill="#10b981">부드러운 보간</text>

          <text x={240} y={136} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            z_mix = (1−t)·z_A + t·z_B, t ∈ [0, 1]
          </text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">잠재 공간 산술</text>
          {/* 산술 연산 */}
          <rect x={30} y={30} width={90} height={40} rx={6} fill="#ec489910" stroke="#ec4899" strokeWidth={0.8} />
          <text x={75} y={48} textAnchor="middle" fontSize={9} fill="#ec4899">여성+웃음</text>
          <text x={75} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">z₁</text>

          <text x={135} y={55} textAnchor="middle" fontSize={14} fill="var(--foreground)">−</text>

          <rect x={150} y={30} width={70} height={40} rx={6} fill="#ec489910" stroke="#ec4899" strokeWidth={0.8} />
          <text x={185} y={48} textAnchor="middle" fontSize={9} fill="#ec4899">여성</text>
          <text x={185} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">z₂</text>

          <text x={235} y={55} textAnchor="middle" fontSize={14} fill="var(--foreground)">+</text>

          <rect x={250} y={30} width={70} height={40} rx={6} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={285} y={48} textAnchor="middle" fontSize={9} fill="#3b82f6">남성</text>
          <text x={285} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">z₃</text>

          <text x={335} y={55} textAnchor="middle" fontSize={14} fill="var(--foreground)">=</text>

          <rect x={350} y={30} width={100} height={40} rx={6} fill="#10b98112" stroke="#10b981" strokeWidth={1.2} />
          <text x={400} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">남성+웃음</text>
          <text x={400} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">z₁−z₂+z₃</text>

          {/* 비교 */}
          <rect x={80} y={90} width={140} height={28} rx={4} fill="#10b98110" stroke="#10b981" strokeWidth={0.6} />
          <text x={150} y={108} textAnchor="middle" fontSize={9} fill="#10b981">VAE: 가능 (의미적 방향)</text>
          <rect x={260} y={90} width={140} height={28} rx={4} fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} strokeDasharray="4 3" />
          <text x={330} y={108} textAnchor="middle" fontSize={9} fill="#ef4444">AE: 불가능 (구조 없음)</text>
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">KL 정규화 → 잠재 공간의 의미적 구조 형성</text>
        </motion.g>
      )}
    </g>
  );
}
