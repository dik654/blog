import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  active: '#3b82f6',
  warn: '#f59e0b',
  dormant: '#ef4444',
  restore: '#10b981',
};

const STEPS = [
  { label: '휴면계정 전환 흐름', body: '마지막 접속 → 11개월(30일 전 안내) → 1년(휴면 전환, 분리보관) → 재로그인 시 본인인증 후 복원. 정보통신망법 제29조 제2항.' },
  { label: 'VASP 특이점: 자산 잔액 충돌', body: '휴면 이용자 지갑에 가상자산이 남아 있으면 자산 보관 의무와 개인정보 파기 의무가 충돌. 분리보관 + 자산 인출 안내(이메일/문자)를 병행.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#da-inline-arrow)" />;
}

export default function DormantAccountInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="da-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.dormant}>휴면계정 전환 흐름 (정보통신망법 제29조 제2항)</text>

              {/* 타임라인 */}
              <line x1={30} y1={48} x2={450} y2={48} stroke="var(--border)" strokeWidth={1.5} />

              <circle cx={60} cy={48} r={5} fill={C.active} />
              <text x={60} y={38} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.active}>마지막 접속</text>

              <circle cx={190} cy={48} r={5} fill={C.warn} />
              <text x={190} y={38} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>11개월</text>

              <circle cx={310} cy={48} r={5} fill={C.dormant} />
              <text x={310} y={38} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dormant}>1년</text>

              <circle cx={430} cy={48} r={5} fill={C.dormant} />
              <text x={430} y={38} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dormant}>4년</text>

              <motion.circle r={3} fill={C.active} opacity={0.5}
                initial={{ cx: 60 }} animate={{ cx: 430 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} cy={48} />

              {/* 단계별 설명 */}
              <ActionBox x={15} y={62} w={100} h={30} label="정상 이용" sub="" color={C.active} />
              <ActionBox x={140} y={62} w={110} h={30} label="30일 전 안내" sub="" color={C.warn} />
              <ActionBox x={260} y={62} w={110} h={30} label="분리보관 이동" sub="" color={C.dormant} />
              <ActionBox x={390} y={62} w={70} h={30} label="최종 파기" sub="" color={C.dormant} />

              {/* 재활성화 */}
              <Arrow x1={315} y1={92} x2={315} y2={110} color={C.restore} />
              <StatusBox x={220} y={112} w={190} h={34} label="재로그인 → 본인인증 → 복원" sub="활성 DB로 다시 이동" color={C.restore} />

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                사전 안내 없이 휴면 전환 시 법 위반 — 30일 전 이메일·문자 필수
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>VASP 휴면계정 특이점: 자산 잔액 충돌</text>

              {/* 두 의무 충돌 */}
              <ModuleBox x={30} y={32} w={180} h={45} label="개인정보 파기 의무" sub="보존기간 후 삭제" color={C.dormant} />

              <text x={240} y={55} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.warn}>vs</text>

              <ModuleBox x={270} y={32} w={180} h={45} label="자산 보관 의무" sub="지갑 잔액 반환" color={C.active} />

              <Arrow x1={240} y1={77} x2={240} y2={95} color={C.warn} />

              {/* 해법 */}
              <StatusBox x={80} y={97} w={320} h={38} label="해법: 분리보관 + 자산 인출 안내 병행" sub="최소 식별정보(지갑주소, 이름) 유지하며 인출 기회 제공" color={C.restore} />

              <line x1={15} y1={150} x2={465} y2={150} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                이메일·문자로 "지갑에 자산이 남아 있습니다" 안내 발송
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                인출 완료 후 정상적 파기 절차 진행
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
