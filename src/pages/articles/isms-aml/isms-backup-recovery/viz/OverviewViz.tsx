import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'ISMS 2.12 — 백업 정책의 핵심 요구',
    body: '백업 정책 수립 + 안전한 보관/복구 절차 + 정기 복구 테스트. "무엇을, 얼마나 자주, 어디에, 얼마나 오래"를 정의.',
  },
  {
    label: '백업 대상 3분류 — 정보자원·구성정보·로그',
    body: '정보자원(DB, 바이너리) 최고 빈도. 구성정보(/etc 설정값) 없으면 동일 복원 불가. 로그 유실 시 사고 분석 불가.',
  },
  {
    label: 'RTO와 RPO — 복구 시간/시점 목표',
    body: 'RTO: 사고 → 서비스 복구 최대 허용 시간. RPO: 허용 데이터 손실 시간. BIA로 서비스별 차등 설정.',
  },
  {
    label: '3-2-1 규칙',
    body: '3개 복사본 · 2가지 매체 · 1개 오프사이트. 단일 장애점 제거로 전체 데이터 손실 가능성 최소화.',
  },
  {
    label: '백업 유형 — Full / Incremental / Differential',
    body: '전체백업: 복원 단순, 공간 大. 증분: 빠르지만 체인 의존. 차등: 중간. 주 1회 Full + 매일 Inc/Diff가 균형점.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#br-ov-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="br-ov-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={140} y={8} w={200} h={36} label="ISMS-P 2.12 재해복구" sub="백업 + 보관 + 복구 테스트" color={C.blue} />

              <Arrow x1={200} y1={46} x2={80} y2={68} color={C.blue} />
              <Arrow x1={240} y1={46} x2={240} y2={68} color={C.blue} />
              <Arrow x1={280} y1={46} x2={400} y2={68} color={C.blue} />

              <ActionBox x={20} y={68} w={120} h={38} label="백업 정책 수립" sub="무엇을·얼마나·어디에" color={C.blue} />
              <ActionBox x={175} y={68} w={130} h={38} label="안전한 보관/복구" sub="암호화·접근통제" color={C.green} />
              <ActionBox x={340} y={68} w={120} h={38} label="복구 테스트" sub="정기 검증" color={C.amber} />

              {/* Risks without backup */}
              <Arrow x1={80} y1={108} x2={80} y2={130} color={C.red} />
              <AlertBox x={20} y={130} w={120} h={34} label="랜섬웨어" sub="전체 데이터 영구손실" color={C.red} />
              <AlertBox x={170} y={130} w={120} h={34} label="HW 장애" sub="서비스 장기 중단" color={C.red} />
              <AlertBox x={320} y={130} w={140} h={34} label="규제 위반" sub="거래기록 보관 의무" color={C.red} />

              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">백업 = 업무 연속성(Business Continuity)의 핵심</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">백업 대상 3분류</text>

              <ModuleBox x={15} y={35} w={140} h={55} label="정보자원" sub="DB · 앱 바이너리 · 설정" color={C.blue} />
              <ModuleBox x={170} y={35} w={140} h={55} label="구성정보" sub="/etc · 방화벽 · crontab" color={C.green} />
              <ModuleBox x={325} y={35} w={140} h={55} label="로그정보" sub="접속·변경·관리자 행위" color={C.amber} />

              {/* Priority bars */}
              <StatusBox x={15} y={105} w={140} h={40} label="최고 빈도 백업" sub="핵심 자산 — 복구 불가" color={C.blue} progress={1} />
              <StatusBox x={170} y={105} w={140} h={40} label="동일 환경 복원용" sub="없으면 재구성 불가" color={C.green} progress={0.7} />
              <StatusBox x={325} y={105} w={140} h={40} label="사고 분석·감사 증거" sub="유실 시 중대 결함" color={C.amber} progress={0.5} />

              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">데이터 → 설정 → 로그 순으로 우선순위</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Timeline visual */}
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">RTO / RPO 개념</text>

              {/* Timeline axis */}
              <line x1={40} y1={80} x2={440} y2={80} stroke="var(--border)" strokeWidth={1} />
              {/* Incident point */}
              <circle cx={200} cy={80} r={5} fill={C.red} />
              <text x={200} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.red}>사고 발생</text>

              {/* RPO arrow (backward) */}
              <line x1={200} y1={95} x2={100} y2={95} stroke={C.amber} strokeWidth={2} markerEnd="url(#br-ov-arrow)" />
              <text x={150} y={115} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>RPO</text>
              <text x={150} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">허용 데이터 손실 시간</text>

              {/* RTO arrow (forward) */}
              <line x1={200} y1={95} x2={360} y2={95} stroke={C.green} strokeWidth={2} markerEnd="url(#br-ov-arrow)" />
              <text x={280} y={115} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>RTO</text>
              <text x={280} y={128} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">서비스 복구 최대 시간</text>

              {/* Recovery point */}
              <circle cx={360} cy={80} r={5} fill={C.green} />
              <text x={360} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.green}>서비스 재개</text>

              {/* Last backup */}
              <circle cx={100} cy={80} r={5} fill={C.amber} />
              <text x={100} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.amber}>마지막 백업</text>

              {/* BIA example */}
              <DataBox x={60} y={148} w={170} h={28} label="핵심 거래: RTO 1h / RPO 15m" color={C.red} />
              <DataBox x={260} y={148} w={170} h={28} label="내부 관리: RTO 24h / RPO 4h" color={C.blue} />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">BIA(업무영향분석)로 서비스별 차등 설정</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">3-2-1 백업 규칙</text>

              {/* 3 copies */}
              <DataBox x={30} y={35} w={120} h={30} label="3 복사본" sub="원본 1 + 백업 2" color={C.blue} />
              <DataBox x={180} y={35} w={120} h={30} label="2 매체" sub="클라우드 + 외장 HDD" color={C.green} />
              <DataBox x={330} y={35} w={120} h={30} label="1 오프사이트" sub="물리적 분리 보관" color={C.amber} />

              {/* Visual: 3 disks */}
              <rect x={45} y={80} width={30} height={40} rx={4} fill={C.blue} opacity={0.2} stroke={C.blue} strokeWidth={1} />
              <text x={60} y={105} textAnchor="middle" fontSize={9} fill={C.blue}>원본</text>
              <rect x={85} y={80} width={30} height={40} rx={4} fill={C.blue} opacity={0.2} stroke={C.blue} strokeWidth={1} />
              <text x={100} y={105} textAnchor="middle" fontSize={9} fill={C.blue}>백업1</text>
              <rect x={125} y={80} width={30} height={40} rx={4} fill={C.blue} opacity={0.2} stroke={C.blue} strokeWidth={1} />
              <text x={140} y={105} textAnchor="middle" fontSize={9} fill={C.blue}>백업2</text>

              {/* 2 media types */}
              <rect x={205} y={80} width={30} height={40} rx={4} fill={C.green} opacity={0.2} stroke={C.green} strokeWidth={1} />
              <text x={220} y={105} textAnchor="middle" fontSize={8} fill={C.green}>Cloud</text>
              <rect x={250} y={80} width={30} height={40} rx={4} fill={C.green} opacity={0.2} stroke={C.green} strokeWidth={1} />
              <text x={265} y={105} textAnchor="middle" fontSize={8} fill={C.green}>HDD</text>

              {/* Offsite */}
              <rect x={355} y={80} width={70} height={40} rx={4} fill={C.amber} opacity={0.15} stroke={C.amber} strokeWidth={1} strokeDasharray="4 3" />
              <text x={390} y={97} textAnchor="middle" fontSize={8} fill={C.amber}>서울 리전</text>
              <text x={390} y={110} textAnchor="middle" fontSize={8} fill={C.amber}>도쿄 리전</text>

              {/* Result */}
              <Arrow x1={240} y1={125} x2={240} y2={145} color={C.green} />
              <StatusBox x={120} y={145} w={240} h={38} label="단일 장애점 제거" sub="화재·침수·지진에도 데이터 생존" color={C.green} progress={1} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">백업 유형 비교</text>

              {/* Full backup */}
              <ModuleBox x={15} y={32} w={140} h={48} label="전체백업 (Full)" sub="전체 데이터 매번 복사" color={C.blue} />
              <text x={85} y={96} textAnchor="middle" fontSize={8} fill={C.green}>복원: 단순</text>
              <text x={85} y={108} textAnchor="middle" fontSize={8} fill={C.red}>공간: 많음</text>

              {/* Incremental */}
              <ModuleBox x={170} y={32} w={140} h={48} label="증분백업 (Inc)" sub="마지막 백업 후 변경분" color={C.green} />
              <text x={240} y={96} textAnchor="middle" fontSize={8} fill={C.green}>공간: 적음</text>
              <text x={240} y={108} textAnchor="middle" fontSize={8} fill={C.red}>복원: 체인 전체 필요</text>

              {/* Differential */}
              <ModuleBox x={325} y={32} w={140} h={48} label="차등백업 (Diff)" sub="마지막 Full 후 변경 전부" color={C.amber} />
              <text x={395} y={96} textAnchor="middle" fontSize={8} fill={C.green}>복원: Full + 최신 Diff</text>
              <text x={395} y={108} textAnchor="middle" fontSize={8} fill={C.amber}>공간: 중간</text>

              {/* Common strategy */}
              <Arrow x1={85} y1={115} x2={200} y2={135} color={C.blue} />
              <Arrow x1={240} y1={115} x2={240} y2={135} color={C.green} />
              <Arrow x1={395} y1={115} x2={280} y2={135} color={C.amber} />

              <DataBox x={130} y={135} w={220} h={30} label="주 1회 Full + 매일 Inc/Diff" sub="공간 효율 + 복원 편의 균형" color={C.green} />

              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">증분 체인 중간 손상 시 이후 복원 불가 — 차등이 더 안전</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
