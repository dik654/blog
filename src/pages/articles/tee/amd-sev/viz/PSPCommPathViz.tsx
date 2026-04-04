import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'Application', sub: '사용자 공간' },
  { label: 'LibVirt / QEMU', sub: 'VM 관리' },
  { label: '/dev/sev ioctl', sub: '커널 인터페이스' },
  { label: 'CCP 드라이버', sub: '통신 드라이버' },
  { label: 'PSP 메일박스', sub: '레지스터' },
  { label: 'PSP 펌웨어', sub: '보안 처리' },
];

const MODULES = [
  { label: 'firmware', desc: '플랫폼 상태', color: '#6366f1' },
  { label: 'launch', desc: '게스트 런치', color: '#10b981' },
  { label: 'certs', desc: '인증서 관리', color: '#f59e0b' },
  { label: 'session', desc: '보안 세션', color: '#6366f1' },
  { label: 'vmsa', desc: 'VMSA 암호화', color: '#10b981' },
];

const STEPS = [
  { label: 'PSP 펌웨어 모듈 구성', body: 'firmware, launch, certs, session, vmsa — 각 모듈이 독립적 보안 기능 담당' },
  { label: '호스트 → PSP 요청 전달', body: 'Application → LibVirt → QEMU/KVM → /dev/sev ioctl → CCP 드라이버' },
  { label: 'CCP → PSP 메일박스 레지스터', body: 'CCP 드라이버가 PSP 메일박스 레지스터에 명령 기록' },
  { label: 'PSP 펌웨어 처리 → 응답 반환', body: 'PSP가 암호화/서명 수행 후 동일 경로로 응답 반환' },
];

export default function PSPCommPathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Module strip (step 0) */}
          {MODULES.map((m, i) => {
            const x = 20 + i * 104;
            return (
              <motion.g key={m.label} animate={{ opacity: step === 0 ? 1 : 0.15 }}>
                <rect x={x} y={10} width={96} height={36} rx={6}
                  fill={`${m.color}18`} stroke={m.color} strokeWidth={1.2} />
                <text x={x + 48} y={27} textAnchor="middle" fontSize={11} fontWeight={600} fill={m.color}>{m.label}</text>
                <text x={x + 48} y={41} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{m.desc}</text>
              </motion.g>
            );
          })}
          {/* Communication path (steps 1-3) */}
          {LAYERS.map((l, i) => {
            const y = 60 + i * 22;
            const active = step >= 1 && (
              (step === 1 && i <= 3) || (step === 2 && i >= 3 && i <= 4) || (step === 3 && i >= 4)
            );
            const isReturn = step === 3 && i <= 4;
            return (
              <motion.g key={l.label} animate={{ opacity: step === 0 ? 0.1 : active ? 1 : 0.25 }}>
                <rect x={80} y={y} width={240} height={18} rx={4}
                  fill={active ? '#6366f118' : 'var(--card)'} stroke={active ? '#6366f1' : '#88888830'} strokeWidth={active ? 1.5 : 0.8} />
                <text x={200} y={y + 12} textAnchor="middle" fontSize={10} fontWeight={500}
                  fill={active ? '#6366f1' : 'var(--muted-foreground)'}>{l.label}</text>
                <text x={340} y={y + 12} fontSize={10} fill="var(--muted-foreground)">{l.sub}</text>
                {i < 5 && (
                  <motion.line x1={200} y1={y + 18} x2={200} y2={y + 22}
                    stroke={active ? '#6366f1' : '#88888830'} strokeWidth={1}
                    markerEnd={isReturn ? undefined : (active ? 'url(#arrowDown)' : undefined)} />
                )}
              </motion.g>
            );
          })}
          {step === 3 && (
            <motion.path d="M78,186 L60,186 L60,82 L78,82"
              fill="none" stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 3"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
          )}
          {step === 3 && (
            <motion.text x={46} y={138} textAnchor="middle" fontSize={10} fill="#10b981"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transform="rotate(-90, 46, 138)">응답</motion.text>
          )}
          <defs>
            <marker id="arrowDown" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#6366f1" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
