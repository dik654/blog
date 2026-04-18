import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '보완조치 4단계 프로세스',
    body: '결함 정리(대장 작성) → 보완 내역서(현재→조치→결과) → 증적 첨부(스크린샷, 보고서) → 완료 공문 제출. 40일 이내 완료 필수.',
  },
  {
    label: '보완 내역서 작성 원칙',
    body: '"현재 상태 → 조치 내용 → 조치 후 상태"를 구체적 서술. "보안을 강화했음" 같은 추상적 서술 금지. 무엇을, 어떻게, 어디에 적용했는지 명시.',
  },
  {
    label: '기간 연장과 최종 판정',
    body: '40일 내 완료 불가 시 연장 사유서 + 진행 현황 + 완료 계획서 제출. 연장은 1회, 최대 40일. 연장까지 미완료 시 인증 불가 판정.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#rp-arrow)" />;
}

export default function RemediationProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rp-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Source: defects */}
              <AlertBox x={170} y={5} w={140} h={28} label="결함 도출" sub="중결함 + 경결함" color={C.red} />

              <Arrow x1={240} y1={33} x2={240} y2={48} />

              {/* 4-step process */}
              <ActionBox x={10} y={50} w={100} h={40} label="1. 결함 정리" sub="대장 + 우선순위" color={C.blue} />
              <Arrow x1={110} y1={70} x2={128} y2={70} />

              <ActionBox x={130} y={50} w={100} h={40} label="2. 내역서 작성" sub="현재→조치→결과" color={C.blue} />
              <Arrow x1={230} y1={70} x2={248} y2={70} />

              <ActionBox x={250} y={50} w={100} h={40} label="3. 증적 첨부" sub="스크린샷/보고서" color={C.green} />
              <Arrow x1={350} y1={70} x2={368} y2={70} />

              <ActionBox x={370} y={50} w={100} h={40} label="4. 공문 제출" sub="일괄 제출" color={C.green} />

              {/* Timeline bar */}
              <rect x={40} y={105} width={400} height={4} rx={2} fill="var(--border)" opacity={0.3} />
              <motion.rect x={40} y={105} width={400} height={4} rx={2} fill={C.amber}
                initial={{ width: 0 }} animate={{ width: 400 }} transition={{ duration: 1 }} />
              <text x={240} y={122} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>40일 이내 완료</text>

              {/* Priority */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <text x={240} y={142} textAnchor="middle" fontSize={9} fill="var(--foreground)">결함 처리 우선순위</text>
                <rect x={80} y={150} width={140} height={20} rx={4} fill={`${C.red}12`} stroke={C.red} strokeWidth={0.8} />
                <text x={150} y={164} textAnchor="middle" fontSize={9} fill={C.red}>중결함 먼저</text>
                <Arrow x1={220} y1={160} x2={248} y2={160} />
                <rect x={250} y={150} width={140} height={20} rx={4} fill={`${C.amber}12`} stroke={C.amber} strokeWidth={0.8} />
                <text x={320} y={164} textAnchor="middle" fontSize={9} fill={C.amber}>경결함 후순위</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">보완 내역서 작성 패턴</text>

              {/* Example: 2.5.3 */}
              <DataBox x={150} y={28} w={180} h={24} label="결함 2.5.3: 비밀번호 정책" color={C.red} />

              {/* 3-column flow */}
              <Arrow x1={240} y1={52} x2={100} y2={72} />
              <Arrow x1={240} y1={52} x2={240} y2={72} />
              <Arrow x1={240} y1={52} x2={380} y2={72} />

              <rect x={20} y={75} width={150} height={45} rx={6} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={95} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>현재 상태</text>
              <text x={95} y={107} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">변경 주기 미설정</text>
              <text x={95} y={117} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">시스템 강제 없음</text>

              <Arrow x1={170} y1={97} x2={183} y2={97} />

              <rect x={185} y={75} width={150} height={45} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
              <text x={260} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>조치 내용</text>
              <text x={260} y={107} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">AD GPO에서 90일</text>
              <text x={260} y={117} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">주기 강제 설정</text>

              <Arrow x1={335} y1={97} x2={348} y2={97} />

              <rect x={350} y={75} width={120} height={45} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={410} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>결과 확인</text>
              <text x={410} y={107} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">설정 스크린샷</text>
              <text x={410} y={117} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">증적 첨부</text>

              {/* Anti-pattern */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <AlertBox x={40} y={138} w={180} h={28} label="금지: '보안을 강화했음'" sub="추상적 서술 → 재보완 요청" color={C.red} />

                <rect x={260} y={138} width={180} height={28} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
                <text x={350} y={151} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>필수: 무엇을 + 어떻게 + 어디에</text>
                <text x={350} y={163} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">구체적 서술만 인정</text>
              </motion.g>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">심사 소견과 다른 방향으로 보완 → 재보완 요청</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">기간 연장 프로세스</text>

              {/* Timeline */}
              <rect x={40} y={35} width={400} height={6} rx={3} fill="var(--border)" opacity={0.2} />

              {/* Original 40 days */}
              <motion.rect x={40} y={35} width={200} height={6} rx={3} fill={C.amber}
                initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 0.5 }} />

              {/* Extension 40 days */}
              <motion.rect x={240} y={35} width={200} height={6} rx={0} fill={C.red} opacity={0.6}
                initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 0.5, delay: 0.3 }} />

              <text x={140} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.amber}>기본 40일</text>
              <text x={340} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>연장 40일 (최대)</text>
              <circle cx={240} cy={38} r={4} fill={C.red} />
              <text x={240} y={30} textAnchor="middle" fontSize={8} fill={C.red}>연장 신청</text>

              {/* Required documents */}
              <Arrow x1={240} y1={58} x2={240} y2={72} />

              <motion.g initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <ActionBox x={30} y={75} w={130} h={36} label="연장 사유서" sub="구체적 사유 기술" color={C.amber} />
                <ActionBox x={175} y={75} w={130} h={36} label="진행 현황 요약서" sub="완료/미완료 진행률" color={C.amber} />
                <ActionBox x={320} y={75} w={130} h={36} label="완료 계획서" sub="항목별 예상 완료일" color={C.amber} />
              </motion.g>

              {/* Outcomes */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <Arrow x1={140} y1={115} x2={140} y2={135} />
                <Arrow x1={340} y1={115} x2={340} y2={135} />

                <rect x={50} y={138} width={180} height={35} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
                <text x={140} y={155} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>연장 내 완료</text>
                <text x={140} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인증 부여</text>

                <rect x={260} y={138} width={180} height={35} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={1} />
                <text x={350} y={155} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>연장까지 미완료</text>
                <text x={350} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인증 불가 판정</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
