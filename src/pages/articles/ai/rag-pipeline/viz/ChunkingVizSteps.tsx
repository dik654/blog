import { motion } from 'framer-motion';
import { C, CHUNK_SIZES } from './ChunkingVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: 고정 크기 청킹 */
function FixedSizeStep() {
  const chunks = [
    { start: 0, end: 512, label: 'Chunk 1' },
    { start: 512, end: 1024, label: 'Chunk 2' },
    { start: 1024, end: 1536, label: 'Chunk 3' },
    { start: 1536, end: 2048, label: 'Chunk 4' },
  ];
  const docW = 440;
  const scale = docW / 2048;
  return (
    <g>
      {/* 원본 문서 */}
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        원본 문서 (2048 토큰)
      </text>
      <rect x={20} y={20} width={docW} height={24} rx={4} fill={C.fixed + '08'} stroke={C.fixed} strokeWidth={0.5} />
      {/* 문장 경계 표시 (불균등) */}
      {[180, 420, 530, 780, 1100, 1450, 1800].map((pos, i) => (
        <line key={i} x1={20 + pos * scale} y1={22} x2={20 + pos * scale} y2={42}
          stroke={C.muted} strokeWidth={0.3} strokeDasharray="2 1" />
      ))}
      {/* 고정 크기 분할선 */}
      {[512, 1024, 1536].map((pos, i) => (
        <motion.line key={i} x1={20 + pos * scale} y1={18} x2={20 + pos * scale} y2={46}
          stroke={C.fixed} strokeWidth={1.5}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }} />
      ))}
      {/* 청크 결과 */}
      {chunks.map((c, i) => {
        const x = 20 + c.start * scale;
        const w = (c.end - c.start) * scale;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, ...sp }}>
            <rect x={x} y={58} width={w - 2} height={30} rx={5}
              fill={C.fixed + '12'} stroke={C.fixed} strokeWidth={1} />
            <text x={x + w / 2 - 1} y={72} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fixed}>
              {c.label}
            </text>
            <text x={x + w / 2 - 1} y={82} textAnchor="middle" fontSize={7} fill={C.muted}>
              512 토큰
            </text>
          </motion.g>
        );
      })}
      {/* 문제점 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={120} y={98} width={240} height={20} rx={4}
          fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={240} y={112} textAnchor="middle" fontSize={8} fill="#ef4444">
          문장 중간에서 잘림 -- 문맥 손실 발생
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: 의미 단위 청킹 */
function SemanticStep() {
  const sections = [
    { label: '1. 개요', w: 80, color: C.semantic },
    { label: '2. 절삭 조건', w: 130, color: C.semantic },
    { label: '3. 정비 절차', w: 110, color: C.semantic },
    { label: '4. 주의사항', w: 90, color: C.semantic },
  ];
  let cx = 15;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        의미 단위 분할 (섹션/문단 경계 기준)
      </text>
      {/* Recursive splitter 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <text x={20} y={30} fontSize={7} fill={C.semantic}>분할 우선순위: \\n\\n → \\n → . → 공백</text>
      </motion.g>
      {/* 섹션별 청크 */}
      {sections.map((s, i) => {
        const x = cx;
        cx += s.w + 8;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, ...sp }}>
            <rect x={x} y={40} width={s.w} height={38} rx={6}
              fill={s.color + '12'} stroke={s.color} strokeWidth={1} />
            <text x={x + s.w / 2} y={57} textAnchor="middle" fontSize={9} fontWeight={600} fill={s.color}>
              {s.label}
            </text>
            <text x={x + s.w / 2} y={70} textAnchor="middle" fontSize={7} fill={C.muted}>
              {i === 0 ? '80t' : i === 1 ? '450t' : i === 2 ? '320t' : '120t'}
            </text>
          </motion.g>
        );
      })}
      {/* 크기 불균일 경고 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={15} y={92} width={200} height={18} rx={4}
          fill={C.semantic + '08'} stroke={C.semantic} strokeWidth={0.5} />
        <text x={115} y={104} textAnchor="middle" fontSize={8} fill={C.semantic}>
          장점: 문맥 완결성 보존
        </text>
        <rect x={230} y={92} width={220} height={18} rx={4}
          fill="#ef444408" stroke="#ef4444" strokeWidth={0.5} />
        <text x={340} y={104} textAnchor="middle" fontSize={8} fill="#ef4444">
          단점: 크기 불균일 (80t ~ 450t)
        </text>
      </motion.g>
    </g>
  );
}

/* Step 2: 오버랩 전략 */
function OverlapStep() {
  const chunks = [
    { start: 0, end: 512 },
    { start: 462, end: 974 },
    { start: 924, end: 1436 },
  ];
  const docW = 420;
  const scale = docW / 1500;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        오버랩 전략: 50 토큰 겹침으로 경계 정보 보존
      </text>
      {/* 원본 문서 바 */}
      <rect x={30} y={24} width={docW} height={14} rx={3}
        fill={C.muted + '10'} stroke={C.muted} strokeWidth={0.5} />
      {/* 청크 겹침 표현 */}
      {chunks.map((c, i) => {
        const x = 30 + c.start * scale;
        const w = (c.end - c.start) * scale;
        const y = 50 + i * 28;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, ...sp }}>
            <rect x={x} y={y} width={w} height={22} rx={5}
              fill={C.overlap + '12'} stroke={C.overlap} strokeWidth={1} />
            <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.overlap}>
              Chunk {i + 1}: [{c.start}..{c.end}]
            </text>
            {/* 겹침 영역 하이라이트 */}
            {i > 0 && (
              <rect x={x} y={y} width={50 * scale} height={22} rx={3}
                fill={C.overlap + '30'} />
            )}
          </motion.g>
        );
      })}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.overlap}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        진한 영역 = 겹침(50토큰) -- 앞 청크의 마지막 문맥이 다음 청크에 포함
      </motion.text>
    </g>
  );
}

/* Step 3: 계층적 청킹 */
function HierarchicalStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        계층적 청킹: 문서 → 섹션 → 문단
      </text>
      {/* L1: 문서 */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={160} y={22} width={160} height={28} rx={6}
          fill={C.hier + '15'} stroke={C.hier} strokeWidth={1.5} />
        <text x={240} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hier}>
          CNC-7200 매뉴얼
        </text>
        <text x={380} y={40} fontSize={7} fill={C.muted}>L1: doc_id</text>
      </motion.g>
      {/* L2: 섹션 */}
      {['정비 절차', '절삭 조건', '안전 수칙'].map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08, ...sp }}>
          <line x1={240} y1={50} x2={80 + i * 160} y2={60} stroke={C.hier} strokeWidth={0.8} />
          <rect x={30 + i * 160} y={60} width={100} height={24} rx={5}
            fill={C.hier + '10'} stroke={C.hier} strokeWidth={0.8} />
          <text x={80 + i * 160} y={76} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.hier}>{s}</text>
        </motion.g>
      ))}
      <text x={440} y={76} fontSize={7} fill={C.muted}>L2: section</text>
      {/* L3: 문단 */}
      {[0, 1].map(j => (
        <motion.g key={j} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + j * 0.1 }}>
          <line x1={80} y1={84} x2={40 + j * 80} y2={96} stroke={C.hier} strokeWidth={0.5} />
          <rect x={10 + j * 80} y={96} width={60} height={20} rx={4}
            fill={C.hier + '08'} stroke={C.hier} strokeWidth={0.5} />
          <text x={40 + j * 80} y={110} textAnchor="middle" fontSize={7} fill={C.hier}>
            단계 {j + 1}
          </text>
        </motion.g>
      ))}
      <text x={440} y={110} fontSize={7} fill={C.muted}>L3: paragraph</text>
      {/* 메타데이터 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={140} y={126} width={200} height={18} rx={4}
          fill={C.hier + '08'} stroke={C.hier} strokeWidth={0.5} />
        <text x={240} y={138} textAnchor="middle" fontSize={7} fill={C.hier}>
          메타: doc_id + section_title + page_num
        </text>
      </motion.g>
    </g>
  );
}

/* Step 4: 최적 크기 실험 바 차트 */
function OptimalSizeStep() {
  const barW = 65;
  const barMaxH = 70;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        청크 크기별 F1 점수 비교
      </text>
      {/* Y축 */}
      <line x1={45} y1={24} x2={45} y2={108} stroke={C.muted} strokeWidth={0.5} />
      {[0.6, 0.7, 0.8].map(v => (
        <g key={v}>
          <line x1={42} y1={108 - ((v - 0.5) / 0.4) * barMaxH} x2={45}
            y2={108 - ((v - 0.5) / 0.4) * barMaxH} stroke={C.muted} strokeWidth={0.5} />
          <text x={39} y={111 - ((v - 0.5) / 0.4) * barMaxH} textAnchor="end"
            fontSize={7} fill={C.muted}>{v.toFixed(1)}</text>
        </g>
      ))}
      {/* 바 */}
      {CHUNK_SIZES.map((d, i) => {
        const x = 55 + i * (barW + 16);
        const h = ((d.f1 - 0.5) / 0.4) * barMaxH;
        const isBest = i === 2; // 512
        return (
          <motion.g key={i} initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            style={{ transformOrigin: `${x + barW / 2}px 108px` }}
            transition={{ delay: i * 0.08, ...sp }}>
            <rect x={x} y={108 - h} width={barW} height={h} rx={4}
              fill={isBest ? C.optimal + '30' : C.optimal + '15'}
              stroke={isBest ? C.optimal : C.optimal + '80'} strokeWidth={isBest ? 1.5 : 0.8} />
            <text x={x + barW / 2} y={104 - h} textAnchor="middle" fontSize={8}
              fontWeight={isBest ? 700 : 500} fill={isBest ? C.optimal : C.muted}>
              {d.f1.toFixed(2)}
            </text>
            <text x={x + barW / 2} y={122} textAnchor="middle" fontSize={7} fill={C.muted}>
              {d.size}t
            </text>
            {isBest && (
              <text x={x + barW / 2} y={135} textAnchor="middle" fontSize={7}
                fontWeight={700} fill={C.optimal}>최적</text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
}

export default function ChunkingVizSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <FixedSizeStep />;
    case 1: return <SemanticStep />;
    case 2: return <OverlapStep />;
    case 3: return <HierarchicalStep />;
    case 4: return <OptimalSizeStep />;
    default: return <g />;
  }
}
