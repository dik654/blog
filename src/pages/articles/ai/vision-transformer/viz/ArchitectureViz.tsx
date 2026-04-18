import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, C } from './ArchitectureVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function ArchitectureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: ViT 기본 구조 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Patch Embedding */}
              <ActionBox x={10} y={80} w={75} h={42} label="Patch" sub="Embed" color={C.vit} />
              {/* CLS + Pos */}
              <motion.line x1={88} y1={101} x2={110} y2={101} stroke={C.vit} strokeWidth={1.2} markerEnd="url(#arrA)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
              <defs><marker id="arrA" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={C.vit} /></marker></defs>
              <DataBox x={112} y={85} w={55} h={32} label="+CLS" sub="+Pos" color={C.vit} />
              {/* Transformer Encoder x L */}
              <motion.line x1={170} y1={101} x2={190} y2={101} stroke={C.vit} strokeWidth={1.2} markerEnd="url(#arrA)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
              <rect x={195} y={40} width={170} height={130} rx={8} fill={C.vit + '06'} stroke={C.vit} strokeWidth={0.8} />
              <text x={280} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vit}>Transformer Encoder x L</text>
              {/* 내부 구조 */}
              {[
                { y: 68, label: 'LayerNorm', color: C.layer },
                { y: 90, label: 'Multi-Head SA', color: C.vit },
                { y: 112, label: 'LayerNorm', color: C.layer },
                { y: 134, label: 'MLP (GELU)', color: C.vit },
              ].map((b, i) => (
                <motion.g key={b.label + i} initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}>
                  <rect x={210} y={b.y} width={140} height={18} rx={4}
                    fill={b.color + '12'} stroke={b.color} strokeWidth={0.5} />
                  <text x={280} y={b.y + 13} textAnchor="middle" fontSize={8} fill={b.color} fontWeight={600}>{b.label}</text>
                </motion.g>
              ))}
              {/* 잔차 연결 표시 */}
              <motion.path d="M205,80 C195,80 195,100 205,100" fill="none" stroke={C.vit} strokeWidth={0.8} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
              <motion.path d="M205,120 C195,120 195,140 205,140" fill="none" stroke={C.vit} strokeWidth={0.8} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
              <text x={192} y={93} textAnchor="middle" fontSize={7} fill={C.vit}>+</text>
              <text x={192} y={133} textAnchor="middle" fontSize={7} fill={C.vit}>+</text>
              {/* MLP Head */}
              <motion.line x1={368} y1={101} x2={390} y2={101} stroke={C.vit} strokeWidth={1.2} markerEnd="url(#arrA)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
              <ModuleBox x={393} y={77} w={78} h={48} label="MLP Head" sub="분류 출력" color={C.vit} />
            </motion.g>
          )}

          {/* Step 1: DeiT */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 교사 모델 */}
              <ModuleBox x={15} y={20} w={90} h={42} label="Teacher" sub="RegNet (CNN)" color={C.deit} />
              {/* 학생 모델 */}
              <rect x={15} y={85} width={450} height={55} rx={8} fill={C.deit + '06'} stroke={C.deit} strokeWidth={0.8} />
              <text x={240} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.deit}>DeiT (Student)</text>
              {/* 토큰 시퀀스 */}
              {[
                { label: '[CLS]', color: '#ef4444', x: 30 },
                { label: '[DIS]', color: C.deit, x: 95 },
                { label: 'p₁', color: '#10b981', x: 160 },
                { label: 'p₂', color: '#10b981', x: 210 },
                { label: '...', color: '#64748b', x: 260 },
              ].map(t => (
                <motion.g key={t.label} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}>
                  <rect x={t.x} y={110} width={50} height={22} rx={11}
                    fill={t.color + '15'} stroke={t.color} strokeWidth={0.8} />
                  <text x={t.x + 25} y={124} textAnchor="middle" fontSize={9} fill={t.color} fontWeight={600}>{t.label}</text>
                </motion.g>
              ))}
              {/* 증류 화살표 */}
              <motion.line x1={60} y1={62} x2={120} y2={110} stroke={C.deit} strokeWidth={1.2}
                strokeDasharray="4 3" markerEnd="url(#arrD)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
              <defs><marker id="arrD" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={C.deit} /></marker></defs>
              <text x={110} y={80} fontSize={8} fill={C.deit} fontWeight={600}>지식 증류</text>
              {/* 데이터 증강 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={310} y={110} width={140} height={22} rx={6} fill="var(--card)" stroke={C.deit} strokeWidth={0.5} />
                <text x={380} y={124} textAnchor="middle" fontSize={8} fill={C.deit}>
                  RandAug + Mixup + CutMix
                </text>
              </motion.g>
              {/* 핵심 메시지 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={130} y={155} width={220} height={40} rx={8} fill="var(--card)" stroke={C.deit} strokeWidth={0.8} />
                <text x={240} y={172} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.deit}>
                  JFT-300M 불필요
                </text>
                <text x={240} y={186} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  ImageNet 120만 장으로 ViT 수준 성능
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: Swin Transformer */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Window Attention */}
              <text x={80} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.swin}>Window Attention</text>
              <rect x={15} y={30} width={130} height={100} rx={4} fill={C.swin + '06'} stroke={C.swin} strokeWidth={0.5} />
              {/* 4개 윈도우 */}
              {[0, 1].map(r =>
                [0, 1].map(c => (
                  <motion.rect key={`w-${r}-${c}`} x={20 + c * 62} y={35 + r * 47}
                    width={56} height={42} rx={4}
                    fill={C.swin + '12'} stroke={C.swin} strokeWidth={1}
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (r * 2 + c) * 0.1 }} />
                ))
              )}
              <text x={80} y={140} textAnchor="middle" fontSize={8} fill={C.swin}>7x7 윈도우 내 어텐션</text>
              <text x={80} y={152} textAnchor="middle" fontSize={8} fill={C.swin} fontWeight={600}>O(n) 선형 복잡도</text>

              {/* Shifted Window */}
              <text x={240} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.swin}>Shifted Window</text>
              <rect x={175} y={30} width={130} height={100} rx={4} fill={C.swin + '06'} stroke={C.swin} strokeWidth={0.5} />
              {[0, 1].map(r =>
                [0, 1].map(c => (
                  <motion.rect key={`sw-${r}-${c}`} x={195 + c * 55} y={48 + r * 40}
                    width={48} height={35} rx={4}
                    fill={C.swin + '12'} stroke={C.swin} strokeWidth={1}
                    strokeDasharray="4 2"
                    initial={{ x: 0, y: 0 }} animate={{ x: 8, y: 5 }}
                    transition={{ delay: 0.3, duration: 0.6 }} />
                ))
              )}
              <text x={240} y={140} textAnchor="middle" fontSize={8} fill={C.swin}>3.5px 이동</text>
              <text x={240} y={152} textAnchor="middle" fontSize={8} fill={C.swin} fontWeight={600}>윈도우 간 정보 교환</text>

              {/* 계층 구조 */}
              <text x={400} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.swin}>4단계 계층</text>
              {[
                { w: 60, h: 50, label: 'Stage 1', sub: 'H/4', y: 30 },
                { w: 50, h: 40, label: 'Stage 2', sub: 'H/8', y: 85 },
                { w: 40, h: 30, label: 'Stage 3', sub: 'H/16', y: 130 },
                { w: 30, h: 22, label: 'Stage 4', sub: 'H/32', y: 165 },
              ].map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}>
                  <rect x={400 - s.w / 2} y={s.y} width={s.w} height={s.h} rx={4}
                    fill={C.swin + '15'} stroke={C.swin} strokeWidth={0.8} />
                  <text x={400} y={s.y + s.h / 2 + (s.sub ? -2 : 4)} textAnchor="middle" fontSize={8} fill={C.swin} fontWeight={600}>{s.label}</text>
                  {s.sub && <text x={400} y={s.y + s.h / 2 + 9} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{s.sub}</text>}
                  {i < 3 && <line x1={400} y1={s.y + s.h} x2={400} y2={s.y + s.h + 5} stroke={C.swin} strokeWidth={0.8} />}
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 3: BEiT */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 이미지 패치 */}
              <rect x={15} y={40} width={80} height={80} rx={4} fill={C.beit + '08'} stroke={C.beit} strokeWidth={0.8} />
              {[0, 1, 2, 3].map(r =>
                [0, 1, 2, 3].map(c => {
                  const masked = (r === 0 && c === 1) || (r === 1 && c === 0) || (r === 1 && c === 2) ||
                    (r === 2 && c === 3) || (r === 3 && c === 0) || (r === 3 && c === 2);
                  return (
                    <motion.rect key={`bp-${r}-${c}`} x={17 + c * 19} y={42 + r * 19}
                      width={17} height={17} rx={2}
                      fill={masked ? '#94a3b820' : C.beit + '18'}
                      stroke={masked ? '#94a3b8' : C.beit} strokeWidth={0.6}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: (r * 4 + c) * 0.02 }} />
                  );
                })
              )}
              <text x={55} y={32} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.beit}>40% 마스킹</text>

              {/* dVAE 토큰화 */}
              <line x1={100} y1={80} x2={130} y2={60} stroke={C.beit} strokeWidth={1} markerEnd="url(#arrB)" />
              <defs><marker id="arrB" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={C.beit} /></marker></defs>
              <ActionBox x={135} y={35} w={80} h={38} label="dVAE" sub="시각 토큰화" color={C.beit} />

              {/* ViT 인코더 */}
              <line x1={100} y1={80} x2={130} y2={110} stroke={C.beit} strokeWidth={1} markerEnd="url(#arrB)" />
              <ModuleBox x={135} y={95} w={80} h={42} label="ViT Encoder" sub="마스킹 패치" color={C.beit} />

              {/* 예측 */}
              <line x1={218} y1={55} x2={290} y2={80} stroke={C.beit} strokeWidth={1} strokeDasharray="3 2" />
              <line x1={218} y1={116} x2={290} y2={80} stroke={C.beit} strokeWidth={1} markerEnd="url(#arrB)" />
              <DataBox x={295} y={65} w={90} h={32} label="토큰 예측" sub="마스킹 위치" color={C.beit} outlined />

              {/* BERT 비유 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={280} y={130} width={180} height={60} rx={8} fill="var(--card)" stroke={C.beit} strokeWidth={0.5} />
                <text x={370} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.beit}>BERT의 MLM을 비전에 적용</text>
                <text x={370} y={166} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">라벨 없이 대규모 이미지에서</text>
                <text x={370} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">표현(representation) 학습</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 4: MAE */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 입력: 75% 마스킹 */}
              {[0, 1, 2, 3].map(r =>
                [0, 1, 2, 3].map(c => {
                  const visible = (r === 0 && c === 0) || (r === 1 && c === 3) ||
                    (r === 2 && c === 1) || (r === 3 && c === 2);
                  return (
                    <motion.rect key={`m-${r}-${c}`} x={15 + c * 22} y={35 + r * 22}
                      width={20} height={20} rx={3}
                      fill={visible ? C.mae + '30' : '#e2e8f015'}
                      stroke={visible ? C.mae : '#94a3b830'}
                      strokeWidth={visible ? 1.2 : 0.5}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: (r * 4 + c) * 0.02 }} />
                  );
                })
              )}
              <text x={59} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mae}>75% 마스킹</text>
              <text x={59} y={140} textAnchor="middle" fontSize={8} fill={C.mae}>보이는 25%만</text>

              {/* 인코더: 25%만 처리 */}
              <line x1={108} y1={72} x2={128} y2={72} stroke={C.mae} strokeWidth={1.2} markerEnd="url(#arrM)" />
              <defs><marker id="arrM" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={C.mae} /></marker></defs>
              <ModuleBox x={132} y={48} w={85} h={48} label="Encoder" sub="25% 토큰만" color={C.mae} />

              {/* 디코더: 마스킹 복원 */}
              <line x1={220} y1={72} x2={250} y2={72} stroke={C.mae} strokeWidth={1.2} markerEnd="url(#arrM)" />
              <ModuleBox x={255} y={48} w={85} h={48} label="Decoder" sub="전체 복원" color={C.mae} />

              {/* 복원 결과 */}
              <line x1={343} y1={72} x2={363} y2={72} stroke={C.mae} strokeWidth={1.2} markerEnd="url(#arrM)" />
              {[0, 1, 2, 3].map(r =>
                [0, 1, 2, 3].map(c => (
                  <motion.rect key={`r-${r}-${c}`} x={368 + c * 22} y={35 + r * 22}
                    width={20} height={20} rx={3}
                    fill={C.mae + '20'} stroke={C.mae} strokeWidth={0.8}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + (r * 4 + c) * 0.03 }} />
                ))
              )}
              <text x={412} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mae}>복원</text>

              {/* 핵심 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={120} y={130} width={240} height={55} rx={8} fill="var(--card)" stroke={C.mae} strokeWidth={0.5} />
                <text x={240} y={148} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mae}>높은 마스킹 비율(75%)이 핵심</text>
                <text x={240} y={164} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  쉬운 보간 방지 → 의미적 이해 강제
                </text>
                <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  사전학습 효율 4배 향상 (인코더 연산량 75% 절감)
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
