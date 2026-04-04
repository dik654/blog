import { motion } from 'framer-motion';
import StepViz from './StepViz';
import { CP, CR, CB, STEPS, P, M, R, B, BID, TOP } from './MEVBoostVizData';
import { Actor, Pkt } from './MEVBoostVizParts';

export default function MEVBoostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 338" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* Connection lines */}
          {step >= 1 && <>
            <line x1={P.x} y1={P.y + 18} x2={M.x} y2={M.y - 18}
              stroke={CR} strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
            <line x1={M.x} y1={M.y + 18} x2={R[0].x} y2={R[0].y - 18}
              stroke={CR} strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
            <line x1={M.x} y1={M.y + 18} x2={R[1].x} y2={R[1].y - 18}
              stroke={CR} strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
            <line x1={R[0].x} y1={R[0].y + 18} x2={B[0].x} y2={B[0].y - 18}
              stroke={CB} strokeWidth={1} strokeDasharray="4 3" opacity={0.25} />
            <line x1={R[0].x} y1={R[0].y + 18} x2={B[1].x} y2={B[1].y - 18}
              stroke={CB} strokeWidth={1} strokeDasharray="4 3" opacity={0.25} />
            <line x1={R[1].x} y1={R[1].y + 18} x2={B[2].x} y2={B[2].y - 18}
              stroke={CB} strokeWidth={1} strokeDasharray="4 3" opacity={0.25} />
          </>}

          {/* Actors */}
          <Actor x={P.x}    y={P.y}    label="Proposer"   sub="VC"         color={CP} dim={false} />
          <Actor x={M.x}    y={M.y}    label="MEV-Boost"  sub="middleware" color={CR} dim={step < 1} />
          <Actor x={R[0].x} y={R[0].y} label="Relay 1"   sub="trusted"    color={CR} dim={step < 1} />
          <Actor x={R[1].x} y={R[1].y} label="Relay 2"   sub="trusted"    color={CR} dim={step < 1} />
          <Actor x={B[0].x} y={B[0].y} label="Builder 1" sub="高MEV"      color={CB} dim={step < 1} />
          <Actor x={B[1].x} y={B[1].y} label="Builder 2" sub="高MEV"      color={CB} dim={step < 1} />
          <Actor x={B[2].x} y={B[2].y} label="Builder 3" sub="高MEV"      color={CB} dim={step < 1} />

          {/* Step 1: BID packets */}
          {step === 1 && BID.map((cfg, i) => (
            <Pkt key={i} sx={B[cfg.b].x} sy={B[cfg.b].y - 18}
              dx={cfg.dx} dy={cfg.dy} color={CB} show delay={cfg.delay} label="BID" />
          ))}
          {step === 1 && TOP.map((cfg, i) => (
            <Pkt key={i} sx={R[cfg.r].x} sy={R[cfg.r].y - 18}
              dx={cfg.dx} dy={cfg.dy} color={CR} show delay={cfg.delay} label="TOP" />
          ))}

          {/* Step 2: BlockValue comparison bar */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={20} y={162} fontSize={9} fill="var(--muted-foreground)">BlockValue 비교</text>
              <rect x={20} y={170} width={10} height={14} rx={2} fill={`${CP}44`} stroke={CP} strokeWidth={1.5} />
              <text x={25} y={196} textAnchor="middle" fontSize={9} fill={CP}>로컬</text>
              <text x={33} y={180} fontSize={8} fill={CP} fontFamily="monospace">0.005</text>
              <motion.rect x={38} y={170} width={0} height={14} rx={2} fill={`${CB}44`} stroke={CB} strokeWidth={1.5}
                animate={{ width: 60 }} transition={{ duration: 0.5 }} />
              <motion.text x={68} y={180} fontSize={8} fill={CB} fontFamily="monospace"
                animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.3 }}>
                0.0312 ETH
              </motion.text>
              <motion.text x={68} y={196} textAnchor="middle" fontSize={9} fill={CB}
                animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.5 }}>
                Builder ✓ (6x)
              </motion.text>
            </motion.g>
          )}

          {/* Step 3: Blinded header */}
          {step === 3 && (
            <Pkt sx={M.x} sy={M.y - 18} dx={P.x} dy={P.y + 28} color="#f59e0b" show label="🔒HDR" />
          )}

          {/* Step 4: Full payload */}
          {step === 4 && (
            <Pkt sx={M.x} sy={M.y - 18} dx={P.x} dy={P.y + 28} color="#22c55e" show label="PAYLOAD" />
          )}
        </svg>
      )}
    </StepViz>
  );
}
