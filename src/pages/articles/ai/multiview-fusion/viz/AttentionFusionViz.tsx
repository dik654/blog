import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, C, ATTN_SCORES } from './AttentionFusionVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function AttentionFusionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Cross-Attention 기본 구조 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* View 1 → Query */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <DataBox x={10} y={20} w={70} h={28} label="View 1" sub="피처맵" color={C.view1} />
                <line x1={82} y1={34} x2={110} y2={34} stroke={C.view1} strokeWidth={1.2} />
                <ActionBox x={112} y={18} w={65} h={32} label="W_Q" sub="Query 투영" color={C.query} />
                <line x1={179} y1={34} x2={210} y2={70} stroke={C.query} strokeWidth={1.2} />
              </motion.g>

              {/* View 2 → Key, Value */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <DataBox x={10} y={85} w={70} h={28} label="View 2" sub="피처맵" color={C.view2} />

                {/* Key 경로 */}
                <line x1={82} y1={95} x2={110} y2={80} stroke={C.view2} strokeWidth={1} />
                <ActionBox x={112} y={62} w={65} h={32} label="W_K" sub="Key 투영" color={C.key} />
                <line x1={179} y1={78} x2={210} y2={78} stroke={C.key} strokeWidth={1.2} />

                {/* Value 경로 */}
                <line x1={82} y1={102} x2={110} y2={115} stroke={C.view2} strokeWidth={1} />
                <ActionBox x={112} y={105} w={65} h={32} label="W_V" sub="Value 투영" color={C.value} />
                <line x1={179} y1={121} x2={210} y2={105} stroke={C.value} strokeWidth={1.2} />
              </motion.g>

              {/* Attention 블록 */}
              <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: '260px 88px' }} transition={{ ...sp, delay: 0.45 }}>
                <rect x={212} y={55} width={96} height={66} rx={10}
                  fill={C.attn + '10'} stroke={C.attn} strokeWidth={1.5} />
                <text x={260} y={78} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.attn}>Cross</text>
                <text x={260} y={92} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.attn}>Attention</text>
                <text x={260} y={110} textAnchor="middle" fontSize={8}
                  fill={C.attn} opacity={0.6}>Q·K^T / sqrt(d)</text>
              </motion.g>

              {/* 출력 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <line x1={310} y1={88} x2={340} y2={88} stroke={C.attn} strokeWidth={1.2} />
                <DataBox x={342} y={72} w={75} h={32} label="Fused f1'" sub="View2 정보 반영" color={C.attn} />
              </motion.g>

              {/* 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}>
                <text x={240} y={160} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">View 1이 View 2에게 "어디가 관련 있어?" 질의</text>
                <text x={240} y={175} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">Q(View1) × K(View2)^T → 어텐션 가중치 → V(View2) 가중합</text>

                {/* 양방향 화살표 */}
                <rect x={160} y={190} width={160} height={24} rx={6}
                  fill={C.attn + '10'} stroke={C.attn} strokeWidth={0.8} />
                <text x={240} y={206} textAnchor="middle" fontSize={8}
                  fill={C.attn} fontWeight={600}>양방향: View1→2 + View2→1</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: Attention Score 시각화 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={170} y={18} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">Attention Score (View1 → View2)</text>

              {/* 행 라벨 (View 1 패치) */}
              <text x={35} y={35} textAnchor="middle" fontSize={8} fill={C.view1} fontWeight={600}>
                View 1
              </text>
              {['p1', 'p2', 'p3', 'p4'].map((p, i) => (
                <text key={`r-${i}`} x={35} y={55 + i * 32} textAnchor="middle" fontSize={8}
                  fill={C.view1}>{p}</text>
              ))}

              {/* 열 라벨 (View 2 패치) */}
              <text x={170} y={35} textAnchor="middle" fontSize={8} fill={C.view2} fontWeight={600}>
                View 2
              </text>
              {['p1', 'p2', 'p3', 'p4'].map((p, i) => (
                <text key={`c-${i}`} x={75 + i * 50} y={43} textAnchor="middle" fontSize={8}
                  fill={C.view2}>{p}</text>
              ))}

              {/* Score 행렬 */}
              {ATTN_SCORES.map((row, r) =>
                row.map((v, c) => {
                  const intensity = Math.round(v * 255);
                  const bg = `${C.attn}${Math.round(v * 60).toString(16).padStart(2, '0')}`;
                  return (
                    <motion.g key={`${r}-${c}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{ transformOrigin: `${75 + c * 50}px ${55 + r * 32}px` }}
                      transition={{ delay: 0.1 + (r * 4 + c) * 0.03 }}>
                      <rect x={52 + c * 50} y={47 + r * 32} width={44} height={24} rx={4}
                        fill={bg} stroke={v >= 0.5 ? C.attn : 'var(--border)'}
                        strokeWidth={v >= 0.5 ? 1.5 : 0.5} />
                      <text x={74 + c * 50} y={63 + r * 32} textAnchor="middle"
                        fontSize={10} fontWeight={v >= 0.5 ? 700 : 400}
                        fill={v >= 0.5 ? C.attn : 'var(--foreground)'}>{v.toFixed(1)}</text>
                    </motion.g>
                  );
                })
              )}

              {/* 오른쪽 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <rect x={290} y={50} width={170} height={90} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={375} y={72} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">대각선이 밝다 = 대응 패치</text>
                <text x={375} y={90} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">View1.p1 → View2.p1 (0.6)</text>
                <text x={375} y={105} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">같은 구조물 영역끼리</text>
                <text x={375} y={120} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">높은 attention weight</text>
              </motion.g>

              {/* 수식 */}
              <motion.text x={240} y={195} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                softmax( Q · K^T / sqrt(d_k) ) → 각 행의 합 = 1.0
              </motion.text>
            </motion.g>
          )}

          {/* Step 2: Multi-Head Cross-Attention */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">Multi-Head Cross-Attention</text>

              {/* 입력 */}
              <DataBox x={10} y={35} w={60} h={24} label="View 1" color={C.view1} />
              <DataBox x={10} y={70} w={60} h={24} label="View 2" color={C.view2} />

              {/* 4개 헤드 */}
              {[
                { label: 'Head 0', sub: '질감', delay: 0.15 },
                { label: 'Head 1', sub: '구조', delay: 0.2 },
                { label: 'Head 2', sub: '색상', delay: 0.25 },
                { label: 'Head 3', sub: '위치', delay: 0.3 },
              ].map((h, i) => (
                <motion.g key={i} initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ transformOrigin: `${130 + i * 75}px 65px` }}
                  transition={{ ...sp, delay: h.delay }}>
                  <rect x={95 + i * 75} y={35} width={60} height={55} rx={8}
                    fill={C.head + '10'} stroke={C.head} strokeWidth={1.2} />
                  <text x={125 + i * 75} y={55} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.head}>{h.label}</text>
                  <text x={125 + i * 75} y={70} textAnchor="middle" fontSize={8}
                    fill={C.head} opacity={0.6}>{h.sub}</text>
                  <text x={125 + i * 75} y={82} textAnchor="middle" fontSize={7}
                    fill={C.head} opacity={0.4}>d_k/h</text>

                  {/* 입력 연결 */}
                  <line x1={72} y1={47} x2={93 + i * 75} y2={52}
                    stroke={C.view1} strokeWidth={0.6} opacity={0.4} />
                  <line x1={72} y1={82} x2={93 + i * 75} y2={72}
                    stroke={C.view2} strokeWidth={0.6} opacity={0.4} />
                </motion.g>
              ))}

              {/* Concat */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}>
                {[0, 1, 2, 3].map(i => (
                  <line key={i} x1={125 + i * 75} y1={92} x2={240} y2={115}
                    stroke={C.head} strokeWidth={0.6} opacity={0.4} />
                ))}
                <ActionBox x={200} y={110} w={80} h={28} label="Concat + W_o" color={C.head} />
              </motion.g>

              {/* 양방향 */}
              <motion.g initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={100} y={150} width={280} height={60} rx={10}
                  fill={C.attn + '08'} stroke={C.attn} strokeWidth={1} strokeDasharray="4 3" />
                <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C.attn}>양방향 Cross-Attention</text>

                {/* View1 → View2 */}
                <rect x={120} y={178} width={100} height={20} rx={4}
                  fill={C.view1 + '15'} stroke={C.view1} strokeWidth={0.8} />
                <text x={170} y={192} textAnchor="middle" fontSize={8}
                  fill={C.view1}>Q=V1, KV=V2</text>

                {/* View2 → View1 */}
                <rect x={260} y={178} width={100} height={20} rx={4}
                  fill={C.view2 + '15'} stroke={C.view2} strokeWidth={0.8} />
                <text x={310} y={192} textAnchor="middle" fontSize={8}
                  fill={C.view2}>Q=V2, KV=V1</text>

                {/* 교차 화살표 */}
                <line x1={222} y1={188} x2={258} y2={188} stroke={C.attn}
                  strokeWidth={1} markerEnd="url(#arrowAttn)" />
                <line x1={258} y1={185} x2={222} y2={185} stroke={C.attn}
                  strokeWidth={1} markerEnd="url(#arrowAttn)" />
              </motion.g>

              <defs>
                <marker id="arrowAttn" viewBox="0 0 6 6" refX={5} refY={3}
                  markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill={C.attn} />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* Step 3: 장단점 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 장점 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={15} width={200} height={100} rx={8}
                  fill="#22c55e08" stroke="#22c55e" strokeWidth={1} />
                <text x={120} y={35} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#22c55e">장점</text>

                {[
                  '동적 가중치: 입력마다 다른 패턴',
                  '명시적 뷰 간 관계 모델링',
                  '해석 가능: attention map 시각화',
                  '뷰 수 변화에 유연하게 대응',
                ].map((t, i) => (
                  <g key={i}>
                    <rect x={30} y={42 + i * 17} width={180} height={13} rx={3}
                      fill="#22c55e0a" />
                    <text x={120} y={53 + i * 17} textAnchor="middle" fontSize={8}
                      fill="var(--foreground)">{t}</text>
                  </g>
                ))}
              </motion.g>

              {/* 단점 */}
              <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <rect x={260} y={15} width={200} height={100} rx={8}
                  fill="#ef444408" stroke="#ef4444" strokeWidth={1} />
                <text x={360} y={35} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#ef4444">단점</text>

                {[
                  'O(n^2) 복잡도: 패치 수에 제곱',
                  '소규모 데이터 → 과적합 위험',
                  '구현 복잡도 증가',
                  'Late Fusion 대비 학습 느림',
                ].map((t, i) => (
                  <g key={i}>
                    <rect x={270} y={42 + i * 17} width={180} height={13} rx={3}
                      fill="#ef44440a" />
                    <text x={360} y={53 + i * 17} textAnchor="middle" fontSize={8}
                      fill="var(--foreground)">{t}</text>
                  </g>
                ))}
              </motion.g>

              {/* 비교 표 */}
              <motion.g initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <text x={240} y={140} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">퓨전 전략 비교 요약</text>

                {/* 헤더 */}
                {['', 'Early', 'Late', 'Attention'].map((h, i) => (
                  <text key={i} x={80 + i * 110} y={158} textAnchor="middle" fontSize={8}
                    fontWeight={700} fill="var(--foreground)">{h}</text>
                ))}

                {/* 행 */}
                {[
                  ['저수준 상호작용', 'O', 'X', 'O'],
                  ['Pretrained 활용', 'X', 'O', 'O'],
                  ['동적 가중치', 'X', 'X', 'O'],
                ].map((row, r) => (
                  <g key={r}>
                    <text x={80} y={176 + r * 18} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">{row[0]}</text>
                    {[1, 2, 3].map(c => (
                      <text key={c} x={80 + c * 110} y={176 + r * 18} textAnchor="middle"
                        fontSize={9} fontWeight={600}
                        fill={row[c] === 'O' ? '#22c55e' : '#ef4444'}>{row[c]}</text>
                    ))}
                  </g>
                ))}
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
