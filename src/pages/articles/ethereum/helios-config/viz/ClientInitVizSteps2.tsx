import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ClientInitVizData';

/* ── helpers ── */
const fade = (d: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: d },
});
const drawLine = (d: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.3 },
});

/* ================================================================
   Step 2 — FileDB warm start vs cold start
   왼: warm (save→load→fast) / 우: cold (no FileDB→hardcoded→risk)
   하단: Reth 700GB vs Helios 32B
   ================================================================ */
export function Step2() {
  return (
    <g>
      {/* ── 상단 분할 타이틀 ── */}
      <motion.g {...fade(0)}>
        <text x={130} y={14} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.disk}>Warm Start</text>
        <text x={370} y={14} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.warn}>Cold Start</text>
        {/* 구분선 */}
        <line x1={240} y1={6} x2={240} y2={144}
          stroke="var(--border)" strokeWidth={0.8} strokeDasharray="4 3" />
      </motion.g>

      {/* ═══ 왼쪽: Warm Start 흐름 ═══ */}

      {/* 1) 종료 → save */}
      <motion.g {...fade(0.1)}>
        <ActionBox x={10} y={24} w={72} h={32} label="종료" sub="shutdown" color={C.muted} />
      </motion.g>
      <motion.line x1={84} y1={40} x2={98} y2={40}
        stroke={C.disk} strokeWidth={0.8} markerEnd="url(#arrCIW1)"
        {...drawLine(0.2)} />

      {/* 2) save 32B (디스크 아이콘) */}
      <motion.g {...fade(0.25)}>
        <rect x={100} y={24} width={65} height={32} rx={5}
          fill="var(--card)" stroke={C.disk} strokeWidth={0.8} />
        <text x={132} y={37} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.disk}>Save</text>
        <text x={132} y={50} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">32 bytes</text>
      </motion.g>

      {/* 디스크 실린더 아이콘 */}
      <motion.g {...fade(0.35)}>
        <g transform="translate(170, 24)">
          <ellipse cx={16} cy={4} rx={16} ry={5} fill={`${C.disk}18`} stroke={C.disk} strokeWidth={0.7} />
          <rect x={0} y={4} width={32} height={14} fill={`${C.disk}18`} />
          <line x1={0} y1={4} x2={0} y2={18} stroke={C.disk} strokeWidth={0.7} />
          <line x1={32} y1={4} x2={32} y2={18} stroke={C.disk} strokeWidth={0.7} />
          <ellipse cx={16} cy={18} rx={16} ry={5} fill={`${C.disk}18`} stroke={C.disk} strokeWidth={0.7} />
          <text x={16} y={14} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.disk}>.ssz</text>
        </g>
      </motion.g>

      {/* 3) 재시작 → load */}
      <motion.g {...fade(0.4)}>
        <ActionBox x={10} y={68} w={72} h={32} label="재시작" sub="launch" color={C.disk} />
      </motion.g>
      <motion.line x1={84} y1={84} x2={98} y2={84}
        stroke={C.disk} strokeWidth={0.8} markerEnd="url(#arrCIW1)"
        {...drawLine(0.45)} />

      {/* 4) load → bootstrap fast */}
      <motion.g {...fade(0.5)}>
        <rect x={100} y={68} width={65} height={32} rx={5}
          fill="var(--card)" stroke={C.disk} strokeWidth={0.8} />
        <text x={132} y={81} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.disk}>Load</text>
        <text x={132} y={94} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">즉시 복원</text>
      </motion.g>

      <motion.line x1={167} y1={84} x2={181} y2={84}
        stroke={C.disk} strokeWidth={0.8} markerEnd="url(#arrCIW1)"
        {...drawLine(0.55)} />

      <motion.g {...fade(0.6)}>
        <DataBox x={183} y={72} w={52} h={24} label="Fast" sub="O(초)" color={C.disk} />
      </motion.g>

      {/* ═══ 오른쪽: Cold Start 흐름 ═══ */}

      {/* 1) No FileDB */}
      <motion.g {...fade(0.3)}>
        <AlertBox x={252} y={24} w={82} h={32} label="FileDB 없음" sub="첫 실행" color={C.warn} />
      </motion.g>

      <motion.line x1={336} y1={40} x2={348} y2={40}
        stroke={C.warn} strokeWidth={0.8} strokeDasharray="3 2"
        markerEnd="url(#arrCIW2)"
        {...drawLine(0.4)} />

      {/* 2) 하드코딩 사용 */}
      <motion.g {...fade(0.45)}>
        <rect x={350} y={24} width={82} height={32} rx={5}
          fill="var(--card)" stroke={C.warn} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={391} y={38} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.warn}>하드코딩</text>
        <text x={391} y={50} textAnchor="middle"
          fontSize={7} fill={C.fail}>만료 가능</text>
      </motion.g>

      {/* 3) WS 검사 */}
      <motion.g {...fade(0.55)}>
        <ActionBox x={280} y={68} w={82} h={32} label="WS 기간 확인" sub="~2주 이내?" color={C.warn} />
      </motion.g>

      <motion.line x1={364} y1={84} x2={376} y2={84}
        stroke={C.fail} strokeWidth={0.8} strokeDasharray="3 2"
        markerEnd="url(#arrCIW3)"
        {...drawLine(0.6)} />

      {/* 4) 초과 시 re-fetch */}
      <motion.g {...fade(0.65)}>
        <AlertBox x={378} y={68} w={82} h={32} label="만료 → 재요청"
          sub="API fetch" color={C.fail} />
      </motion.g>

      {/* ═══ 하단: 저장 비교 ═══ */}
      <motion.g {...fade(0.8)}>
        <rect x={30} y={112} width={420} height={38} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <line x1={240} y1={116} x2={240} y2={146} stroke="var(--border)" strokeWidth={0.5} />

        {/* Reth 700GB — 실린더 */}
        <g transform="translate(60, 116)">
          <ellipse cx={14} cy={4} rx={14} ry={5} fill={`${C.fail}15`} stroke={C.fail} strokeWidth={0.6} />
          <rect x={0} y={4} width={28} height={16} fill={`${C.fail}15`} />
          <line x1={0} y1={4} x2={0} y2={20} stroke={C.fail} strokeWidth={0.6} />
          <line x1={28} y1={4} x2={28} y2={20} stroke={C.fail} strokeWidth={0.6} />
          <ellipse cx={14} cy={20} rx={14} ry={5} fill={`${C.fail}15`} stroke={C.fail} strokeWidth={0.6} />
        </g>
        <text x={112} y={128} fontSize={8} fontWeight={700} fill={C.fail}>Reth</text>
        <text x={112} y={142} fontSize={7.5} fill="var(--muted-foreground)">MDBX: 700GB+</text>

        {/* Helios 32B — pill */}
        <rect x={280} y={120} width={48} height={18} rx={9}
          fill={`${C.disk}15`} stroke={C.disk} strokeWidth={0.8} />
        <text x={304} y={132} textAnchor="middle"
          fontSize={7.5} fontWeight={700} fill={C.disk}>32B</text>
        <text x={340} y={128} fontSize={8} fontWeight={700} fill={C.disk}>Helios</text>
        <text x={340} y={142} fontSize={7.5} fill="var(--muted-foreground)">FileDB: 32 bytes</text>
      </motion.g>

      {/* 비교 텍스트 */}
      <motion.g {...fade(1.0)}>
        <text x={240} y={164} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          저장 비용 ~20,000,000배 차이 — 모바일/WASM에서도 영속성 가능
        </text>
      </motion.g>

      {/* arrow defs */}
      <defs>
        <marker id="arrCIW1" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.disk} />
        </marker>
        <marker id="arrCIW2" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.warn} />
        </marker>
        <marker id="arrCIW3" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.fail} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 3 — Multi-RPC Fallback 알고리즘
   Helios → Primary(fail) → Fallback#1(try) → Fallback#2(ok)
   하단: 검증 게이트 (MPT + BLS)
   ================================================================ */
export function Step3() {
  const rpcs = [
    { label: 'Primary RPC', status: 'fail' as const, y: 24 },
    { label: 'Fallback #1', status: 'try' as const, y: 68 },
    { label: 'Fallback #2', status: 'ok' as const, y: 112 },
  ];

  return (
    <g>
      {/* ── Helios 중앙 ── */}
      <motion.g {...fade(0)}>
        <ModuleBox x={10} y={54} w={80} h={46} label="Helios" sub="요청 전송" color={C.rpc} />
      </motion.g>

      {/* ── RPC 목록 ── */}
      {rpcs.map((r, i) => {
        const isFail = r.status === 'fail';
        const isOk = r.status === 'ok';
        const borderColor = isFail ? C.fail : isOk ? C.disk : C.warn;

        return (
          <motion.g key={r.label} {...fade(0.15 + i * 0.2)}>
            {/* RPC 박스 */}
            <rect x={126} y={r.y} width={110} height={34} rx={6}
              fill="var(--card)"
              stroke={borderColor} strokeWidth={isFail ? 0.8 : 1.2}
              strokeDasharray={isFail ? '4 3' : 'none'} />
            <text x={181} y={r.y + 14} textAnchor="middle"
              fontSize={9} fontWeight={600}
              fill={isFail ? C.fail : 'var(--foreground)'}>
              {r.label}
            </text>

            {/* 상태 표시 */}
            {isFail && (
              <motion.g {...fade(0.3)}>
                <text x={181} y={r.y + 28} textAnchor="middle"
                  fontSize={7} fill={C.fail}>timeout / error</text>
                {/* X 마크 */}
                <line x1={222} y1={r.y + 6} x2={230} y2={r.y + 14}
                  stroke={C.fail} strokeWidth={1.5} opacity={0.7} />
                <line x1={230} y1={r.y + 6} x2={222} y2={r.y + 14}
                  stroke={C.fail} strokeWidth={1.5} opacity={0.7} />
              </motion.g>
            )}
            {r.status === 'try' && (
              <motion.g {...fade(0.5)}>
                <text x={181} y={r.y + 28} textAnchor="middle"
                  fontSize={7} fill={C.warn}>시도 중...</text>
              </motion.g>
            )}
            {isOk && (
              <motion.g {...fade(0.7)}>
                <text x={181} y={r.y + 28} textAnchor="middle"
                  fontSize={7} fill={C.disk}>응답 수신</text>
                {/* 체크마크 */}
                <motion.path
                  d={`M 222 ${r.y + 8} L 226 ${r.y + 12} L 232 ${r.y + 5}`}
                  fill="none" stroke={C.disk} strokeWidth={1.5} strokeLinecap="round"
                  {...drawLine(0.8)} />
              </motion.g>
            )}

            {/* Helios → RPC 화살표 */}
            <motion.line
              x1={92} y1={77} x2={124} y2={r.y + 17}
              stroke={isFail ? C.fail : isOk ? C.disk : C.warn}
              strokeWidth={isFail ? 0.6 : 1}
              opacity={isFail ? 0.4 : 1}
              strokeDasharray={isFail ? '3 2' : isOk ? 'none' : '4 3'}
              markerEnd={isFail ? '' : `url(#arrCIR${i})`}
              {...drawLine(0.1 + i * 0.2)} />
          </motion.g>
        );
      })}

      {/* fallback 전환 화살표 */}
      <motion.g {...fade(0.45)}>
        <motion.line x1={181} y1={58} x2={181} y2={66}
          stroke={C.warn} strokeWidth={0.8} markerEnd="url(#arrCIR1)"
          {...drawLine(0.4)} />
      </motion.g>
      <motion.g {...fade(0.65)}>
        <motion.line x1={181} y1={102} x2={181} y2={110}
          stroke={C.disk} strokeWidth={0.8} markerEnd="url(#arrCIR2)"
          {...drawLine(0.6)} />
      </motion.g>

      {/* ── 우측: 검증 게이트 ── */}
      <motion.g {...fade(0.85)}>
        {/* 검증 영역 배경 */}
        <rect x={268} y={18} width={200} height={138} rx={8}
          fill={`${C.disk}06`} stroke={C.disk} strokeWidth={0.8} strokeDasharray="5 3" />
        <text x={368} y={34} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.disk}>
          모든 응답 검증
        </text>

        {/* MPT + BLS ActionBoxes */}
        <ActionBox x={278} y={42} w={86} h={32} label="MPT 검증" sub="상태 루트 일치" color={C.disk} />
        <ActionBox x={374} y={42} w={84} h={32} label="BLS 검증" sub="위원회 서명" color={C.disk} />

        {/* 방패 아이콘 */}
        <g transform="translate(348, 84)">
          <path d="M 20 2 L 34 9 L 34 22 C 34 31 20 38 20 38 C 20 38 6 31 6 22 L 6 9 Z"
            fill={`${C.disk}20`} stroke={C.disk} strokeWidth={1.2} />
          <motion.path d="M 13 20 L 18 25 L 27 16"
            fill="none" stroke={C.disk} strokeWidth={2} strokeLinecap="round"
            {...drawLine(0.95)} />
        </g>

        {/* 안전 메시지 */}
        <text x={368} y={136} textAnchor="middle"
          fontSize={7.5} fontWeight={600} fill={C.disk}>
          악의적 RPC도 거짓 수용 불가
        </text>
      </motion.g>

      {/* 응답 → 검증 화살표 */}
      <motion.line x1={238} y1={129} x2={266} y2={129}
        stroke={C.disk} strokeWidth={1} markerEnd="url(#arrCIR2)"
        {...drawLine(0.9)} />

      {/* ── 하단 요약 ── */}
      <motion.g {...fade(1.1)}>
        <text x={240} y={174} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          Primary 우선 → 실패 시 Fallback 순차 시도 — 어떤 응답이든 검증 통과 필수
        </text>
      </motion.g>

      {/* arrow defs */}
      <defs>
        <marker id="arrCIR0" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.fail} />
        </marker>
        <marker id="arrCIR1" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.warn} />
        </marker>
        <marker id="arrCIR2" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.disk} />
        </marker>
      </defs>
    </g>
  );
}
