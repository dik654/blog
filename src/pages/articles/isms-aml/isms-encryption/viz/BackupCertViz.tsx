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
    label: '백업 암호화 — 키와 백업은 반드시 별도 위치에 보관',
    body: '운영 DB → AES-256 → 암호화 백업. 핵심: 암호화 키를 백업과 같은 서버에 두면 서버 침해 시 둘 다 유출되어 무의미. 키는 HSM 또는 시크릿 매니저에 별도 보관.',
  },
  {
    label: '소산 백업 — 원격지 복사본으로 물리적 재해 대비',
    body: '화재·홍수 대비 원격지에 백업 복사본 보관. TLS/VPN으로 전송 암호화, 도착 후에도 암호화 유지. 분기 1회 이상 복구 테스트 필수 — 복호화 키 분실 시 백업이 존재하지 않는 것과 동일.',
  },
  {
    label: '인증서 관리 — 자동 갱신 + 개인키 보호 + CT 감시',
    body: 'certbot이 90일 인증서 발급, 만료 30일 전 자동 갱신. 14/7/1일 전 단계별 알림. 개인키 유출 = 도메인 사칭(MITM). HSM에 보관, CT 로그 모니터링으로 사칭 인증서 조기 탐지.',
  },
];

function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#bc-arrow)"
      strokeDasharray={dashed ? '3 2' : undefined} />
  );
}

export default function BackupCertViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 백업 암호화 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.action}>백업 암호화 — AES-256 + 키 별도 보관</text>

              {/* 운영 DB → AES-256 → 암호화 백업 */}
              <ModuleBox x={15} y={24} w={95} h={50} label="운영 DB" sub="원본 데이터" color={C.action} />
              <Arrow x1={110} y1={49} x2={138} y2={49} color={C.action} />

              <ActionBox x={140} y={26} w={90} h={46} label="AES-256" sub="백업 암호화" color={C.safe} />
              <Arrow x1={230} y1={49} x2={258} y2={49} color={C.safe} />

              <DataBox x={260} y={33} w={100} h={32} label="암호화 백업" color={C.safe} />

              {/* 키 별도 보관 */}
              <Arrow x1={195} y1={72} x2={195} y2={98} color={C.warn} />
              <ModuleBox x={120} y={100} w={110} h={48} label="HSM / 시크릿 매니저" sub="키 별도 보관" color={C.warn} />

              {/* 같은 서버 = 무의미 경고 */}
              <AlertBox x={295} y={88} w={170} h={48} label="같은 서버에 키+백업 = 무의미" sub="서버 침해 시 둘 다 유출" color={C.danger} />

              {/* 올바른 구조 연결선 */}
              <line x1={260} y1={110} x2={295} y2={110} stroke={C.danger} strokeWidth={0.8} strokeDasharray="3 2" />

              {/* 복구 절차 */}
              <rect x={60} y={164} width={360} height={32} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={179} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">복구 시: 키를 별도 경로(HSM/시크릿 매니저)에서 가져와 복호화</text>
              <text x={240} y={192} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>키와 백업의 물리적 분리 = 백업 암호화의 핵심</text>
            </motion.g>
          )}

          {/* ── Step 1: 소산 백업 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>소산 백업 — 원격지 복사본</text>

              {/* 주 사이트 → TLS/VPN → 원격지 */}
              <ModuleBox x={15} y={28} w={100} h={50} label="주 사이트" sub="암호화 백업 원본" color={C.action} />

              {/* 전송 암호화 */}
              <Arrow x1={115} y1={53} x2={155} y2={53} color={C.safe} />
              <ActionBox x={157} y={30} w={90} h={46} label="TLS / VPN" sub="전송 구간 암호화" color={C.safe} />

              {/* 원격지 */}
              <Arrow x1={247} y1={53} x2={287} y2={53} color={C.safe} />
              <ModuleBox x={289} y={28} w={100} h={50} label="원격지" sub="소산 백업 보관" color={C.warn} />

              {/* 암호화 유지 강조 */}
              <Arrow x1={389} y1={53} x2={412} y2={53} color={C.safe} />
              <StatusBox x={414} y={28} w={58} h={50} label="암호화" sub="유지" color={C.safe} progress={1} />

              {/* 흐르는 데이터 */}
              <motion.circle r={3.5} fill={C.safe} opacity={0.5}
                initial={{ cx: 115, cy: 53 }}
                animate={{ cx: 287, cy: 53 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />

              {/* 재해 대비 아이콘 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={140} y={114} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>물리적 재해 대비</text>
              <AlertBox x={25} y={122} w={95} h={38} label="화재" color={C.danger} />
              <AlertBox x={130} y={122} w={95} h={38} label="홍수" color={C.danger} />
              <Arrow x1={225} y1={141} x2={260} y2={141} color={C.warn} />
              <DataBox x={262} y={125} w={95} h={32} label="원격지 복사본" sub="안전하게 보관" color={C.safe} />

              {/* 복구 테스트 */}
              <rect x={25} y={175} width={195} height={28} rx={6} fill="var(--card)" stroke={C.warn} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={122} y={193} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>분기 1회 이상 복구 테스트 필수</text>

              <rect x={240} y={175} width={220} height={28} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={350} y={193} textAnchor="middle" fontSize={9} fill={C.danger}>키 분실 = 백업이 존재하지 않는 것과 동일</text>
            </motion.g>
          )}

          {/* ── Step 2: 인증서 관리 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>인증서 관리 — 자동 갱신 + 개인키 보호</text>

              {/* certbot 자동 갱신 흐름 */}
              <ModuleBox x={15} y={24} w={85} h={48} label="certbot" sub="Let's Encrypt" color={C.safe} />
              <Arrow x1={100} y1={48} x2={123} y2={48} color={C.safe} />

              <ActionBox x={125} y={26} w={90} h={44} label="인증서 발급" sub="90일 유효" color={C.safe} />
              <Arrow x1={215} y1={48} x2={238} y2={48} color={C.safe} />

              <ActionBox x={240} y={26} w={100} h={44} label="자동 갱신" sub="만료 30일 전 실행" color={C.safe} />

              {/* 만료 알림 타임라인 */}
              <text x={410} y={30} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>만료 알림</text>

              <rect x={360} y={40} width={110} height={5} rx={2.5} fill="var(--border)" opacity={0.3} />
              <circle cx={375} cy={42.5} r={4} fill={C.safe} />
              <text x={375} y={56} textAnchor="middle" fontSize={7} fill={C.safe}>14일</text>
              <circle cx={415} cy={42.5} r={4} fill={C.warn} />
              <text x={415} y={56} textAnchor="middle" fontSize={7} fill={C.warn}>7일</text>
              <circle cx={455} cy={42.5} r={4} fill={C.danger} />
              <text x={455} y={56} textAnchor="middle" fontSize={7} fill={C.danger}>1일</text>

              {/* 구분선 */}
              <line x1={15} y1={76} x2={465} y2={76} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 개인키 유출 = 도메인 사칭 */}
              <text x={240} y={94} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>개인키 유출 위험</text>

              <DataBox x={15} y={102} w={95} h={32} label="개인키 유출" color={C.danger} />
              <Arrow x1={110} y1={118} x2={133} y2={118} color={C.danger} />
              <AlertBox x={135} y={100} w={110} h={36} label="도메인 사칭" sub="impersonation" color={C.danger} />
              <Arrow x1={245} y1={118} x2={268} y2={118} color={C.danger} />
              <AlertBox x={270} y={100} w={80} h={36} label="MITM 공격" sub="중간자 공격" color={C.danger} />

              {/* 방어: HSM + CT 로그 */}
              <line x1={15} y1={150} x2={465} y2={150} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={168} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>방어 전략</text>

              <ModuleBox x={20} y={176} w={105} h={28} label="HSM 보관" sub="" color={C.action} />
              <text x={72} y={197} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">디스크 평문 없음</text>

              <DataBox x={145} y={176} w={105} h={28} label="파일 권한 600" color={C.warn} />

              <ActionBox x={270} y={174} w={100} h={32} label="CT 로그 감시" sub="사칭 인증서 탐지" color={C.safe} />

              <StatusBox x={390} y={170} w={80} h={38} label="조기 발견" color={C.safe} progress={0.8} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
