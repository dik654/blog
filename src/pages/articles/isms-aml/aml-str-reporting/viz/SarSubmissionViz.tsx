import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { write: '#10b981', submit: '#3b82f6', follow: '#ef4444', warn: '#f59e0b' };

const STEPS = [
  { label: 'SAR 필수 기재 5항목', body: '거래 일시/금액, 계정/지갑, 의심 사유(핵심), 증빙자료, VASP 조치 내역.' },
  { label: '제출 → 후속 조치', body: '준법감시인 승인 → FIU 전자 제출 → 모니터링 유지 + 수사 협조 + 교훈 반영. 끝이 아니라 시작.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ss-arrow)" />;
}

export default function SarSubmissionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ss-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.write}>SAR 필수 기재 항목</text>
              <ModuleBox x={165} y={25} w={150} h={34} label="SAR 초안 작성" sub="AML 담당자 + 보안팀" color={C.write} />
              {[
                { label: '거래 일시/금액', x: 10 },
                { label: '계정/지갑 주소', x: 105 },
                { label: '의심 사유', x: 200, highlight: true },
                { label: '증빙자료', x: 295 },
                { label: '조치 내역', x: 390 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + 0.1 * i }}>
                  <Arrow x1={240} y1={59} x2={item.x + 40} y2={78} color={item.highlight ? C.follow : C.write} />
                  {item.highlight ? (
                    <ActionBox x={item.x} y={80} w={85} h={34} label={item.label} sub="핵심 항목" color={C.follow} />
                  ) : (
                    <DataBox x={item.x} y={83} w={85} h={28} label={item.label} color={C.write} />
                  )}
                </motion.g>
              ))}
              {/* Example */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <rect x={20} y={130} width={440} height={48} rx={5} fill={`${C.follow}06`} stroke={C.follow} strokeWidth={0.5} />
                <text x={240} y={146} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.follow}>의심 사유 작성 예시</text>
                <text x={240} y={160} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  "가입 3일 차 대학생이 5천만 원 입금 후 30분 내 Tornado Cash 2홉 연결 주소로 전액 출금.
                </text>
                <text x={240} y={172} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  소득-거래 불일치 + 온체인 위험 점수 87점" → 논리적 서술이 핵심
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">제출 → 후속 조치 흐름</text>
              {/* Flow chain */}
              <DataBox x={10} y={30} w={90} h={30} label="SAR 초안" color={C.write} />
              <Arrow x1={100} y1={45} x2={118} y2={45} color={C.submit} />
              <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <ModuleBox x={121} y={28} w={110} h={34} label="준법감시인" sub="최종 승인" color={C.submit} />
              </motion.g>
              <Arrow x1={231} y1={45} x2={249} y2={45} color={C.submit} />
              <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={252} y={28} w={100} h={34} label="FIU 전자 제출" sub="goAML" color={C.submit} />
              </motion.g>
              <Arrow x1={352} y1={45} x2={370} y2={45} color={C.write} />
              <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                <StatusBox x={373} y={28} w={95} h={34} label="제출 완료" sub="" color={C.write} progress={1} />
              </motion.g>

              {/* Post-submission */}
              <text x={240} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.follow}>SAR 제출 후 = 끝이 아니라 시작</text>
              <Arrow x1={240} y1={86} x2={240} y2={96} color={C.follow} />
              {[
                { label: '계정 모니터링', sub: '지속 감시 + 후속 SAR', x: 10 },
                { label: '수사 협조', sub: '자료 즉시 응대', x: 130 },
                { label: '계정 처리', sub: '해지 검토', x: 250 },
                { label: '교훈 반영', sub: 'FDS 규칙 갱신', x: 370 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + 0.12 * i }}>
                  <ActionBox x={item.x} y={98} w={110} h={36} label={item.label} sub={item.sub} color={C.follow} />
                </motion.g>
              ))}

              <AlertBox x={60} y={150} w={360} h={32} label="방어적 보고(Defensive Filing) 지양" sub="양보다 질 — 구체성 + 논리성이 FIU 평가 기준" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
