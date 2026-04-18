import { motion } from 'framer-motion';

const C = { ae: '#6366f1', vae: '#10b981', gan: '#f59e0b', diff: '#8b5cf6' };

export default function ModelCompareSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={140} y={8} width={200} height={32} rx={8} fill={`${C.ae}12`} stroke={C.ae} strokeWidth={1.2} />
          <rect x={140} y={8} width={200} height={5} rx={2.5} fill={C.ae} opacity={0.85} />
          <text x={240} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ae}>Autoencoder</text>
          {/* 흐름 */}
          <text x={80} y={68} textAnchor="middle" fontSize={10} fill="var(--foreground)">x</text>
          <line x1={94} y1={65} x2={140} y2={65} stroke={C.ae} strokeWidth={1} />
          <rect x={140} y={52} width={70} height={26} rx={4} fill={`${C.ae}10`} stroke={C.ae} strokeWidth={0.8} />
          <text x={175} y={69} textAnchor="middle" fontSize={9} fill={C.ae}>Encoder</text>
          <line x1={210} y1={65} x2={230} y2={65} stroke={C.ae} strokeWidth={1} />
          <circle cx={240} cy={65} r={8} fill={`${C.ae}20`} stroke={C.ae} strokeWidth={1.2} />
          <text x={240} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ae}>z</text>
          <text x={240} y={84} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">단일 점</text>
          <line x1={248} y1={65} x2={270} y2={65} stroke={C.ae} strokeWidth={1} />
          <rect x={270} y={52} width={70} height={26} rx={4} fill={`${C.ae}10`} stroke={C.ae} strokeWidth={0.8} />
          <text x={305} y={69} textAnchor="middle" fontSize={9} fill={C.ae}>Decoder</text>
          <line x1={340} y1={65} x2={386} y2={65} stroke={C.ae} strokeWidth={1} />
          <text x={400} y={68} textAnchor="middle" fontSize={10} fill="var(--foreground)">x&#770;</text>
          {/* 특징 */}
          <rect x={100} y={100} width={100} height={22} rx={4} fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} strokeDasharray="4 3" />
          <text x={150} y={115} textAnchor="middle" fontSize={9} fill="#ef4444">샘플링 불가</text>
          <rect x={220} y={100} width={100} height={22} rx={4} fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} strokeDasharray="4 3" />
          <text x={270} y={115} textAnchor="middle" fontSize={9} fill="#ef4444">구멍 존재</text>
          <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Loss = ‖x − x&#770;‖²</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={140} y={8} width={200} height={32} rx={8} fill={`${C.vae}12`} stroke={C.vae} strokeWidth={1.2} />
          <rect x={140} y={8} width={200} height={5} rx={2.5} fill={C.vae} opacity={0.85} />
          <text x={240} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.vae}>VAE</text>
          {/* 흐름 */}
          <text x={60} y={72} textAnchor="middle" fontSize={10} fill="var(--foreground)">x</text>
          <line x1={74} y1={69} x2={95} y2={69} stroke={C.vae} strokeWidth={1} />
          <rect x={95} y={56} width={60} height={26} rx={4} fill={`${C.vae}10`} stroke={C.vae} strokeWidth={0.8} />
          <text x={125} y={73} textAnchor="middle" fontSize={9} fill={C.vae}>Encoder</text>
          {/* μ, σ 분기 */}
          <line x1={155} y1={64} x2={185} y2={54} stroke={C.vae} strokeWidth={0.8} />
          <line x1={155} y1={74} x2={185} y2={84} stroke={C.vae} strokeWidth={0.8} />
          <rect x={185} y={44} width={36} height={20} rx={10} fill={`${C.vae}18`} stroke={C.vae} strokeWidth={1} />
          <text x={203} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vae}>μ</text>
          <rect x={185} y={74} width={36} height={20} rx={10} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
          <text x={203} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">σ²</text>
          {/* 샘플링 */}
          <line x1={221} y1={54} x2={250} y2={69} stroke={C.vae} strokeWidth={0.8} />
          <line x1={221} y1={84} x2={250} y2={69} stroke="#f59e0b" strokeWidth={0.8} />
          <circle cx={260} cy={69} r={10} fill={`${C.vae}20`} stroke={C.vae} strokeWidth={1.2} />
          <text x={260} y={72} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.vae}>z</text>
          <text x={260} y={92} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">~N(μ,σ²)</text>
          <line x1={270} y1={69} x2={300} y2={69} stroke={C.vae} strokeWidth={1} />
          <rect x={300} y={56} width={60} height={26} rx={4} fill={`${C.vae}10`} stroke={C.vae} strokeWidth={0.8} />
          <text x={330} y={73} textAnchor="middle" fontSize={9} fill={C.vae}>Decoder</text>
          <line x1={360} y1={69} x2={400} y2={69} stroke={C.vae} strokeWidth={1} />
          <text x={414} y={72} textAnchor="middle" fontSize={10} fill="var(--foreground)">x&#770;</text>
          {/* 특징 */}
          <rect x={100} y={108} width={100} height={22} rx={4} fill={`${C.vae}10`} stroke={C.vae} strokeWidth={0.6} />
          <text x={150} y={123} textAnchor="middle" fontSize={9} fill={C.vae}>연속 잠재공간</text>
          <rect x={220} y={108} width={100} height={22} rx={4} fill={`${C.vae}10`} stroke={C.vae} strokeWidth={0.6} />
          <text x={270} y={123} textAnchor="middle" fontSize={9} fill={C.vae}>보간 가능</text>
          <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Loss = 재구성 + KL</text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={140} y={8} width={200} height={32} rx={8} fill={`${C.gan}12`} stroke={C.gan} strokeWidth={1.2} />
          <rect x={140} y={8} width={200} height={5} rx={2.5} fill={C.gan} opacity={0.85} />
          <text x={240} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.gan}>GAN</text>
          {/* Generator */}
          <circle cx={80} cy={72} r={10} fill={`${C.gan}20`} stroke={C.gan} strokeWidth={1} />
          <text x={80} y={75} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gan}>z</text>
          <text x={80} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">noise</text>
          <line x1={90} y1={72} x2={120} y2={72} stroke={C.gan} strokeWidth={1} />
          <rect x={120} y={58} width={70} height={28} rx={4} fill={`${C.gan}10`} stroke={C.gan} strokeWidth={0.8} />
          <text x={155} y={76} textAnchor="middle" fontSize={9} fill={C.gan}>Generator</text>
          <line x1={190} y1={72} x2={220} y2={72} stroke={C.gan} strokeWidth={1} />
          <text x={235} y={75} textAnchor="middle" fontSize={10} fill="var(--foreground)">G(z)</text>
          {/* Discriminator */}
          <line x1={250} y1={72} x2={290} y2={72} stroke="#ef4444" strokeWidth={1} />
          <rect x={290} y={58} width={90} height={28} rx={4} fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} />
          <text x={335} y={76} textAnchor="middle" fontSize={9} fill="#ef4444">Discriminator</text>
          <line x1={380} y1={72} x2={420} y2={72} stroke="#ef4444" strokeWidth={1} />
          <text x={440} y={76} textAnchor="middle" fontSize={10} fill="var(--foreground)">0/1</text>
          {/* 특징 */}
          <rect x={80} y={108} width={100} height={22} rx={4} fill={`${C.gan}10`} stroke={C.gan} strokeWidth={0.6} />
          <text x={130} y={123} textAnchor="middle" fontSize={9} fill={C.gan}>선명한 출력</text>
          <rect x={200} y={108} width={110} height={22} rx={4} fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} strokeDasharray="4 3" />
          <text x={255} y={123} textAnchor="middle" fontSize={9} fill="#ef4444">mode collapse</text>
          <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Loss = adversarial (min-max)</text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Stable Diffusion에서의 VAE 역할</text>
          {/* 파이프라인 */}
          <rect x={20} y={35} width={80} height={28} rx={4} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={60} y={53} textAnchor="middle" fontSize={9} fill="#3b82f6">이미지 512²</text>
          <line x1={100} y1={49} x2={130} y2={49} stroke={C.vae} strokeWidth={1} />
          <rect x={130} y={35} width={80} height={28} rx={4} fill={`${C.vae}10`} stroke={C.vae} strokeWidth={1} />
          <text x={170} y={53} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vae}>VAE Enc</text>
          <line x1={210} y1={49} x2={230} y2={49} stroke={C.diff} strokeWidth={1} />
          <text x={220} y={42} textAnchor="middle" fontSize={7} fill={C.vae}>8x 압축</text>
          <rect x={230} y={35} width={80} height={28} rx={4} fill={`${C.diff}10`} stroke={C.diff} strokeWidth={1} />
          <text x={270} y={53} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.diff}>Diffusion</text>
          <line x1={310} y1={49} x2={340} y2={49} stroke={C.vae} strokeWidth={1} />
          <rect x={340} y={35} width={80} height={28} rx={4} fill={`${C.vae}10`} stroke={C.vae} strokeWidth={1} />
          <text x={380} y={53} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vae}>VAE Dec</text>
          <line x1={420} y1={49} x2={446} y2={49} stroke="#3b82f6" strokeWidth={1} />
          <text x={460} y={53} textAnchor="middle" fontSize={9} fill="#3b82f6">출력</text>
          {/* 타임라인 */}
          <line x1={40} y1={90} x2={440} y2={90} stroke="var(--border)" strokeWidth={0.8} />
          {[
            { x: 60, yr: '2013', t: 'VAE' },
            { x: 150, yr: '2017', t: 'VQ-VAE' },
            { x: 260, yr: '2017', t: 'β-VAE' },
            { x: 380, yr: '2022', t: 'SD (LDM)' },
          ].map((d) => (
            <g key={d.t}>
              <circle cx={d.x} cy={90} r={3} fill={C.vae} />
              <text x={d.x} y={106} textAnchor="middle" fontSize={8} fill={C.vae}>{d.t}</text>
              <text x={d.x} y={118} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.yr}</text>
            </g>
          ))}
          <text x={240} y={142} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            VAE 잠재 공간 = Diffusion의 필수 인프라
          </text>
        </motion.g>
      )}
    </g>
  );
}
