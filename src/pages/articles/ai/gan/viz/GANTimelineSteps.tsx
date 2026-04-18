import { motion } from 'framer-motion';

export default function GANTimelineSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">GAN 계보 (2014-2019)</text>
          <line x1={40} y1={40} x2={440} y2={40} stroke="var(--border)" strokeWidth={1} />
          {[
            { x: 60, yr: '2014', name: 'GAN', color: '#6366f1', sub: 'FC 구조' },
            { x: 140, yr: '2015', name: 'DCGAN', color: '#3b82f6', sub: 'CNN 가이드라인' },
            { x: 240, yr: '2017', name: 'WGAN', color: '#10b981', sub: 'Wasserstein' },
            { x: 330, yr: '2017', name: 'CycleGAN', color: '#f59e0b', sub: '비쌍 변환' },
            { x: 420, yr: '2019', name: 'StyleGAN', color: '#8b5cf6', sub: 'AdaIN' },
          ].map((d) => (
            <g key={d.name}>
              <circle cx={d.x} cy={40} r={5} fill={d.color} />
              <line x1={d.x} y1={45} x2={d.x} y2={60} stroke={d.color} strokeWidth={0.6} />
              <rect x={d.x - 40} y={60} width={80} height={40} rx={6} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.6} />
              <text x={d.x} y={76} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.name}</text>
              <text x={d.x} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
              <text x={d.x} y={34} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.yr}</text>
            </g>
          ))}
          <text x={240} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            DCGAN → WGAN → StyleGAN: 안정성·품질 순차 개선
          </text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#8b5cf6">StyleGAN 계보</text>
          <line x1={40} y1={45} x2={440} y2={45} stroke="#8b5cf6" strokeWidth={0.8} />
          {[
            { x: 80, yr: '2019', name: 'StyleGAN', sub: '1024x1024', detail: 'Mapping + AdaIN' },
            { x: 200, yr: '2020', name: 'StyleGAN2', sub: 'Demodulation', detail: 'Path regularization' },
            { x: 320, yr: '2021', name: 'StyleGAN3', sub: 'Alias-free', detail: 'Rotation equivariant' },
            { x: 430, yr: '2022', name: 'SG-XL', sub: 'Class-cond', detail: '대규모 생성' },
          ].map((d) => (
            <g key={d.name}>
              <circle cx={d.x} cy={45} r={5} fill="#8b5cf6" />
              <line x1={d.x} y1={50} x2={d.x} y2={65} stroke="#8b5cf6" strokeWidth={0.6} />
              <rect x={d.x - 45} y={65} width={90} height={52} rx={6} fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.6} />
              <text x={d.x} y={80} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">{d.name}</text>
              <text x={d.x} y={94} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
              <text x={d.x} y={108} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.detail}</text>
              <text x={d.x} y={38} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.yr}</text>
            </g>
          ))}
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            계층적 스타일 제어 → 고해상도 얼굴 생성의 정점
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">GAN vs Diffusion</text>
          {/* 비교 표 */}
          {[
            { y: 30, metric: '학습 안정성', gan: '불안정', diff: '매우 안정', ganC: '#ef4444', diffC: '#10b981' },
            { y: 52, metric: '샘플 품질', gan: '선명', diff: '최고', ganC: '#10b981', diffC: '#10b981' },
            { y: 74, metric: '다양성', gan: 'mode collapse', diff: '매우 높음', ganC: '#ef4444', diffC: '#10b981' },
            { y: 96, metric: '생성 속도', gan: '1 step (빠름)', diff: '50~1000 step', ganC: '#10b981', diffC: '#ef4444' },
          ].map((d) => (
            <g key={d.metric}>
              <text x={120} y={d.y + 12} textAnchor="middle" fontSize={9} fill="var(--foreground)">{d.metric}</text>
              <rect x={180} y={d.y} width={120} height={18} rx={4} fill={`${d.ganC}08`} stroke={d.ganC} strokeWidth={0.4} />
              <text x={240} y={d.y + 13} textAnchor="middle" fontSize={8} fill={d.ganC}>{d.gan}</text>
              <rect x={310} y={d.y} width={120} height={18} rx={4} fill={`${d.diffC}08`} stroke={d.diffC} strokeWidth={0.4} />
              <text x={370} y={d.y + 13} textAnchor="middle" fontSize={8} fill={d.diffC}>{d.diff}</text>
            </g>
          ))}
          <text x={240} y={28} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">GAN</text>
          <text x={370} y={28} textAnchor="middle" fontSize={8} fontWeight={600} fill="#8b5cf6">Diffusion</text>
          <text x={240} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            2022년 이후 Diffusion 주류 — 안정성·다양성 우위
          </text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">최근 트렌드 (2023~)</text>
          {[
            { x: 20, color: '#6366f1', title: 'Consistency', sub: '1-step\ndiffusion' },
            { x: 140, color: '#10b981', title: 'Rectified Flow', sub: '직선 경로\n효율적' },
            { x: 260, color: '#f59e0b', title: 'DiT', sub: 'Diffusion\nTransformer' },
            { x: 370, color: '#8b5cf6', title: '하이브리드', sub: 'GAN+Diff\nVQ-GAN' },
          ].map((d) => (
            <g key={d.title}>
              <rect x={d.x} y={30} width={100} height={70} rx={8} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <rect x={d.x} y={30} width={100} height={5} rx={2.5} fill={d.color} opacity={0.85} />
              <text x={d.x + 50} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.title}</text>
              {d.sub.split('\n').map((line, i) => (
                <text key={i} x={d.x + 50} y={66 + i * 12} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{line}</text>
              ))}
            </g>
          ))}
          <text x={240} y={125} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            GAN 1-step 속도 + Diffusion 품질 → 융합 연구 활발
          </text>
        </motion.g>
      )}
    </g>
  );
}
