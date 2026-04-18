import { motion } from 'framer-motion';

export default function SDPipelineSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Latent Diffusion 구조</text>
          {/* 파이프라인 */}
          {[
            { x: 10, label: '이미지', sub: '512x512x3', sub2: '786K dim', color: '#3b82f6' },
            { x: 110, label: 'VAE Enc', sub: '8x 압축', sub2: '', color: '#10b981' },
            { x: 210, label: 'Latent', sub: '64x64x4', sub2: '16K dim', color: '#8b5cf6' },
            { x: 310, label: 'U-Net', sub: 'Diffusion', sub2: '', color: '#ef4444' },
            { x: 400, label: 'VAE Dec', sub: '복원', sub2: '', color: '#10b981' },
          ].map((d, i) => (
            <g key={d.label}>
              <rect x={d.x} y={28} width={85} height={50} rx={6} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <text x={d.x + 42} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.label}</text>
              <text x={d.x + 42} y={62} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
              {d.sub2 && <text x={d.x + 42} y={73} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub2}</text>}
              {i < 4 && <line x1={d.x + 85} y1={53} x2={[110, 210, 310, 400][i]} y2={53} stroke={d.color} strokeWidth={0.6} />}
            </g>
          ))}
          {/* 48배 압축 강조 */}
          <rect x={120} y={88} width={240} height={28} rx={6} fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.8} />
          <text x={240} y={106} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">
            786K → 16K = 48배 압축
          </text>
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            이미지 픽셀은 redundant — semantic 정보는 작은 latent에 압축
          </text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Text-to-Image 추론</text>
          <rect x={20} y={26} width={440} height={108} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          {[
            { y: 40, num: '1', text: '"A cat on a red chair" → CLIP tokenizer → 77 tokens', color: '#3b82f6' },
            { y: 58, num: '2', text: 'CLIP text encoder → (77, 768) embedding', color: '#3b82f6' },
            { y: 76, num: '3', text: 'z_T ~ N(0, I), shape (4, 64, 64)', color: '#8b5cf6' },
            { y: 94, num: '4', text: 'for t = T → 1: UNet(z_t, t, text) → denoise (50 steps)', color: '#ef4444' },
            { y: 112, num: '5', text: 'x = VAE_decoder(z_0) → 512x512 image', color: '#10b981' },
          ].map((d) => (
            <g key={d.num}>
              <circle cx={40} cy={d.y} r={8} fill={`${d.color}20`} stroke={d.color} strokeWidth={0.6} />
              <text x={40} y={d.y + 3} textAnchor="middle" fontSize={8} fontWeight={600} fill={d.color}>{d.num}</text>
              <text x={55} y={d.y + 4} fontSize={8} fill="var(--foreground)">{d.text}</text>
            </g>
          ))}
          <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            전체 추론: CLIP 인코딩 + 50 step denoising + VAE 디코딩
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Stable Diffusion 버전</text>
          <line x1={40} y1={45} x2={440} y2={45} stroke="var(--border)" strokeWidth={0.8} />
          {[
            { x: 60, yr: '2022', name: 'SD 1.x', sub: '512x512', detail: '860M UNet', color: '#3b82f6' },
            { x: 170, yr: '2022', name: 'SD 2.x', sub: '768x768', detail: 'OpenCLIP', color: '#6366f1' },
            { x: 280, yr: '2023', name: 'SDXL', sub: '1024x1024', detail: '3.5B params', color: '#8b5cf6' },
            { x: 400, yr: '2024', name: 'SD3', sub: 'MM-DiT', detail: 'Flow matching', color: '#10b981' },
          ].map((d) => (
            <g key={d.name}>
              <circle cx={d.x} cy={45} r={4} fill={d.color} />
              <text x={d.x} y={38} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.yr}</text>
              <rect x={d.x - 40} y={56} width={80} height={52} rx={6} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.6} />
              <text x={d.x} y={72} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.name}</text>
              <text x={d.x} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
              <text x={d.x} y={100} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.detail}</text>
            </g>
          ))}
          <text x={240} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            U-Net → Transformer, pixel → latent → flow matching
          </text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">SD 생태계</text>
          {[
            { x: 20, color: '#ef4444', title: 'ControlNet', sub: 'pose/edge\ndepth 제어' },
            { x: 120, color: '#f59e0b', title: 'LoRA', sub: '캐릭터/스타일\n4~8MB' },
            { x: 220, color: '#10b981', title: 'DreamBooth', sub: '특정 객체\n학습' },
            { x: 320, color: '#8b5cf6', title: 'IP-Adapter', sub: '이미지\nprompt' },
            { x: 410, color: '#3b82f6', title: 'AnimateDiff', sub: '애니메이션\n생성' },
          ].map((d) => (
            <g key={d.title}>
              <rect x={d.x} y={30} width={85} height={70} rx={8} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <rect x={d.x} y={30} width={85} height={5} rx={2.5} fill={d.color} opacity={0.85} />
              <text x={d.x + 42} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.title}</text>
              {d.sub.split('\n').map((line, i) => (
                <text key={i} x={d.x + 42} y={66 + i * 12} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{line}</text>
              ))}
            </g>
          ))}
          <text x={240} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            오픈소스 혁명 — 커뮤니티 기반 풍부한 확장 생태계
          </text>
        </motion.g>
      )}
    </g>
  );
}
