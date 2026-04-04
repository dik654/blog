import { motion } from 'framer-motion';
import Step3G2Bottom from './Step3G2Bottom';

const C = { g1: '#6366f1', g2: '#10b981', tw: '#f59e0b', big: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

export default function Step3G2() {
  return (
    <svg viewBox="0 0 540 430" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.g2} {...fade(0)}>G2는 왜, 어떻게 만드는가</motion.text>

      {/* ① 현재 상황 */}
      <motion.g {...fade(0.3)}>
        <rect x={20} y={38} width={500} height={52} rx={6}
          fill={`${C.g1}08`} stroke={`${C.g1}20`} strokeWidth={0.6} />
        <text x={36} y={58} fontSize={12} fontWeight={600} fill={C.g1}>
          ① 현재: E(Fp) 위에 G1만 존재
        </text>
        <text x={36} y={78} fontSize={11} fill={C.m}>
          곡선 E: y²=x³+3. 좌표 (x,y)가 정수(Fp 원소). 이 점들이 G1.
        </text>
      </motion.g>

      {/* ② 좌표 공간을 넓히면 */}
      <motion.g {...fade(0.8)}>
        <rect x={20} y={100} width={500} height={68} rx={6}
          fill={`${C.g2}08`} stroke={`${C.g2}20`} strokeWidth={0.6} />
        <text x={36} y={120} fontSize={12} fontWeight={600} fill={C.g2}>
          ② 같은 곡선 E를 Fp² 좌표로 보면?
        </text>
        <text x={36} y={140} fontSize={11} fill={C.m}>
          좌표를 정수 → a+bu 형태로 허용하면, E를 만족하는 점이 더 많아진다.
        </text>
        <text x={36} y={158} fontSize={11} fill={C.g2}>
          이 추가 점들 중에 위수 r인 부분군이 하나 더 있다 → 이것이 G2 후보.
        </text>
      </motion.g>

      {/* ③ 문제: 직접 쓰면 비쌈 */}
      <motion.g {...fade(1.3)}>
        <rect x={20} y={178} width={500} height={68} rx={6}
          fill={`${C.big}08`} stroke={`${C.big}25`} strokeWidth={0.6} />
        <text x={36} y={198} fontSize={12} fontWeight={600} fill={C.big}>
          ③ 문제: 이 점들을 페어링에 직접 쓰면?
        </text>
        <text x={36} y={218} fontSize={11} fill={C.m}>
          페어링 계산 과정에서 이 점들의 좌표가 Fp¹² 공간으로 확장된다.
        </text>
        <text x={36} y={236} fontSize={11} fill={C.big}>
          점 1개 표현에 Fp 원소 24개 필요 → 연산이 매우 비쌈.
        </text>
      </motion.g>

      {/* ④ 해결: twist */}
      <motion.g {...fade(1.8)}>
        <rect x={20} y={256} width={500} height={86} rx={6}
          fill={`${C.tw}08`} stroke={`${C.tw}25`} strokeWidth={0.6} />
        <text x={36} y={276} fontSize={12} fontWeight={600} fill={C.tw}>
          ④ 해결: twist — 곡선 방정식을 변형
        </text>
        <text x={36} y={296} fontSize={11} fill={C.m}>
          E: y²=x³+3 의 상수를 ξ(Fp² 원소)로 나눠 새 곡선 E': y²=x³+3/ξ 를 만든다.
        </text>
        <text x={36} y={316} fontSize={11} fill={C.m}>
          E' 위의 점들은 좌표가 Fp² 원소. 점 하나 = (x, y) = (a+bu, c+du) = Fp 원소 4개.
        </text>
        <text x={36} y={336} fontSize={11} fill={C.tw}>
          E(Fp²)의 G2 후보와 수학적으로 동일한 군 — 표현만 Fp¹²(24개) → Fp²(4개)로 축소.
        </text>
      </motion.g>

      {/* ⑤ 결론 */}
      <Step3G2Bottom delay={2.4} />
    </svg>
  );
}
