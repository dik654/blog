import { motion } from 'framer-motion';
import { DataBox, ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './FetchVizData';

/** Step 0: HTTP 요청 장면 */
export function Step0() {
  return (
    <g>
      {/* 왼쪽: Helios */}
      <DataBox x={15} y={30} w={90} h={36} label="Helios" sub="0x85e6.." color={C.http} />

      {/* 요청 화살표 — 오른쪽으로 */}
      <motion.line x1={110} y1={42} x2={290} y2={42}
        stroke={C.http} strokeWidth={1.2} markerEnd="url(#arrowR)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }} />
      {/* 화살표 위 텍스트 */}
      <motion.text x={200} y={34} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        GET /eth/v1/.../bootstrap/0x85e6..
      </motion.text>

      {/* 오른쪽: Beacon API */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <ModuleBox x={295} y={24} w={100} h={48} label="Beacon API" sub="Beacon 노드" color={C.http} />
      </motion.g>

      {/* 반환 화살표 — 왼쪽으로 */}
      <motion.line x1={290} y1={90} x2={110} y2={90}
        stroke={C.parse} strokeWidth={1.2} markerEnd="url(#arrowL)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }} />
      {/* 반환 텍스트 */}
      <motion.text x={200} y={104} textAnchor="middle" fontSize={8}
        fill={C.parse} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        200 OK — SSZ Bootstrap
      </motion.text>

      {/* 화살표 마커 정의 */}
      <defs>
        <marker id="arrowR" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.http} />
        </marker>
        <marker id="arrowL" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.parse} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 1: Bootstrap 응답 구조 분해 */
export function Step1() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Bootstrap 응답 구조</text>

      {/* header 카드 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}>
        <DataBox x={100} y={26} w={280} h={38} label="header"
          sub="slot=8000000, state_root=0xab12.." color={C.http} />
      </motion.g>

      {/* committee 카드 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        <ModuleBox x={100} y={72} w={280} h={38} label="current_sync_committee"
          sub="512 pubkeys (24KB)" color={C.parse} />
      </motion.g>

      {/* branch 카드 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        <ActionBox x={100} y={118} w={280} h={38}
          label="current_sync_committee_branch"
          sub="5개 해시, depth=5" color={C.merkle} />
      </motion.g>
    </g>
  );
}

/** Step 2: committee_branch Merkle 검증 — 트리 경로 시각화 */
export function Step2() {
  // index=22 → binary 10110 (LSB first: 0,1,1,0,1)
  // bit=0 → result LEFT, branch RIGHT
  // bit=1 → result RIGHT, branch LEFT
  const pathX = 210;
  const bL = 80, bR = 360;
  const levels: { y: number; bi: number; side: 'L' | 'R' }[] = [
    { y: 146, bi: 0, side: 'R' },   // bit=0 → branch RIGHT
    { y: 122, bi: 1, side: 'L' },   // bit=1 → branch LEFT
    { y: 98,  bi: 2, side: 'L' },   // bit=1 → branch LEFT
    { y: 74,  bi: 3, side: 'R' },   // bit=0 → branch RIGHT
    { y: 50,  bi: 4, side: 'L' },   // bit=1 → branch LEFT
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.merkle}>Merkle 경로: committee → state_root</text>

      {/* 목표: state_root */}
      <DataBox x={pathX - 65} y={18} w={130} h={24}
        label="state_root" sub="0xab12..3e4f" color={C.http} />

      {/* 시작: committee_root */}
      <DataBox x={pathX - 75} y={164} w={150} h={24}
        label="committee_root" sub="hash(512 pubkeys)" color={C.parse} />

      {/* 수직 경로선 */}
      <motion.line x1={pathX} y1={164} x2={pathX} y2={42}
        stroke={C.parse} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.25}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1 }} />

      {/* 5개 레벨 — 각 branch 형제가 좌/우로 갈라짐 */}
      {levels.map((lv, i) => {
        const bx = lv.side === 'L' ? bL : bR;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.16 }}>
            {/* 경로 노드 — 해시 연산 */}
            <circle cx={pathX} cy={lv.y} r={8}
              fill={C.merkle} opacity={0.12} />
            <circle cx={pathX} cy={lv.y} r={8}
              fill="none" stroke={C.merkle} strokeWidth={0.8} />
            <text x={pathX} y={lv.y + 3} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={C.merkle}>h</text>

            {/* branch 형제 (점선 박스) */}
            <rect x={bx - 38} y={lv.y - 10} width={76} height={20} rx={4}
              fill="var(--card)" stroke={C.merkle} strokeWidth={0.5}
              strokeDasharray="3 2" />
            <text x={bx} y={lv.y + 3} textAnchor="middle"
              fontSize={8} fill="var(--muted-foreground)">
              branch[{lv.bi}]
            </text>

            {/* 연결선: branch → 경로 노드 */}
            <line
              x1={lv.side === 'L' ? bx + 38 : bx - 38} y1={lv.y}
              x2={lv.side === 'L' ? pathX - 8 : pathX + 8} y2={lv.y}
              stroke={C.merkle} strokeWidth={0.5} opacity={0.5} />

            {/* depth 라벨 */}
            <text x={440} y={lv.y + 3} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">
              depth {i}
            </text>
          </motion.g>
        );
      })}

      {/* 비교: computed_root == state_root ✓ */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1 }}>
        <text x={pathX + 80} y={36} fontSize={12} fontWeight={700}
          fill={C.parse}>{'== ✓'}</text>
      </motion.g>

      {/* 하단 설명 */}
      <text x={240} y={196} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        index=22의 비트 패턴(10110)이 각 depth에서 좌/우를 결정 → 5개 해시로 루트 재구성
      </text>
    </g>
  );
}
