import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { DataBox, ActionBox, ModuleBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './EncodingVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function EncodingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">가변 길이 시퀀스 문제</text>

              {/* 유저 A: 짧은 시퀀스 */}
              <text x={40} y={48} fontSize={9} fontWeight={600} fill={COLORS.event}>유저 A</text>
              {[0, 1, 2].map(i => (
                <motion.rect key={i} x={90 + i * 40} y={36} width={34} height={22} rx={4}
                  fill={`${COLORS.event}25`} stroke={COLORS.event} strokeWidth={0.6}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: i * 0.08 }} />
              ))}
              {[0, 1, 2].map(i => (
                <text key={`t${i}`} x={107 + i * 40} y={50} textAnchor="middle"
                  fontSize={8} fill={COLORS.event}>e{i + 1}</text>
              ))}
              <text x={225} y={50} fontSize={8} fill="var(--muted-foreground)">len=3</text>

              {/* 유저 B: 긴 시퀀스 */}
              <text x={40} y={90} fontSize={9} fontWeight={600} fill={COLORS.event}>유저 B</text>
              {Array.from({ length: 12 }, (_, i) => (
                <motion.rect key={i} x={90 + i * 30} y={78} width={26} height={22} rx={4}
                  fill={`${COLORS.event}25`} stroke={COLORS.event} strokeWidth={0.6}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: i * 0.04 }} />
              ))}
              <text x={465} y={92} fontSize={8} fill="var(--muted-foreground)">len=12</text>

              {/* 모델 입력 */}
              <AlertBox x={150} y={120} w={200} h={34} label="모델: 고정 크기 텐서 필요"
                sub="(batch, max_len, features)" color="#ef4444" />

              <text x={250} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                배치 내 시퀀스 길이가 다르면 텐서로 묶을 수 없다 → 패딩 또는 잘라내기 필요
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">패딩 & 트렁케이션 (max_len=8)</text>

              {/* 짧은 시퀀스 → 패딩 */}
              <text x={40} y={48} fontSize={9} fontWeight={600} fill={COLORS.event}>짧은 시퀀스</text>
              {Array.from({ length: 8 }, (_, i) => {
                const isPad = i >= 3;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.06 }}>
                    <rect x={40 + i * 52} y={56} width={48} height={24} rx={4}
                      fill={isPad ? `${COLORS.pad}20` : `${COLORS.event}25`}
                      stroke={isPad ? COLORS.pad : COLORS.event}
                      strokeWidth={0.6} strokeDasharray={isPad ? '3 2' : 'none'} />
                    <text x={64 + i * 52} y={71} textAnchor="middle" fontSize={8}
                      fill={isPad ? COLORS.pad : COLORS.event}>
                      {isPad ? 'PAD' : `e${i + 1}`}
                    </text>
                  </motion.g>
                );
              })}

              {/* 긴 시퀀스 → 트렁케이션 */}
              <text x={40} y={106} fontSize={9} fontWeight={600} fill={COLORS.event}>긴 시퀀스</text>
              {/* 버려지는 부분 */}
              {[0, 1, 2, 3].map(i => (
                <motion.g key={i} initial={{ opacity: 0.6 }} animate={{ opacity: 0.2 }}
                  transition={{ ...sp, delay: 0.3 }}>
                  <rect x={40 + i * 30} y={114} width={26} height={20} rx={3}
                    fill={`${COLORS.pad}15`} stroke={COLORS.pad} strokeWidth={0.4} />
                  <text x={53 + i * 30} y={127} textAnchor="middle" fontSize={7}
                    fill={COLORS.pad}>e{i + 1}</text>
                </motion.g>
              ))}
              <motion.line x1={158} y1={114} x2={158} y2={134} stroke="#ef4444"
                strokeWidth={1.5} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }} />
              <text x={165} y={126} fontSize={7} fill="#ef4444">✂</text>
              {/* 유지되는 부분 */}
              {Array.from({ length: 8 }, (_, i) => (
                <motion.g key={`k${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.05 }}>
                  <rect x={175 + i * 38} y={114} width={34} height={20} rx={3}
                    fill={`${COLORS.event}25`} stroke={COLORS.event} strokeWidth={0.6} />
                  <text x={192 + i * 38} y={127} textAnchor="middle" fontSize={7}
                    fill={COLORS.event}>e{i + 5}</text>
                </motion.g>
              ))}
              <text x={350} y={108} fontSize={8} fill="var(--muted-foreground)">최근 8개만 유지</text>

              {/* 어텐션 마스크 */}
              <text x={250} y={158} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.embed}>어텐션 마스크</text>
              {Array.from({ length: 8 }, (_, i) => {
                const val = i < 3 ? 1 : 0;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.5 + i * 0.04 }}>
                    <rect x={130 + i * 32} y={164} width={28} height={18} rx={3}
                      fill={val ? `${COLORS.embed}30` : `${COLORS.pad}15`}
                      stroke={val ? COLORS.embed : COLORS.pad} strokeWidth={0.5} />
                    <text x={144 + i * 32} y={176} textAnchor="middle" fontSize={8}
                      fontWeight={600} fill={val ? COLORS.embed : COLORS.pad}>{val}</text>
                  </motion.g>
                );
              })}
              <text x={250} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                마스크=0인 위치는 어텐션 계산에서 제외 → PAD가 예측에 영향 안 줌
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">이벤트 타입 임베딩</text>

              {/* 룩업 테이블 */}
              <ModuleBox x={30} y={35} w={130} h={40} label="nn.Embedding" sub="(num_types, d_model)" color={COLORS.embed} />

              {/* 이벤트 타입들 */}
              {['패스', '슛', '드리블', '크로스', '태클'].map((t, i) => (
                <motion.g key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <DataBox x={30} y={88 + i * 24} w={55} h={20} label={t} color={COLORS.event} />
                </motion.g>
              ))}

              {/* 화살표 → 벡터 */}
              {[0, 1, 2, 3, 4].map(i => (
                <motion.line key={i} x1={88} y1={98 + i * 24} x2={140} y2={98 + i * 24}
                  stroke={COLORS.embed} strokeWidth={0.8}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.06 }} />
              ))}

              {/* 임베딩 벡터 */}
              {[0, 1, 2, 3, 4].map(i => {
                const vals = [
                  [0.3, 0.8, -0.2, 0.5],
                  [0.9, -0.4, 0.7, 0.1],
                  [0.2, 0.6, 0.4, -0.3],
                  [0.7, 0.3, -0.1, 0.8],
                  [-0.5, 0.1, 0.6, 0.2],
                ];
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.4 + i * 0.06 }}>
                    {vals[i].map((v, j) => (
                      <rect key={j} x={145 + j * 24} y={88 + i * 24} width={20} height={18} rx={2}
                        fill={v > 0 ? `${COLORS.embed}${Math.round(v * 60).toString(16).padStart(2, '0')}` :
                          `#ef4444${Math.round(-v * 60).toString(16).padStart(2, '0')}`}
                        stroke="var(--border)" strokeWidth={0.3} />
                    ))}
                    {vals[i].map((v, j) => (
                      <text key={`v${j}`} x={155 + j * 24} y={100 + i * 24} textAnchor="middle"
                        fontSize={7} fill="var(--foreground)">{v.toFixed(1)}</text>
                    ))}
                  </motion.g>
                );
              })}

              <text x={180} y={82} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.embed}>
                d_model=4 (예시)
              </text>

              {/* 유사도 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <text x={380} y={75} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.embed}>
                  벡터 공간</text>
                <circle cx={340} cy={120} r={4} fill={COLORS.event} />
                <text x={340} y={115} textAnchor="middle" fontSize={7} fill={COLORS.event}>패스</text>
                <circle cx={365} cy={130} r={4} fill={COLORS.event} />
                <text x={365} y={125} textAnchor="middle" fontSize={7} fill={COLORS.event}>크로스</text>
                <circle cx={420} cy={160} r={4} fill="#ef4444" />
                <text x={420} y={155} textAnchor="middle" fontSize={7} fill="#ef4444">태클</text>
                <circle cx={400} cy={100} r={4} fill="#ef4444" />
                <text x={400} y={95} textAnchor="middle" fontSize={7} fill="#ef4444">슛</text>

                <motion.line x1={342} y1={121} x2={363} y2={129}
                  stroke={COLORS.embed} strokeWidth={0.8} strokeDasharray="2 1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ ...sp, delay: 0.8 }} />
                <text x={370} y={145} fontSize={7} fill="var(--muted-foreground)">유사 이벤트 = 가까운 벡터</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">위치 인코딩 (Positional Encoding)</text>

              {/* sin/cos 파형 */}
              <text x={250} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.pos}>
                PE(pos, 2i) = sin(pos / 10000^(2i/d))
              </text>

              {/* 위치별 인코딩 히트맵 */}
              <text x={60} y={62} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">pos</text>
              <text x={250} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">dim →</text>
              {Array.from({ length: 8 }, (_, pos) => (
                <motion.g key={pos} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: pos * 0.06 }}>
                  <text x={60} y={78 + pos * 16} textAnchor="end" fontSize={7}
                    fill="var(--foreground)">{pos}</text>
                  {Array.from({ length: 10 }, (_, dim) => {
                    const val = dim % 2 === 0
                      ? Math.sin(pos / Math.pow(10000, dim / 10))
                      : Math.cos(pos / Math.pow(10000, (dim - 1) / 10));
                    const intensity = Math.round((val + 1) * 0.5 * 200);
                    return (
                      <rect key={dim} x={68 + dim * 28} y={68 + pos * 16} width={24} height={14} rx={2}
                        fill={val >= 0
                          ? `rgb(${16}, ${Math.min(185, 100 + intensity)}, ${Math.min(129, 50 + intensity / 2)})`
                          : `rgb(${Math.min(239, 100 + Math.round((1 - (val + 1) * 0.5) * 180))}, ${68 + Math.round((val + 1) * 0.5 * 80)}, ${68})`}
                        opacity={0.6} />
                    );
                  })}
                </motion.g>
              ))}

              <text x={250} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                각 위치마다 고유한 주파수 패턴 → 모델이 "몇 번째 이벤트인지" 구분
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">시간 간격(Time Delta) 인코딩</text>

              {/* 타임라인 — 불균등 간격 */}
              <text x={250} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.time}>
                이벤트 간 시간 간격이 다르다</text>
              <line x1={40} y1={65} x2={460} y2={65} stroke="var(--border)" strokeWidth={0.8} />
              {[
                { x: 60, t: '0s', dt: '' },
                { x: 110, t: '2s', dt: 'Δt=2' },
                { x: 140, t: '4s', dt: 'Δt=2' },
                { x: 300, t: '35s', dt: 'Δt=31' },
                { x: 420, t: '68s', dt: 'Δt=33' },
              ].map((ev, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <circle cx={ev.x} cy={65} r={5} fill={COLORS.event} />
                  <text x={ev.x} y={58} textAnchor="middle" fontSize={7}
                    fill={COLORS.event}>e{i + 1}</text>
                  <text x={ev.x} y={80} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">{ev.t}</text>
                  {ev.dt && (
                    <text x={ev.x - 15} y={92} textAnchor="middle" fontSize={7}
                      fill={COLORS.time}>{ev.dt}</text>
                  )}
                </motion.g>
              ))}
              {/* 간격 차이 강조 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <line x1={140} y1={70} x2={300} y2={70} stroke={COLORS.time} strokeWidth={1.5} />
                <text x={220} y={85} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.time}>31초 — 긴 공백</text>
              </motion.g>

              {/* 인코딩 과정 */}
              <text x={250} y={118} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.time}>Δt → log(Δt+1) → Linear(1, d_model)</text>
              {[2, 2, 31, 33].map((dt, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.6 + i * 0.08 }}>
                  <rect x={80 + i * 95} y={128} width={80} height={36} rx={5}
                    fill={`${COLORS.time}12`} stroke={COLORS.time} strokeWidth={0.5} />
                  <text x={120 + i * 95} y={143} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={COLORS.time}>Δt={dt}</text>
                  <text x={120 + i * 95} y={157} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">log={Math.log(dt + 1).toFixed(1)}</text>
                </motion.g>
              ))}

              <text x={250} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                log 변환 → 큰 간격과 작은 간격의 스케일 차이를 줄인다
              </text>
              <text x={250} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                "빠른 연속 패스" vs "긴 정체 후 패스"를 구별하는 핵심 신호
              </text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">최종 입력 텐서 합산</text>

              {/* 3개 컴포넌트 */}
              <ModuleBox x={30} y={38} w={130} h={36} label="이벤트 임베딩"
                sub="Embed(type)" color={COLORS.embed} />
              <ModuleBox x={185} y={38} w={130} h={36} label="위치 인코딩"
                sub="PE(pos)" color={COLORS.pos} />
              <ModuleBox x={340} y={38} w={130} h={36} label="시간 인코딩"
                sub="TE(Δt)" color={COLORS.time} />

              {/* + 기호 */}
              {[0, 1].map(i => (
                <motion.text key={i} x={[172, 327][i]} y={60} textAnchor="middle"
                  fontSize={16} fontWeight={700} fill={COLORS.final}
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>+</motion.text>
              ))}

              {/* 합산 결과 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={100} y={90} width={300} height={3} rx={1.5} fill={COLORS.final} opacity={0.6} />
                <text x={250} y={112} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.final}>input = E(type) + PE(pos) + TE(Δt)</text>
              </motion.g>

              {/* 텐서 형상 시각화 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <text x={250} y={134} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  형상: (batch, max_len, d_model)
                </text>
                {/* 작은 텐서 그리드 */}
                {Array.from({ length: 6 }, (_, row) =>
                  Array.from({ length: 8 }, (_, col) => (
                    <motion.rect key={`${row}-${col}`}
                      x={130 + col * 30} y={142 + row * 10} width={26} height={8} rx={1.5}
                      fill={col < 5 ? `${COLORS.final}30` : `${COLORS.pad}15`}
                      stroke={col < 5 ? COLORS.final : COLORS.pad} strokeWidth={0.3}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.6 + (row * 8 + col) * 0.005 }} />
                  ))
                )}
                <text x={125} y={175} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">max_len</text>
                <text x={270} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">d_model →</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
