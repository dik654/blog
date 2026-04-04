import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';
import { C } from './SyncLoopVizData';

/* ══════════════════════════════════════════════════════
   Step 2: Finality 추적 — finalized_header 전진 과정
   슬롯 타임라인: 8M → 8M+32 → 8M+64
   각 전진마다 slot 비교 + state_root 갱신
   ══════════════════════════════════════════════════════ */
export function Step2() {
  const tlY = 70;
  const tlX = 40;
  const tlW = 400;

  const slots = [
    { slot: '8,000,000', label: '부트스트랩', x: tlX, stateRoot: '0xa3f1...' },
    { slot: '8,000,032', label: 'FinalityUpdate #1', x: tlX + tlW * 0.4, stateRoot: '0xb7e2...' },
    { slot: '8,000,064', label: 'FinalityUpdate #2', x: tlX + tlW * 0.8, stateRoot: '0xc9d4...' },
  ];

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.fin}>
        finalized_header 전진 — 항상 앞으로만
      </text>

      {/* 타임라인 축 */}
      <motion.line x1={tlX} y1={tlY} x2={tlX + tlW} y2={tlY}
        stroke="var(--border)" strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }} />

      {/* 화살표 끝 */}
      <motion.polygon points={`${tlX + tlW + 6},${tlY} ${tlX + tlW},${tlY - 4} ${tlX + tlW},${tlY + 4}`}
        fill="var(--border)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }} />

      {/* 슬롯 위치들 */}
      {slots.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.4 }}>
          {/* 슬롯 마커 */}
          <circle cx={s.x} cy={tlY} r={6} fill={C.fin} opacity={0.2} />
          <circle cx={s.x} cy={tlY} r={6} fill="none" stroke={C.fin} strokeWidth={1.2} />

          {/* 슬롯 번호 (위) */}
          <text x={s.x} y={tlY - 16} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={C.fin}>
            {s.slot}
          </text>
          <text x={s.x} y={tlY - 28} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">
            {s.label}
          </text>

          {/* state_root (아래) */}
          <rect x={s.x - 38} y={tlY + 14} width={76} height={22} rx={4}
            fill="var(--card)" stroke={C.fin} strokeWidth={0.5} />
          <text x={s.x} y={tlY + 22} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">state_root</text>
          <text x={s.x} y={tlY + 32} textAnchor="middle" fontSize={7.5}
            fontWeight={600} fill={C.fin}>{s.stateRoot}</text>

          {/* 전진 화살표 + 슬롯 비교 (첫 번째 제외) */}
          {i > 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.4 }}>
              {/* 전진 화살표 */}
              <line x1={slots[i - 1].x + 10} y1={tlY} x2={s.x - 10} y2={tlY}
                stroke={C.fin} strokeWidth={1.5} />
              <polygon
                points={`${s.x - 8},${tlY} ${s.x - 14},${tlY - 3} ${s.x - 14},${tlY + 3}`}
                fill={C.fin} />

              {/* slot 비교 뱃지 */}
              <rect x={(slots[i - 1].x + s.x) / 2 - 30} y={tlY - 48}
                width={60} height={16} rx={8}
                fill={C.fin} opacity={0.12} />
              <rect x={(slots[i - 1].x + s.x) / 2 - 30} y={tlY - 48}
                width={60} height={16} rx={8}
                fill="none" stroke={C.fin} strokeWidth={0.6} />
              <text x={(slots[i - 1].x + s.x) / 2} y={tlY - 37}
                textAnchor="middle" fontSize={7} fontWeight={600} fill={C.fin}>
                new {'>'} old → 교체
              </text>
            </motion.g>
          )}
        </motion.g>
      ))}

      {/* finalized_header 포인터 — 마지막 위치 강조 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}>
        <rect x={slots[2].x - 48} y={tlY + 44} width={96} height={18} rx={4}
          fill={C.fin} opacity={0.1} />
        <rect x={slots[2].x - 48} y={tlY + 44} width={96} height={18} rx={4}
          fill="none" stroke={C.fin} strokeWidth={0.8} />
        <text x={slots[2].x} y={tlY + 56} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.fin}>
          finalized_header ★
        </text>
      </motion.g>

      {/* Casper FFG 보장 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}>
        <text x={240} y={186} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          Casper FFG 보장 — finalized는 후퇴 불가. 이 state_root가 상태 증명의 기준.
        </text>
      </motion.g>
    </g>
  );
}

/* ══════════════════════════════════════════════════════
   Step 3: 에러 복구 4가지 시나리오
   4행: BLS 실패 / 네트워크 단절 / period 미스 / 장시간 오프라인
   ══════════════════════════════════════════════════════ */
export function Step3() {
  const rowH = 42;
  const startY = 12;
  const labelX = 8;
  const vizX = 130;

  return (
    <g>
      {/* ── Row 1: BLS 실패 ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0 }}>
        {/* 시나리오 라벨 */}
        <text x={labelX} y={startY + 14} fontSize={8.5} fontWeight={700} fill={C.err}>
          BLS 실패
        </text>
        <text x={labelX} y={startY + 24} fontSize={7} fill="var(--muted-foreground)">
          서명 불일치
        </text>

        {/* Update with X */}
        <DataBox x={vizX} y={startY} w={60} h={28} label="Update" color={C.err} />
        <text x={vizX + 30} y={startY + 14} textAnchor="middle" fontSize={14}
          fontWeight={700} fill={C.err} opacity={0.6}>✕</text>

        {/* → skip */}
        <line x1={vizX + 64} y1={startY + 14} x2={vizX + 90} y2={startY + 14}
          stroke={C.err} strokeWidth={1} strokeDasharray="3 2" />
        <text x={vizX + 100} y={startY + 11} fontSize={7.5} fill={C.err}>skip</text>

        {/* → loop continues */}
        <line x1={vizX + 120} y1={startY + 14} x2={vizX + 146} y2={startY + 14}
          stroke={C.fin} strokeWidth={1} />
        <polygon points={`${vizX + 150},${startY + 14} ${vizX + 146},${startY + 11} ${vizX + 146},${startY + 17}`}
          fill={C.fin} />
        <ModuleBox x={vizX + 154} y={startY - 2} w={74} h={32} label="Store" sub="변경 없음" color={C.store} />

        {/* 루프 계속 화살표 */}
        <motion.path
          d={`M ${vizX + 228} ${startY + 20} Q ${vizX + 260} ${startY + 30} ${vizX + 260} ${startY + 14} Q ${vizX + 260} ${startY} ${vizX + 240} ${startY - 2}`}
          fill="none" stroke={C.fin} strokeWidth={0.8} strokeDasharray="3 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }} />
        <text x={vizX + 270} y={startY + 18} fontSize={7} fill={C.fin}>계속</text>
      </motion.g>

      {/* 구분선 */}
      <line x1={labelX} y1={startY + rowH - 2} x2={460} y2={startY + rowH - 2}
        stroke="var(--border)" strokeWidth={0.3} strokeDasharray="2 2" />

      {/* ── Row 2: 네트워크 단절 ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}>
        <text x={labelX} y={startY + rowH + 14} fontSize={8.5} fontWeight={700} fill={C.err}>
          네트워크 단절
        </text>
        <text x={labelX} y={startY + rowH + 24} fontSize={7} fill="var(--muted-foreground)">
          API 응답 없음
        </text>

        {/* 끊어진 연결선 */}
        <line x1={vizX} y1={startY + rowH + 14} x2={vizX + 40} y2={startY + rowH + 14}
          stroke={C.err} strokeWidth={1} strokeDasharray="4 4" />
        <text x={vizX + 50} y={startY + rowH + 11} fontSize={8} fill={C.err}>✕</text>
        <line x1={vizX + 60} y1={startY + rowH + 14} x2={vizX + 100} y2={startY + rowH + 14}
          stroke={C.err} strokeWidth={1} strokeDasharray="4 4" />

        {/* Store unchanged */}
        <ModuleBox x={vizX + 108} y={startY + rowH} w={80} h={30} label="Store" sub="stale but safe" color={C.store} />

        {/* 안전 뱃지 */}
        <rect x={vizX + 200} y={startY + rowH + 4} width={86} height={20} rx={10}
          fill={C.fin} opacity={0.1} />
        <rect x={vizX + 200} y={startY + rowH + 4} width={86} height={20} rx={10}
          fill="none" stroke={C.fin} strokeWidth={0.6} />
        <text x={vizX + 243} y={startY + rowH + 18} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={C.fin}>보안 유지, 정확도↓</text>
      </motion.g>

      {/* 구분선 */}
      <line x1={labelX} y1={startY + rowH * 2 - 2} x2={460} y2={startY + rowH * 2 - 2}
        stroke="var(--border)" strokeWidth={0.3} strokeDasharray="2 2" />

      {/* ── Row 3: period 경계 미스 ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}>
        <text x={labelX} y={startY + rowH * 2 + 14} fontSize={8.5} fontWeight={700} fill={C.lcu}>
          period 경계 미스
        </text>
        <text x={labelX} y={startY + rowH * 2 + 24} fontSize={7} fill="var(--muted-foreground)">
          위원회 전환 실패
        </text>

        {/* AlertBox */}
        <AlertBox x={vizX} y={startY + rowH * 2 + 2} w={105} h={28}
          label="재부트 필요" sub="next_committee 없음" color={C.lcu} />

        {/* → warm start */}
        <line x1={vizX + 110} y1={startY + rowH * 2 + 16} x2={vizX + 150} y2={startY + rowH * 2 + 16}
          stroke={C.recover} strokeWidth={1} />
        <polygon points={`${vizX + 154},${startY + rowH * 2 + 16} ${vizX + 150},${startY + rowH * 2 + 13} ${vizX + 150},${startY + rowH * 2 + 19}`}
          fill={C.recover} />
        <rect x={vizX + 158} y={startY + rowH * 2 + 4} width={85} height={24} rx={6}
          fill="var(--card)" stroke={C.recover} strokeWidth={0.8} />
        <text x={vizX + 200} y={startY + rowH * 2 + 14} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.recover}>warm start</text>
        <text x={vizX + 200} y={startY + rowH * 2 + 24} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">마지막 체크포인트</text>
      </motion.g>

      {/* 구분선 */}
      <line x1={labelX} y1={startY + rowH * 3 - 2} x2={460} y2={startY + rowH * 3 - 2}
        stroke="var(--border)" strokeWidth={0.3} strokeDasharray="2 2" />

      {/* ── Row 4: 장시간 오프라인 ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}>
        <text x={labelX} y={startY + rowH * 3 + 14} fontSize={8.5} fontWeight={700} fill={C.err}>
          장시간 오프라인
        </text>
        <text x={labelX} y={startY + rowH * 3 + 24} fontSize={7} fill="var(--muted-foreground)">
          {'>'} 2주 (WS 만료)
        </text>

        {/* AlertBox */}
        <AlertBox x={vizX} y={startY + rowH * 3 + 2} w={105} h={28}
          label="WS 만료" sub="체크포인트 무효" color={C.err} />

        {/* → cold start */}
        <line x1={vizX + 110} y1={startY + rowH * 3 + 16} x2={vizX + 150} y2={startY + rowH * 3 + 16}
          stroke={C.err} strokeWidth={1} />
        <polygon points={`${vizX + 154},${startY + rowH * 3 + 16} ${vizX + 150},${startY + rowH * 3 + 13} ${vizX + 150},${startY + rowH * 3 + 19}`}
          fill={C.err} />
        <rect x={vizX + 158} y={startY + rowH * 3 + 4} width={85} height={24} rx={6}
          fill="var(--card)" stroke={C.err} strokeWidth={0.8} />
        <text x={vizX + 200} y={startY + rowH * 3 + 14} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.err}>cold start</text>
        <text x={vizX + 200} y={startY + rowH * 3 + 24} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">새 체크포인트 필요</text>
      </motion.g>
    </g>
  );
}
