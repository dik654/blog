import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  {
    label: '1. 정밀도 계층: FP32 → FP16 → INT8 → INT4',
    body: 'FP32(4바이트) → FP16(2바이트) → INT8(1바이트) → INT4(0.5바이트)\n비트 수가 절반이 될 때마다 메모리·대역폭이 절반으로 감소\n7B 모델 기준: FP32=28GB → FP16=14GB → INT8=7GB → INT4=3.5GB',
  },
  {
    label: '2. 부동소수점 vs 정수 표현',
    body: 'FP32: 부호 1비트 + 지수 8비트 + 가수 23비트 → 약 7자리 정밀도\nFP16: 부호 1비트 + 지수 5비트 + 가수 10비트 → 약 3.3자리\nINT8: -128~127 정수만 표현 → scale·zero-point로 실수 근사\nINT4: -8~7 정수만 → 16단계로 가중치 표현',
  },
  {
    label: '3. 양자화의 핵심 수식: 실수 → 정수 매핑',
    body: 'q = round(x / scale) + zero_point\nscale = (max − min) / (2^bits − 1)\nzero_point = round(−min / scale)\n역양자화: x_approx = (q − zero_point) × scale\n→ 이 과정에서 round()가 정보를 잃음 = 양자화 오차',
  },
  {
    label: '4. 왜 양자화가 작동하는가',
    body: '신경망 가중치는 대부분 0 근처에 분포 (정규분포 형태)\n극단값(outlier)은 전체의 0.1% 미만\n→ 대다수 가중치는 적은 비트로도 충분히 표현 가능\noutlier만 별도 처리하면 정확도 손실 최소화 (AWQ의 핵심 아이디어)',
  },
];

export default function PrecisionLadderViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 정밀도 계단 */}
              {[
                { label: 'FP32', bits: '32bit', mem: '28 GB', y: 10, w: 400, color: '#ef4444', pct: '100%' },
                { label: 'FP16', bits: '16bit', mem: '14 GB', y: 55, w: 300, color: '#f59e0b', pct: '50%' },
                { label: 'INT8', bits: '8bit', mem: '7 GB', y: 100, w: 200, color: '#3b82f6', pct: '25%' },
                { label: 'INT4', bits: '4bit', mem: '3.5 GB', y: 145, w: 100, color: '#10b981', pct: '12.5%' },
              ].map((p, i) => (
                <motion.g key={p.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={40} y={p.y} width={p.w} height={34} rx={6}
                    fill={`${p.color}15`} stroke={p.color} strokeWidth={1.2} />
                  <text x={50} y={p.y + 22} fontSize={12} fontWeight={700} fill={p.color}>{p.label}</text>
                  <text x={110} y={p.y + 22} fontSize={10} fill="var(--muted-foreground)">{p.bits}</text>
                  <text x={170} y={p.y + 22} fontSize={10} fill="var(--foreground)">{p.mem} (7B 모델)</text>
                  <text x={40 + p.w - 8} y={p.y + 22} textAnchor="end" fontSize={9} fill={p.color}>{p.pct}</text>
                </motion.g>
              ))}
              <motion.text x={460} y={105} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                메모리 절감 ↓
              </motion.text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* FP32 비트 레이아웃 */}
              <text x={10} y={20} fontSize={11} fontWeight={700} fill="#ef4444">FP32</text>
              <rect x={60} y={8} width={20} height={18} rx={2} fill="#ef444430" stroke="#ef4444" strokeWidth={0.8} />
              <text x={70} y={20} textAnchor="middle" fontSize={8} fill="#ef4444">S</text>
              <rect x={82} y={8} width={80} height={18} rx={2} fill="#f59e0b30" stroke="#f59e0b" strokeWidth={0.8} />
              <text x={122} y={20} textAnchor="middle" fontSize={8} fill="#f59e0b">지수 8bit</text>
              <rect x={164} y={8} width={200} height={18} rx={2} fill="#3b82f630" stroke="#3b82f6" strokeWidth={0.8} />
              <text x={264} y={20} textAnchor="middle" fontSize={8} fill="#3b82f6">가수 23bit</text>
              <text x={380} y={20} fontSize={9} fill="var(--muted-foreground)">= 정밀도 ~7자리</text>

              {/* FP16 */}
              <text x={10} y={55} fontSize={11} fontWeight={700} fill="#f59e0b">FP16</text>
              <rect x={60} y={43} width={20} height={18} rx={2} fill="#ef444430" stroke="#ef4444" strokeWidth={0.8} />
              <text x={70} y={55} textAnchor="middle" fontSize={8} fill="#ef4444">S</text>
              <rect x={82} y={43} width={50} height={18} rx={2} fill="#f59e0b30" stroke="#f59e0b" strokeWidth={0.8} />
              <text x={107} y={55} textAnchor="middle" fontSize={8} fill="#f59e0b">지수 5b</text>
              <rect x={134} y={43} width={100} height={18} rx={2} fill="#3b82f630" stroke="#3b82f6" strokeWidth={0.8} />
              <text x={184} y={55} textAnchor="middle" fontSize={8} fill="#3b82f6">가수 10bit</text>
              <text x={250} y={55} fontSize={9} fill="var(--muted-foreground)">= 정밀도 ~3.3자리</text>

              {/* INT8 */}
              <text x={10} y={95} fontSize={11} fontWeight={700} fill="#3b82f6">INT8</text>
              <rect x={60} y={83} width={20} height={18} rx={2} fill="#ef444430" stroke="#ef4444" strokeWidth={0.8} />
              <text x={70} y={95} textAnchor="middle" fontSize={8} fill="#ef4444">S</text>
              <rect x={82} y={83} width={70} height={18} rx={2} fill="#10b98130" stroke="#10b981" strokeWidth={0.8} />
              <text x={117} y={95} textAnchor="middle" fontSize={8} fill="#10b981">값 7bit</text>
              <text x={168} y={95} fontSize={9} fill="var(--muted-foreground)">−128 ~ 127 (256단계)</text>

              {/* INT4 */}
              <text x={10} y={135} fontSize={11} fontWeight={700} fill="#10b981">INT4</text>
              <rect x={60} y={123} width={20} height={18} rx={2} fill="#ef444430" stroke="#ef4444" strokeWidth={0.8} />
              <text x={70} y={135} textAnchor="middle" fontSize={8} fill="#ef4444">S</text>
              <rect x={82} y={123} width={30} height={18} rx={2} fill="#10b98130" stroke="#10b981" strokeWidth={0.8} />
              <text x={97} y={135} textAnchor="middle" fontSize={8} fill="#10b981">3b</text>
              <text x={128} y={135} fontSize={9} fill="var(--muted-foreground)">−8 ~ 7 (16단계)</text>

              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                비트 감소 → 표현 범위·정밀도 감소 → 메모리 절감
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 양자화 수식 시각화 */}
              <rect x={20} y={10} width={440} height={35} rx={6} fill="#6366f115" stroke="#6366f1" strokeWidth={1.5} />
              <text x={240} y={32} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1" fontFamily="monospace">
                q = round(x / scale) + zero_point
              </text>

              {/* scale 계산 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={30} y={58} width={200} height={28} rx={5} fill="#10b98112" stroke="#10b981" strokeWidth={1} />
                <text x={130} y={76} textAnchor="middle" fontSize={10} fill="#10b981" fontFamily="monospace">
                  scale = (max−min) / (2^b−1)
                </text>
              </motion.g>

              {/* zero_point */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={250} y={58} width={200} height={28} rx={5} fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
                <text x={350} y={76} textAnchor="middle" fontSize={10} fill="#f59e0b" fontFamily="monospace">
                  zp = round(−min / scale)
                </text>
              </motion.g>

              {/* 예시 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <text x={20} y={110} fontSize={10} fill="var(--foreground)" fontWeight={600}>예시 (INT8, 가중치 범위 −1.0 ~ 1.0):</text>
                <text x={20} y={128} fontSize={9} fill="var(--muted-foreground)" fontFamily="monospace">scale = 2.0/255 ≈ 0.00784</text>
                <text x={20} y={143} fontSize={9} fill="var(--muted-foreground)" fontFamily="monospace">zp = round(1.0/0.00784) = 128</text>
                <text x={20} y={158} fontSize={9} fill="#3b82f6" fontFamily="monospace">x=0.5 → q=round(0.5/0.00784)+128 = 192</text>
              </motion.g>

              {/* 역양자화 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.45 }}>
                <rect x={250} y={100} width={210} height={28} rx={5} fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
                <text x={355} y={118} textAnchor="middle" fontSize={10} fill="#ef4444" fontFamily="monospace">
                  x' = (q − zp) × scale
                </text>
                <text x={355} y={143} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  역양자화: 정수 → 근사 실수
                </text>
                <text x={355} y={158} textAnchor="middle" fontSize={9} fill="#ef4444">
                  round()에서 정보 손실 발생
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 가중치 분포 시각화 */}
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                신경망 가중치 분포: 대부분 0 근처 (정규분포)
              </text>

              {/* 가우시안 커브 근사 */}
              <motion.path
                d="M60,150 Q100,148 140,140 Q180,120 210,80 Q230,50 240,40 Q250,50 270,80 Q300,120 340,140 Q380,148 420,150"
                fill="#3b82f618" stroke="#3b82f6" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* 0 중심선 */}
              <line x1={240} y1={30} x2={240} y2={155} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />
              <text x={240} y={168} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">0</text>

              {/* 대다수 범위 */}
              <rect x={170} y={35} width={140} height={120} rx={4} fill="#10b98108" stroke="#10b981" strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="#10b981">99.9% 가중치 (INT8로 충분)</text>

              {/* outlier 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <circle cx={80} cy={148} r={4} fill="#ef4444" />
                <text x={80} y={140} textAnchor="middle" fontSize={8} fill="#ef4444">outlier</text>
                <circle cx={400} cy={148} r={4} fill="#ef4444" />
                <text x={400} y={140} textAnchor="middle" fontSize={8} fill="#ef4444">outlier</text>
                <text x={240} y={192} textAnchor="middle" fontSize={9} fill="#f59e0b">
                  outlier(0.1%)만 특별 처리 → 정확도 유지 (AWQ 핵심)
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
