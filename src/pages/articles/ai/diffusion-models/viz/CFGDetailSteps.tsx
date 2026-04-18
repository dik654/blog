import { motion } from 'framer-motion';

export default function CFGDetailSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Classifier-Free Guidance</text>
          {/* 훈련 */}
          <rect x={20} y={26} width={200} height={40} rx={6} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={120} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">훈련</text>
          <text x={120} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">10% 확률로 조건 드롭</text>
          {/* 추론 */}
          <rect x={240} y={26} width={220} height={40} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={350} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">추론</text>
          <text x={350} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">조건부 + 무조건부 혼합</text>
          {/* 공식 */}
          <rect x={30} y={76} width={420} height={36} rx={8} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.2} />
          <text x={240} y={98} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
            ε&#770; = ε_uncond + w · (ε_cond − ε_uncond)
          </text>
          {/* 직관 */}
          <rect x={60} y={122} width={170} height={24} rx={4} fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.6} />
          <text x={145} y={138} textAnchor="middle" fontSize={8} fill="#f59e0b">ε_cond − ε_uncond = 조건 방향</text>
          <rect x={250} y={122} width={170} height={24} rx={4} fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.6} />
          <text x={335} y={138} textAnchor="middle" fontSize={8} fill="#8b5cf6">w만큼 그 방향으로 증폭</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Guidance Scale 효과</text>
          {/* 스케일 바 */}
          <line x1={40} y1={50} x2={440} y2={50} stroke="var(--border)" strokeWidth={1} />
          {[
            { x: 60, w: '0', label: '무조건부', color: '#6366f1' },
            { x: 140, w: '1', label: '표준 조건부', color: '#3b82f6' },
            { x: 260, w: '7.5', label: 'SD 기본값', color: '#10b981' },
            { x: 360, w: '15', label: '과포화', color: '#ef4444' },
          ].map((d) => (
            <g key={d.w}>
              <circle cx={d.x} cy={50} r={5} fill={d.color} />
              <text x={d.x} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>w={d.w}</text>
              <text x={d.x} y={68} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{d.label}</text>
            </g>
          ))}
          {/* 트레이드오프 */}
          <rect x={40} y={82} width={180} height={36} rx={6} fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.6} />
          <text x={130} y={98} textAnchor="middle" fontSize={9} fill="#3b82f6">w 낮음</text>
          <text x={130} y={112} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">다양성 ↑ 충실도 ↓</text>
          <rect x={260} y={82} width={180} height={36} rx={6} fill="#ef444408" stroke="#ef4444" strokeWidth={0.6} />
          <text x={350} y={98} textAnchor="middle" fontSize={9} fill="#ef4444">w 높음</text>
          <text x={350} y={112} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">충실도 ↑ 다양성 ↓</text>
          {/* 실무 */}
          <text x={240} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            Anime: w=9~12 | Photo: w=5~7 | 비용: 매 스텝 UNet 2회
          </text>
        </motion.g>
      )}
    </g>
  );
}
