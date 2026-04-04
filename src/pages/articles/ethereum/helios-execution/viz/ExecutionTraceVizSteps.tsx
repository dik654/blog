import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ExecutionTraceVizData';

/** Step 0: eth_call 흐름 -- 4단계 수평 파이프라인 */
export function Step0() {
  const stages = [
    { x: 8,   label: 'ProofDB',   sub: '::new(rpc, blk)', color: C.call },
    { x: 118, label: 'Evm::builder', sub: '.with_db(db)',  color: C.call },
    { x: 228, label: 'transact()', sub: 'EVM 실행',        color: C.call },
    { x: 348, label: 'output()',   sub: '결과 추출',        color: C.call },
  ];

  return (
    <g>
      {/* 화살표 마커 */}
      <defs>
        <marker id="etArrow" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.call} />
        </marker>
      </defs>

      {/* 제목 */}
      <text x={240} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.call}>
        call() -- eth_call 실행 경로
      </text>

      {/* 4 stage 순차 등장 */}
      {stages.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.25 }}>
          <ModuleBox x={s.x} y={40} w={100} h={48} label={s.label}
            sub={s.sub} color={s.color} />

          {/* 단계 번호 뱃지 */}
          <circle cx={s.x + 8} cy={38} r={8} fill={C.call} opacity={0.15} />
          <text x={s.x + 8} y={42} textAnchor="middle" fontSize={8}
            fontWeight={700} fill={C.call}>{i + 1}</text>

          {/* 화살표 (마지막 제외) */}
          {i < stages.length - 1 && (
            <motion.line
              x1={s.x + 104} y1={64} x2={stages[i + 1].x - 4} y2={64}
              stroke={C.call} strokeWidth={1} markerEnd="url(#etArrow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.25 + 0.15, duration: 0.25 }}
            />
          )}
        </motion.g>
      ))}

      {/* 하단: 코드 대응 박스 */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}>
        <rect x={30} y={108} width={420} height={72} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

        {/* 의사 코드 */}
        <text x={46} y={126} fontSize={8} fontWeight={600}
          fill={C.call} fontFamily="monospace">
          let db = ProofDB::new(&amp;self.rpc, self.block);
        </text>
        <text x={46} y={140} fontSize={8} fontWeight={600}
          fill={C.call} fontFamily="monospace">
          let evm = Evm::builder().with_db(db).build();
        </text>
        <text x={46} y={154} fontSize={8} fontWeight={600}
          fill={C.call} fontFamily="monospace">
          let result = evm.transact()?;
        </text>
        <text x={46} y={168} fontSize={8} fontWeight={600}
          fill={C.call} fontFamily="monospace">
          Ok(result.output())
        </text>

        {/* 우측 주석 */}
        <text x={340} y={126} fontSize={7} fill="var(--muted-foreground)">
          // 가상 DB 생성
        </text>
        <text x={340} y={140} fontSize={7} fill="var(--muted-foreground)">
          // revm 빌드
        </text>
        <text x={340} y={154} fontSize={7} fill="var(--muted-foreground)">
          // 로컬 실행
        </text>
        <text x={340} y={168} fontSize={7} fill="var(--muted-foreground)">
          // Bytes 반환
        </text>
      </motion.g>

      {/* 핵심 포인트 */}
      <motion.text x={240} y={196} textAnchor="middle" fontSize={8}
        fontWeight={600} fill={C.call}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}>
        EVM 코드는 Reth와 동일 -- DB 레이어(ProofDB)만 교체
      </motion.text>
    </g>
  );
}

/** Step 1: Lazy Proof Loading -- EVM이 주소 접근 시점에 증명 요청 */
export function Step1() {
  return (
    <g>
      {/* 화살표 마커 */}
      <defs>
        <marker id="lpArrow" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.proof} />
        </marker>
        <marker id="lpArrowC" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.cache} />
        </marker>
      </defs>

      <text x={240} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.proof}>
        Lazy Proof Loading -- 접근 시점에 증명 요청
      </text>

      {/* EVM 모듈 */}
      <motion.g
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <ModuleBox x={8} y={34} w={80} h={48} label="revm" sub="EVM 실행" color={C.call} />
      </motion.g>

      {/* 화살표: EVM → ProofDB */}
      <motion.line x1={92} y1={58} x2={128} y2={58}
        stroke={C.proof} strokeWidth={1.2} markerEnd="url(#lpArrow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }} />
      <motion.text x={110} y={51} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}>
        basic_account(addr)
      </motion.text>

      {/* ProofDB 모듈 -- 중앙 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <ModuleBox x={132} y={34} w={100} h={48} label="ProofDB"
          sub="가상 DB" color={C.proof} />
      </motion.g>

      {/* 분기: 캐시 히트 vs 미스 */}

      {/* 상단 경로: 캐시 히트 */}
      <motion.g
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        <motion.path
          d="M 236 50 Q 260 50, 280 36"
          fill="none" stroke={C.cache} strokeWidth={1}
          markerEnd="url(#lpArrowC)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }} />
        <DataBox x={284} y={22} w={82} h={28} label="Cache Hit"
          sub="즉시 반환" color={C.cache} />
        <text x={384} y={36} fontSize={7} fill={C.cache} fontWeight={600}>
          ~0ms
        </text>
        <text x={384} y={47} fontSize={7} fill="var(--muted-foreground)">
          HashMap 조회
        </text>
      </motion.g>

      {/* 하단 경로: 캐시 미스 → RPC */}
      <motion.g
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}>
        <motion.path
          d="M 236 72 Q 260 72, 280 86"
          fill="none" stroke={C.rpc} strokeWidth={1.2}
          markerEnd="url(#lpArrow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }} />
        <ActionBox x={284} y={72} w={82} h={32} label="RPC get_proof"
          sub="eth_getProof" color={C.rpc} />
      </motion.g>

      {/* RPC → 검증 → 캐시 저장 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        <motion.line x1={370} y1={88} x2={400} y2={88}
          stroke={C.proof} strokeWidth={1} markerEnd="url(#lpArrow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 0.2 }} />
        <ActionBox x={404} y={72} w={68} h={32} label="verify"
          sub="MPT 검증" color={C.proof} />
      </motion.g>

      {/* 캐시 저장 경로 (위로 올라감) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}>
        <motion.path
          d="M 438 72 L 438 50 Q 438 42, 430 42 L 372 42"
          fill="none" stroke={C.cache} strokeWidth={0.8} strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.4, duration: 0.3 }} />
        <text x={420} y={56} fontSize={7} fill={C.cache}>
          캐시 저장
        </text>
      </motion.g>

      {/* 하단 설명 박스 */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}>
        <rect x={30} y={118} width={420} height={62} rx={8}
          fill="var(--card)" stroke={C.proof} strokeWidth={0.5} />

        {/* 세 줄 설명 */}
        <circle cx={48} cy={134} r={3} fill={C.proof} />
        <text x={58} y={137} fontSize={8} fill="var(--foreground)">
          EVM이 접근하지 않는 주소 = 증명 요청 없음 (대역폭 절약)
        </text>

        <circle cx={48} cy={150} r={3} fill={C.cache} />
        <text x={58} y={153} fontSize={8} fill="var(--foreground)">
          한 번 검증한 증명은 HashMap에 캐시 (동일 주소 재접근 시 ~0ms)
        </text>

        <circle cx={48} cy={166} r={3} fill={C.rpc} />
        <text x={58} y={169} fontSize={8} fill="var(--foreground)">
          첫 접근만 RPC 왕복 (~50ms) + Merkle 검증 (~0.1ms)
        </text>
      </motion.g>

      {/* 핵심 */}
      <motion.text x={240} y={196} textAnchor="middle" fontSize={8}
        fontWeight={600} fill={C.proof}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}>
        Lazy = 필요할 때만 요청 -- 불필요한 증명 전송 방지
      </motion.text>
    </g>
  );
}
