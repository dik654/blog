import { motion } from 'framer-motion';
import { DataBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './UpdateTraceVizData';

/** Step 3: 위원회 교체 — period 경계 감지 + 교체 */
export function Step3() {
  const oldPeriod = 976;  // 8000000 / 8192 ≈ 976
  const newPeriod = 977;
  const epochsPerPeriod = 256;

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.committee}>
        apply_update() — 위원회 교체 (period 경계)
      </text>

      {/* period 타임라인 */}
      <motion.line
        x1={30} y1={68} x2={450} y2={68}
        stroke="var(--border)" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* period 구간 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        {/* 이전 period */}
        <rect x={40} y={50} width={160} height={36} rx={6}
          fill="var(--card)" stroke={C.committee} strokeWidth={0.6} opacity={0.5} />
        <text x={120} y={65} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.committee}>period {oldPeriod}</text>
        <text x={120} y={78} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">slot 7995392~8003583</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        {/* 새 period */}
        <rect x={220} y={50} width={160} height={36} rx={6}
          fill="var(--card)" stroke={C.committee} strokeWidth={1} />
        <text x={300} y={65} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.committee}>period {newPeriod}</text>
        <text x={300} y={78} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">slot 8003584~8011775</text>
      </motion.g>

      {/* 경계선 */}
      <motion.line
        x1={210} y1={42} x2={210} y2={92}
        stroke={C.committee} strokeWidth={1.5} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      />
      <motion.text x={210} y={38} textAnchor="middle" fontSize={7.5}
        fontWeight={600} fill={C.committee}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        경계
      </motion.text>

      {/* 교체 과정 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}>
        <ModuleBox x={30} y={102} w={130} h={38}
          label="current_committee" sub="512명 (period 976)" color={C.committee} />
      </motion.g>

      <motion.line x1={164} y1={121} x2={194} y2={121}
        stroke={C.committee} strokeWidth={1}
        markerEnd="url(#utCommArrow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.1, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        <ActionBox x={198} y={104} w={80} h={34}
          label="교체" sub="current ← next" color={C.committee} />
      </motion.g>

      <motion.line x1={282} y1={121} x2={312} y2={121}
        stroke={C.committee} strokeWidth={1}
        markerEnd="url(#utCommArrow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.3, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4 }}>
        <ModuleBox x={316} y={102} w={140} h={38}
          label="current_committee" sub="새 512명 (period 977)" color={C.committee} />
      </motion.g>

      {/* 하단 수식 + 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}>
        <rect x={60} y={152} width={360} height={36} rx={8}
          fill="var(--card)" stroke={C.committee} strokeWidth={0.5} />
        <text x={240} y={168} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.committee}>
          period = slot / 8192 = {epochsPerPeriod} 에폭 = 27.3시간
        </text>
        <text x={240} y={181} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          has_next_committee(update) → true이면 current = next_sync_committee
        </text>
      </motion.g>

      <defs>
        <marker id="utCommArrow" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.committee} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 4: optimistic_header 교체 — 최신 추적 + "latest" 응답 연결 */
export function Step4() {
  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.optimistic}>
        apply_update() — optimistic_header 갱신
      </text>

      {/* 두 트랙: finalized vs optimistic */}
      {/* finalized 트랙 (상단) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}>
        <rect x={20} y={38} width={8} height={36} rx={4}
          fill={C.finalized} opacity={0.6} />
        <text x={38} y={48} fontSize={8} fontWeight={600}
          fill="var(--foreground)">finalized</text>
        <text x={38} y={60} fontSize={7}
          fill="var(--muted-foreground)">~12분 간격 갱신</text>
      </motion.g>

      {/* finalized 슬롯 점들 (드문 간격) */}
      {[80, 280].map((cx, i) => (
        <motion.g key={`f${i}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.2 }}>
          <circle cx={cx} cy={72} r={5} fill={C.finalized} opacity={0.7} />
          <text x={cx} y={85} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">
            {i === 0 ? 'slot 8M' : 'slot 8M+64'}
          </text>
        </motion.g>
      ))}

      {/* finalized 타임라인 */}
      <motion.line x1={40} y1={72} x2={460} y2={72}
        stroke={C.finalized} strokeWidth={0.8} strokeDasharray="6 4" opacity={0.4}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }} />

      {/* optimistic 트랙 (하단) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <rect x={20} y={98} width={8} height={36} rx={4}
          fill={C.optimistic} opacity={0.6} />
        <text x={38} y={108} fontSize={8} fontWeight={600}
          fill="var(--foreground)">optimistic</text>
        <text x={38} y={120} fontSize={7}
          fill="var(--muted-foreground)">매 12초 갱신</text>
      </motion.g>

      {/* optimistic 슬롯 점들 (빈번한 간격) */}
      {Array.from({ length: 10 }, (_, i) => 80 + i * 38).map((cx, i) => (
        <motion.circle key={`o${i}`}
          cx={cx} cy={132} r={3.5}
          fill={C.optimistic} opacity={0.7}
          initial={{ opacity: 0, r: 0 }}
          animate={{ opacity: 0.7, r: 3.5 }}
          transition={{ delay: 0.5 + i * 0.08, duration: 0.15 }}
        />
      ))}

      {/* optimistic 타임라인 */}
      <motion.line x1={40} y1={132} x2={460} y2={132}
        stroke={C.optimistic} strokeWidth={0.8} opacity={0.4}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }} />

      {/* 최신 교체 화살표 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}>
        <line x1={422} y1={132} x2={438} y2={132}
          stroke={C.optimistic} strokeWidth={1.2}
          markerEnd="url(#utOptArrow)" />
        <text x={460} y={136} fontSize={8} fontWeight={600}
          fill={C.optimistic}>최신</text>
      </motion.g>

      {/* 하단: API 응답 매핑 */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}>
        <rect x={40} y={154} width={400} height={38} rx={8}
          fill="var(--card)" stroke={C.optimistic} strokeWidth={0.5} />
        <text x={240} y={168} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.optimistic}>
          eth_getBlockByNumber("latest") → optimistic_header
        </text>
        <text x={240} y={182} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          eth_getBalance, eth_call → finalized_header (상태 증명)
        </text>
      </motion.g>

      <defs>
        <marker id="utOptArrow" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.optimistic} />
        </marker>
      </defs>
    </g>
  );
}
