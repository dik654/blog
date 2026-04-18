import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';
import { STEPS, C, PATCH_SIZE, NUM_PATCHES } from './PatchEmbeddingVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function PatchEmbeddingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 이미지 → 패치 분할 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 원본 이미지 */}
              <rect x={20} y={30} width={100} height={100} rx={4} fill={C.img + '12'} stroke={C.img} strokeWidth={1.2} />
              <text x={70} y={22} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.img}>224 x 224 x 3</text>
              {/* 패치 그리드 표시 */}
              {[0, 1, 2, 3, 4, 5, 6].map(r =>
                [0, 1, 2, 3, 4, 5, 6].map(c => (
                  <motion.rect key={`s-${r}-${c}`} x={20 + c * (100 / 7)} y={30 + r * (100 / 7)}
                    width={100 / 7} height={100 / 7}
                    fill="transparent" stroke={C.patch} strokeWidth={0.4} opacity={0.5}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                    transition={{ delay: (r * 7 + c) * 0.008 }} />
                ))
              )}
              <text x={70} y={148} textAnchor="middle" fontSize={8} fill={C.patch}>
                {PATCH_SIZE}x{PATCH_SIZE} 패치 그리드
              </text>
              {/* 화살표 */}
              <motion.line x1={130} y1={80} x2={170} y2={80} stroke={C.patch} strokeWidth={1.5}
                markerEnd="url(#arrPe)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <defs><marker id="arrPe" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={C.patch} /></marker></defs>
              {/* 분할된 패치들 */}
              {[0, 1, 2, 3].map(r =>
                [0, 1, 2, 3].map(c => (
                  <motion.rect key={`p-${r}-${c}`} x={180 + c * 26} y={32 + r * 26}
                    width={22} height={22} rx={3}
                    fill={C.patch + '18'} stroke={C.patch} strokeWidth={0.8}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + (r * 4 + c) * 0.02 }} />
                ))
              )}
              <text x={228} y={148} textAnchor="middle" fontSize={8} fill={C.patch}>
                ...총 {NUM_PATCHES}개 패치
              </text>
              {/* 각 패치 크기 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <line x1={300} y1={80} x2={340} y2={80} stroke={C.patch} strokeWidth={1} strokeDasharray="3 2" />
                <rect x={350} y={50} width={110} height={60} rx={6} fill="var(--card)" stroke={C.patch} strokeWidth={0.5} />
                <text x={405} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.patch}>각 패치</text>
                <text x={405} y={85} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  {PATCH_SIZE}x{PATCH_SIZE}x3 = 768값
                </text>
                <text x={405} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  → 1D 벡터로 펼침
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: 선형 프로젝션 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 입력 패치 */}
              {[0, 1, 2].map(i => (
                <motion.g key={`in-${i}`} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={35 + i * 50} width={70} height={36} rx={5}
                    fill={C.patch + '12'} stroke={C.patch} strokeWidth={0.8} />
                  <text x={55} y={50 + i * 50} textAnchor="middle" fontSize={9} fill={C.patch} fontWeight={600}>
                    p{i + 1}
                  </text>
                  <text x={55} y={63 + i * 50} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">768차원</text>
                </motion.g>
              ))}
              <text x={55} y={195} textAnchor="middle" fontSize={7} fill={C.patch} opacity={0.5}>...{NUM_PATCHES}개</text>
              {/* 프로젝션 행렬 */}
              <motion.line x1={100} y1={100} x2={145} y2={100} stroke={C.token} strokeWidth={1.5} markerEnd="url(#arrPr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <defs><marker id="arrPr" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={C.token} /></marker></defs>
              <ActionBox x={150} y={70} w={100} h={60} label="Linear Projection" sub="E ∈ R^(768×D)" color={C.token} />
              <text x={200} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                = Conv2d(3, D, 16, stride=16)
              </text>
              {/* 출력 토큰 */}
              <motion.line x1={255} y1={100} x2={300} y2={100} stroke={C.token} strokeWidth={1.5} markerEnd="url(#arrPr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
              {[0, 1, 2].map(i => (
                <motion.g key={`out-${i}`} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.08 }}>
                  <rect x={305} y={35 + i * 50} width={70} height={36} rx={18}
                    fill={C.token + '15'} stroke={C.token} strokeWidth={0.8} />
                  <text x={340} y={50 + i * 50} textAnchor="middle" fontSize={9} fill={C.token} fontWeight={600}>
                    z{i + 1}
                  </text>
                  <text x={340} y={63 + i * 50} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">D차원</text>
                </motion.g>
              ))}
              {/* 수식 */}
              <rect x={390} y={70} width={80} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={430} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.token}>z = xE + b</text>
              <text x={430} y={108} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">한 번의 연산으로</text>
              <text x={430} y={118} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">분할+프로젝션</text>
            </motion.g>
          )}

          {/* Step 2: CLS 토큰 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* CLS 토큰 */}
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={75} width={65} height={36} rx={18}
                  fill={C.cls + '20'} stroke={C.cls} strokeWidth={1.5} />
                <text x={62} y={90} textAnchor="middle" fontSize={10} fill={C.cls} fontWeight={700}>[CLS]</text>
                <text x={62} y={103} textAnchor="middle" fontSize={7} fill={C.cls}>학습 가능</text>
              </motion.g>
              {/* 패치 토큰들 */}
              {[0, 1, 2, 3, 4].map(i => (
                <motion.rect key={`t-${i}`} x={108 + i * 42} y={78} width={35} height={30} rx={15}
                  fill={C.token + '12'} stroke={C.token} strokeWidth={0.6}
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }} />
              ))}
              {[0, 1, 2, 3, 4].map(i => (
                <text key={`tl-${i}`} x={125 + i * 42} y={97} textAnchor="middle" fontSize={8} fill={C.token}>
                  z{i + 1}
                </text>
              ))}
              <text x={330} y={97} textAnchor="middle" fontSize={8} fill={C.token} opacity={0.5}>...z{NUM_PATCHES}</text>
              {/* 시퀀스 표시 */}
              <rect x={25} y={68} width={350} height={52} rx={8} fill="transparent" stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={200} y={62} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                입력 시퀀스: {NUM_PATCHES + 1}개 토큰
              </text>
              {/* CLS 역할 설명 */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <line x1={62} y1={113} x2={62} y2={145} stroke={C.cls} strokeWidth={1} strokeDasharray="3 2" />
                <rect x={10} y={148} width={120} height={44} rx={6} fill="var(--card)" stroke={C.cls} strokeWidth={0.5} />
                <text x={70} y={165} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.cls}>CLS 출력 → 분류 헤드</text>
                <text x={70} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">이미지 전체 표현</text>
              </motion.g>
              {/* 어텐션 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.5 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={`al-${i}`} x1={62} y1={78} x2={125 + i * 42} y2={78}
                    stroke={C.cls} strokeWidth={0.6} opacity={0.3} />
                ))}
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: 위치 인코딩 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 토큰 시퀀스 */}
              {['CLS', 'z1', 'z2', 'z3', 'z4', '...'].map((t, i) => (
                <motion.g key={`tk-${i}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}>
                  <rect x={20 + i * 68} y={30} width={58} height={28} rx={14}
                    fill={i === 0 ? C.cls + '15' : C.token + '12'}
                    stroke={i === 0 ? C.cls : C.token} strokeWidth={0.8} />
                  <text x={49 + i * 68} y={48} textAnchor="middle" fontSize={9}
                    fill={i === 0 ? C.cls : C.token} fontWeight={600}>{t}</text>
                </motion.g>
              ))}
              {/* + 기호 */}
              <text x={240} y={80} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.pos}>+</text>
              {/* 위치 인코딩 */}
              {['E0', 'E1', 'E2', 'E3', 'E4', '...'].map((t, i) => (
                <motion.g key={`pe-${i}`} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}>
                  <rect x={20 + i * 68} y={90} width={58} height={28} rx={14}
                    fill={C.pos + '12'} stroke={C.pos} strokeWidth={0.8} />
                  <text x={49 + i * 68} y={108} textAnchor="middle" fontSize={9}
                    fill={C.pos} fontWeight={600}>{t}</text>
                </motion.g>
              ))}
              <text x={455} y={108} textAnchor="middle" fontSize={8} fill={C.pos} opacity={0.6}>학습 가능</text>
              {/* = 결과 */}
              <text x={240} y={140} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--foreground)">=</text>
              <rect x={60} y={150} width={360} height={32} rx={16} fill={C.pos + '08'} stroke={C.pos} strokeWidth={0.8} />
              <text x={240} y={170} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.pos}>
                위치 정보가 포함된 최종 입력 시퀀스 → Transformer Encoder
              </text>
              {/* 수식 */}
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                z₀ = [CLS; p₁E; p₂E; ...] + E_pos
              </text>
            </motion.g>
          )}

          {/* Step 4: 패치 크기 영향 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 3가지 패치 크기 비교 */}
              {[
                { size: 32, tokens: 49, x: 20, color: '#10b981' },
                { size: 16, tokens: 196, x: 170, color: '#f59e0b' },
                { size: 14, tokens: 256, x: 320, color: '#ef4444' },
              ].map((cfg, idx) => {
                const grid = Math.round(224 / cfg.size);
                const cellSz = Math.min(80 / grid, 16);
                const gridW = grid * cellSz;
                const offsetX = cfg.x + (120 - gridW) / 2;
                return (
                  <motion.g key={cfg.size} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.15 }}>
                    <rect x={cfg.x} y={25} width={120} height={140} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                    <text x={cfg.x + 60} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={cfg.color}>
                      {cfg.size}x{cfg.size}
                    </text>
                    {/* 그리드 */}
                    {Array.from({ length: Math.min(grid, 8) }).map((_, r) =>
                      Array.from({ length: Math.min(grid, 8) }).map((_, c) => (
                        <rect key={`g-${idx}-${r}-${c}`}
                          x={offsetX + c * cellSz} y={50 + r * cellSz}
                          width={cellSz - 1} height={cellSz - 1} rx={1}
                          fill={cfg.color + '18'} stroke={cfg.color} strokeWidth={0.3} />
                      ))
                    )}
                    <text x={cfg.x + 60} y={145} textAnchor="middle" fontSize={9} fontWeight={600} fill={cfg.color}>
                      {cfg.tokens} 토큰
                    </text>
                    <text x={cfg.x + 60} y={158} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                      {idx === 0 ? '빠름, 거칠음' : idx === 1 ? '균형 (기본)' : '세밀, 느림'}
                    </text>
                  </motion.g>
                );
              })}
              {/* O(n²) 경고 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  어텐션 복잡도 O(n²) — 토큰 수 2배 → 연산 4배
                </text>
                <text x={240} y={205} textAnchor="middle" fontSize={8} fill="#ef4444">
                  14x14: 256² = 65,536 어텐션 쌍 vs 32x32: 49² = 2,401 어텐션 쌍
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
