import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

/* ── Step 3: Weak Subjectivity 타임라인 ──────────── */
export function Step3() {
  const tlY = 80;
  const tlLeft = 30;
  const tlRight = 450;
  const tlW = tlRight - tlLeft;
  /* 2주 ≈ 스펙의 ~10% 지점, 5.5개월 ≈ 85% 지점 */
  const safeEnd = tlLeft + tlW * 0.28;    /* 2주 권장 */
  const dangerStart = safeEnd;
  const maxEnd = tlLeft + tlW * 0.82;     /* 5.5개월 */

  return (
    <g>
      {/* 타이틀 */}
      <text x={240} y={22} textAnchor="middle" fontSize={11}
        fontWeight={700} fill="var(--foreground)">
        Weak Subjectivity Period
      </text>
      <text x={240} y={36} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        체크포인트 생성 후 경과 시간 → 부트스트랩 가능 여부
      </text>

      {/* ── 타임라인 배경 바 ── */}
      <rect x={tlLeft} y={tlY} width={tlW} height={12} rx={6}
        fill="var(--border)" opacity={0.15} />

      {/* 안전 구간 (초록) */}
      <motion.rect
        x={tlLeft} y={tlY} height={12} rx={6}
        fill={C.checkpoint} opacity={0.3}
        initial={{ width: 0 }}
        animate={{ width: safeEnd - tlLeft }}
        transition={{ duration: 0.6 }}
      />

      {/* 경고 구간 (앰버 → 빨강 그라데이션) */}
      <motion.rect
        x={dangerStart} y={tlY} height={12}
        fill={C.trust} opacity={0.2}
        initial={{ width: 0 }}
        animate={{ width: maxEnd - dangerStart }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />

      {/* 위험 구간 (빨강) */}
      <motion.rect
        x={maxEnd} y={tlY} height={12} rx={0}
        fill={C.danger} opacity={0.2}
        initial={{ width: 0 }}
        animate={{ width: tlRight - maxEnd }}
        transition={{ delay: 0.7, duration: 0.4 }}
        clipPath="url(#tlEndClip)"
      />
      <defs>
        <clipPath id="tlEndClip">
          <rect x={tlLeft} y={tlY} width={tlW} height={12} rx={6} />
        </clipPath>
      </defs>

      {/* ── 체크포인트 생성 (시작점) ── */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}>
        <circle cx={tlLeft} cy={tlY + 6} r={6}
          fill={C.checkpoint} stroke="var(--card)" strokeWidth={2} />
        <text x={tlLeft} y={tlY - 10} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.checkpoint}>체크포인트 생성</text>
      </motion.g>

      {/* ── 2주 권장 마크 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <line x1={safeEnd} y1={tlY - 6} x2={safeEnd} y2={tlY + 18}
          stroke={C.trust} strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={safeEnd} y={tlY - 12} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.trust}>~2주 권장</text>
        <text x={(tlLeft + safeEnd) / 2} y={tlY + 30} textAnchor="middle"
          fontSize={7.5} fill={C.checkpoint}>안전 구간</text>
      </motion.g>

      {/* ── 5.5개월 최대 마크 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        <line x1={maxEnd} y1={tlY - 6} x2={maxEnd} y2={tlY + 18}
          stroke={C.danger} strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={maxEnd} y={tlY - 12} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.danger}>~5.5개월 최대</text>

        {/* 경고 삼각형 */}
        <path d={`M ${maxEnd + 30} ${tlY - 2} l 8 14 l -16 0 z`}
          fill="none" stroke={C.danger} strokeWidth={1.2} />
        <text x={maxEnd + 30} y={tlY + 10} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.danger}>!</text>
      </motion.g>

      {/* ── 위험 구간 설명 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1 }}>
        <text x={(dangerStart + maxEnd) / 2} y={tlY + 30} textAnchor="middle"
          fontSize={7.5} fill={C.trust}>검증자 탈퇴 가능</text>
        <text x={(maxEnd + tlRight) / 2} y={tlY + 30} textAnchor="middle"
          fontSize={7.5} fill={C.danger}>위험</text>
      </motion.g>

      {/* ── 하단 공격 시나리오 박스 ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}>
        <rect x={60} y={120} width={360} height={46} rx={8}
          fill="var(--card)" stroke={C.danger} strokeWidth={0.8}
          strokeDasharray="5 3" />
        <text x={240} y={138} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.danger}>기간 초과 시 공격 시나리오</text>
        <text x={240} y={152} textAnchor="middle" fontSize={8}
          fill="var(--foreground)">
          탈퇴 검증자 → stake 없음 → 슬래싱 불가 → nothing-at-stake 공격
        </text>
        <text x={240} y={164} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          가짜 서명으로 가짜 체인을 만들어 경량 클라이언트를 속임
        </text>
      </motion.g>

      {/* 핵심 메시지 */}
      <motion.text x={240} y={186} textAnchor="middle" fontSize={8}
        fontWeight={600} fill={C.checkpoint}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}>
        이 기간 내에 부트스트랩을 완료해야 안전
      </motion.text>
    </g>
  );
}

/* ── Step 4: 체크포인트 소스 3가지 ────────────────── */
export function Step4() {
  const centerX = 300;
  const centerY = 100;

  const sources = [
    {
      label: 'Beacon API',
      desc: 'GET /eth/v1/.../bootstrap/{root}',
      note: '가장 일반적',
      y: 28,
      color: C.helios,
      iconType: 'cloud' as const,
    },
    {
      label: '하드코딩',
      desc: '소스코드 내장 체크포인트',
      note: '빌드 시점 최신, 만료 가능',
      y: 88,
      color: C.source,
      iconType: 'code' as const,
    },
    {
      label: '사용자 직접',
      desc: '--checkpoint 0x85e6...',
      note: '자체 노드 → 신뢰 문제 없음',
      y: 148,
      color: C.checkpoint,
      iconType: 'cli' as const,
    },
  ];

  return (
    <g>
      {/* ── 3가지 소스 ── */}
      {sources.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.25 }}>
          {/* 소스 카드 */}
          <rect x={14} y={s.y} width={180} height={42} rx={8}
            fill="var(--card)" stroke={s.color} strokeWidth={0.8} />

          {/* 아이콘 영역 */}
          {s.iconType === 'cloud' && (
            <g>
              {/* 클라우드/서버 아이콘 */}
              <circle cx={34} cy={s.y + 16} r={6}
                fill={s.color} opacity={0.15} />
              <circle cx={42} cy={s.y + 18} r={5}
                fill={s.color} opacity={0.15} />
              <circle cx={38} cy={s.y + 12} r={5}
                fill={s.color} opacity={0.15} />
              <rect x={28} y={s.y + 18} width={20} height={6} rx={2}
                fill={s.color} opacity={0.12} />
            </g>
          )}
          {s.iconType === 'code' && (
            <g>
              {/* 소스코드 아이콘 */}
              <rect x={26} y={s.y + 8} width={24} height={26} rx={3}
                fill={s.color} opacity={0.1} stroke={s.color} strokeWidth={0.5} />
              <text x={38} y={s.y + 24} textAnchor="middle"
                fontSize={10} fontWeight={700} fill={s.color} opacity={0.5}>
                {'</>'}
              </text>
            </g>
          )}
          {s.iconType === 'cli' && (
            <g>
              {/* CLI 아이콘 */}
              <rect x={26} y={s.y + 8} width={24} height={26} rx={3}
                fill={s.color} opacity={0.1} stroke={s.color} strokeWidth={0.5} />
              <text x={38} y={s.y + 22} textAnchor="middle"
                fontSize={9} fontWeight={700} fill={s.color} opacity={0.6}>
                {'>_'}
              </text>
            </g>
          )}

          <text x={58} y={s.y + 18} fontSize={10}
            fontWeight={600} fill="var(--foreground)">{s.label}</text>
          <text x={58} y={s.y + 30} fontSize={7}
            fill="var(--muted-foreground)">{s.desc}</text>
          <text x={192} y={s.y + 14} textAnchor="end" fontSize={7}
            fontWeight={500} fill={s.color}>{s.note}</text>

          {/* 수렴 화살표 */}
          <motion.line
            x1={198} y1={s.y + 21} x2={centerX - 40} y2={centerY}
            stroke={s.color} strokeWidth={1} opacity={0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.25 + 0.2, duration: 0.4 }}
          />
        </motion.g>
      ))}

      {/* ── 중앙 수렴점: checkpoint root ── */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}>
        {/* 외부 링 */}
        <circle cx={centerX} cy={centerY} r={24}
          fill="var(--card)" stroke={C.checkpoint} strokeWidth={1.5} />
        {/* 내부 원 */}
        <circle cx={centerX} cy={centerY} r={14}
          fill={C.checkpoint} opacity={0.15} />
        <text x={centerX} y={centerY - 2} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.checkpoint}>checkpoint</text>
        <text x={centerX} y={centerY + 8} textAnchor="middle"
          fontSize={7} fill={C.checkpoint}>root</text>
      </motion.g>

      {/* ── 우측 화살표 → Helios ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1 }}>
        <line x1={centerX + 28} y1={centerY} x2={centerX + 60} y2={centerY}
          stroke={C.helios} strokeWidth={1.5}
          markerEnd="url(#arrowSrc)" />
        <ModuleBox x={centerX + 64} y={centerY - 20} w={80} h={40}
          label="Helios" sub="부트스트랩 시작" color={C.helios} />
      </motion.g>

      {/* ── 하단 다중 소스 검증 ── */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}>
        <rect x={250} y={150} width={210} height={38} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={355} y={166} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="var(--foreground)">
          다중 소스 검증
        </text>
        <text x={355} y={178} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">
          3개 중 2개 이상 일치 → 신뢰도 향상
        </text>
      </motion.g>

      {/* 화살표 마커 */}
      <defs>
        <marker id="arrowSrc" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.helios} />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 5: sync loop 시작 ──────────────────────── */
export function Step5() {
  /* 루프 원형 배치 (4개 노드) */
  const cx = 200;
  const cy = 96;
  const rx = 100;
  const ry = 55;

  /* 4개 노드 위치: Store → API → BLS 검증 → 헤더 갱신 */
  const nodes = [
    { label: 'Store', sub: '상태 저장소', x: cx - rx, y: cy, color: C.loop },
    { label: 'Beacon API', sub: '매 12초 폴링', x: cx, y: cy - ry, color: C.helios },
    { label: 'BLS 검증', sub: '서명 확인', x: cx + rx, y: cy, color: C.checkpoint },
    { label: '헤더 갱신', sub: 'finalized + optimistic', x: cx, y: cy + ry, color: C.loop },
  ];

  /* 타원형 경로 — 점이 따라감 */
  const pathD = `M ${cx - rx} ${cy}
    C ${cx - rx} ${cy - ry * 0.8} ${cx - rx * 0.3} ${cy - ry} ${cx} ${cy - ry}
    C ${cx + rx * 0.3} ${cy - ry} ${cx + rx} ${cy - ry * 0.8} ${cx + rx} ${cy}
    C ${cx + rx} ${cy + ry * 0.8} ${cx + rx * 0.3} ${cy + ry} ${cx} ${cy + ry}
    C ${cx - rx * 0.3} ${cy + ry} ${cx - rx} ${cy + ry * 0.8} ${cx - rx} ${cy}`;

  return (
    <g>
      {/* ── 루프 경로 (타원) ── */}
      <motion.path
        d={pathD}
        fill="none" stroke={C.loop} strokeWidth={1} opacity={0.25}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />

      {/* ── 순환하는 점 ── */}
      <motion.circle r={4} fill={C.loop}>
        <animateMotion
          dur="4s" repeatCount="indefinite"
          path={pathD}
        />
      </motion.circle>
      <motion.circle r={7} fill={C.loop} opacity={0.15}>
        <animateMotion
          dur="4s" repeatCount="indefinite"
          path={pathD}
        />
      </motion.circle>

      {/* ── 4개 노드 ── */}
      {nodes.map((n, i) => (
        <motion.g key={n.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.15 }}>
          {/* 노드 배경 (불투명) */}
          <circle cx={n.x} cy={n.y} r={28}
            fill="var(--card)" stroke={n.color} strokeWidth={1} />
          <text x={n.x} y={n.y - 3} textAnchor="middle"
            fontSize={8} fontWeight={700} fill="var(--foreground)">{n.label}</text>
          <text x={n.x} y={n.y + 8} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">{n.sub}</text>
        </motion.g>
      ))}

      {/* ── 화살표 방향 표시 (노드 사이) ── */}
      {[
        { x: cx - rx * 0.5, y: cy - ry * 0.6, rot: -35 },
        { x: cx + rx * 0.5, y: cy - ry * 0.6, rot: 35 },
        { x: cx + rx * 0.5, y: cy + ry * 0.6, rot: 145 },
        { x: cx - rx * 0.5, y: cy + ry * 0.6, rot: 215 },
      ].map((a, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.1 }}>
          <g transform={`translate(${a.x}, ${a.y}) rotate(${a.rot})`}>
            <path d="M -5 -3 L 3 0 L -5 3" fill={C.loop} opacity={0.6} />
          </g>
        </motion.g>
      ))}

      {/* ── 우측: RPC 사용 가능 안내 ── */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}>
        <rect x={340} y={24} width={130} height={56} rx={8}
          fill="var(--card)" stroke={C.checkpoint} strokeWidth={0.8} />
        <text x={405} y={42} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.checkpoint}>RPC 사용 가능</text>
        <text x={405} y={56} textAnchor="middle"
          fontSize={7} fill="var(--foreground)">eth_getBalance</text>
        <text x={405} y={68} textAnchor="middle"
          fontSize={7} fill="var(--foreground)">eth_call</text>

        {/* 연결 화살표 */}
        <line x1={320} y1={60} x2={336} y2={52}
          stroke={C.checkpoint} strokeWidth={0.8} opacity={0.5} />
      </motion.g>

      {/* ── 하단: FileDB warm start ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}>
        {/* 실린더 형태 (DB) */}
        <ellipse cx={405} cy={140} rx={40} ry={8}
          fill="var(--card)" stroke={C.trust} strokeWidth={0.8} />
        <rect x={365} y={140} width={80} height={24}
          fill="var(--card)" stroke={C.trust} strokeWidth={0.8} />
        <line x1={365} y1={140} x2={365} y2={164}
          stroke={C.trust} strokeWidth={0.8} />
        <line x1={445} y1={140} x2={445} y2={164}
          stroke={C.trust} strokeWidth={0.8} />
        <ellipse cx={405} cy={164} rx={40} ry={8}
          fill="var(--card)" stroke={C.trust} strokeWidth={0.8} />
        {/* DB 상단 타원 덮어쓰기 */}
        <ellipse cx={405} cy={140} rx={40} ry={8}
          fill="var(--card)" stroke={C.trust} strokeWidth={0.8} />

        <text x={405} y={155} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.trust}>FileDB</text>

        {/* 저장 화살표: Store → FileDB */}
        <motion.path
          d="M 120 148 C 180 180 320 180 365 155"
          fill="none" stroke={C.trust} strokeWidth={0.8}
          strokeDasharray="4 3" opacity={0.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        />
        <text x={240} y={186} textAnchor="middle"
          fontSize={7.5} fill="var(--muted-foreground)">
          종료 시 마지막 체크포인트 저장 (warm start)
        </text>
      </motion.g>
    </g>
  );
}
