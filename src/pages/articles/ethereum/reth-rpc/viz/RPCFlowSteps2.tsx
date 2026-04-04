import { motion } from 'framer-motion';

const C = { rpsee: '#6366f1', eth: '#10b981', engine: '#f59e0b', provider: '#8b5cf6' };

/* Step 2: jsonrpsee 매크로 라우팅 */
export function StepRouter() {
  const routes = [
    { ns: 'eth_*', target: 'EthApiServer', color: C.eth },
    { ns: 'engine_*', target: 'EngineApiServer', color: C.engine },
    { ns: 'debug_*', target: 'DebugApiServer', color: '#6b7280' },
  ];
  return (<g>
    <defs><marker id="rf-r" markerWidth={5} markerHeight={4} refX={4} refY={2} orient="auto">
      <path d="M0,0 L5,2 L0,4" fill={C.rpsee} /></marker></defs>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={20} width={100} height={75} rx={8} fill="var(--card)" stroke={C.rpsee} strokeWidth={1.2} />
      <rect x={30} y={20} width={100} height={5} rx={2.5} fill={C.rpsee} opacity={0.85} />
      <text x={80} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rpsee}>jsonrpsee</text>
      <text x={80} y={56} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">#[rpc] 매크로</text>
      <text x={80} y={69} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">namespace 파싱</text>
      <text x={80} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">자동 코드 생성</text>
    </motion.g>
    {routes.map((r, i) => (
      <motion.g key={r.ns} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + i * 0.15 }}>
        <line x1={135} y1={58} x2={195} y2={22 + i * 34} stroke={r.color} strokeWidth={0.7} markerEnd="url(#rf-r)" />
        <rect x={200} y={10 + i * 34} width={120} height={26} rx={5}
          fill={`${r.color}10`} stroke={r.color} strokeWidth={0.8} />
        <text x={230} y={27 + i * 34} fontSize={10} fontWeight={600} fill={r.color}>{r.ns}</text>
        <text x={350} y={27 + i * 34} fontSize={9} fill="var(--muted-foreground)">{r.target}</text>
      </motion.g>
    ))}
  </g>);
}

/* Step 3: EthApi / EngineApi 디스패치 */
export function StepDispatch() {
  const calls = [
    { method: 'eth_getBalance', handler: 'EthApi::balance()', color: C.eth },
    { method: 'eth_call', handler: 'EthApi::call()', color: C.eth },
    { method: 'engine_fcu', handler: 'EngineApi::fcu()', color: C.engine },
  ];
  return (<g>
    <defs><marker id="rf-d" markerWidth={5} markerHeight={4} refX={4} refY={2} orient="auto">
      <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" /></marker></defs>
    {calls.map((c, i) => (
      <motion.g key={c.method} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <rect x={20} y={15 + i * 34} width={120} height={24} rx={12}
          fill={`${c.color}12`} stroke={c.color} strokeWidth={0.8} />
        <text x={80} y={31 + i * 34} textAnchor="middle" fontSize={10} fill={c.color}>{c.method}</text>
        <motion.line x1={145} y1={27 + i * 34} x2={195} y2={27 + i * 34} stroke={c.color}
          strokeWidth={0.8} markerEnd="url(#rf-d)" initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: i * 0.15 + 0.2, duration: 0.3 }} />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.4 }}>
          <rect x={200} y={15 + i * 34} width={130} height={24} rx={6}
            fill="var(--card)" stroke={c.color} strokeWidth={0.6} />
          <rect x={200} y={15 + i * 34} width={3} height={24} rx={1.5} fill={c.color} />
          <text x={268} y={31 + i * 34} textAnchor="middle" fontSize={10}
            fill="var(--foreground)">{c.handler}</text>
        </motion.g>
      </motion.g>
    ))}
  </g>);
}

/* Step 4: Provider 쿼리 -> 응답 */
export function StepProvider() {
  const layers = ['BundleState', 'MDBX', 'StaticFile'];
  return (<g>
    <defs><marker id="rf-p" markerWidth={5} markerHeight={4} refX={4} refY={2} orient="auto">
      <path d="M0,0 L5,2 L0,4" fill={C.provider} /></marker></defs>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={20} y={30} width={75} height={50} rx={6} fill="var(--card)" stroke={C.eth} strokeWidth={0.8} />
      <rect x={20} y={30} width={3} height={50} rx={1.5} fill={C.eth} />
      <text x={60} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Handler</text>
      <text x={60} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">상태 조회</text>
    </motion.g>
    <motion.line x1={100} y1={55} x2={135} y2={55} stroke={C.provider} strokeWidth={0.8}
      markerEnd="url(#rf-p)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }} />
    {layers.map((l, i) => (
      <motion.g key={l} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 + i * 0.15 }}>
        <rect x={140} y={20 + i * 28} width={95} height={22} rx={4}
          fill={i === 0 ? `${C.provider}15` : 'var(--card)'} stroke={C.provider} strokeWidth={i === 0 ? 1.2 : 0.5} />
        <text x={187} y={35 + i * 28} textAnchor="middle" fontSize={10}
          fill={i === 0 ? C.provider : 'var(--muted-foreground)'}>{l}</text>
        {i < 2 && <text x={187} y={48 + i * 28} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">miss?</text>}
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <line x1={240} y1={31} x2={290} y2={55} stroke={C.provider} strokeWidth={0.6} />
      <rect x={295} y={38} width={100} height={34} rx={6} fill={`${C.eth}10`} stroke={C.eth} strokeWidth={0.8} />
      <text x={345} y={53} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.eth}>JSON Response</text>
      <text x={345} y={65} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">result: "0x1a3..."</text>
    </motion.g>
  </g>);
}
