import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'PCE: 플랫폼 프로비저닝', body: 'EGETKEY로 PPID 생성 → Intel PCS의 RSA-3072 공개키로 PPID 암호화. PCK 인증서와 PSVN 정보 반환.' },
  { label: 'QE3: ECDSA Quote 서명', body: 'AESM 데몬이 앱 REPORT를 QE3에 전달. QE3가 CMAC 검증 후 ECDSA-P256로 서명 → Quote v3 생성.' },
  { label: 'Quote v3 구조 출력', body: 'version(3) + att_key_type(ECDSA_P256) + tee_type(SGX) + QE/PCE SVN + isv_enclave_report + ECDSA 서명.' },
];

const BOXES = [
  { label: 'PCE', sub: 'PPID 프로비저닝', x: 80, color: '#6366f1' },
  { label: 'QE3', sub: 'ECDSA 서명', x: 270, color: '#10b981' },
  { label: 'Quote v3', sub: 'ECDSA-P256', x: 440, color: '#f59e0b' },
];

export default function QuoteGenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <rect x={15} y={8} width={370} height={108} rx={8} fill="none"
            stroke="#6366f120" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={30} y={22} fontSize={10} fill="#6366f1" fontWeight={600}>Architecture Enclaves (AESM)</text>

          {BOXES.map((b, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <g key={b.label}>
                {i > 0 && (
                  <motion.line x1={BOXES[i - 1].x + 50} y1={68}
                    x2={b.x - 50} y2={68}
                    stroke={done || active ? b.color : 'var(--border)'} strokeWidth={1.2}
                    markerEnd="url(#qarr)" initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }} transition={{ delay: i * 0.12, duration: 0.3 }} />
                )}
                <motion.rect x={b.x - 48} y={38} width={96} height={56} rx={6}
                  fill={active ? `${b.color}18` : `${b.color}06`}
                  stroke={active ? b.color : `${b.color}30`}
                  strokeWidth={active ? 2 : 0.8}
                  animate={{ opacity: done ? 0.4 : active ? 1 : 0.25 }} />
                <text x={b.x} y={62} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? b.color : 'var(--foreground)'}>{b.label}</text>
                <text x={b.x} y={80} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{b.sub}</text>
              </g>
            );
          })}

          {step === 0 && (
            <motion.text x={80} y={120} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              RSA-OAEP(PPID) → Intel PCS
            </motion.text>
          )}
          {step === 1 && (
            <motion.text x={270} y={120} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              REPORT CMAC 검증 → ECDSA 서명
            </motion.text>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <text x={440} y={120} textAnchor="middle" fontSize={10} fill="#f59e0b">
                v3 + ECDSA_P256 + report_body
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="qarr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
