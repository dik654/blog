import { motion } from 'framer-motion';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './MptTraversalVizData';

/* ── 공통: 화살표 마커 ── */
export function ArrowDefs() {
  return (
    <defs>
      <marker id="mtArr" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--foreground)" />
      </marker>
      <marker id="mtArrN" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.nibble} />
      </marker>
      <marker id="mtArrH" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.hash} />
      </marker>
      <marker id="mtArrB" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.branch} />
      </marker>
    </defs>
  );
}

/** Step 0: 주소 → keccak256 → 64 nibble 칩 */
export function Step0() {
  const nibbles = ['5', 'b', '9', 'e', '7', 'c', 'a', '2', '...'];

  return (
    <g>
      <ArrowDefs />
      <text x={240} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.nibble}>
        address → keccak256 → 64 nibble
      </text>

      {/* 입력: 주소 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <DataBox x={20} y={32} w={120} h={30} label="0xd8dA6B..." sub="20바이트 주소" color={C.nibble} />
      </motion.g>

      {/* 화살표 */}
      <motion.line x1={144} y1={47} x2={172} y2={47}
        stroke={C.nibble} strokeWidth={1.2} markerEnd="url(#mtArrN)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }} />

      {/* keccak256 연산 박스 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <ActionBox x={176} y={30} w={95} h={34}
          label="keccak256" sub="SHA-3 변형" color={C.nibble} />
      </motion.g>

      {/* 화살표 */}
      <motion.line x1={275} y1={47} x2={303} y2={47}
        stroke={C.nibble} strokeWidth={1.2} markerEnd="url(#mtArrN)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }} />

      {/* 출력: 32바이트 해시 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}>
        <DataBox x={307} y={32} w={150} h={30} label="0x5b9e7c...a1f3" sub="32바이트 해시" color={C.nibble} />
      </motion.g>

      {/* 하단: nibble 분해 시각화 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}>
        <text x={240} y={84} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">
          32바이트 → 64 nibble (각 4비트)
        </text>
      </motion.g>

      {/* nibble 칩들 — 순차 등장 */}
      {nibbles.map((n, i) => {
        const cx = 72 + i * 40;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + i * 0.08 }}>
            <rect x={cx} y={92} width={32} height={26} rx={6}
              fill="var(--card)" stroke={C.nibble} strokeWidth={0.8} />
            <text x={cx + 16} y={109} textAnchor="middle"
              fontSize={11} fontWeight={700} fill={C.nibble}>{n}</text>
            {/* 인덱스 라벨 */}
            <text x={cx + 16} y={130} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">
              {i < 8 ? `[${i}]` : ''}
            </text>
          </motion.g>
        );
      })}

      {/* nibble 사이 연결선 */}
      {nibbles.slice(0, -1).map((_, i) => {
        const x1 = 72 + i * 40 + 32;
        const x2 = 72 + (i + 1) * 40;
        return (
          <motion.line key={`nl-${i}`}
            x1={x1 + 1} y1={105} x2={x2 - 1} y2={105}
            stroke={C.nibble} strokeWidth={0.6} opacity={0.3}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.1 + i * 0.08, duration: 0.15 }} />
        );
      })}

      {/* 하단 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}>
        <rect x={100} y={142} width={280} height={40} rx={8}
          fill="var(--card)" stroke={C.nibble} strokeWidth={0.5} />
        <text x={240} y={158} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.nibble}>
          각 nibble = Branch 노드의 자식 선택자
        </text>
        <text x={240} y={172} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          nibble 값 0~f → children[0]~children[15] 중 하나를 선택
        </text>
      </motion.g>
    </g>
  );
}

/** Step 1: 해시 체인 검증 — 수직 4단계 + 위조 감지 */
export function Step1() {
  const nodes = [
    { label: 'Root', y: 28, sub: 'state_root' },
    { label: 'Branch', y: 68, sub: 'children[5]' },
    { label: 'Extension', y: 108, sub: 'child_hash' },
    { label: 'Leaf', y: 148, sub: '최종 값' },
  ];

  return (
    <g>
      <ArrowDefs />
      <text x={180} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.hash}>
        해시 체인 검증
      </text>

      {/* 수직 노드 체인 */}
      {nodes.map((node, i) => (
        <motion.g key={node.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.25 }}>
          {/* 노드 박스 */}
          <rect x={110} y={node.y} width={140} height={32} rx={8}
            fill="var(--card)" stroke={C.hash} strokeWidth={0.8} />
          {/* 좌측 액센트 */}
          <rect x={110} y={node.y + 4} width={3} height={24} rx={1.5}
            fill={C.hash} />
          {/* 노드 타입 */}
          <text x={126} y={node.y + 15} fontSize={9}
            fontWeight={700} fill={C.hash}>{node.label}</text>
          {/* 서브 텍스트 */}
          <text x={126} y={node.y + 26} fontSize={7}
            fill="var(--muted-foreground)">{node.sub}</text>

          {/* 체크마크 */}
          <motion.text x={258} y={node.y + 20} fontSize={12}
            fontWeight={700} fill={C.hash}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.25, type: 'spring' }}>
            {'✓'}
          </motion.text>

          {/* keccak256 == expected_hash 라벨 */}
          <motion.text x={272} y={node.y + 14} fontSize={7}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.25 }}>
            keccak256
          </motion.text>
          <motion.text x={272} y={node.y + 24} fontSize={7}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.25 }}>
            == expected
          </motion.text>

          {/* 노드 간 화살표 (마지막 제외) */}
          {i < nodes.length - 1 && (
            <motion.line
              x1={180} y1={node.y + 32} x2={180} y2={nodes[i + 1].y}
              stroke={C.hash} strokeWidth={1} markerEnd="url(#mtArrH)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.35 + i * 0.25, duration: 0.2 }} />
          )}

          {/* expected_hash 전달 라벨 (마지막 제외) */}
          {i < nodes.length - 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.25 }}>
              <rect x={75} y={node.y + 34} width={60} height={14} rx={3}
                fill="var(--card)" stroke="none" />
              <text x={105} y={node.y + 44} textAnchor="middle"
                fontSize={7} fontWeight={600} fill={C.hash}>
                hash 전달
              </text>
            </motion.g>
          )}
        </motion.g>
      ))}

      {/* 우측: 위조 감지 시나리오 */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3 }}>
        <rect x={360} y={50} width={108} height={62} rx={8}
          fill="var(--card)" stroke={C.danger} strokeWidth={0.8}
          strokeDasharray="4 3" />
        <text x={414} y={66} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.danger}>위조 감지</text>

        {/* 가짜 노드 */}
        <rect x={374} y={74} width={80} height={16} rx={4}
          fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
        <text x={414} y={85} textAnchor="middle" fontSize={7}
          fill={C.danger}>위조 노드</text>

        {/* X 마크 */}
        <motion.text x={414} y={106} textAnchor="middle" fontSize={11}
          fontWeight={700} fill={C.danger}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, type: 'spring' }}>
          {'✗ hash mismatch'}
        </motion.text>
      </motion.g>

      {/* 좌측 하단: 보안 원리 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}>
        <rect x={360} y={128} width={108} height={52} rx={6}
          fill="var(--card)" stroke={C.hash} strokeWidth={0.5} />
        <text x={414} y={144} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.hash}>체인 불변성</text>
        <text x={370} y={158} fontSize={7}
          fill="var(--foreground)">root가 진짜이면</text>
        <text x={370} y={170} fontSize={7}
          fill="var(--muted-foreground)">중간 노드 위조 불가</text>
      </motion.g>
    </g>
  );
}

/** Step 2: Branch 노드 상세 — 16슬롯 + nibble 선택 */
export function Step2() {
  const activeNibble = 5;

  return (
    <g>
      <ArrowDefs />
      <text x={240} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.branch}>
        Branch 노드: 17 항목 = children[0..15] + value
      </text>

      {/* Branch 노드 배경 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}>
        <rect x={30} y={30} width={420} height={56} rx={8}
          fill="var(--card)" stroke={C.branch} strokeWidth={0.8} />
        {/* 상단 바 */}
        <rect x={30} y={30} width={420} height={5} rx={3}
          fill={C.branch} opacity={0.7} />
        <text x={44} y={48} fontSize={8}
          fontWeight={700} fill={C.branch}>Branch</text>
      </motion.g>

      {/* 16개 슬롯 [0]..[f] */}
      {Array.from({ length: 16 }, (_, i) => {
        const sx = 44 + i * 25;
        const isActive = i === activeNibble;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.03 }}>
            <rect x={sx} y={52} width={21} height={26} rx={4}
              fill={isActive ? `${C.branch}25` : 'var(--border)'}
              stroke={isActive ? C.branch : 'none'}
              strokeWidth={isActive ? 1.2 : 0}
              opacity={isActive ? 1 : 0.2} />
            <text x={sx + 10.5} y={69} textAnchor="middle"
              fontSize={9} fontWeight={isActive ? 700 : 400}
              fill={isActive ? C.branch : 'var(--muted-foreground)'}>
              {i.toString(16)}
            </text>
          </motion.g>
        );
      })}

      {/* value[16] 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}>
        <rect x={414} y={52} width={28} height={26} rx={4}
          fill="var(--border)" opacity={0.15}
          stroke="var(--border)" strokeWidth={0.5} />
        <text x={428} y={69} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">val</text>
      </motion.g>

      {/* nibble 포인터 — "nibble=5" */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}>
        {/* 활성 슬롯 위 화살표 */}
        <motion.line x1={44 + activeNibble * 25 + 10.5} y1={42}
          x2={44 + activeNibble * 25 + 10.5} y2={50}
          stroke={C.branch} strokeWidth={1.2} markerEnd="url(#mtArrB)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 0.2 }} />
        <rect x={44 + activeNibble * 25 - 16} y={30}
          width={54} height={14} rx={4}
          fill={C.branch} opacity={0.15} />
        <text x={44 + activeNibble * 25 + 11} y={40}
          textAnchor="middle" fontSize={8} fontWeight={700} fill={C.branch}>
          nibble=5
        </text>
      </motion.g>

      {/* 아래로 화살표 → 자식 노드 */}
      <motion.line
        x1={44 + activeNibble * 25 + 10.5} y1={78}
        x2={44 + activeNibble * 25 + 10.5} y2={102}
        stroke={C.branch} strokeWidth={1.2} markerEnd="url(#mtArrB)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.0, duration: 0.3 }} />

      {/* 자식 노드 박스 */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}>
        <DataBox
          x={44 + activeNibble * 25 - 40} y={104}
          w={106} h={30}
          label="child node" sub="hash = children[5]" color={C.branch} />
      </motion.g>

      {/* 우측: path_offset 카운터 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0 }}>
        <rect x={330} y={100} width={130} height={50} rx={8}
          fill="var(--card)" stroke={C.branch} strokeWidth={0.5} />
        <text x={395} y={116} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.branch}>path_offset</text>

        {/* 카운터 애니메이션: 0 → 1 */}
        <motion.text x={370} y={138} fontSize={14}
          fontWeight={700} fill="var(--muted-foreground)"
          initial={{ opacity: 1 }} animate={{ opacity: 0.3 }}
          transition={{ delay: 1.4, duration: 0.3 }}>
          0
        </motion.text>
        <motion.text x={390} y={138} fontSize={10}
          fill="var(--muted-foreground)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}>
          →
        </motion.text>
        <motion.text x={410} y={138} fontSize={14}
          fontWeight={700} fill={C.branch}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}>
          1
        </motion.text>
        <text x={395} y={146} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">nibble 1개 소비</text>
      </motion.g>

      {/* 좌측 하단: 빈 슬롯 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}>
        <rect x={30} y={148} width={180} height={38} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={120} y={163} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="var(--foreground)">빈 슬롯 = 해당 경로 데이터 없음</text>
        <text x={120} y={177} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">items[nibble].is_empty() → 계정 미존재</text>
      </motion.g>
    </g>
  );
}
