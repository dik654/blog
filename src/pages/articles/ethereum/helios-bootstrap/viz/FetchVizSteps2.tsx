import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './FetchVizData';

/** Step 3: LightClientStore 초기화 */
export function Step3() {
  const fields = [
    { k: 'finalized_header:', v: 'slot=8000000', ok: true },
    { k: 'current_sync_committee:', v: '512 pubkeys', ok: true },
    { k: 'next_sync_committee:', v: 'None', ok: false },
    { k: 'optimistic_header:', v: 'slot=8000000', ok: true },
    { k: 'previous_max_active:', v: '0', ok: false },
    { k: 'current_max_active:', v: '0', ok: false },
  ];
  const startY = 42;
  const rowH = 22;

  return (
    <g>
      {/* 타이틀 — 박스 밖 위에 배치 */}
      <text x={240} y={18} textAnchor="middle" fontSize={12}
        fontWeight={700} fill={C.store}>LightClientStore</text>

      {/* 박스 본체 — 타이틀 아래에 배치 */}
      <rect x={60} y={26} width={360} height={148} rx={8} fill="var(--card)" />
      <rect x={60} y={26} width={360} height={148} rx={8}
        fill="transparent" stroke="var(--border)" strokeWidth={0.5} />

      {/* 6개 필드 순차 fade-in */}
      {fields.map((f, i) => (
        <motion.g key={f.k}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <text x={80} y={startY + i * rowH + 14} fontSize={10}
            fontWeight={600} fill="var(--foreground)">{f.k}</text>
          <text x={280} y={startY + i * rowH + 14} fontSize={10}
            fill={f.ok ? C.store : 'var(--muted-foreground)'}>{f.v}</text>
          {f.ok && (
            <text x={380} y={startY + i * rowH + 14} fontSize={11}
              fill={C.store}>{'✓'}</text>
          )}
        </motion.g>
      ))}

      {/* 하단 텍스트 */}
      <motion.text x={240} y={192} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={C.store}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        부트스트랩 완료 — sync loop 시작 준비
      </motion.text>
    </g>
  );
}

/** Step 4: 첫 sync loop */
export function Step4() {
  return (
    <g>
      {/* Store → 화살표 → Beacon API */}
      <DataBox x={10} y={20} w={100} h={36}
        label="Store" sub="slot=8000000" color={C.store} />

      <motion.line x1={115} y1={38} x2={185} y2={38}
        stroke={C.sync} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }} />
      <text x={150} y={30} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">updates 요청</text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <ModuleBox x={190} y={14} w={110} h={48}
          label="Beacon API" sub="light_client/updates" color={C.sync} />
      </motion.g>

      {/* 응답 → BLS 검증 */}
      <motion.line x1={300} y1={58} x2={300} y2={85}
        stroke={C.sync} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <ActionBox x={240} y={90} w={120} h={30}
          label="BLS 서명 검증" sub="sync committee" color={C.sync} />
        {/* 체크마크 */}
        <text x={370} y={108} fontSize={14} fontWeight={700}
          fill={C.sync}>{'✓'}</text>
      </motion.g>

      {/* header 갱신 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <rect x={15} y={90} width={190} height={30} rx={6}
          fill="var(--card)" stroke={C.sync} strokeWidth={0.8} />
        <text x={110} y={103} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">
          finalized_header 갱신
        </text>
        <text x={110} y={115} textAnchor="middle" fontSize={8}
          fill={C.sync}>8000000 → 8000001</text>
      </motion.g>

      {/* 하단 */}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.sync}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        이제 eth_getBalance, eth_call 사용 가능
      </motion.text>
    </g>
  );
}

/** Step 5: 에러 케이스 */
export function Step5() {
  const errors = [
    { label: 'CheckpointTooOld', sub: 'weak subjectivity 초과 (2주+)', y: 30 },
    { label: 'InvalidCommitteeBranch', sub: 'Merkle 검증 실패', y: 86 },
    { label: 'NetworkMismatch', sub: 'genesis_validators_root 불일치', y: 142 },
  ];
  const causes = [
    '체크포인트 슬롯이 현재보다 너무 오래됨',
    'branch 해시 체인 결과 ≠ state_root',
    '다른 네트워크(메인넷/세폴리아) 혼용',
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={C.error}>부트스트랩 실패 원인</text>

      {errors.map((e, i) => (
        <motion.g key={e.label}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}>
          <AlertBox x={30} y={e.y} w={200} h={48}
            label={e.label} sub={e.sub} color={C.error} />
          {/* 원인 텍스트 */}
          <text x={250} y={e.y + 28} fontSize={8}
            fill="var(--muted-foreground)">{causes[i]}</text>
        </motion.g>
      ))}
    </g>
  );
}
