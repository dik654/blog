import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  secure: '#10b981',
  attack: '#ef4444',
  attr: '#6366f1',
  track: '#f59e0b',
};

const STEPS = [
  { label: '쿠키 보안 속성 3가지', body: 'HttpOnly: JS 접근 차단(XSS 방어). Secure: HTTPS만 전송(도청 방어). SameSite: 교차사이트 요청 제어(CSRF 방어). VASP는 3가지 모두 적용 권장.' },
  { label: '쿠키 외 추적 기술 4종', body: '웹 비콘(1x1 픽셀 추적), 로컬 스토리지(만료 없는 장기 저장), 핑거프린팅(브라우저 특성 조합 식별), SDK 추적(기기 식별자 수집). 모두 쿠키와 동일한 동의 의무.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cs-inline-arrow)" />;
}

export default function CookieSecurityInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cs-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.attr}>쿠키 보안 속성 3가지</text>

              {/* 3열 구조 */}
              <ModuleBox x={15} y={28} w={140} h={55} label="HttpOnly" sub="JS 접근 차단" color={C.secure} />
              <DataBox x={25} y={92} w={120} h={22} label="방어: XSS 공격" color={C.attack} />
              <text x={85} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">document.cookie 차단</text>

              <ModuleBox x={170} y={28} w={140} h={55} label="Secure" sub="HTTPS만 전송" color={C.secure} />
              <DataBox x={180} y={92} w={120} h={22} label="방어: 네트워크 도청" color={C.attack} />
              <text x={240} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">평문 노출 방지</text>

              <ModuleBox x={325} y={28} w={140} h={55} label="SameSite" sub="교차사이트 제어" color={C.secure} />
              <DataBox x={335} y={92} w={120} h={22} label="방어: CSRF 공격" color={C.attack} />
              <text x={395} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Strict / Lax / None</text>

              <line x1={15} y1={140} x2={465} y2={140} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <StatusBox x={100} y={148} w={280} h={36} label="VASP 권장: HttpOnly; Secure; SameSite=Strict" sub="출금·이체 시 CSRF 성공 → 직접 금전 피해" color={C.attr} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.track}>쿠키 외 추적 기술</text>

              <DataBox x={15} y={30} w={105} h={44} label="웹 비콘" color={C.track} />
              <text x={67} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">1x1 픽셀 이미지</text>
              <text x={67} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">열람·방문 추적</text>

              <DataBox x={130} y={30} w={105} h={44} label="로컬 스토리지" color={C.track} />
              <text x={182} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">만료 기한 없음</text>
              <text x={182} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">장기 추적 용도</text>

              <DataBox x={245} y={30} w={105} h={44} label="핑거프린팅" color={C.attack} />
              <text x={297} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">브라우저 특성 조합</text>
              <text x={297} y={98} textAnchor="middle" fontSize={8} fill={C.attack}>거부 곤란</text>

              <DataBox x={360} y={30} w={105} h={44} label="SDK 추적" color={C.track} />
              <text x={412} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">ADID/IDFA 수집</text>
              <text x={412} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모바일 앱 대상</text>

              <line x1={15} y1={112} x2={465} y2={112} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={80} y={120} w={320} h={34} label="쿠키와 동일한 동의 의무 적용" sub="처리방침에 사용 여부·목적 기재 필수" color={C.track} />

              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                핑거프린팅: 이용자 거부 곤란 → 사용 시 동의 근거 더 명확히 해야
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
