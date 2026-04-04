import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력: target_info + report_data', body: 'target_info = QE의 MRENCLAVE + 속성(512B). report_data = 사용자 데이터 64B (예: 공개키 해시). 모든 포인터는 엔클레이브 내부 메모리 필수.' },
  { label: 'CPU가 EREPORT 실행', body: 'MRENCLAVE, MRSIGNER, CPUSVN, attributes를 보고서 본문에 기록. target_info 엔클레이브(QE)만 검증 가능한 128-bit CMAC 태그 첨부.' },
  { label: 'sgx_report_t 출력 (432 bytes)', body: 'body(측정값) + key_id(보고서 키 식별자) + mac(CMAC 128-bit). QE만 이 CMAC을 검증할 수 있음 — 로컬 증명 완료.' },
];

const NODES = [
  { label: 'target_info', sub: 'QE 정보 512B', x: 70, color: '#6366f1' },
  { label: 'EREPORT', sub: 'CPU 명령어', x: 270, color: '#10b981' },
  { label: 'sgx_report_t', sub: '432 bytes', x: 460, color: '#f59e0b' },
];

export default function EREPORTFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <rect x={195} y={8} width={150} height={110} rx={8} fill="none"
            stroke="#10b98120" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={270} y={22} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>CPU Hardware</text>

          {NODES.map((n, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <g key={n.label}>
                {i > 0 && (
                  <motion.line x1={NODES[i - 1].x + 55} y1={68}
                    x2={n.x - 55} y2={68}
                    stroke={done || active ? n.color : 'var(--border)'} strokeWidth={1.2}
                    markerEnd="url(#earr)" initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }} transition={{ delay: i * 0.12, duration: 0.3 }} />
                )}
                <motion.rect x={n.x - 50} y={40} width={100} height={52} rx={6}
                  fill={active ? `${n.color}18` : `${n.color}06`}
                  stroke={active ? n.color : `${n.color}30`}
                  strokeWidth={active ? 2 : 0.8}
                  animate={{ opacity: done ? 0.4 : active ? 1 : 0.25 }} />
                <text x={n.x} y={62} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? n.color : 'var(--foreground)'}>{n.label}</text>
                <text x={n.x} y={78} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{n.sub}</text>
              </g>
            );
          })}

          {step === 0 && (
            <motion.text x={70} y={115} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              + report_data 64B
            </motion.text>
          )}

          {step === 2 && (
            <motion.text x={460} y={115} textAnchor="middle" fontSize={10}
              fill="#f59e0b" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              body + key_id + CMAC
            </motion.text>
          )}

          <defs>
            <marker id="earr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
