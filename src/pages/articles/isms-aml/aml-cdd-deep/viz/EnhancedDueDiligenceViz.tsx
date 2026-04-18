import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  edd: '#f59e0b',    // EDD 강화 확인
  pep: '#ef4444',    // PEP/고위험
  cdd: '#10b981',    // 일반 CDD
  low: '#6366f1',    // 저위험/SDD
};

const STEPS = [
  {
    label: 'EDD 대상 3범주: PEP · 고위험 국가 · 고위험 거래',
    body: 'FATF R.10/R.12/R.19가 정의. 위험이 높으면 확인도 강화한다 — 위험기반 접근법(RBA)의 핵심.',
  },
  {
    label: 'PEP(정치적 주요인물) 범위와 특수성',
    body: '국가원수, 고위 공무원, 입법·사법부, 군·경, 국영기업 임원, 국제기구 고위직 + 가족·측근. 퇴직 후 12~24개월도 유지.',
  },
  {
    label: 'EDD 5가지 추가 조치',
    body: '자금출처 소명 → 자산출처 소명 → 거래목적 심층 확인 → 경영진 승인 → 강화 모니터링. 일반 CDD의 모든 항목을 포함.',
  },
  {
    label: 'SDD(간소화) ↔ 지속적 CDD — 위험등급별 적용',
    body: '저위험은 SDD 가능(정부기관, 상장법인). 기존 고객은 정기 갱신 + 위험등급 재평가 + 트리거 기반 갱신.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#edd-arrow)" />;
}

export default function EnhancedDueDiligenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="edd-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: EDD 대상 3범주 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.edd}>EDD 의무 대상 3범주</text>

              <AlertBox x={15} y={30} w={140} h={50} label="PEP" sub="정치적 주요인물 + 가족·측근" color={C.pep} />
              <AlertBox x={170} y={30} w={140} h={50} label="고위험 국가" sub="이란·북한 등 FATF 지정" color={C.pep} />
              <AlertBox x={325} y={30} w={140} h={50} label="고위험 거래" sub="비정상 고액·복잡 구조" color={C.edd} />

              {/* 근거 */}
              <text x={85} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FATF R.12</text>
              <text x={240} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FATF R.19</text>
              <text x={395} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">특금법 제5조의2</text>

              {/* 위험기반 접근법 구조 */}
              <rect x={30} y={110} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">위험기반 접근법(RBA) — 위험 수준에 따라 CDD 강도 조절</text>

              {/* 3단계 스펙트럼 */}
              <StatusBox x={25} y={140} w={130} h={48} label="SDD (간소화)" sub="저위험 고객" color={C.low} progress={0.2} />
              <StatusBox x={175} y={140} w={130} h={48} label="CDD (일반)" sub="일반 고객" color={C.cdd} progress={0.5} />
              <StatusBox x={325} y={140} w={130} h={48} label="EDD (강화)" sub="고위험 고객" color={C.pep} progress={1} />

              <Arrow x1={155} y1={164} x2={173} y2={164} color={C.cdd} />
              <Arrow x1={305} y1={164} x2={323} y2={164} color={C.pep} />
            </motion.g>
          )}

          {/* Step 1: PEP 범위 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.pep}>PEP(정치적 주요인물) 범위</text>

              {/* 7가지 유형을 2행으로 배치 */}
              <DataBox x={10} y={30} w={105} h={30} label="국가원수·정부수반" color={C.pep} />
              <DataBox x={125} y={30} w={105} h={30} label="고위 공무원" color={C.pep} />
              <DataBox x={240} y={30} w={105} h={30} label="입법부·사법부" color={C.pep} />
              <DataBox x={355} y={30} w={110} h={30} label="군·경·정보기관" color={C.pep} />

              <DataBox x={40} y={70} w={105} h={30} label="국영기업 임원" color={C.edd} />
              <DataBox x={158} y={70} w={115} h={30} label="국제기구 고위직" color={C.edd} />
              <DataBox x={288} y={70} w={150} h={30} label="가족·측근 (배우자·자녀 등)" color={C.edd} />

              {/* 변경 연혁 */}
              <rect x={30} y={115} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={30} y={125} w={190} h={38} label="2003년: 외국 PEP만 대상" sub="Foreign PEP only" color={C.low} />
              <Arrow x1={220} y1={144} x2={250} y2={144} color={C.pep} />
              <ActionBox x={253} y={125} w={200} h={38} label="2012년~: 내국인 PEP도 포함" sub="FATF 新권고 개정" color={C.pep} />

              {/* 퇴직 후 유지 */}
              <AlertBox x={120} y={175} w={240} h={34} label="퇴직 후 12~24개월 EDD 유지" sub="퇴직 직후 부정 자금 세탁 방지" color={C.edd} />
            </motion.g>
          )}

          {/* Step 2: EDD 5가지 추가 조치 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.edd}>EDD 추가 조치 (일반 CDD 포함 + 아래 5가지)</text>

              {/* 5가지 조치를 흐름으로 */}
              <ActionBox x={10} y={30} w={128} h={42} label="1. 자금출처 소명" sub="급여·매각·상속 증빙" color={C.edd} />
              <Arrow x1={138} y1={51} x2={148} y2={51} color={C.edd} />

              <ActionBox x={151} y={30} w={128} h={42} label="2. 자산출처 소명" sub="전체 재산 축적 경위" color={C.edd} />
              <Arrow x1={279} y1={51} x2={289} y2={51} color={C.edd} />

              <ActionBox x={292} y={30} w={175} h={42} label="3. 거래목적 심층 확인" sub="왜 이 시점·규모·상대방인가" color={C.pep} />

              <Arrow x1={120} y1={72} x2={120} y2={95} color={C.edd} />
              <Arrow x1={360} y1={72} x2={360} y2={95} color={C.pep} />

              <ModuleBox x={30} y={98} w={180} h={48} label="4. 경영진 승인" sub="CCO 이상 사전 승인 필수" color={C.pep} />
              <Arrow x1={210} y1={122} x2={270} y2={122} color={C.pep} />

              <ModuleBox x={273} y={98} w={190} h={48} label="5. 강화 모니터링" sub="임계값 낮춤 (5천만→1천만 원)" color={C.pep} />

              {/* 핵심 판단 기준 */}
              <rect x={30} y={165} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                핵심 판단 기준: 거래의 경제적 합리성(economic rationale)
              </text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill={C.edd}>
                "투자 수익" 구두 설명 부족 → 수익 발생 투자의 증빙까지 추적
              </text>
            </motion.g>
          )}

          {/* Step 3: SDD + 지속적 CDD */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 좌측: SDD */}
              <ModuleBox x={10} y={10} w={220} h={48} label="SDD (간소화 CDD)" sub="저위험: 정부기관·상장법인·규제금융기관" color={C.low} />

              {/* 우측: Ongoing CDD */}
              <ModuleBox x={250} y={10} w={220} h={48} label="지속적 CDD (Ongoing)" sub="기존 고객 정보의 지속적 갱신·재평가" color={C.cdd} />

              {/* SDD 세부 */}
              <Arrow x1={120} y1={58} x2={120} y2={80} color={C.low} />
              <DataBox x={30} y={82} w={180} h={28} label="일부 절차 간소화 (생략 X)" color={C.low} />

              {/* Ongoing 세부 */}
              <Arrow x1={360} y1={58} x2={360} y2={80} color={C.cdd} />

              <ActionBox x={260} y={82} w={200} h={30} label="정기 갱신" sub="고위험 1년, 중 2년, 저 3년" color={C.cdd} />
              <ActionBox x={260} y={118} w={200} h={30} label="위험등급 재평가" sub="거래 패턴·상대방 변경 시" color={C.edd} />
              <ActionBox x={260} y={154} w={200} h={30} label="트리거 기반 갱신" sub="고액 거래·제재리스트 변경" color={C.pep} />

              {/* SDD 전환 경고 */}
              <AlertBox x={15} y={125} w={225} h={42} label="의심 거래 감지 시 즉시 전환" sub="SDD → CDD 또는 EDD로 격상" color={C.pep} />

              {/* 거부 시 */}
              <text x={120} y={195} textAnchor="middle" fontSize={8} fill={C.pep}>
                갱신 거부 → 거래 제한·계정 정지·STR 보고 사유
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
