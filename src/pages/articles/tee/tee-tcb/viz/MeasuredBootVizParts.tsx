import { motion } from 'framer-motion';
import { C } from './MeasuredBootVizData';

export const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Box({ x, y, w, h, label, color }: { x: number; y: number; w: number; h: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={`${color}18`} stroke={color} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fill={color} fontWeight={600}>{label}</text>
    </g>
  );
}

export function Arrow({ x1, y1, x2, y2, color, label }: { x1: number; y1: number; x2: number; y2: number; color: string; label?: string }) {
  const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2;
  return (
    <g>
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2}
        markerEnd="url(#arrowM)" {...fade(0.3)} />
      {label && (
        <g>
          <rect x={mx - 28} y={my - 8} width={56} height={14} rx={3} fill="var(--card)" />
          <text x={mx} y={my + 3} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{label}</text>
        </g>
      )}
    </g>
  );
}

export function BootChainStep() {
  const stages = ['Boot ROM', 'BIOS/UEFI', 'Bootloader', 'OS Kernel', 'App'];
  const sx = 20; const gap = 92; const bw = 80; const bh = 30; const cy = 50;
  return (
    <g>
      <defs><marker id="arrowM" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={6} markerHeight={6} orient="auto"><path d="M0,0 L6,3 L0,6Z" fill={C.main} /></marker></defs>
      <text x={sx} y={18} fontSize={11} fill="var(--foreground)" fontWeight={700}>측정 부팅 체인</text>
      {stages.map((s, i) => {
        const x = sx + i * gap;
        return (
          <motion.g key={s} {...fade(i * 0.12)}>
            <Box x={x} y={cy} w={bw} h={bh} label={s} color={i === 0 ? C.hash : C.main} />
            {i < stages.length - 1 && (
              <Arrow x1={x + bw + 2} y1={cy + bh / 2} x2={x + gap - 2} y2={cy + bh / 2} color={C.main} label="측정→실행" />
            )}
          </motion.g>
        );
      })}
      <motion.text {...fade(0.6)} x={sx} y={cy + bh + 22} fontSize={10} fill="var(--muted-foreground)">
        Root of Trust (변경 불가)
      </motion.text>
    </g>
  );
}
