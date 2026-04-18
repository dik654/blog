import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: 'CIA 3요소 평가',
    body: '기밀성(Confidentiality) = 유출 피해, 무결성(Integrity) = 변조 영향, 가용성(Availability) = 중단 영향. 각 1~3점 부여.',
  },
  {
    label: '보안등급 산정 공식',
    body: '(C + I + A) / 3 = 평균 점수. 2.0 초과 → 비밀(Secret), 1.0~2.0 → 대외비(Confidential), 1.0 이하 → 일반(Internal).',
  },
  {
    label: '콜드월렛 vs 노드 비교',
    body: '콜드월렛 개인키: C=3, I=3, A=2 → 2.67 → 비밀. 블록체인 노드: C=1, I=2, A=2 → 1.67 → 대외비. 자산마다 등급이 다르다.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#cia-arrow)" />;
}

export default function CIAEvalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cia-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Three pillars */}
              <ModuleBox x={30} y={15} w={130} h={55} label="기밀성 (C)" sub="인가된 사람만 접근" color={C.blue} />
              <ModuleBox x={180} y={15} w={120} h={55} label="무결성 (I)" sub="비인가 변경 없음" color={C.green} />
              <ModuleBox x={320} y={15} w={130} h={55} label="가용성 (A)" sub="필요 시 접근 가능" color={C.amber} />

              {/* Score scale for each */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                {/* C scores */}
                <rect x={35} y={85} width={35} height={16} rx={3} fill={`${C.blue}15`} stroke={C.blue} strokeWidth={0.6} />
                <text x={52} y={96} textAnchor="middle" fontSize={8} fill={C.blue}>3: 심각</text>
                <rect x={75} y={85} width={35} height={16} rx={3} fill={`${C.blue}10`} stroke={C.blue} strokeWidth={0.5} />
                <text x={92} y={96} textAnchor="middle" fontSize={8} fill={C.blue}>2: 보통</text>
                <rect x={115} y={85} width={35} height={16} rx={3} fill={`${C.blue}05`} stroke={C.blue} strokeWidth={0.4} />
                <text x={132} y={96} textAnchor="middle" fontSize={8} fill={C.blue}>1: 낮음</text>

                {/* I scores */}
                <rect x={185} y={85} width={35} height={16} rx={3} fill={`${C.green}15`} stroke={C.green} strokeWidth={0.6} />
                <text x={202} y={96} textAnchor="middle" fontSize={8} fill={C.green}>3: 심각</text>
                <rect x={225} y={85} width={35} height={16} rx={3} fill={`${C.green}10`} stroke={C.green} strokeWidth={0.5} />
                <text x={242} y={96} textAnchor="middle" fontSize={8} fill={C.green}>2: 보통</text>
                <rect x={265} y={85} width={35} height={16} rx={3} fill={`${C.green}05`} stroke={C.green} strokeWidth={0.4} />
                <text x={282} y={96} textAnchor="middle" fontSize={8} fill={C.green}>1: 낮음</text>

                {/* A scores */}
                <rect x={325} y={85} width={35} height={16} rx={3} fill={`${C.amber}15`} stroke={C.amber} strokeWidth={0.6} />
                <text x={342} y={96} textAnchor="middle" fontSize={8} fill={C.amber}>3: 심각</text>
                <rect x={365} y={85} width={35} height={16} rx={3} fill={`${C.amber}10`} stroke={C.amber} strokeWidth={0.5} />
                <text x={382} y={96} textAnchor="middle" fontSize={8} fill={C.amber}>2: 보통</text>
                <rect x={405} y={85} width={35} height={16} rx={3} fill={`${C.amber}05`} stroke={C.amber} strokeWidth={0.4} />
                <text x={422} y={96} textAnchor="middle" fontSize={8} fill={C.amber}>1: 낮음</text>
              </motion.g>

              {/* Convergence */}
              <Arrow x1={95} y1={103} x2={210} y2={125} />
              <Arrow x1={240} y1={103} x2={240} y2={125} />
              <Arrow x1={385} y1={103} x2={270} y2={125} />

              <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={140} y={128} width={200} height={30} rx={15} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
                <text x={240} y={147} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">(C + I + A) / 3 = 등급</text>
              </motion.g>

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">자산별로 세 축을 독립 평가 → 평균으로 등급 결정</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">보안등급 분류 기준</text>

              {/* Grade scale - visual bar */}
              <rect x={40} y={35} width={400} height={12} rx={6} fill="var(--border)" opacity={0.2} />

              {/* Secret zone */}
              <motion.rect x={280} y={35} width={160} height={12} rx={0} fill={`${C.red}25`}
                initial={{ width: 0 }} animate={{ width: 160 }} transition={{ duration: 0.5 }} />
              {/* Confidential zone */}
              <motion.rect x={140} y={35} width={140} height={12} rx={0} fill={`${C.amber}25`}
                initial={{ width: 0 }} animate={{ width: 140 }} transition={{ duration: 0.5, delay: 0.2 }} />
              {/* Internal zone */}
              <motion.rect x={40} y={35} width={100} height={12} rx={6} fill={`${C.green}20`}
                initial={{ width: 0 }} animate={{ width: 100 }} transition={{ duration: 0.5, delay: 0.4 }} />

              {/* Scale markers */}
              <line x1={40} y1={50} x2={40} y2={56} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <text x={40} y={65} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">0</text>
              <line x1={140} y1={50} x2={140} y2={56} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <text x={140} y={65} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">1.0</text>
              <line x1={280} y1={50} x2={280} y2={56} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <text x={280} y={65} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2.0</text>
              <line x1={440} y1={50} x2={440} y2={56} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <text x={440} y={65} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">3.0</text>

              {/* Grade cards */}
              <ActionBox x={20} y={80} w={130} h={42} label="일반 (Internal)" sub="1.0 이하" color={C.green} />
              <ActionBox x={175} y={80} w={130} h={42} label="대외비 (Confidential)" sub="1.0 ~ 2.0" color={C.amber} />
              <ActionBox x={330} y={80} w={130} h={42} label="비밀 (Secret)" sub="2.0 초과" color={C.red} />

              {/* Requirements per grade */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <DataBox x={20} y={135} w={130} h={24} label="기본 접근통제" color={C.green} />
                <DataBox x={175} y={135} w={130} h={24} label="접근 로그 필수" color={C.amber} />
                <DataBox x={330} y={135} w={130} h={24} label="암호화 + 최소 권한" color={C.red} />

                <text x={85} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">공개 가능 수준</text>
                <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">외부 유출 금지</text>
                <text x={395} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">접근 권한 최소화</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={15} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">자산별 CIA 비교</text>

              {/* Cold wallet */}
              <ModuleBox x={20} y={28} w={200} h={38} label="콜드월렛 개인키" sub="유출 = 자산 탈취" color={C.red} />

              <rect x={240} y={32} width={30} height={18} rx={3} fill={`${C.blue}20`} stroke={C.blue} strokeWidth={0.6} />
              <text x={255} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.blue}>C:3</text>
              <rect x={278} y={32} width={30} height={18} rx={3} fill={`${C.green}20`} stroke={C.green} strokeWidth={0.6} />
              <text x={293} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.green}>I:3</text>
              <rect x={316} y={32} width={30} height={18} rx={3} fill={`${C.amber}20`} stroke={C.amber} strokeWidth={0.6} />
              <text x={331} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.amber}>A:2</text>

              <Arrow x1={350} y1={42} x2={380} y2={42} />
              <text x={420} y={39} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>= 2.67</text>
              <text x={420} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>비밀</text>

              {/* Blockchain node */}
              <ModuleBox x={20} y={80} w={200} h={38} label="블록체인 노드 데이터" sub="공개 데이터 수준" color={C.amber} />

              <rect x={240} y={84} width={30} height={18} rx={3} fill={`${C.blue}15`} stroke={C.blue} strokeWidth={0.5} />
              <text x={255} y={97} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.blue}>C:1</text>
              <rect x={278} y={84} width={30} height={18} rx={3} fill={`${C.green}15`} stroke={C.green} strokeWidth={0.5} />
              <text x={293} y={97} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.green}>I:2</text>
              <rect x={316} y={84} width={30} height={18} rx={3} fill={`${C.amber}15`} stroke={C.amber} strokeWidth={0.5} />
              <text x={331} y={97} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.amber}>A:2</text>

              <Arrow x1={350} y1={94} x2={380} y2={94} />
              <text x={420} y={91} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>= 1.67</text>
              <text x={420} y={104} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.amber}>대외비</text>

              {/* Visual comparison bar */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">보안등급에 따라 보호 수준이 결정</text>

                <rect x={40} y={150} width={180} height={28} rx={6} fill={`${C.red}10`} stroke={C.red} strokeWidth={0.8} />
                <text x={130} y={163} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>비밀: 에어갭 + 멀티시그 + 보험</text>
                <text x={130} y={174} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">최고 보호 수준</text>

                <rect x={260} y={150} width={180} height={28} rx={6} fill={`${C.amber}10`} stroke={C.amber} strokeWidth={0.8} />
                <text x={350} y={163} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>대외비: 접근 로그 + 내부 제한</text>
                <text x={350} y={174} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">중간 보호 수준</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
