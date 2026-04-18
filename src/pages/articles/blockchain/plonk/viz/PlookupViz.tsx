import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { t: '#6366f1', f: '#10b981', s: '#f59e0b', z: '#8b5cf6' };

const STEPS = [
  { label: 'Table T 정의', body: '허용 값 집합 T를 정의하고 보간 다항식 t(x)로 변환. range check, XOR 등에 활용.' },
  { label: 'Query 벡터 f', body: '증명 대상 값 f의 모든 원소가 T에 포함되는지 검증. Grand product로 O(n+m) 달성.' },
  { label: '정렬 병합 s = sort(T U f)', body: 'T와 f를 합쳐 정렬. s의 연속 원소가 같거나 T의 다음 값이면 포함관계 성립.' },
  { label: 'Grand Product Z(X)', body: 'beta, gamma로 누적곱 Z(X)를 구성. Z가 1로 돌아오면 정렬 조건 성립 즉 f가 T의 부분집합.' },
];

/* Table values */
const T = [0, 1, 2, 3, 4, 5, 6, 7];
const F = [3, 1, 5, 3];
const S = [0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7];

export default function PlookupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Table T */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.15 }} transition={sp}>
            <text x={20} y={18} fontSize={9} fontWeight={600} fill={C.t}>Table T (allowed values)</text>
            {T.map((v, i) => (
              <g key={`t-${i}`}>
                <motion.rect x={20 + i * 52} y={26} width={44} height={22} rx={4}
                  initial={{ opacity: 0 }}
                  animate={{
                    fill: step === 0 ? `${C.t}18` : `${C.t}08`,
                    stroke: C.t,
                    strokeWidth: step === 0 ? 1.2 : 0.4,
                    opacity: 1,
                  }}
                  transition={{ ...sp, delay: step === 0 ? i * 0.04 : 0 }} />
                <text x={20 + i * 52 + 22} y={41} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={C.t}>{v}</text>
              </g>
            ))}
          </motion.g>

          {/* Step 1: Query f */}
          <motion.g initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: step >= 1 ? 1 : 0.1, y: step >= 1 ? 0 : 8 }} transition={sp}>
            <text x={20} y={68} fontSize={9} fontWeight={600} fill={C.f}>Query f</text>
            {F.map((v, i) => (
              <g key={`f-${i}`}>
                <motion.rect x={20 + i * 60} y={76} width={50} height={22} rx={11}
                  initial={{ opacity: 0 }}
                  animate={{
                    fill: step === 1 ? `${C.f}18` : `${C.f}08`,
                    stroke: C.f,
                    strokeWidth: step === 1 ? 1.5 : 0.5,
                    opacity: 1,
                  }}
                  transition={{ ...sp, delay: step === 1 ? i * 0.06 : 0 }} />
                <text x={20 + i * 60 + 25} y={91} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={C.f}>{v}</text>
                {/* Check mark */}
                {step >= 1 && (
                  <motion.text x={20 + i * 60 + 42} y={84} fontSize={8} fill={C.f}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ ...sp, delay: 0.3 + i * 0.06 }}>
                    {'?'}
                  </motion.text>
                )}
              </g>
            ))}
            {step >= 1 && (
              <motion.text x={280} y={90} fontSize={8} fill={C.f}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
                all in T?
              </motion.text>
            )}
          </motion.g>

          {/* Step 2: Sorted merge s */}
          <motion.g initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: step >= 2 ? 1 : 0.05, y: step >= 2 ? 0 : 8 }} transition={sp}>
            <text x={20} y={118} fontSize={9} fontWeight={600} fill={C.s}>s = sort(T U f)</text>
            {S.map((v, i) => {
              const isFromF = F.includes(v) && i !== S.indexOf(v);
              return (
                <g key={`s-${i}`}>
                  <motion.rect x={10 + i * 42} y={126} width={36} height={20} rx={3}
                    initial={{ opacity: 0 }}
                    animate={{
                      fill: isFromF ? `${C.f}20` : `${C.s}12`,
                      stroke: isFromF ? C.f : C.s,
                      strokeWidth: step === 2 ? 1 : 0.4,
                      opacity: 1,
                    }}
                    transition={{ ...sp, delay: step === 2 ? i * 0.03 : 0 }} />
                  <text x={10 + i * 42 + 18} y={140} textAnchor="middle"
                    fontSize={9} fontWeight={500} fill={isFromF ? C.f : C.s}>{v}</text>
                </g>
              );
            })}
          </motion.g>

          {/* Step 3: Grand Product Z */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Z accumulator arrow across sorted row */}
              <motion.line x1={10} y1={152} x2={470} y2={152}
                stroke={C.z} strokeWidth={1.2} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.8 }} />
              {/* Z(1)=1 label */}
              <rect x={10} y={156} width={50} height={16} rx={4}
                fill={`${C.z}15`} stroke={C.z} strokeWidth={0.6} />
              <text x={35} y={167} textAnchor="middle"
                fontSize={8} fontWeight={600} fill={C.z}>Z(1)=1</text>
              {/* Z(n)=1 label */}
              <rect x={410} y={156} width={58} height={16} rx={4}
                fill={`${C.z}15`} stroke={C.z} strokeWidth={0.6} />
              <text x={439} y={167} textAnchor="middle"
                fontSize={8} fontWeight={600} fill={C.z}>Z(n)=1</text>
              {/* Equals sign */}
              <motion.text x={240} y={167} textAnchor="middle"
                fontSize={9} fontWeight={700} fill={C.z}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                f is in T
              </motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
