import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './EncodingVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.3 },
});

/* ================================================================
   Step 0 — SSZ: BeaconBlockHeader 5필드 → 32B 청크 → hash_tree_root
   ================================================================ */
export function Step0() {
  const fields = [
    { name: 'slot', size: '8B', pad: '→ 32B 패딩' },
    { name: 'proposer', size: '8B', pad: '→ 32B 패딩' },
    { name: 'parent_root', size: '32B', pad: '그대로' },
    { name: 'state_root', size: '32B', pad: '그대로' },
    { name: 'body_root', size: '32B', pad: '그대로' },
  ];

  return (
    <g>
      {/* 좌측: 원본 필드 */}
      <motion.g {...fade(0)}>
        <text x={45} y={14} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.ssz}>원본 필드</text>
      </motion.g>

      {fields.map((f, i) => (
        <motion.g key={f.name} {...fade(0.05 + i * 0.08)}>
          <rect x={10} y={20 + i * 24} width={70} height={20} rx={4}
            fill={`${C.ssz}10`} stroke={C.ssz} strokeWidth={0.6} />
          <text x={45} y={20 + i * 24 + 13} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={C.ssz} fontFamily="monospace">
            {f.name}
          </text>
          <text x={92} y={20 + i * 24 + 13}
            fontSize={7} fill="var(--muted-foreground)">{f.size}</text>
        </motion.g>
      ))}

      {/* 화살표: 필드 → 청크 */}
      <motion.path
        d="M 105 80 L 130 80"
        fill="none" stroke={C.chunk} strokeWidth={1}
        markerEnd="url(#arrowChunk)"
        {...drawLine(0.4)}
      />

      {/* 중앙: 32B 청크 4개 (slot+proposer 합침 → chunk0) */}
      <motion.g {...fade(0.45)}>
        <text x={180} y={14} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.chunk}>32B 청크</text>
      </motion.g>

      {[
        { label: 'slot+prop', desc: '패딩 → 32B' },
        { label: 'parent_root', desc: '32B' },
        { label: 'state_root', desc: '32B' },
        { label: 'body_root', desc: '32B' },
      ].map((ch, i) => (
        <motion.g key={ch.label} {...fade(0.5 + i * 0.08)}>
          <rect x={135} y={22 + i * 28} width={90} height={22} rx={4}
            fill={`${C.chunk}12`} stroke={C.chunk} strokeWidth={0.8} />
          <text x={180} y={22 + i * 28 + 10} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={C.chunk} fontFamily="monospace">
            {ch.label}
          </text>
          <text x={180} y={22 + i * 28 + 20} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">{ch.desc}</text>
        </motion.g>
      ))}

      {/* 화살표: 청크 → Merkle 트리 */}
      <motion.path
        d="M 230 75 L 260 75"
        fill="none" stroke={C.merkle} strokeWidth={1}
        markerEnd="url(#arrowMerkle)"
        {...drawLine(0.8)}
      />

      {/* 우측: Merkle 트리 */}
      <motion.g {...fade(0.85)}>
        <text x={370} y={14} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.merkle}>바이너리 Merkle 트리</text>
      </motion.g>

      {/* 리프 4개 */}
      {['C0', 'C1', 'C2', 'C3'].map((label, i) => (
        <motion.g key={label} {...fade(0.9 + i * 0.05)}>
          <rect x={270 + i * 50} y={130} width={40} height={18} rx={3}
            fill={`${C.chunk}12`} stroke={C.chunk} strokeWidth={0.6} />
          <text x={290 + i * 50} y={142} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={C.chunk}>{label}</text>
        </motion.g>
      ))}

      {/* 내부 노드 2개 */}
      {['H(0,1)', 'H(2,3)'].map((label, i) => (
        <motion.g key={label} {...fade(1.1 + i * 0.08)}>
          <rect x={295 + i * 100} y={96} width={55} height={22} rx={4}
            fill={`${C.merkle}18`} stroke={C.merkle} strokeWidth={0.8} />
          <text x={322 + i * 100} y={110} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={C.merkle}>{label}</text>
          {/* 리프로 연결선 */}
          <line x1={310 + i * 100} y1={118} x2={290 + i * 100} y2={130}
            stroke={C.merkle} strokeWidth={0.5} opacity={0.5} />
          <line x1={335 + i * 100} y1={118} x2={340 + i * 100} y2={130}
            stroke={C.merkle} strokeWidth={0.5} opacity={0.5} />
        </motion.g>
      ))}

      {/* 루트 */}
      <motion.g {...fade(1.3)}>
        <rect x={325} y={54} width={90} height={28} rx={6}
          fill={`${C.merkle}25`} stroke={C.merkle} strokeWidth={1.5} />
        <text x={370} y={72} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.merkle}>root (32B)</text>
        {/* 루트 → 내부 노드 연결선 */}
        <line x1={350} y1={82} x2={322} y2={96}
          stroke={C.merkle} strokeWidth={0.5} opacity={0.5} />
        <line x1={390} y1={82} x2={422} y2={96}
          stroke={C.merkle} strokeWidth={0.5} opacity={0.5} />
      </motion.g>

      {/* 하단 라벨 */}
      <motion.g {...fade(1.4)}>
        <rect x={85} y={165} width={310} height={26} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={181} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          hash_tree_root: #[derive(TreeHash)]가 자동 생성
        </text>
      </motion.g>

      {/* markers */}
      <defs>
        <marker id="arrowChunk" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.chunk} />
        </marker>
        <marker id="arrowMerkle" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.merkle} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 1 — Fork 타임라인: Bellatrix → Capella → Deneb
   ================================================================ */
export function Step1() {
  const forks = [
    { name: 'Bellatrix', version: '0x02000000', epoch: '144896', x: 30, w: 120, note: 'The Merge' },
    { name: 'Capella', version: '0x03000000', epoch: '194048', x: 175, w: 120, note: '출금 활성화' },
    { name: 'Deneb', version: '0x04000000', epoch: '269568', x: 320, w: 120, note: 'Blob (EIP-4844)' },
  ];

  return (
    <g>
      {/* 수평 타임라인 */}
      <line x1={20} y1={70} x2={460} y2={70}
        stroke="var(--border)" strokeWidth={1} />
      <motion.polygon points="458,66 458,74 466,70"
        fill="var(--muted-foreground)" {...fade(0.5)} />

      {/* 포크 카드 */}
      {forks.map((f, i) => (
        <motion.g key={f.name} {...fade(i * 0.2)}>
          {/* 카드 */}
          <rect x={f.x} y={26} width={f.w} height={36} rx={6}
            fill={`${C.fork}10`} stroke={C.fork} strokeWidth={0.8} />
          <text x={f.x + f.w / 2} y={40} textAnchor="middle"
            fontSize={10} fontWeight={700} fill={C.fork}>{f.name}</text>
          <text x={f.x + f.w / 2} y={54} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">{f.note}</text>

          {/* 타임라인 틱 */}
          <line x1={f.x + f.w / 2} y1={62} x2={f.x + f.w / 2} y2={78}
            stroke={C.fork} strokeWidth={1.5} />
          <circle cx={f.x + f.w / 2} cy={70} r={3}
            fill={C.fork} />

          {/* 버전 + 에폭 */}
          <text x={f.x + f.w / 2} y={90} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={C.fork} fontFamily="monospace">
            {f.version}
          </text>
          <text x={f.x + f.w / 2} y={102} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">
            epoch {f.epoch}
          </text>

          {/* 경계 화살표 */}
          {i > 0 && (
            <motion.line
              x1={forks[i - 1].x + forks[i - 1].w + 5} y1={44}
              x2={f.x - 5} y2={44}
              stroke={C.fork} strokeWidth={0.8}
              markerEnd="url(#arrowFork)"
              {...drawLine(0.3 + i * 0.15)}
            />
          )}
        </motion.g>
      ))}

      {/* Fork 구조체 설명 */}
      <motion.g {...fade(0.7)}>
        <rect x={50} y={115} width={380} height={50} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={132} textAnchor="middle"
          fontSize={8} fontWeight={700} fill="var(--foreground)">
          Fork = previous_version(4B) + current_version(4B) + epoch
        </text>
        <text x={240} y={146} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          Helios는 fork_version으로 서명 검증 시 올바른 포크인지 확인한다
        </text>
        <text x={240} y={158} textAnchor="middle"
          fontSize={7} fill={C.fork} opacity={0.7}>
          같은 메시지도 포크가 다르면 다른 서명 → 리플레이 공격 차단
        </text>
      </motion.g>

      {/* marker */}
      <defs>
        <marker id="arrowFork" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.fork} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 2 — Domain 합성: domain_type + fork_data_root → domain
   ================================================================ */
export function Step2() {
  return (
    <g>
      {/* ── 1단계: ForkData 생성 ── */}
      <motion.g {...fade(0)}>
        <text x={120} y={14} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.fork}>1단계: ForkData</text>
      </motion.g>

      <motion.g {...fade(0.1)}>
        <DataBox x={15} y={22} w={85} h={30} label="fork_version" sub="4 bytes" color={C.fork} />
      </motion.g>
      <motion.g {...fade(0.15)}>
        <text x={108} y={40} textAnchor="middle"
          fontSize={9} fill="var(--muted-foreground)">+</text>
      </motion.g>
      <motion.g {...fade(0.2)}>
        <DataBox x={118} y={22} w={105} h={30} label="genesis_val_root" sub="32 bytes" color={C.fork} />
      </motion.g>

      {/* 화살표: ForkData → hash */}
      <motion.path
        d="M 230 37 L 260 37"
        fill="none" stroke={C.merkle} strokeWidth={1}
        markerEnd="url(#arrowDom)"
        {...drawLine(0.3)}
      />

      <motion.g {...fade(0.35)}>
        <ActionBox x={265} y={20} w={95} h={36} label="SSZ hash" sub="hash_tree_root" color={C.merkle} />
      </motion.g>

      {/* 화살표: hash → fork_data_root */}
      <motion.path
        d="M 365 38 L 380 38"
        fill="none" stroke={C.merkle} strokeWidth={1}
        markerEnd="url(#arrowDom)"
        {...drawLine(0.4)}
      />

      <motion.g {...fade(0.45)}>
        <DataBox x={385} y={22} w={85} h={30} label="fork_data_root" sub="32 bytes" color={C.merkle} />
      </motion.g>

      {/* ── 2단계: Domain 합성 ── */}
      <motion.g {...fade(0.55)}>
        <text x={120} y={78} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.domain}>2단계: Domain 합성</text>
      </motion.g>

      <motion.g {...fade(0.6)}>
        <rect x={15} y={86} width={100} height={36} rx={6}
          fill={`${C.domain}10`} stroke={C.domain} strokeWidth={0.8} />
        <text x={65} y={100} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.domain} fontFamily="monospace">
          domain_type
        </text>
        <text x={65} y={113} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">4 bytes</text>
      </motion.g>

      <motion.g {...fade(0.65)}>
        <text x={126} y={107} textAnchor="middle"
          fontSize={9} fill="var(--muted-foreground)">+</text>
      </motion.g>

      <motion.g {...fade(0.7)}>
        <rect x={138} y={86} width={120} height={36} rx={6}
          fill={`${C.merkle}10`} stroke={C.merkle} strokeWidth={0.8} />
        <text x={198} y={100} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.merkle} fontFamily="monospace">
          fork_data_root[:28]
        </text>
        <text x={198} y={113} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">앞 28 bytes만 사용</text>
      </motion.g>

      {/* 화살표: → Domain */}
      <motion.path
        d="M 262 104 L 290 104"
        fill="none" stroke={C.domain} strokeWidth={1}
        markerEnd="url(#arrowDom)"
        {...drawLine(0.75)}
      />

      <motion.g {...fade(0.8)}>
        <ModuleBox x={295} y={82} w={110} h={44} label="Domain" sub="32 bytes (4+28)" color={C.domain} />
      </motion.g>

      {/* ── 3단계: signing_root ── */}
      <motion.g {...fade(0.9)}>
        <text x={120} y={145} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.domain}>3단계: signing_root</text>
      </motion.g>

      <motion.g {...fade(0.95)}>
        <DataBox x={15} y={152} w={80} h={30} label="msg_root" sub="헤더 해시" color={C.ssz} />
      </motion.g>

      <motion.g {...fade(0.98)}>
        <text x={106} y={170} textAnchor="middle"
          fontSize={9} fill="var(--muted-foreground)">+</text>
      </motion.g>

      <motion.g {...fade(1.0)}>
        <DataBox x={118} y={152} w={70} h={30} label="domain" sub="32B" color={C.domain} />
      </motion.g>

      <motion.path
        d="M 195 167 L 220 167"
        fill="none" stroke={C.domain} strokeWidth={1}
        markerEnd="url(#arrowDom)"
        {...drawLine(1.05)}
      />

      <motion.g {...fade(1.1)}>
        <ActionBox x={225} y={150} w={90} h={34} label="SSZ hash" sub="SigningData" color={C.domain} />
      </motion.g>

      <motion.path
        d="M 320 167 L 345 167"
        fill="none" stroke={C.domain} strokeWidth={1}
        markerEnd="url(#arrowDom)"
        {...drawLine(1.15)}
      />

      <motion.g {...fade(1.2)}>
        <ModuleBox x={350} y={148} w={110} h={38} label="signing_root" sub="→ BLS 서명 메시지" color={C.domain} />
      </motion.g>

      {/* 용도별 domain_type 예시 */}
      <motion.g {...fade(1.3)}>
        <rect x={295} y={135} width={110} height={10} rx={2}
          fill="var(--card)" stroke="none" />
        <text x={350} y={143} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          0x07 SYNC_COMMITTEE
        </text>
      </motion.g>

      {/* markers */}
      <defs>
        <marker id="arrowDom" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.domain} />
        </marker>
      </defs>
    </g>
  );
}
