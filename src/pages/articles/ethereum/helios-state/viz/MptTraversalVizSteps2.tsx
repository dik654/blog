import { motion } from 'framer-motion';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './MptTraversalVizData';

/* ── 공통: 화살표 마커 ── */
function Defs() {
  return (
    <defs>
      <marker id="mtArr2" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--foreground)" />
      </marker>
      <marker id="mtArr2E" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.extLeaf} />
      </marker>
      <marker id="mtArr2W" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={C.walk} />
      </marker>
    </defs>
  );
}

/** Step 3: Extension + Leaf 노드 — 좌우 배치 */
export function Step3() {
  const sharedNibbles = ['1', 'a', '3', 'b'];

  return (
    <g>
      <Defs />
      <text x={240} y={14} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.extLeaf}>
        Extension (경로 압축) + Leaf (값 추출)
      </text>

      {/* ── 좌측: Extension 노드 ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        {/* Extension 외곽 */}
        <rect x={14} y={28} width={210} height={160} rx={8}
          fill="var(--card)" stroke={C.extLeaf} strokeWidth={0.6}
          strokeDasharray="4 3" />
        <text x={119} y={44} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.extLeaf}>Extension 노드</text>

        {/* items = [hp_path, child_hash] */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}>
          <ActionBox x={24} y={52} w={94} h={30}
            label="HP 디코딩" sub="prefix=0,1" color={C.extLeaf} />
        </motion.g>

        {/* shared nibble 칩들 */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          <text x={24} y={100} fontSize={8} fontWeight={600}
            fill="var(--foreground)">shared nibbles:</text>
          {sharedNibbles.map((n, i) => (
            <motion.g key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}>
              <rect x={24 + i * 36} y={106} width={30} height={22} rx={5}
                fill={`${C.extLeaf}15`} stroke={C.extLeaf} strokeWidth={0.8} />
              <text x={24 + i * 36 + 15} y={121} textAnchor="middle"
                fontSize={10} fontWeight={700} fill={C.extLeaf}>{n}</text>
            </motion.g>
          ))}
        </motion.g>

        {/* path_offset 점프 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}>
          <rect x={24} y={136} width={190} height={22} rx={5}
            fill="var(--card)" stroke={C.extLeaf} strokeWidth={0.5} />
          <text x={119} y={150} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={C.extLeaf}>
            path_offset += 4 (한 번에 건너뜀)
          </text>
        </motion.g>

        {/* child_hash 화살표 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}>
          <text x={24} y={176} fontSize={7.5}
            fill="var(--foreground)">
            expected_hash = items[1] (child_hash)
          </text>
        </motion.g>
      </motion.g>

      {/* ── 우측: Leaf 노드 ── */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}>
        {/* Leaf 외곽 */}
        <rect x={240} y={28} width={226} height={160} rx={8}
          fill="var(--card)" stroke={C.hash} strokeWidth={0.6}
          strokeDasharray="4 3" />
        <text x={353} y={44} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.hash}>Leaf 노드</text>

        {/* HP 디코딩 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}>
          <ActionBox x={250} y={52} w={94} h={30}
            label="HP 디코딩" sub="prefix=2,3" color={C.hash} />
        </motion.g>

        {/* remainder path 확인 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}>
          <rect x={250} y={92} width={206} height={24} rx={5}
            fill="var(--card)" stroke={C.hash} strokeWidth={0.5} />
          <text x={353} y={108} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={C.hash}>
            remainder == shared? → 경로 일치 확인
          </text>
        </motion.g>

        {/* 값 추출 박스 */}
        <motion.g initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: 'spring' }}>
          <DataBox x={274} y={126} w={160} h={30}
            label="items[1] = Account" sub="RLP(nonce, balance, ...)" color={C.hash} />
        </motion.g>

        {/* 반환 체크 */}
        <motion.text x={353} y={178} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.hash}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, type: 'spring' }}>
          {'✓ return Ok(items[1])'}
        </motion.text>
      </motion.g>
    </g>
  );
}

/** Step 4: 전체 순회 예시 — state_root → Branch → Extension → Branch → Leaf */
export function Step4() {
  const walkSteps = [
    { x: 14,  y: 38,  label: 'state_root', shape: 'circle' as const, sub: 'BLS 검증됨', offset: '0' },
    { x: 84,  y: 38,  label: 'Branch',     shape: 'box' as const,    sub: 'nibble=5',   offset: '1' },
    { x: 190, y: 38,  label: 'Extension',  shape: 'box' as const,    sub: 'skip 3',     offset: '4' },
    { x: 296, y: 38,  label: 'Branch',     shape: 'box' as const,    sub: 'nibble=7',   offset: '5' },
    { x: 388, y: 38,  label: 'Leaf',       shape: 'pill' as const,   sub: 'Account',    offset: 'done' },
  ];

  return (
    <g>
      <Defs />
      <text x={240} y={14} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.walk}>
        전체 순회: verify_proof() 실행 흐름
      </text>

      {/* 상단: path nibbles */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}>
        <text x={240} y={30} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          path = keccak256(0xd8dA6B...) → nibbles = [5, b, 9, e, 7, c, ...]
        </text>
      </motion.g>

      {/* 순회 노드들 */}
      {walkSteps.map((ws, i) => (
        <motion.g key={`ws-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.3 }}>

          {/* 노드 형태별 렌더링 */}
          {ws.shape === 'circle' && (
            <g>
              <circle cx={ws.x + 30} cy={ws.y + 20} r={18}
                fill="var(--card)" stroke={C.walk} strokeWidth={1.2} />
              <text x={ws.x + 30} y={ws.y + 17} textAnchor="middle"
                fontSize={7.5} fontWeight={700} fill={C.walk}>{ws.label.split('_')[0]}</text>
              <text x={ws.x + 30} y={ws.y + 26} textAnchor="middle"
                fontSize={7} fill={C.walk}>{ws.label.split('_')[1] || ''}</text>
            </g>
          )}
          {ws.shape === 'box' && (
            <g>
              <rect x={ws.x} y={ws.y} width={86} height={40} rx={6}
                fill="var(--card)" stroke={C.walk} strokeWidth={0.8} />
              <rect x={ws.x} y={ws.y} width={86} height={5} rx={3}
                fill={C.walk} opacity={0.7} />
              <text x={ws.x + 43} y={ws.y + 22} textAnchor="middle"
                fontSize={9} fontWeight={700} fill="var(--foreground)">{ws.label}</text>
              <text x={ws.x + 43} y={ws.y + 33} textAnchor="middle"
                fontSize={7.5} fontWeight={600} fill={C.walk}>{ws.sub}</text>
            </g>
          )}
          {ws.shape === 'pill' && (
            <DataBox x={ws.x} y={ws.y + 4} w={78} h={32}
              label={ws.label} sub={ws.sub} color={C.walk} />
          )}

          {/* 체크마크 */}
          <motion.text
            x={ws.shape === 'circle' ? ws.x + 30 : ws.x + (ws.shape === 'pill' ? 39 : 43)}
            y={ws.y + 52} textAnchor="middle"
            fontSize={10} fontWeight={700} fill={C.hash}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.3, type: 'spring' }}>
            {'✓'}
          </motion.text>

          {/* 노드 간 화살표 (마지막 제외) */}
          {i < walkSteps.length - 1 && (
            <motion.line
              x1={ws.shape === 'circle' ? ws.x + 48 : ws.x + (ws.shape === 'pill' ? 78 : 86)}
              y1={ws.y + 20}
              x2={walkSteps[i + 1].x + (walkSteps[i + 1].shape === 'circle' ? 12 : 0)}
              y2={walkSteps[i + 1].y + 20}
              stroke={C.walk} strokeWidth={1} markerEnd="url(#mtArr2W)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.35 + i * 0.3, duration: 0.25 }} />
          )}
        </motion.g>
      ))}

      {/* 하단: path_offset 카운터 트랙 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}>
        {/* 트랙 배경선 */}
        <line x1={30} y1={118} x2={450} y2={118}
          stroke="var(--border)" strokeWidth={1.5} />
        <text x={16} y={108} fontSize={7.5} fontWeight={600}
          fill="var(--foreground)">path_offset</text>

        {/* 각 스텝의 offset 마커 */}
        {walkSteps.map((ws, i) => {
          const markerX = 44 + i * 96;
          return (
            <motion.g key={`off-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + i * 0.15 }}>
              {/* 원형 마커 */}
              <circle cx={markerX} cy={118} r={10}
                fill={ws.offset === 'done' ? `${C.hash}20` : `${C.walk}20`}
                stroke={ws.offset === 'done' ? C.hash : C.walk} strokeWidth={1} />
              <text x={markerX} y={122} textAnchor="middle"
                fontSize={ws.offset === 'done' ? 7 : 10}
                fontWeight={700}
                fill={ws.offset === 'done' ? C.hash : C.walk}>
                {ws.offset}
              </text>
              {/* 세로 점선 연결 */}
              <line x1={markerX} y1={96} x2={markerX} y2={108}
                stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />
            </motion.g>
          );
        })}

        {/* offset 사이 화살표 */}
        {walkSteps.slice(0, -1).map((_, i) => {
          const x1 = 44 + i * 96 + 12;
          const x2 = 44 + (i + 1) * 96 - 12;
          const jump = i === 1 ? '+3' : '+1';
          return (
            <motion.g key={`oa-${i}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 2.0 + i * 0.12 }}>
              <motion.line x1={x1} y1={118} x2={x2} y2={118}
                stroke={C.walk} strokeWidth={0.8} markerEnd="url(#mtArr2W)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 2.0 + i * 0.12, duration: 0.2 }} />
              {/* 점프 크기 라벨 */}
              <rect x={(x1 + x2) / 2 - 10} y={124} width={20} height={12} rx={3}
                fill="var(--card)" stroke="none" />
              <text x={(x1 + x2) / 2} y={133} textAnchor="middle"
                fontSize={7} fontWeight={600} fill={C.walk}>
                {jump}
              </text>
            </motion.g>
          );
        })}
      </motion.g>

      {/* 좌측 하단: HP 인코딩 범례 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}>
        <rect x={14} y={150} width={200} height={40} rx={6}
          fill="var(--card)" stroke={C.extLeaf} strokeWidth={0.5} />
        <text x={114} y={166} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.extLeaf}>HP prefix로 노드 타입 구분</text>
        <text x={114} y={180} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">
          0,1 = Extension / 2,3 = Leaf
        </text>
      </motion.g>

      {/* 우측 하단: 결과 */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.6, type: 'spring' }}>
        <rect x={280} y={150} width={186} height={40} rx={6}
          fill="var(--card)" stroke={C.hash} strokeWidth={0.5} />
        <text x={373} y={166} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.hash}>
          최종: Account 데이터 반환
        </text>
        <text x={373} y={180} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">
          nonce:42, balance:1.5 ETH, storage_root, code_hash
        </text>
      </motion.g>
    </g>
  );
}
