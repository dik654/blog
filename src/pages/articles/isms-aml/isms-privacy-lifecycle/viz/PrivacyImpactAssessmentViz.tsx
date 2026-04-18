import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  step: '#6366f1',
  risk: '#ef4444',
  improve: '#10b981',
  warn: '#f59e0b',
};

const STEPS = [
  {
    label: 'PIA 5단계 — 대상 선정부터 이행까지',
    body: '1)대상 선정(평가 범위 확정) → 2)자료 수집(DFD, 접근권한 조사) → 3)위험 분석(발생 가능성 x 영향도) → 4)개선 계획 수립(기술적·관리적) → 5)이행 및 후속 관리(미이행 차기 반영).',
  },
  {
    label: '평가 4영역 — 수집·이용·제공·기술적 보호조치',
    body: '수집 적정성: 최소 수집, 동의. 이용 적정성: 목적 외 이용 방지. 제공 적정성: 제3자 동의, Travel Rule 최소 항목. 기술적 보호: 암호화, 접근통제, 로그 2년, 파기 자동화.',
  },
  {
    label: 'VASP 주요 평가 대상 — KYC·모니터링·CRM',
    body: 'KYC 시스템: 신분증 OCR·얼굴 인식·제재목록 조회, 외부 데이터 교환 빈번 → 침해 위험 최고. 거래 모니터링: FDS 연동, 대량 금융정보 처리. CRM: 고객센터 위탁사 접근 통제.',
  },
  {
    label: 'PIA vs ISMS-P — 사전 분석 vs 사후 검증',
    body: 'PIA: 시스템 구축 전, 특정 시스템, 침해 위험 사전 분석. ISMS-P: 운영 중 연 1회, 조직 전체, 관리체계 적합성 검증. 양쪽 모두 수행하면 전체 생명주기 관리. 사전 예방 비용 < 사후 대응 비용.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#pia-arrow)" />
  );
}

export default function PrivacyImpactAssessmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pia-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: PIA 5단계 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">PIA 5단계 절차</text>

              <ActionBox x={10} y={30} w={82} h={44} label="1. 대상 선정" sub="범위 확정" color={C.step} />
              <Arrow x1={92} y1={52} x2={105} y2={52} color={C.step} />

              <ActionBox x={107} y={30} w={82} h={44} label="2. 자료 수집" sub="DFD·접근권한" color={C.step} />
              <Arrow x1={189} y1={52} x2={202} y2={52} color={C.step} />

              <ActionBox x={204} y={30} w={82} h={44} label="3. 위험 분석" sub="가능성 x 영향" color={C.risk} />
              <Arrow x1={286} y1={52} x2={299} y2={52} color={C.risk} />

              <ActionBox x={301} y={30} w={82} h={44} label="4. 개선 수립" sub="기술·관리적" color={C.improve} />
              <Arrow x1={383} y1={52} x2={396} y2={52} color={C.improve} />

              <StatusBox x={398} y={28} w={72} h={48} label="5. 이행" sub="후속 관리" color={C.improve} />

              {/* 흐르는 점 */}
              <motion.circle r={3} fill={C.step} opacity={0.5}
                initial={{ cx: 51 }} animate={{ cx: 434 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} cy={52} />

              <line x1={15} y1={90} x2={465} y2={90} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 각 단계 산출물 */}
              <text x={240} y={106} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">단계별 산출물</text>
              <DataBox x={10} y={114} w={82} h={24} label="평가계획서" color={C.step} />
              <DataBox x={107} y={114} w={82} h={24} label="현황조사서" color={C.step} />
              <DataBox x={204} y={114} w={82} h={24} label="위험평가표" color={C.risk} />
              <DataBox x={301} y={114} w={82} h={24} label="개선계획서" color={C.improve} />
              <DataBox x={398} y={114} w={72} h={24} label="이행점검표" color={C.improve} />

              {/* 위험 공식 */}
              <rect x={140} y={155} width={200} height={28} rx={6} fill="#ef444412" stroke={C.risk} strokeWidth={1} />
              <text x={240} y={173} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.risk}>위험 = 발생 가능성 x 영향도</text>

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">민간기업은 의무 아니나 ISMS-P 심사 시 수행 여부 확인</text>
            </motion.g>
          )}

          {/* Step 1: 평가 4영역 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">PIA 평가 4영역</text>

              <ModuleBox x={15} y={30} w={210} h={48} label="수집 적정성" sub="최소 수집·동의·수집 항목 타당성" color={C.step} />
              <ModuleBox x={255} y={30} w={210} h={48} label="이용 적정성" sub="목적 외 이용·접근 권한 적정" color={C.step} />
              <ModuleBox x={15} y={95} w={210} h={48} label="제공 적정성" sub="제3자 동의·위탁·국외 이전" color={C.warn} />
              <ModuleBox x={255} y={95} w={210} h={48} label="기술적 보호조치" sub="암호화·접근통제·로그·파기" color={C.improve} />

              {/* VASP 중점 사항 */}
              <line x1={15} y1={158} x2={465} y2={158} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={175} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>VASP 중점: Travel Rule 이행 시 제공 항목 최소화</text>

              <DataBox x={60} y={183} w={160} h={26} label="KYC 수집 = 특금법 근거" color={C.step} />
              <DataBox x={260} y={183} w={160} h={26} label="AML 모니터링 ≠ 마케팅" color={C.warn} />
            </motion.g>
          )}

          {/* Step 2: VASP 주요 평가 대상 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">VASP 주요 PIA 평가 대상</text>

              {/* KYC */}
              <ModuleBox x={15} y={30} w={140} h={55} label="KYC 시스템" sub="침해 위험: 최고" color={C.risk} />
              <DataBox x={25} y={95} w={55} h={22} label="신분증" color={C.risk} />
              <DataBox x={85} y={95} w={60} h={22} label="얼굴인식" color={C.risk} />
              <DataBox x={40} y={122} w={100} h={22} label="제재목록 조회" color={C.risk} />
              <text x={85} y={157} textAnchor="middle" fontSize={8} fill={C.risk} fontWeight={600}>외부 서비스 교환 빈번</text>

              {/* 모니터링 */}
              <ModuleBox x={170} y={30} w={140} h={55} label="거래 모니터링" sub="침해 위험: 높음" color={C.warn} />
              <DataBox x={180} y={95} w={55} h={22} label="FDS" color={C.warn} />
              <DataBox x={240} y={95} w={60} h={22} label="거래이력" color={C.warn} />
              <DataBox x={190} y={122} w={110} h={22} label="AML 솔루션 위탁" color={C.warn} />
              <text x={240} y={157} textAnchor="middle" fontSize={8} fill={C.warn} fontWeight={600}>대량 금융정보 실시간 처리</text>

              {/* CRM */}
              <ModuleBox x={325} y={30} w={140} h={55} label="CRM" sub="침해 위험: 중간" color={C.step} />
              <DataBox x={335} y={95} w={60} h={22} label="회원정보" color={C.step} />
              <DataBox x={400} y={95} w={55} h={22} label="문의기록" color={C.step} />
              <DataBox x={350} y={122} w={100} h={22} label="고객센터 위탁" color={C.step} />
              <text x={395} y={157} textAnchor="middle" fontSize={8} fill={C.step} fontWeight={600}>위탁사 접근 통제 확인</text>

              {/* 위험 강조 */}
              <motion.rect x={10} y={25} width={150} height={145} rx={8}
                fill="none" stroke={C.risk} strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }} />

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">KYC 침해 = 이용자 신분증 유출 → PIA로 사전 위험 제거 필수</text>
            </motion.g>
          )}

          {/* Step 3: PIA vs ISMS-P */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">PIA vs ISMS-P 심사</text>

              {/* PIA */}
              <ModuleBox x={15} y={30} w={210} h={48} label="PIA (영향평가)" sub="시스템 구축·변경 전" color={C.step} />
              <DataBox x={25} y={88} w={90} h={24} label="특정 시스템" color={C.step} />
              <DataBox x={125} y={88} w={90} h={24} label="침해 위험 분석" color={C.step} />
              <DataBox x={25} y={118} w={90} h={24} label="영향평가서" color={C.step} />
              <DataBox x={125} y={118} w={90} h={24} label="개선 계획" color={C.step} />

              {/* ISMS-P */}
              <ModuleBox x={255} y={30} w={210} h={48} label="ISMS-P 심사" sub="운영 중 연 1회" color={C.improve} />
              <DataBox x={265} y={88} w={90} h={24} label="조직 전체" color={C.improve} />
              <DataBox x={365} y={88} w={90} h={24} label="적합성 검증" color={C.improve} />
              <DataBox x={265} y={118} w={90} h={24} label="적합/부적합" color={C.improve} />
              <DataBox x={365} y={118} w={90} h={24} label="결함 보고서" color={C.improve} />

              {/* 상호보완 화살표 */}
              <Arrow x1={225} y1={54} x2={253} y2={54} color={C.warn} />
              <Arrow x1={253} y1={60} x2={225} y2={60} color={C.warn} />
              <text x={240} y={47} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>상호보완</text>

              {/* 결론 */}
              <line x1={15} y1={152} x2={465} y2={152} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <rect x={80} y={162} width={320} height={32} rx={6} fill="#10b98112" stroke={C.improve} strokeWidth={1} />
              <text x={240} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.improve}>양쪽 모두 수행 → 개인정보 전체 생명주기 관리</text>
              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사전 예방 비용 {'<'} 사후 대응 비용</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
