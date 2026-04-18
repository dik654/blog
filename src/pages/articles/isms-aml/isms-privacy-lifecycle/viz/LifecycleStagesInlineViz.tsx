import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  collect: '#3b82f6',
  use: '#6366f1',
  store: '#f59e0b',
  destroy: '#ef4444',
};

const STEPS = [
  { label: '수집 → 이용 → 보관 → 파기', body: '수집: 동의 획득, 최소 수집(제15·16·22조). 이용: 목적 범위 내(제17·18조). 보관: 안전성 확보, 분리보관(제29·21조). 파기: 복구 불가(제21조).' },
  { label: '보유기간 산정 원칙', body: '"보유기간 = max(수집 목적 달성 기간, 법령 보존 의무 기간)". 목적 달성 시 즉시 파기가 원칙이나, 법령 보존 의무가 있으면 해당 기간까지 보관 후 파기.' },
  { label: '보유 → 보존 → 파기 흐름', body: '보유(서비스 이용 중) → 목적 달성 → 보존(법정 기간, 분리보관) → 법정 기간 만료 → 파기(복구 불가). 이 흐름이 생명주기 후반부.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ls-inline-arrow)" />;
}

export default function LifecycleStagesInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ls-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">개인정보 생명주기 4단계</text>

              <ModuleBox x={15} y={30} w={100} h={50} label="수집" sub="동의·최소수집" color={C.collect} />
              <Arrow x1={115} y1={55} x2={133} y2={55} color={C.collect} />

              <ModuleBox x={135} y={30} w={100} h={50} label="이용" sub="목적 범위 내" color={C.use} />
              <Arrow x1={235} y1={55} x2={253} y2={55} color={C.use} />

              <ModuleBox x={255} y={30} w={100} h={50} label="보관" sub="안전성 확보" color={C.store} />
              <Arrow x1={355} y1={55} x2={373} y2={55} color={C.store} />

              <ModuleBox x={375} y={30} w={90} h={50} label="파기" sub="복구 불가" color={C.destroy} />

              <motion.circle r={3} fill={C.collect} opacity={0.4}
                initial={{ cx: 65 }} animate={{ cx: 420 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} cy={55} />

              {/* ISMS-P 항목 매핑 */}
              <line x1={15} y1={100} x2={465} y2={100} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={116} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">ISMS-P 항목 매핑</text>

              <DataBox x={15} y={124} w={100} h={24} label="3.1 수집" color={C.collect} />
              <DataBox x={135} y={124} w={100} h={24} label="3.2 이용·제공" color={C.use} />
              <DataBox x={255} y={124} w={100} h={24} label="3.3 보관·파기" color={C.store} />
              <DataBox x={375} y={124} w={90} h={24} label="3.3 파기" color={C.destroy} />

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                각 단계마다 별도의 법적 의무 — ISMS-P 3.x가 전체 생명주기 관리
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.store}>보유기간 산정 원칙</text>

              {/* 두 가지 기간 */}
              <DataBox x={30} y={35} w={170} h={40} label="수집 목적 달성 기간" color={C.collect} />
              <DataBox x={280} y={35} w={170} h={40} label="법령 보존 의무 기간" color={C.store} />

              <Arrow x1={200} y1={55} x2={240} y2={85} color={C.collect} />
              <Arrow x1={280} y1={55} x2={240} y2={85} color={C.store} />

              <text x={240} y={98} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">max( A, B )</text>

              <Arrow x1={240} y1={105} x2={240} y2={120} color="var(--muted-foreground)" />

              <StatusBox x={140} y={122} w={200} h={36} label="보유기간 = 둘 중 더 긴 기간" sub="법령 근거와 함께 처리방침에 명시" color={C.use} />

              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                VASP: 특금법 5년 보존 의무가 대부분의 KYC 항목에 적용
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">보유 → 보존 → 파기 흐름</text>

              {/* 타임라인 */}
              <line x1={30} y1={55} x2={450} y2={55} stroke="var(--border)" strokeWidth={1.5} />

              <circle cx={80} cy={55} r={5} fill={C.collect} />
              <text x={80} y={45} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.collect}>보유</text>
              <text x={80} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">서비스 이용 중</text>

              <circle cx={200} cy={55} r={5} fill={C.store} />
              <text x={200} y={45} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.store}>목적 달성</text>
              <text x={200} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">탈퇴/종료 시점</text>

              <circle cx={330} cy={55} r={5} fill={C.store} />
              <text x={330} y={45} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.store}>보존(분리보관)</text>
              <text x={330} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">법정 기간 동안</text>

              <circle cx={430} cy={55} r={5} fill={C.destroy} />
              <text x={430} y={45} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.destroy}>파기</text>
              <text x={430} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">복구 불가 삭제</text>

              <motion.circle r={3} fill={C.use} opacity={0.5}
                initial={{ cx: 80 }} animate={{ cx: 430 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} cy={55} />

              {/* 핵심 차이 */}
              <line x1={15} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <DataBox x={30} y={105} w={130} h={30} label="보유: 서비스 목적" color={C.collect} />
              <DataBox x={175} y={105} w={130} h={30} label="보존: 법령 준수" color={C.store} />
              <DataBox x={320} y={105} w={130} h={30} label="파기: 완전 삭제" color={C.destroy} />

              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                보존 = 분리보관 대상 (접근 권한 최소화, 서비스 목적 접근 불가)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
