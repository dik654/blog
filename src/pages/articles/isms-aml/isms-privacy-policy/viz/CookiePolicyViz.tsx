import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  essential: '#10b981',
  optional: '#6366f1',
  security: '#f59e0b',
  danger: '#ef4444',
};

const STEPS = [
  { label: '쿠키의 4가지 유형', body: '필수(세션ID) — 동의 불필요. 분석(GA)·기능(다크모드)·광고(Pixel) — 사전 동의 필요. 유형별 분류가 정책의 출발점.' },
  { label: '쿠키 배너: 동의 UI', body: '정보통신망법 제22조의2 — 브라우저 저장 정보 접근 시 동의 필수. 수락·거부 동등 배치, 유형별 토글 제공.' },
  { label: '쿠키 보안 속성 3종', body: 'HttpOnly(XSS 방어), Secure(HTTPS 전용), SameSite(CSRF 방어) — VASP는 금융 특성상 3종 모두 적용 권장.' },
  { label: '쿠키 외 추적 기술', body: '웹 비콘, localStorage, 핑거프린팅, SDK 추적 — 쿠키와 동일한 동의 의무 적용. 처리방침에 사용 여부 기재 필수.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cp-arrow)" />;
}

export default function CookiePolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cp-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 쿠키 4유형 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">쿠키 유형 분류</text>

              {/* 서버 → 브라우저 */}
              <ModuleBox x={10} y={28} w={100} h={38} label="웹 서버" sub="Set-Cookie" color={C.optional} />
              <Arrow x1={110} y1={47} x2={145} y2={47} color={C.optional} />
              <ModuleBox x={148} y={28} w={100} h={38} label="브라우저" sub="로컬 저장" color={C.optional} />

              {/* 4유형 */}
              <Arrow x1={198} y1={66} x2={198} y2={80} color={C.essential} />

              {/* 필수 쿠키 - 동의 불필요 */}
              <DataBox x={10} y={85} w={105} h={40} label="필수 쿠키" color={C.essential} />
              <text x={62} y={140} textAnchor="middle" fontSize={7} fill={C.essential}>세션ID, CSRF 토큰</text>
              <text x={62} y={152} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.essential}>동의 불필요</text>

              {/* 분석 쿠키 */}
              <DataBox x={130} y={85} w={105} h={40} label="분석 쿠키" color={C.optional} />
              <text x={182} y={140} textAnchor="middle" fontSize={7} fill={C.optional}>Google Analytics</text>
              <text x={182} y={152} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.danger}>동의 필요</text>

              {/* 기능 쿠키 */}
              <DataBox x={250} y={85} w={105} h={40} label="기능 쿠키" color={C.optional} />
              <text x={302} y={140} textAnchor="middle" fontSize={7} fill={C.optional}>언어·다크모드</text>
              <text x={302} y={152} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.danger}>동의 필요</text>

              {/* 광고 쿠키 */}
              <DataBox x={370} y={85} w={100} h={40} label="광고 쿠키" color={C.danger} />
              <text x={420} y={140} textAnchor="middle" fontSize={7} fill={C.danger}>Facebook Pixel</text>
              <text x={420} y={152} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.danger}>동의 필요</text>

              {/* 구분선 */}
              <line x1={120} y1={85} x2={120} y2={160} stroke={C.essential} strokeWidth={1} strokeDasharray="3 2" />
              <text x={62} y={175} textAnchor="middle" fontSize={7} fill={C.essential}>서비스 불가결</text>
              <text x={300} y={175} textAnchor="middle" fontSize={7} fill={C.danger}>정보통신망법 제22조의2 적용</text>
            </motion.g>
          )}

          {/* Step 1: 쿠키 배너 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.optional}>쿠키 배너 — 동의 수집 UI</text>

              {/* 배너 모양 */}
              <rect x={40} y={28} width={400} height={100} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
              <text x={240} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">이 웹사이트는 쿠키를 사용합니다</text>

              {/* 토글 항목들 */}
              <rect x={70} y={56} width={12} height={12} rx={3} fill={C.essential} />
              <text x={90} y={66} fontSize={8} fill="var(--muted-foreground)">필수 (항상 활성)</text>

              <rect x={200} y={56} width={12} height={12} rx={3} fill="var(--border)" stroke="var(--border)" strokeWidth={1} />
              <text x={220} y={66} fontSize={8} fill="var(--muted-foreground)">분석</text>

              <rect x={280} y={56} width={12} height={12} rx={3} fill="var(--border)" stroke="var(--border)" strokeWidth={1} />
              <text x={300} y={66} fontSize={8} fill="var(--muted-foreground)">기능</text>

              <rect x={360} y={56} width={12} height={12} rx={3} fill="var(--border)" stroke="var(--border)" strokeWidth={1} />
              <text x={380} y={66} fontSize={8} fill="var(--muted-foreground)">광고</text>

              {/* 버튼 — 동등 크기 */}
              <rect x={110} y={82} width={110} height={28} rx={4} fill={C.optional} />
              <text x={165} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ffffff">모두 수락</text>

              <rect x={260} y={82} width={110} height={28} rx={4} fill="var(--border)" />
              <text x={315} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">모두 거부</text>

              {/* 하단 주의 */}
              <rect x={40} y={140} width={400} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={50} y={150} w={180} h={30} label="수락·거부 동등 배치" sub="크기·위치 균등해야 유효" color={C.optional} />
              <AlertBox x={260} y={150} w={180} h={30} label="거부 숨기기 = 무효" sub="GDPR은 더 엄격" color={C.danger} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                글로벌 VASP: GDPR 기준도 함께 충족해야 함
              </text>
            </motion.g>
          )}

          {/* Step 2: 보안 속성 3종 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.security}>쿠키 보안 속성 — 세션 탈취 방어</text>

              {/* 세션 쿠키 */}
              <ModuleBox x={160} y={28} w={160} h={36} label="세션 쿠키 (인증 토큰)" sub="탈취 시 세션 하이재킹" color={C.danger} />

              <Arrow x1={190} y1={64} x2={100} y2={82} color={C.security} />
              <Arrow x1={240} y1={64} x2={240} y2={82} color={C.security} />
              <Arrow x1={290} y1={64} x2={380} y2={82} color={C.security} />

              {/* 3가지 속성 */}
              <ActionBox x={15} y={85} w={140} h={48} label="HttpOnly" sub="JS에서 쿠키 접근 차단" color={C.security} />
              <ActionBox x={170} y={85} w={140} h={48} label="Secure" sub="HTTPS에서만 전송" color={C.security} />
              <ActionBox x={325} y={85} w={140} h={48} label="SameSite" sub="교차 사이트 전송 제어" color={C.security} />

              {/* 방어 대상 */}
              <Arrow x1={85} y1={133} x2={85} y2={148} color={C.danger} />
              <Arrow x1={240} y1={133} x2={240} y2={148} color={C.danger} />
              <Arrow x1={395} y1={133} x2={395} y2={148} color={C.danger} />

              <AlertBox x={20} y={150} w={130} h={30} label="XSS 공격 방어" sub="" color={C.danger} />
              <AlertBox x={175} y={150} w={130} h={30} label="네트워크 도청 방어" sub="" color={C.danger} />
              <AlertBox x={330} y={150} w={130} h={30} label="CSRF 공격 방어" sub="" color={C.danger} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                VASP 권장: HttpOnly; Secure; SameSite=Strict 3종 모두 적용 (ISMS-P 2.10 점검)
              </text>
            </motion.g>
          )}

          {/* Step 3: 쿠키 외 추적 기술 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.optional}>쿠키 외 추적 기술 — 동일한 동의 의무</text>

              {/* 중앙: 이용자 */}
              <ModuleBox x={175} y={28} w={130} h={36} label="이용자 브라우저/앱" sub="추적 대상" color={C.optional} />

              {/* 4가지 추적 기술 */}
              <Arrow x1={200} y1={64} x2={80} y2={82} color={C.optional} />
              <Arrow x1={230} y1={64} x2={200} y2={82} color={C.optional} />
              <Arrow x1={260} y1={64} x2={310} y2={82} color={C.optional} />
              <Arrow x1={290} y1={64} x2={420} y2={82} color={C.optional} />

              <DataBox x={15} y={85} w={130} h={40} label="웹 비콘" color={C.optional} />
              <text x={80} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">1x1 픽셀 이미지 삽입</text>
              <text x={80} y={150} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">이메일 열람·방문 추적</text>

              <DataBox x={155} y={85} w={130} h={40} label="localStorage" color={C.optional} />
              <text x={220} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">만료 기한 없는 저장소</text>
              <text x={220} y={150} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">장기 추적에 사용</text>

              <DataBox x={295} y={85} w={85} h={40} label="핑거프린팅" color={C.danger} />
              <text x={337} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">브라우저 정보 조합</text>
              <text x={337} y={150} textAnchor="middle" fontSize={7} fill={C.danger}>거부 불가</text>

              <DataBox x={390} y={85} w={80} h={40} label="SDK 추적" color={C.optional} />
              <text x={430} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">ADID, IDFA</text>
              <text x={430} y={150} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">모바일 앱 행동 추적</text>

              {/* 공통 의무 */}
              <rect x={15} y={162} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={100} y={172} w={280} h={30} label="처리방침에 사용 여부·목적 기재 필수" sub="핑거프린팅은 거부 어려움 → 동의 근거 더 명확히" color={C.danger} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
