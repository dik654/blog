import { motion } from 'framer-motion';
import StepViz from './StepViz';

const CP = '#6366f1';
const CR = '#0ea5e9';
const CB = '#10b981';

const STEPS = [
  { label: 'MEV-Boost 도입 배경: 검증자 직접 빌드의 한계', body: '검증자가 직접 블록을 빌드하면 차익거래·liquidation·backrun 등 MEV(Maximal Extractable Value)를 최대화하기 어렵습니다. 전문 빌더들이 이 기회를 포착해 더 높은 BlockValue를 제안합니다.' },
  { label: 'getHeader: 빌더들이 relay로 최고가 bid를 전송합니다', body: 'mev-boost 클라이언트가 등록된 모든 relay에 getHeader를 요청합니다. Builder들은 서로 경쟁하며 highest BlockValue를 제안합니다. Bid 패킷이 Builder → Relay → MEV-Boost로 흘러갑니다.' },
  { label: '로컬 빌드 vs 외부 빌더: BlockValue 비교 후 선택', body: 'mev-boost가 받은 최고가 헤더와 로컬 빌드의 예상 BlockValue를 비교합니다. 외부 빌더의 제안이 더 높으면 채택하고, 낮으면 로컬 블록을 사용합니다(local fallback).' },
  { label: 'BlindedBeaconBlock 서명: 돌이킬 수 없는 선택', body: '실행 페이로드 없이 헤더만 포함한 BlindedBeaconBlock에 BLS 서명합니다. 서명이 공개된 이상 다른 블록에 서명하면 Proposer Slashing 대상입니다. 이 비가역성이 릴레이와의 신뢰를 대체합니다.' },
  { label: 'Unblind & 전파: Relay가 완전한 페이로드를 공개합니다', body: '제안자가 서명된 블라인드 블록을 relay에 전송하면, relay가 완전한 실행 페이로드를 공개합니다. CL이 완전한 블록을 조립하고 gossipsub으로 전파합니다.' },
];

// ── Vertical layout (top → bottom): Proposer → MEV-Boost → Relays → Builders ─
const P  = { x: 190, y: 44 };
const M  = { x: 190, y: 134 };
const R  = [{ x: 108, y: 220 }, { x: 272, y: 220 }];
const B  = [{ x: 50,  y: 300 }, { x: 150, y: 300 }, { x: 296, y: 300 }];

// BID arrivals: stagger x so B[0] and B[1] (both going to R[0]) don't overlap
const BID = [
  { b: 0, r: 0, dx: 88,  dy: 238, delay: 0 },      // B1 → R1 left portion
  { b: 1, r: 0, dx: 128, dy: 238, delay: 0.14 },   // B2 → R1 right portion (40px apart)
  { b: 2, r: 1, dx: 272, dy: 238, delay: 0.07 },   // B3 → R2 center
];
// TOP arrivals: offset x at M so R[0] and R[1] packets don't overlap
const TOP = [
  { r: 0, dx: 170, dy: 152, delay: 0.45 },  // R1 → M left
  { r: 1, dx: 210, dy: 152, delay: 0.57 },  // R2 → M right (40px apart)
];

function Actor({ x, y, label, sub, color, dim }: {
  x: number; y: number; label: string; sub: string; color: string; dim: boolean;
}) {
  return (
    <g opacity={dim ? 0.28 : 1}>
      <rect x={x - 34} y={y - 18} width={68} height={36} rx={7}
        fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y - 4} textAnchor="middle" fontSize={9} fontWeight="700" fill={color}>{label}</text>
      <text x={x} y={y + 9} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">{sub}</text>
    </g>
  );
}

function Pkt({ sx, sy, dx, dy, color, show, delay = 0, label }: {
  sx: number; sy: number; dx: number; dy: number;
  color: string; show: boolean; delay?: number; label: string;
}) {
  return (
    <motion.g
      animate={show ? { x: dx - sx, y: dy - sy } : { x: 0, y: 0 }}
      initial={{ x: 0, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.2, delay }}>
      <motion.g animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.2, delay }}>
        <rect x={sx - 18} y={sy - 9} width={36} height={18} rx={4}
          fill={`${color}33`} stroke={color} strokeWidth={1.5} />
        <text x={sx} y={sy + 4} textAnchor="middle" fontSize={7} fontWeight="700" fill={color}>{label}</text>
      </motion.g>
    </motion.g>
  );
}

export default function MEVBoostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 338" className="w-full max-w-[380px]" style={{ height: 'auto' }}>

          {/* Connection lines */}
          {step >= 1 && <>
            {/* P ↔ M */}
            <line x1={P.x} y1={P.y + 18} x2={M.x} y2={M.y - 18}
              stroke={CR} strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
            {/* M ↔ Relays */}
            <line x1={M.x} y1={M.y + 18} x2={R[0].x} y2={R[0].y - 18}
              stroke={CR} strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
            <line x1={M.x} y1={M.y + 18} x2={R[1].x} y2={R[1].y - 18}
              stroke={CR} strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
            {/* Relays ↔ Builders */}
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

          {/* Step 1: BID packets (Builder → Relay, staggered arrivals) */}
          {step === 1 && BID.map((cfg, i) => (
            <Pkt key={i}
              sx={B[cfg.b].x} sy={B[cfg.b].y - 18}
              dx={cfg.dx}     dy={cfg.dy}
              color={CB} show delay={cfg.delay} label="BID" />
          ))}
          {/* Step 1: TOP packets (Relay → MEV-Boost, staggered arrivals) */}
          {step === 1 && TOP.map((cfg, i) => (
            <Pkt key={i}
              sx={R[cfg.r].x} sy={R[cfg.r].y - 18}
              dx={cfg.dx}     dy={cfg.dy}
              color={CR} show delay={cfg.delay} label="TOP" />
          ))}

          {/* Step 2: BlockValue comparison bar */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={20} y={168} fontSize={8} fill="hsl(var(--muted-foreground))">BlockValue 비교</text>
              {/* Local */}
              <rect x={20} y={177} width={10} height={14} rx={2} fill={`${CP}44`} stroke={CP} strokeWidth={1.5} />
              <text x={25} y={202} textAnchor="middle" fontSize={7} fill={CP}>로컬</text>
              {/* Builder — animates wider */}
              <motion.rect x={38} y={177} width={0} height={14} rx={2} fill={`${CB}44`} stroke={CB} strokeWidth={1.5}
                animate={{ width: 48 }} transition={{ duration: 0.5 }} />
              <motion.text x={62} y={202} textAnchor="middle" fontSize={7} fill={CB}
                animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.5 }}>
                Builder ✓
              </motion.text>
            </motion.g>
          )}

          {/* Step 3: Blinded header flies M → just below P box */}
          {step === 3 && (
            <Pkt sx={M.x} sy={M.y - 18} dx={P.x} dy={P.y + 28} color="#f59e0b" show label="🔒HDR" />
          )}

          {/* Step 4: Full payload flies M → just below P box */}
          {step === 4 && (
            <Pkt sx={M.x} sy={M.y - 18} dx={P.x} dy={P.y + 28} color="#22c55e" show label="PAYLOAD" />
          )}
        </svg>
      )}
    </StepViz>
  );
}
