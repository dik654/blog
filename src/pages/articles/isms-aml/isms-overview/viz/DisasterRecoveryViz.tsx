import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '백업 전략: 3계층 보호',
    body: '원본(운영 서버) + 로컬 백업(같은 사이트) + 소산 백업(다른 리전). 백업 자체를 AES-256 암호화 저장. 암호화 키는 백업과 별도 위치에 보관.',
  },
  {
    label: 'RPO/RTO 목표와 복구 훈련',
    body: 'RPO(복구 시점 목표) = 최대 허용 데이터 손실 시간. RTO(복구 시간 목표) = 서비스 복원 목표 시간. 연 1회 모의 훈련으로 목표 달성 가능성 검증.',
  },
  {
    label: 'VASP 고유 과제: 지갑 키 백업',
    body: '니모닉(12~24 영단어) 또는 샤미르 비밀 공유(N개 조각 중 K개로 복원). 물리적 분산 보관 — 단일 장소에서 키 복원 불가하도록 설계.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#dr-arrow)" />;
}

export default function DisasterRecoveryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dr-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">백업 3계층 아키텍처</text>

              {/* 3 layers */}
              <ModuleBox x={20} y={30} w={120} h={50} label="운영 서버" sub="원본 데이터" color={C.blue} />

              <Arrow x1={140} y1={55} x2={168} y2={55} />

              <ModuleBox x={170} y={30} w={120} h={50} label="로컬 백업" sub="같은 사이트" color={C.green} />

              <Arrow x1={290} y1={55} x2={318} y2={55} />

              <ModuleBox x={320} y={30} w={140} h={50} label="소산 백업" sub="다른 리전/물리 위치" color={C.amber} />

              {/* Encryption overlay */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={170} y={90} width={290} height={30} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={315} y={109} textAnchor="middle" fontSize={9} fill={C.amber}>AES-256 암호화 저장 + 암호화 키 별도 보관</text>
              </motion.g>

              {/* NTP synchronization */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <DataBox x={20} y={95} w={130} h={22} label="NTP 동기화 (1초 이내)" color={C.blue} />
              </motion.g>

              {/* Disaster scenario */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <AlertBox x={20} y={135} w={130} h={38} label="화재/지진" sub="원본 + 로컬 동시 소실" color={C.red} />
                <Arrow x1={150} y1={154} x2={200} y2={154} />
                <rect x={205} y={138} width={250} height={32} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={1} />
                <text x={330} y={154} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>소산 백업에서 복원 가능</text>
                <text x={330} y={166} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">반기 1회 소산 백업 복구 테스트 필수</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">RPO / RTO 목표 설정</text>

              {/* Disaster event */}
              <AlertBox x={195} y={25} w={90} h={28} label="장애 발생" color={C.red} />

              {/* Timeline */}
              <rect x={40} y={68} width={400} height={4} rx={2} fill="var(--border)" opacity={0.3} />

              {/* RPO - looking backward */}
              <motion.rect x={40} y={68} width={200} height={4} rx={2} fill={C.blue}
                initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 0.6 }} />
              <text x={140} y={62} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.blue}>RPO (복구 시점 목표)</text>
              <text x={140} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">최대 허용 데이터 손실 시간</text>

              {/* RTO - looking forward */}
              <motion.rect x={240} y={68} width={200} height={4} rx={2} fill={C.green}
                initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 0.6, delay: 0.2 }} />
              <text x={340} y={62} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>RTO (복구 시간 목표)</text>
              <text x={340} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">서비스 복원까지 목표 시간</text>

              {/* Event marker */}
              <line x1={240} y1={55} x2={240} y2={80} stroke={C.red} strokeWidth={2} />
              <circle cx={240} cy={70} r={4} fill={C.red} />

              {/* Backward arrow */}
              <motion.path d="M 238 75 L 42 75" fill="none" stroke={C.blue} strokeWidth={1} markerEnd="url(#dr-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.4 }} />
              <text x={40} y={85} fontSize={8} fill={C.blue}>마지막 백업</text>

              {/* Forward arrow */}
              <motion.path d="M 242 75 L 438 75" fill="none" stroke={C.green} strokeWidth={1} markerEnd="url(#dr-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
              <text x={440} y={85} fontSize={8} fill={C.green} textAnchor="end">서비스 복원</text>

              {/* Training */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <rect x={60} y={110} width={360} height={55} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
                <text x={240} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>복구 모의 훈련 (연 1회 이상)</text>
                <DataBox x={75} y={138} w={140} h={20} label="실제 백업에서 복원" color={C.amber} />
                <DataBox x={230} y={138} w={140} h={20} label="RPO/RTO 달성 측정" color={C.amber} />

                <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">훈련 결과 보고서 → 경영진 보고 → 미달 항목 개선</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">VASP 지갑 키 백업 설계</text>

              {/* Option 1: Mnemonic */}
              <ModuleBox x={20} y={30} w={200} h={48} label="니모닉 (Mnemonic)" sub="12~24개 영단어 복구 구문" color={C.blue} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <DataBox x={25} y={85} w={55} h={22} label="단어 1" color={C.blue} />
                <DataBox x={85} y={85} w={55} h={22} label="단어 2" color={C.blue} />
                <text x={153} y={100} fontSize={10} fill="var(--muted-foreground)">...</text>
                <DataBox x={165} y={85} w={55} h={22} label="단어 24" color={C.blue} />
              </motion.g>

              {/* Option 2: Shamir's Secret Sharing */}
              <ModuleBox x={260} y={30} w={200} h={48} label="샤미르 비밀 공유" sub="N개 조각 중 K개로 복원" color={C.green} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {/* Shards */}
                <DataBox x={265} y={85} w={55} h={22} label="조각 1" color={C.green} />
                <DataBox x={325} y={85} w={55} h={22} label="조각 2" color={C.green} />
                <DataBox x={385} y={85} w={55} h={22} label="조각 3" color={C.green} />
                <text x={360} y={120} textAnchor="middle" fontSize={9} fill={C.green}>예: 5개 중 3개 모이면 복원</text>
              </motion.g>

              {/* Physical distribution */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <text x={240} y={146} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">물리적 분산 보관 원칙</text>

                <ActionBox x={30} y={155} w={120} h={30} label="장소 A: 본사 금고" sub="조각 1, 2" color={C.amber} />
                <ActionBox x={180} y={155} w={120} h={30} label="장소 B: 은행" sub="조각 3" color={C.amber} />
                <ActionBox x={330} y={155} w={120} h={30} label="장소 C: 위탁 보관" sub="조각 4, 5" color={C.amber} />

                <AlertBox x={100} y={190} w={280} h={20} label="단일 장소에서 키 복원 불가하도록 설계" color={C.red} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
