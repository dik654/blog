import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ExecutionTraceVizData';

/** Step 2: estimate_gas -- eth_call + 10% 마진 */
export function Step2() {
  const barX = 60;
  const barY = 104;
  const barW = 360;
  const barH = 20;
  const gasUsed = 0.72;        // 72% 사용 예시
  const margin = gasUsed * 0.1; // 10% 마진

  return (
    <g>
      {/* 화살표 마커 */}
      <defs>
        <marker id="egArrow" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.gas} />
        </marker>
      </defs>

      <text x={240} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.gas}>
        estimate_gas() -- eth_call + 10% 안전 마진
      </text>

      {/* 상단: call()과 동일 경로 (축약) */}
      <motion.g
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <ActionBox x={20} y={36} w={80} h={32} label="ProofDB"
          sub="가상 DB" color={C.call} />
      </motion.g>

      <motion.line x1={104} y1={52} x2={130} y2={52}
        stroke={C.gas} strokeWidth={1} markerEnd="url(#egArrow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.25, duration: 0.2 }} />

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <ActionBox x={134} y={36} w={80} h={32} label="revm build"
          sub="Evm::builder()" color={C.call} />
      </motion.g>

      <motion.line x1={218} y1={52} x2={244} y2={52}
        stroke={C.gas} strokeWidth={1} markerEnd="url(#egArrow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.45, duration: 0.2 }} />

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <ActionBox x={248} y={36} w={80} h={32} label="transact()"
          sub="EVM 실행" color={C.call} />
      </motion.g>

      <motion.line x1={332} y1={52} x2={358} y2={52}
        stroke={C.gas} strokeWidth={1} markerEnd="url(#egArrow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.65, duration: 0.2 }} />

      <motion.g
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}>
        <DataBox x={362} y={38} w={100} h={28} label="gas_used()"
          sub="실행 가스" color={C.gas} />
      </motion.g>

      {/* 화살표 아래로 */}
      <motion.line x1={412} y1={70} x2={412} y2={barY - 6}
        stroke={C.gas} strokeWidth={1} markerEnd="url(#egArrow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.85, duration: 0.2 }} />

      {/* 가스 바 — 시각화 */}
      <rect x={barX} y={barY} width={barW} height={barH} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

      {/* gas_used 채움 */}
      <motion.rect
        x={barX} y={barY} height={barH} rx={4}
        fill={C.gas} opacity={0.2}
        initial={{ width: 0 }}
        animate={{ width: barW * gasUsed }}
        transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
      />

      {/* +10% 마진 (패턴으로 구분) */}
      <motion.rect
        x={barX + barW * gasUsed} y={barY} height={barH}
        fill="#ef4444" opacity={0.15}
        initial={{ width: 0 }}
        animate={{ width: barW * margin }}
        transition={{ delay: 1.3, duration: 0.4, ease: 'easeOut' }}
      />
      <motion.rect
        x={barX + barW * gasUsed} y={barY} height={barH}
        fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2"
        initial={{ width: 0 }}
        animate={{ width: barW * margin }}
        transition={{ delay: 1.3, duration: 0.4, ease: 'easeOut' }}
      />

      {/* 라벨 */}
      <motion.text
        x={barX + barW * gasUsed / 2} y={barY + barH / 2 + 4}
        textAnchor="middle" fontSize={9} fontWeight={600} fill={C.gas}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}>
        gas_used
      </motion.text>

      <motion.text
        x={barX + barW * gasUsed + barW * margin / 2}
        y={barY + barH / 2 + 4}
        textAnchor="middle" fontSize={8} fontWeight={600} fill="#ef4444"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}>
        +10%
      </motion.text>

      {/* 하단: 왜 10%인가 */}
      <motion.g
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}>
        <rect x={50} y={140} width={380} height={48} rx={8}
          fill="var(--card)" stroke={C.gas} strokeWidth={0.5} />

        <text x={70} y={156} fontSize={8} fontWeight={600}
          fill={C.gas}>왜 10% 마진이 필요한가?</text>

        <circle cx={70} cy={170} r={2.5} fill="#ef4444" />
        <text x={80} y={173} fontSize={7.5} fill="var(--foreground)">
          블록 간 상태 변동: nonce 변경, balance 감소, storage 업데이트
        </text>

        <circle cx={270} cy={170} r={2.5} fill="#ef4444" />
        <text x={280} y={173} fontSize={7.5} fill="var(--foreground)">
          예측 시점 &#x2260; 실행 시점 = 가스 차이 가능
        </text>
      </motion.g>
    </g>
  );
}

/** Step 3: Reth vs Helios 타이밍 비교 */
export function Step3() {
  const leftX = 30;
  const rightX = 260;
  const rowY = 42;

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.compare}>
        전체 비교 -- Reth vs Helios eth_call
      </text>

      {/* ── 좌측: Reth 경로 ── */}
      <motion.g
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <ModuleBox x={leftX} y={rowY} w={86} h={40}
          label="Reth EVM" sub="StateProvider" color="#3b82f6" />
      </motion.g>

      <motion.line x1={leftX + 90} y1={rowY + 20} x2={leftX + 108} y2={rowY + 20}
        stroke="#3b82f6" strokeWidth={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.2 }} />

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}>
        <ModuleBox x={leftX + 112} y={rowY} w={86} h={40}
          label="MDBX" sub="700GB 디스크" color="#3b82f6" />
      </motion.g>

      {/* Reth 타이밍 바 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={leftX} y={rowY + 52} width={198} height={16} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <motion.rect
          x={leftX} y={rowY + 52} height={16} rx={4}
          fill="#3b82f6" opacity={0.2}
          initial={{ width: 0 }}
          animate={{ width: 4 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        />
        <text x={leftX + 12} y={rowY + 63} fontSize={8} fontWeight={600}
          fill="#3b82f6">~1us</text>
        <text x={leftX + 100} y={rowY + 63} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          로컬 DB 직접 읽기
        </text>
      </motion.g>

      {/* ── 우측: Helios 경로 ── */}
      <motion.g
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}>
        <ModuleBox x={rightX} y={rowY} w={86} h={40}
          label="Helios EVM" sub="ProofDB" color={C.compare} />
      </motion.g>

      <motion.line x1={rightX + 90} y1={rowY + 20} x2={rightX + 108} y2={rowY + 20}
        stroke={C.compare} strokeWidth={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.2 }} />

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}>
        <ModuleBox x={rightX + 112} y={rowY} w={86} h={40}
          label="RPC + MPT" sub="0GB 디스크" color={C.compare} />
      </motion.g>

      {/* Helios 타이밍 바 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <rect x={rightX} y={rowY + 52} width={198} height={16} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <motion.rect
          x={rightX} y={rowY + 52} height={16} rx={4}
          fill={C.compare} opacity={0.2}
          initial={{ width: 0 }}
          animate={{ width: 198 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        />
        <text x={rightX + 170} y={rowY + 63} fontSize={8} fontWeight={600}
          fill={C.compare}>~100ms</text>
        <text x={rightX + 80} y={rowY + 63}
          fontSize={7} fill="var(--muted-foreground)">
          N번 RPC 왕복 포함
        </text>
      </motion.g>

      {/* 하단 비교 테이블 */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}>
        {/* 테이블 배경 */}
        <rect x={30} y={126} width={420} height={62} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

        {/* 헤더 */}
        <text x={100} y={140} textAnchor="middle" fontSize={8}
          fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={230} y={140} textAnchor="middle" fontSize={8}
          fontWeight={700} fill="#3b82f6">Reth</text>
        <text x={380} y={140} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.compare}>Helios</text>

        {/* 구분선 */}
        <line x1={40} y1={144} x2={440} y2={144}
          stroke="var(--border)" strokeWidth={0.5} />

        {/* Row 1: 응답 시간 */}
        <text x={100} y={156} textAnchor="middle" fontSize={7.5}
          fill="var(--foreground)">응답 시간</text>
        <text x={230} y={156} textAnchor="middle" fontSize={7.5}
          fill="#3b82f6">~1us (로컬)</text>
        <text x={380} y={156} textAnchor="middle" fontSize={7.5}
          fill={C.compare}>~100ms (RPC)</text>

        {/* Row 2: 디스크 */}
        <text x={100} y={170} textAnchor="middle" fontSize={7.5}
          fill="var(--foreground)">디스크 요구</text>
        <text x={230} y={170} textAnchor="middle" fontSize={7.5}
          fill="#3b82f6">700GB+ MDBX</text>
        <text x={380} y={170} textAnchor="middle" fontSize={7.5}
          fill={C.compare}>0GB (무상태)</text>

        {/* Row 3: 신뢰 */}
        <text x={100} y={182} textAnchor="middle" fontSize={7.5}
          fill="var(--foreground)">신뢰 모델</text>
        <text x={230} y={182} textAnchor="middle" fontSize={7.5}
          fill="#3b82f6">자체 검증</text>
        <text x={380} y={182} textAnchor="middle" fontSize={7.5}
          fill={C.compare}>MPT 증명 검증</text>
      </motion.g>

      {/* 결론 */}
      <motion.text x={240} y={198} textAnchor="middle" fontSize={8}
        fontWeight={600} fill={C.compare}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}>
        느리지만 700GB 디스크 없이 동일한 검증 보장
      </motion.text>
    </g>
  );
}
