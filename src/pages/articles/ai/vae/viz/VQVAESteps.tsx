import { motion } from 'framer-motion';

export default function VQVAESteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">VQ-VAE: 이산 코드북</text>
          {/* Encoder */}
          <rect x={20} y={40} width={60} height={30} rx={4} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={50} y={59} textAnchor="middle" fontSize={9} fill="#3b82f6">Encoder</text>
          <line x1={80} y1={55} x2={110} y2={55} stroke="#3b82f6" strokeWidth={0.8} />
          {/* z_e 연속 */}
          <circle cx={125} cy={55} r={10} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
          <text x={125} y={58} textAnchor="middle" fontSize={7} fontWeight={600} fill="#10b981">z_e</text>
          <text x={125} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">연속</text>
          {/* Quantization */}
          <line x1={135} y1={55} x2={175} y2={55} stroke="#f59e0b" strokeWidth={0.8} />
          <rect x={175} y={38} width={90} height={34} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
          <text x={220} y={53} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Quantize</text>
          <text x={220} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">argmin ‖z−e‖²</text>
          {/* 코드북 */}
          <rect x={175} y={85} width={90} height={50} rx={6} fill="var(--card)" stroke="#f59e0b" strokeWidth={0.6} />
          <text x={220} y={100} textAnchor="middle" fontSize={8} fill="#f59e0b">코드북</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle cx={190 + i * 14} cy={118} r={5} fill={i === 2 ? '#f59e0b' : '#f59e0b20'} stroke="#f59e0b" strokeWidth={0.5} />
              <text x={190 + i * 14} y={121} textAnchor="middle" fontSize={6} fill={i === 2 ? '#fff' : '#f59e0b'}>e{i}</text>
            </g>
          ))}
          {/* z_q */}
          <line x1={265} y1={55} x2={300} y2={55} stroke="#8b5cf6" strokeWidth={0.8} />
          <circle cx={315} cy={55} r={10} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
          <text x={315} y={58} textAnchor="middle" fontSize={7} fontWeight={600} fill="#8b5cf6">z_q</text>
          <text x={315} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">이산</text>
          {/* Decoder */}
          <line x1={325} y1={55} x2={360} y2={55} stroke="#ec4899" strokeWidth={0.8} />
          <rect x={360} y={40} width={60} height={30} rx={4} fill="#ec489910" stroke="#ec4899" strokeWidth={0.8} />
          <text x={390} y={59} textAnchor="middle" fontSize={9} fill="#ec4899">Decoder</text>
          <line x1={420} y1={55} x2={450} y2={55} stroke="#ec4899" strokeWidth={0.8} />
          <text x={462} y={58} textAnchor="middle" fontSize={9} fill="var(--foreground)">x&#770;</text>
          <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">K=512~8192 코드, d=64차원 — DALL-E의 기반</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Stable Diffusion의 VAE</text>
          {/* 이미지 공간 */}
          <rect x={15} y={35} width={80} height={40} rx={6} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={55} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">이미지</text>
          <text x={55} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">512x512x3</text>
          {/* VAE Encoder */}
          <line x1={95} y1={55} x2={120} y2={55} stroke="#10b981" strokeWidth={1} />
          <rect x={120} y={35} width={70} height={40} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
          <text x={155} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981">VAE Enc</text>
          <text x={155} y={64} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">8x 압축</text>
          {/* Latent */}
          <line x1={190} y1={55} x2={215} y2={55} stroke="#8b5cf6" strokeWidth={1} />
          <rect x={215} y={35} width={65} height={40} rx={6} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1} />
          <text x={247} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill="#8b5cf6">Latent</text>
          <text x={247} y={64} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">64x64x4</text>
          {/* Diffusion */}
          <line x1={280} y1={55} x2={305} y2={55} stroke="#ef4444" strokeWidth={1} />
          <rect x={305} y={35} width={70} height={40} rx={6} fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
          <text x={340} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ef4444">U-Net</text>
          <text x={340} y={64} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Diffusion</text>
          {/* VAE Decoder */}
          <line x1={375} y1={55} x2={395} y2={55} stroke="#10b981" strokeWidth={1} />
          <rect x={395} y={35} width={70} height={40} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
          <text x={430} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981">VAE Dec</text>
          <text x={430} y={64} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">복원</text>
          {/* 압축 비율 */}
          <rect x={100} y={90} width={280} height={28} rx={6} fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.6} />
          <text x={240} y={108} textAnchor="middle" fontSize={9} fill="#8b5cf6">
            786K → 16K 차원 (48배 압축) → 8GB GPU 가능
          </text>
          {/* 버전 */}
          <text x={240} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            SD 1.x (860M) → SDXL (3.5B) → SD3 (MM-DiT) → Cascade
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">VAE 응용 생태계</text>
          {[
            { x: 20, y: 30, color: '#3b82f6', title: '음성', sub: 'WaveNet-VAE' },
            { x: 130, y: 30, color: '#10b981', title: '단백질', sub: 'ESM-VAE' },
            { x: 240, y: 30, color: '#f59e0b', title: '분자', sub: 'JT-VAE' },
            { x: 350, y: 30, color: '#8b5cf6', title: '이상탐지', sub: '산업 품질' },
            { x: 20, y: 80, color: '#ec4899', title: '추천', sub: 'Collab-VAE' },
            { x: 130, y: 80, color: '#ef4444', title: '시계열', sub: 'VRNN' },
            { x: 240, y: 80, color: '#14b8a6', title: '강화학습', sub: 'World Model' },
            { x: 350, y: 80, color: '#a855f7', title: '이미지', sub: 'SD / DALL-E' },
          ].map((d) => (
            <g key={d.title}>
              <rect x={d.x} y={d.y} width={100} height={40} rx={6} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <text x={d.x + 50} y={d.y + 18} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.title}</text>
              <text x={d.x + 50} y={d.y + 32} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{d.sub}</text>
            </g>
          ))}
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            2024: VQ-VAE → Foundation model 기반, VAE latent → Diffusion 인프라
          </text>
        </motion.g>
      )}
    </g>
  );
}
