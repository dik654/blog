import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.2} markerEnd="url(#ov-arrow)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ ...sp, delay }} />
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ov-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">단일 행 vs 이벤트 시퀀스</text>

              {/* 단일 행 테이블 */}
              <text x={120} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.event}>
                전통 테이블 (1행 = 1샘플)</text>
              {['피처A', '피처B', '피처C', '타겟'].map((h, i) => (
                <g key={h}>
                  <rect x={30 + i * 55} y={54} width={50} height={18} rx={3}
                    fill={i === 3 ? '#ef444420' : '#6366f120'} stroke={i === 3 ? '#ef4444' : COLORS.event}
                    strokeWidth={0.5} />
                  <text x={55 + i * 55} y={66} textAnchor="middle" fontSize={8} fill="var(--foreground)">{h}</text>
                </g>
              ))}
              <rect x={30} y={74} width={220} height={16} rx={2} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={140} y={85} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                0.5 | 3.2 | high | 12.5
              </text>
              <AlertBox x={60} y={98} w={120} h={30} label="맥락 없음" sub="이전 행과 무관" color="#ef4444" />

              {/* 이벤트 시퀀스 */}
              <text x={380} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.pass}>
                이벤트 시퀀스 (N행 = 1샘플)</text>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <rect x={300 + i * 35} y={56 + i * 12} width={30} height={14} rx={3}
                    fill={`${COLORS.pass}20`} stroke={COLORS.pass} strokeWidth={0.5} />
                  <text x={315 + i * 35} y={66 + i * 12} textAnchor="middle" fontSize={7}
                    fill={COLORS.pass}>e{i + 1}</text>
                </motion.g>
              ))}
              {[0, 1, 2, 3].map(i => (
                <Arrow key={i} x1={330 + i * 35} y1={68 + i * 12} x2={302 + (i + 1) * 35}
                  y2={60 + (i + 1) * 12} color={COLORS.pass} delay={i * 0.08 + 0.1} />
              ))}
              <DataBox x={340} y={130} w={100} h={26} label="순서 = 문맥" sub="시간 흐름 보존" color={COLORS.pass} />

              <text x={250} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                단일 행은 "지금"만 본다. 시퀀스는 "여기까지의 흐름"을 본다.
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">K리그 패스 체인 시퀀스</text>

              {/* 축구 필드 미니맵 */}
              <rect x={30} y={35} width={200} height={130} rx={6} fill="#16a34a08"
                stroke="#16a34a" strokeWidth={0.8} />
              <line x1={130} y1={35} x2={130} y2={165} stroke="#16a34a" strokeWidth={0.4} strokeDasharray="3 2" />
              <circle cx={130} cy={100} r={18} fill="none" stroke="#16a34a" strokeWidth={0.4} />
              <text x={130} y={30} textAnchor="middle" fontSize={8} fill={COLORS.pass}>피치 (좌표계)</text>

              {/* 패스 포인트들 */}
              {[
                { x: 60, y: 120, label: 'P1' },
                { x: 95, y: 85, label: 'P2' },
                { x: 140, y: 70, label: 'P3' },
                { x: 180, y: 95, label: 'P4' },
                { x: 200, y: 60, label: '?' },
              ].map((p, i) => (
                <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <circle cx={p.x} cy={p.y} r={i === 4 ? 8 : 6}
                    fill={i === 4 ? '#ef4444' : COLORS.pass} opacity={i === 4 ? 0.3 : 0.8} />
                  <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize={7} fontWeight={600}
                    fill="#fff">{p.label}</text>
                </motion.g>
              ))}
              {[0, 1, 2].map(i => {
                const pts = [{ x: 60, y: 120 }, { x: 95, y: 85 }, { x: 140, y: 70 }, { x: 180, y: 95 }];
                return <Arrow key={i} x1={pts[i].x + 5} y1={pts[i].y - 3}
                  x2={pts[i + 1].x - 5} y2={pts[i + 1].y + 3}
                  color={COLORS.pass} delay={i * 0.12 + 0.1} />;
              })}
              <motion.line x1={183} y1={92} x2={195} y2={65}
                stroke="#ef4444" strokeWidth={1.2} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.5 }} />

              {/* 이벤트 테이블 */}
              <text x={370} y={45} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.event}>
                이벤트 레코드</text>
              {['t', 'x', 'y', '선수', '유형'].map((h, i) => (
                <g key={h}>
                  <rect x={275 + i * 40} y={52} width={38} height={16} rx={2}
                    fill={`${COLORS.event}15`} stroke={COLORS.event} strokeWidth={0.4} />
                  <text x={294 + i * 40} y={63} textAnchor="middle" fontSize={7}
                    fontWeight={600} fill={COLORS.event}>{h}</text>
                </g>
              ))}
              {[0, 1, 2, 3].map(r => (
                <g key={r}>
                  <rect x={275} y={70 + r * 16} width={198} height={14} rx={1}
                    fill={r % 2 === 0 ? 'var(--card)' : 'transparent'} />
                  {[`${r * 3}s`, `${[30, 48, 65, 82][r]}`, `${[62, 45, 35, 50][r]}`,
                    `#${[7, 10, 9, 7][r]}`, '패스'].map((v, c) => (
                    <text key={c} x={294 + c * 40} y={80 + r * 16} textAnchor="middle"
                      fontSize={7} fill="var(--foreground)">{v}</text>
                  ))}
                </g>
              ))}

              <text x={370} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                4개 패스의 궤적 → 다음 목적지 (x, y) 예측
              </text>
              <DataBox x={310} y={165} w={120} h={26} label="시퀀스 길이 = 4" sub="고정 or 가변" color={COLORS.pass} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">창고 주문 시퀀스</text>

              {/* 창고 그리드 */}
              <text x={110} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.warehouse}>
                구역 레이아웃</text>
              {['A', 'B', 'C', 'D'].map((zone, i) => (
                <motion.g key={zone} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={30 + (i % 2) * 90} y={50 + Math.floor(i / 2) * 55} width={80} height={45} rx={5}
                    fill={`${COLORS.warehouse}10`} stroke={COLORS.warehouse} strokeWidth={0.6} />
                  <text x={70 + (i % 2) * 90} y={76 + Math.floor(i / 2) * 55} textAnchor="middle"
                    fontSize={14} fontWeight={700} fill={COLORS.warehouse} opacity={0.4}>{zone}</text>
                </motion.g>
              ))}
              {/* 경로 */}
              {[
                { x1: 70, y1: 72, x2: 70, y2: 105, d: 0 },
                { x1: 70, y1: 125, x2: 160, y2: 125, d: 0.15 },
                { x1: 160, y1: 125, x2: 160, y2: 72, d: 0.3 },
              ].map((l, i) => (
                <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ ...sp, delay: l.d }} />
              ))}
              <text x={110} y={170} textAnchor="middle" fontSize={8} fill="#ef4444">
                A→A→B 경로 = 충돌 위험
              </text>

              {/* 시퀀스 */}
              <text x={370} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.event}>
                주문 시퀀스 (로봇 #3)</text>
              {[
                { t: '00:00', zone: 'A', item: '소형' },
                { t: '00:42', zone: 'A', item: '중형' },
                { t: '01:15', zone: 'A', item: '소형' },
                { t: '02:03', zone: 'B', item: '대형' },
              ].map((ev, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <ActionBox x={280} y={52 + i * 32} w={180} h={26}
                    label={`${ev.t} | ${ev.zone}구역 | ${ev.item}`} color={COLORS.warehouse} />
                </motion.g>
              ))}

              <AlertBox x={300} y={185} w={150} h={28} label="A구역 3연속 → 충돌 ×2.3"
                sub="" color="#ef4444" />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">유저 클릭 로그 시퀀스</text>

              {/* 세션 타임라인 */}
              <text x={250} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.click}>
                세션 A: 전환 성공</text>
              <line x1={40} y1={65} x2={460} y2={65} stroke="var(--border)" strokeWidth={0.8} />
              {[
                { x: 60, label: '검색', icon: '🔍', t: '0s' },
                { x: 160, label: '상품', icon: '📦', t: '12s' },
                { x: 260, label: '상품', icon: '📦', t: '45s' },
                { x: 360, label: '장바구니', icon: '🛒', t: '68s' },
                { x: 440, label: '결제', icon: '💳', t: '90s' },
              ].map((ev, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <circle cx={ev.x} cy={65} r={5} fill={COLORS.click} />
                  <text x={ev.x} y={58} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill={COLORS.click}>{ev.label}</text>
                  <text x={ev.x} y={80} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">{ev.t}</text>
                </motion.g>
              ))}

              {/* 세션 B: 이탈 */}
              <text x={250} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
                세션 B: 이탈</text>
              <line x1={40} y1={128} x2={460} y2={128} stroke="var(--border)" strokeWidth={0.8} />
              {[
                { x: 60, label: '검색', t: '0s' },
                { x: 160, label: '검색', t: '5s' },
                { x: 260, label: '검색', t: '8s' },
              ].map((ev, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 + 0.3 }}>
                  <circle cx={ev.x} cy={128} r={5} fill="#ef4444" />
                  <text x={ev.x} y={121} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill="#ef4444">{ev.label}</text>
                  <text x={ev.x} y={143} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">{ev.t}</text>
                </motion.g>
              ))}
              <motion.text x={340} y={133} fontSize={9} fill="#ef4444" fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                ✕ 이탈
              </motion.text>

              <text x={250} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 "검색 3회"도 시간 간격과 다음 행동이 다르면 전혀 다른 의미
              </text>
              <DataBox x={150} y={185} w={200} h={26} label="시퀀스 패턴 = 행동 의도 신호"
                sub="" color={COLORS.click} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">시퀀스 모델링 3가지 접근</text>

              {/* 원본 시퀀스 */}
              <DataBox x={180} y={30} w={140} h={26} label="이벤트 시퀀스 (가변 길이)"
                sub="" color={COLORS.event} />

              {/* 3갈래 */}
              {[0, 1, 2].map(i => (
                <Arrow key={i} x1={250} y1={58} x2={[90, 250, 410][i]} y2={82}
                  color={[COLORS.pass, COLORS.warehouse, COLORS.approach][i]} delay={i * 0.1} />
              ))}

              {/* 인코딩 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                <ModuleBox x={40} y={85} w={100} h={40} label="① 인코딩" sub="패딩+임베딩" color={COLORS.pass} />
                {[0, 1, 2, 3, 4].map(i => (
                  <rect key={i} x={50 + i * 17} y={135} width={14} height={14} rx={2}
                    fill={i < 3 ? `${COLORS.pass}40` : `${COLORS.pass}15`}
                    stroke={COLORS.pass} strokeWidth={0.4} />
                ))}
                <text x={90} y={162} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  고정 길이 텐서
                </text>
                <ActionBox x={50} y={170} w={80} h={24} label="RNN / 1D-CNN" color={COLORS.pass} />
              </motion.g>

              {/* 집계 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <ModuleBox x={200} y={85} w={100} h={40} label="② 집계" sub="통계+n-gram" color={COLORS.warehouse} />
                {['평균', '최빈', 'cnt', 'n-gram'].map((l, i) => (
                  <DataBox key={i} x={205 + (i % 2) * 50} y={132 + Math.floor(i / 2) * 22} w={45} h={18}
                    label={l} color={COLORS.warehouse} />
                ))}
                <ActionBox x={215} y={180} w={80} h={24} label="GBM 입력" color={COLORS.warehouse} />
              </motion.g>

              {/* Transformer */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={360} y={85} w={100} h={40} label="③ Transformer" sub="Self-Attention" color={COLORS.approach} />
                {[0, 1, 2].map(i => (
                  <motion.g key={i}>
                    <rect x={375 + i * 28} y={135} width={22} height={22} rx={4}
                      fill={`${COLORS.approach}20`} stroke={COLORS.approach} strokeWidth={0.5} />
                    <text x={386 + i * 28} y={149} textAnchor="middle" fontSize={7}
                      fill={COLORS.approach}>T{i + 1}</text>
                  </motion.g>
                ))}
                {/* attention lines */}
                {[0, 1].map(i => (
                  <motion.line key={i} x1={386 + i * 28} y1={140} x2={386 + (i + 1) * 28} y2={140}
                    stroke={COLORS.approach} strokeWidth={0.5} strokeDasharray="2 1"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                    transition={{ ...sp, delay: 0.4 + i * 0.1 }} />
                ))}
                <text x={410} y={170} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  토큰 간 어텐션
                </text>
                <ActionBox x={370} y={180} w={80} h={24} label="CLS 풀링" color={COLORS.approach} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
