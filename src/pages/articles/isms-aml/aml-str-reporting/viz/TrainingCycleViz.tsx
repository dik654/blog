import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { edu: '#6366f1', all: '#10b981', aml: '#ef4444', exec: '#f59e0b', record: '#3b82f6' };

const STEPS = [
  { label: '대상별 교육 주기', body: '전 직원(연1) / CS·출금팀(반기1) / AML 담당(분기1) / 경영진(연1). 역할별 내용 차등.' },
  { label: '교육 내용 4가지 핵심', body: '특금법 개요 + 의심 징후 식별 + SAR 작성법 심화 + 최신 세탁 유형.' },
  { label: '교육 기록 = 규제 점검 증빙', body: '참석자 명단, 교육 자료, 평가 결과, 미이수자 보충 교육까지 모두 기록 필수.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tc-arrow)" />;
}

export default function TrainingCycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.edu}>대상별 교육 주기</text>
              {/* Timeline bar */}
              <text x={30} y={40} fontSize={8} fill="var(--muted-foreground)">Q1</text>
              <text x={140} y={40} fontSize={8} fill="var(--muted-foreground)">Q2</text>
              <text x={250} y={40} fontSize={8} fill="var(--muted-foreground)">Q3</text>
              <text x={360} y={40} fontSize={8} fill="var(--muted-foreground)">Q4</text>

              {/* AML 담당: 분기 */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <text x={440} y={62} fontSize={8} fill={C.aml}>AML 담당자</text>
                {[0, 1, 2, 3].map((i) => (
                  <rect key={i} x={25 + i * 110} y={50} width={80} height={14} rx={3} fill={C.aml} opacity={0.6} />
                ))}
              </motion.g>

              {/* CS/출금: 반기 */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <text x={440} y={85} fontSize={8} fill={C.exec}>CS/출금팀</text>
                {[0, 1].map((i) => (
                  <rect key={i} x={25 + i * 220} y={73} width={190} height={14} rx={3} fill={C.exec} opacity={0.5} />
                ))}
              </motion.g>

              {/* 전 직원: 연 1회 */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <text x={440} y={108} fontSize={8} fill={C.all}>전 직원</text>
                <rect x={25} y={96} width={410} height={14} rx={3} fill={C.all} opacity={0.4} />
              </motion.g>

              {/* 경영진: 연 1회 */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <text x={440} y={131} fontSize={8} fill={C.edu}>경영진</text>
                <rect x={25} y={119} width={410} height={14} rx={3} fill={C.edu} opacity={0.35} />
              </motion.g>

              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                역할별 위험 노출 정도에 따라 교육 빈도 차등 — AML 담당이 가장 빈번
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                "형식적 이수"가 아니라 "실질적 역량 강화"가 목표 — 내용의 실효성도 규제 평가 대상
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.edu}>교육 내용 4가지 핵심 영역</text>
              {[
                { label: '특금법 + 가상자산법', sub: '법적 의무·위반 제재·개정 사항', color: C.edu },
                { label: '의심 징후 식별', sub: '구조화·빠른 이동·명의 불일치', color: C.exec },
                { label: 'SAR 작성법 심화', sub: '의심 사유 서술·증빙 구성', color: C.aml },
                { label: '최신 세탁 유형', sub: 'DeFi·브릿지·AI 계정·스테이블코인', color: C.all },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i }}>
                  <ActionBox x={20} y={30 + i * 38} w={200} h={32} label={item.label} sub={item.sub} color={item.color} />
                </motion.g>
              ))}
              {/* Who */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <text x={350} y={46} fontSize={8} fill={C.edu}>← 전 직원</text>
                <text x={350} y={84} fontSize={8} fill={C.exec}>← CS/출금팀 심화</text>
                <text x={350} y={122} fontSize={8} fill={C.aml}>← AML 담당자 전용</text>
                <text x={350} y={160} fontSize={8} fill={C.all}>← 분기별 갱신 필수</text>
              </motion.g>

              <AlertBox x={240} y={38} w={220} h={40} label="실제 SAR 사례 활용" sub="익명화 처리 후 교육 자료로 사용하면 효과 극대화" color={C.aml} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.record}>교육 기록 = 규제 점검 핵심 증빙</text>
              {[
                { label: '참석자 명단', sub: '이름·부서·서명', x: 10 },
                { label: '교육 일시/장소', sub: '주기 준수 확인', x: 105 },
                { label: '교육 자료', sub: '교재·발표자료', x: 200 },
                { label: '평가 결과', sub: '테스트 점수', x: 295 },
                { label: '개선 조치', sub: '후속 이행 여부', x: 390 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + 0.1 * i }}>
                  <DataBox x={item.x} y={30} w={85} h={44} label={item.label} sub={item.sub} color={C.record} />
                </motion.g>
              ))}
              {/* Flow */}
              {[52, 147, 242, 337, 432].map((x, i) => (
                <Arrow key={i} x1={x} y1={74} x2={240} y2={98} color={C.record} />
              ))}
              <StatusBox x={140} y={100} w={200} h={30} label="규제 점검 시 제시" sub="" color={C.record} progress={1} />

              {/* Missing note */}
              <AlertBox x={40} y={148} w={400} h={32} label="미이수자 후속 조치도 기록 대상" sub='"3명 미참석"으로 끝 NG → 보충 교육 일정 + 이수 확인까지 기록' color={C.exec} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
