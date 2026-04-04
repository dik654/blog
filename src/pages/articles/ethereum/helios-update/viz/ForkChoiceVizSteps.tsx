import { motion } from 'framer-motion';
import { DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ForkChoiceVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay: d, duration: 0.3 } });

/* ================================================================
   Step 0 — 3개 Update 카드 비교 → 최선 선택
   3가지 기준: 참여자 수 > finality 우선 > 최신 슬롯
   ================================================================ */
export function Step0() {
  const updates = [
    { label: 'Update A', participants: '340 / 512', slot: '8,000,120', type: 'Optimistic', rank: 3 },
    { label: 'Update B', participants: '480 / 512', slot: '8,000,118', type: 'Finality', rank: 1 },
    { label: 'Update C', participants: '480 / 512', slot: '8,000,119', type: 'Optimistic', rank: 2 },
  ];

  const cardW = 120;
  const cardH = 100;
  const gap = 18;
  const startX = (480 - (cardW * 3 + gap * 2)) / 2;

  return (
    <g>
      {/* 제목 */}
      <text x={240} y={16} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="var(--foreground)">
        같은 슬롯에 도착한 3개 Update
      </text>

      {/* 3개 Update 카드 */}
      {updates.map((u, i) => {
        const x = startX + i * (cardW + gap);
        const y = 28;
        const isBest = u.rank === 1;
        const borderColor = isBest ? C.best : C.muted;

        return (
          <motion.g key={u.label} {...fade(i * 0.15)}>
            {/* 카드 배경 */}
            <rect x={x} y={y} width={cardW} height={cardH} rx={8}
              fill="var(--card)" stroke={borderColor}
              strokeWidth={isBest ? 1.5 : 0.8} />

            {/* 카드 제목 */}
            <text x={x + cardW / 2} y={y + 16} textAnchor="middle"
              fontSize={10} fontWeight={700} fill={isBest ? C.best : 'var(--foreground)'}>
              {u.label}
            </text>

            {/* 참여자 수 — 핵심 기준 ① */}
            <rect x={x + 8} y={y + 24} width={cardW - 16} height={20} rx={4}
              fill={isBest ? `${C.best}12` : `${C.muted}08`} />
            <text x={x + 14} y={y + 37} fontSize={7.5} fill="var(--muted-foreground)">참여자</text>
            <text x={x + cardW - 14} y={y + 37} textAnchor="end"
              fontSize={9} fontWeight={600} fill={parseInt(u.participants) >= 480 ? C.fin : C.alert}>
              {u.participants}
            </text>

            {/* 타입 — 기준 ② */}
            <text x={x + 14} y={y + 57} fontSize={7.5} fill="var(--muted-foreground)">타입</text>
            <text x={x + cardW - 14} y={y + 57} textAnchor="end"
              fontSize={8} fontWeight={600} fill={u.type === 'Finality' ? C.fin : C.opt}>
              {u.type}
            </text>

            {/* 슬롯 — 기준 ③ */}
            <text x={x + 14} y={y + 73} fontSize={7.5} fill="var(--muted-foreground)">슬롯</text>
            <text x={x + cardW - 14} y={y + 73} textAnchor="end"
              fontSize={8} fontWeight={600} fill="var(--foreground)">
              {u.slot}
            </text>

            {/* 순위 뱃지 */}
            <motion.g {...fade(0.6 + i * 0.1)}>
              <rect x={x + cardW / 2 - 16} y={y + cardH - 18} width={32} height={14} rx={7}
                fill={isBest ? C.best : 'var(--border)'} opacity={isBest ? 1 : 0.5} />
              <text x={x + cardW / 2} y={y + cardH - 8} textAnchor="middle"
                fontSize={7} fontWeight={700} fill={isBest ? '#fff' : 'var(--muted-foreground)'}>
                #{u.rank}
              </text>
            </motion.g>
          </motion.g>
        );
      })}

      {/* 화살표: B가 최선 → best_valid_update */}
      <motion.line
        x1={startX + cardW + gap + cardW / 2} y1={cardH + 32}
        x2={startX + cardW + gap + cardW / 2} y2={cardH + 50}
        stroke={C.best} strokeWidth={1.2} markerEnd="url(#arrowBest)"
        {...drawLine(0.8)} />

      {/* best_valid_update 결과 */}
      <motion.g {...fade(0.9)}>
        <DataBox x={startX + cardW + gap + 10} y={cardH + 54} w={100} h={28}
          label="best_valid_update" color={C.best} />
      </motion.g>

      {/* 우선순위 범례 */}
      <motion.g {...fade(1.0)}>
        <rect x={30} y={152} width={420} height={36} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={166} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          선택 기준: ① 참여자 수 ▸ ② Finality 우선 ▸ ③ 최신 슬롯
        </text>
        <text x={240} y={180} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          B가 최선: 참여자 480명(C와 동일) + Finality 타입(C는 Optimistic) → B 선택
        </text>
      </motion.g>

      {/* marker 정의 */}
      <defs>
        <marker id="arrowBest" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.best} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 1 — Reorg 처리: optimistic(교체) vs finalized(자물쇠)
   Reth Pipeline.unwind 비교
   ================================================================ */
export function Step1() {
  return (
    <g>
      {/* ── 좌측: Optimistic Reorg ── */}
      <rect x={10} y={8} width={215} height={130} rx={8}
        fill={`${C.opt}06`} stroke={C.opt} strokeWidth={0.5} strokeDasharray="4 3" />
      <text x={118} y={24} textAnchor="middle"
        fontSize={9} fontWeight={700} fill={C.opt}>Optimistic 헤더</text>

      {/* 현재 헤더 */}
      <ModuleBox x={20} y={34} w={90} h={38} label="Header A" sub="slot 8,000,120" color={C.opt} />

      {/* 교체 화살표 */}
      <motion.g {...fade(0.3)}>
        <motion.line x1={115} y1={53} x2={135} y2={53}
          stroke={C.opt} strokeWidth={1} markerEnd="url(#arrowOpt)"
          {...drawLine(0.3)} />
        {/* X 표시 — 기존 헤더 탈락 */}
        <motion.g {...fade(0.5)}>
          <line x1={55} y1={38} x2={75} y2={68} stroke={C.alert} strokeWidth={1.5} opacity={0.6} />
          <line x1={75} y1={38} x2={55} y2={68} stroke={C.alert} strokeWidth={1.5} opacity={0.6} />
        </motion.g>
      </motion.g>

      {/* 새 헤더 */}
      <motion.g {...fade(0.4)}>
        <ModuleBox x={140} y={34} w={75} h={38} label="Header B" sub="slot 8,000,121" color={C.fin} />
      </motion.g>

      {/* O(1) 뱃지 */}
      <motion.g {...fade(0.6)}>
        <rect x={50} y={84} width={130} height={22} rx={11}
          fill={`${C.opt}12`} stroke={C.opt} strokeWidth={0.8} />
        <text x={115} y={98} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.opt}>
          포인터 교체 = O(1)
        </text>
      </motion.g>

      {/* Reorg 가능 라벨 */}
      <motion.g {...fade(0.7)}>
        <text x={118} y={125} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          더 좋은 포크가 나타나면 즉시 교체
        </text>
      </motion.g>

      {/* ── 우측: Finalized = 불가 ── */}
      <rect x={240} y={8} width={230} height={130} rx={8}
        fill={`${C.fin}06`} stroke={C.fin} strokeWidth={0.5} strokeDasharray="4 3" />
      <text x={355} y={24} textAnchor="middle"
        fontSize={9} fontWeight={700} fill={C.fin}>Finalized 헤더</text>

      {/* finalized 헤더 */}
      <ModuleBox x={260} y={34} w={100} h={38} label="Finalized" sub="slot 8,000,064" color={C.fin} />

      {/* 자물쇠 아이콘 (SVG) */}
      <motion.g {...fade(0.5)}>
        <g transform="translate(375, 36)">
          {/* 자물쇠 몸통 */}
          <rect x={0} y={14} width={24} height={18} rx={3} fill={C.fin} opacity={0.9} />
          {/* 자물쇠 고리 */}
          <path d="M 5 14 V 9 A 7 7 0 0 1 19 9 V 14"
            fill="none" stroke={C.fin} strokeWidth={2.5} strokeLinecap="round" />
          {/* 열쇠 구멍 */}
          <circle cx={12} cy={23} r={2.5} fill="var(--card)" />
          <rect x={11} y={24} width={2} height={4} rx={1} fill="var(--card)" />
        </g>
      </motion.g>

      {/* 슬래싱 비용 */}
      <motion.g {...fade(0.7)}>
        <AlertBox x={262} y={84} w={195} h={42}
          label="Reorg 불가" sub="2/3 stake 확정 — ~$10B 슬래싱 비용" color={C.alert} />
      </motion.g>

      {/* ── 하단: Reth vs Helios 비교 ── */}
      <motion.g {...fade(0.9)}>
        <rect x={10} y={148} width={460} height={44} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

        {/* Reth */}
        <text x={130} y={164} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.alert}>Reth reorg</text>
        <text x={130} y={178} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">Pipeline.unwind() — 블록 롤백 + 상태 되돌리기</text>

        {/* 구분선 */}
        <line x1={240} y1={152} x2={240} y2={188} stroke="var(--border)" strokeWidth={0.5} />

        {/* Helios */}
        <text x={355} y={164} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.opt}>Helios reorg</text>
        <text x={355} y={178} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">optimistic_header 포인터 교체 — 상태 롤백 없음</text>
      </motion.g>

      {/* marker 정의 */}
      <defs>
        <marker id="arrowOpt" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.opt} />
        </marker>
      </defs>
    </g>
  );
}
