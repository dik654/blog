import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  detect: '#6366f1',
  review: '#f59e0b',
  write: '#10b981',
  submit: '#3b82f6',
  follow: '#ef4444',
};

const STEPS = [
  { label: '1단계 — 의심 인지', body: 'FDS(이상거래탐지시스템) 경보 또는 현업 직원이 이상 징후를 발견. 내부 보고서를 작성하여 AML 담당자에게 전달.' },
  { label: '2단계 — 1차 검토', body: 'AML 담당자가 경보 유효성 확인, CDD 프로파일 대조, 온체인 분석. 결과: 오탐 종료 / 추가 조사 / SAR 작성 판정.' },
  { label: '3단계 — SAR 작성', body: '거래 일시·금액, 관련 계정·지갑, 의심 사유, 증빙자료, VASP 조치 내역을 구체적으로 기재. "왜 의심스러운지"가 핵심.' },
  { label: '4단계 — 승인 및 FIU 제출', body: '준법감시인 최종 승인 후 FIU 온라인 보고 시스템(goAML)으로 전자 제출. 의심 인지 후 3영업일 이내 완료.' },
  { label: '5단계 — 후속 조치', body: '계정 모니터링 유지, 수사기관 협조, 계정 해지 검토, 새로운 패턴을 FDS 규칙에 반영. SAR 제출은 끝이 아니라 시작.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#sp-arrow)" />;
}

export default function SarProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sp-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 의심 인지 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">의심 거래 최초 인지 경로</text>

              {/* 두 경로 */}
              <ModuleBox x={20} y={30} w={130} h={50} label="FDS 경보" sub="자동 탐지 시스템" color={C.detect} />
              <ModuleBox x={20} y={100} w={130} h={50} label="현업 직원 보고" sub="CS팀 / 운영팀" color={C.detect} />

              {/* 화살표 → 내부 보고서 */}
              <Arrow x1={150} y1={55} x2={200} y2={85} color={C.detect} />
              <Arrow x1={150} y1={125} x2={200} y2={95} color={C.detect} />

              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <DataBox x={203} y={75} w={110} h={34} label="내부 보고서" color={C.detect} />
              </motion.g>

              {/* → AML 담당자 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Arrow x1={313} y1={92} x2={350} y2={92} color={C.review} />
                <ModuleBox x={353} y={67} w={110} h={50} label="AML 담당자" sub="보고책임자" color={C.review} />
              </motion.g>

              {/* 하단: 의심 징후 */}
              <rect x={20} y={165} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">징후: 목적 미소명 / 본인확인 회피 / 소득-거래 불일치 / 급박한 대규모 출금</text>

              {/* 타임라인 */}
              <rect x={20} y={195} width={440} height={7} rx={3.5} fill="var(--border)" opacity={0.3} />
              <motion.rect x={20} y={195} width={88} height={7} rx={3.5} fill={C.detect}
                initial={{ width: 0 }} animate={{ width: 88 }} transition={{ duration: 0.6 }} />
              <text x={64} y={215} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">실시간</text>
            </motion.g>
          )}

          {/* Step 1: 1차 검토 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">AML 담당자 1차 검토</text>

              <ActionBox x={15} y={30} w={105} h={42} label="경보 유효성" sub="오탐(FP) 여부 확인" color={C.review} />
              <ActionBox x={130} y={30} w={105} h={42} label="CDD 대조" sub="프로파일 vs 거래 패턴" color={C.review} />
              <ActionBox x={245} y={30} w={105} h={42} label="온체인 분석" sub="위험 점수 / 믹서 연관" color={C.review} />
              <ActionBox x={360} y={30} w={105} h={42} label="추가 정보" sub="자금출처 소명 요청" color={C.review} />

              {/* 수렴 */}
              <Arrow x1={67} y1={72} x2={170} y2={100} color={C.review} />
              <Arrow x1={182} y1={72} x2={200} y2={100} color={C.review} />
              <Arrow x1={297} y1={72} x2={260} y2={100} color={C.review} />
              <Arrow x1={412} y1={72} x2={290} y2={100} color={C.review} />

              {/* 세 가지 결과 */}
              <rect x={100} y={105} width={280} height={38} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={120} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">검토 결과</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Arrow x1={160} y1={143} x2={90} y2={162} color={C.write} />
                <Arrow x1={240} y1={143} x2={240} y2={162} color={C.review} />
                <Arrow x1={320} y1={143} x2={390} y2={162} color={C.follow} />

                <DataBox x={25} y={165} w={130} h={28} label="(a) 오탐 → 종료" color={C.write} />
                <DataBox x={175} y={165} w={130} h={28} label="(b) 추가 조사" color={C.review} />
                <DataBox x={325} y={165} w={130} h={28} label="(c) SAR 작성" color={C.follow} />
              </motion.g>

              {/* 타임라인 */}
              <rect x={20} y={205} width={440} height={7} rx={3.5} fill="var(--border)" opacity={0.3} />
              <motion.rect x={20} y={205} width={176} height={7} rx={3.5} fill={C.review}
                initial={{ width: 88 }} animate={{ width: 176 }} transition={{ duration: 0.6 }} />
              <text x={132} y={218} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">경보 후 24시간 이내</text>
            </motion.g>
          )}

          {/* Step 2: SAR 작성 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">SAR 필수 기재 항목</text>

              <ModuleBox x={160} y={28} w={160} h={40} label="SAR 초안" sub="AML 담당자 + 보안팀 공동 작성" color={C.write} />

              {/* 5개 필수 항목 */}
              <Arrow x1={190} y1={68} x2={65} y2={90} color={C.write} />
              <Arrow x1={220} y1={68} x2={170} y2={90} color={C.write} />
              <Arrow x1={240} y1={68} x2={240} y2={90} color={C.write} />
              <Arrow x1={260} y1={68} x2={310} y2={90} color={C.write} />
              <Arrow x1={290} y1={68} x2={415} y2={90} color={C.write} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <DataBox x={10} y={95} w={110} h={30} label="거래 일시/금액" color={C.write} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <DataBox x={125} y={95} w={100} h={30} label="계정/지갑" color={C.write} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <ActionBox x={230} y={93} w={100} h={34} label="의심 사유" sub="핵심 항목" color={C.follow} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <DataBox x={335} y={95} w={65} h={30} label="증빙자료" color={C.write} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                <DataBox x={405} y={95} w={65} h={30} label="조치 내역" color={C.write} />
              </motion.g>

              {/* 의심 사유 강조 */}
              <AlertBox x={100} y={145} w={280} h={40} label="의심 사유 = SAR의 핵심" sub="'FDS 경보 발생'만으로 부족 — 왜 세탁 의심인지 논리적 서술" color={C.follow} />

              {/* 타임라인 */}
              <rect x={20} y={200} width={440} height={7} rx={3.5} fill="var(--border)" opacity={0.3} />
              <motion.rect x={20} y={200} width={264} height={7} rx={3.5} fill={C.write}
                initial={{ width: 176 }} animate={{ width: 264 }} transition={{ duration: 0.6 }} />
              <text x={220} y={215} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">판정 후 24시간 이내</text>
            </motion.g>
          )}

          {/* Step 3: 승인 및 제출 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">최종 승인 → FIU 제출</text>

              <DataBox x={15} y={40} w={100} h={34} label="SAR 초안" color={C.write} />
              <Arrow x1={115} y1={57} x2={145} y2={57} color={C.submit} />

              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={148} y={32} w={130} h={50} label="준법감시인 승인" sub="최종 결재 + 전자 서명" color={C.submit} />
              </motion.g>

              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Arrow x1={278} y1={57} x2={310} y2={57} color={C.submit} />
                <ActionBox x={313} y={35} w={140} h={44} label="FIU 온라인 제출" sub="goAML 시스템" color={C.submit} />
              </motion.g>

              {/* 대행 체계 */}
              <rect x={148} y={95} width={130} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={148} y={100} w={130} h={35} label="부재 시 직무 대행" sub="승인 지연 방지" color={C.follow} />

              {/* 완료 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <StatusBox x={313} y={100} w={140} h={48} label="제출 완료" sub="접수 확인서 수령" color={C.write} progress={1} />
              </motion.g>

              {/* 타임라인 */}
              <rect x={20} y={175} width={440} height={7} rx={3.5} fill="var(--border)" opacity={0.3} />
              <motion.rect x={20} y={175} width={374} height={7} rx={3.5} fill={C.submit}
                initial={{ width: 264 }} animate={{ width: 374 }} transition={{ duration: 0.6 }} />
              <text x={319} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">의심 인지 후 3영업일 이내</text>
            </motion.g>
          )}

          {/* Step 4: 후속 조치 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">SAR 제출 후 — 끝이 아니라 시작</text>

              <DataBox x={180} y={28} w={120} h={30} label="SAR 제출 완료" color={C.submit} />

              {/* 네 갈래 */}
              <Arrow x1={210} y1={58} x2={75} y2={80} color={C.follow} />
              <Arrow x1={230} y1={58} x2={195} y2={80} color={C.follow} />
              <Arrow x1={250} y1={58} x2={315} y2={80} color={C.follow} />
              <Arrow x1={270} y1={58} x2={420} y2={80} color={C.follow} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={15} y={85} w={120} h={40} label="계정 모니터링" sub="지속 감시 + 후속 SAR" color={C.detect} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={145} y={85} w={105} h={40} label="수사 협조" sub="자료 요청 즉시 응대" color={C.review} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={260} y={85} w={110} h={40} label="계정 처리" sub="해지 검토 + 기록 보관" color={C.follow} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={380} y={85} w={90} h={40} label="교훈 반영" sub="FDS 규칙 갱신" color={C.write} />
              </motion.g>

              {/* 방어적 보고 경고 */}
              <AlertBox x={100} y={145} w={280} h={38} label="방어적 보고 지양" sub="양보다 질 — 구체성과 논리성이 FIU 평가 기준" color={C.follow} />

              {/* 타임라인 */}
              <rect x={20} y={200} width={440} height={7} rx={3.5} fill="var(--border)" opacity={0.3} />
              <motion.rect x={20} y={200} width={440} height={7} rx={3.5} fill={C.follow}
                initial={{ width: 374 }} animate={{ width: 440 }} transition={{ duration: 0.6 }} />
              <text x={440} y={215} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">지속</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
