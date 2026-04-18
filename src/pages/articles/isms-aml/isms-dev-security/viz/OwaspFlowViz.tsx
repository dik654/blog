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
    label: 'OWASP Top 10 — 주요 취약점 계층',
    body: '접근 제어 취약점(IDOR), 인젝션(SQL/Command), 암호화 실패, 인증 취약점.\n이 목록을 개발 단계에서 체계적으로 점검하면 실제 공격의 80% 이상 사전 차단.',
  },
  {
    label: '시큐어코딩: 입력 검증 + 출력 인코딩',
    body: '"모든 입력은 신뢰하지 않는다." 화이트리스트(허용 목록)로 검증.\n출력 시 HTML 특수문자 이스케이프 → <script>를 텍스트로 렌더링하여 XSS 차단.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#owasp-fl-arr)" />;
}

export default function OwaspFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="owasp-fl-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>OWASP Top 10: 주요 공격 벡터</text>

              {/* 공격 유형 카드 */}
              <AlertBox x={10} y={28} w={110} h={50} label="접근 제어 취약점" sub="IDOR: ID 변경으로 타인 데이터 접근" color={C.danger} />
              <AlertBox x={130} y={28} w={100} h={50} label="인젝션" sub="SQL/Command 삽입 실행" color={C.danger} />
              <AlertBox x={240} y={28} w={110} h={50} label="암호화 실패" sub="평문 저장, 약한 알고리즘" color={C.action} />
              <AlertBox x={360} y={28} w={110} h={50} label="인증 취약점" sub="약한 PW, 세션 고정" color={C.action} />

              {/* 공격 → 시스템 → 피해 */}
              <rect x={10} y={92} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={10} y={102} w={80} h={26} label="공격자 입력" color={C.danger} />
              <Arrow x1={90} y1={115} x2={118} y2={115} color={C.danger} />

              <ActionBox x={120} y={100} w={100} h={30} label="취약한 서버" sub="검증 미비" color={C.danger} />
              <Arrow x1={220} y1={115} x2={248} y2={115} color={C.danger} />

              <AlertBox x={250} y={100} w={80} h={30} label="DB 탈취" sub="" color={C.danger} />
              <AlertBox x={340} y={100} w={80} h={30} label="인증 우회" sub="" color={C.danger} />
              <AlertBox x={430} y={100} w={45} h={30} label="RCE" sub="" color={C.danger} />

              {/* 방어 후 */}
              <rect x={40} y={145} width={400} height={48} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={162} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>개발 단계에서 OWASP 체크리스트 점검 시</text>
              <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">실제 공격의 80% 이상을 사전 차단 가능</text>
              <text x={240} y={190} textAnchor="middle" fontSize={7.5} fill={C.safe}>운영 중 발견 vs 개발 중 발견: 수정 비용 수십 배 차이</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>시큐어코딩: 입력 검증 + 출력 인코딩</text>

              {/* 입력 검증 흐름 */}
              <DataBox x={10} y={30} w={80} h={26} label="사용자 입력" color={C.danger} />
              <Arrow x1={90} y1={43} x2={108} y2={43} color={C.action} />

              <ActionBox x={110} y={28} w={100} h={30} label="화이트리스트 검증" sub="허용 형식만 통과" color={C.action} />

              {/* 분기 */}
              <Arrow x1={210} y1={36} x2={238} y2={30} color={C.safe} />
              <StatusBox x={240} y={18} w={80} h={26} label="통과" sub="" color={C.safe} progress={1} />

              <Arrow x1={210} y1={50} x2={238} y2={56} color={C.danger} />
              <AlertBox x={240} y={46} w={80} h={26} label="거부" sub="" color={C.danger} />

              {/* 블랙리스트 비교 */}
              <rect x={340} y={18} width={130} height={56} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={405} y={34} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>블랙리스트 (부적합)</text>
              <text x={405} y={48} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">알려진 악성 패턴만 차단</text>
              <text x={405} y={62} textAnchor="middle" fontSize={7.5} fill={C.danger}>우회 가능 → 근본 방어 X</text>

              {/* 출력 인코딩 */}
              <rect x={10} y={85} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>출력 인코딩: XSS 방지</text>

              <DataBox x={20} y={115} w={120} h={26} label={'<script>alert(1)'} color={C.danger} />
              <Arrow x1={140} y1={128} x2={168} y2={128} color={C.action} />
              <ActionBox x={170} y={113} w={80} h={30} label="이스케이프" sub="HTML 인코딩" color={C.action} />
              <Arrow x1={250} y1={128} x2={278} y2={128} color={C.safe} />
              <DataBox x={280} y={115} w={130} h={26} label={'&lt;script&gt;alert(1)'} color={C.safe} />

              <text x={240} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">브라우저가 태그가 아닌 텍스트로 해석 → 스크립트 실행 차단</text>

              <rect x={60} y={172} width={360} height={24} rx={4} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={240} y={188} textAnchor="middle" fontSize={7.5} fill={C.action}>React/Vue는 기본 인코딩 수행. dangerouslySetInnerHTML 사용 시 인코딩 무시 — 주의!</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
