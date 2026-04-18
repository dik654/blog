import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  step1: '#3b82f6',
  step2: '#6366f1',
  risk: '#ef4444',
  improve: '#10b981',
  follow: '#f59e0b',
};

const STEPS = [
  { label: 'PIA 전반부: 대상 선정 → 자료 수집 → 위험 분석', body: '대상 시스템 확정(KYC/거래모니터링/CRM) → DFD·접근권한 등 현황 파악 → 위험 식별 및 평가(발생 가능성 x 영향도).' },
  { label: 'PIA 후반부: 개선 계획 → 이행 및 후속 관리', body: '기술적·관리적 개선안 수립(암호화·접근통제) → 이행 결과 확인 → 미이행 항목 차기 반영. 공공기관은 결과 PIPC 제출 의무.' },
  { label: 'VASP 주요 평가 대상 3개 시스템', body: 'KYC 시스템(가장 민감, 외부 서비스 교환 빈번), 거래 모니터링(FDS 연동, AML 업체 공유), CRM(고객센터 수탁자 접근). 각 시스템별 위험 분석.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ps-inline-arrow)" />;
}

export default function PIAStepsInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ps-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">PIA 전반부 (1~3단계)</text>

              <ActionBox x={15} y={30} w={130} h={48} label="1. 대상 선정" sub="시스템·사업 범위 확정" color={C.step1} />
              <Arrow x1={145} y1={54} x2={168} y2={54} color={C.step1} />

              <ActionBox x={170} y={30} w={130} h={48} label="2. 자료 수집" sub="DFD·접근권한·제공현황" color={C.step2} />
              <Arrow x1={300} y1={54} x2={323} y2={54} color={C.step2} />

              <ActionBox x={325} y={30} w={140} h={48} label="3. 위험 분석" sub="가능성 x 영향도" color={C.risk} />

              <motion.circle r={3} fill={C.step1} opacity={0.4}
                initial={{ cx: 80 }} animate={{ cx: 395 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={54} />

              {/* VASP 예시 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">VASP 주요 대상 시스템</text>

              <DataBox x={30} y={120} w={120} h={28} label="KYC/본인확인" color={C.step1} />
              <DataBox x={170} y={120} w={140} h={28} label="거래 모니터링(FDS)" color={C.step2} />
              <DataBox x={330} y={120} w={120} h={28} label="고객정보(CRM)" color={C.step2} />

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                위험 = 발생 가능성 x 영향도 → 높은 항목부터 우선 개선
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">PIA 후반부 (4~5단계)</text>

              <ActionBox x={60} y={30} w={170} h={48} label="4. 개선 계획 수립" sub="기술적·관리적 보호조치" color={C.improve} />
              <Arrow x1={230} y1={54} x2={258} y2={54} color={C.improve} />

              <ActionBox x={260} y={30} w={170} h={48} label="5. 이행 및 후속 관리" sub="실행·확인·미이행 반영" color={C.follow} />

              {/* 개선 예시 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">개선안 예시</text>

              <DataBox x={20} y={120} w={200} h={26} label="KYC 이미지 AES-256 암호화" color={C.improve} />
              <DataBox x={240} y={120} w={220} h={26} label="거래 DB 접근 권한 AML팀 3명 제한" color={C.improve} />

              <StatusBox x={100} y={160} w={280} h={28} label="공공기관: PIPC 제출 의무 / 민간: 권고" sub="" color={C.follow} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.risk}>VASP 주요 평가 대상 시스템</text>

              <ModuleBox x={15} y={30} w={140} h={55} label="KYC 시스템" sub="가장 민감" color={C.risk} />
              <text x={85} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">신분증 OCR, 얼굴 인식</text>
              <text x={85} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">외부 서비스 교환 빈번</text>

              <ModuleBox x={170} y={30} w={140} h={55} label="거래 모니터링" sub="FDS 연동" color={C.step2} />
              <text x={240} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">전체 거래 이력 실시간 분석</text>
              <text x={240} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">AML 업체와 데이터 공유</text>

              <ModuleBox x={325} y={30} w={140} h={55} label="CRM" sub="고객정보 종합" color={C.step1} />
              <text x={395} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">가입정보·문의·마케팅</text>
              <text x={395} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">고객센터 수탁자 접근</text>

              <line x1={15} y1={125} x2={465} y2={125} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={60} y={132} w={360} h={34} label="KYC 침해 = 이용자 신분증 유출 → 치명적 사고" sub="PIA 사전 위험 제거가 가장 중요한 시스템" color={C.risk} />

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                사전 예방 비용 &lt; 사후 대응 비용 — Privacy by Design 핵심 원칙
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
