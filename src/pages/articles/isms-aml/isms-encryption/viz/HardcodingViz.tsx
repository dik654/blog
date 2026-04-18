import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  danger: '#ef4444',
  safe: '#10b981',
  warn: '#f59e0b',
  action: '#6366f1',
};

const STEPS = [
  {
    label: '위험 체인 — 소스코드 키 → Git 이력 영구 잔존 → 자동 수집',
    body: '키를 코드에 작성하는 순간 Git 커밋 이력에 영구 잔존. 커밋 삭제해도 reflog·백업에 흔적. 오픈소스 저장소는 수 분 내 봇이 수집하여 악용.',
  },
  {
    label: '방어선 — git-secrets → pre-commit hook → 커밋 차단',
    body: 'git-secrets가 pre-commit hook으로 커밋 전 키 패턴을 감지하여 차단. 이미 유출 시: 즉시 폐기(revoke) → 새 키 발급. 비공개 저장소도 내부 전원 접근 가능하므로 최소권한 위배.',
  },
];

function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#hc-arrow)"
      strokeDasharray={dashed ? '3 2' : undefined} />
  );
}

export default function HardcodingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="hc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 위험 체인 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>유출 체인 — 한 번 커밋되면 되돌릴 수 없다</text>

              {/* 소스코드에 키 작성 */}
              <ModuleBox x={10} y={24} w={95} h={48} label="소스코드" sub="API_KEY=sk-..." color={C.danger} />
              <Arrow x1={105} y1={48} x2={125} y2={48} color={C.danger} />

              {/* Git 커밋 */}
              <ActionBox x={127} y={26} w={80} h={44} label="Git 커밋" sub="push to remote" color={C.danger} />
              <Arrow x1={207} y1={48} x2={227} y2={48} color={C.danger} />

              {/* 이력 영구 잔존 */}
              <AlertBox x={229} y={22} w={108} h={52} label="이력에 영구 잔존" sub="삭제해도 reflog 잔존" color={C.danger} />
              <Arrow x1={337} y1={48} x2={357} y2={48} color={C.danger} />

              {/* 자동 스캐너 */}
              <AlertBox x={359} y={22} w={110} h={52} label="자동 스캐너" sub="수 분 내 봇이 수집" color={C.danger} />

              {/* 흐르는 키 표시 */}
              <motion.circle r={4} fill={C.danger} opacity={0.6}
                initial={{ cx: 105, cy: 48 }}
                animate={{ cx: 357, cy: 48 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />

              {/* 경고 박스 — reflog 잔존 */}
              <line x1={15} y1={90} x2={465} y2={90} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={100} y={100} w={280} h={42} label="커밋 삭제해도 reflog + 백업에 흔적이 남아 사실상 영구 유출" color={C.danger} />

              {/* 비공개 저장소 경고 */}
              <rect x={60} y={158} width={360} height={32} rx={6} fill="var(--card)" stroke={C.warn} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>비공개 저장소도 내부 직원 전원 접근 가능 — 최소 권한 원칙 위배</text>
            </motion.g>
          )}

          {/* ── Step 1: 방어선 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>1차 방어선 — 커밋 전 차단</text>

              {/* git-secrets */}
              <ModuleBox x={30} y={28} w={110} h={50} label="git-secrets" sub="키 패턴 감지" color={C.safe} />
              <Arrow x1={140} y1={53} x2={168} y2={53} color={C.safe} />

              {/* pre-commit hook */}
              <ActionBox x={170} y={30} w={120} h={46} label="pre-commit hook" sub="커밋 전 실행" color={C.safe} />
              <Arrow x1={290} y1={53} x2={318} y2={53} color={C.safe} />

              {/* 커밋 차단 */}
              <StatusBox x={320} y={28} w={130} h={50} label="커밋 차단 성공" sub="유출 사전 방지" color={C.safe} progress={1} />

              {/* 구분선 */}
              <line x1={15} y1={98} x2={465} y2={98} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>이미 유출된 경우 — 즉시 대응</text>

              {/* 유출 감지 */}
              <AlertBox x={20} y={130} w={100} h={42} label="유출 감지" sub="키 노출 확인" color={C.danger} />
              <Arrow x1={120} y1={151} x2={148} y2={151} color={C.danger} />

              {/* 즉시 폐기 */}
              <ActionBox x={150} y={132} w={90} h={38} label="즉시 revoke" sub="기존 키 폐기" color={C.danger} />
              <Arrow x1={240} y1={151} x2={268} y2={151} color={C.action} />

              {/* 새 키 발급 */}
              <ActionBox x={270} y={132} w={90} h={38} label="새 키 발급" sub="교체 적용" color={C.action} />
              <Arrow x1={360} y1={151} x2={378} y2={151} color={C.safe} />

              {/* 복구 완료 */}
              <StatusBox x={380} y={126} w={90} h={50} label="복구 완료" sub="서비스 정상화" color={C.safe} progress={1} />

              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">폐기하지 않으면 과거 커밋에서 추출하여 악용 가능</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
