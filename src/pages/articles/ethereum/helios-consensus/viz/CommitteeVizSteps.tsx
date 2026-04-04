import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './CommitteeVizData';

/* ── helpers ── */
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const drawLine = (d: number) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay: d, duration: 0.3 } });

/* ================================================================
   Step 0 — 타임라인: period N / N+1 / N+2, 경계 점선, 슬롯 계산
   ================================================================ */
export function Step0() {
  const periods = [
    { label: 'Period N', x: 30, w: 130 },
    { label: 'Period N+1', x: 185, w: 130 },
    { label: 'Period N+2', x: 340, w: 120 },
  ];

  return (
    <g>
      {/* 수평 타임라인 축 */}
      <line x1={20} y1={60} x2={470} y2={60} stroke="var(--border)" strokeWidth={1} />

      {/* period 영역 박스 + 경계선 */}
      {periods.map((p, i) => (
        <motion.g key={p.label} {...fade(i * 0.2)}>
          {/* period 배경 */}
          <rect x={p.x} y={24} width={p.w} height={32} rx={6}
            fill={`${C.period}10`} stroke={C.period} strokeWidth={0.8} />
          <text x={p.x + p.w / 2} y={38} textAnchor="middle"
            fontSize={10} fontWeight={700} fill={C.period}>{p.label}</text>
          <text x={p.x + p.w / 2} y={50} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">8,192 슬롯 (~27h)</text>

          {/* 경계 점선 (period 사이) */}
          {i > 0 && (
            <line x1={p.x - 12} y1={18} x2={p.x - 12} y2={72}
              stroke={C.period} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
          )}
        </motion.g>
      ))}

      {/* 화살표: 타임라인 진행 방향 */}
      <motion.polygon points="468,56 468,64 475,60" fill="var(--muted-foreground)" {...fade(0.5)} />

      {/* 슬롯 계산 수식 */}
      <motion.g {...fade(0.6)}>
        <rect x={90} y={80} width={300} height={44} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={97} textAnchor="middle"
          fontSize={9} fontWeight={600} fill="var(--foreground)">
          period = slot / (256 * 32) = slot / 8192
        </text>
        <text x={240} y={113} textAnchor="middle"
          fontSize={8} fill="var(--muted-foreground)">
          slot 8,000,000 → period 976 | slot 8,008,192 → period 977
        </text>
      </motion.g>

      {/* 슬롯 눈금 (period 안에 작은 틱) */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={40 + i * 28} y1={57} x2={40 + i * 28} y2={63}
          stroke="var(--muted-foreground)" strokeWidth={0.5} opacity={0.4} />
      ))}
    </g>
  );
}

/* ================================================================
   Step 1 — 핸드오프 과정: current→검증, next 수신, 경계에서 교체
   ================================================================ */
export function Step1() {
  return (
    <g>
      {/* ── Period N 영역 ── */}
      <rect x={10} y={10} width={200} height={170} rx={8}
        fill={`${C.period}08`} stroke={C.period} strokeWidth={0.5} strokeDasharray="4 3" />
      <text x={110} y={26} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={C.period} opacity={0.7}>Period N</text>

      {/* current 사용 중 */}
      <ModuleBox x={22} y={36} w={85} h={40} label="current (N)" sub="서명 검증 중" color={C.current} />

      {/* Update 수신 → next */}
      <motion.g {...fade(0.3)}>
        <ActionBox x={118} y={36} w={82} h={40} label="Update 수신" sub="next (N+1)" color={C.next} />
      </motion.g>

      {/* Merkle 검증 */}
      <motion.g {...fade(0.5)}>
        <DataBox x={40} y={90} w={140} h={26} label="Merkle branch 검증 ✓" color={C.current} />
      </motion.g>

      {/* ── 경계 점선 ── */}
      <motion.line x1={225} y1={10} x2={225} y2={185}
        stroke={C.next} strokeWidth={1.5} strokeDasharray="4 3"
        {...drawLine(0.6)} />
      <motion.g {...fade(0.7)}>
        <rect x={215} y={86} width={20} height={16} rx={3} fill="var(--card)" />
        <text x={225} y={97} textAnchor="middle"
          fontSize={7} fontWeight={700} fill={C.next}>경계</text>
      </motion.g>

      {/* ── Period N+1 영역 ── */}
      <rect x={245} y={10} width={225} height={170} rx={8}
        fill={`${C.period}08`} stroke={C.period} strokeWidth={0.5} strokeDasharray="4 3" />
      <text x={358} y={26} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={C.period} opacity={0.7}>Period N+1</text>

      {/* 교체 결과: current ← next */}
      <motion.g {...fade(0.8)}>
        <ModuleBox x={258} y={36} w={92} h={40} label="current (N+1)" sub="(이전 next)" color={C.current} />
      </motion.g>

      {/* next ← None 대기 */}
      <motion.g {...fade(1.0)}>
        <rect x={362} y={36} width={95} height={40} rx={6}
          fill="var(--card)" stroke={C.muted} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={410} y={54} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={C.muted}>next = None</text>
        <text x={410} y={67} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">대기 중</text>
      </motion.g>

      {/* 새 Update에서 N+2 수신 */}
      <motion.g {...fade(1.2)}>
        <ActionBox x={290} y={90} w={120} h={36} label="Update → next (N+2)" sub="Merkle 검증" color={C.next} />
      </motion.g>

      {/* 화살표: current→next 교체 흐름 */}
      <motion.line x1={200} y1={56} x2={253} y2={56}
        stroke={C.next} strokeWidth={1} markerEnd="url(#arrowNext)"
        {...drawLine(0.7)} />

      {/* 아래 설명 */}
      <motion.g {...fade(1.3)}>
        <rect x={60} y={140} width={350} height={34} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={235} y={155} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          경계에서 즉시 교체 → 한 period 미리 받아서 지연 없음
        </text>
        <text x={235} y={167} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          Reth는 BeaconState 직접 읽기 — "미리 받기" 불필요
        </text>
      </motion.g>

      {/* marker 정의 */}
      <defs>
        <marker id="arrowNext" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.next} />
        </marker>
      </defs>
    </g>
  );
}

/* ================================================================
   Step 2 — 실패 케이스: next=None 상태에서 경계 넘기
   ================================================================ */
export function Step2() {
  return (
    <g>
      {/* 문제 상황 */}
      <AlertBox x={20} y={14} w={180} h={50}
        label="next_committee = None" sub="period 경계 도달" color={C.alert} />

      {/* 화살표 → 결과 */}
      <motion.line x1={205} y1={39} x2={240} y2={39}
        stroke={C.alert} strokeWidth={1} markerEnd="url(#arrowAlert)"
        {...drawLine(0.3)} />

      {/* 결과: 검증 불가 */}
      <motion.g {...fade(0.4)}>
        <AlertBox x={245} y={14} w={110} h={50}
          label="서명 검증 불가" sub="새 위원회 미확보" color={C.alert} />
      </motion.g>

      {/* 화살표 → 해결 */}
      <motion.line x1={360} y1={39} x2={385} y2={39}
        stroke={C.current} strokeWidth={1} markerEnd="url(#arrowResolve)"
        {...drawLine(0.6)} />

      {/* 해결 방법 */}
      <motion.g {...fade(0.7)}>
        <ModuleBox x={390} y={10} w={80} h={58}
          label="재부트스트랩" sub="checkpoint에서" color={C.current} />
      </motion.g>

      {/* 상세 설명 영역 */}
      <motion.g {...fade(0.9)}>
        <rect x={20} y={80} width={210} height={54} rx={6}
          fill="var(--card)" stroke={C.alert} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={125} y={96} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.alert}>왜 발생하는가</text>
        <text x={125} y={110} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          네트워크 단절, Beacon API 장애,
        </text>
        <text x={125} y={122} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          또는 오랜 오프라인으로 Update 수신 실패
        </text>
      </motion.g>

      <motion.g {...fade(1.1)}>
        <rect x={250} y={80} width={220} height={54} rx={6}
          fill="var(--card)" stroke={C.current} strokeWidth={0.5} />
        <text x={360} y={96} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.current}>복구 경로</text>
        <text x={360} y={110} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          ① 마지막 체크포인트로 warm start
        </text>
        <text x={360} y={122} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          ② Beacon API에서 Update 재요청
        </text>
      </motion.g>

      {/* marker 정의 */}
      <defs>
        <marker id="arrowAlert" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.alert} />
        </marker>
        <marker id="arrowResolve" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.current} />
        </marker>
      </defs>
    </g>
  );
}
