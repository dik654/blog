import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { know: '#6366f1', partial: '#f59e0b', deny: '#94a3b8', ctrl: '#3b82f6', red: '#ef4444' };

const STEPS = [
  { label: 'Need-to-know 원칙', body: 'SAR 사실은 "알아야 할 사람만" 인지. 준법감시인+AML 담당자만 필수. 불필요한 확산 = 위험 증가.' },
  { label: 'Tipping-off 방지 통제 5가지', body: '접근 통제 + CS 스크립트 + 교육 + 감사 로그 + 내부 신고 채널. 다층 방어.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ntk-arrow)" />;
}

export default function NeedToKnowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ntk-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.know}>SAR 인지 범위 — Need-to-know</text>
              {/* Tiers */}
              <ModuleBox x={20} y={28} w={120} h={40} label="준법감시인" sub="인지 (필수)" color={C.know} />
              <ModuleBox x={150} y={28} w={120} h={40} label="AML 담당자" sub="인지 (필수)" color={C.know} />
              <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={280} y={28} w={80} h={40} label="경영진" sub="필요 시" color={C.partial} />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={370} y={28} w={100} h={40} label="보안팀" sub="분석 결과만" color={C.partial} />
              </motion.g>

              {/* Divider */}
              <line x1={20} y1={82} x2={460} y2={82} stroke={C.red} strokeWidth={0.7} strokeDasharray="4 3" />
              <text x={240} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>SAR 사실 인지 차단선</text>

              {/* Denied */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <rect x={40} y={105} width={120} height={34} rx={5} fill={`${C.deny}10`} stroke={C.deny} strokeWidth={0.6} />
                <text x={100} y={120} textAnchor="middle" fontSize={8} fill={C.deny}>운영팀/CS팀</text>
                <text x={100} y={132} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">"계정 제한"만 전달</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                <rect x={200} y={105} width={120} height={34} rx={5} fill={`${C.deny}10`} stroke={C.deny} strokeWidth={0.6} />
                <text x={260} y={120} textAnchor="middle" fontSize={8} fill={C.deny}>일반 직원</text>
                <text x={260} y={132} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">업무상 관련 없음</text>
              </motion.g>

              <rect x={40} y={155} width={400} height={30} rx={5} fill={`${C.know}06`} stroke={C.know} strokeWidth={0.5} />
              <text x={240} y={168} textAnchor="middle" fontSize={8.5} fill={C.know}>CS가 SAR 사실을 모르므로 고객 응대 시 실수로 Tipping-off 할 수 없음</text>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"계정 제한" 사실만 알고, 이유는 모른다 = 안전 설계</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ctrl}>Tipping-off 방지 통제 체계</text>
              {[
                { label: '접근 통제', sub: 'SAR 시스템 AML+CCO만', x: 10, y: 30 },
                { label: 'CS 응대 스크립트', sub: '표준 문구 사전 마련', x: 120, y: 30 },
                { label: '정기 교육', sub: '연 1회 전사 필수', x: 230, y: 30 },
                { label: '감사 로그', sub: 'SAR 접근 기록 전수', x: 340, y: 30 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + 0.12 * i }}>
                  <ActionBox x={item.x} y={item.y} w={100} h={44} label={item.label} sub={item.sub} color={C.ctrl} />
                </motion.g>
              ))}
              {/* Fifth control */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <ActionBox x={170} y={85} w={140} h={40} label="내부 신고 채널" sub="익명 Tipping-off 신고" color={C.ctrl} />
              </motion.g>
              {/* All converge */}
              {[60, 170, 280, 390].map((x, i) => (
                <Arrow key={i} x1={x} y1={74} x2={240} y2={85} color={C.ctrl} />
              ))}

              {/* Common mistake */}
              <AlertBox x={30} y={142} w={420} h={40} label="가장 흔한 위반: CS 응대" sub='"AML 팀에서 확인 중입니다" — CS 직원이 SAR 모르더라도 이 표현이 추론 가능하게 함' color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
