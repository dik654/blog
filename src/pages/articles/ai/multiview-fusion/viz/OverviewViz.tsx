import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 멀티뷰 문제 시각화 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 구조물 (대상) */}
              <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: '240px 90px' }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={210} y={60} width={60} height={60} rx={4}
                  fill="#94a3b822" stroke={C.bg} strokeWidth={1.5} />
                <text x={240} y={85} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">구조물</text>
                <text x={240} y={100} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">대상 객체</text>
              </motion.g>

              {/* 시점 1: 왼쪽 카메라 */}
              <motion.g initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <circle cx={80} cy={50} r={18} fill={C.view1 + '18'} stroke={C.view1} strokeWidth={1.5} />
                <text x={80} y={46} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C.view1}>View 1</text>
                <text x={80} y={58} textAnchor="middle" fontSize={8}
                  fill={C.view1}>정면</text>
                <line x1={98} y1={55} x2={208} y2={80} stroke={C.view1}
                  strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
              </motion.g>

              {/* 시점 2: 오른쪽 카메라 */}
              <motion.g initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <circle cx={400} cy={50} r={18} fill={C.view2 + '18'} stroke={C.view2} strokeWidth={1.5} />
                <text x={400} y={46} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C.view2}>View 2</text>
                <text x={400} y={58} textAnchor="middle" fontSize={8}
                  fill={C.view2}>측면</text>
                <line x1={382} y1={55} x2={272} y2={80} stroke={C.view2}
                  strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
              </motion.g>

              {/* 결과 이미지 2장 */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={50} y={140} width={48} height={36} rx={4}
                  fill={C.view1 + '15'} stroke={C.view1} strokeWidth={1} />
                <text x={74} y={153} textAnchor="middle" fontSize={8} fill={C.view1}>RGB</text>
                <text x={74} y={165} textAnchor="middle" fontSize={8} fill={C.view1}>3ch</text>

                <rect x={382} y={140} width={48} height={36} rx={4}
                  fill={C.view2 + '15'} stroke={C.view2} strokeWidth={1} />
                <text x={406} y={153} textAnchor="middle" fontSize={8} fill={C.view2}>RGB</text>
                <text x={406} y={165} textAnchor="middle" fontSize={8} fill={C.view2}>3ch</text>

                <text x={240} y={160} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">같은 대상 → 서로 다른 정보</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: 단순 Concat */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* View 1 이미지 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <DataBox x={30} y={20} w={80} h={32} label="View 1" sub="H×W×3" color={C.view1} />
              </motion.g>

              {/* View 2 이미지 */}
              <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <DataBox x={130} y={20} w={80} h={32} label="View 2" sub="H×W×3" color={C.view2} />
              </motion.g>

              {/* 화살표 → concat */}
              <motion.line x1={70} y1={54} x2={170} y2={78} stroke={C.view1}
                strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.4 }} />
              <motion.line x1={170} y1={54} x2={170} y2={78} stroke={C.view2}
                strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.4 }} />

              {/* Concat 결과 */}
              <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: '170px 100px' }} transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={120} y={80} w={100} h={38} label="Concat" sub="채널 축 결합" color={C.fuse} />
              </motion.g>

              {/* 6채널 텐서 */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={130} y={130} width={80} height={30} rx={6}
                  fill={C.fuse + '15'} stroke={C.fuse} strokeWidth={1.5} />
                <text x={170} y={149} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.fuse}>H×W×6</text>
              </motion.g>

              {/* CNN */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}>
                <ModuleBox x={300} y={60} w={120} h={48} label="CNN Backbone" sub="6ch → feature" color={C.bg} />
                <line x1={212} y1={100} x2={298} y2={84} stroke={C.bg}
                  strokeWidth={1} strokeDasharray="3 2" />
                <text x={360} y={128} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">입력 레이어 수정 필요</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: 3가지 퓨전 전략 비교 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { label: 'Early', sub: '입력 결합', y: 20, color: C.view1, desc: '채널 Concat → 공유 백본' },
                { label: 'Late', sub: '피처 결합', y: 80, color: C.view2, desc: '독립 백본 → 벡터 Concat' },
                { label: 'Attention', sub: '교차 주의', y: 140, color: C.fuse, desc: 'Cross-Attention → 동적 가중' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ ...sp, delay: 0.15 * i }}>
                  {/* 왼쪽 라벨 */}
                  <rect x={20} y={item.y} width={90} height={40} rx={8}
                    fill={item.color + '15'} stroke={item.color} strokeWidth={1.5} />
                  <text x={65} y={item.y + 18} textAnchor="middle" fontSize={10}
                    fontWeight={700} fill={item.color}>{item.label}</text>
                  <text x={65} y={item.y + 32} textAnchor="middle" fontSize={8}
                    fill={item.color} opacity={0.7}>{item.sub}</text>

                  {/* 흐름 화살표 */}
                  <line x1={112} y1={item.y + 20} x2={150} y2={item.y + 20}
                    stroke={item.color} strokeWidth={1.2} markerEnd="url(#arrowFuse)" />

                  {/* 설명 */}
                  <text x={158} y={item.y + 24} fontSize={9} fill="var(--foreground)">
                    {item.desc}
                  </text>

                  {/* 장단점 아이콘 */}
                  <rect x={370} y={item.y + 4} width={90} height={32} rx={6}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={415} y={item.y + 24} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">
                    {i === 0 ? '저수준 상호작용' : i === 1 ? '독립 표현' : '동적 가중치'}
                  </text>
                </motion.g>
              ))}
              <defs>
                <marker id="arrowFuse" viewBox="0 0 6 6" refX={5} refY={3}
                  markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill={C.bg} />
                </marker>
              </defs>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
