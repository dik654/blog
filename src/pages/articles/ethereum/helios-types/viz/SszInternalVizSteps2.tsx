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
   Step 2 — generalized index: 트리 번호 체계 + 노드 54 강조
   ================================================================ */
export function Step2() {
  /*
    depth 0: node 1 (root)
    depth 1: 2, 3
    depth 2: 4, 5, 6, 7
    depth 3: 8-15
    전체 너비에 맞게 배치
  */
  const nodeR = 11;
  const treeTopY = 26;
  const depthGap = 40;

  /* 트리 노드 위치 계산 — depth별 */
  const depths: { id: number; x: number; y: number; highlight?: boolean }[][] = [];

  // depth 0: root = 1
  depths[0] = [{ id: 1, x: 170, y: treeTopY }];
  // depth 1
  depths[1] = [
    { id: 2, x: 95, y: treeTopY + depthGap },
    { id: 3, x: 245, y: treeTopY + depthGap },
  ];
  // depth 2
  depths[2] = [
    { id: 4, x: 55, y: treeTopY + depthGap * 2 },
    { id: 5, x: 135, y: treeTopY + depthGap * 2 },
    { id: 6, x: 205, y: treeTopY + depthGap * 2 },
    { id: 7, x: 285, y: treeTopY + depthGap * 2 },
  ];
  // depth 3
  depths[3] = [
    { id: 8, x: 35, y: treeTopY + depthGap * 3 },
    { id: 9, x: 75, y: treeTopY + depthGap * 3 },
    { id: 10, x: 115, y: treeTopY + depthGap * 3 },
    { id: 11, x: 155, y: treeTopY + depthGap * 3 },
    { id: 12, x: 185, y: treeTopY + depthGap * 3 },
    { id: 13, x: 225, y: treeTopY + depthGap * 3 },
    { id: 14, x: 265, y: treeTopY + depthGap * 3 },
    { id: 15, x: 305, y: treeTopY + depthGap * 3 },
  ];

  /* 부모-자식 연결선 */
  const edges: { px: number; py: number; cx: number; cy: number }[] = [];
  for (let d = 0; d < 3; d++) {
    depths[d].forEach((parent) => {
      const leftId = parent.id * 2;
      const rightId = parent.id * 2 + 1;
      const leftChild = depths[d + 1].find(n => n.id === leftId);
      const rightChild = depths[d + 1].find(n => n.id === rightId);
      if (leftChild) edges.push({ px: parent.x, py: parent.y, cx: leftChild.x, cy: leftChild.y });
      if (rightChild) edges.push({ px: parent.x, py: parent.y, cx: rightChild.x, cy: rightChild.y });
    });
  }

  return (
    <g>
      {/* depth 라벨 */}
      {[0, 1, 2, 3].map(d => (
        <motion.text key={`dl-${d}`} x={6} y={treeTopY + d * depthGap + 4}
          fontSize={7} fill="var(--muted-foreground)" {...fade(0)}>
          d={d}
        </motion.text>
      ))}

      {/* 연결선 */}
      {edges.map((e, i) => (
        <motion.line key={`e-${i}`}
          x1={e.px} y1={e.py + nodeR} x2={e.cx} y2={e.cy - nodeR}
          stroke="var(--border)" strokeWidth={0.6}
          {...drawLine(0.1 + i * 0.015)}
        />
      ))}

      {/* 노드 원 */}
      {depths.flat().map((n, i) => (
        <motion.g key={n.id} {...fade(0.2 + i * 0.02)}>
          <circle cx={n.x} cy={n.y} r={nodeR}
            fill="var(--card)" stroke={C.index} strokeWidth={0.8} />
          <text x={n.x} y={n.y + 3.5} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={C.index}>{n.id}</text>
        </motion.g>
      ))}

      {/* ── 우측: 공식 + 노드 54 예시 ── */}
      <motion.g {...fade(0.6)}>
        <rect x={335} y={18} width={135} height={38} rx={6}
          fill={`${C.index}12`} stroke={C.index} strokeWidth={1} />
        <text x={402} y={33} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.index}>공식</text>
        <text x={402} y={48} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.index} fontFamily="monospace">
          2^depth + index
        </text>
      </motion.g>

      {/* 노드 54 예시 */}
      <motion.g {...fade(0.8)}>
        <rect x={335} y={64} width={135} height={52} rx={6}
          fill={`${C.verify}0c`} stroke={C.verify} strokeWidth={0.8} />
        <text x={402} y={78} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.verify}>
          current_sync_committee
        </text>
        <text x={402} y={92} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.verify} fontFamily="monospace">
          2^5 + 22 = 54
        </text>
        <text x={402} y={106} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          BeaconState 22번째 필드
        </text>
      </motion.g>

      {/* Merkle proof 설명 */}
      <motion.g {...fade(1.0)}>
        <rect x={335} y={124} width={135} height={46} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={402} y={139} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill="var(--foreground)">
          Merkle proof = 형제 해시
        </text>
        <text x={402} y={152} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          leaf → root까지 올라가며
        </text>
        <text x={402} y={163} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          sibling 해시 depth개 수집
        </text>
      </motion.g>

      {/* 하단 설명 */}
      <motion.g {...fade(1.2)}>
        <rect x={20} y={180} width={300} height={16} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
        <text x={170} y={191} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          left = 2n, right = 2n+1 — 완전 이진 트리 인덱싱 규약
        </text>
      </motion.g>
    </g>
  );
}

/* ================================================================
   Step 3 — is_valid_merkle_branch(): 단계별 해시 검증 애니메이션
   ================================================================ */
export function Step3() {
  /*
    시각화: leaf에서 root까지 5단계 올라가며 hash 재구성
    index=54 → 이진수 110110 → 짝/홀 판별
    depth 5: 54 (짝 → 왼쪽)  → hash(leaf, sib[0])
    depth 4: 27 (홀 → 오른쪽) → hash(sib[1], h)
    depth 3: 13 (홀 → 오른쪽) → hash(sib[2], h)
    depth 2: 6  (짝 → 왼쪽)  → hash(h, sib[3])
    depth 1: 3  (홀 → 오른쪽) → hash(sib[4], h)
    → 결과 == root (node 1)
  */
  const steps = [
    { idx: 54, side: 'L', label: 'hash(leaf, sib₀)', sib: 'sib₀' },
    { idx: 27, side: 'R', label: 'hash(sib₁, h)', sib: 'sib₁' },
    { idx: 13, side: 'R', label: 'hash(sib₂, h)', sib: 'sib₂' },
    { idx: 6,  side: 'L', label: 'hash(h, sib₃)', sib: 'sib₃' },
    { idx: 3,  side: 'R', label: 'hash(sib₄, h)', sib: 'sib₄' },
  ];

  const colX = 55;      // 메인 hash 열
  const sibX = 200;     // sibling 열
  const startY = 160;
  const stepH = 28;

  return (
    <g>
      {/* 제목 */}
      <motion.g {...fade(0)}>
        <text x={240} y={12} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.verify}>
          is_valid_merkle_branch()
        </text>
      </motion.g>

      {/* leaf 시작 */}
      <motion.g {...fade(0.1)}>
        <rect x={colX - 38} y={startY} width={76} height={22} rx={11}
          fill={`${C.chunk}18`} stroke={C.chunk} strokeWidth={1} />
        <text x={colX} y={startY + 14} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.chunk}>leaf hash</text>
      </motion.g>

      {/* 5 step 올라가기 */}
      {steps.map((s, i) => {
        const y = startY - (i + 1) * stepH;
        const isLeft = s.side === 'L';
        return (
          <motion.g key={i} {...fade(0.25 + i * 0.15)}>
            {/* 수직 화살표: 이전 → 현재 */}
            <motion.line
              x1={colX} y1={y + stepH - 2} x2={colX} y2={y + 22}
              stroke={C.verify} strokeWidth={0.7}
              markerEnd="url(#arrowVerify)"
              {...drawLine(0.25 + i * 0.15)}
            />

            {/* hash 결과 박스 */}
            <rect x={colX - 55} y={y} width={110} height={20} rx={4}
              fill={`${C.verify}10`} stroke={C.verify} strokeWidth={0.7} />
            <text x={colX} y={y + 13} textAnchor="middle"
              fontSize={7.5} fontWeight={600} fill={C.verify}>{s.label}</text>

            {/* sibling 박스 */}
            <rect x={sibX} y={y} width={50} height={20} rx={10}
              fill={`${C.merkle}12`} stroke={C.merkle} strokeWidth={0.7} />
            <text x={sibX + 25} y={y + 13} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={C.merkle}>{s.sib}</text>

            {/* sibling → hash 연결 */}
            <motion.line
              x1={sibX} y1={y + 10} x2={colX + 55} y2={y + 10}
              stroke={C.merkle} strokeWidth={0.5} strokeDasharray="3 2"
              {...drawLine(0.3 + i * 0.15)}
            />

            {/* index 표시 */}
            <text x={colX - 60} y={y + 13}
              fontSize={7} fill="var(--muted-foreground)" textAnchor="end">
              {s.idx}
            </text>

            {/* 좌/우 뱃지 */}
            <rect x={colX + 58} y={y + 2} width={18} height={16} rx={3}
              fill={isLeft ? `${C.index}20` : `${C.merkle}20`}
              stroke={isLeft ? C.index : C.merkle} strokeWidth={0.5} />
            <text x={colX + 67} y={y + 13} textAnchor="middle"
              fontSize={7} fontWeight={700} fill={isLeft ? C.index : C.merkle}>
              {s.side}
            </text>
          </motion.g>
        );
      })}

      {/* 최종 root 비교 */}
      <motion.g {...fade(1.1)}>
        <rect x={colX - 55} y={14} width={110} height={22} rx={6}
          fill={`${C.verify}20`} stroke={C.verify} strokeWidth={1.5} />
        <text x={colX} y={28} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.verify}>computed root</text>
      </motion.g>

      {/* == state_root 비교 */}
      <motion.g {...fade(1.2)}>
        <text x={colX + 65} y={28} fontSize={10} fontWeight={700}
          fill={C.index}>==</text>
        <rect x={sibX - 10} y={14} width={80} height={22} rx={6}
          fill={`${C.index}15`} stroke={C.index} strokeWidth={1} />
        <text x={sibX + 30} y={28} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.index}>state_root</text>
      </motion.g>

      {/* 체크마크 */}
      <motion.g {...fade(1.4)}>
        <circle cx={290} cy={25} r={10}
          fill={`${C.index}25`} stroke={C.index} strokeWidth={1} />
        <motion.path
          d="M 284 25 L 288 29 L 296 21"
          fill="none" stroke={C.index} strokeWidth={2} strokeLinecap="round"
          {...drawLine(1.45)}
        />
      </motion.g>

      {/* 우측: 사용처 */}
      <motion.g {...fade(1.0)}>
        <rect x={330} y={50} width={140} height={98} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={400} y={66} textAnchor="middle"
          fontSize={8} fontWeight={700} fill="var(--foreground)">사용처</text>

        {[
          { label: 'Bootstrap', desc: 'sync_committee 검증', c: C.verify, idx: '54' },
          { label: 'Update', desc: 'next_committee 검증', c: C.chunk, idx: '55' },
          { label: 'Finality', desc: 'finalized_header 검증', c: C.merkle, idx: '105' },
        ].map((u, i) => (
          <motion.g key={u.label} {...fade(1.05 + i * 0.08)}>
            <rect x={340} y={74 + i * 22} width={120} height={18} rx={4}
              fill={`${u.c}0c`} stroke={u.c} strokeWidth={0.5} />
            <text x={348} y={74 + i * 22 + 12} fontSize={7.5} fontWeight={600}
              fill={u.c}>{u.label}</text>
            <text x={452} y={74 + i * 22 + 12} textAnchor="end"
              fontSize={7} fill="var(--muted-foreground)">idx={u.idx}</text>
          </motion.g>
        ))}
      </motion.g>

      {/* 하단 핵심 */}
      <motion.g {...fade(1.5)}>
        <rect x={330} y={156} width={140} height={32} rx={6}
          fill={`${C.verify}08`} stroke={C.verify} strokeWidth={0.5} />
        <text x={400} y={170} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.verify}>
          모두 같은 함수
        </text>
        <text x={400} y={182} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          다른 index — 하나로 통일
        </text>
      </motion.g>

      {/* marker */}
      <defs>
        <marker id="arrowVerify" viewBox="0 0 10 10" refX={5} refY={9}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M 0 10 L 5 0 L 10 10 z" fill={C.verify} />
        </marker>
      </defs>
    </g>
  );
}
