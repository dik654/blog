import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { doc: '#6366f1', time: '#10b981', warn: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '5가지 문서화 범주', body: '위험평가·정책·CDD·거래/보고·교육/감사 — 규제 점검은 "문서"로 이행 여부를 판단.' },
  { label: '보관 기간 5년 + 기산점', body: '특금법 제5조의3: 최소 5년. 기산점은 "거래 관계 종료일" 또는 "거래일" 중 늦은 날.' },
  { label: '보관 형태 요건', body: '"즉시 제공 가능" = 검색 가능 + 무결성 보장 + 추출 가능. 못 찾으면 미보관과 동일.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rp-arrow)" />;
}

export default function RetentionPeriodViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rp-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">AML/CFT 문서화 5대 범주</text>
              {[
                { label: '위험평가', sub: '매트릭스·보고서', x: 10 },
                { label: '정책·절차', sub: '규정·매뉴얼', x: 105 },
                { label: 'CDD 기록', sub: '신원확인·EDD', x: 200 },
                { label: '거래·보고', sub: 'STR·CTR', x: 295 },
                { label: '교육·감사', sub: '기록·보고서', x: 390 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                  <DataBox x={item.x} y={30} w={85} h={44} label={item.label} sub={item.sub} color={C.doc} />
                </motion.g>
              ))}
              {/* All converge */}
              {[0, 1, 2, 3, 4].map((i) => (
                <Arrow key={i} x1={52 + i * 95} y1={74} x2={240} y2={100} color={C.doc} />
              ))}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <ModuleBox x={140} y={102} w={200} h={36} label="규제 점검 기반" sub="문서 없으면 증명 불가" color={C.doc} />
              </motion.g>
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                FATF 상호평가 + FIU 검사 + 외부 감사 = 모두 문서 기반 판단
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.time}>보관 기간: 5년 이상</text>
              {/* Timeline */}
              <rect x={40} y={40} width={400} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              {/* Example */}
              <circle cx={120} cy={44} r={4} fill={C.time} />
              <text x={120} y={65} textAnchor="middle" fontSize={8} fill={C.time}>2024 가입</text>
              <circle cx={240} cy={44} r={4} fill={C.warn} />
              <text x={240} y={65} textAnchor="middle" fontSize={8} fill={C.warn}>2027 탈퇴</text>
              <motion.rect x={240} y={40} width={160} height={8} rx={4} fill={C.time} opacity={0.5}
                initial={{ width: 0 }} animate={{ width: 160 }} transition={{ duration: 0.8 }} />
              <circle cx={400} cy={44} r={4} fill={C.red} />
              <text x={400} y={65} textAnchor="middle" fontSize={8} fill={C.red}>2032 보관 만료</text>
              {/* 5년 span */}
              <line x1={240} y1={32} x2={400} y2={32} stroke={C.time} strokeWidth={1} />
              <text x={320} y={30} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.time}>5년</text>
              {/* Table */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {[
                  { type: 'CDD 자료', base: '거래 관계 종료일' },
                  { type: 'STR 보고', base: '보고일' },
                  { type: 'Travel Rule', base: '거래 관계 종료일' },
                ].map((row, i) => (
                  <g key={i}>
                    <rect x={60} y={82 + i * 26} width={160} height={22} rx={3} fill={`${C.doc}08`} stroke={C.doc} strokeWidth={0.4} />
                    <text x={140} y={97 + i * 26} textAnchor="middle" fontSize={8} fill={C.doc}>{row.type}: 5년+</text>
                    <rect x={230} y={82 + i * 26} width={190} height={22} rx={3} fill={`${C.time}06`} stroke={C.time} strokeWidth={0.4} />
                    <text x={325} y={97 + i * 26} textAnchor="middle" fontSize={8} fill={C.time}>기산: {row.base}</text>
                  </g>
                ))}
              </motion.g>
              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">수사 진행 중이면 수사 종결 시까지 연장</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">보관 형태: "즉시 제공 가능"</text>
              <ModuleBox x={150} y={28} w={180} h={36} label="FIU / 수사기관 요청" sub="자료 제공 요구" color={C.red} />
              <Arrow x1={240} y1={64} x2={240} y2={82} color={C.red} />
              {/* Three requirements */}
              {[
                { label: '검색 가능', sub: '인덱싱 + 쿼리', x: 30, color: C.doc },
                { label: '무결성 보장', sub: '해시값 + 타임스탬프', x: 175, color: C.time },
                { label: '추출 가능', sub: '물리적/전자적', x: 320, color: C.warn },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + 0.15 * i }}>
                  <ActionBox x={item.x} y={85} w={140} h={40} label={item.label} sub={item.sub} color={item.color} />
                </motion.g>
              ))}
              <AlertBox x={60} y={142} w={360} h={35} label='"보관하고 있었지만 찾을 수 없다"' sub="= 사실상 미보관 → 동일 제재 적용" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
