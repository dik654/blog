import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  asym: '#0ea5e9',
  sym: '#6366f1',
  safe: '#10b981',
  danger: '#ef4444',
  warn: '#f59e0b',
};

const STEPS = [
  {
    label: 'TLS 핸드셰이크 — 비대칭키로 세션 키 교환 후 대칭키 통신',
    body: '클라이언트가 서버 인증서를 검증하고, 비대칭키(RSA/ECDHE)로 세션 키를 안전하게 교환. 이후 모든 데이터는 세션 키(AES)로 대칭 암호화하여 전송. 이것이 하이브리드 암호 체계.',
  },
  {
    label: 'TLS 버전별 차이 — 1.0/1.1 폐기, 1.2 필수, 1.3 권장',
    body: 'TLS 1.0/1.1: POODLE·BEAST 취약점으로 비활성화 필수. TLS 1.2: 현재 필수 최소 버전. TLS 1.3: 핸드셰이크 1-RTT, 취약 cipher suite 제거로 보안+성능 모두 향상.',
  },
  {
    label: '내부 통신 + VPN — 서버 간 TLS + 원격 접속 암호화 터널',
    body: 'API↔DB, 마이크로서비스 간 내부 통신도 TLS 적용 필수. 내부 망 장악 시 도청 가능. VPN은 원격 접속(재택·협력사)에서 공용 구간 전체를 암호화 터널로 보호.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#tls-inline-arrow)" />
  );
}

export default function TlsHandshakeInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tls-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: TLS 핸드셰이크 전체 흐름 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">TLS 핸드셰이크 → 대칭키 통신</text>

              {/* 클라이언트 / 서버 */}
              <ModuleBox x={15} y={28} w={90} h={42} label="클라이언트" sub="브라우저" color={C.asym} />
              <ModuleBox x={375} y={28} w={90} h={42} label="서버" sub="인증서 보유" color={C.safe} />

              {/* 1. 인증서 요청 */}
              <Arrow x1={105} y1={40} x2={373} y2={40} color={C.asym} />
              <rect x={180} y={30} width={120} height={14} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.asym}>1. 인증서 요청+검증</text>

              {/* 2. 세션 키 교환 */}
              <Arrow x1={373} y1={58} x2={105} y2={58} color={C.safe} />
              <rect x={160} y={50} width={160} height={14} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={60} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>2. 비대칭키로 세션 키 교환</text>

              {/* 구분선 */}
              <line x1={15} y1={82} x2={465} y2={82} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 3. 대칭키 통신 */}
              <text x={240} y={100} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.sym}>3. 세션 키(AES)로 데이터 암호화 통신</text>

              <rect x={50} y={108} width={380} height={28} rx={14} fill="#6366f108" stroke={C.sym} strokeWidth={1} />
              <motion.circle r={4} fill={C.sym} opacity={0.5}
                initial={{ cx: 70 }} animate={{ cx: 410 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} cy={122} />
              <text x={240} y={126} textAnchor="middle" fontSize={9} fill={C.sym}>암호화 터널 (대칭키 = 빠른 속도)</text>

              {/* 하이브리드 설명 */}
              <line x1={15} y1={148} x2={465} y2={148} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={30} y={158} w={120} h={28} label="비대칭키 (느림)" sub="키 교환만 담당" color={C.asym} />
              <text x={175} y={175} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">+</text>
              <DataBox x={195} y={158} w={120} h={28} label="대칭키 (빠름)" sub="데이터 전송 담당" color={C.sym} />
              <text x={340} y={175} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">=</text>
              <StatusBox x={360} y={152} w={105} h={40} label="하이브리드" sub="안전+속도" color={C.safe} />
            </motion.g>
          )}

          {/* Step 1: TLS 버전 비교 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">TLS 버전별 보안 수준</text>

              {/* TLS 1.0/1.1 */}
              <AlertBox x={15} y={30} w={130} h={55} label="TLS 1.0 / 1.1" sub="POODLE · BEAST 취약" color={C.danger} />
              <text x={80} y={98} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.danger}>비활성화 필수</text>

              {/* TLS 1.2 */}
              <StatusBox x={175} y={30} w={130} h={55} label="TLS 1.2" sub="현재 필수 최소 버전" color={C.warn} />
              <text x={240} y={98} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>필수</text>

              {/* TLS 1.3 */}
              <StatusBox x={335} y={30} w={130} h={55} label="TLS 1.3" sub="1-RTT, 취약 스위트 제거" color={C.safe} />
              <text x={400} y={98} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>권장</text>

              {/* 보안 레벨 바 */}
              <line x1={15} y1={112} x2={465} y2={112} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">보안 수준 비교</text>

              {/* 바 */}
              <text x={14} y={148} fontSize={8} fill="var(--muted-foreground)">1.0</text>
              <rect x={30} y={140} width={80} height={10} rx={5} fill={C.danger} opacity={0.5} />

              <text x={14} y={168} fontSize={8} fill="var(--muted-foreground)">1.2</text>
              <rect x={30} y={160} width={280} height={10} rx={5} fill={C.warn} opacity={0.5} />

              <text x={14} y={188} fontSize={8} fill="var(--muted-foreground)">1.3</text>
              <rect x={30} y={180} width={430} height={10} rx={5} fill={C.safe} opacity={0.5} />

              {/* HSTS */}
              <rect x={200} y={135} width={260} height={24} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={330} y={151} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>HSTS 헤더: HTTP → HTTPS 자동 리다이렉트</text>
            </motion.g>
          )}

          {/* Step 2: 내부 통신 + VPN */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">내부 서버 간 TLS + VPN 원격 접속</text>

              {/* 내부 통신 */}
              <text x={240} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.asym}>내부 서버 간 통신</text>

              <ModuleBox x={15} y={44} w={85} h={40} label="API 서버" color={C.asym} />
              <rect x={110} y={54} width={80} height={20} rx={10} fill="#0ea5e908" stroke={C.asym} strokeWidth={1} />
              <text x={150} y={68} textAnchor="middle" fontSize={8} fill={C.asym}>TLS 필수</text>
              <ModuleBox x={200} y={44} w={80} h={40} label="DB 서버" color={C.asym} />

              <ModuleBox x={300} y={44} w={80} h={40} label="서비스 A" color={C.asym} />
              <rect x={390} y={54} width={70} height={20} rx={10} fill="#0ea5e908" stroke={C.asym} strokeWidth={1} />
              <text x={425} y={68} textAnchor="middle" fontSize={8} fill={C.asym}>mTLS</text>

              {/* 위협 */}
              <AlertBox x={170} y={90} w={140} h={28} label="내부 망 장악 → 도청" color={C.danger} />

              {/* 구분선 */}
              <line x1={15} y1={130} x2={465} y2={130} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* VPN */}
              <text x={240} y={148} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>VPN: 원격 접속 암호화 터널</text>

              <ModuleBox x={15} y={156} w={85} h={40} label="재택 근무자" sub="외부 네트워크" color={C.warn} />
              <Arrow x1={100} y1={176} x2={123} y2={176} color={C.safe} />

              <rect x={125} y={160} width={220} height={30} rx={15} fill="#10b98108" stroke={C.safe} strokeWidth={1} />
              <motion.circle r={3} fill={C.safe} opacity={0.5}
                initial={{ cx: 145 }} animate={{ cx: 325 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} cy={175} />
              <text x={235} y={179} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>VPN 암호화 터널</text>

              <Arrow x1={345} y1={176} x2={368} y2={176} color={C.safe} />
              <ModuleBox x={370} y={156} w={95} h={40} label="내부 시스템" sub="사내 네트워크" color={C.safe} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
