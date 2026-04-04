import { motion } from 'framer-motion';
import { C } from './SszInternalVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.3 },
});

/* ================================================================
   Step 0 — SSZ 인코딩: 5필드 수직 → 수평 concat = 112B, RLP 비교
   ================================================================ */
export function Step0() {
  const fields = [
    { name: 'slot', size: 8, c: C.ssz },
    { name: 'proposer_index', size: 8, c: C.ssz },
    { name: 'parent_root', size: 32, c: C.chunk },
    { name: 'state_root', size: 32, c: C.chunk },
    { name: 'body_root', size: 32, c: C.chunk },
  ];

  /* 수평 바에서 각 필드의 비율 기반 폭 (총 200px = 112B) */
  const barTotal = 200;
  const totalBytes = 112;
  const barX = 135;
  const barY = 30;
  const barH = 22;

  let accX = barX;

  return (
    <g>
      {/* 제목 */}
      <motion.g {...fade(0)}>
        <text x={14} y={14} fontSize={9} fontWeight={700} fill={C.ssz}>
          BeaconBlockHeader
        </text>
        <text x={14} y={26} fontSize={7} fill="var(--muted-foreground)">
          5 fields · Fixed-size
        </text>
      </motion.g>

      {/* 좌측: 수직 필드 목록 */}
      {fields.map((f, i) => {
        const y = 34 + i * 24;
        return (
          <motion.g key={f.name} {...fade(0.1 + i * 0.08)}>
            <rect x={10} y={y} width={100} height={20} rx={4}
              fill={`${f.c}10`} stroke={f.c} strokeWidth={0.6} />
            <text x={18} y={y + 13} fontSize={7.5} fontWeight={600}
              fill={f.c} fontFamily="monospace">{f.name}</text>
            <text x={100} y={y + 13} textAnchor="end"
              fontSize={7} fill="var(--muted-foreground)">{f.size}B</text>
          </motion.g>
        );
      })}

      {/* 화살표: 필드 → 수평 바 */}
      <motion.path
        d="M 115 82 Q 128 82 128 55 L 130 55"
        fill="none" stroke={C.ssz} strokeWidth={0.8}
        markerEnd="url(#arrowSsz)"
        {...drawLine(0.5)}
      />
      <motion.g {...fade(0.45)}>
        <text x={125} y={68} fontSize={7} fill={C.ssz} fontWeight={600}
          transform="rotate(-90, 125, 68)">concat</text>
      </motion.g>

      {/* 수평 인코딩 바: 연결된 결과 */}
      <motion.g {...fade(0.55)}>
        <text x={barX + barTotal / 2} y={barY - 4} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.ssz}>SSZ 인코딩 결과</text>
      </motion.g>

      {fields.map((f, i) => {
        const w = (f.size / totalBytes) * barTotal;
        const x = accX;
        accX += w;
        return (
          <motion.g key={`bar-${f.name}`} {...fade(0.6 + i * 0.06)}>
            <rect x={x} y={barY} width={w} height={barH} rx={i === 0 ? 3 : 0}
              fill={`${f.c}25`} stroke={f.c} strokeWidth={0.5} />
            <text x={x + w / 2} y={barY + barH / 2 + 3} textAnchor="middle"
              fontSize={w > 25 ? 7 : 6} fontWeight={500} fill={f.c}>
              {f.size}B
            </text>
          </motion.g>
        );
      })}

      {/* 총 바이트 라벨 */}
      <motion.g {...fade(0.9)}>
        <text x={barX + barTotal / 2} y={barY + barH + 14} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.ssz}>= 112 bytes</text>
        <text x={barX + barTotal / 2} y={barY + barH + 25} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">오프셋 없음 — 전부 고정 크기</text>
      </motion.g>

      {/* 우측: RLP 비교 */}
      <motion.g {...fade(1.0)}>
        <rect x={345} y={24} width={125} height={74} rx={8}
          fill="var(--card)" stroke={C.alert} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={407} y={40} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.alert}>RLP (EL 방식)</text>

        {/* RLP 구조: [len][data][len][data]... */}
        {['[len]', 'slot', '[len]', 'parent', '...'].map((label, i) => (
          <rect key={i} x={355 + i * 22} y={48} width={20} height={14} rx={2}
            fill={i % 2 === 0 ? `${C.alert}20` : `${C.muted}15`}
            stroke={i % 2 === 0 ? C.alert : C.muted} strokeWidth={0.4} />
        ))}
        {['[len]', 'slot', '[len]', 'parent', '...'].map((label, i) => (
          <text key={`t-${i}`} x={355 + i * 22 + 10} y={59} textAnchor="middle"
            fontSize={5.5} fill={i % 2 === 0 ? C.alert : 'var(--muted-foreground)'}>{label}</text>
        ))}

        <text x={407} y={78} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">길이 접두사 → 순차 파싱</text>
        <text x={407} y={89} textAnchor="middle"
          fontSize={7} fill={C.alert}>필드 접근 O(n)</text>
      </motion.g>

      {/* SSZ 장점 뱃지 */}
      <motion.g {...fade(1.15)}>
        <rect x={345} y={106} width={125} height={30} rx={6}
          fill={`${C.ssz}0c`} stroke={C.ssz} strokeWidth={0.6} />
        <text x={407} y={118} textAnchor="middle"
          fontSize={7} fontWeight={600} fill={C.ssz}>SSZ: 오프셋 방식</text>
        <text x={407} y={129} textAnchor="middle"
          fontSize={7} fill={C.ssz}>필드 접근 O(1)</text>
      </motion.g>

      {/* 하단 핵심 */}
      <motion.g {...fade(1.3)}>
        <rect x={15} y={158} width={450} height={30} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={172} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          고정 크기: concat만 — 가변 크기: 4B offset + 뒤에 데이터 배치
        </text>
        <text x={240} y={183} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          Merkle proof 생성/검증이 핵심 → CL이 SSZ를 선택한 이유
        </text>
      </motion.g>

      {/* marker */}
      <defs>
        <marker id="arrowSsz" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.ssz} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 1 — hash_tree_root: 5 chunks → binary Merkle tree → root
   ================================================================ */
export function Step1() {
  /* 8 leaf 슬롯: c0-c4 실제 데이터, c5-c7 빈 패딩 */
  const leaves = [
    { label: 'c0', sub: 'slot', filled: true },
    { label: 'c1', sub: 'proposer', filled: true },
    { label: 'c2', sub: 'parent', filled: true },
    { label: 'c3', sub: 'state', filled: true },
    { label: 'c4', sub: 'body', filled: true },
    { label: 'c5', sub: '∅', filled: false },
    { label: 'c6', sub: '∅', filled: false },
    { label: 'c7', sub: '∅', filled: false },
  ];

  const leafW = 46;
  const leafH = 28;
  const leafY = 162;
  const leafStartX = 22;
  const leafGap = 55;

  /* 내부 노드 위치 */
  const d2Nodes = [
    { label: 'h(c0,c1)', x: 49, y: 118 },
    { label: 'h(c2,c3)', x: 159, y: 118 },
    { label: 'h(c4,∅)', x: 269, y: 118 },
    { label: 'h(∅,∅)', x: 379, y: 118 },
  ];
  const d1Nodes = [
    { label: 'h(01,23)', x: 104, y: 72 },
    { label: 'h(45,67)', x: 324, y: 72 },
  ];
  const rootNode = { label: 'root', x: 214, y: 22 };

  const nodeW = 60;
  const nodeH = 24;

  return (
    <g>
      {/* 제목 */}
      <motion.g {...fade(0)}>
        <text x={240} y={14} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.merkle}>
          hash_tree_root — 바이너리 Merkle 트리
        </text>
      </motion.g>

      {/* 리프 노드 (depth 3) */}
      {leaves.map((l, i) => {
        const x = leafStartX + i * leafGap;
        const color = l.filled ? C.chunk : C.muted;
        return (
          <motion.g key={l.label} {...fade(0.15 + i * 0.05)}>
            <rect x={x} y={leafY} width={leafW} height={leafH} rx={4}
              fill={l.filled ? `${C.chunk}15` : `${C.muted}08`}
              stroke={color} strokeWidth={l.filled ? 0.8 : 0.5} />
            <text x={x + leafW / 2} y={leafY + 12} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={color}>{l.label}</text>
            <text x={x + leafW / 2} y={leafY + 23} textAnchor="middle"
              fontSize={6.5} fill={l.filled ? 'var(--muted-foreground)' : C.muted}>
              {l.sub}
            </text>
          </motion.g>
        );
      })}

      {/* depth 3 → depth 2 연결선 */}
      {d2Nodes.map((n, i) => {
        const leftLeafX = leafStartX + (i * 2) * leafGap + leafW / 2;
        const rightLeafX = leafStartX + (i * 2 + 1) * leafGap + leafW / 2;
        const nodeCenter = n.x + nodeW / 2;
        return (
          <motion.g key={`line-d2-${i}`} {...fade(0.55 + i * 0.06)}>
            <line x1={leftLeafX} y1={leafY} x2={nodeCenter} y2={n.y + nodeH}
              stroke={C.merkle} strokeWidth={0.6} opacity={0.4} />
            <line x1={rightLeafX} y1={leafY} x2={nodeCenter} y2={n.y + nodeH}
              stroke={C.merkle} strokeWidth={0.6} opacity={0.4} />
          </motion.g>
        );
      })}

      {/* depth 2 노드 */}
      {d2Nodes.map((n, i) => (
        <motion.g key={n.label} {...fade(0.6 + i * 0.06)}>
          <rect x={n.x} y={n.y} width={nodeW} height={nodeH} rx={4}
            fill={`${C.merkle}15`} stroke={C.merkle} strokeWidth={0.7} />
          <text x={n.x + nodeW / 2} y={n.y + 15} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={C.merkle}>{n.label}</text>
        </motion.g>
      ))}

      {/* depth 2 → depth 1 연결선 */}
      {d1Nodes.map((n, i) => {
        const leftD2 = d2Nodes[i * 2];
        const rightD2 = d2Nodes[i * 2 + 1];
        const nodeCenter = n.x + nodeW / 2;
        return (
          <motion.g key={`line-d1-${i}`} {...fade(0.8 + i * 0.06)}>
            <line x1={leftD2.x + nodeW / 2} y1={leftD2.y} x2={nodeCenter} y2={n.y + nodeH}
              stroke={C.merkle} strokeWidth={0.6} opacity={0.4} />
            <line x1={rightD2.x + nodeW / 2} y1={rightD2.y} x2={nodeCenter} y2={n.y + nodeH}
              stroke={C.merkle} strokeWidth={0.6} opacity={0.4} />
          </motion.g>
        );
      })}

      {/* depth 1 노드 */}
      {d1Nodes.map((n, i) => (
        <motion.g key={n.label} {...fade(0.85 + i * 0.08)}>
          <rect x={n.x} y={n.y} width={nodeW} height={nodeH} rx={5}
            fill={`${C.merkle}20`} stroke={C.merkle} strokeWidth={0.8} />
          <text x={n.x + nodeW / 2} y={n.y + 15} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={C.merkle}>{n.label}</text>
        </motion.g>
      ))}

      {/* depth 1 → root 연결선 */}
      <motion.g {...fade(1.0)}>
        <line x1={d1Nodes[0].x + nodeW / 2} y1={d1Nodes[0].y}
          x2={rootNode.x + nodeW / 2} y2={rootNode.y + nodeH + 6}
          stroke={C.merkle} strokeWidth={0.7} opacity={0.5} />
        <line x1={d1Nodes[1].x + nodeW / 2} y1={d1Nodes[1].y}
          x2={rootNode.x + nodeW / 2} y2={rootNode.y + nodeH + 6}
          stroke={C.merkle} strokeWidth={0.7} opacity={0.5} />
      </motion.g>

      {/* root 노드 — 강조 */}
      <motion.g {...fade(1.05)}>
        <rect x={rootNode.x} y={rootNode.y} width={nodeW + 20} height={nodeH + 6} rx={6}
          fill={`${C.merkle}28`} stroke={C.merkle} strokeWidth={1.5} />
        <text x={rootNode.x + (nodeW + 20) / 2} y={rootNode.y + 11} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.merkle}>root</text>
        <text x={rootNode.x + (nodeW + 20) / 2} y={rootNode.y + 23} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">32 bytes (SHA-256)</text>
      </motion.g>

      {/* 패딩 안내 텍스트 */}
      <motion.g {...fade(0.5)}>
        <text x={leafStartX + 5 * leafGap + leafW / 2} y={leafY - 6} textAnchor="middle"
          fontSize={7} fill={C.muted} fontStyle="italic">
          2^3 = 8까지 패딩
        </text>
      </motion.g>
    </g>
  );
}
