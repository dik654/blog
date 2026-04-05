import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  root: '#ef4444',
  prog: '#6366f1',
  human: '#f59e0b',
  db: '#10b981',
  petra: '#8b5cf6',
  log: '#64748b',
};

const STEPS = [
  { label: 'BEFORE: root 하나로 전부', body: 'root 또는 공용 계정 하나로 서비스, 원장, 백업, 관리 모두 접속. 누가 무슨 작업을 했는지 추적 불가.' },
  { label: 'AFTER: 프로그램 계정 5종', body: '용도별로 filadmin, filuser, filledger, petra, backup 계정 분리. 각 계정은 필요한 DB·테이블에만 접근 가능.' },
  { label: 'AFTER: 사람 계정 3종', body: 'super_admin(DBA), service_admin(개발자), ledger_admin(원장담당). 기본 SELECT만, 추가 권한은 작업신청서로.' },
  { label: 'PETRA 접근제어 흐름', body: '모든 DB 접속은 PETRA를 경유. 세션·쿼리·IP 통제 + 쿼리/차단/로그인 로그 → 월간 검토 → 보고서.' },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#db-arrow)" />
  );
}

export default function AccessDbViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="db-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: BEFORE ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* root 계정 */}
              <AlertBox x={170} y={5} w={140} h={55} label="root 계정" sub="모든 권한, 공용 사용" color={C.root} />

              {/* 화살표: root → 각 DB */}
              <Arrow x1={210} y1={60} x2={70} y2={90} color={C.root} />
              <Arrow x1={230} y1={60} x2={190} y2={90} color={C.root} />
              <Arrow x1={260} y1={60} x2={310} y2={90} color={C.root} />
              <Arrow x1={280} y1={60} x2={420} y2={90} color={C.root} />

              {/* DB 대상들 */}
              <DataBox x={25} y={95} w={95} h={34} label="서비스 DB" color={C.db} />
              <DataBox x={145} y={95} w={95} h={34} label="원장 DB" color={C.db} />
              <DataBox x={265} y={95} w={95} h={34} label="백업" color={C.db} />
              <DataBox x={385} y={95} w={80} h={34} label="관리" color={C.db} />

              {/* 결함 */}
              <rect x={60} y={155} width={360} height={45} rx={8}
                fill={`${C.root}06`} stroke={C.root} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={175} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.root}>결함: 계정 미분리</text>
              <text x={240} y={191} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">역할별 분리 없음 / 프로그램·사람 구분 없음 / 추적 불가</text>
            </motion.g>
          )}

          {/* ── Step 1: 프로그램 계정 5종 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.prog}>프로그램용 계정 5종</text>

              {/* 계정들 (좌측 세로) */}
              <ModuleBox x={10} y={25} w={110} h={34} label="filadmin" sub="서비스 DB 관리" color={C.prog} />
              <ModuleBox x={10} y={65} w={110} h={34} label="filuser" sub="서비스 앱 연결" color={C.prog} />
              <ModuleBox x={10} y={105} w={110} h={34} label="filledger" sub="원장 앱 연결" color={C.prog} />
              <ModuleBox x={10} y={145} w={110} h={34} label="petra" sub="메타데이터 조회" color={C.petra} />
              <ModuleBox x={10} y={185} w={110} h={34} label="backup" sub="SELECT+LOCK" color={C.log} />

              {/* 권한 표시 (중앙) */}
              <text x={200} y={47} fontSize={8} fill="var(--muted-foreground)">DDL/DML 전체</text>
              <text x={200} y={87} fontSize={8} fill="var(--muted-foreground)">SELECT/INSERT/UPDATE</text>
              <text x={200} y={127} fontSize={8} fill="var(--muted-foreground)">SELECT/INSERT</text>
              <text x={200} y={167} fontSize={8} fill="var(--muted-foreground)">테이블/컬럼 목록만</text>
              <text x={200} y={207} fontSize={8} fill="var(--muted-foreground)">SELECT+LOCK+RELOAD</text>

              {/* 화살표 → 대상 DB */}
              <Arrow x1={270} y1={42} x2={340} y2={42} color={C.prog} />
              <Arrow x1={270} y1={82} x2={340} y2={82} color={C.prog} />
              <Arrow x1={270} y1={122} x2={340} y2={122} color={C.prog} />
              <Arrow x1={270} y1={162} x2={340} y2={162} color={C.petra} />
              <Arrow x1={270} y1={202} x2={340} y2={202} color={C.log} />

              {/* DB 대상 (우측) */}
              <DataBox x={343} y={28} w={120} h={28} label="서비스 DB" color={C.db} />
              <DataBox x={343} y={68} w={120} h={28} label="서비스 DB (제한)" color={C.db} />
              <DataBox x={343} y={108} w={120} h={28} label="원장 DB (제한)" color={C.db} />
              <DataBox x={343} y={148} w={120} h={28} label="메타데이터" color={C.petra} />
              <DataBox x={343} y={188} w={120} h={28} label="전체 DB (읽기)" color={C.log} />
            </motion.g>
          )}

          {/* ── Step 2: 사람 계정 3종 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.human}>사람용 계정 3종 + 작업신청서</text>

              {/* 계정 박스 */}
              <ActionBox x={10} y={25} w={130} h={42} label="super_admin" sub="DBA / 전체 권한" color={C.human} />
              <ActionBox x={10} y={80} w={130} h={42} label="service_admin" sub="개발자 / 기본 SELECT" color={C.human} />
              <ActionBox x={10} y={135} w={130} h={42} label="ledger_admin" sub="원장담당 / 기본 SELECT" color={C.human} />

              {/* super_admin은 직접 연결 */}
              <Arrow x1={140} y1={46} x2={350} y2={46} color={C.human} />
              <text x={250} y={42} textAnchor="middle" fontSize={8} fill={C.human}>전체 관리 권한</text>

              {/* service_admin / ledger_admin → 신청서 → 승인 → 임시 권한 */}
              <Arrow x1={140} y1={101} x2={180} y2={101} color={C.human} />
              <Arrow x1={140} y1={156} x2={180} y2={156} color={C.human} />

              <DataBox x={183} y={88} w={95} h={28} label="작업신청서" color={C.human} />
              <DataBox x={183} y={143} w={95} h={28} label="작업신청서" color={C.human} />

              <Arrow x1={278} y1={101} x2={310} y2={101} color={C.db} />
              <Arrow x1={278} y1={156} x2={310} y2={156} color={C.db} />

              <text x={295} y={96} fontSize={8} fill={C.db}>승인</text>
              <text x={295} y={151} fontSize={8} fill={C.db}>승인</text>

              {/* 임시 권한 */}
              <ModuleBox x={313} y={80} w={150} h={42} label="기간한정 권한 부여" sub="만료 시 자동 회수" color={C.db} />
              <ModuleBox x={313} y={135} w={150} h={42} label="기간한정 권한 부여" sub="만료 시 자동 회수" color={C.db} />

              {/* 최소 권한 원칙 */}
              <rect x={60} y={190} width={360} height={24} rx={6} fill="var(--card)" stroke={C.human} strokeWidth={0.5} />
              <text x={240} y={206} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.human}>
                최소 권한 원칙: 기본 SELECT만 → 필요 시 신청 → 기간 후 자동 회수
              </text>
            </motion.g>
          )}

          {/* ── Step 3: PETRA 흐름 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 메인 경로 */}
              <ModuleBox x={10} y={15} w={100} h={48} label="개발자 PC" sub="망분리 환경" color={C.human} />
              <Arrow x1={110} y1={39} x2={145} y2={39} color={C.petra} />

              <ActionBox x={148} y={15} w={140} h={48} label="PETRA" sub="세션·쿼리·IP 통제" color={C.petra} />
              <Arrow x1={288} y1={39} x2={323} y2={39} color={C.db} />

              <ModuleBox x={326} y={15} w={100} h={48} label="DB 서버" sub="3306 포트" color={C.db} />

              {/* 직접 접속 차단 */}
              <line x1={110} y1={55} x2={326} y2={55}
                stroke={C.root} strokeWidth={0.8} strokeDasharray="3 3" />
              <text x={218} y={68} textAnchor="middle" fontSize={8} fill={C.root}>직접 접속 차단 (방화벽)</text>

              {/* 로그 산출 */}
              <rect x={30} y={85} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">PETRA 로그 → 월간 검토</text>

              <DataBox x={15} y={110} w={100} h={30} label="쿼리 로그" color={C.log} />
              <DataBox x={135} y={110} w={100} h={30} label="차단 로그" color={C.root} />
              <DataBox x={255} y={110} w={100} h={30} label="로그인 로그" color={C.log} />

              {/* 화살표 → 검토 → 보고서 */}
              <Arrow x1={65} y1={140} x2={200} y2={165} color={C.log} />
              <Arrow x1={185} y1={140} x2={200} y2={165} color={C.log} />
              <Arrow x1={305} y1={140} x2={270} y2={165} color={C.log} />

              <ActionBox x={170} y={160} w={130} h={38} label="월간 검토" sub="이상 유무 판단" color={C.petra} />
              <Arrow x1={300} y1={179} x2={335} y2={179} color={C.db} />

              <DataBox x={338} y={163} w={120} h={32} label="구글 폼 보고서" color={C.db} />

              <text x={398} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">= ISMS 증적</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
