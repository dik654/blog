import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './NetworkConfigVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay: d, duration: 0.3 } });

/* ================================================================
   Step 0 — Network enum 3 변형 카드: Mainnet / Sepolia / Holesky
   각 카드에 chain_id + genesis_root 표시
   ================================================================ */
export function Step0() {
  const nets = [
    { label: 'Mainnet', sub: 'chain_id: 1', color: C.mainnet, root: '0x4b36…3907' },
    { label: 'Sepolia', sub: 'chain_id: 11155111', color: C.sepolia, root: '0xd8ea…4f27' },
    { label: 'Holesky', sub: 'chain_id: 17000', color: C.holesky, root: '0x9143…a7f3' },
  ];

  return (
    <g>
      {/* enum 타이틀 */}
      <motion.g {...fade(0)}>
        <text x={240} y={18} textAnchor="middle"
          fontSize={10} fontWeight={700} fill="var(--foreground)" opacity={0.5}>
          enum Network
        </text>
      </motion.g>

      {/* 3개 네트워크 카드 */}
      {nets.map((n, i) => (
        <motion.g key={n.label} {...fade(0.15 + i * 0.2)}>
          <ModuleBox x={20 + i * 155} y={32} w={140} h={56} label={n.label} sub={n.sub} color={n.color} />
        </motion.g>
      ))}

      {/* genesis_validators_root 영역 */}
      <motion.g {...fade(0.7)}>
        <rect x={20} y={100} width={440} height={40} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={115} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          genesis_validators_root (네트워크마다 다름)
        </text>
        {nets.map((n, i) => (
          <text key={i} x={90 + i * 155} y={132} textAnchor="middle"
            fontSize={7.5} fontFamily="monospace" fill={n.color}>
            {n.root}
          </text>
        ))}
      </motion.g>

      {/* 카드 → root 연결선 */}
      {nets.map((n, i) => (
        <motion.line key={`line-${i}`}
          x1={90 + i * 155} y1={88} x2={90 + i * 155} y2={100}
          stroke={n.color} strokeWidth={0.8} strokeDasharray="3 2"
          {...drawLine(0.8 + i * 0.1)} />
      ))}

      {/* fork_versions 뱃지 */}
      <motion.g {...fade(1.0)}>
        <DataBox x={50} y={152} w={100} h={28} label="Bellatrix 0x02" color={C.mainnet} />
        <DataBox x={190} y={152} w={100} h={28} label="Capella 0x03" color={C.sepolia} />
        <DataBox x={330} y={152} w={100} h={28} label="Deneb 0x04" color={C.holesky} />
      </motion.g>
    </g>
  );
}

/* ================================================================
   Step 1 — ConsensusSpec 시간 계산 시각화
   slot → epoch → period 쌓아가는 계단 + 시간 표기
   ================================================================ */
export function Step1() {
  /* 3단 계단: slot → epoch → period */
  const tiers = [
    { label: '1 Slot', time: '12초', w: 80, color: C.spec, x: 30, y: 110 },
    { label: '1 Epoch', time: '6.4분', w: 160, color: C.cl, x: 130, y: 110 },
    { label: '1 Period', time: '~27시간', w: 240, color: C.mainnet, x: 220, y: 110 },
  ];

  return (
    <g>
      {/* 타이틀 */}
      <motion.g {...fade(0)}>
        <text x={240} y={16} textAnchor="middle"
          fontSize={10} fontWeight={700} fill="var(--foreground)" opacity={0.5}>
          ConsensusSpec 시간 파라미터
        </text>
      </motion.g>

      {/* 수식 박스 — 곱셈 관계 */}
      <motion.g {...fade(0.2)}>
        <rect x={40} y={28} width={400} height={34} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={42} textAnchor="middle"
          fontSize={9} fontWeight={600} fill="var(--foreground)">
          slot(12s) x 32 = epoch(6.4m) x 256 = period(27.3h)
        </text>
        <text x={240} y={55} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          slots_per_epoch = 32 | epochs_per_period = 256 | 총 8,192 슬롯
        </text>
      </motion.g>

      {/* 3단 계단 시각화 — 왼쪽에서 오른쪽으로 확장 */}
      {tiers.map((t, i) => (
        <motion.g key={t.label} {...fade(0.4 + i * 0.25)}>
          {/* 계단 바 */}
          <rect x={t.x} y={t.y - i * 22} width={t.w} height={20} rx={4}
            fill={`${t.color}15`} stroke={t.color} strokeWidth={1} />
          <text x={t.x + t.w / 2} y={t.y - i * 22 + 13} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={t.color}>
            {t.label}
          </text>

          {/* 시간 뱃지 */}
          <rect x={t.x + t.w + 8} y={t.y - i * 22 + 2} width={50} height={16} rx={8}
            fill={`${t.color}10`} stroke={t.color} strokeWidth={0.5} />
          <text x={t.x + t.w + 33} y={t.y - i * 22 + 13} textAnchor="middle"
            fontSize={7.5} fontWeight={600} fill={t.color}>
            {t.time}
          </text>
        </motion.g>
      ))}

      {/* 곱하기 표시 (계단 사이) */}
      <motion.g {...fade(0.9)}>
        <text x={120} y={105} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C.spec}>x32</text>
        <text x={225} y={83} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C.cl}>x256</text>
      </motion.g>

      {/* Reth 비교 */}
      <motion.g {...fade(1.2)}>
        <rect x={55} y={145} width={370} height={38} rx={6}
          fill="var(--card)" stroke={C.muted} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={240} y={160} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.muted}>
          Reth (EL) 에는 slot/epoch/period 개념이 없다
        </text>
        <text x={240} y={174} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          ChainSpec에는 하드포크 블록 번호만 정의 — CL 파라미터 불필요
        </text>
      </motion.g>
    </g>
  );
}

/* ================================================================
   Step 2 — CL + EL 이중 RPC 연결
   Helios 중앙 → CL Beacon API (위) + EL JSON-RPC (아래)
   ================================================================ */
export function Step2() {
  return (
    <g>
      {/* Helios 중앙 노드 */}
      <motion.g {...fade(0)}>
        <ModuleBox x={175} y={70} w={130} h={55} label="Helios" sub="Light Client" color={C.helios} />
      </motion.g>

      {/* ── CL 영역 (상단) ── */}
      <motion.g {...fade(0.3)}>
        <ModuleBox x={15} y={10} w={140} h={50} label="CL Beacon API" sub="consensus_rpc" color={C.cl} />
      </motion.g>

      {/* CL API 경로 뱃지들 */}
      <motion.g {...fade(0.5)}>
        <DataBox x={15} y={68} w={130} h={24} label="/eth/v1/beacon/*" color={C.cl} />
      </motion.g>

      {/* Helios ← CL 연결선 */}
      <motion.line x1={155} y1={35} x2={175} y2={78}
        stroke={C.cl} strokeWidth={1.2} markerEnd="url(#arrowCL)"
        {...drawLine(0.4)} />

      {/* ── EL 영역 (상단 우측) ── */}
      <motion.g {...fade(0.6)}>
        <ModuleBox x={330} y={10} w={140} h={50} label="EL JSON-RPC" sub="execution_rpc" color={C.el} />
      </motion.g>

      {/* EL API 메서드 뱃지 */}
      <motion.g {...fade(0.8)}>
        <DataBox x={335} y={68} w={130} h={24} label="eth_getProof" color={C.el} />
      </motion.g>

      {/* Helios ← EL 연결선 */}
      <motion.line x1={330} y1={35} x2={305} y2={78}
        stroke={C.el} strokeWidth={1.2} markerEnd="url(#arrowEL)"
        {...drawLine(0.7)} />

      {/* ── 데이터 흐름 설명 ── */}
      <motion.g {...fade(0.9)}>
        <ActionBox x={30} y={102} w={115} h={34} label="헤더·업데이트 수신" sub="서명 검증" color={C.cl} />
        <ActionBox x={335} y={102} w={115} h={34} label="상태 증명 요청" sub="Merkle 검증" color={C.el} />
      </motion.g>

      {/* ── Reth 비교 (하단) ── */}
      <motion.g {...fade(1.1)}>
        <rect x={60} y={148} width={360} height={38} rx={6}
          fill="var(--card)" stroke={C.muted} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={240} y={163} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.muted}>
          Reth: 자체 API 제공 (EL: 8545, Engine: 8551)
        </text>
        <text x={240} y={177} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          풀노드는 외부 RPC 의존 없음 — Helios는 두 외부 엔드포인트 필수
        </text>
      </motion.g>

      {/* marker 정의 */}
      <defs>
        <marker id="arrowCL" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.cl} />
        </marker>
        <marker id="arrowEL" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.el} />
        </marker>
      </defs>
    </g>
  );
}
