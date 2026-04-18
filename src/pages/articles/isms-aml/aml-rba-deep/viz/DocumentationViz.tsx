import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = { blue: '#6366f1', green: '#10b981', amber: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '문서화 5대 범주', body: '위험평가, 정책·절차, CDD 기록, 거래·보고, 교육·감사 — 전부 문서화 대상.' },
  { label: '보관 기간 — 5년 이상', body: '거래 관계 종료일 기준 5년. 검색 가능·무결성 보장·추출 가능 상태 유지.' },
  { label: '분기별 의무이행 점검', body: 'CDD 이행률, STR 적시성, FDS 오탐률, 교육 이수율 — 2선이 자체 점검.' },
  { label: '지적사항 사후관리', body: '중대 30일·주요 60일·경미 90일 내 개선. 미이행 시 자동 에스컬레이션.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#doc-arrow)" />;
}

export default function DocumentationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="doc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>AML/CFT 문서화 5대 범주</text>

              {/* 5 document categories as boxes */}
              <DataBox x={15} y={35} w={85} h={38} label="위험평가" sub="계획·결과보고" color={C.red} />
              <DataBox x={110} y={35} w={85} h={38} label="정책·절차" sub="규정·매뉴얼" color={C.blue} />
              <DataBox x={205} y={35} w={85} h={38} label="CDD 기록" sub="신원·검증·등급" color={C.green} />
              <DataBox x={300} y={35} w={85} h={38} label="거래·보고" sub="STR·CTR" color={C.amber} />
              <DataBox x={395} y={35} w={75} h={38} label="교육·감사" sub="기록·보고서" color={C.blue} />

              {/* Detail rows */}
              <rect x={15} y={85} width={85} height={50} rx={4} fill={`${C.red}06`} stroke={C.red} strokeWidth={0.3} />
              <text x={57} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">평가 범위</text>
              <text x={57} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">위험 매트릭스</text>
              <text x={57} y={124} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">개선 계획</text>

              <rect x={110} y={85} width={85} height={50} rx={4} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.3} />
              <text x={152} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">버전 관리</text>
              <text x={152} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">승인 이력</text>
              <text x={152} y={124} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">개정 사유</text>

              <rect x={205} y={85} width={85} height={50} rx={4} fill={`${C.green}06`} stroke={C.green} strokeWidth={0.3} />
              <text x={247} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">신분증 사본</text>
              <text x={247} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">eKYC 결과</text>
              <text x={247} y={124} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">EDD 보고서</text>

              <rect x={300} y={85} width={85} height={50} rx={4} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.3} />
              <text x={342} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">거래 일시·금액</text>
              <text x={342} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">보고 일자</text>
              <text x={342} y={124} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">접수 번호</text>

              <rect x={395} y={85} width={75} height={50} rx={4} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.3} />
              <text x={432} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">교육 참석자</text>
              <text x={432} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">감사 지적</text>
              <text x={432} y={124} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">조치 결과</text>

              {/* Bottom note */}
              <rect x={60} y={150} width={360} height={28} rx={6} fill={`${C.red}06`} stroke={C.red} strokeWidth={0.4} />
              <text x={240} y={162} textAnchor="middle" fontSize={8.5} fill={C.red}>
                문서화 없으면 증명 불가 — 규제 검사·감사·FATF 상호평가 모두 문서 기반
              </text>
              <text x={240} y={174} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                체계적 문서화 = 조직 학습 기반 (위험 추이, 취약 영역 데이터 확인)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.green}>보관 기간 — 특금법 제5조의3</text>

              {/* Timeline visualization */}
              <line x1={40} y1={60} x2={440} y2={60} stroke="var(--border)" strokeWidth={1.2} />

              {/* Account open */}
              <circle cx={80} cy={60} r={5} fill={C.blue} />
              <text x={80} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.blue}>계정 개설</text>
              <text x={80} y={78} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2024</text>

              {/* Account close */}
              <circle cx={200} cy={60} r={5} fill={C.amber} />
              <text x={200} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.amber}>계정 탈퇴</text>
              <text x={200} y={78} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2027</text>

              {/* 5 year retention */}
              <rect x={200} y={55} width={200} height={10} rx={3} fill={`${C.green}30`} />
              <text x={300} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>5년 보관 의무</text>

              {/* Expiry */}
              <circle cx={400} cy={60} r={5} fill={C.red} />
              <text x={400} y={78} textAnchor="middle" fontSize={8} fill={C.red}>2032 파기</text>

              {/* 4 data types */}
              <ActionBox x={20} y={100} w={100} h={34} label="CDD 자료" sub="관계 종료일 기준" color={C.blue} />
              <ActionBox x={130} y={100} w={100} h={34} label="거래 기록" sub="거래일 or 종료일" color={C.amber} />
              <ActionBox x={240} y={100} w={100} h={34} label="STR 보고" sub="보고일 기준" color={C.red} />
              <ActionBox x={350} y={100} w={110} h={34} label="Travel Rule" sub="관계 종료일 기준" color={C.green} />

              {/* Requirements */}
              <rect x={40} y={150} width={400} height={50} rx={6} fill={`${C.green}06`} stroke={C.green} strokeWidth={0.4} />
              <text x={240} y={166} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>보관 형태 요건</text>
              <text x={150} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">검색 가능</text>
              <text x={240} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">무결성 보장</text>
              <text x={340} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">추출 가능</text>
              <text x={240} y={196} textAnchor="middle" fontSize={7.5} fill={C.amber}>
                수사 진행 중 → 수사 종결 시까지 보관 연장 / 특금법이 개인정보보호법보다 우선
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>분기별 의무이행 점검 (2선 기능)</text>

              {/* 5 check items as gauges */}
              <ModuleBox x={15} y={38} w={85} h={44} label="CDD 이행률" sub="100% 목표" color={C.green} />
              <rect x={20} y={90} width={75} height={6} rx={3} fill="var(--border)" />
              <rect x={20} y={90} width={70} height={6} rx={3} fill={C.green} opacity={0.7} />
              <text x={57} y={108} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">미완료 사유 기록</text>

              <ModuleBox x={110} y={38} w={85} h={44} label="EDD 적시성" sub="기한 준수" color={C.blue} />
              <rect x={115} y={90} width={75} height={6} rx={3} fill="var(--border)" />
              <rect x={115} y={90} width={55} height={6} rx={3} fill={C.blue} opacity={0.7} />
              <text x={152} y={108} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">내부 규정 기한</text>

              <ModuleBox x={205} y={38} w={85} h={44} label="STR 보고" sub="3영업일 이내" color={C.red} />
              <rect x={210} y={90} width={75} height={6} rx={3} fill="var(--border)" />
              <rect x={210} y={90} width={65} height={6} rx={3} fill={C.red} opacity={0.7} />
              <text x={247} y={108} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">법정 기한</text>

              <ModuleBox x={300} y={38} w={85} h={44} label="FDS 오탐률" sub="추이 개선" color={C.amber} />
              <rect x={305} y={90} width={75} height={6} rx={3} fill="var(--border)" />
              <rect x={305} y={90} width={40} height={6} rx={3} fill={C.amber} opacity={0.7} />
              <text x={342} y={108} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">오탐 감소 여부</text>

              <ModuleBox x={395} y={38} w={75} h={44} label="교육 이수율" sub="100% 이수" color={C.green} />
              <rect x={400} y={90} width={65} height={6} rx={3} fill="var(--border)" />
              <rect x={400} y={90} width={60} height={6} rx={3} fill={C.green} opacity={0.7} />
              <text x={432} y={108} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">연 1회 이상</text>

              {/* Audit flow */}
              <rect x={40} y={125} width={400} height={50} rx={6} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.4} />
              <text x={240} y={142} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.blue}>연 1회 외부 감사 (FATF R.18)</text>
              <text x={120} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CDD 샘플 30건+</text>
              <text x={240} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FDS 규칙 검토</text>
              <text x={360} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">위험평가 정확성</text>

              {/* Note */}
              <rect x={80} y={188} width={320} height={22} rx={4} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.3} strokeDasharray="3,3" />
              <text x={240} y={203} textAnchor="middle" fontSize={8} fill={C.amber}>
                외부 감사인: 독립성 + AML 전문성 + CAMS 자격 + 3년 로테이션 권장
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>지적사항 사후관리 — 에스컬레이션</text>

              {/* Three severity levels */}
              <ModuleBox x={20} y={38} w={130} h={44} label="중대 (Critical)" sub="30일 이내 개선" color={C.red} />
              <ModuleBox x={175} y={38} w={130} h={44} label="주요 (Major)" sub="60일 이내 개선" color={C.amber} />
              <ModuleBox x={330} y={38} w={130} h={44} label="경미 (Minor)" sub="90일 이내 개선" color={C.green} />

              {/* Escalation flows */}
              <Arrow x1={85} y1={82} x2={85} y2={105} color={C.red} />
              <rect x={20} y={105} width={130} height={32} rx={5} fill={`${C.red}10`} stroke={C.red} strokeWidth={0.5} />
              <text x={85} y={120} textAnchor="middle" fontSize={8} fill={C.red} fontWeight={600}>이사회 긴급 보고</text>
              <text x={85} y={132} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">업무 중단 검토</text>

              <Arrow x1={240} y1={82} x2={240} y2={105} color={C.amber} />
              <rect x={175} y={105} width={130} height={32} rx={5} fill={`${C.amber}10`} stroke={C.amber} strokeWidth={0.5} />
              <text x={240} y={120} textAnchor="middle" fontSize={8} fill={C.amber} fontWeight={600}>위원회 보고</text>
              <text x={240} y={132} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">시정 계획 재요구</text>

              <Arrow x1={395} y1={82} x2={395} y2={105} color={C.green} />
              <rect x={330} y={105} width={130} height={32} rx={5} fill={`${C.green}10`} stroke={C.green} strokeWidth={0.5} />
              <text x={395} y={120} textAnchor="middle" fontSize={8} fill={C.green} fontWeight={600}>CCO 보고</text>
              <text x={395} y={132} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">차기 점검 시 확인</text>

              {/* Auto escalation */}
              <rect x={40} y={150} width={400} height={28} rx={5} fill={`${C.red}08`} stroke={C.red} strokeWidth={0.5} />
              <text x={240} y={163} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>
                기한 초과 → 자동 에스컬레이션 (수동 의존 시 은폐 가능)
              </text>
              <text x={240} y={175} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                지적+개선 이력 자체가 문서화 대상 → 반복 지적 방지
              </text>

              {/* Repeat finding */}
              <rect x={80} y={190} width={320} height={26} rx={4} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.4} strokeDasharray="3,3" />
              <text x={240} y={207} textAnchor="middle" fontSize={8} fill={C.amber}>
                동일 지적 2회 연속 → 체계적 미흡 → 근본 원인 분석 + 프로세스 재설계
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
