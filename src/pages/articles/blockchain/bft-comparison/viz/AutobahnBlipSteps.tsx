import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function TraditionalBlipStep() {
  const phases = [
    { label: '정상', w: 80, c: CE },
    { label: 'Blip!', w: 30, c: CR },
    { label: 'View Change', w: 60, c: CA },
    { label: 'Hangover', w: 100, c: CR },
    { label: '회복', w: 60, c: CE },
  ];
  let x = 15;
  return (
    <svg viewBox="0 0 440 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={10} fontWeight={500} fill="var(--muted-foreground)">PBFT / HotStuff</text>
      {phases.map((p, i) => {
        const px = x; x += p.w + 4;
        return (
          <motion.g key={i} {...slide(0.1 + i * 0.15)}>
            <rect x={px} y={22} width={p.w} height={24} rx={3} fill={`${p.c}15`} stroke={p.c} strokeWidth={0.8} />
            <text x={px + p.w / 2} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={p.c}>{p.label}</text>
          </motion.g>
        );
      })}
      <motion.g {...fade(1.0)}>
        <text x={220} y={64} textAnchor="middle" fontSize={10} fill={CR}>
          긴 복구 시간 — 파이프라인 재시작 필요
        </text>
      </motion.g>
    </svg>
  );
}

export function DAGBlipStep() {
  const phases = [
    { label: '정상 (고지연)', w: 120, c: CA },
    { label: 'Blip', w: 30, c: CR },
    { label: '빠른 복구', w: 60, c: CE },
    { label: '정상 (고지연)', w: 120, c: CA },
  ];
  let x = 15;
  return (
    <svg viewBox="0 0 440 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={10} fontWeight={500} fill="var(--muted-foreground)">DAG 기반 (Bullshark)</text>
      {phases.map((p, i) => {
        const px = x; x += p.w + 4;
        return (
          <motion.g key={i} {...slide(0.1 + i * 0.15)}>
            <rect x={px} y={22} width={p.w} height={24} rx={3} fill={`${p.c}15`} stroke={p.c} strokeWidth={0.8} />
            <text x={px + p.w / 2} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={p.c}>{p.label}</text>
          </motion.g>
        );
      })}
      <motion.g {...fade(1.0)}>
        <text x={220} y={64} textAnchor="middle" fontSize={10} fill={CA}>
          복구 빠르지만 정상 시에도 항상 높은 지연
        </text>
      </motion.g>
    </svg>
  );
}

export function AutobahnBlipStep() {
  const phases = [
    { label: '정상 (저지연)', w: 120, c: CE },
    { label: 'Blip', w: 30, c: CR },
    { label: '즉시 복구', w: 50, c: CE },
    { label: '정상 (저지연)', w: 120, c: CE },
  ];
  let x = 15;
  return (
    <svg viewBox="0 0 440 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={10} fontWeight={600} fill={CV}>Autobahn</text>
      {phases.map((p, i) => {
        const px = x; x += p.w + 4;
        return (
          <motion.g key={i} {...slide(0.1 + i * 0.15)}>
            <rect x={px} y={22} width={p.w} height={24} rx={3} fill={`${p.c}15`} stroke={p.c} strokeWidth={0.8} />
            <text x={px + p.w / 2} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={p.c}>{p.label}</text>
          </motion.g>
        );
      })}
      <motion.g {...fade(0.8)}>
        <rect x={15} y={54} width={320} height={28} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.5} />
        <text x={175} y={66} textAnchor="middle" fontSize={10} fill={CV}>Highway만 일시 중단</text>
        <text x={175} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Lanes 데이터는 이미 전파됨 → Hangover 없음
        </text>
      </motion.g>
    </svg>
  );
}
