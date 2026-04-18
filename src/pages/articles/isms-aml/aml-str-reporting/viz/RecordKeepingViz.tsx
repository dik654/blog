import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  record: '#6366f1',
  time: '#f59e0b',
  secure: '#10b981',
  edu: '#3b82f6',
  warn: '#ef4444',
};

const STEPS = [
  { label: '보관 대상 4범주', body: 'CDD 자료(고객확인), 거래 내역(입출금/매매/TX 해시), SAR 사본(제출 전문+경보 로그), 내부 통제 기록(정책/교육/감사). 네 범주 전부 보관 의무.' },
  { label: '보관 기간 — 최소 5년, 기산점이 다르다', body: 'CDD: 거래 관계 종료일부터, 거래 내역: 거래 발생일부터, SAR 사본: 제출일부터, 내부 통제: 작성일부터. 수사 진행 중이면 종료까지 연장.' },
  { label: '보관 방법 — 5대 보안 요건', body: '전자적 보관(즉시 검색), 암호화(AES-256), 접근 통제(RBAC), 무결성(WORM/해시 체인), 백업(이중화). "찾을 수 없다" = 미보관.' },
  { label: '정기 교육 — 대상별 주기와 내용', body: '전 직원 연 1회, CS팀 반기 1회, AML 담당자 분기 1회, 경영진 연 1회. 형식적 이행이 아닌 실질적 역량 강화가 목표.' },
  { label: '교육 기록 = 규제 점검 핵심 증빙', body: '참석자 명단, 교육 일시/장소, 교육 자료, 평가 결과, 개선 조치. 미이수자 보충 교육까지 기록해야 완결.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rk-arrow)" />;
}

export default function RecordKeepingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rk-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 보관 대상 4범주 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">VASP 기록 보관 4범주</text>

              <ModuleBox x={170} y={28} w={140} h={38} label="특금법 제5조의3" sub="보관 의무" color={C.record} />

              <Arrow x1={200} y1={66} x2={70} y2={88} color={C.record} />
              <Arrow x1={225} y1={66} x2={195} y2={88} color={C.record} />
              <Arrow x1={255} y1={66} x2={315} y2={88} color={C.record} />
              <Arrow x1={280} y1={66} x2={420} y2={88} color={C.record} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <DataBox x={10} y={93} w={120} h={34} label="CDD 자료" sub="실명/신분증/EDD" color={C.record} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <DataBox x={140} y={93} w={110} h={34} label="거래 내역" sub="입출금/TX 해시" color={C.record} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <DataBox x={260} y={93} w={110} h={34} label="SAR 사본" sub="전문+경보 로그" color={C.warn} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <DataBox x={380} y={93} w={90} h={34} label="내부 통제" sub="정책/교육/감사" color={C.record} />
              </motion.g>

              {/* 활용 목적 */}
              <rect x={10} y={145} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={162} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">활용 목적</text>

              <text x={70} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">고객 신원 재확인</text>
              <text x={195} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">자금 흐름 추적</text>
              <text x={315} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">보고 의무 증빙</text>
              <text x={425} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">체계 적정성 입증</text>

              <AlertBox x={120} y={190} w={240} h={25} label="SAR 사본 = 별도 저장소 + 엄격 접근 통제" color={C.warn} />
            </motion.g>
          )}

          {/* Step 1: 보관 기간 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">최소 5년 보관 — 기산점이 다르다</text>

              {/* 타임라인 기반 */}
              <rect x={30} y={40} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} />

              {/* CDD */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={20} y={50} w={100} h={32} label="CDD 자료" sub="5년 이상" color={C.record} />
                <text x={140} y={70} fontSize={7} fill="var(--muted-foreground)">기산: 계정 해지일</text>
                <rect x={135} y={55} width={5} height={5} rx={2.5} fill={C.record} />
              </motion.g>

              {/* 거래 내역 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={20} y={90} w={100} h={32} label="거래 내역" sub="5년 이상" color={C.time} />
                <text x={140} y={110} fontSize={7} fill="var(--muted-foreground)">기산: 거래 발생일</text>
                <rect x={135} y={95} width={5} height={5} rx={2.5} fill={C.time} />
              </motion.g>

              {/* SAR 사본 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={20} y={130} w={100} h={32} label="SAR 사본" sub="5년 이상" color={C.warn} />
                <text x={140} y={150} fontSize={7} fill="var(--muted-foreground)">기산: SAR 제출일</text>
                <rect x={135} y={135} width={5} height={5} rx={2.5} fill={C.warn} />
              </motion.g>

              {/* 내부 통제 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={20} y={170} w={100} h={32} label="내부 통제" sub="5년 이상 (연장 가능)" color={C.edu} />
                <text x={140} y={190} fontSize={7} fill="var(--muted-foreground)">기산: 문서 작성일</text>
                <rect x={135} y={175} width={5} height={5} rx={2.5} fill={C.edu} />
              </motion.g>

              {/* 5년 바 */}
              <rect x={250} y={50} width={200} height={155} rx={8} fill="var(--card)" stroke={C.time} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={350} y={70} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.time}>최소 5년</text>
              <text x={350} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">실무 권고: 7~10년</text>

              <AlertBox x={270} y={110} w={160} h={35} label="수사 진행 중이면" sub="수사 종료까지 보관 연장" color={C.warn} />
              <DataBox x={270} y={155} w={160} h={30} label="미보관 = 핵심 의무 위반" color={C.warn} />
            </motion.g>
          )}

          {/* Step 2: 보관 방법 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">보관 5대 보안 요건</text>

              {/* 5개 요건 - 좌에서 우 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={10} y={30} w={80} h={55} label="전자 보관" sub="DB + 스토리지" color={C.secure} />
              </motion.g>
              <Arrow x1={90} y1={57} x2={105} y2={57} color={C.secure} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ModuleBox x={108} y={30} w={80} h={55} label="암호화" sub="AES-256+" color={C.secure} />
              </motion.g>
              <Arrow x1={188} y1={57} x2={203} y2={57} color={C.secure} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={206} y={30} w={80} h={55} label="접근 통제" sub="RBAC + 로그" color={C.secure} />
              </motion.g>
              <Arrow x1={286} y1={57} x2={301} y2={57} color={C.secure} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ModuleBox x={304} y={30} w={80} h={55} label="무결성" sub="WORM/해시체인" color={C.secure} />
              </motion.g>
              <Arrow x1={384} y1={57} x2={399} y2={57} color={C.secure} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <ModuleBox x={402} y={30} w={68} h={55} label="백업" sub="이중화" color={C.secure} />
              </motion.g>

              {/* 목적 연결 */}
              <Arrow x1={50} y1={85} x2={50} y2={108} color={C.record} />
              <Arrow x1={148} y1={85} x2={148} y2={108} color={C.record} />
              <Arrow x1={246} y1={85} x2={246} y2={108} color={C.record} />
              <Arrow x1={344} y1={85} x2={344} y2={108} color={C.record} />
              <Arrow x1={436} y1={85} x2={436} y2={108} color={C.record} />

              <DataBox x={5} y={112} w={90} h={25} label="즉시 검색" color={C.record} />
              <DataBox x={103} y={112} w={90} h={25} label="기밀성 보호" color={C.record} />
              <DataBox x={201} y={112} w={90} h={25} label="열람 추적" color={C.record} />
              <DataBox x={299} y={112} w={90} h={25} label="증거 능력" color={C.record} />
              <DataBox x={397} y={112} w={75} h={25} label="소실 방지" color={C.record} />

              {/* 핵심 경고 */}
              <rect x={40} y={155} width={400} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={80} y={165} w={320} h={40} label="'보관했지만 찾을 수 없다' = 미보관" sub="수사기관/FIU 요청 시 즉시 제공 가능해야 의미 있음" color={C.warn} />
            </motion.g>
          )}

          {/* Step 3: 정기 교육 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">대상별 교육 주기와 내용</text>

              {/* 4 대상 그룹 */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={15} y={30} w={105} h={50} label="전 직원" sub="연 1회 이상" color={C.edu} />
                <text x={67} y={95} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">특금법 개요</text>
                <text x={67} y={106} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Tipping-off 금지</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={130} y={30} w={105} h={50} label="CS팀/승인자" sub="반기 1회 이상" color={C.edu} />
                <text x={182} y={95} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">의심 징후 식별</text>
                <text x={182} y={106} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">안내 스크립트</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={245} y={30} w={105} h={50} label="AML 담당자" sub="분기 1회 이상" color={C.edu} />
                <text x={297} y={95} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">SAR 작성법 심화</text>
                <text x={297} y={106} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">최신 세탁 유형</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={360} y={30} w={105} h={50} label="경영진" sub="연 1회 이상" color={C.edu} />
                <text x={412} y={95} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">규제 환경 변화</text>
                <text x={412} y={106} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">경영진 책임</text>
              </motion.g>

              {/* 주기 시각화 바 */}
              <rect x={15} y={120} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={138} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">교육 주기 (연간)</text>

              {/* 주기 바 */}
              <StatusBox x={15} y={145} w={105} h={35} label="전 직원" color={C.edu} progress={0.25} />
              <StatusBox x={130} y={145} w={105} h={35} label="CS팀" color={C.edu} progress={0.5} />
              <StatusBox x={245} y={145} w={105} h={35} label="AML" color={C.edu} progress={1} />
              <StatusBox x={360} y={145} w={105} h={35} label="경영진" color={C.edu} progress={0.25} />

              <text x={67} y={198} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">1회/년</text>
              <text x={182} y={198} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">2회/년</text>
              <text x={297} y={198} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">4회/년</text>
              <text x={412} y={198} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">1회/년</text>
            </motion.g>
          )}

          {/* Step 4: 교육 기록 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">교육 기록 = 규제 점검 핵심 증빙</text>

              <ModuleBox x={170} y={28} w={140} h={38} label="교육 실시" sub="규제 점검 대비" color={C.edu} />

              {/* 5개 기록 항목 */}
              <Arrow x1={200} y1={66} x2={55} y2={88} color={C.edu} />
              <Arrow x1={220} y1={66} x2={160} y2={88} color={C.edu} />
              <Arrow x1={240} y1={66} x2={240} y2={88} color={C.edu} />
              <Arrow x1={260} y1={66} x2={340} y2={88} color={C.edu} />
              <Arrow x1={280} y1={66} x2={430} y2={88} color={C.edu} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <DataBox x={5} y={93} w={100} h={28} label="참석자 명단" color={C.edu} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <DataBox x={110} y={93} w={90} h={28} label="일시/장소" color={C.edu} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <DataBox x={205} y={93} w={80} h={28} label="교육 자료" color={C.edu} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <DataBox x={290} y={93} w={90} h={28} label="평가 결과" color={C.edu} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <DataBox x={385} y={93} w={85} h={28} label="개선 조치" color={C.edu} />
              </motion.g>

              {/* 미이수 처리 */}
              <rect x={15} y={138} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={148} w={180} h={35} label="미이수자 → 보충 교육" sub="보충 일정 + 이수 확인 기록 필수" color={C.warn} />

              <Arrow x1={210} y1={165} x2={245} y2={165} color={C.secure} />

              <rect x={248} y={148} width={200} height={35} rx={8} fill="var(--card)" stroke={C.secure} strokeWidth={1} />
              <text x={348} y={163} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.secure}>기록 있음 = 과태료 감경</text>
              <text x={348} y={176} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">미비 시 = 핵심 의무 위반 → 과태료 급증</text>

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill={C.time} fontWeight={600}>기록 보관 + 교육 = "비용"이 아니라 "보험"</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
