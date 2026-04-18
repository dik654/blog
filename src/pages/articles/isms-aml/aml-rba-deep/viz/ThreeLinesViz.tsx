import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';

const C = { line1: '#10b981', line2: '#6366f1', line3: '#f59e0b', board: '#ef4444' };

const STEPS = [
  { label: '3선 방어 모델 전체 구조', body: '1선(현업) → 2선(준법감시) → 3선(내부감사), 상위에 위원회·이사회.' },
  { label: '1선 — 현업(Business)', body: 'CDD 실행, 거래 1차 검토, 이상 징후 발견 시 2선 보고. 영업-통제 이해충돌 존재.' },
  { label: '2선 — 준법감시(Compliance)', body: '정책 수립, FDS 알림 검토, STR 보고, 1선 품질 검증. 독립적 시각이 핵심 가치.' },
  { label: '3선 — 내부감사(Audit)', body: '체계 적정성·운영 효과성 평가, 이사회 직접 보고. 독립성이 생명선.' },
  { label: '보고 체계와 견제', body: '1선→2선→위원회→이사회, 3선→이사회(직통). CCO 은폐 시에도 견제 가능.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tl-arrow)" />;
}

export default function ThreeLinesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tl-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Board */}
              <ModuleBox x={180} y={8} w={120} h={34} label="이사회" sub="Board" color={C.board} />

              {/* Committee */}
              <ModuleBox x={180} y={56} w={120} h={34} label="위원회" sub="ML/TF Risk Mgmt" color={C.board} />
              <Arrow x1={240} y1={42} x2={240} y2={56} color={C.board} />

              {/* 3 Lines */}
              <ModuleBox x={20} y={110} w={130} h={42} label="1선: 현업" sub="영업·CS·온보딩" color={C.line1} />
              <ModuleBox x={175} y={110} w={130} h={42} label="2선: 준법감시" sub="CCO·AML팀·FDS" color={C.line2} />
              <ModuleBox x={330} y={110} w={130} h={42} label="3선: 내부감사" sub="감사팀·외부감사" color={C.line3} />

              {/* Arrows: 1->2->committee */}
              <Arrow x1={150} y1={131} x2={175} y2={131} color={C.line1} />
              <Arrow x1={240} y1={110} x2={240} y2={90} color={C.line2} />

              {/* 3->Board direct */}
              <path d="M 395 110 L 395 30 L 300 30" stroke={C.line3} strokeWidth={1} fill="none" markerEnd="url(#tl-arrow)" />
              <text x={405} y={70} fontSize={7.5} fill={C.line3}>직통 보고</text>

              {/* Labels */}
              <text x={85} y={170} textAnchor="middle" fontSize={8} fill={C.line1}>CDD 실행</text>
              <text x={85} y={182} textAnchor="middle" fontSize={8} fill={C.line1}>이상 징후 보고</text>
              <text x={240} y={170} textAnchor="middle" fontSize={8} fill={C.line2}>정책·모니터링</text>
              <text x={240} y={182} textAnchor="middle" fontSize={8} fill={C.line2}>STR 보고</text>
              <text x={395} y={170} textAnchor="middle" fontSize={8} fill={C.line3}>적정성 평가</text>
              <text x={395} y={182} textAnchor="middle" fontSize={8} fill={C.line3}>개선 권고</text>

              {/* Bottom summary */}
              <rect x={60} y={195} width={360} height={22} rx={4} fill={`${C.board}06`} stroke={C.board} strokeWidth={0.4} />
              <text x={240} y={210} textAnchor="middle" fontSize={8.5} fill={C.board}>
                "위험 관리자"와 "검증자"를 분리 → 내부 통제 독립성 확보
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={160} y={8} w={160} h={36} label="1선: 현업" sub="First Line — Business Operations" color={C.line1} />

              {/* 4 roles */}
              <ActionBox x={20} y={60} w={105} h={36} label="CDD 실행" sub="신원확인·검증" color={C.line1} />
              <ActionBox x={135} y={60} w={105} h={36} label="거래 1차 검토" sub="합리성 판단" color={C.line1} />
              <ActionBox x={250} y={60} w={105} h={36} label="이상 징후 보고" sub="2선에 내부 보고" color={C.line1} />
              <ActionBox x={365} y={60} w={95} h={36} label="교육 이수" sub="최신 유형 학습" color={C.line1} />

              {/* Key strength */}
              <rect x={30} y={115} width={200} height={40} rx={6} fill={`${C.line1}08`} stroke={C.line1} strokeWidth={0.5} />
              <text x={130} y={133} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.line1}>핵심 역량: 위험 감지 능력</text>
              <text x={130} y={147} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">시스템이 못 잡는 미묘한 징후 감지</text>

              {/* Conflict */}
              <rect x={250} y={115} width={200} height={40} rx={6} fill={`${C.board}08`} stroke={C.board} strokeWidth={0.5} strokeDasharray="3,3" />
              <text x={350} y={133} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.board}>한계: 이해 충돌</text>
              <text x={350} y={147} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">영업 실적 vs AML 통제 갈등</text>

              {/* Examples */}
              <rect x={40} y={170} width={400} height={35} rx={5} fill={`${C.line1}04`} stroke={C.line1} strokeWidth={0.3} />
              <text x={240} y={186} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                비협조적 태도 · 반복 소액 분할 · 설명과 다른 거래 패턴 → 현장 1선이 감지
              </text>
              <text x={240} y={199} textAnchor="middle" fontSize={7.5} fill={C.board}>
                고위험 거래 거절 = 매출 감소 → 1선 단독 판단 시 위험 과소평가 유인
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={160} y={8} w={160} h={36} label="2선: 준법감시" sub="Second Line — Compliance & Risk" color={C.line2} />

              {/* 5 roles */}
              <ActionBox x={10} y={58} w={85} h={34} label="정책 수립" sub="규정·절차서" color={C.line2} />
              <ActionBox x={105} y={58} w={85} h={34} label="모니터링" sub="FDS·스크리닝" color={C.line2} />
              <ActionBox x={200} y={58} w={80} h={34} label="조사" sub="심층 분석" color={C.line2} />
              <ActionBox x={290} y={58} w={85} h={34} label="STR 보고" sub="FIU 제출" color={C.line2} />
              <ActionBox x={385} y={58} w={80} h={34} label="교육" sub="1선 대상" color={C.line2} />

              {/* Key value */}
              <rect x={30} y={110} width={200} height={40} rx={6} fill={`${C.line2}08`} stroke={C.line2} strokeWidth={0.5} />
              <text x={130} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.line2}>핵심 가치: 독립적 시각</text>
              <text x={130} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">1선 CDD 품질 사후 검토(QA)</text>

              {/* Main task */}
              <rect x={250} y={110} width={200} height={40} rx={6} fill={`${C.line2}08`} stroke={C.line2} strokeWidth={0.5} />
              <text x={350} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.line2}>가장 빈번한 업무: FDS 알림</text>
              <text x={350} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">오탐(false positive) 판별 + 규칙 튜닝</text>

              {/* Flow: 1line -> 2line check */}
              <rect x={60} y={165} width={360} height={36} rx={5} fill={`${C.line1}06`} stroke={C.line1} strokeWidth={0.4} />
              <text x={115} y={180} fontSize={8} fill={C.line1}>1선이 CDD 수행</text>
              <Arrow x1={175} y1={180} x2={220} y2={180} color={C.line2} />
              <text x={260} y={180} fontSize={8} fill={C.line2}>2선이 품질 검증</text>
              <Arrow x1={310} y1={180} x2={340} y2={180} color={C.line2} />
              <text x={370} y={180} fontSize={8} fill={C.line2}>시정 조치</text>
              <text x={240} y={196} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                영업 실적 책임 없음 → 이해충돌 없는 판단
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={160} y={8} w={160} h={36} label="3선: 내부감사" sub="Third Line — Internal Audit" color={C.line3} />

              {/* 4 roles */}
              <ActionBox x={15} y={58} w={105} h={36} label="체계 적정성" sub="설계 검토" color={C.line3} />
              <ActionBox x={130} y={58} w={105} h={36} label="운영 효과성" sub="샘플 검사" color={C.line3} />
              <ActionBox x={245} y={58} w={105} h={36} label="개선 권고" sub="이행 추적" color={C.line3} />
              <ActionBox x={360} y={58} w={105} h={36} label="이사회 보고" sub="직접 보고" color={C.line3} />

              {/* Independence principle */}
              <rect x={30} y={110} width={200} height={46} rx={6} fill={`${C.line3}08`} stroke={C.line3} strokeWidth={0.5} />
              <text x={130} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.line3}>핵심 원칙: 독립성</text>
              <text x={130} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인사·예산 영향 배제</text>
              <text x={130} y={154} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이사회/감사위 직통 보고</text>

              {/* Why direct report */}
              <rect x={250} y={110} width={200} height={46} rx={6} fill={`${C.board}08`} stroke={C.board} strokeWidth={0.5} />
              <text x={350} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.board}>CCO/CEO 견제 가능</text>
              <text x={350} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">경영진 위법 행위도</text>
              <text x={350} y={154} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이사회에 직접 보고 가능</text>

              {/* Small VASP note */}
              <rect x={40} y={172} width={400} height={36} rx={5} fill={`${C.line3}06`} stroke={C.line3} strokeWidth={0.4} strokeDasharray="3,3" />
              <text x={240} y={187} textAnchor="middle" fontSize={8.5} fill={C.line3}>
                소규모 VASP: 1선+2선 겸직 허용, 3선(감사)만은 반드시 독립
              </text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                최소 연 1회 외부 감사 + 이사회 보고로 3선 기능 확보
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.board}>보고 체계 — 견제 구조</text>

              {/* Board at top */}
              <ModuleBox x={180} y={30} w={120} h={30} label="이사회" color={C.board} />

              {/* Committee */}
              <ModuleBox x={55} y={80} w={120} h={30} label="위원회" color={C.board} />

              {/* 3 Lines */}
              <ModuleBox x={20} y={145} w={100} h={30} label="1선: 현업" color={C.line1} />
              <ModuleBox x={140} y={145} w={100} h={30} label="2선: 준법감시" color={C.line2} />
              <ModuleBox x={310} y={80} w={100} h={30} label="3선: 감사" color={C.line3} />

              {/* 1L -> 2L */}
              <Arrow x1={120} y1={155} x2={140} y2={155} color={C.line1} />
              <text x={130} y={148} fontSize={7} fill={C.line1}>일상</text>

              {/* 2L -> Committee */}
              <Arrow x1={190} y1={145} x2={130} y2={110} color={C.line2} />
              <text x={148} y={130} fontSize={7} fill={C.line2}>분기</text>

              {/* Committee -> Board */}
              <Arrow x1={140} y1={80} x2={180} y2={60} color={C.board} />
              <text x={148} y={70} fontSize={7} fill={C.board}>분기</text>

              {/* 3L -> Board (direct, highlighted) */}
              <line x1={360} y1={80} x2={300} y2={60} stroke={C.line3} strokeWidth={1.5} markerEnd="url(#tl-arrow)" />
              <text x={345} y={65} fontSize={8} fontWeight={600} fill={C.line3}>직통</text>
              <text x={345} y={76} fontSize={7} fill={C.line3}>연1회+수시</text>

              {/* Explanation box */}
              <rect x={260} y={130} width={200} height={60} rx={6} fill={`${C.line3}08`} stroke={C.line3} strokeWidth={0.5} />
              <text x={360} y={148} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.line3}>3선 → 이사회 직통 보고</text>
              <text x={360} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CCO가 거래 은폐하더라도</text>
              <text x={360} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">내부감사가 발견 → 이사회 직접 보고</text>

              {/* Summary */}
              <rect x={40} y={198} width={400} height={20} rx={4} fill={`${C.board}06`} stroke={C.board} strokeWidth={0.4} />
              <text x={240} y={212} textAnchor="middle" fontSize={8.5} fill={C.board}>
                "위로 올라가되, 중간을 건너뛰지 않는" + 감사는 직통 = 이중 견제
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
