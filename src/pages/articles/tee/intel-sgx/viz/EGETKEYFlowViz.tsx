import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'sgx_key_request_t 구성', body: 'key_name(SEAL), key_policy(MRENCLAVE/MRSIGNER), isv_svn, cpu_svn 등을 설정. 봉인 정책과 버전 정보를 결정.' },
  { label: 'EGETKEY 하드웨어 명령어 실행', body: 'CPU가 key_request + 내부 퓨즈(Root Seal Key)를 혼합. 엔클레이브 내부 메모리 검증 + KSS 정책 검증 후 실행.' },
  { label: '128-bit 봉인 키 출력', body: '동일 CPU + 동일 정책이면 항상 동일 키 파생. 실패 시 랜덤 데이터로 덮어써 키 누출 방지.' },
];

const BOXES = [
  { label: 'key_request_t', sub: '정책+버전', x: 80, w: 110 },
  { label: 'EGETKEY', sub: 'CPU 명령어', x: 270, w: 90 },
  { label: '128-bit Key', sub: '봉인 키', x: 440, w: 100 },
];

export default function EGETKEYFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <rect x={200} y={8} width={150} height={120} rx={8} fill="none"
            stroke="#6366f120" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={275} y={22} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>CPU Hardware</text>

          {BOXES.map((b, i) => {
            const active = i === step;
            const done = i < step;
            const c = ['#6366f1', '#10b981', '#f59e0b'][i];
            return (
              <g key={b.label}>
                {i > 0 && (
                  <motion.line x1={BOXES[i - 1].x + BOXES[i - 1].w / 2 + 8} y1={68}
                    x2={b.x - b.w / 2 - 8} y2={68}
                    stroke={done || active ? c : 'var(--border)'} strokeWidth={1.2}
                    markerEnd="url(#arrow)" initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }} transition={{ delay: i * 0.15, duration: 0.3 }} />
                )}
                <motion.rect x={b.x - b.w / 2} y={42} width={b.w} height={50} rx={6}
                  fill={active ? `${c}18` : `${c}06`} stroke={active ? c : `${c}30`}
                  strokeWidth={active ? 2 : 0.8}
                  animate={{ opacity: done ? 0.4 : active ? 1 : 0.25 }} />
                <text x={b.x} y={64} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? c : 'var(--foreground)'}>{b.label}</text>
                <text x={b.x} y={80} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{b.sub}</text>
              </g>
            );
          })}

          <defs>
            <marker id="arrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
