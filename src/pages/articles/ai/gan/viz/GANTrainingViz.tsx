import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '노이즈 z 샘플링' },
  { label: 'Generator가 이미지 생성' },
  { label: 'Real + Fake → Discriminator' },
  { label: '판별 점수 출력' },
  { label: '역전파로 G, D 업데이트' },
];
const BODY = [
  'N(0,1)에서 잠재 벡터 z 샘플링',
  'G(z): 무작위→구조 이미지 변환',
  '진짜+가짜 모두 D에 입력',
  'D(real)=0.9, D(fake)=0.3',
  'D→G 그래디언트로 양쪽 학습',
];

const noise = Array.from({ length: 12 }, (_, i) => ({ x: 18 + (i % 4) * 12 + Math.sin(i) * 5, y: 48 + Math.floor(i / 4) * 14 + Math.cos(i) * 4 }));
const grid = Array.from({ length: 12 }, (_, i) => ({ x: 18 + (i % 4) * 12, y: 48 + Math.floor(i / 4) * 14 }));

export default function GANTrainingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Noise z */}
          <text x={30} y={30} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">z ~ N(0,1)</text>
          {noise.map((p, i) => (
            <motion.circle key={`n${i}`} r={2.5}
              animate={{ cx: step >= 1 ? grid[i].x : p.x, cy: step >= 1 ? grid[i].y : p.y, fill: step >= 1 ? '#10b981' : '#6366f1' }}
              transition={{ duration: 0.5, delay: i * 0.03 }} />
          ))}
          {/* Generator box */}
          <motion.rect x={70} y={38} width={48} height={52} rx={6}
            animate={{ stroke: step >= 1 ? '#10b981' : '#10b98160', fill: step >= 1 ? '#10b98112' : '#10b98106' }} strokeWidth={1.5} />
          <text x={94} y={68} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Generator</text>
          {/* Arrow G → fake */}
          {step >= 1 && <motion.line x1={118} y1={64} x2={132} y2={64} stroke="#10b981" strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} markerEnd="url(#arr)" />}
          {/* Fake image */}
          <motion.rect x={134} y={48} width={30} height={30} rx={4}
            animate={{ fill: step >= 1 ? '#3b82f620' : 'transparent', stroke: step >= 1 ? '#3b82f6' : '#3b82f640', strokeWidth: step >= 1 ? 1.5 : 0.5 }} />
          {step >= 1 && <text x={149} y={67} textAnchor="middle" fontSize={9} fill="#3b82f6">Fake</text>}
          {/* Real image */}
          <motion.rect x={134} y={4} width={30} height={30} rx={4}
            animate={{ fill: step >= 2 ? '#f59e0b20' : '#f59e0b10', stroke: '#f59e0b', strokeWidth: step >= 2 ? 1.5 : 0.8 }} />
          <text x={149} y={23} textAnchor="middle" fontSize={9} fill="#f59e0b">Real</text>
          {/* Arrows to Discriminator */}
          {step >= 2 && <>
            <motion.line x1={164} y1={19} x2={200} y2={45} stroke="#f59e0b" strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <motion.line x1={164} y1={63} x2={200} y2={55} stroke="#3b82f6" strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          </>}
          {/* Discriminator box */}
          <motion.rect x={200} y={30} width={56} height={52} rx={6}
            animate={{ stroke: step >= 2 ? '#ef4444' : '#ef444460', fill: step >= 2 ? '#ef444412' : '#ef444406' }} strokeWidth={1.5} />
          <text x={228} y={60} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">Discriminator</text>
          {/* Score bars + loss computation */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={274} y={28} fontSize={9} fill="#f59e0b">D(real)</text>
              <motion.rect x={274} y={31} height={8} rx={2} fill="#f59e0b" initial={{ width: 0 }} animate={{ width: 63 }} transition={{ duration: 0.6 }} />
              <text x={340} y={39} fontSize={9} fontWeight={600} fill="#f59e0b">0.9</text>
              <text x={274} y={51} fontSize={9} fill="#3b82f6">D(fake)</text>
              <motion.rect x={274} y={54} height={8} rx={2} fill="#3b82f6" initial={{ width: 0 }} animate={{ width: 21 }} transition={{ duration: 0.6 }} />
              <text x={298} y={62} fontSize={9} fontWeight={600} fill="#3b82f6">0.3</text>
              {/* Loss calculation */}
              <text x={274} y={80} fontSize={9} fill="var(--muted-foreground)">
                L_D = -log(0.9)-log(1-0.3)
              </text>
              <text x={274} y={92} fontSize={9} fontWeight={600} fill="#ef4444">
                = 0.105 + 0.357 = 0.462
              </text>
              <text x={274} y={106} fontSize={9} fill="var(--muted-foreground)">
                L_G = -log(0.3) = 1.204
              </text>
            </motion.g>
          )}
          {/* Backprop arrows */}
          {step >= 4 && <>
            <motion.line x1={228} y1={82} x2={228} y2={115} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <text x={228} y={125} textAnchor="middle" fontSize={9} fill="#ef4444">D 업데이트</text>
            <motion.path d="M200,82 Q160,110 94,90" fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
            <text x={140} y={115} textAnchor="middle" fontSize={9} fill="#10b981">G 업데이트</text>
          </>}
          <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#10b981" /></marker></defs>
          <motion.text x={400} y={65} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
