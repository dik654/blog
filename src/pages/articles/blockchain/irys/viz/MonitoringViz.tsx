import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'node', label: 'Irys 노드', color: '#6366f1', x: 60, y: 50 },
  { id: 'tracing', label: 'tracing 크레이트', color: '#0ea5e9', x: 200, y: 20 },
  { id: 'metrics', label: '내장 메트릭', color: '#10b981', x: 200, y: 100 },
  { id: 'prom', label: 'Prometheus', color: '#f59e0b', x: 340, y: 50 },
  { id: 'grafana', label: 'Grafana', color: '#8b5cf6', x: 340, y: 120 },
  { id: 'alert', label: '알림 시스템', color: '#ef4444', x: 200, y: 160 },
];

const EDGES = [
  { from: 0, to: 1, label: '구조화 로그' },
  { from: 0, to: 2, label: '메트릭 수집' },
  { from: 2, to: 3, label: '/metrics' },
  { from: 3, to: 4, label: '시각화' },
  { from: 3, to: 5, label: '임계값 초과' },
];

const STEPS = [
  { label: '구조화 로깅', body: 'Rust tracing 크레이트로 모듈별 레벨 제어와 JSON 형식 출력을 지원합니다.' },
  { label: '내장 메트릭', body: 'VDF 단계 수, 블록 높이, P2P 피어 수 등 핵심 메트릭을 실시간 수집합니다.' },
  { label: '시각화', body: 'Prometheus가 메트릭을 스크랩하고 Grafana 대시보드에서 시각화합니다.' },
  { label: '알림', body: '블록 지연, 피어 감소 등 임계값 초과 시 Alertmanager로 알림을 전송합니다.' },
];

const VN = [[0, 1], [0, 1, 2], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5]];
const VE = [[0], [0, 1], [0, 1, 2, 3], [0, 1, 2, 3, 4]];

export default function MonitoringViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 185" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2 + 8, my = (f.y + 15 + t.y + 15) / 2 + 5;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x} y1={f.y + 30} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1} />
                <rect x={mx - 28} y={my - 8} width={56} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 55} y={n.y} width={110} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
