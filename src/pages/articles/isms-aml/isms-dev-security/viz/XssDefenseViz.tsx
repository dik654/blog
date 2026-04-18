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
    label: 'XSS 공격 흐름과 3계층 방어',
    body: '공격자가 악성 스크립트를 삽입 → 다른 이용자 브라우저에서 실행 → 세션 쿠키 탈취.\n방어: (1) 이스케이프 (2) CSP 헤더 (3) HttpOnly 쿠키 — 3계층 동시 적용.',
  },
  {
    label: 'CSRF 방어 — 토큰 + SameSite 쿠키',
    body: '인증된 상태에서 공격자 페이지 방문 → 이용자 권한으로 의도하지 않은 요청 전송.\n방어: CSRF 토큰(서버 발급 랜덤값) + SameSite=Strict/Lax 쿠키 설정.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#xss-def-arr)" />;
}

export default function XssDefenseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="xss-def-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>XSS 공격 흐름</text>

              {/* 공격 흐름 */}
              <AlertBox x={10} y={28} w={80} h={32} label="공격자" sub="스크립트 삽입" color={C.danger} />
              <Arrow x1={90} y1={44} x2={108} y2={44} color={C.danger} />
              <ActionBox x={110} y={26} w={80} h={36} label="DB 저장" sub="Stored XSS" color={C.danger} />
              <Arrow x1={190} y1={44} x2={208} y2={44} color={C.danger} />
              <DataBox x={210} y={30} w={80} h={28} label="피해자 접속" color={C.primary} />
              <Arrow x1={290} y1={44} x2={308} y2={44} color={C.danger} />
              <AlertBox x={310} y={26} w={80} h={36} label="스크립트 실행" sub="브라우저에서" color={C.danger} />
              <Arrow x1={390} y1={44} x2={408} y2={44} color={C.danger} />
              <AlertBox x={410} y={28} w={65} h={32} label="쿠키 탈취" sub="" color={C.danger} />

              {/* 3계층 방어 */}
              <rect x={10} y={75} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>3계층 방어</text>

              <ActionBox x={10} y={100} w={140} h={40} label="1. 이스케이프" sub={'<script> → &lt;script&gt;'} color={C.safe} />
              <ActionBox x={165} y={100} w={150} h={40} label="2. CSP 헤더" sub={"script-src 'self' → 인라인 차단"} color={C.action} />
              <ActionBox x={330} y={100} w={140} h={40} label="3. HttpOnly 쿠키" sub="JS에서 쿠키 접근 차단" color={C.primary} />

              <rect x={40} y={155} width={400} height={44} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={170} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>다중 방어의 효과</text>
              <text x={240} y={184} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">이스케이프를 우회해도 CSP가 차단, CSP를 우회해도 HttpOnly가 쿠키 보호</text>
              <text x={240} y={196} textAnchor="middle" fontSize={7.5} fill={C.safe}>세 계층을 모두 돌파해야 공격 성공 → 난이도 기하급수적 증가</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.action}>CSRF 공격과 토큰 방어</text>

              {/* 공격 시나리오 */}
              <rect x={5} y={28} width={225} height={70} rx={8} fill={`${C.danger}06`} stroke={C.danger} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={118} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>CSRF 공격 흐름</text>

              <DataBox x={15} y={50} w={75} h={22} label="이용자" color={C.primary} />
              <Arrow x1={90} y1={61} x2={100} y2={61} color={C.danger} />
              <text x={118} y={58} fontSize={7.5} fill={C.danger}>인증 상태</text>
              <DataBox x={100} y={68} w={75} h={22} label="악성 사이트" color={C.danger} />
              <Arrow x1={175} y1={79} x2={192} y2={68} color={C.danger} />
              <AlertBox x={140} y={50} w={80} h={18} label="위조 요청" sub="" color={C.danger} />

              {/* 방어 */}
              <rect x={245} y={28} width={230} height={70} rx={8} fill={`${C.safe}06`} stroke={C.safe} strokeWidth={0.5} />
              <text x={360} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>CSRF 토큰 방어</text>

              <ActionBox x={255} y={50} w={95} h={22} label="서버: 토큰 발급" sub="" color={C.safe} />
              <Arrow x1={350} y1={61} x2={363} y2={61} color={C.safe} />
              <ActionBox x={365} y={50} w={100} h={22} label="폼 제출 시 검증" sub="" color={C.safe} />
              <text x={360} y={86} textAnchor="middle" fontSize={7.5} fill={C.safe}>공격자는 토큰 값을 알 수 없어 유효한 요청 생성 불가</text>

              <rect x={10} y={110} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* SameSite 쿠키 */}
              <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>SameSite 쿠키 속성</text>

              <rect x={20} y={136} width={135} height={42} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={87} y={152} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>Strict</text>
              <text x={87} y={166} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">교차 도메인 쿠키 완전 차단</text>

              <rect x={170} y={136} width={135} height={42} rx={6} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={237} y={152} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.action}>Lax</text>
              <text x={237} y={166} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">안전한 GET만 허용</text>

              <rect x={320} y={136} width={150} height={42} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={395} y={152} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>None (위험)</text>
              <text x={395} y={166} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">모든 교차 요청에 쿠키 포함</text>

              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">POST/PUT/DELETE는 반드시 CSRF 검증. GET은 조회 전용(부작용 없도록 설계).</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
