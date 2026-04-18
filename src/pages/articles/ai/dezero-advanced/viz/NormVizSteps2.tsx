import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './NormVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export function BackwardStep() {
  const gy = [1, 0, 1, 0, 1];
  const xhat = [0.50, -0.92, 1.51, 0.03, -1.12];
  const gx = [0.21, 0.52, 0.30, -0.41, -0.62];
  const cw = 58, startX = 55;
  return (
    <g>
      {/* upstream gradient */}
      <text x={12} y={14} fontSize={8} fontWeight={600} fill={CA}>gy (상위 기울기)</text>
      {gy.map((v, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: i * 0.04 }}>
          <rect x={startX + i * cw} y={4} width={44} height={18} rx={3}
            fill={v ? `${CA}20` : '#88888812'} stroke={v ? CA : '#888888'} strokeWidth={0.6} />
          <text x={startX + i * cw + 22} y={16} textAnchor="middle"
            fontSize={8} fill={v ? CA : '#888888'}>{v}</text>
        </motion.g>
      ))}

      {/* gbeta and ggamma */}
      <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <VizBox x={365} y={4} w={105} h={20}
          label="gbeta = sum(gy) = 3" sub="" c={CE} delay={0.25} />
      </motion.g>

      {/* x_hat row */}
      <text x={12} y={40} fontSize={8} fill={CV}>x_hat</text>
      {xhat.map((v, i) => (
        <motion.g key={`x${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.15 + i * 0.04 }}>
          <rect x={startX + i * cw} y={30} width={44} height={18} rx={3}
            fill={`${CV}12`} stroke={CV} strokeWidth={0.6} />
          <text x={startX + i * cw + 22} y={42} textAnchor="middle"
            fontSize={7} fill={CV}>{v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <VizBox x={365} y={30} w={105} h={20}
          label="ggamma = 0.89" sub="sum(gy*x_hat)" c={CE} delay={0.35} />
      </motion.g>

      {/* computation flow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={12} y={58} width={460} height={36} rx={4}
          fill={`${CV}08`} stroke={CV} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={20} y={72} fontSize={7} fill={CV}>
          g_xhat = gy * gamma = [1, 0, 1, 0, 1]
        </text>
        <text x={20} y={84} fontSize={7} fill={CV}>
          mean_gx = 0.60 | mean_xg = mean(x_hat * g_xhat) = 0.178
        </text>
      </motion.g>

      {/* gx formula */}
      <motion.text x={240} y={108} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={CV}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        gx = (g_xhat - mean_gx - x_hat * mean_xg) / std
      </motion.text>

      {/* output gradient */}
      <text x={12} y={128} fontSize={8} fontWeight={600} fill={CE}>gx (출력 기울기)</text>
      {gx.map((v, i) => (
        <motion.g key={`g${i}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.55 + i * 0.05 }}>
          <rect x={startX + i * cw} y={118} width={44} height={20} rx={3}
            fill={`${CE}20`} stroke={CE} strokeWidth={0.8} />
          <text x={startX + i * cw + 22} y={132} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={CE}>
            {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
          </text>
        </motion.g>
      ))}

      <motion.text x={12} y={155} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        gbeta, ggamma, gx 3개 기울기를 한 번에 계산
      </motion.text>
    </g>
  );
}

export function RefCellCacheStep() {
  return (
    <g>
      {/* forward flow */}
      <VizBox x={20} y={10} w={140} h={30}
        label="forward()" sub="x_hat, std_inv 계산" c={CE} />
      <motion.line x1={90} y1={40} x2={90} y2={55}
        stroke={CE} strokeWidth={0.8} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />

      {/* cache store */}
      <VizBox x={20} y={55} w={140} h={30}
        label="RefCell::borrow_mut()" sub="중간값 저장" c={CA} delay={0.15} />
      <motion.line x1={90} y1={85} x2={90} y2={100}
        stroke={CA} strokeWidth={0.8} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />

      {/* backward */}
      <VizBox x={20} y={100} w={140} h={30}
        label="backward()" sub="저장된 값 재사용" c={CV} delay={0.3} />

      {/* cached fields */}
      <VizBox x={220} y={20} w={180} h={30}
        label="x_hat: RefCell<ArrayD<f64>>"
        sub="정규화된 입력 캐시" c={CV} delay={0.4} />
      <VizBox x={220} y={60} w={180} h={30}
        label="std_inv: RefCell<ArrayD<f64>>"
        sub="1/std 역수 캐시" c={CV} delay={0.48} />

      {/* connection lines */}
      <motion.line x1={160} y1={70} x2={220} y2={35}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.42 }} />
      <motion.line x1={160} y1={70} x2={220} y2={75}
        stroke={CA} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />

      {/* note */}
      <motion.text x={220} y={112} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        재계산 없이 O(1) 접근 -- 메모리 O(D) 트레이드오프
      </motion.text>

      {/* comparison */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={220} y={122} width={180} height={28} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={230} y={137} fontSize={7} fill={CE}>
          캐시 없으면: forward 중 x_hat 재계산 필요
        </text>
        <text x={230} y={147} fontSize={7} fill={CE}>
          캐시 있으면: borrow()로 즉시 접근
        </text>
      </motion.g>
    </g>
  );
}
