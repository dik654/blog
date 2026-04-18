import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  active: '#3b82f6',
  separate: '#f59e0b',
  control: '#6366f1',
  deny: '#ef4444',
};

const STEPS = [
  { label: '분리보관 접근통제 5단계', body: '최소 인원(CPO+법무+DBA) → 접근 사유 기록 → CPO/CISO 사전 승인 → 접근 로그 자동 기록(2년+) → 정기 감사(분기/반기).' },
  { label: '회원탈퇴 시 5단계 처리', body: '탈퇴 접수(본인인증) → 즉시 파기(보존 의무 없는 항목, 5일 내) → 분리보관 이동(법정 보존 대상) → 활성 DB 삭제 → 보존기간 후 파기.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#acl-inline-arrow)" />;
}

export default function AccessControlInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="acl-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.control}>분리보관 DB 접근통제</text>

              <ActionBox x={15} y={30} w={80} h={40} label="최소 인원" sub="CPO+법무" color={C.control} />
              <Arrow x1={95} y1={50} x2={108} y2={50} color={C.control} />

              <ActionBox x={110} y={30} w={80} h={40} label="사유 기록" sub="수사/분쟁 등" color={C.control} />
              <Arrow x1={190} y1={50} x2={203} y2={50} color={C.control} />

              <ActionBox x={205} y={30} w={80} h={40} label="사전 승인" sub="CPO/CISO" color={C.separate} />
              <Arrow x1={285} y1={50} x2={298} y2={50} color={C.separate} />

              <ActionBox x={300} y={30} w={80} h={40} label="로그 기록" sub="자동 2년+" color={C.active} />
              <Arrow x1={380} y1={50} x2={393} y2={50} color={C.active} />

              <ActionBox x={395} y={30} w={75} h={40} label="정기 감사" sub="분기/반기" color={C.deny} />

              <motion.circle r={3} fill={C.control} opacity={0.4}
                initial={{ cx: 55 }} animate={{ cx: 432 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} cy={50} />

              {/* 기록 항목 */}
              <line x1={15} y1={88} x2={465} y2={88} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">접근 로그 필수 기재</text>

              <DataBox x={40} y={112} w={90} h={26} label="접근 일시" color={C.active} />
              <DataBox x={145} y={112} w={80} h={26} label="접근자" color={C.active} />
              <DataBox x={240} y={112} w={90} h={26} label="접근 항목" color={C.active} />
              <DataBox x={345} y={112} w={90} h={26} label="접근 사유" color={C.separate} />

              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                승인 없이 접근 불가 — 불필요 접근 발견 시 정기 감사에서 지적
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.active}>회원탈퇴 처리 5단계</text>

              {/* 세로 흐름 */}
              <ActionBox x={150} y={28} w={180} h={26} label="1. 탈퇴 접수 (본인인증)" sub="" color={C.active} />
              <Arrow x1={240} y1={54} x2={240} y2={62} color={C.active} />

              {/* 분기 */}
              <Arrow x1={200} y1={62} x2={90} y2={74} color={C.deny} />
              <Arrow x1={280} y1={62} x2={390} y2={74} color={C.separate} />

              <text x={130} y={72} fontSize={8} fill={C.deny}>보존 의무 없음</text>
              <text x={350} y={72} fontSize={8} fill={C.separate}>법정 보존 대상</text>

              <AlertBox x={20} y={78} w={160} h={28} label="2. 즉시 파기 (5일 내)" sub="" color={C.deny} />
              <text x={100} y={118} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">프로필·닉네임·알림 설정</text>

              <StatusBox x={290} y={78} w={180} h={28} label="3. 분리보관 DB 이동" sub="" color={C.separate} />
              <Arrow x1={380} y1={106} x2={380} y2={118} color={C.separate} />

              <ActionBox x={290} y={120} w={180} h={26} label="4. 활성 DB 레코드 삭제" sub="" color={C.active} />
              <Arrow x1={380} y1={146} x2={380} y2={155} color={C.deny} />

              <DataBox x={310} y={157} w={140} h={24} label="5. 보존기간 후 파기" color={C.deny} />

              <motion.circle r={3} fill={C.separate} opacity={0.4}
                initial={{ cx: 240, cy: 54 }} animate={{ cx: 380, cy: 169 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
