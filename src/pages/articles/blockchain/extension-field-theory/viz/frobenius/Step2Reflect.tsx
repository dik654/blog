import { useState } from 'react';
import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const C = { base: '#6366f1', conj: '#f59e0b', m: 'var(--muted-foreground)' };

export default function Step2Reflect() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(5);
  const cx = 150, cy = 120, s = 38;
  const px = cx + a * s / 3;
  const py = cy - b * s / 3;
  const bC = (7 - b) % 7;
  const pyC = cy - bC * s / 3;

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-3 px-1">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          a = <input type="range" min={0} max={6} value={a}
            onChange={e => setA(+e.target.value)} className="w-24 accent-[#6366f1]" />
          <span className="w-4 text-foreground font-semibold">{a}</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          b = <input type="range" min={0} max={6} value={b}
            onChange={e => setB(+e.target.value)} className="w-24 accent-[#6366f1]" />
          <span className="w-4 text-foreground font-semibold">{b}</span>
        </label>
      </div>
      <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* 그리드 */}
        {Array.from({ length: 7 }).map((_, i) =>
          Array.from({ length: 7 }).map((_, j) => (
            <circle key={`${i}${j}`} cx={cx + i * s / 3} cy={cy - j * s / 3}
              r={2.5} fill={`${C.base}30`} />
          ))
        )}
        {/* 축 */}
        <line x1={cx - 10} y1={cy} x2={cx + 7 * s / 3 + 6} y2={cy}
          stroke={`${C.base}25`} strokeWidth={0.7} />
        <line x1={cx} y1={cy + 10} x2={cx} y2={cy - 7 * s / 3 - 6}
          stroke={`${C.base}25`} strokeWidth={0.7} />
        <text x={cx + 7 * s / 3 + 10} y={cy + 4} fontSize={10} fill={C.base}>a</text>
        <text x={cx + 5} y={cy - 7 * s / 3 - 8} fontSize={10} fill={C.base}>bu</text>

        {/* 반사축 */}
        <line x1={cx - 10} y1={cy} x2={cx + 7 * s / 3 + 6} y2={cy}
          stroke={`${C.conj}30`} strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={cx + 7 * s / 3 + 10} y={cy + 16} fontSize={9} fill={C.conj}>반사축 (a축)</text>

        {/* 원본 점+라벨 */}
        <motion.g animate={{ x: px - cx, y: py - cy }} transition={sp}>
          <circle cx={cx} cy={cy} r={7} fill={C.base} />
          <text x={cx + 12} y={cy - 8} fontSize={12} fontWeight={600} fill={C.base}>
            {a} + {b}u
          </text>
        </motion.g>

        {/* 연결선 */}
        <motion.line x1={px} y1={py} x2={px} y2={pyC}
          stroke={`${C.conj}40`} strokeWidth={1} strokeDasharray="3 2"
          animate={{ x1: px, y1: py, x2: px, y2: pyC }} transition={sp} />

        {/* 켤레 점+라벨 */}
        <motion.g animate={{ x: px - cx, y: pyC - cy }} transition={sp}>
          <circle cx={cx} cy={cy} r={7} fill={C.conj} />
          <text x={cx + 12} y={cy + 18} fontSize={12} fontWeight={600} fill={C.conj}>
            {a} + {bC}u = {a} − {b}u
          </text>
        </motion.g>

        {/* 오른쪽 요약 */}
        <text x={370} y={46} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.base}>
          기하학적 의미
        </text>
        <rect x={305} y={56} width={130} height={34} rx={5}
          fill={`${C.base}12`} stroke={`${C.base}30`} strokeWidth={0.5} />
        <text x={370} y={78} textAnchor="middle" fontSize={11} fill={C.base}>
          a축에 대한 반사
        </text>
        <rect x={305} y={100} width={130} height={34} rx={5}
          fill={`${C.conj}12`} stroke={`${C.conj}30`} strokeWidth={0.5} />
        <text x={370} y={118} textAnchor="middle" fontSize={10} fill={C.conj}>
          ℂ: a+bi → a−bi
        </text>
        <text x={370} y={130} textAnchor="middle" fontSize={10} fill={C.m}>
          와 동일 구조
        </text>

      </svg>
      <p className="text-sm text-muted-foreground mt-3 text-center">
        슬라이더로 a, b를 바꿔보세요
      </p>
    </div>
  );
}
