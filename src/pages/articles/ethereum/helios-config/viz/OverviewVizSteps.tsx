import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

/* ── Step 0: Reth CLI 터미널 vs Helios 코드 빌더 ──────── */
export function Step0() {
  /* Reth CLI 영역 — 터미널 느낌 */
  const rethLines = [
    '$ reth node \\',
    '    --chain mainnet \\',
    '    --http --http.port 8545 \\',
    '    --datadir /data/reth',
  ];

  /* Helios 코드 영역 — 빌더 패턴 */
  const heliosLines = [
    'let client = ClientBuilder::new()',
    '    .network(Network::Mainnet)',
    '    .consensus_rpc("http://...")',
    '    .execution_rpc("http://...")',
    '    .build()?;',
  ];

  return (
    <g>
      {/* ── 상단 라벨 ── */}
      <text x={120} y={16} textAnchor="middle" fontSize={9}
        fontWeight={700} fill={C.reth}>독립 프로세스</text>
      <text x={360} y={16} textAnchor="middle" fontSize={9}
        fontWeight={700} fill={C.helios}>라이브러리 임베딩</text>

      {/* ── 왼쪽: Reth CLI 터미널 ── */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}>
        {/* 터미널 외곽 */}
        <rect x={10} y={24} width={220} height={108} rx={8}
          fill="#1e1e2e" stroke={C.reth} strokeWidth={1} />
        {/* 터미널 타이틀바 */}
        <rect x={10} y={24} width={220} height={18} rx={0} fill={C.reth} opacity={0.15}
          clipPath="url(#rethTermClip)" />
        <defs>
          <clipPath id="rethTermClip">
            <rect x={10} y={24} width={220} height={108} rx={8} />
          </clipPath>
        </defs>
        {/* 트래픽 라이트 */}
        <circle cx={24} cy={33} r={3} fill="#ef4444" opacity={0.7} />
        <circle cx={34} cy={33} r={3} fill={C.reth} opacity={0.7} />
        <circle cx={44} cy={33} r={3} fill={C.chain} opacity={0.7} />
        <text x={120} y={37} textAnchor="middle" fontSize={7}
          fill="#94a3b8">terminal</text>

        {/* CLI 라인 */}
        {rethLines.map((line, i) => (
          <motion.text key={i}
            x={20} y={56 + i * 16}
            fontSize={8} fontFamily="monospace" fill="#e2e8f0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.12 }}>
            {line}
          </motion.text>
        ))}

        {/* 커서 깜빡임 */}
        <motion.rect
          x={20} y={116} width={6} height={10} rx={1}
          fill={C.reth}
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 0.8, duration: 1, repeat: Infinity }}
        />
      </motion.g>

      {/* ── 중앙: vs 구분 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <line x1={240} y1={30} x2={240} y2={130}
          stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3" />
        <rect x={224} y={70} width={32} height={18} rx={9}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
        <text x={240} y={82.5} textAnchor="middle" fontSize={8}
          fontWeight={700} fill="var(--muted-foreground)">vs</text>
      </motion.g>

      {/* ── 오른쪽: Helios 코드 빌더 ── */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}>
        {/* 코드 외곽 */}
        <rect x={250} y={24} width={220} height={108} rx={8}
          fill="#1e1e2e" stroke={C.helios} strokeWidth={1} />
        {/* 코드 타이틀바 */}
        <rect x={250} y={24} width={220} height={18} rx={0} fill={C.helios} opacity={0.15}
          clipPath="url(#heliosCodeClip)" />
        <defs>
          <clipPath id="heliosCodeClip">
            <rect x={250} y={24} width={220} height={108} rx={8} />
          </clipPath>
        </defs>
        <text x={360} y={37} textAnchor="middle" fontSize={7}
          fill="#94a3b8">main.rs</text>

        {/* 코드 라인 */}
        {heliosLines.map((line, i) => (
          <motion.text key={i}
            x={260} y={56 + i * 14}
            fontSize={8} fontFamily="monospace" fill="#c4b5fd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.12 }}>
            {line}
          </motion.text>
        ))}
      </motion.g>

      {/* ── 하단 비교 라벨 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1 }}>
        <ModuleBox x={18} y={140} w={102} h={38} label="reth node"
          sub="CLI 플래그 + TOML" color={C.reth} />
        <ActionBox x={140} y={142} w={82} h={34} label="→ 독립 프로세스"
          sub="자체 실행" color={C.reth} />

        <ModuleBox x={258} y={140} w={102} h={38} label="ClientBuilder"
          sub="메서드 체이닝" color={C.helios} />
        <ActionBox x={380} y={142} w={82} h={34} label="→ 앱에 임베딩"
          sub="WASM / 모바일" color={C.helios} />
      </motion.g>

      {/* 하단 결론 텍스트 */}
      <motion.text x={240} y={196} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        Helios는 라이브러리로 사용 — 프로그래밍 방식 설정이 필수
      </motion.text>
    </g>
  );
}

/* ── Step 1: ClientBuilder 체이닝 시각화 ──────────── */
export function Step1() {
  const methods = [
    { label: '.network()', desc: 'Mainnet', color: C.chain, icon: 'N' },
    { label: '.consensus_rpc()', desc: 'Beacon API', color: C.helios, icon: 'C' },
    { label: '.execution_rpc()', desc: 'JSON-RPC', color: C.helios, icon: 'E' },
    { label: '.checkpoint()', desc: '0xab12..', color: C.accent, icon: 'K' },
  ];

  const buildX = 400;

  return (
    <g>
      {/* ── ClientBuilder 시작점 ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <ModuleBox x={10} y={16} w={110} h={40} label="ClientBuilder"
          sub="::new()" color={C.helios} />
      </motion.g>

      {/* ── 체이닝 화살표 + 메서드 박스 ── */}
      {methods.map((m, i) => {
        const boxY = 70 + i * 30;
        const boxX = 30 + i * 20;
        return (
          <motion.g key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.18 }}>

            {/* 세로 연결선 — 이전 박스에서 내려옴 */}
            {i === 0 ? (
              <path d={`M 65 56 L 65 ${boxY + 4} L ${boxX} ${boxY + 4}`}
                stroke={C.helios} strokeWidth={1} fill="none"
                strokeDasharray="3 2" opacity={0.5} />
            ) : (
              <path d={`M ${boxX - 20 + 65} ${boxY - 12} L ${boxX + 65} ${boxY + 4}`}
                stroke={m.color} strokeWidth={1} fill="none"
                strokeDasharray="3 2" opacity={0.5} />
            )}

            {/* 원형 아이콘 */}
            <circle cx={boxX + 12} cy={boxY + 14} r={10}
              fill={`${m.color}20`} stroke={m.color} strokeWidth={0.8} />
            <text x={boxX + 12} y={boxY + 18} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={m.color}>{m.icon}</text>

            {/* 메서드 이름 */}
            <text x={boxX + 28} y={boxY + 10} fontSize={9}
              fontWeight={600} fontFamily="monospace" fill="var(--foreground)">
              {m.label}
            </text>
            {/* 값 */}
            <text x={boxX + 28} y={boxY + 22} fontSize={7.5}
              fill="var(--muted-foreground)">{m.desc}</text>

            {/* 수평 점선 → 오른쪽으로 */}
            <motion.line
              x1={boxX + 130} y1={boxY + 14}
              x2={buildX - 20} y2={boxY + 14}
              stroke={m.color} strokeWidth={0.6} strokeDasharray="2 2"
              opacity={0.3}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.18, duration: 0.3 }}
            />
          </motion.g>
        );
      })}

      {/* ── 오른쪽: .build() → Client 생성 ── */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}>
        {/* build 화살표 수렴 영역 */}
        <rect x={buildX - 16} y={65} width={3} height={98}
          rx={1.5} fill={C.helios} opacity={0.3} />

        {/* .build() 액션 */}
        <ActionBox x={buildX} y={84} w={68} h={34}
          label=".build()" sub="검증 + 생성" color={C.helios} />

        {/* 화살표 → Client */}
        <motion.path
          d={`M ${buildX + 40} 122 L ${buildX + 40} 142`}
          stroke={C.chain} strokeWidth={1.5} fill="none"
          markerEnd="url(#arrowBuild)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.3, duration: 0.3 }}
        />

        {/* Client 결과 */}
        <DataBox x={buildX - 2} y={146} w={84} h={32}
          label="Client" sub="사용 준비 완료" color={C.chain} />
      </motion.g>

      {/* ── 우측 하단: 핵심 3요소 요약 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}>
        <rect x={10} y={184} width={460} height={1}
          fill="var(--border)" opacity={0.4} />
        {[
          { label: 'Network', desc: '어떤 체인', color: C.chain },
          { label: 'RPC', desc: '어디서 가져올 것인가', color: C.helios },
          { label: 'Checkpoint', desc: '어떤 시점부터', color: C.accent },
        ].map((item, i) => (
          <g key={item.label}>
            <circle cx={40 + i * 170} cy={195} r={3}
              fill={item.color} />
            <text x={48 + i * 170} y={198} fontSize={8}
              fontWeight={600} fill="var(--foreground)">{item.label}</text>
            <text x={48 + i * 170} y={198} dx={item.label.length * 5 + 8}
              fontSize={7} fill="var(--muted-foreground)">{item.desc}</text>
          </g>
        ))}
      </motion.g>

      {/* 화살표 마커 */}
      <defs>
        <marker id="arrowBuild" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.chain} />
        </marker>
      </defs>
    </g>
  );
}
