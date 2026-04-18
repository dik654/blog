import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  config: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '포트 점검 흐름', body: 'ss -tlnp 명령어로 리스닝 포트 조회. 0.0.0.0 바인딩은 모든 IP에 노출 — 제한 필요.' },
  { label: 'OS 설정 파일 확인', body: '/etc/login.defs 패스워드 정책, sshd_config root 로그인 차단, 불필요 서비스 비활성화.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#osi-arrow)" />;
}

export default function OsSecurityInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="osi-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">리스닝 포트 점검</text>

              <ModuleBox x={15} y={28} w={100} h={38} label="ss -tlnp" sub="포트 조회 명령" color={C.config} />
              <Arrow x1={115} y1={47} x2={133} y2={47} color={C.config} />

              {/* 포트 결과 */}
              <DataBox x={135} y={30} w={95} h={34} label="0.0.0.0:22" color={C.warn} />
              <DataBox x={245} y={30} w={95} h={34} label="0.0.0.0:3306" color={C.fail} />
              <DataBox x={355} y={30} w={100} h={34} label="127.0.0.1:6379" color={C.ok} />

              {/* 판정 */}
              <Arrow x1={182} y1={64} x2={182} y2={80} color={C.warn} />
              <Arrow x1={292} y1={64} x2={292} y2={80} color={C.fail} />
              <Arrow x1={405} y1={64} x2={405} y2={80} color={C.ok} />

              <text x={182} y={92} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>IP 제한 필요</text>
              <text x={292} y={92} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.fail}>외부 노출 결함</text>
              <text x={405} y={92} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ok}>로컬만 = 양호</text>

              <rect x={30} y={108} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={118} w={200} h={36} label="FTP(21), Telnet(23) LISTEN" sub="서비스 목적에 불필요 = 결함" color={C.fail} />
              <DataBox x={260} y={120} w={190} h={32} label="Redis 0.0.0.0 → 외부 노출 위험" color={C.fail} />

              <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모든 포트는 서비스 목적에 맞게 바인딩 IP 제한 필수</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">OS 보안 설정 파일 3종</text>

              <ModuleBox x={15} y={30} w={140} h={44} label="/etc/login.defs" sub="PASS_MAX_DAYS <= 90" color={C.config} />
              <ModuleBox x={170} y={30} w={140} h={44} label="sshd_config" sub="PermitRootLogin no" color={C.warn} />
              <ModuleBox x={325} y={30} w={140} h={44} label="systemctl" sub="불필요 데몬 비활성화" color={C.fail} />

              <Arrow x1={85} y1={74} x2={85} y2={94} color={C.fail} />
              <Arrow x1={240} y1={74} x2={240} y2={94} color={C.fail} />
              <Arrow x1={395} y1={74} x2={395} y2={94} color={C.warn} />

              <AlertBox x={20} y={97} w={130} h={36} label="99999 = 미설정" sub="즉시 결함" color={C.fail} />
              <AlertBox x={175} y={97} w={130} h={36} label="yes = root 허용" sub="2.5.1 위반" color={C.fail} />
              <AlertBox x={330} y={97} w={130} h={36} label="cups, avahi" sub="운영 불필요 서비스" color={C.warn} />

              <rect x={30} y={150} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">PAM pam_pwquality로 비밀번호 복잡도 강제 설정 여부도 확인</text>
              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">PermitRootLogin yes → root 원격 직접 접속 가능 → 중대 결함</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
