import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ProofDBVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay: d, duration: 0.3 } });

/* ================================================================
   Step 0 — EVM → ProofDB → (캐시 히트 or RPC) → 검증 → 반환
   ================================================================ */
export function Step0() {
  return (
    <g>
      {/* ── 메인 흐름: EVM → ProofDB → RPC ── */}
      <ModuleBox x={10} y={30} w={70} h={48} label="EVM" sub="revm" color={C.evm} />

      <motion.line x1={82} y1={54} x2={115} y2={54}
        stroke={C.evm} strokeWidth={1} markerEnd="url(#arrEvm)"
        {...drawLine(0.1)} />

      <ModuleBox x={118} y={24} w={100} h={56} label="ProofDB" sub="Database trait 구현" color={C.proofdb} />

      <motion.line x1={220} y1={54} x2={255} y2={54}
        stroke={C.proofdb} strokeWidth={1} markerEnd="url(#arrProofdb)"
        {...drawLine(0.3)} />

      <ModuleBox x={258} y={30} w={80} h={48} label="RPC" sub="eth_getProof" color={C.rpc} />

      {/* RPC → 검증 */}
      <motion.line x1={340} y1={54} x2={365} y2={54}
        stroke={C.rpc} strokeWidth={1} markerEnd="url(#arrRpc)"
        {...drawLine(0.5)} />

      <ActionBox x={368} y={32} w={100} h={44} label="Merkle 검증" sub="state_root 대조" color={C.verify} />

      {/* ── 캐시 히트 숏컷 (아래쪽 경로) ── */}
      <motion.g {...fade(0.4)}>
        {/* 캐시 박스 */}
        <DataBox x={135} y={105} w={70} h={28} label="Cache" sub="히트!" color={C.cache} />

        {/* ProofDB → 캐시 (아래로) */}
        <motion.path
          d="M 168 80 L 168 102"
          stroke={C.cache} strokeWidth={1} fill="none"
          strokeDasharray="3 2"
          markerEnd="url(#arrCache)"
          {...drawLine(0.4)} />

        {/* 캐시 → EVM 반환 (좌측 위로 곡선) */}
        <motion.path
          d="M 135 119 Q 80 119 48 80"
          stroke={C.cache} strokeWidth={1} fill="none"
          strokeDasharray="3 2"
          markerEnd="url(#arrCache)"
          {...drawLine(0.5)} />
      </motion.g>

      {/* ── 캐시 키 설명 ── */}
      <motion.g {...fade(0.7)}>
        <rect x={230} y={100} width={238} height={46} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={349} y={116} textAnchor="middle"
          fontSize={9} fontWeight={600} fill="var(--foreground)">
          캐시 키: (address, block_number)
        </text>
        <text x={349} y={130} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          같은 블록 내 동일 주소 → 캐시 히트 | 블록 변경 → 무효화
        </text>
        <text x={349} y={140} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          state_root가 달라지면 증명이 무의미하기 때문
        </text>
      </motion.g>

      {/* ── 흐름 레이블 ── */}
      <motion.g {...fade(0.2)}>
        <rect x={86} y={38} width={26} height={14} rx={3} fill="var(--card)" />
        <text x={99} y={48} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">요청</text>
      </motion.g>
      <motion.g {...fade(0.35)}>
        <rect x={225} y={38} width={26} height={14} rx={3} fill="var(--card)" />
        <text x={238} y={48} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">조회</text>
      </motion.g>
      <motion.g {...fade(0.55)}>
        <rect x={342} y={38} width={22} height={14} rx={3} fill="var(--card)" />
        <text x={353} y={48} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">증명</text>
      </motion.g>

      {/* ── 상단 타이틀 ── */}
      <text x={240} y={14} textAnchor="middle"
        fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
        miss 경로 (실선) vs hit 경로 (점선)
      </text>

      {/* ── marker 정의 ── */}
      <defs>
        <marker id="arrEvm" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.evm} />
        </marker>
        <marker id="arrProofdb" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.proofdb} />
        </marker>
        <marker id="arrRpc" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rpc} />
        </marker>
        <marker id="arrCache" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.cache} />
        </marker>
        <marker id="arrVerify" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.verify} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 1 — 에러 3가지: 흐름 위에 발생 지점 매핑
   ================================================================ */
export function Step1() {
  return (
    <g>
      {/* ── 축소된 메인 흐름 (상단, 배경) ── */}
      <rect x={10} y={8} width={460} height={36} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

      {/* 흐름 노드들 (작게) */}
      <text x={40} y={22} fontSize={8} fontWeight={600} fill={C.evm}>EVM</text>
      <text x={70} y={22} fontSize={8} fill="var(--muted-foreground)">→</text>
      <text x={100} y={22} fontSize={8} fontWeight={600} fill={C.proofdb}>ProofDB</text>
      <text x={150} y={22} fontSize={8} fill="var(--muted-foreground)">→</text>
      <text x={180} y={22} fontSize={8} fontWeight={600} fill={C.rpc}>RPC 응답</text>
      <text x={235} y={22} fontSize={8} fill="var(--muted-foreground)">→</text>
      <text x={265} y={22} fontSize={8} fontWeight={600} fill={C.verify}>Merkle 검증</text>
      <text x={340} y={22} fontSize={8} fill="var(--muted-foreground)">→</text>
      <text x={370} y={22} fontSize={8} fontWeight={600} fill={C.verify}>RLP 디코딩</text>
      <text x={435} y={22} fontSize={8} fill="var(--muted-foreground)">→ 값</text>

      {/* 흐름 하단 가로선 */}
      <line x1={10} y1={36} x2={470} y2={36}
        stroke="var(--border)" strokeWidth={0.5} />

      {/* ── 에러 1: ProofMissing (RPC 응답 지점) ── */}
      <motion.g {...fade(0.2)}>
        {/* 화살표: RPC 응답 → AlertBox */}
        <motion.line x1={195} y1={36} x2={195} y2={52}
          stroke={C.alert} strokeWidth={1}
          {...drawLine(0.2)} />
        <AlertBox x={115} y={55} w={160} h={44}
          label="ProofMissing" sub="RPC가 증명을 반환하지 않음" color={C.alert} />
        <text x={195} y={113} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          원인: 비표준 프로바이더, 미지원 블록
        </text>
      </motion.g>

      {/* ── 에러 2: MerkleMismatch (검증 지점) ── */}
      <motion.g {...fade(0.5)}>
        <motion.line x1={295} y1={36} x2={295} y2={125}
          stroke={C.alert} strokeWidth={1}
          {...drawLine(0.5)} />
        <AlertBox x={215} y={128} w={160} h={44}
          label="MerkleMismatch" sub="해시가 state_root와 불일치" color={C.alert} />
        <text x={295} y={186} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          원인: 악의적 프로바이더가 위조된 증명 전송
        </text>
      </motion.g>

      {/* ── 에러 3: RlpDecodeError (디코딩 지점) ── */}
      <motion.g {...fade(0.8)}>
        <motion.line x1={395} y1={36} x2={395} y2={52}
          stroke={C.alert} strokeWidth={1}
          {...drawLine(0.8)} />
        <AlertBox x={315} y={55} w={150} h={44}
          label="RlpDecodeError" sub="리프 데이터 파싱 실패" color={C.alert} />
        <text x={390} y={113} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          원인: 손상된 리프 또는 인코딩 변경
        </text>
      </motion.g>

      {/* ── 공통: Reth 비교 ── */}
      <motion.g {...fade(1.1)}>
        <rect x={80} y={195} width={320} height={28} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={213} textAnchor="middle"
          fontSize={8} fill="var(--muted-foreground)">
          Reth는 로컬 DB 직접 읽기 — 이 3가지 에러가 구조적으로 불가능
        </text>
      </motion.g>
    </g>
  );
}
