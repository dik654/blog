import { motion } from 'framer-motion';
import { C } from './BiasDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: Receptive Field 계산 ---- */
export function ReceptiveField() {
  const layers = [
    { n: 1, rf: 3, s: 1 },
    { n: 2, rf: 5, s: 1 },
    { n: 3, rf: 7, s: 1 },
    { n: 4, rf: 9, s: 1 },
    { n: 5, rf: 11, s: 1 },
  ];
  const strided = [
    { n: 1, rf: 3, s: 1, cum: 1 },
    { n: 2, rf: 5, s: 2, cum: 2 },
    { n: 3, rf: 9, s: 1, cum: 2 },
    { n: 4, rf: 13, s: 2, cum: 4 },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Receptive Field: 출력 뉴런이 보는 입력 영역</text>

      {/* Formula */}
      <rect x={10} y={22} width={200} height={24} rx={6}
        fill={C.rf} fillOpacity={0.08} stroke={C.rf} strokeWidth={0.8} />
      <text x={110} y={38} textAnchor="middle" fontSize={9} fontWeight={600}
        fill={C.rf}>{'RF_l = RF_{l-1} + (k-1) x 누적stride'}</text>

      {/* stride=1 bars */}
      <text x={20} y={64} fontSize={9} fontWeight={600} fill="var(--foreground)">
        3x3 conv, stride=1
      </text>
      {layers.map((l, i) => {
        const bw = l.rf * 6;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <text x={20} y={80 + i * 14} fontSize={8} fill={C.dim}>L{l.n}</text>
            <motion.rect x={40} y={72 + i * 14} width={bw} height={10} rx={3}
              fill={C.rf} fillOpacity={0.5}
              initial={{ width: 0 }} animate={{ width: bw }}
              transition={{ ...sp, delay: 0.1 + i * 0.08 }} />
            <text x={44 + bw} y={80 + i * 14} fontSize={8} fontWeight={600}
              fill={C.rf}>RF={l.rf}</text>
          </motion.g>
        );
      })}

      {/* stride=2 bars */}
      <text x={240} y={64} fontSize={9} fontWeight={600} fill="var(--foreground)">
        stride=2 포함
      </text>
      {strided.map((l, i) => {
        const bw = l.rf * 4;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
            <text x={240} y={80 + i * 14} fontSize={8} fill={C.dim}>
              L{l.n}{l.s === 2 ? '(s2)' : ''}
            </text>
            <motion.rect x={280} y={72 + i * 14} width={bw} height={10} rx={3}
              fill={C.warn} fillOpacity={0.5}
              initial={{ width: 0 }} animate={{ width: bw }}
              transition={{ ...sp, delay: 0.35 + i * 0.08 }} />
            <text x={284 + bw} y={80 + i * 14} fontSize={8} fontWeight={600}
              fill={C.warn}>RF={l.rf}</text>
          </motion.g>
        );
      })}

      {/* requirement note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <rect x={240} y={132} width={230} height={20} rx={10}
          fill={C.rf} fillOpacity={0.1} stroke={C.rf} strokeWidth={0.8} />
        <text x={355} y={146} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.rf}>분류용 CNN: RF = 200+ 필요</text>
      </motion.g>
    </g>
  );
}

/* ---- Step 1: Dilated Conv & Depthwise Separable ---- */
export function DilatedAndDepthwise() {
  return (
    <g>
      {/* Left: Dilated Conv */}
      <text x={115} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.dilated}>Dilated Convolution</text>

      {/* dilation=1 */}
      <text x={20} y={34} fontSize={8} fill={C.dim}>d=1</text>
      {[0, 1, 2].map(i => (
        <rect key={`d1-${i}`} x={50 + i * 18} y={24} width={14} height={14} rx={2}
          fill={C.dilated} fillOpacity={0.5} stroke={C.dilated} strokeWidth={0.8} />
      ))}

      {/* dilation=2 */}
      <text x={20} y={58} fontSize={8} fill={C.dim}>d=2</text>
      {[0, 1, 2].map(i => (
        <g key={`d2-${i}`}>
          <rect x={50 + i * 32} y={48} width={14} height={14} rx={2}
            fill={C.dilated} fillOpacity={0.5} stroke={C.dilated} strokeWidth={0.8} />
          {i < 2 && (
            <rect x={50 + i * 32 + 17} y={48} width={12} height={14} rx={2}
              fill="var(--card)" stroke={C.dim} strokeWidth={0.3} strokeDasharray="2 2" />
          )}
        </g>
      ))}

      {/* formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <rect x={10} y={70} width={210} height={30} rx={6}
          fill={C.dilated} fillOpacity={0.06} stroke={C.dilated} strokeWidth={0.8} />
        <text x={115} y={82} textAnchor="middle" fontSize={9} fill={C.dilated} fontWeight={600}>
          유효 크기 = k + (k-1)(d-1)
        </text>
        <text x={115} y={94} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          3x3, d=2 → 유효 5x5, 파라미터 동일
        </text>
      </motion.g>

      {/* usages */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        {['DeepLab (Segmentation)', 'WaveNet (시계열)'].map((u, i) => (
          <g key={i}>
            <rect x={10 + i * 110} y={106} width={100} height={18} rx={9}
              fill={C.dilated} fillOpacity={0.08} stroke={C.dilated} strokeWidth={0.6} />
            <text x={60 + i * 110} y={118} textAnchor="middle" fontSize={8}
              fill={C.dilated}>{u}</text>
          </g>
        ))}
      </motion.g>

      {/* Right: Depthwise Separable */}
      <text x={365} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.dw}>Depthwise Separable</text>

      {/* Step 1: Depthwise */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={250} y={24} width={100} height={36} rx={6}
          fill={C.dw} fillOpacity={0.08} stroke={C.dw} strokeWidth={1} />
        <text x={300} y={38} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.dw}>Depthwise</text>
        <text x={300} y={52} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">k x k x C_in</text>
      </motion.g>

      {/* arrow */}
      <motion.line x1={350} y1={42} x2={370} y2={42}
        stroke={C.dim} strokeWidth={0.8} markerEnd="url(#biasArrow)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }} />

      {/* Step 2: Pointwise */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={370} y={24} width={100} height={36} rx={6}
          fill={C.dw} fillOpacity={0.08} stroke={C.dw} strokeWidth={1} />
        <text x={420} y={38} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.dw}>Pointwise</text>
        <text x={420} y={52} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">1x1 x C_in x C_out</text>
      </motion.g>

      {/* Comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={245} y={70} width={235} height={56} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={86} fontSize={9} fontWeight={600} fill={C.fc || '#ef4444'}>
          일반 Conv
        </text>
        <text x={260} y={100} fontSize={7} fill="var(--muted-foreground)">
          k²·Cᵢₙ·Cₒᵤₜ
        </text>
        <line x1={365} y1={74} x2={365} y2={122} stroke="var(--border)" strokeWidth={0.5} />
        <text x={375} y={86} fontSize={9} fontWeight={600} fill={C.dw}>
          Separable
        </text>
        <text x={375} y={100} fontSize={7} fill="var(--muted-foreground)">
          k²·Cᵢₙ + Cᵢₙ·Cₒᵤₜ
        </text>
        <rect x={266} y={108} width={190} height={14} rx={7}
          fill={C.dw} fillOpacity={0.1} />
        <text x={360} y={119} textAnchor="middle" fontSize={9} fontWeight={700}
          fill={C.dw}>3x3, 128ch → 약 9배 절감</text>
      </motion.g>

      {/* MobileNet/EfficientNet badge */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <rect x={280} y={134} width={160} height={18} rx={9}
          fill={C.dw} fillOpacity={0.12} stroke={C.dw} strokeWidth={0.8} />
        <text x={360} y={146} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.dw}>MobileNet / EfficientNet 핵심</text>
      </motion.g>

      <defs>
        <marker id="biasArrow" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.dim} />
        </marker>
      </defs>
    </g>
  );
}
