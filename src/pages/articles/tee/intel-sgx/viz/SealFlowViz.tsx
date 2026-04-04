import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'EGETKEY로 봉인 키 파생', body: 'key_request의 정책(MRENCLAVE/MRSIGNER)에 따라 CPU 내부 퓨즈 + SVN으로 128-bit 대칭 키 생성.' },
  { label: 'AES-256-GCM 암호화 실행', body: '봉인 키로 평문 암호화. AAD(추가 인증 데이터)는 평문 유지하되 무결성 보호. 12-byte zero IV 사용.' },
  { label: 'sgx_sealed_data_t 패키징', body: 'key_request + payload_tag(16B MAC) + 암호문 + AAD를 하나의 구조체로 조합. 디스크 저장 준비 완료.' },
];

const BOXES = [
  { label: 'EGETKEY', sub: '128-bit 키', x: 80, color: '#6366f1' },
  { label: 'AES-GCM', sub: '암호화+MAC', x: 270, color: '#10b981' },
  { label: 'sealed_data_t', sub: '패키징', x: 440, color: '#f59e0b' },
];

export default function SealFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <rect x={15} y={8} width={510} height={105} rx={8} fill="none"
            stroke="#6366f120" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={30} y={22} fontSize={10} fill="#6366f1" fontWeight={600}>SGX Enclave</text>

          {BOXES.map((b, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <g key={b.label}>
                {i > 0 && (
                  <motion.line x1={BOXES[i - 1].x + 45} y1={65}
                    x2={b.x - 45} y2={65}
                    stroke={done || active ? b.color : 'var(--border)'} strokeWidth={1.2}
                    markerEnd="url(#sarr)" initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }} transition={{ delay: i * 0.12, duration: 0.3 }} />
                )}
                <motion.rect x={b.x - 45} y={38} width={90} height={52} rx={6}
                  fill={active ? `${b.color}18` : `${b.color}06`}
                  stroke={active ? b.color : `${b.color}30`}
                  strokeWidth={active ? 2 : 0.8}
                  animate={{ opacity: done ? 0.4 : active ? 1 : 0.25 }} />
                <text x={b.x} y={60} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? b.color : 'var(--foreground)'}>{b.label}</text>
                <text x={b.x} y={78} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{b.sub}</text>
              </g>
            );
          })}

          {/* Inputs on step 1 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <text x={270} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                평문 + AAD → 암호문 + 16B MAC
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <text x={440} y={130} textAnchor="middle" fontSize={10} fill="#f59e0b">
                key_request + tag + payload
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="sarr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
