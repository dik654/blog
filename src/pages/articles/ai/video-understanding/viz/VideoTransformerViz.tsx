import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './VideoTransformerVizData';

export default function VideoTransformerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrVT" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 시공간 토큰화 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                시공간 토큰화: 비디오 → 토큰 시퀀스
              </text>

              {/* 비디오 프레임 스택 */}
              <text x={80} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.vivit}>비디오 입력</text>
              {[0, 1, 2, 3].map((t) => (
                <motion.g key={t} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: t * 0.06 }}>
                  <rect x={30 + t * 8} y={48 + t * 8} width={80} height={60} rx={4}
                    fill={`${COLORS.vivit}08`} stroke={COLORS.vivit} strokeWidth={0.8} />
                  {/* 패치 그리드 */}
                  {[0, 1].map((r) =>
                    [0, 1, 2].map((c) => (
                      <rect key={`${t}-${r}-${c}`}
                        x={36 + t * 8 + c * 24} y={54 + t * 8 + r * 24}
                        width={20} height={20} rx={2}
                        fill={`${COLORS.token}10`} stroke={COLORS.token} strokeWidth={0.4} />
                    ))
                  )}
                </motion.g>
              ))}

              {/* 화살표 */}
              <motion.line x1={150} y1={90} x2={190} y2={90}
                stroke={COLORS.flow} strokeWidth={1.2} markerEnd="url(#arrVT)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.3 }} />

              {/* 토큰 시퀀스 */}
              <text x={340} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.token}>토큰 시퀀스</text>
              {Array.from({ length: 4 }).map((_, t) => (
                <motion.g key={t} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.4 + t * 0.06 }}>
                  {[0, 1, 2, 3, 4, 5].map((p) => (
                    <rect key={p} x={200 + p * 24} y={48 + t * 22} width={20} height={18} rx={3}
                      fill={`${COLORS.token}20`} stroke={COLORS.token} strokeWidth={0.6} />
                  ))}
                  <text x={365} y={61 + t * 22} fontSize={7} fill="var(--muted-foreground)">t={t}</text>
                </motion.g>
              ))}

              {/* 수식 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={80} y={150} width={320} height={40} rx={8}
                  fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={166} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                  N = (T/t) x (H/P) x (W/P) 토큰
                </text>
                <text x={240} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  T=16, H=W=224, P=16, t=2 일 때 N = 8 x 14 x 14 = 1,568 토큰
                </text>
              </motion.g>

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                위치 임베딩(learnable)으로 각 토큰에 시공간 좌표 인코딩
              </text>
            </motion.g>
          )}

          {/* Step 1: ViViT */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.vivit}>
                ViViT — Factorised Encoder
              </text>

              {/* 프레임별 공간 인코더 */}
              {[0, 1, 2, 3].map((t) => (
                <motion.g key={t} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: t * 0.08 }}>
                  <rect x={30 + t * 110} y={35} width={95} height={55} rx={6}
                    fill={`${COLORS.spatial}08`} stroke={COLORS.spatial} strokeWidth={1} />
                  <text x={77 + t * 110} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.spatial}>
                    Spatial Encoder
                  </text>
                  {/* 패치 토큰 */}
                  {[0, 1, 2, 3].map((p) => (
                    <rect key={p} x={38 + t * 110 + p * 20} y={58} width={16} height={16} rx={3}
                      fill={`${COLORS.spatial}20`} stroke={COLORS.spatial} strokeWidth={0.4} />
                  ))}
                  <text x={77 + t * 110} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                    Frame {t}
                  </text>
                </motion.g>
              ))}

              {/* CLS 토큰 추출 */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
                {[0, 1, 2, 3].map((t) => (
                  <g key={t}>
                    <line x1={77 + t * 110} y1={95} x2={77 + t * 110} y2={112} stroke={COLORS.spatial} strokeWidth={0.8} markerEnd="url(#arrVT)" />
                    <rect x={63 + t * 110} y={115} width={28} height={18} rx={9}
                      fill={`${COLORS.vivit}20`} stroke={COLORS.vivit} strokeWidth={1} />
                    <text x={77 + t * 110} y={127} textAnchor="middle" fontSize={7} fontWeight={600} fill={COLORS.vivit}>CLS</text>
                  </g>
                ))}
              </motion.g>

              {/* 시간 인코더 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                {[0, 1, 2].map((i) => (
                  <line key={i} x1={91 + i * 110} y1={124} x2={173 + i * 110} y2={124}
                    stroke={COLORS.temporal} strokeWidth={1} strokeDasharray="2 2" />
                ))}
                <rect x={60} y={142} width={360} height={40} rx={8}
                  fill={`${COLORS.temporal}08`} stroke={COLORS.temporal} strokeWidth={1.2} />
                <text x={240} y={158} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.temporal}>
                  Temporal Encoder
                </text>
                <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  CLS 토큰 간 self-attention → 시간 관계 학습
                </text>
              </motion.g>

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                분리 이유: 전체 attention O((T x N)^2) → 분리 시 O(T x N^2) + O(T^2)
              </text>
            </motion.g>
          )}

          {/* Step 2: TimeSformer */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.timesformer}>
                TimeSformer — Divided Space-Time Attention
              </text>

              {/* 토큰 그리드: 3 frames x 4 tokens */}
              <text x={240} y={40} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                3프레임 x 4패치 = 12 토큰
              </text>
              {[0, 1, 2].map((t) =>
                [0, 1, 2, 3].map((p) => (
                  <rect key={`${t}-${p}`}
                    x={120 + p * 60} y={50 + t * 30}
                    width={50} height={22} rx={4}
                    fill={`${COLORS.timesformer}10`} stroke={COLORS.timesformer} strokeWidth={0.6} />
                ))
              )}
              {[0, 1, 2].map((t) => (
                <text key={t} x={108} y={65 + t * 30} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">t={t}</text>
              ))}
              {[0, 1, 2, 3].map((p) => (
                <text key={p} x={145 + p * 60} y={48} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">p{p}</text>
              ))}

              {/* Temporal Attention: 같은 공간 위치끼리 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                {/* p0의 3프레임 연결 */}
                <line x1={145} y1={72} x2={145} y2={80} stroke={COLORS.temporal} strokeWidth={1.5} />
                <line x1={145} y1={102} x2={145} y2={110} stroke={COLORS.temporal} strokeWidth={1.5} />
                <text x={60} y={90} fontSize={8} fontWeight={600} fill={COLORS.temporal}>Temporal Attn</text>
                <text x={60} y={100} fontSize={7} fill="var(--muted-foreground)">같은 위치, 다른 시간</text>
              </motion.g>

              {/* Spatial Attention: 같은 프레임끼리 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                {/* t=0의 4패치 연결 */}
                <line x1={170} y1={61} x2={180} y2={61} stroke={COLORS.spatial} strokeWidth={1.5} />
                <line x1={230} y1={61} x2={240} y2={61} stroke={COLORS.spatial} strokeWidth={1.5} />
                <line x1={290} y1={61} x2={300} y2={61} stroke={COLORS.spatial} strokeWidth={1.5} />
                <text x={420} y={64} fontSize={8} fontWeight={600} fill={COLORS.spatial}>Spatial Attn</text>
                <text x={420} y={74} fontSize={7} fill="var(--muted-foreground)">같은 시간, 다른 위치</text>
              </motion.g>

              {/* 계산량 비교 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={50} y={150} width={180} height={55} rx={8}
                  fill={`${COLORS.timesformer}08`} stroke={COLORS.timesformer} strokeWidth={1} />
                <text x={140} y={168} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.timesformer}>Divided Attention</text>
                <text x={140} y={182} textAnchor="middle" fontSize={8} fill="var(--foreground)">O(T x N^2 + N x T^2)</text>
                <text x={140} y={196} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">공간·시간 독립 계산</text>

                <AlertBox x={260} y={150} w={170} h={55} label="Joint Attention" sub="O((T x N)^2) — 메모리 폭발" color={COLORS.spatial} />
              </motion.g>

              <text x={240} y={225} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                각 블록에서 temporal → spatial 순서로 attention 수행
              </text>
            </motion.g>
          )}

          {/* Step 3: VideoMAE */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.videomae}>
                VideoMAE — 90% 마스킹으로 자기지도 학습
              </text>

              {/* 입력 튜블릿 그리드 */}
              <text x={80} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">입력 튜블릿</text>
              {Array.from({ length: 20 }).map((_, i) => {
                const masked = i !== 3 && i !== 11; /* 90% 마스킹: 18/20 마스킹 */
                const row = Math.floor(i / 5);
                const col = i % 5;
                return (
                  <motion.rect key={i}
                    x={20 + col * 28} y={50 + row * 28} width={24} height={24} rx={3}
                    fill={masked ? `${COLORS.mask}20` : `${COLORS.videomae}25`}
                    stroke={masked ? COLORS.mask : COLORS.videomae}
                    strokeWidth={masked ? 0.5 : 1.5}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.02 }}
                  />
                );
              })}

              {/* 화살표: 인코더 */}
              <motion.line x1={165} y1={100} x2={195} y2={100}
                stroke={COLORS.videomae} strokeWidth={1.2} markerEnd="url(#arrVT)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.4 }} />

              {/* 인코더 (10% 토큰만 처리) */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={200} y={70} w={80} h={50} label="Encoder" sub="10% 토큰만" color={COLORS.videomae} />
                <text x={240} y={136} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">연산 90% 절감</text>
              </motion.g>

              {/* 화살표: 디코더 */}
              <motion.line x1={285} y1={100} x2={315} y2={100}
                stroke={COLORS.videomae} strokeWidth={1.2} markerEnd="url(#arrVT)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.5 }} />

              {/* 디코더 → 복원 */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.4 }}>
                <ModuleBox x={320} y={70} w={80} h={50} label="Decoder" sub="전체 복원" color={COLORS.temporal} />
              </motion.g>

              {/* 복원된 그리드 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <text x={435} y={60} textAnchor="middle" fontSize={7} fontWeight={600} fill={COLORS.videomae}>복원</text>
                {Array.from({ length: 8 }).map((_, i) => {
                  const row = Math.floor(i / 2);
                  const col = i % 2;
                  return (
                    <rect key={i} x={415 + col * 22} y={65 + row * 22} width={18} height={18} rx={2}
                      fill={`${COLORS.videomae}20`} stroke={COLORS.videomae} strokeWidth={0.8} />
                  );
                })}
              </motion.g>

              {/* 왜 가능한가 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.7 }}>
                <rect x={30} y={158} width={420} height={50} rx={8}
                  fill={`${COLORS.videomae}06`} stroke={COLORS.videomae} strokeWidth={1} />
                <text x={240} y={175} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.videomae}>
                  왜 90% 마스킹이 가능한가?
                </text>
                <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--foreground)">
                  비디오는 시간 중복성(temporal redundancy)이 매우 높음
                </text>
                <text x={240} y={202} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  인접 프레임이 거의 같아서 10%만으로도 전체 복원 가능 → 학습 효율 극대화
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 4: 어텐션 패턴 비교 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                어텐션 패턴 비교
              </text>

              {[
                {
                  name: 'Joint Space-Time',
                  complexity: 'O((TN)^2)',
                  desc: '모든 토큰 간',
                  color: COLORS.spatial,
                  pro: '정확',
                  con: '메모리 폭발',
                },
                {
                  name: 'Divided (TimeSformer)',
                  complexity: 'O(TN^2 + NT^2)',
                  desc: '공간/시간 분리',
                  color: COLORS.timesformer,
                  pro: '효율적',
                  con: '교차 놓침',
                },
                {
                  name: 'Factorised (ViViT)',
                  complexity: 'O(TN^2 + T^2)',
                  desc: '인코더 자체 분리',
                  color: COLORS.vivit,
                  pro: '가장 경량',
                  con: '정보 손실',
                },
              ].map((p, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={30} y={35 + i * 55} width={420} height={48} rx={8}
                    fill={`${p.color}08`} stroke={p.color} strokeWidth={1.2} />
                  <text x={50} y={55 + i * 55} fontSize={10} fontWeight={700} fill={p.color}>{p.name}</text>
                  <text x={50} y={70 + i * 55} fontSize={8} fill="var(--muted-foreground)">{p.desc}</text>

                  {/* 복잡도 뱃지 */}
                  <rect x={240} y={42 + i * 55} width={100} height={22} rx={11}
                    fill={`${p.color}15`} stroke={p.color} strokeWidth={0.6} />
                  <text x={290} y={57 + i * 55} textAnchor="middle" fontSize={8} fontWeight={600} fill={p.color}>{p.complexity}</text>

                  {/* 장단점 */}
                  <text x={360} y={55 + i * 55} fontSize={8} fill={COLORS.videomae} fontWeight={600}>{p.pro}</text>
                  <text x={360} y={70 + i * 55} fontSize={8} fill={COLORS.spatial}>{p.con}</text>
                </motion.g>
              ))}

              {/* 실전 조언 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={50} y={205} width={380} height={28} rx={8}
                  fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={223} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
                  실전: VideoMAE 사전학습 → Divided Attention Fine-tune이 현재 주류 파이프라인
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
