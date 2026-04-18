import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'FDS 파이프라인 — 4단계 흐름',
    body: '데이터 수집 → 패턴 분석 → 경보 발생 → 조치 실행. 자동 감지 + 사람의 판단이 결합된 구조.',
  },
  {
    label: '법적 근거 — 이중 의무',
    body: '가상자산이용자보호법 제12조(이상거래 상시 감시)와 특금법 제4조(의심거래보고 STR)의 교차점에 FDS가 위치한다.',
  },
  {
    label: 'FDS 세 가지 접근 방식',
    body: '규칙 기반(1차 필터) → 행위 기반(개인화 탐지) → AI 기반(복합 패턴). 실무에서는 세 가지를 병행한다.',
  },
  {
    label: '감시 조직 체계',
    body: '준법감시인(최종 결정) ← AML 담당자(1차 분석) ← FDS 경보. 보안팀과 운영팀이 기술 분석·조치 실행을 담당.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#fds-ov-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fds-ov-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 4-stage pipeline */}
              <ActionBox x={10} y={30} w={100} h={42} label="1. 데이터 수집" sub="호가·매매·입출금·IP" color={C.blue} />
              <Arrow x1={112} y1={51} x2={128} y2={51} color={C.blue} />
              <ActionBox x={130} y={30} w={100} h={42} label="2. 패턴 분석" sub="규칙+통계+ML" color={C.amber} />
              <Arrow x1={232} y1={51} x2={248} y2={51} color={C.amber} />
              <ActionBox x={250} y={30} w={100} h={42} label="3. 경보 발생" sub="높음/중간/낮음" color={C.red} />
              <Arrow x1={352} y1={51} x2={368} y2={51} color={C.red} />
              <ActionBox x={370} y={30} w={100} h={42} label="4. 조치 실행" sub="정지·확인·STR" color={C.green} />

              {/* auto + human */}
              <rect x={10} y={92} width={340} height={28} rx={6} fill={`${C.blue}10`} stroke={C.blue} strokeWidth={0.6} strokeDasharray="4 3" />
              <text x={180} y={110} textAnchor="middle" fontSize={9} fill={C.blue}>자동 처리 영역 (System)</text>

              <rect x={250} y={130} width={220} height={28} rx={6} fill={`${C.green}10`} stroke={C.green} strokeWidth={0.6} strokeDasharray="4 3" />
              <text x={360} y={148} textAnchor="middle" fontSize={9} fill={C.green}>사람의 판단 영역 (Human)</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">자동화만으로 오탐 제거 불가 / 사람만으로 초당 수천 건 감당 불가</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Two laws converging on FDS */}
              <ModuleBox x={30} y={20} w={160} h={44} label="이용자보호법 제12조" sub="이상거래 상시 감시 의무" color={C.blue} />
              <ModuleBox x={290} y={20} w={160} h={44} label="특금법 제4조" sub="의심거래보고(STR) 의무" color={C.amber} />

              <Arrow x1={110} y1={66} x2={200} y2={95} color={C.blue} />
              <Arrow x1={370} y1={66} x2={280} y2={95} color={C.amber} />

              <DataBox x={170} y={90} w={140} h={36} label="FDS" sub="두 법률의 교차점" color={C.red} />

              {/* consequences */}
              <Arrow x1={240} y1={128} x2={120} y2={155} color={C.red} />
              <Arrow x1={240} y1={128} x2={360} y2={155} color={C.red} />

              <AlertBox x={55} y={150} w={130} h={36} label="미이행 시 과태료" sub="중대 위반 → 사업 취소" color={C.red} />
              <StatusBox x={295} y={150} w={130} h={36} label="FIU 보고" sub="의심 건 → 금융정보분석원" color={C.amber} progress={0.7} />

              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">FIU 과태료의 77%가 가상자산사업자에 집중</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Three approaches side by side */}
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">FDS 세 가지 접근 방식</text>

              <ModuleBox x={15} y={35} w={140} h={50} label="규칙 기반" sub="Rule-based" color={C.blue} />
              <text x={85} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">설명 가능, 즉시 배포</text>
              <text x={85} y={117} textAnchor="middle" fontSize={8} fill={C.red}>새 수법 대응 불가</text>

              <ModuleBox x={170} y={35} w={140} h={50} label="행위 기반" sub="Behavior-based" color={C.amber} />
              <text x={240} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개인화 탐지, 미지 패턴</text>
              <text x={240} y={117} textAnchor="middle" fontSize={8} fill={C.red}>신규 고객 프로파일 부족</text>

              <ModuleBox x={325} y={35} w={140} h={50} label="AI 기반" sub="ML / DL" color={C.green} />
              <text x={395} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">복합 패턴, 자동 고도화</text>
              <text x={395} y={117} textAnchor="middle" fontSize={8} fill={C.red}>블랙박스 문제</text>

              {/* flow arrows */}
              <Arrow x1={85} y1={133} x2={240} y2={150} color={C.blue} />
              <Arrow x1={240} y1={133} x2={240} y2={150} color={C.amber} />
              <Arrow x1={395} y1={133} x2={240} y2={150} color={C.green} />

              <StatusBox x={170} y={152} w={140} h={40} label="병행 운영" sub="1차 필터 → 개인화 → 복합 보완" color={C.green} progress={1} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Org chart: FDS alert → AML → 준법감시인 */}
              <AlertBox x={15} y={15} w={90} h={36} label="FDS 경보" sub="자동 생성" color={C.red} />
              <Arrow x1={107} y1={33} x2={133} y2={33} color={C.red} />

              <ModuleBox x={135} y={10} w={100} h={44} label="AML 담당자" sub="1차 분석·오탐 필터" color={C.amber} />
              <Arrow x1={237} y1={33} x2={263} y2={33} color={C.amber} />

              <ModuleBox x={265} y={10} w={100} h={44} label="준법감시인" sub="최종 판단·STR 결정" color={C.blue} />
              <Arrow x1={367} y1={33} x2={393} y2={33} color={C.blue} />

              <ActionBox x={395} y={15} w={75} h={36} label="FIU 보고" sub="STR 전송" color={C.green} />

              {/* Support teams */}
              <Arrow x1={185} y1={56} x2={120} y2={90} color={C.amber} />
              <Arrow x1={315} y1={56} x2={370} y2={90} color={C.blue} />

              <ModuleBox x={55} y={90} w={120} h={44} label="보안팀" sub="온체인 분석·지갑 추적" color={C.red} />
              <ModuleBox x={310} y={90} w={120} h={44} label="운영팀" sub="계정 정지·본인확인" color={C.green} />

              {/* note */}
              <DataBox x={140} y={158} w={200} h={30} label="상시감시조직 구성·운영 의무" sub="금융위원회 가이드라인" color={C.blue} />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시스템(자동) + 조직(사람) = 완전한 감시 체계</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
