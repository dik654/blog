import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '다차원 입력 데이터' },
  { label: '차원별 ECDF 계산' },
  { label: '양쪽 꼬리 확률' },
  { label: '점수 집계 (Σ max)' },
  { label: '이상치 판정' },
];
const BODY = [
  'd개 특성 데이터셋 입력',
  '각 특성 독립 ECDF 추정',
  '좌/우 꼬리 확률 추출',
  '-log 적용 후 최댓값 합산',
  '임계값 초과 시 이상치 판별',
];
const DIMS = [{ label:'x₁',ox:10,oy:20,color:'#6366f1' },{ label:'x₂',ox:90,oy:20,color:'#10b981' },{ label:'x₃',ox:170,oy:20,color:'#f59e0b' }];
const TAILS = [{left:0.8,right:0.3,logL:0.22,logR:1.20},{left:0.2,right:0.9,logL:1.61,logR:0.11},{left:0.5,right:0.6,logL:0.69,logR:0.51}];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const miniECDF = (ox: number, oy: number) => `M${ox},${oy+36} Q${ox+15},${oy+34} ${ox+25},${oy+20} Q${ox+40},${oy+6} ${ox+60},${oy}`;

export default function ECODArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {DIMS.map((d, di) => (
            <g key={d.label}>
              <rect x={d.ox} y={d.oy} width={65} height={40} rx={4}
                fill={step >= 1 ? `${d.color}10` : '#80808008'}
                stroke={step >= 1 ? d.color : '#666'} strokeWidth={step >= 1 ? 1.5 : 0.5} />
              <text x={d.ox + 32} y={d.oy - 4} textAnchor="middle" fontSize={9}
                fill={d.color} fontWeight={step >= 1 ? 600 : 400}>{d.label}</text>
              {step >= 1 && (
                <motion.path d={miniECDF(d.ox + 2, d.oy + 2)} fill="none"
                  stroke={d.color} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: di * 0.12 }} />
              )}
              {step >= 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: di * 0.1 }}>
                  <rect x={d.ox + 2} y={d.oy + 2} width={12} height={36} rx={2}
                    fill="#10b981" fillOpacity={0.15} />
                  <rect x={d.ox + 51} y={d.oy + 2} width={12} height={36} rx={2}
                    fill="#f59e0b" fillOpacity={0.15} />
                </motion.g>
              )}
            </g>
          ))}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {DIMS.map((d, i) => (
                <line key={i} x1={d.ox + 32} y1={72} x2={150} y2={80}
                  stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="3 2" />
              ))}
              {/* -log table */}
              <text x={152} y={78} fontSize={9} fill="var(--muted-foreground)" fontWeight={600}>-log 변환:</text>
              {TAILS.map((t, i) => (
                <g key={i}>
                  <text x={152} y={90 + i * 11} fontSize={9} fill={DIMS[i].color}>
                    {DIMS[i].label}: max(-log {t.left.toFixed(1)}, -log {t.right.toFixed(1)}) = {Math.max(t.logL, t.logR).toFixed(2)}
                  </text>
                </g>
              ))}
              <rect x={152} y={118} width={90} height={16} rx={4}
                fill="#ec489918" stroke="#ec4899" strokeWidth={1.2} />
              <text x={197} y={129} textAnchor="middle" fontSize={9} fill="#ec4899" fontWeight={600}>
                Σ = {(1.20 + 1.61 + 0.69).toFixed(2)}
              </text>
            </motion.g>
          )}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={245} y1={126} x2={280} y2={100}
                stroke="#ef4444" strokeWidth={1} markerEnd="url(#arrowR)" />
              <text x={260} y={92} fontSize={9} fill="var(--muted-foreground)">θ = 2.5</text>
              <rect x={285} y={88} width={60} height={24} rx={5}
                fill="#ef444420" stroke="#ef4444" strokeWidth={1.5} />
              <text x={315} y={100} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>
                3.50 {'>'} 2.5
              </text>
              <text x={315} y={118} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>
                이상치!
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrowR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#ef4444" />
            </marker>
          </defs>
          <motion.text x={370} y={60} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
