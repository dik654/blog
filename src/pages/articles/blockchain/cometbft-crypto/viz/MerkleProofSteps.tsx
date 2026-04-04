import { motion } from 'framer-motion';
import { C } from './MerkleProofVizData';

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { delay: d },
});

export function StepBuildTree() {
  const items = ['A', 'B', 'C', 'D'];
  return (<g>
    {items.map((it, i) => (
      <motion.g key={it} {...fade(i * 0.08)}>
        <rect x={30 + i * 95} y={70} width={65} height={22} rx={11}
          fill={`${C.leaf}12`} stroke={C.leaf} strokeWidth={0.7} />
        <text x={62 + i * 95} y={85} textAnchor="middle"
          fontSize={10} fill={C.leaf}>leaf({it})</text>
      </motion.g>
    ))}
    <motion.g {...fade(0.4)}>
      <rect x={75} y={40} width={80} height={20} rx={10}
        fill={`${C.inner}12`} stroke={C.inner} strokeWidth={0.6} />
      <text x={115} y={54} textAnchor="middle"
        fontSize={10} fill={C.inner}>inner(A,B)</text>
      <rect x={265} y={40} width={80} height={20} rx={10}
        fill={`${C.inner}12`} stroke={C.inner} strokeWidth={0.6} />
      <text x={305} y={54} textAnchor="middle"
        fontSize={10} fill={C.inner}>inner(C,D)</text>
    </motion.g>
    {[[62,70,100,60],[157,70,130,60],[252,70,290,60],[347,70,320,60]].map(
      ([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--border)" strokeWidth={0.5} />
      )
    )}
    <motion.g {...fade(0.7)}>
      <rect x={160} y={10} width={100} height={22} rx={11}
        fill={`${C.root}15`} stroke={C.root} strokeWidth={1} />
      <text x={210} y={25} textAnchor="middle" fontSize={11}
        fontWeight={600} fill={C.root}>Root</text>
    </motion.g>
    <line x1={115} y1={40} x2={195} y2={32}
      stroke="var(--border)" strokeWidth={0.5} />
    <line x1={305} y1={40} x2={225} y2={32}
      stroke="var(--border)" strokeWidth={0.5} />
  </g>);
}

export function StepVerifyProof() {
  const items = ['A', 'B', 'C', 'D'];
  return (<g>
    {items.map((it, i) => (
      <rect key={it} x={30 + i * 95} y={70} width={65} height={22} rx={11}
        fill={i === 2 ? `${C.proof}18` : `${C.leaf}08`}
        stroke={i === 2 ? C.proof : C.leaf}
        strokeWidth={i === 2 ? 1.2 : 0.4} />
    ))}
    {items.map((it, i) => (
      <text key={`t${it}`} x={62 + i * 95} y={85} textAnchor="middle"
        fontSize={10} fill={i === 2 ? C.proof : 'var(--muted-foreground)'}>{it}</text>
    ))}
    <motion.rect x={265} y={40} width={80} height={20} rx={10}
      fill={`${C.proof}15`} stroke={C.proof} strokeWidth={1} {...fade(0.3)} />
    <text x={305} y={54} textAnchor="middle" fontSize={10} fill={C.proof}>inner(C,D)</text>
    <motion.rect x={315} y={70} width={65} height={22} rx={11}
      fill={`${C.inner}20`} stroke={C.inner} strokeWidth={1.2} {...fade(0.5)} />
    <text x={347} y={85} textAnchor="middle" fontSize={10} fill={C.inner}>D (aunt)</text>
    <motion.rect x={75} y={40} width={80} height={20} rx={10}
      fill={`${C.inner}20`} stroke={C.inner} strokeWidth={1.2} {...fade(0.7)} />
    <text x={115} y={54} textAnchor="middle" fontSize={10} fill={C.inner}>H(A,B) aunt</text>
    <rect x={160} y={10} width={100} height={22} rx={11}
      fill={`${C.root}15`} stroke={C.root} strokeWidth={1} />
    <text x={210} y={25} textAnchor="middle" fontSize={11}
      fontWeight={600} fill={C.root}>Root 복원</text>
    <line x1={115} y1={40} x2={195} y2={32} stroke="var(--border)" strokeWidth={0.5} />
    <line x1={305} y1={40} x2={225} y2={32} stroke="var(--border)" strokeWidth={0.5} />
  </g>);
}
