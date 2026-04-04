import { motion } from 'framer-motion';

const C = { g2: '#10b981', tw: '#f59e0b', big: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Core insight: twist = compression from Fp12 → Fp2 */
export default function TwistExplain({ delay = 0 }: { delay?: number }) {
  return (
    <g>
      {/* Without twist: G2 needs Fp12 */}
      <motion.g {...fade(delay)}>
        <rect x={20} y={238} width={240} height={68} rx={6}
          fill={`${C.big}08`} stroke={`${C.big}25`} strokeWidth={0.6} />
        <text x={36} y={258} fontSize={11} fontWeight={600} fill={C.big}>twist 없이 G2를 쓰면</text>
        <text x={36} y={278} fontSize={11} fill={C.m}>좌표가 Fp¹² 원소</text>
        <text x={36} y={296} fontSize={11} fill={C.big}>점 1개 = Fp 원소 24개</text>
      </motion.g>

      {/* With twist: compressed to Fp2 */}
      <motion.g {...fade(delay + 0.3)}>
        <rect x={280} y={238} width={240} height={68} rx={6}
          fill={`${C.g2}10`} stroke={`${C.g2}30`} strokeWidth={0.6} />
        <text x={296} y={258} fontSize={11} fontWeight={600} fill={C.g2}>twist로 압축하면</text>
        <text x={296} y={278} fontSize={11} fill={C.m}>좌표가 Fp² 원소</text>
        <text x={296} y={296} fontSize={11} fill={C.g2}>점 1개 = Fp 원소 4개 (6배 절감)</text>
      </motion.g>

      {/* Arrow: compression */}
      <motion.g {...fade(delay + 0.2)}>
        <line x1={262} y1={272} x2={278} y2={272} stroke={C.tw} strokeWidth={1} />
        <polygon points="278,269 284,272 278,275" fill={C.tw} />
      </motion.g>

      {/* Bottom: key message */}
      <motion.g {...fade(delay + 0.6)}>
        <rect x={20} y={318} width={500} height={48} rx={6}
          fill={`${C.tw}08`} stroke={`${C.tw}20`} strokeWidth={0.5} />
        <text x={270} y={338} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.tw}>
          twist = Fp¹²에 사는 점을 Fp²로 압축하는 좌표 변환
        </text>
        <text x={270} y={358} textAnchor="middle" fontSize={11} fill={C.m}>
          군 구조(점 덧셈, 위수)는 동일. 표현만 6배 작아짐. 역변환(untwist) 가능
        </text>
      </motion.g>
    </g>
  );
}
