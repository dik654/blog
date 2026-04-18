import { motion } from 'framer-motion';
import { C } from './TransformerDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: ViT 구조 ---- */
export function ViTStructure() {
  const stages = [
    { label: 'Patch Split', sub: '16x16 → 196', color: C.vit },
    { label: 'Linear Proj', sub: '768 → D', color: C.vit },
    { label: '+ PosEmb', sub: '[CLS] prepend', color: C.warn },
    { label: 'Encoder xL', sub: 'MHSA + MLP', color: C.hybrid },
    { label: '[CLS]→FC', sub: '분류 출력', color: C.cnn },
  ];

  const models = [
    { name: 'ViT-B/16', layers: 12, dim: 768, params: '86M' },
    { name: 'ViT-L/16', layers: 24, dim: 1024, params: '307M' },
    { name: 'ViT-H/14', layers: 32, dim: 1280, params: '632M' },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Vision Transformer 파이프라인</text>

      {/* pipeline */}
      {stages.map((s, i) => {
        const x = 10 + i * 94;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={x} y={24} width={86} height={38} rx={7}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={1} />
            <text x={x + 43} y={40} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={s.color}>{s.label}</text>
            <text x={x + 43} y={54} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">{s.sub}</text>
            {i < stages.length - 1 && (
              <line x1={x + 88} y1={43} x2={x + 92} y2={43}
                stroke={C.dim} strokeWidth={0.8} markerEnd="url(#vtArrow)" />
            )}
          </motion.g>
        );
      })}

      {/* model table */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={10} y={72} width={280} height={80} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={88} fontSize={9} fontWeight={700} fill="var(--foreground)">모델</text>
        <text x={100} y={88} fontSize={9} fontWeight={700} fill="var(--foreground)">층 수</text>
        <text x={150} y={88} fontSize={9} fontWeight={700} fill="var(--foreground)">차원</text>
        <text x={210} y={88} fontSize={9} fontWeight={700} fill="var(--foreground)">파라미터</text>
        <line x1={15} y1={92} x2={285} y2={92} stroke="var(--border)" strokeWidth={0.5} />
        {models.map((m, i) => (
          <g key={i}>
            <text x={20} y={106 + i * 16} fontSize={9} fontWeight={600}
              fill={C.vit}>{m.name}</text>
            <text x={100} y={106 + i * 16} fontSize={9}
              fill="var(--foreground)">{m.layers}</text>
            <text x={150} y={106 + i * 16} fontSize={9}
              fill="var(--foreground)">{m.dim}</text>
            <text x={210} y={106 + i * 16} fontSize={9} fontWeight={600}
              fill={C.vit}>{m.params}</text>
          </g>
        ))}
      </motion.g>

      {/* CNN vs ViT note */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={310} y={72} width={160} height={80} rx={6}
          fill={C.warn} fillOpacity={0.06} stroke={C.warn} strokeWidth={0.8} />
        <text x={320} y={90} fontSize={9} fontWeight={700} fill={C.warn}>주의사항</text>
        <text x={320} y={106} fontSize={8} fill="var(--muted-foreground)">
          대규모 데이터 필요
        </text>
        <text x={320} y={120} fontSize={8} fill="var(--muted-foreground)">
          소규모 → CNN이 유리
        </text>
        <text x={320} y={134} fontSize={8} fill="var(--muted-foreground)">
          위치 정보 명시 필요
        </text>
        <text x={320} y={148} fontSize={8} fill="var(--muted-foreground)">
          JFT-300M 수준 필요
        </text>
      </motion.g>

      <defs>
        <marker id="vtArrow" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.dim} />
        </marker>
      </defs>
    </g>
  );
}

/* ---- Step 1: 하이브리드 & 최신 동향 ---- */
export function HybridTrends() {
  const models = [
    { name: 'Swin', year: '2021', desc: '계층적 + window attention', color: C.hybrid },
    { name: 'CoAtNet', year: '2021', desc: 'MBConv + Transformer', color: C.hybrid },
    { name: 'ConvNeXt', year: '2022', desc: 'CNN에 Transformer 설계', color: C.cnn },
    { name: 'MaxViT', year: '2022', desc: 'Block + Grid attention', color: C.vit },
  ];

  const benchmarks = [
    { name: 'EVA-02', type: 'ViT', acc: '89.6%', color: C.vit },
    { name: 'InternImage', type: 'CNN', acc: '89.6%', color: C.cnn },
    { name: 'ConvNeXt-V2', type: 'CNN', acc: '88.9%', color: C.cnn },
  ];

  return (
    <g>
      <text x={120} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">하이브리드 모델</text>

      {models.map((m, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.08 }}>
          <rect x={10} y={22 + i * 26} width={220} height={22} rx={5}
            fill={`${m.color}08`} stroke={m.color} strokeWidth={0.8} />
          <text x={20} y={37 + i * 26} fontSize={9} fontWeight={700}
            fill={m.color}>{m.name}</text>
          <text x={70} y={37 + i * 26} fontSize={8}
            fill={C.dim}>({m.year})</text>
          <text x={110} y={37 + i * 26} fontSize={8}
            fill="var(--muted-foreground)">{m.desc}</text>
        </motion.g>
      ))}

      {/* Benchmarks */}
      <text x={370} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">ImageNet SOTA (2024)</text>

      {benchmarks.map((b, i) => {
        const bw = parseFloat(b.acc) * 1.6;
        return (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}>
            <text x={260} y={36 + i * 24} fontSize={9} fontWeight={600}
              fill={b.color}>{b.name}</text>
            <motion.rect x={340} y={26 + i * 24} width={bw} height={14} rx={3}
              fill={b.color} fillOpacity={0.5}
              initial={{ width: 0 }} animate={{ width: bw }}
              transition={{ ...sp, delay: 0.4 + i * 0.1 }} />
            <text x={340 + bw + 4} y={37 + i * 24} fontSize={9}
              fontWeight={700} fill={b.color}>{b.acc}</text>
            <rect x={340 + bw + 40} y={26 + i * 24} width={30} height={14} rx={7}
              fill={b.color} fillOpacity={0.1} />
            <text x={340 + bw + 55} y={36 + i * 24} textAnchor="middle"
              fontSize={7} fill={b.color}>{b.type}</text>
          </motion.g>
        );
      })}

      {/* conclusion */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={10} y={156 - 28} width={460} height={24} rx={12}
          fill={C.hybrid} fillOpacity={0.08} stroke={C.hybrid} strokeWidth={1} />
        <text x={240} y={148} textAnchor="middle" fontSize={10} fontWeight={700}
          fill={C.hybrid}>CNN/Transformer 이분법은 깨짐 — 설계 원리 상호 수렴</text>
      </motion.g>
    </g>
  );
}
