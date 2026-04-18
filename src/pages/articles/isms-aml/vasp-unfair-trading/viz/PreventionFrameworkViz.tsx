import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  compliance: '#6366f1',
  detect: '#f59e0b',
  human: '#10b981',
  punish: '#ef4444',
};

const STEPS = [
  { label: '준법감시인 -- 예방의 핵심 직책', body: '정책 수립, 위반 조사, 이사회 보고, 감사위 협력, 감독기관 대응. 경영진으로부터 독립적 지위 보장이 전제조건.' },
  { label: '자동 감시 시스템 -- 4대 탐지 규칙', body: '스푸핑: 주문 생존시간+취소율. 워시 트레이딩: 동일 IP/기기. 통정 매매: 계정 쌍 대칭 거래. 펌프 앤 덤프: 급등+SNS+대량 매도.' },
  { label: '교육·신고 -- 인적 통제', body: '연 1회 이상 전 임직원 교육(법률·내부규정·사례·신고절차). 내부 신고 채널 운영 + 익명성 보장 + 보복 금지. 부정의 43%가 내부 제보로 발견.' },
  { label: '위반 시 5단계 조치 절차', body: '① 초동조치(접근 차단·거래 동결) → ② 내부 조사(증거 수집) → ③ 인사 조치 → ④ 외부 신고(수사기관·금감원) → ⑤ 재발 방지. 초동 속도가 핵심.' },
  { label: '5중 방어 체계 -- 전체 구조', body: '제도적 예방 → 기술적 탐지 → 인적 통제 → 내부 제재 → 외부 제재. 각 층위가 독립 작동하며 서로 보완. 모든 층위를 동시에 무력화하는 것은 극히 어렵다.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#pf-arrow)" />;
}

export default function PreventionFrameworkViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pf-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 준법감시인 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">준법감시인(Compliance Officer) 역할</text>

              <ModuleBox x={170} y={28} w={140} h={48} label="준법감시인" sub="독립적 지위 보장" color={C.compliance} />

              {/* 5대 역할 */}
              <Arrow x1={190} y1={76} x2={60} y2={100} color={C.compliance} />
              <Arrow x1={220} y1={76} x2={160} y2={100} color={C.compliance} />
              <Arrow x1={240} y1={76} x2={240} y2={100} color={C.compliance} />
              <Arrow x1={260} y1={76} x2={320} y2={100} color={C.compliance} />
              <Arrow x1={290} y1={76} x2={420} y2={100} color={C.compliance} />

              <ActionBox x={10} y={103} w={95} h={38} label="정책 수립" sub="내부규정 설계" color={C.compliance} />
              <ActionBox x={115} y={103} w={85} h={38} label="위반 조사" sub="제보·알림 조사" color={C.detect} />
              <ActionBox x={210} y={103} w={85} h={38} label="이사회 보고" sub="정기 위험 보고" color={C.compliance} />
              <ActionBox x={305} y={103} w={85} h={38} label="감사위 협력" sub="공동 준법 점검" color={C.human} />
              <ActionBox x={400} y={103} w={70} h={38} label="감독대응" sub="금융위·금감원" color={C.punish} />

              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">핵심: 경영진으로부터 독립 -- 해임 보호 + 이사회 직접 보고 경로 보장</text>
              <text x={240} y={188} textAnchor="middle" fontSize={8} fill={C.punish}>독립성 훼손 시 예방 체계 전체가 무력화</text>
            </motion.g>
          )}

          {/* Step 1: 자동 감시 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">자동 감시 시스템 -- 4대 탐지 규칙</text>

              <ActionBox x={10} y={35} w={110} h={42} label="스푸핑 탐지" sub="주문 생존 <N초" color={C.detect} />
              <ActionBox x={130} y={35} w={110} h={42} label="워시 탐지" sub="동일 IP/기기 지문" color={C.detect} />
              <ActionBox x={250} y={35} w={110} h={42} label="통정매매 탐지" sub="계정 쌍 대칭 거래" color={C.detect} />
              <ActionBox x={370} y={35} w={100} h={42} label="펌프 탐지" sub="급등+SNS+매도" color={C.detect} />

              {/* 화살표들 → 통합 알림 */}
              <Arrow x1={65} y1={77} x2={190} y2={105} color={C.detect} />
              <Arrow x1={185} y1={77} x2={220} y2={105} color={C.detect} />
              <Arrow x1={305} y1={77} x2={260} y2={105} color={C.detect} />
              <Arrow x1={420} y1={77} x2={290} y2={105} color={C.detect} />

              <AlertBox x={170} y={108} w={140} h={45} label="이상 거래 알림" sub="준법감시인에게 즉시 전달" color={C.punish} />

              {/* 보완: ML */}
              <rect x={20} y={175} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={120} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">규칙 기반(Rule-based)</text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">+</text>
              <text x={360} y={195} textAnchor="middle" fontSize={8} fill={C.detect}>머신러닝(변종 수법 탐지)</text>
            </motion.g>
          )}

          {/* Step 2: 교육·신고 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">인적 통제: 교육 + 내부 신고</text>

              {/* 교육 */}
              <ModuleBox x={20} y={35} w={200} h={50} label="전 임직원 교육 (연 1회+)" sub="법률·내부규정·사례·신고절차" color={C.human} />

              {/* 교육 내용 */}
              <DataBox x={20} y={95} w={95} h={28} label="법률 교육" color={C.human} />
              <DataBox x={125} y={95} w={95} h={28} label="사례 교육" color={C.human} />

              {/* 신고 */}
              <ModuleBox x={260} y={35} w={200} h={50} label="내부 신고 채널" sub="준법감시인 직접 보고 경로" color={C.compliance} />

              <DataBox x={260} y={95} w={95} h={28} label="익명 신고" color={C.compliance} />
              <DataBox x={365} y={95} w={95} h={28} label="보복 금지" color={C.punish} />

              {/* 효과 */}
              <rect x={20} y={140} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <StatusBox x={130} y={150} w={220} h={50} label="내부 제보 발견률: 43%" sub="외부 감시보다 빠르고 정확 (ACFE 기준)" color={C.human} progress={0.43} />
            </motion.g>
          )}

          {/* Step 3: 위반 조치 5단계 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">위반 시 5단계 조치 절차</text>

              <ActionBox x={10} y={38} w={80} h={42} label="1. 초동 조치" sub="접근 차단" color={C.punish} />
              <Arrow x1={90} y1={59} x2={108} y2={59} color={C.punish} />

              <ActionBox x={111} y={38} w={80} h={42} label="2. 내부 조사" sub="증거 수집" color={C.detect} />
              <Arrow x1={191} y1={59} x2={209} y2={59} color={C.detect} />

              <ActionBox x={212} y={38} w={80} h={42} label="3. 인사 조치" sub="경고~해고" color={C.compliance} />
              <Arrow x1={292} y1={59} x2={310} y2={59} color={C.compliance} />

              <ActionBox x={313} y={38} w={80} h={42} label="4. 외부 신고" sub="수사기관" color={C.punish} />
              <Arrow x1={393} y1={59} x2={411} y2={59} color={C.human} />

              <ActionBox x={414} y={38} w={56} h={42} label="5. 재발방지" sub="규정 보완" color={C.human} />

              {/* 속도 강조 */}
              <rect x={20} y={100} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={110} w={200} h={42} label="초동 조치 속도가 핵심" sub="증거 인멸·추가 부정 방지" color={C.punish} />

              <ModuleBox x={260} y={110} w={190} h={42} label="수사기관 동시 진행" sub="내부 조사 완료 기다리지 않음" color={C.compliance} />

              {/* 담당 */}
              <DataBox x={30} y={170} w={120} h={28} label="준법감시인 / IT팀" color={C.compliance} />
              <DataBox x={170} y={170} w={120} h={28} label="법무팀 / 인사위" color={C.detect} />
              <DataBox x={310} y={170} w={140} h={28} label="경영진 / 법무팀" color={C.punish} />
            </motion.g>
          )}

          {/* Step 4: 5중 방어 체계 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">5중 방어 체계</text>

              {/* 동심원 구조 - 바깥에서 안으로 */}
              <motion.rect x={20} y={30} width={440} height={36} rx={8} fill={`${C.punish}12`} stroke={C.punish} strokeWidth={0.8}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} />
              <text x={30} y={52} fontSize={9} fontWeight={600} fill={C.punish}>5. 외부 제재</text>
              <text x={240} y={52} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">형사처벌(징역·벌금) + 과징금 + 업무 정지</text>

              <motion.rect x={30} y={70} width={420} height={36} rx={8} fill={`${C.detect}12`} stroke={C.detect} strokeWidth={0.8}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} />
              <text x={40} y={92} fontSize={9} fontWeight={600} fill={C.detect}>4. 내부 제재</text>
              <text x={240} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인사징계 + 해고 + 손해배상 청구</text>

              <motion.rect x={40} y={110} width={400} height={36} rx={8} fill={`${C.human}12`} stroke={C.human} strokeWidth={0.8}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} />
              <text x={50} y={132} fontSize={9} fontWeight={600} fill={C.human}>3. 인적 통제</text>
              <text x={240} y={132} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">준법감시인 + 내부 신고 + 정기 교육</text>

              <motion.rect x={50} y={150} width={380} height={28} rx={8} fill={`${C.detect}12`} stroke={C.detect} strokeWidth={0.8}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} />
              <text x={60} y={168} fontSize={9} fontWeight={600} fill={C.detect}>2. 기술적 탐지</text>
              <text x={240} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">자동 감시 + AI 패턴 탐지</text>

              <motion.rect x={60} y={182} width={360} height={28} rx={8} fill={`${C.compliance}12`} stroke={C.compliance} strokeWidth={0.8}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} />
              <text x={70} y={200} fontSize={9} fontWeight={600} fill={C.compliance}>1. 제도적 예방</text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">임직원 거래 제한 + 정보 차단벽 + 자기발행 금지</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
