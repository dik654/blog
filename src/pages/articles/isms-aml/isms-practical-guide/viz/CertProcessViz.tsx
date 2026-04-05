import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  prep: '#6366f1',
  doc: '#10b981',
  audit: '#f59e0b',
  fix: '#ef4444',
  done: '#22c55e',
};

const STEPS = [
  { label: '준비 단계 (2~3개월)', body: '정보자산 목록화, 정책 문서 작성, 증적 폴더 구성. 모든 후속 심사의 기초가 되는 산출물을 만드는 단계.' },
  { label: '서면심사 (2~3주)', body: '심사원이 제출된 문서를 검토. 누락 항목과 정책-현실 괴리를 GAP 분석표로 도출.' },
  { label: '현장심사 (3~5일)', body: '심사원이 직접 서버 접속, 웹사이트 확인, 담당자 인터뷰. 문서가 아니라 "실제 동작"을 본다.' },
  { label: '보완조치 (1~2개월)', body: '도출된 결함을 수정하고 증적을 첨부하여 보완조치 내역서를 제출. 완료 공문까지가 한 세트.' },
  { label: '인증 획득 + 사후관리', body: '보완 적합 판정 → 인증서 발급. 3년 유효, 매년 사후심사. 지속적 관리가 핵심.' },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#arrow)" />
    </g>
  );
}

export default function CertProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 준비 단계 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 모듈: 주요 작업 */}
              <ModuleBox x={10} y={10} w={130} h={50} label="정보자산 목록화" sub="서버·DB·네트워크 전수조사" color={C.prep} />
              <ModuleBox x={170} y={10} w={130} h={50} label="정책 문서 작성" sub="보호정책·지침·절차서" color={C.prep} />
              <ModuleBox x={330} y={10} w={130} h={50} label="증적 폴더 구성" sub="항목별 폴더·파일명 규칙" color={C.prep} />

              <Arrow x1={140} y1={35} x2={168} y2={35} color={C.prep} />
              <Arrow x1={300} y1={35} x2={328} y2={35} color={C.prep} />

              {/* 산출물 */}
              <Arrow x1={75} y1={60} x2={75} y2={85} color={C.doc} />
              <Arrow x1={235} y1={60} x2={235} y2={85} color={C.doc} />
              <Arrow x1={395} y1={60} x2={395} y2={85} color={C.doc} />

              <DataBox x={30} y={90} w={100} h={34} label="정보자산관리대장" color={C.doc} />
              <DataBox x={185} y={90} w={105} h={34} label="정보보호정책서" color={C.doc} />
              <DataBox x={350} y={90} w={100} h={34} label="위험평가 보고서" color={C.doc} />

              {/* 타임라인 바 */}
              <rect x={30} y={150} width={420} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={30} y={150} width={84} height={8} rx={4} fill={C.prep}
                initial={{ width: 0 }} animate={{ width: 84 }} transition={{ duration: 0.6 }} />
              <text x={72} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2~3개월</text>

              {/* 타임라인 라벨 */}
              <text x={30} y={200} fontSize={9} fontWeight={600} fill={C.prep}>준비</text>
              <text x={115} y={200} fontSize={9} fill="var(--muted-foreground)">서면</text>
              <text x={200} y={200} fontSize={9} fill="var(--muted-foreground)">현장</text>
              <text x={300} y={200} fontSize={9} fill="var(--muted-foreground)">보완</text>
              <text x={400} y={200} fontSize={9} fill="var(--muted-foreground)">인증</text>
            </motion.g>
          )}

          {/* ── Step 1: 서면심사 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={15} w={120} h={45} label="정책 문서 검토" sub="심사원이 제출 문서 확인" color={C.audit} />
              <Arrow x1={140} y1={37} x2={175} y2={37} color={C.audit} />

              <DataBox x={178} y={20} w={110} h={34} label="GAP 분석표" color={C.doc} />
              <Arrow x1={288} y1={37} x2={320} y2={37} color={C.fix} />

              <AlertBox x={322} y={12} w={140} h={50} label="미비 문서 목록" sub="누락·불일치·미갱신 항목" color={C.fix} />

              {/* 하단: 구체적 검토 항목 */}
              <rect x={20} y={85} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">심사원 확인 포인트</text>

              <DataBox x={15} y={115} w={100} h={30} label="자산관리대장" color={C.doc} />
              <DataBox x={130} y={115} w={100} h={30} label="접근권한 현황" color={C.doc} />
              <DataBox x={245} y={115} w={100} h={30} label="위험평가서" color={C.doc} />
              <DataBox x={360} y={115} w={100} h={30} label="보호대책 이행표" color={C.doc} />

              {/* 타임라인 바 */}
              <rect x={30} y={170} width={420} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={30} y={170} width={168} height={8} rx={4} fill={C.audit}
                initial={{ width: 84 }} animate={{ width: 168 }} transition={{ duration: 0.6 }} />
              <text x={126} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2~3주</text>
            </motion.g>
          )}

          {/* ── Step 2: 현장심사 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.audit}>심사원 직접 확인 항목</text>

              <ActionBox x={15} y={30} w={135} h={42} label="서버 명령어 확인" sub="nginx -V, netstat, ps" color={C.audit} />
              <ActionBox x={170} y={30} w={135} h={42} label="웹 접속 테스트" sub="404페이지, 헤더 노출" color={C.audit} />
              <ActionBox x={325} y={30} w={135} h={42} label="담당자 인터뷰" sub="절차 숙지 여부 확인" color={C.audit} />

              {/* 화살표 연결: 위 → 아래 결과 */}
              <Arrow x1={82} y1={72} x2={82} y2={95} color={C.audit} />
              <Arrow x1={237} y1={72} x2={237} y2={95} color={C.audit} />
              <Arrow x1={392} y1={72} x2={392} y2={95} color={C.audit} />

              <ActionBox x={15} y={98} w={135} h={42} label="DB 로그 확인" sub="PETRA 접속 로그 직접 조회" color={C.fix} />
              <ActionBox x={170} y={98} w={135} h={42} label="2차인증 테스트" sub="관리자 페이지 직접 접속" color={C.fix} />
              <ActionBox x={325} y={98} w={135} h={42} label="출입 명부 확인" sub="월렛룸 물리 보안" color={C.fix} />

              {/* 타임라인 바 */}
              <rect x={30} y={170} width={420} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={30} y={170} width={252} height={8} rx={4} fill={C.audit}
                initial={{ width: 168 }} animate={{ width: 252 }} transition={{ duration: 0.6 }} />
              <text x={210} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">3~5일</text>
            </motion.g>
          )}

          {/* ── Step 3: 보완조치 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={10} y={15} w={95} h={48} label="결함 도출" sub="중결함 / 경결함" color={C.fix} />
              <Arrow x1={105} y1={39} x2={125} y2={39} color={C.fix} />

              <ActionBox x={128} y={18} w={110} h={42} label="보완조치 내역서" sub="결함별 수정 계획" color={C.audit} />
              <Arrow x1={238} y1={39} x2={258} y2={39} color={C.doc} />

              <DataBox x={261} y={22} w={90} h={34} label="증적 첨부" color={C.doc} />
              <Arrow x1={351} y1={39} x2={371} y2={39} color={C.done} />

              <DataBox x={374} y={22} w={90} h={34} label="완료 공문" color={C.done} />

              {/* 진행률 */}
              <StatusBox x={70} y={90} w={160} h={50} label="보완 진행률" sub="결함 수정 → 증적 수집 → 제출" color={C.audit} progress={0.7} />
              <StatusBox x={260} y={90} w={160} h={50} label="심사원 확인" sub="적합 판정 시 다음 단계" color={C.done} progress={0.4} />

              {/* 타임라인 바 */}
              <rect x={30} y={170} width={420} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={30} y={170} width={378} height={8} rx={4} fill={C.fix}
                initial={{ width: 252 }} animate={{ width: 378 }} transition={{ duration: 0.6 }} />
              <text x={315} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">1~2개월</text>
            </motion.g>
          )}

          {/* ── Step 4: 인증 획득 ── */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <StatusBox x={30} y={15} w={140} h={55} label="인증서 발급" sub="KISA 인증위원회 심의 통과" color={C.done} progress={1} />

              <Arrow x1={170} y1={42} x2={195} y2={42} color={C.done} />

              <ModuleBox x={198} y={18} w={130} h={50} label="사후심사" sub="매년 1회 현장심사" color={C.audit} />

              <Arrow x1={328} y1={42} x2={353} y2={42} color={C.audit} />

              <ModuleBox x={356} y={18} w={110} h={50} label="갱신심사" sub="3년 주기 재인증" color={C.prep} />

              {/* 연간 사이클 */}
              <rect x={30} y={90} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={110} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">3년 인증 유효기간</text>

              <DataBox x={30} y={120} w={80} h={30} label="1년차" color={C.done} />
              <Arrow x1={110} y1={135} x2={135} y2={135} color={C.audit} />
              <DataBox x={138} y={120} w={90} h={30} label="사후심사 1" color={C.audit} />
              <Arrow x1={228} y1={135} x2={253} y2={135} color={C.audit} />
              <DataBox x={256} y={120} w={90} h={30} label="사후심사 2" color={C.audit} />
              <Arrow x1={346} y1={135} x2={371} y2={135} color={C.prep} />
              <DataBox x={374} y={120} w={80} h={30} label="갱신심사" color={C.prep} />

              {/* 타임라인 바 */}
              <rect x={30} y={170} width={420} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={30} y={170} width={420} height={8} rx={4} fill={C.done}
                initial={{ width: 378 }} animate={{ width: 420 }} transition={{ duration: 0.6 }} />
              <text x={420} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">완료</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
