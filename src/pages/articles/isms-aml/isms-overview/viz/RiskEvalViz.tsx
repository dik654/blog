import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '위험값 계산 공식',
    body: '위험값 = 자산 중요도 x 발생 가능성(H=3, M=2, L=1). GAP 분석 결과(현재 vs 요구 수준)가 발생 가능성 판정의 근거.',
  },
  {
    label: 'DoA 기준선과 분류',
    body: 'DoA(수용 가능 위험 수준) 이상 → 미수용 위험(보호대책 필수). DoA 이하 → 잔여 위험(경영진 승인 후 수용). DoA 기준선은 CISO가 승인.',
  },
  {
    label: '4가지 위험 처리 전략',
    body: '감소(통제 추가), 회피(활동 중단), 전가(보험/외주), 수용(경영진 서명). 비밀 등급 자산은 다중 전략 동시 적용이 원칙.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#re-arrow)" />;
}

export default function RiskEvalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="re-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Input factors */}
              <DataBox x={20} y={15} w={120} h={30} label="자산 중요도" sub="비밀=3, 대외비=2" color={C.blue} />
              <text x={180} y={35} textAnchor="middle" fontSize={16} fill="var(--muted-foreground)">x</text>
              <DataBox x={210} y={15} w={130} h={30} label="발생 가능성" sub="H=3, M=2, L=1" color={C.amber} />
              <text x={375} y={35} textAnchor="middle" fontSize={16} fill="var(--muted-foreground)">=</text>
              <ModuleBox x={395} y={10} w={75} h={40} label="위험값" sub="1~9" color={C.red} />

              {/* GAP analysis feeding likelihood */}
              <Arrow x1={275} y1={47} x2={275} y2={65} />

              <rect x={160} y={68} width={230} height={35} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={275} y={83} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>GAP 분석</text>
              <text x={275} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">현재 통제 수준 vs ISMS-P 요구 수준의 격차</text>

              {/* Example calculation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <text x={240} y={125} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">예시: 콜드월렛 개인키</text>

                <rect x={60} y={135} width={80} height={22} rx={4} fill={`${C.blue}15`} stroke={C.blue} strokeWidth={0.6} />
                <text x={100} y={150} textAnchor="middle" fontSize={9} fill={C.blue}>중요도 = 3</text>

                <text x={170} y={150} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)">x</text>

                <rect x={195} y={135} width={90} height={22} rx={4} fill={`${C.amber}15`} stroke={C.amber} strokeWidth={0.6} />
                <text x={240} y={150} textAnchor="middle" fontSize={9} fill={C.amber}>가능성 = H(3)</text>

                <text x={315} y={150} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)">=</text>

                <rect x={340} y={133} width={80} height={26} rx={6} fill={`${C.red}15`} stroke={C.red} strokeWidth={1} />
                <text x={380} y={150} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.red}>9</text>

                <text x={240} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">위험값 9 = 최고 위험 → 반드시 보호대책 적용</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">DoA 기준선에 의한 위험 분류</text>

              {/* Risk value scale */}
              <rect x={40} y={35} width={400} height={16} rx={8} fill="var(--border)" opacity={0.15} />

              {/* Accepted zone */}
              <motion.rect x={40} y={35} width={160} height={16} rx={8} fill={`${C.green}20`}
                initial={{ width: 0 }} animate={{ width: 160 }} transition={{ duration: 0.5 }} />

              {/* Unaccepted zone */}
              <motion.rect x={200} y={35} width={240} height={16} rx={0} fill={`${C.red}20`}
                initial={{ width: 0 }} animate={{ width: 240 }} transition={{ duration: 0.5, delay: 0.2 }} />

              {/* DoA threshold line */}
              <motion.line x1={200} y1={30} x2={200} y2={58} stroke={C.red} strokeWidth={2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <text x={200} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.red}>DoA = 4</text>

              {/* Scale numbers */}
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <text key={n} x={40 + (n-1) * 50} y={45} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">{n}</text>
              ))}

              {/* Two outcomes */}
              <Arrow x1={120} y1={58} x2={120} y2={85} />
              <Arrow x1={320} y1={58} x2={320} y2={85} />

              <ActionBox x={40} y={88} w={160} h={45} label="잔여 위험 수용" sub="DoA 이하" color={C.green} />
              <AlertBox x={240} y={88} w={200} h={45} label="미수용 위험" sub="보호대책 필수 적용" color={C.red} />

              {/* Requirements */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <DataBox x={45} y={145} w={150} h={24} label="경영진 서명 필수" color={C.green} />
                <DataBox x={255} y={145} w={170} h={24} label="위험 처리 계획서 작성" color={C.red} />

                <text x={120} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">수용 근거 문서화 필수</text>
                <text x={340} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2.x 보호대책과 연결</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Source: unaccepted risk */}
              <AlertBox x={160} y={5} w={160} h={32} label="미수용 위험" sub="DoA 초과 항목" color={C.red} />

              <Arrow x1={200} y1={37} x2={85} y2={60} />
              <Arrow x1={230} y1={37} x2={200} y2={60} />
              <Arrow x1={280} y1={37} x2={340} y2={60} />
              <Arrow x1={310} y1={37} x2={430} y2={60} />

              {/* 4 strategies */}
              <ActionBox x={20} y={62} w={130} h={40} label="감소 (Mitigation)" sub="기술적/관리적 통제 추가" color={C.blue} />
              <ActionBox x={165} y={62} w={110} h={40} label="회피 (Avoidance)" sub="활동 자체 중단" color={C.green} />
              <ActionBox x={290} y={62} w={110} h={40} label="전가 (Transfer)" sub="보험/외주 위탁" color={C.amber} />
              <ActionBox x={415} y={62} w={55} h={40} label="수용" sub="서명 필수" color={C.green} />

              {/* Most common indicator */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <rect x={25} y={105} width={120} height={12} rx={6} fill={C.blue} opacity={0.2} />
                <text x={85} y={114} textAnchor="middle" fontSize={7} fill={C.blue}>가장 일반적 전략</text>
              </motion.g>

              {/* Example: multi-strategy */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <text x={240} y={135} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">비밀 등급 자산: 다중 전략 적용</text>

                <ModuleBox x={40} y={145} w={170} h={38} label="에어갭 PC + 멀티시그" sub="감소 전략" color={C.blue} />
                <text x={235} y={168} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)">+</text>
                <ModuleBox x={255} y={145} w={150} h={38} label="사이버 보험" sub="전가 전략" color={C.amber} />

                <Arrow x1={240} y1={185} x2={240} y2={196} />
                <DataBox x={150} y={196} w={180} h={22} label="위험 처리 계획서 (RTP)" color={C.green} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
