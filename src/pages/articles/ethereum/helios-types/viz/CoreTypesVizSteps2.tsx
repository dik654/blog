import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './CoreTypesVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.3 },
});

/* ================================================================
   Step 2 — LightClientUpdate 7필드 흐름
   ================================================================ */
export function Step2() {
  const fields = [
    { name: 'attested_header', desc: '서명 대상 헤더', c: C.update, x: 15, y: 12, w: 130 },
    { name: 'next_committee', desc: '다음 위원회 공개키', c: '#10b981', x: 15, y: 48, w: 130 },
    { name: 'committee_branch', desc: 'Merkle 증명', c: '#10b981', x: 15, y: 84, w: 130 },
    { name: 'finalized_header', desc: '최종 확정 헤더', c: C.store, x: 15, y: 120, w: 130 },
    { name: 'finality_branch', desc: '최종성 증명', c: C.store, x: 15, y: 156, w: 130 },
  ];

  const rightFields = [
    { name: 'sync_aggregate', desc: 'BLS 서명+비트맵', c: C.agg, x: 280, y: 60, w: 130 },
    { name: 'signature_slot', desc: '서명 생성 슬롯', c: '#8b5cf6', x: 280, y: 100, w: 130 },
  ];

  return (
    <g>
      {/* 제목 */}
      <motion.g {...fade(0)}>
        <text x={240} y={10} textAnchor="middle"
          fontSize={9} fontWeight={700} fill="var(--foreground)">
          LightClientUpdate (7 fields)
        </text>
      </motion.g>

      {/* 좌측 5필드 */}
      {fields.map((f, i) => (
        <motion.g key={f.name} {...fade(0.1 + i * 0.1)}>
          <rect x={f.x} y={f.y} width={f.w} height={30} rx={5}
            fill={`${f.c}10`} stroke={f.c} strokeWidth={0.8} />
          <text x={f.x + 8} y={f.y + 13} fontSize={8} fontWeight={600}
            fill={f.c} fontFamily="monospace">{f.name}</text>
          <text x={f.x + 8} y={f.y + 24} fontSize={7}
            fill="var(--muted-foreground)">{f.desc}</text>
        </motion.g>
      ))}

      {/* 연결 화살표: attested → aggregate */}
      <motion.path
        d="M 150 27 L 180 27 L 180 75 L 275 75"
        fill="none" stroke={C.update} strokeWidth={0.8}
        markerEnd="url(#arrowUpdate)"
        {...drawLine(0.6)}
      />

      {/* 연결 화살표: committee → aggregate */}
      <motion.line
        x1={150} y1={63} x2={180} y2={63}
        stroke="#10b981" strokeWidth={0.8} strokeDasharray="3 2"
        {...drawLine(0.5)}
      />

      {/* 연결 화살표: finalized → aggregate */}
      <motion.path
        d="M 150 135 L 195 135 L 195 75 L 210 75"
        fill="none" stroke={C.store} strokeWidth={0.8} strokeDasharray="3 2"
        {...drawLine(0.7)}
      />

      {/* 중앙 검증 노드 */}
      <motion.g {...fade(0.65)}>
        <ActionBox x={200} y={55} w={68} h={38} label="검증 단위" sub="Update 1개" color={C.update} />
      </motion.g>

      {/* 우측 2필드 */}
      {rightFields.map((f, i) => (
        <motion.g key={f.name} {...fade(0.7 + i * 0.12)}>
          <rect x={f.x} y={f.y} width={f.w} height={30} rx={5}
            fill={`${f.c}10`} stroke={f.c} strokeWidth={0.8} />
          <text x={f.x + 8} y={f.y + 13} fontSize={8} fontWeight={600}
            fill={f.c} fontFamily="monospace">{f.name}</text>
          <text x={f.x + 8} y={f.y + 24} fontSize={7}
            fill="var(--muted-foreground)">{f.desc}</text>
        </motion.g>
      ))}

      {/* 중앙 → 우측 연결 */}
      <motion.line x1={268} y1={74} x2={275} y2={74}
        stroke={C.update} strokeWidth={0.8}
        markerEnd="url(#arrowUpdate)"
        {...drawLine(0.75)}
      />

      {/* 하단 설명 */}
      <motion.g {...fade(0.9)}>
        <rect x={25} y={155} width={430} height={30} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={171} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          attested_header의 서명을 sync_aggregate로 검증 → finalized_header 확정
        </text>
        <text x={240} y={182} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          committee_branch·finality_branch는 state_root 기준 Merkle 증명
        </text>
      </motion.g>

      {/* marker */}
      <defs>
        <marker id="arrowUpdate" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.update} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 3 — LightClientStore: Reth 700GB vs Helios 수KB
   ================================================================ */
export function Step3() {
  return (
    <g>
      {/* ── 좌측: Reth 풀노드 ── */}
      <motion.g {...fade(0)}>
        <text x={105} y={16} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.alert}>
          Reth (풀노드)
        </text>
      </motion.g>

      {/* MDBX 실린더 */}
      <motion.g {...fade(0.15)}>
        {/* 실린더 바디 */}
        <rect x={55} y={30} width={100} height={90} rx={4}
          fill={`${C.alert}0c`} stroke={C.alert} strokeWidth={0.8} />
        {/* 상단 타원 */}
        <ellipse cx={105} cy={32} rx={50} ry={10}
          fill={`${C.alert}15`} stroke={C.alert} strokeWidth={0.8} />
        {/* 하단 타원 */}
        <ellipse cx={105} cy={118} rx={50} ry={10}
          fill={`${C.alert}0c`} stroke={C.alert} strokeWidth={0.8} />
        <text x={105} y={68} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C.alert}>MDBX</text>
        <text x={105} y={82} textAnchor="middle"
          fontSize={8} fill={C.alert} opacity={0.7}>700GB+</text>
        <text x={105} y={95} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          accounts, storage,
        </text>
        <text x={105} y={106} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          receipts, headers...
        </text>
      </motion.g>

      {/* vs 구분선 */}
      <motion.g {...fade(0.4)}>
        <line x1={195} y1={20} x2={195} y2={185}
          stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3" />
        <rect x={183} y={80} width={24} height={18} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={195} y={93} textAnchor="middle"
          fontSize={8} fontWeight={700} fill="var(--muted-foreground)">vs</text>
      </motion.g>

      {/* ── 우측: Helios Store ── */}
      <motion.g {...fade(0.5)}>
        <text x={345} y={16} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.store}>
          Helios (라이트 클라이언트)
        </text>
      </motion.g>

      {/* Store 작은 박스 */}
      <motion.g {...fade(0.6)}>
        <rect x={260} y={26} width={170} height={130} rx={8}
          fill="var(--card)" stroke={C.store} strokeWidth={1} />
        <rect x={260} y={26} width={170} height={5} rx={2.5}
          fill={C.store} opacity={0.85} />
        <text x={345} y={46} textAnchor="middle"
          fontSize={9} fontWeight={700} fill="var(--foreground)">
          LightClientStore
        </text>
        <text x={345} y={58} textAnchor="middle"
          fontSize={7} fill={C.store} fontWeight={600}>
          수 KB (메모리)
        </text>
      </motion.g>

      {/* Store 내부 필드 목록 */}
      {[
        { name: 'finalized_header', c: C.update },
        { name: 'optimistic_header', c: C.store },
        { name: 'current_sync_committee', c: C.agg },
        { name: 'next_sync_committee', c: C.agg },
        { name: 'max_active_participants', c: C.muted },
      ].map((f, i) => (
        <motion.g key={f.name} {...fade(0.7 + i * 0.08)}>
          <rect x={270} y={64 + i * 17} width={150} height={14} rx={3}
            fill={`${f.c}0c`} stroke={f.c} strokeWidth={0.5} />
          <text x={278} y={64 + i * 17 + 10.5} fontSize={7.5} fontWeight={500}
            fill={f.c} fontFamily="monospace">{f.name}</text>
        </motion.g>
      ))}

      {/* 하단 비교 정보 */}
      <motion.g {...fade(1.1)}>
        <rect x={30} y={158} width={420} height={30} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={174} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          Reth: 디스크 700GB + 풀 동기화 수 시간
        </text>
        <text x={240} y={185} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          Helios: 메모리 수KB + checkpoint에서 수 초 부트스트랩
        </text>
      </motion.g>
    </g>
  );
}
