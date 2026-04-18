import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  law: '#6366f1',
  type: '#f59e0b',
  diff: '#10b981',
  punish: '#ef4444',
};

const STEPS = [
  { label: '가상자산이용자보호법 제10조', body: '2024년 7월 시행. 가상자산 시장의 불공정거래를 명시적으로 금지하는 최초의 법률. 자본시장법의 규제 체계를 가상자산에 맞게 재설계.' },
  { label: '3대 불공정거래 유형', body: '미공개중요정보 이용 -- 공개 전 내부 정보로 매매. 시세조종 -- 인위적 가격·거래량 왜곡. 부정거래 -- 허위·기망적 수단으로 거래 유도.' },
  { label: '가상자산 시장의 구조적 취약성', body: '24시간 거래, 글로벌 접근, 의사 익명성, 낮은 유동성, 정보 비대칭. 이 5가지 요인이 불공정거래를 특히 용이하게 만든다.' },
  { label: '처벌 체계: 형사 + 행정', body: '부당이득 50억 이상이면 무기징역 가능. 벌금은 부당이득의 3~5배. 과징금은 부당이득의 2배(금융위 부과). 범죄 수익보다 큰 불이익 구조.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ov-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 법률 구조 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={150} y={10} w={180} h={50} label="가상자산이용자보호법" sub="2024.07.19 시행" color={C.law} />
              <Arrow x1={240} y1={60} x2={240} y2={80} color={C.law} />

              <ActionBox x={80} y={85} w={140} h={40} label="제10조: 불공정거래 금지" sub="3대 유형 명시적 규제" color={C.law} />
              <ActionBox x={260} y={85} w={140} h={40} label="자본시장법 체계 차용" sub="증권 규제 → 가상자산 적용" color={C.diff} />

              <Arrow x1={150} y1={125} x2={150} y2={145} color={C.type} />
              <Arrow x1={330} y1={125} x2={330} y2={145} color={C.diff} />

              <DataBox x={80} y={150} w={140} h={32} label="가상자산 특수성 반영" color={C.type} />
              <DataBox x={260} y={150} w={140} h={32} label="동일 수준 처벌 규정" color={C.diff} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2023.07 제정 → 2024.07 시행 → 2026.02 첫 실형 선고</text>
            </motion.g>
          )}

          {/* Step 1: 3대 유형 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">제10조 불공정거래 3대 유형</text>

              <ModuleBox x={20} y={40} w={130} h={55} label="미공개정보 이용" sub="공개 전 내부 정보로 매매" color={C.law} />
              <ModuleBox x={175} y={40} w={130} h={55} label="시세조종" sub="인위적 가격·거래량 왜곡" color={C.type} />
              <ModuleBox x={330} y={40} w={130} h={55} label="부정거래" sub="허위·기망적 수단 사용" color={C.punish} />

              <Arrow x1={85} y1={95} x2={85} y2={115} color={C.law} />
              <Arrow x1={240} y1={95} x2={240} y2={115} color={C.type} />
              <Arrow x1={395} y1={95} x2={395} y2={115} color={C.punish} />

              <DataBox x={30} y={120} w={110} h={30} label="상장 결정 사전 매수" color={C.law} />
              <DataBox x={185} y={120} w={110} h={30} label="허수 주문·자전 거래" color={C.type} />
              <DataBox x={340} y={120} w={110} h={30} label="가짜 정보 유포" color={C.punish} />

              {/* 공통 하단 */}
              <rect x={20} y={170} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">자본시장법(증권)의 불공정거래 유형과 구조적으로 동일</text>
            </motion.g>
          )}

          {/* Step 2: 구조적 취약성 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">가상자산 시장의 구조적 취약점</text>

              <AlertBox x={10} y={32} w={88} h={48} label="24시간 거래" sub="감시 공백 시간대" color={C.punish} />
              <AlertBox x={108} y={32} w={88} h={48} label="글로벌 접근" sub="교차 거래소 조종" color={C.punish} />
              <AlertBox x={206} y={32} w={88} h={48} label="의사 익명성" sub="실거래자 특정 곤란" color={C.punish} />
              <AlertBox x={304} y={32} w={88} h={48} label="낮은 유동성" sub="소액으로 가격 변동" color={C.punish} />
              <AlertBox x={402} y={32} w={68} h={48} label="정보 비대칭" sub="공시 미비" color={C.punish} />

              {/* 비교: 주식 vs 가상자산 */}
              <rect x={20} y={100} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ModuleBox x={40} y={115} w={170} h={45} label="주식시장" sub="정규장 6시간 · 상하한가 30%" color={C.diff} />
              <text x={240} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">vs</text>
              <ModuleBox x={270} y={115} w={170} h={45} label="가상자산 시장" sub="24/365 · 변동 폭 무제한" color={C.punish} />

              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시세조종 효과가 극단적 -- 수시간 만에 10배 폭등 후 원래 수준 폭락 가능</text>
            </motion.g>
          )}

          {/* Step 3: 처벌 체계 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">불공정거래 처벌 체계</text>

              {/* 형사처벌 단계 */}
              <ActionBox x={15} y={35} w={105} h={42} label="기본" sub="1년 이상 징역" color={C.type} />
              <Arrow x1={120} y1={56} x2={145} y2={56} color={C.punish} />
              <ActionBox x={148} y={35} w={115} h={42} label="5억~50억 이득" sub="3년 이상 징역" color={C.punish} />
              <Arrow x1={263} y1={56} x2={288} y2={56} color={C.punish} />
              <AlertBox x={291} y={32} w={130} h={48} label="50억 이상 이득" sub="무기징역 가능" color={C.punish} />

              {/* 벌금·과징금 */}
              <rect x={20} y={100} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={40} y={115} w={130} h={34} label="벌금: 이득의 3~5배" color={C.punish} />
              <DataBox x={200} y={115} w={130} h={34} label="과징금: 이득의 2배" color={C.type} />

              <Arrow x1={330} y1={132} x2={360} y2={132} color={C.law} />
              <ModuleBox x={363} y={110} w={100} h={42} label="금융위 부과" sub="행정 제재" color={C.law} />

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">"범죄 수익보다 더 큰 불이익" -- 경제적 유인 차단 구조</text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill={C.punish}>2026.02 최초 실형 선고 + 최초 과징금 부과</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
