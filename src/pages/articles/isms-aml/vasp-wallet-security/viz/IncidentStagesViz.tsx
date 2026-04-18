import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  detect: '#6366f1',
  contain: '#ef4444',
  analyze: '#f59e0b',
  recover: '#10b981',
};

const STEPS = [
  { label: '침해사고 대응 4단계', body: '탐지(IDS/FDS/신고) → 초동대응(격리/차단/출금정지) → 분석(포렌식/원인규명) → 복구+재발방지(패치/교육/모니터링 강화).' },
  { label: '내부 vs 외부 금융사고', body: '내부: 횡령/비인가출금 → 지갑 출금 정지 + CCO/CISO 1시간 내 보고 + SAR 판단. 외부: 계정탈취/피싱 → FDS 자동 보류 + 계정 정지 + 본인 확인.' },
  { label: '재발방지 제도화', body: 'UBA(사용자 행위 분석), 핫월렛 자동 한도 축소, AI 기반 FDS, Mixer 블랙리스트. 일회성 조치가 아닌 제도 수준 정착.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#is-arrow)" />;
}

export default function IncidentStagesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="is-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">침해사고 대응 4단계</text>

              <ActionBox x={10} y={35} w={100} h={45} label="1. 탐지" sub="IDS/FDS/직원신고" color={C.detect} />
              <Arrow x1={110} y1={57} x2={128} y2={57} color={C.detect} />

              <AlertBox x={130} y={32} w={100} h={50} label="2. 초동대응" sub="격리/차단/출금정지" color={C.contain} />
              <Arrow x1={230} y1={57} x2={248} y2={57} color={C.contain} />

              <ActionBox x={250} y={35} w={100} h={45} label="3. 분석" sub="포렌식/원인규명" color={C.analyze} />
              <Arrow x1={350} y1={57} x2={368} y2={57} color={C.analyze} />

              <ActionBox x={370} y={35} w={100} h={45} label="4. 복구" sub="패치/교육/보강" color={C.recover} />

              {/* Key point */}
              <rect x={20} y={100} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={20} y={112} w={200} h={30} label="초동대응 속도가 핵심" color={C.contain} />
              <text x={125} y={156} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">격리가 늦을수록 피해 기하급수적 증가</text>

              <DataBox x={260} y={112} w={200} h={30} label="포렌식: 디스크/메모리/패킷 분석" color={C.analyze} />
              <text x={360} y={156} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">침해 경로 + 영향 범위 + 유출 데이터 규명</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">기밀성(C) + 무결성(I) + 가용성(A) 손상 = 침해사고</text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill={C.contain}>VASP 침해 = 이용자 자산 유출 직결</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">내부 vs 외부 금융사고 대응</text>

              {/* Internal */}
              <rect x={15} y={30} width={215} height={95} rx={6} fill={`${C.contain}08`} stroke={C.contain} strokeWidth={0.6} />
              <text x={25} y={48} fontSize={9} fontWeight={600} fill={C.contain}>내부 금융사고</text>
              <text x={25} y={62} fontSize={8} fill="var(--muted-foreground)">횡령 / 비인가 출금 / 이중 출금</text>
              <Arrow x1={25} y1={68} x2={25} y2={78} color={C.contain} />
              <text x={25} y={88} fontSize={8} fill="var(--muted-foreground)">1. 지갑 출금 즉시 정지</text>
              <text x={25} y={100} fontSize={8} fill="var(--muted-foreground)">2. CCO+CISO 1시간 내 보고</text>
              <text x={25} y={112} fontSize={8} fill="var(--muted-foreground)">3. SAR 작성 + FIU 보고 판단</text>

              {/* External */}
              <rect x={250} y={30} width={215} height={95} rx={6} fill={`${C.detect}08`} stroke={C.detect} strokeWidth={0.6} />
              <text x={260} y={48} fontSize={9} fontWeight={600} fill={C.detect}>외부 금융사고</text>
              <text x={260} y={62} fontSize={8} fill="var(--muted-foreground)">계정 탈취 / 피싱 / 해킹</text>
              <Arrow x1={260} y1={68} x2={260} y2={78} color={C.detect} />
              <text x={260} y={88} fontSize={8} fill="var(--muted-foreground)">1. FDS 자동 보류 + 계정 정지</text>
              <text x={260} y={100} fontSize={8} fill="var(--muted-foreground)">2. 본인 확인 시도</text>
              <text x={260} y={112} fontSize={8} fill="var(--muted-foreground)">3. SAR + 수사기관 통보</text>

              {/* Common */}
              <rect x={80} y={140} width={320} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">공통: 블록체인 분석업체 협력 → 유출 자금 추적 → 거래소 동결 요청</text>

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">온체인 분석으로 자금 이동 클러스터 식별 + 포렌식 보고서 수사기관 제출</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">재발방지 제도화</text>

              <DataBox x={20} y={35} w={200} h={35} label="UBA 도입" color={C.detect} />
              <text x={230} y={48} fontSize={8} fill="var(--muted-foreground)">임직원 비정상 접근/업무 외 로그인/대량 조회 상시 감시</text>

              <DataBox x={20} y={82} w={200} h={35} label="핫월렛 자동 한도 축소" color={C.contain} />
              <text x={230} y={95} fontSize={8} fill="var(--muted-foreground)">이상 징후 시 평시 50%로 자동 축소, 보안팀 확인 후 복원</text>

              <DataBox x={20} y={129} w={200} h={35} label="AI 기반 FDS 고도화" color={C.analyze} />
              <text x={230} y={142} fontSize={8} fill="var(--muted-foreground)">이용자별 정상 프로파일 학습 → 일탈 패턴 실시간 탐지</text>

              <DataBox x={20} y={176} w={200} h={28} label="Mixer 블랙리스트 관리" color={C.recover} />
              <text x={230} y={190} fontSize={8} fill="var(--muted-foreground)">Mixer 주소 출금 차단 + Mixer 유입 자금 추가 심사</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
