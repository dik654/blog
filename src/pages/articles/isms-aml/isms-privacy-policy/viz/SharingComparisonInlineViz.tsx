import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  provide: '#ef4444',
  entrust: '#6366f1',
  transfer: '#f59e0b',
  highlight: '#10b981',
};

const STEPS = [
  { label: '제3자 제공 vs 위탁: 핵심 차이', body: '판단 기준: "받는 자가 자기 목적으로 쓰는가?" 예 → 제3자 제공(별도 동의 필수). 아니오 → 위탁(계약+공개). 혼동하면 법적 의무 오류.' },
  { label: '3가지 유형 비교', body: '제3자 제공: 제17조 별도 동의, 제3자 독립 책임. 위탁: 제26조 계약+공개, 위탁자 관리 감독. 국외 이전: 제28조의8 고지+보호조치, 이전 유형 따라 상이.' },
  { label: 'ISMS-P 심사 확인 포인트', body: '현황표와 실제 데이터 흐름 일치 여부, 제공·위탁 추가 시 처리방침 즉시 갱신 여부, 위탁 계약서 존재 여부, 국외 이전 고지·동의 여부.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#sc-inline-arrow)" />;
}

export default function SharingComparisonInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sc-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">제3자 제공 vs 위탁 판단 기준</text>

              {/* 판단 질문 */}
              <ActionBox x={130} y={28} w={220} h={36} label="받는 자가 자기 목적으로 사용하는가?" sub="" color={C.highlight} />

              {/* 분기 */}
              <Arrow x1={200} y1={64} x2={100} y2={82} color={C.provide} />
              <Arrow x1={280} y1={64} x2={380} y2={82} color={C.entrust} />

              <text x={140} y={78} fontSize={9} fontWeight={600} fill={C.provide}>예</text>
              <text x={330} y={78} fontSize={9} fontWeight={600} fill={C.entrust}>아니오</text>

              {/* 제3자 제공 */}
              <ModuleBox x={15} y={85} w={180} h={45} label="제3자 제공" sub="별도 동의 필수 (제17조)" color={C.provide} />
              <DataBox x={25} y={138} w={160} h={22} label="제3자가 독립 책임" color={C.provide} />

              {/* 위탁 */}
              <ModuleBox x={280} y={85} w={185} h={45} label="업무 위탁" sub="계약 + 공개 (제26조)" color={C.entrust} />
              <DataBox x={290} y={138} w={165} h={22} label="위탁자가 관리·감독" color={C.entrust} />

              <AlertBox x={100} y={170} w={280} h={24} label="혼동 시: 동의 누락 또는 불필요 동의 → 법 위반" sub="" color={C.transfer} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">3가지 유형 비교</text>

              {/* 헤더 */}
              <text x={80} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.provide}>제3자 제공</text>
              <text x={240} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.entrust}>업무 위탁</text>
              <text x={400} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.transfer}>국외 이전</text>

              {/* 법적 근거 */}
              <DataBox x={15} y={44} w={130} h={26} label="제17조 별도 동의" color={C.provide} />
              <DataBox x={175} y={44} w={130} h={26} label="제26조 계약+공개" color={C.entrust} />
              <DataBox x={335} y={44} w={130} h={26} label="제28조의8 고지" color={C.transfer} />

              {/* 이용 목적 */}
              <DataBox x={15} y={78} w={130} h={26} label="제3자 자체 목적" color={C.provide} />
              <DataBox x={175} y={78} w={130} h={26} label="위탁자 업무 대행" color={C.entrust} />
              <DataBox x={335} y={78} w={130} h={26} label="제공 또는 위탁" color={C.transfer} />

              {/* 관리 책임 */}
              <DataBox x={15} y={112} w={130} h={26} label="독립 책임" color={C.provide} />
              <DataBox x={175} y={112} w={130} h={26} label="위탁자 감독" color={C.entrust} />
              <DataBox x={335} y={112} w={130} h={26} label="이전자 확인" color={C.transfer} />

              {/* 동의 */}
              <DataBox x={15} y={146} w={130} h={26} label="필수 (예외 제한)" color={C.provide} />
              <DataBox x={175} y={146} w={130} h={26} label="불필요 (공개)" color={C.highlight} />
              <DataBox x={335} y={146} w={130} h={26} label="유형 따라 상이" color={C.transfer} />

              <text x={5} y={97} fontSize={8} fill="var(--muted-foreground)" dominantBaseline="middle">목적</text>
              <text x={5} y={131} fontSize={8} fill="var(--muted-foreground)" dominantBaseline="middle">책임</text>
              <text x={5} y={165} fontSize={8} fill="var(--muted-foreground)" dominantBaseline="middle">동의</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.highlight}>ISMS-P 심사 확인 포인트</text>

              <ActionBox x={30} y={30} w={190} h={34} label="현황표 = 실제 데이터 흐름" sub="일치 여부 확인" color={C.highlight} />
              <ActionBox x={250} y={30} w={200} h={34} label="제공·위탁 추가 시 즉시 갱신" sub="처리방침 업데이트 확인" color={C.highlight} />

              <ActionBox x={30} y={80} w={190} h={34} label="위탁 계약서 존재 여부" sub="수탁자 관리·감독 증적" color={C.entrust} />
              <ActionBox x={250} y={80} w={200} h={34} label="국외 이전 고지·동의 여부" sub="법적 예외 해당 여부 확인" color={C.transfer} />

              <line x1={15} y1={130} x2={465} y2={130} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={100} y={140} w={280} h={36} label="현황표와 실제 불일치 → 3.2 / 3.5 부적합" sub="새로운 위탁·제공 추가 시 처리방침 즉시 반영" color={C.provide} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
