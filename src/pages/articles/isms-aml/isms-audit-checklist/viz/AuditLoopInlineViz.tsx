import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  doc: '#6366f1',
  interview: '#10b981',
  system: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '문서 확인', body: '정책서·지침서·절차서가 존재하는지 확인. "접근통제 정책이 있나요?" → 정책 문서 제시.' },
  { label: '담당자 인터뷰', body: '정책이 실무에 반영되는지 질문. 답변이 문서와 다르면 "문서-실행 괴리" 결함.' },
  { label: '시스템 실사', body: '실제 설정 화면을 열어 확인. 심사원이 직접 명령어를 요청하기도 한다.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ali-arrow)" />;
}

export default function AuditLoopInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ali-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">1단계: 문서 확인</text>

              <ModuleBox x={30} y={30} w={120} h={44} label="심사원 요청" sub="접근통제 정책 있나요?" color={C.doc} />
              <Arrow x1={150} y1={52} x2={180} y2={52} color={C.doc} />
              <ActionBox x={182} y={30} w={120} h={44} label="담당자 제시" sub="정책서 문서 꺼냄" color={C.doc} />
              <Arrow x1={302} y1={52} x2={332} y2={52} color={C.doc} />
              <ModuleBox x={334} y={30} w={120} h={44} label="존재 여부 판정" sub="문서 있음 → 1차 통과" color={C.interview} />

              <AlertBox x={80} y={105} w={320} h={40} label="문서가 없거나 형식만 갖춘 경우" sub="정책 문서 부재 → 즉시 결함. 날짜가 2년 전이면 '미갱신' 지적" color={C.fail} />

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정책서, 지침서, 절차서 세 종류 모두 존재해야 완전한 체계</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">2단계: 담당자 인터뷰</text>

              <ModuleBox x={30} y={30} w={130} h={44} label="심사원 질문" sub="변경 주기를 알고 있나요?" color={C.interview} />
              <Arrow x1={160} y1={52} x2={185} y2={42} color={C.interview} />
              <Arrow x1={160} y1={52} x2={185} y2={68} color={C.fail} />

              <ActionBox x={188} y={26} w={140} h={36} label="답변 = 문서와 일치" sub="90일마다 변경합니다" color={C.interview} />
              <AlertBox x={188} y={68} w={140} h={36} label="답변 ≠ 문서 내용" sub="글쎄요... 반기 정도?" color={C.fail} />

              <Arrow x1={328} y1={44} x2={358} y2={50} color={C.interview} />
              <Arrow x1={328} y1={86} x2={358} y2={75} color={C.fail} />

              <ModuleBox x={360} y={35} w={100} h={44} label="교차 검증" sub="문서 vs 답변 대조" color={C.doc} />

              <AlertBox x={80} y={115} w={320} h={40} label="구두 설명만으로는 적합 판정 불가" sub="'하고 있습니다' → 증적이 없으면 미이행으로 기록" color={C.fail} />

              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">담당자 답변과 문서 내용이 일치해야 통과</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">3단계: 시스템 실사</text>

              <ModuleBox x={20} y={30} w={130} h={44} label="심사원 요청" sub="설정 화면 보여주세요" color={C.system} />
              <Arrow x1={150} y1={52} x2={178} y2={52} color={C.system} />
              <ActionBox x={180} y={30} w={130} h={44} label="담당자 시연" sub="콘솔 접속 → 설정 조회" color={C.system} />
              <Arrow x1={310} y1={52} x2={338} y2={52} color={C.system} />
              <ModuleBox x={340} y={30} w={120} h={44} label="설정값 확인" sub="실제 값 vs 정책 비교" color={C.doc} />

              {/* 교차 검증 루프 */}
              <motion.path
                d="M 400 74 Q 400 105 240 110 Q 80 115 80 74"
                fill="none" stroke={C.fail} strokeWidth={1} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
              />
              <text x={240} y={106} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.fail}>세 단계 결과가 모두 일치해야 적합</text>

              <AlertBox x={80} y={130} w={320} h={38} label="문서·답변·설정값 불일치 = 결함" sub="정책: 90일 / 답변: 90일 / 실제 PASS_MAX_DAYS: 99999 → 미이행" color={C.fail} />

              <text x={240} y={192} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">심사원이 직접 cat /etc/ssh/sshd_config 등 명령어를 요청하기도 한다</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
