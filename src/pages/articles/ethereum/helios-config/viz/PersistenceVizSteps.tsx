import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { C } from './PersistenceVizData';

/* ── helpers ── */
const fade = (d: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: d },
});
const drawLine = (d: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.35 },
});

/* ================================================================
   Step 0 — FileDB warm start 흐름
   종료 → 저장 → 재시작 → 로드 → 부트스트랩 생략
   ================================================================ */
export function Step0() {
  return (
    <g>
      {/* 상단 제목 */}
      <text x={240} y={14} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="var(--foreground)">
        FileDB warm start: 종료 → 저장 → 재시작 → 로드
      </text>

      {/* ── 상단 흐름: 4단계 ── */}

      {/* 1) Helios 종료 */}
      <motion.g {...fade(0)}>
        <ActionBox x={10} y={30} w={90} h={42} label="Helios 종료" sub="shutdown()" color={C.muted} />
      </motion.g>

      {/* 화살표 1→2 */}
      <motion.line x1={102} y1={51} x2={118} y2={51}
        stroke={C.disk} strokeWidth={1} markerEnd="url(#arrPDisk)"
        {...drawLine(0.15)} />

      {/* 2) 디스크 저장 */}
      <motion.g {...fade(0.2)}>
        <ActionBox x={120} y={30} w={100} h={42} label="checkpoint 저장" sub="checkpoint.ssz" color={C.disk} />
      </motion.g>

      {/* 디스크 아이콘 (실린더) */}
      <motion.g {...fade(0.3)}>
        <g transform="translate(148, 78)">
          <ellipse cx={22} cy={4} rx={22} ry={6} fill={`${C.disk}18`} stroke={C.disk} strokeWidth={0.8} />
          <rect x={0} y={4} width={44} height={18} fill={`${C.disk}18`} />
          <line x1={0} y1={4} x2={0} y2={22} stroke={C.disk} strokeWidth={0.8} />
          <line x1={44} y1={4} x2={44} y2={22} stroke={C.disk} strokeWidth={0.8} />
          <ellipse cx={22} cy={22} rx={22} ry={6} fill={`${C.disk}18`} stroke={C.disk} strokeWidth={0.8} />
          <text x={22} y={16} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.disk}>~30 B</text>
        </g>
      </motion.g>

      {/* 화살표 2→3 */}
      <motion.line x1={222} y1={51} x2={248} y2={51}
        stroke={C.load} strokeWidth={1} markerEnd="url(#arrPLoad)"
        {...drawLine(0.4)} />

      {/* 3) 재시작 */}
      <motion.g {...fade(0.45)}>
        <ActionBox x={250} y={30} w={90} h={42} label="Helios 재시작" sub="launch()" color={C.load} />
      </motion.g>

      {/* 화살표 3→4 */}
      <motion.line x1={342} y1={51} x2={358} y2={51}
        stroke={C.load} strokeWidth={1} markerEnd="url(#arrPLoad)"
        {...drawLine(0.55)} />

      {/* 4) 로드 → 즉시 동기 */}
      <motion.g {...fade(0.6)}>
        <StatusBox x={360} y={28} w={110} h={46} label="Store 복원" sub="O(초) warm start" color={C.load} progress={1} />
      </motion.g>

      {/* ── 하단: WS 기간 + Reth 비교 ── */}

      {/* WS 기간 타임라인 */}
      <motion.g {...fade(0.75)}>
        <rect x={10} y={112} width={225} height={42} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={122} y={126} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          Weak Subjectivity 기간: ~2주
        </text>

        {/* 타임라인 바 */}
        <rect x={22} y={132} width={200} height={6} rx={3} fill="var(--border)" opacity={0.3} />
        {/* 유효 구간 (녹색) */}
        <rect x={22} y={132} width={140} height={6} rx={3} fill={C.load} opacity={0.7} />
        {/* 무효 구간 (빨강) */}
        <rect x={162} y={132} width={60} height={6} rx={3} fill={C.fail} opacity={0.5} />

        <text x={92} y={148} textAnchor="middle"
          fontSize={7} fill={C.load}>유효 (재사용 가능)</text>
        <text x={192} y={148} textAnchor="middle"
          fontSize={7} fill={C.fail}>만료 (재요청)</text>
      </motion.g>

      {/* Reth 비교 패널 */}
      <motion.g {...fade(0.9)}>
        <rect x={248} y={112} width={222} height={42} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <line x1={359} y1={116} x2={359} y2={150} stroke="var(--border)" strokeWidth={0.5} />

        <text x={303} y={128} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.fail}>Reth</text>
        <text x={303} y={142} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">MDBX: 수백 GB</text>

        <text x={415} y={128} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.load}>Helios</text>
        <text x={415} y={142} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">FileDB: 수십 B</text>
      </motion.g>

      {/* 구분 대비 강조 */}
      <motion.g {...fade(1.0)}>
        <text x={240} y={172} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          저장 비용 10,000,000배 차이 — 모바일/WASM에서도 영속성 가능
        </text>
      </motion.g>

      {/* arrow defs */}
      <defs>
        <marker id="arrPDisk" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.disk} />
        </marker>
        <marker id="arrPLoad" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.load} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 1 — MultiRpc fallback 전환 + 검증 안전 표시
   주 RPC 실패 → fallback[0] → fallback[1] + 모든 응답 검증
   ================================================================ */
export function Step1() {
  const rpcs = [
    { label: 'Primary RPC', y: 26, status: 'fail' as const },
    { label: 'Fallback #1', y: 72, status: 'try' as const },
    { label: 'Fallback #2', y: 118, status: 'ok' as const },
  ];

  return (
    <g>
      {/* Helios 클라이언트 */}
      <motion.g {...fade(0)}>
        <ModuleBox x={10} y={60} w={80} h={44} label="Helios" sub="요청 전송" color={C.rpc} />
      </motion.g>

      {/* RPC 목록 */}
      {rpcs.map((r, i) => {
        const isFail = r.status === 'fail';
        const isOk = r.status === 'ok';
        const borderColor = isFail ? C.fail : isOk ? C.load : C.warn;

        return (
          <motion.g key={r.label} {...fade(0.15 + i * 0.2)}>
            {/* RPC 박스 */}
            <rect x={130} y={r.y} width={110} height={36} rx={6}
              fill="var(--card)" stroke={borderColor} strokeWidth={isFail ? 0.8 : 1.2}
              strokeDasharray={isFail ? '4 3' : 'none'} />
            <text x={185} y={r.y + 15} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={isFail ? C.fail : 'var(--foreground)'}>
              {r.label}
            </text>

            {/* 상태 표시 */}
            {isFail && (
              <motion.g {...fade(0.3 + i * 0.2)}>
                <text x={185} y={r.y + 29} textAnchor="middle"
                  fontSize={7} fill={C.fail}>timeout / error</text>
                {/* X 마크 */}
                <line x1={224} y1={r.y + 6} x2={234} y2={r.y + 16}
                  stroke={C.fail} strokeWidth={1.5} opacity={0.7} />
                <line x1={234} y1={r.y + 6} x2={224} y2={r.y + 16}
                  stroke={C.fail} strokeWidth={1.5} opacity={0.7} />
              </motion.g>
            )}
            {r.status === 'try' && (
              <motion.g {...fade(0.3 + i * 0.2)}>
                <text x={185} y={r.y + 29} textAnchor="middle"
                  fontSize={7} fill={C.warn}>시도 중...</text>
              </motion.g>
            )}
            {isOk && (
              <motion.g {...fade(0.3 + i * 0.2)}>
                <text x={185} y={r.y + 29} textAnchor="middle"
                  fontSize={7} fill={C.load}>응답 수신</text>
                {/* 체크마크 */}
                <motion.path d="M 226 39 L 230 43 L 238 35"
                  fill="none" stroke={C.load} strokeWidth={1.5} strokeLinecap="round"
                  transform={`translate(0, ${r.y - 26})`}
                  {...drawLine(0.7)} />
              </motion.g>
            )}

            {/* Helios → RPC 화살표 */}
            <motion.line
              x1={92} y1={82} x2={128} y2={r.y + 18}
              stroke={isFail ? C.fail : isOk ? C.load : C.warn}
              strokeWidth={isFail ? 0.6 : 1}
              opacity={isFail ? 0.4 : 1}
              strokeDasharray={isFail ? '3 2' : 'none'}
              markerEnd={isFail ? '' : `url(#arrP${isOk ? 'Load' : 'Warn'})`}
              {...drawLine(0.1 + i * 0.2)} />
          </motion.g>
        );
      })}

      {/* fallback 전환 화살표 (아래로) */}
      <motion.g {...fade(0.5)}>
        <motion.line x1={185} y1={62} x2={185} y2={70}
          stroke={C.warn} strokeWidth={0.8} markerEnd="url(#arrPWarn)"
          {...drawLine(0.45)} />
      </motion.g>
      <motion.g {...fade(0.65)}>
        <motion.line x1={185} y1={108} x2={185} y2={116}
          stroke={C.load} strokeWidth={0.8} markerEnd="url(#arrPLoad)"
          {...drawLine(0.6)} />
      </motion.g>

      {/* ── 우측: 검증 게이트 ── */}
      <motion.g {...fade(0.8)}>
        {/* 검증 영역 배경 */}
        <rect x={272} y={20} width={198} height={144} rx={8}
          fill={`${C.load}06`} stroke={C.load} strokeWidth={0.8} strokeDasharray="5 3" />
        <text x={371} y={37} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.load}>
          모든 응답 검증
        </text>

        {/* 검증 단계 카드들 */}
        <ActionBox x={284} y={46} w={88} h={34} label="Merkle Proof" sub="상태 루트 검증" color={C.load} />
        <ActionBox x={380} y={46} w={80} h={34} label="BLS 서명" sub="위원회 검증" color={C.load} />

        {/* 방패 아이콘 */}
        <g transform="translate(351, 92)">
          <path d="M 20 2 L 36 10 L 36 24 C 36 34 20 42 20 42 C 20 42 4 34 4 24 L 4 10 Z"
            fill={`${C.load}20`} stroke={C.load} strokeWidth={1.2} />
          <motion.path d="M 13 22 L 18 27 L 27 18"
            fill="none" stroke={C.load} strokeWidth={2} strokeLinecap="round"
            {...drawLine(0.9)} />
        </g>

        {/* 안전 메시지 */}
        <text x={371} y={146} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.load}>
          악의적 RPC여도 거짓 데이터 수용 불가
        </text>
      </motion.g>

      {/* 응답 → 검증 게이트 화살표 */}
      <motion.line x1={242} y1={136} x2={270} y2={136}
        stroke={C.load} strokeWidth={1} markerEnd="url(#arrPLoad)"
        {...drawLine(0.85)} />

      {/* arrow defs */}
      <defs>
        <marker id="arrPWarn" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.warn} />
        </marker>
      </defs>
    </g>
  );
}
