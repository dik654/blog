import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#10b981', C2 = '#f59e0b', C3 = '#6366f1';
const MUT = 'var(--muted-foreground)';
const W = 640, CX = W / 2;
const BW = 80, BH = 48, GAP = 10;

const STEPS = [
  { label: 'Sponge 전체 흐름', body: 'rate에만 입출력, cap은 절대 외부 비노출.' },
  { label: '1. 상태 초기화', body: '상태 전체 0. rate=입출력 창구, cap=보안 버퍼.' },
  { label: '2. 흡수 — XOR', body: '메시지 블록 m₁을 rate 부분에 XOR.\ncap은 변경하지 않는다.' },
  { label: '3. 흡수 — 순열 π', body: 'XOR 후 전체 상태에 순열 π를 적용.\nrate + cap 전체를 뒤섞는 고정 함수.' },
  { label: '4. 흡수 반복', body: '다음 블록 m₂도 같은 방식: rate에 XOR → π.\n모든 메시지 블록을 처리할 때까지 반복.' },
  { label: '5. 압출 (Squeeze)', body: '모든 블록 흡수 후 rate에서 출력을 복사해 추출.\ncap은 끝까지 비노출.' },
];

function StateRow({ y, rate, cap, rateColor, label, showLabels }: {
  y: number; rate: string[]; cap: string[]; rateColor: string; label?: string; showLabels?: boolean;
}) {
  const total = rate.length + cap.length;
  const totalW = total * (BW + GAP) - GAP;
  const x0 = CX - totalW / 2;
  const rateCX = x0 + (rate.length * (BW + GAP) - GAP) / 2;
  const capCX = x0 + rate.length * (BW + GAP) + (cap.length * (BW + GAP) - GAP) / 2;

  return (
    <g>
      {label && <text x={x0 - 10} y={y + BH / 2 + 5} textAnchor="end" fontSize={13}
        fill={MUT}>{label}</text>}
      {showLabels && <>
        <text x={rateCX} y={y - 6} textAnchor="middle" fontSize={11} fill={rateColor}>rate</text>
        <text x={capCX} y={y - 6} textAnchor="middle" fontSize={11} fill={C2}>cap</text>
      </>}
      {rate.map((v, i) => (
        <g key={`r${i}`}>
          <rect x={x0 + i * (BW + GAP)} y={y} width={BW} height={BH} rx={8}
            fill={`${rateColor}12`} stroke={rateColor} strokeWidth={0.8} />
          <text x={x0 + i * (BW + GAP) + BW / 2} y={y + BH / 2 + 6}
            textAnchor="middle" fontSize={13} fontWeight={600} fill={rateColor}>{v}</text>
        </g>
      ))}
      {cap.map((v, i) => (
        <g key={`c${i}`}>
          <rect x={x0 + (rate.length + i) * (BW + GAP)} y={y} width={BW} height={BH} rx={8}
            fill={`${C2}12`} stroke={C2} strokeWidth={0.8} />
          <text x={x0 + (rate.length + i) * (BW + GAP) + BW / 2} y={y + BH / 2 + 6}
            textAnchor="middle" fontSize={13} fontWeight={600} fill={C2}>{v}</text>
        </g>
      ))}
    </g>
  );
}

export default function SpongeViz() {
  const totalW = 3 * (BW + GAP) - GAP;
  const x0 = CX - totalW / 2;

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} 300`} className="w-full max-w-3xl" style={{ height: 'auto' }}>

          {/* ═══ Step 0: overview flow ═══ */}
          {step === 0 && (() => {
            const lx = 60, rateW = 200, capW = 120, gx = 8;
            const capX = lx + rateW + gx;
            const stY = 44, bh = 34;
            return (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={CX} y={20} textAnchor="middle" fontSize={14} fontWeight={700} fill={MUT}>
                  Sponge 내부에는 "상태"가 있다 — rate와 cap 두 영역으로 나뉨
                </text>

                <rect x={lx} y={stY} width={rateW} height={bh} rx={8}
                  fill={`${C1}12`} stroke={C1} strokeWidth={1} />
                <text x={lx + rateW / 2} y={stY + bh / 2 + 5} textAnchor="middle"
                  fontSize={14} fontWeight={600} fill={C1}>rate</text>
                <rect x={capX} y={stY} width={capW} height={bh} rx={8}
                  fill={`${C2}12`} stroke={C2} strokeWidth={1} />
                <text x={capX + capW / 2} y={stY + bh / 2 + 5} textAnchor="middle"
                  fontSize={14} fontWeight={600} fill={C2}>cap</text>

                <text x={capX + capW + 16} y={stY + 14} fontSize={11} fill={C1}>
                  ← 메시지 넣고, 출력 빼는 창구
                </text>
                <text x={capX + capW + 16} y={stY + 30} fontSize={11} fill={C2}>
                  ← 외부에 절대 노출 안 됨 (보안)
                </text>

                {/* Step 0: Init */}
                <text x={lx} y={stY + bh + 20} fontSize={13} fontWeight={600} fill={MUT}>
                  ⓪ 초기화 — 모든 칸을 0으로 세팅
                </text>

                {(() => {
                  const s1 = stY + bh + 30; // offset after init label
                  return (<>
                    <text x={lx} y={s1 + 18} fontSize={13} fontWeight={600} fill={C3}>
                      ① 흡수
                    </text>
                    <rect x={lx} y={s1 + 24} width={rateW} height={26} rx={6}
                      fill={`${C3}08`} stroke={C3} strokeWidth={.7} />
                    <text x={lx + rateW / 2} y={s1 + 42} textAnchor="middle"
                      fontSize={12} fill={C3}>메시지 블록을 rate에 XOR</text>
                    <text x={capX + capW / 2} y={s1 + 42} textAnchor="middle"
                      fontSize={11} fill={C2}>변경 없음</text>

                    <line x1={CX} y1={s1 + 52} x2={CX} y2={s1 + 60}
                      stroke={C3} strokeWidth={.6} />
                    <text x={lx} y={s1 + 74} fontSize={13} fontWeight={600} fill={C3}>
                      ② 순열 π
                    </text>
                    <rect x={lx} y={s1 + 80} width={rateW + gx + capW} height={26} rx={6}
                      fill={`${C3}12`} stroke={C3} strokeWidth={1} />
                    <text x={lx + (rateW + gx + capW) / 2} y={s1 + 98} textAnchor="middle"
                      fontSize={13} fontWeight={600} fill={C3}>rate + cap 전체를 뒤섞음</text>

                    <text x={CX} y={s1 + 122} textAnchor="middle" fontSize={12} fill={MUT}>
                      ↑ 다음 블록이 있으면 ①②를 반복
                    </text>

                    <line x1={CX} y1={s1 + 128} x2={CX} y2={s1 + 136}
                      stroke={C1} strokeWidth={.6} />
                    <text x={lx} y={s1 + 150} fontSize={13} fontWeight={600} fill={C1}>
                      ③ 압출
                    </text>
                    <rect x={lx} y={s1 + 156} width={rateW} height={26} rx={6}
                      fill={`${C1}14`} stroke={C1} strokeWidth={.8} />
                    <text x={lx + rateW / 2} y={s1 + 174} textAnchor="middle"
                      fontSize={12} fontWeight={600} fill={C1}>rate에서 출력 추출</text>
                    <text x={capX + capW / 2} y={s1 + 174} textAnchor="middle"
                      fontSize={11} fill={C2}>끝까지 비노출</text>
                  </>);
                })()}
              </motion.g>
            );
          })()}

          {/* ═══ Step 1: Init — rate/cap explained inline ═══ */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={CX} y={22} textAnchor="middle" fontSize={14} fontWeight={600} fill={MUT}>
                상태 전체를 0으로 초기화
              </text>
              <StateRow y={40} rate={['0', '0']} cap={['0']} rateColor={C1} label="상태" showLabels />
              {/* Inline explanation directly under each section */}
              <text x={x0 + (2 * (BW + GAP) - GAP) / 2} y={40 + BH + 20}
                textAnchor="middle" fontSize={12} fill={C1}>
                rate = 입출력 창구
              </text>
              <text x={x0 + (2 * (BW + GAP) - GAP) / 2} y={40 + BH + 36}
                textAnchor="middle" fontSize={11} fill={MUT}>
                메시지를 여기에 XOR, 출력도 여기서 추출
              </text>
              <text x={x0 + 2 * (BW + GAP) + BW / 2} y={40 + BH + 20}
                textAnchor="middle" fontSize={12} fill={C2}>
                cap = 보안 버퍼
              </text>
              <text x={x0 + 2 * (BW + GAP) + BW / 2} y={40 + BH + 36}
                textAnchor="middle" fontSize={11} fill={MUT}>
                외부 비노출
              </text>
            </motion.g>
          )}

          {/* ═══ Step 2: XOR ═══ */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <StateRow y={26} rate={['0', '0']} cap={['0']} rateColor={C1} label="이전" showLabels />
              {['⊕ m₁[0]', '⊕ m₁[1]'].map((label, i) => (
                <text key={i} x={x0 + i * (BW + GAP) + BW / 2} y={26 + BH + 24}
                  textAnchor="middle" fontSize={14} fontWeight={600} fill={C3}>{label}</text>
              ))}
              <StateRow y={26 + BH + 36} rate={['0⊕m₁[0]', '0⊕m₁[1]']} cap={['0']}
                rateColor={C3} label="이후" />
              <text x={x0 + 2 * (BW + GAP) + BW + 12} y={26 + BH + 36 + BH / 2 + 5}
                fontSize={13} fill={C2}>← 그대로</text>
            </motion.g>
          )}

          {/* ═══ Step 3: π ═══ */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <StateRow y={20} rate={['r₀⊕m₁', 'r₁⊕m₁']} cap={['c₀']}
                rateColor={C3} label="XOR 후" showLabels />
              <rect x={x0 - 6} y={20 + BH + 14} width={totalW + 12} height={44} rx={8}
                fill={`${C3}14`} stroke={C3} strokeWidth={1.2} />
              <text x={CX} y={20 + BH + 32} textAnchor="middle" fontSize={15} fontWeight={700} fill={C3}>
                순열 π 적용
              </text>
              <text x={CX} y={20 + BH + 48} textAnchor="middle" fontSize={11} fill={MUT}>
                모든 비트를 뒤섞는 고정 함수 (Keccak-f 24라운드)
              </text>
              <StateRow y={20 + BH + 68} rate={["r₀'", "r₁'"]} cap={["c₀'"]} rateColor={C1} label="π 후" />
              <text x={CX} y={20 + BH + 68 + BH + 20} textAnchor="middle" fontSize={12} fill={MUT}>
                rate + cap 전체가 섞임
              </text>
            </motion.g>
          )}

          {/* ═══ Step 4: Repeat ═══ */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={CX} y={16} textAnchor="middle" fontSize={14} fontWeight={600} fill={C3}>
                메시지 블록마다 같은 과정 반복
              </text>
              {[
                { y: 32, rate: ["r₀'", "r₁'"], cap: ["c₀'"], label: 'm₁ 후', rc: C1 },
                { y: 106, rate: ["r₀'⊕m₂", "r₁'⊕m₂"], cap: ["c₀'"], label: '⊕m₂', rc: C3 },
                { y: 180, rate: ["r₀''", "r₁''"], cap: ["c₀''"], label: 'π 후', rc: C1 },
              ].map(({ y, rate, cap, label, rc }) => (
                <StateRow key={y} y={y} rate={rate} cap={cap} rateColor={rc} label={label} />
              ))}
              <text x={CX} y={98} textAnchor="middle" fontSize={13} fill={C3}>
                ⊕ m₂ (두 번째 블록을 rate에 XOR)
              </text>
              <text x={CX} y={172} textAnchor="middle" fontSize={13} fill={C3}>π 적용</text>
              <text x={CX} y={250} textAnchor="middle" fontSize={13} fill={MUT}>
                m₃, m₄, … 도 같은 방식 → 모든 블록 처리 완료 시 압출 단계로
              </text>
            </motion.g>
          )}

          {/* ═══ Step 5: Squeeze — simplified ═══ */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={CX} y={22} textAnchor="middle" fontSize={14} fontWeight={600} fill={C1}>
                모든 블록 흡수 완료 → rate에서 출력 추출
              </text>
              <StateRow y={40} rate={['최종 r₀', '최종 r₁']} cap={['최종 c₀']}
                rateColor={C1} label="상태" />
              {/* Simple arrows */}
              {[0, 1].map(i => (
                <line key={i} x1={x0 + i * (BW + GAP) + BW / 2} y1={40 + BH + 2}
                  x2={x0 + i * (BW + GAP) + BW / 2} y2={40 + BH + 20}
                  stroke={C1} strokeWidth={1.2} />
              ))}
              {/* Output row — simple colored boxes, no wrapping dashed box */}
              {['r₀', 'r₁'].map((v, i) => (
                <g key={i}>
                  <rect x={x0 + i * (BW + GAP)} y={40 + BH + 22} width={BW} height={BH - 6} rx={8}
                    fill={`${C1}20`} stroke={C1} strokeWidth={1.2} />
                  <text x={x0 + i * (BW + GAP) + BW / 2} y={40 + BH + 22 + (BH - 6) / 2 + 6}
                    textAnchor="middle" fontSize={15} fontWeight={700} fill={C1}>{v}</text>
                </g>
              ))}
              <text x={x0 - 10} y={40 + BH + 22 + (BH - 6) / 2 + 6} textAnchor="end"
                fontSize={13} fill={C1}>출력</text>
              <text x={x0 + 2 * (BW + GAP) + BW / 2} y={40 + BH + 22 + (BH - 6) / 2 + 6}
                textAnchor="middle" fontSize={13} fill={C2}>비노출</text>
              <text x={CX} y={40 + BH * 2 + 36} textAnchor="middle" fontSize={13} fill={MUT}>
                rate만 출력으로 복사. cap은 끝까지 외부에 드러나지 않음.
              </text>
              <text x={CX} y={40 + BH * 2 + 54} textAnchor="middle" fontSize={12} fill={MUT}>
                출력이 더 필요하면 π를 한 번 더 적용 후 다시 rate에서 추출
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
