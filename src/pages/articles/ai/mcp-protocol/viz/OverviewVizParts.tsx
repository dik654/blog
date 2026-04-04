import { motion } from 'framer-motion';
import { LLMS, TOOLS } from './OverviewData';

const W = 460;

/** Step 0: N×M crossing lines between LLMs and Tools */
export function NxMLines() {
  return (
    <>
      {LLMS.map((l) =>
        TOOLS.map((t) => (
          <motion.line key={`${l.label}-${t.label}`}
            x1={l.x + 56} y1={44} x2={t.x} y2={44}
            stroke="#ef444480" strokeWidth={0.7} strokeDasharray="3 2"
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
        ))
      )}
      <motion.text x={W / 2} y={80} textAnchor="middle"
        fontSize={9} fill="#ef4444" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
        N × M = 9개 커넥터 필요
      </motion.text>
    </>
  );
}

/** Step 1: USB analogy */
export function USBAnalogy() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={150} y={85} width={160} height={50} rx={8}
        fill="#6366f110" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={230} y={108} textAnchor="middle"
        fontSize={10} fontWeight={600} fill="#6366f1">표준 인터페이스</text>
      <text x={230} y={124} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">USB = 장치, MCP = LLM 도구</text>
    </motion.g>
  );
}

/** Step >= 2: MCP layer + rearranged tools at bottom */
export function MCPLayer() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={190} y={90} width={80} height={36} rx={8}
        fill="#10b98120" stroke="#10b981" strokeWidth={2} />
      <text x={230} y={112} textAnchor="middle"
        fontSize={11} fontWeight={700} fill="#10b981">MCP</text>
      {LLMS.map((l) => (
        <line key={`l-${l.label}`} x1={l.x + 28} y1={58} x2={220} y2={90}
          stroke="#6366f1" strokeWidth={1} opacity={0.5} />
      ))}
      {TOOLS.map((t) => (
        <line key={`t-${t.label}`} x1={240} y1={126} x2={t.x + 25} y2={160}
          stroke="#f59e0b" strokeWidth={1} opacity={0.5} />
      ))}
      {TOOLS.map((t) => (
        <motion.g key={`b-${t.label}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x={t.x} y={160} width={50} height={28} rx={5}
            fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
          <text x={t.x + 25} y={178} textAnchor="middle"
            fontSize={9} fontWeight={600} fill="#f59e0b">{t.label}</text>
        </motion.g>
      ))}
      <motion.text x={W / 2} y={210} textAnchor="middle"
        fontSize={9} fill="#10b981" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
        N + M 통합 (3 + 3 = 6개 커넥터)
      </motion.text>
    </motion.g>
  );
}
