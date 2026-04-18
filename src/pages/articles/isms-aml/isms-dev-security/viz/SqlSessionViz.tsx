import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  primary: '#6366f1',
  action: '#f59e0b',
  safe: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: 'SQL Injection — Prepared Statement 방어',
    body: '공격: 입력값에 SQL 구문 삽입 → 쿼리 변형 → DB 직접 조작.\n방어: Prepared Statement로 구조와 데이터 분리 → DB가 값을 순수 데이터로만 처리.',
  },
  {
    label: '세션 관리 — HttpOnly + Secure + 재생성',
    body: 'HttpOnly: XSS로 쿠키 접근 차단. Secure: HTTPS에서만 전송.\n세션 고정 방지: 로그인 성공 시 기존 세션 폐기 → 새 세션 ID 발급(regeneration).',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#sql-sess-arr)" />;
}

export default function SqlSessionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sql-sess-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>SQL Injection vs Prepared Statement</text>

              {/* 취약한 쿼리 */}
              <rect x={5} y={26} width={230} height={70} rx={8} fill={`${C.danger}06`} stroke={C.danger} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={120} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>취약한 코드</text>
              <text x={120} y={56} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{"WHERE pw='' OR '1'='1'"}</text>
              <text x={120} y={70} textAnchor="middle" fontSize={7.5} fill={C.danger}>쿼리 구조 변형 → 모든 레코드 반환</text>
              <text x={120} y={86} textAnchor="middle" fontSize={7.5} fill={C.danger}>인증 우회, 데이터 유출</text>

              {/* Prepared Statement */}
              <rect x={245} y={26} width={230} height={70} rx={8} fill={`${C.safe}06`} stroke={C.safe} strokeWidth={0.5} />
              <text x={360} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>Prepared Statement</text>
              <text x={360} y={56} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{"WHERE id = ? (바인딩)"}</text>
              <text x={360} y={70} textAnchor="middle" fontSize={7.5} fill={C.safe}>구조와 데이터 분리</text>
              <text x={360} y={86} textAnchor="middle" fontSize={7.5} fill={C.safe}>DB가 값을 순수 데이터로 처리</text>

              <rect x={10} y={108} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 방어 흐름 */}
              <DataBox x={10} y={118} w={80} h={26} label="사용자 입력" color={C.danger} />
              <Arrow x1={90} y1={131} x2={108} y2={131} color={C.action} />
              <ActionBox x={110} y={116} w={90} h={30} label="파라미터 바인딩" sub="? 자리에 삽입" color={C.action} />
              <Arrow x1={200} y1={131} x2={218} y2={131} color={C.safe} />
              <ActionBox x={220} y={116} w={90} h={30} label="DB 엔진" sub="데이터로만 해석" color={C.safe} />
              <Arrow x1={310} y1={131} x2={328} y2={131} color={C.safe} />
              <StatusBox x={330} y={116} w={80} h={30} label="안전한 실행" sub="" color={C.safe} progress={1} />

              <rect x={60} y={160} width={360} height={38} rx={6} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={240} y={176} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.action}>ORM 주의사항</text>
              <text x={240} y={190} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">ORM은 자동 Prepared Statement. 단, raw query 직접 작성 시 매개변수 바인딩 확인 필수.</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.primary}>세션 관리: 3가지 보호 설정</text>

              {/* 3가지 설정 */}
              <ActionBox x={10} y={30} w={145} h={50} label="HttpOnly" sub="JS에서 document.cookie 접근 차단 → XSS로 세션 탈취 방지" color={C.safe} />
              <ActionBox x={168} y={30} w={145} h={50} label="Secure" sub="HTTPS에서만 쿠키 전송 → 네트워크 도청 탈취 방지" color={C.primary} />
              <ActionBox x={326} y={30} w={145} h={50} label="세션 재생성" sub="로그인 시 새 ID 발급 → 세션 고정 공격 방지" color={C.action} />

              <rect x={10} y={95} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 세션 고정 공격 흐름 */}
              <text x={240} y={114} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>세션 고정 공격 vs 방어</text>

              {/* 공격 */}
              <rect x={10} y={122} width={220} height={50} rx={6} fill={`${C.danger}06`} stroke={C.danger} strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={120} y={136} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>공격: 세션 고정</text>
              <text x={120} y={150} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">공격자가 미리 세션 ID 주입</text>
              <text x={120} y={162} textAnchor="middle" fontSize={7.5} fill={C.danger}>이용자 로그인 후 같은 ID로 접근</text>

              {/* 방어 */}
              <rect x={250} y={122} width={220} height={50} rx={6} fill={`${C.safe}06`} stroke={C.safe} strokeWidth={0.5} />
              <text x={360} y={136} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>방어: 세션 재생성</text>
              <text x={360} y={150} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">로그인 성공 → 기존 ID 폐기</text>
              <text x={360} y={162} textAnchor="middle" fontSize={7.5} fill={C.safe}>새 세션 ID 발급 → 공격자 ID 무효</text>

              {/* 타임아웃 */}
              <rect x={60} y={182} width={360} height={24} rx={4} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={240} y={198} textAnchor="middle" fontSize={7.5} fill={C.action}>세션 타임아웃: 금융 10~15분, 일반 30분~1시간. 미활동 시 자동 로그아웃.</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
