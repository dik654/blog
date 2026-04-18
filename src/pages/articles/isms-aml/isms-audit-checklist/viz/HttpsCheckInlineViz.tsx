import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  https: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: 'HTTPS 5대 확인', body: 'HTTPS 적용, HTTP 리다이렉트, 인증서 만료일, TLS 1.2+, Mixed Content — 5가지를 브라우저에서 확인.' },
  { label: '쿠키 배너 점검', body: '동의 전 쿠키 설치 금지, 거부 옵션, 종류별 선택 동의. 마케팅/분석 쿠키 사용 시 필수.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#hci-arrow)" />;
}

export default function HttpsCheckInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="hci-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">HTTPS 5대 확인 항목</text>

              <DataBox x={15} y={28} w={85} h={38} label="HTTPS 적용" color={C.ok} />
              <text x={57} y={80} textAnchor="middle" fontSize={7.5} fill={C.ok}>자물쇠 아이콘</text>

              <DataBox x={110} y={28} w={85} h={38} label="리다이렉트" color={C.warn} />
              <text x={152} y={80} textAnchor="middle" fontSize={7.5} fill={C.warn}>HTTP → HTTPS</text>

              <DataBox x={205} y={28} w={80} h={38} label="인증서" color={C.fail} />
              <text x={245} y={80} textAnchor="middle" fontSize={7.5} fill={C.fail}>만료일 30일+</text>

              <DataBox x={295} y={28} w={80} h={38} label="TLS 버전" color={C.https} />
              <text x={335} y={80} textAnchor="middle" fontSize={7.5} fill={C.https}>1.2 이상 필수</text>

              <DataBox x={385} y={28} w={80} h={38} label="Mixed" color={C.fail} />
              <text x={425} y={80} textAnchor="middle" fontSize={7.5} fill={C.fail}>HTTP 리소스</text>

              <rect x={30} y={95} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={108} w={200} h={38} label="TLS 1.0/1.1 사용" sub="보안 취약 프로토콜 = 결함" color={C.fail} />
              <AlertBox x={250} y={108} w={200} h={38} label="HTTP 접속 유지됨" sub="리다이렉트 미설정 = 결함" color={C.fail} />

              <text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">openssl s_client / nmap ssl-enum-ciphers 로 CLI 확인 가능</text>
              <text x={240} y={186} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Let's Encrypt 90일 갱신: certbot renew --dry-run 사전 테스트</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">쿠키 배너 점검</text>

              <ActionBox x={15} y={28} w={120} h={40} label="서비스 첫 접속" sub="쿠키 배너 표시?" color={C.https} />
              <Arrow x1={135} y1={48} x2={158} y2={48} color={C.https} />

              <ModuleBox x={160} y={28} w={130} h={40} label="쿠키 동의 팝업" sub="동의/거부 선택지" color={C.ok} />
              <Arrow x1={290} y1={48} x2={313} y2={48} color={C.ok} />

              <DataBox x={315} y={30} w={150} h={36} label="종류별 선택 동의" color={C.warn} />

              {/* 하단: 결함 조건 */}
              <rect x={30} y={85} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={15} y={98} w={140} h={38} label="동의 전 쿠키 설치" sub="동의 버튼 누르기 전 이미 설치" color={C.fail} />
              <AlertBox x={170} y={98} w={140} h={38} label="거부 옵션 없음" sub="동의 버튼만 존재" color={C.fail} />
              <AlertBox x={325} y={98} w={140} h={38} label="종류 미구분" sub="필수/분석/마케팅 미분리" color={C.warn} />

              <rect x={30} y={152} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Google Analytics 등 분석 쿠키 사용 시 쿠키 동의 배너 필수</text>
              <text x={240} y={184} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">쿠키 배너에서 상세 쿠키 정책 페이지로 이동 가능한 링크 포함</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
