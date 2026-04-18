import { motion } from 'framer-motion';
import { C } from './ArchDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export function ArchComparison() {
  const archs = [
    { name: 'LeNet-5', year: 1998, layers: 7, params: '60K', acc: '', color: C.early, innovation: '첫 실용 CNN' },
    { name: 'AlexNet', year: 2012, layers: 8, params: '60M', acc: '57.1%', color: C.early, innovation: 'ReLU + GPU' },
    { name: 'VGG-16', year: 2014, layers: 16, params: '138M', acc: '71.3%', color: C.mid, innovation: '3x3 반복' },
    { name: 'GoogLeNet', year: 2014, layers: 22, params: '7M', acc: '69.8%', color: C.mid, innovation: 'Inception' },
    { name: 'ResNet-50', year: 2015, layers: 50, params: '26M', acc: '76.0%', color: C.res, innovation: 'Skip conn' },
    { name: 'DenseNet', year: 2017, layers: 121, params: '8M', acc: '74.9%', color: C.res, innovation: 'Dense 연결' },
    { name: 'EfficientNet', year: 2019, layers: 0, params: '5.3M', acc: '77.3%', color: C.modern, innovation: 'NAS scaling' },
    { name: 'ConvNeXt-L', year: 2022, layers: 0, params: '198M', acc: '84.3%', color: C.modern, innovation: 'Transformer식' },
  ];

  return (
    <g>
      {/* table header */}
      <text x={10} y={12} fontSize={9} fontWeight={700} fill="var(--foreground)">모델</text>
      <text x={90} y={12} fontSize={9} fontWeight={700} fill="var(--foreground)">연도</text>
      <text x={130} y={12} fontSize={9} fontWeight={700} fill="var(--foreground)">파라미터</text>
      <text x={200} y={12} fontSize={9} fontWeight={700} fill="var(--foreground)">Top-1</text>
      <text x={260} y={12} fontSize={9} fontWeight={700} fill="var(--foreground)">핵심 혁신</text>
      <line x1={5} y1={16} x2={470} y2={16} stroke="var(--border)" strokeWidth={0.5} />

      {archs.map((a, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.06 }}>
          {/* color indicator */}
          <rect x={5} y={21 + i * 17} width={3} height={13} rx={1.5}
            fill={a.color} />
          <text x={14} y={31 + i * 17} fontSize={9} fontWeight={600}
            fill={a.color}>{a.name}</text>
          <text x={90} y={31 + i * 17} fontSize={8}
            fill="var(--muted-foreground)">{a.year}</text>
          <text x={130} y={31 + i * 17} fontSize={8} fontWeight={600}
            fill="var(--foreground)">{a.params}</text>
          <text x={200} y={31 + i * 17} fontSize={8} fontWeight={600}
            fill={a.acc ? a.color : C.dim}>{a.acc || 'N/A'}</text>
          <text x={260} y={31 + i * 17} fontSize={8}
            fill="var(--muted-foreground)">{a.innovation}</text>

          {/* accuracy bar */}
          {a.acc && (
            <motion.rect x={350} y={23 + i * 17} width={parseFloat(a.acc) * 1.2}
              height={10} rx={3} fill={a.color} fillOpacity={0.4}
              initial={{ width: 0 }} animate={{ width: parseFloat(a.acc) * 1.2 }}
              transition={{ ...sp, delay: 0.2 + i * 0.06 }} />
          )}
        </motion.g>
      ))}

      {/* timeline arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <line x1={440} y1={24} x2={440} y2={150}
          stroke={C.dim} strokeWidth={0.8} markerEnd="url(#archArrow)" />
        <text x={450} y={30} fontSize={7} fill={C.dim}>깊이</text>
        <text x={450} y={148} fontSize={7} fill={C.dim}>효율</text>
      </motion.g>

      <defs>
        <marker id="archArrow" viewBox="0 0 6 6" refX={3} refY={5}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,0 L3,6 Z" fill={C.dim} />
        </marker>
      </defs>
    </g>
  );
}
