import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  provide: '#6366f1',
  delegate: '#10b981',
  overseas: '#f59e0b',
  warn: '#ef4444',
};

const STEPS = [
  { label: '제3자 제공: 별도 동의', body: '제17조 — 제3자가 자체 목적으로 이용. 제공받는 자·목적·항목·보유기간·거부 권리를 고지 후 동의.' },
  { label: '업무 위탁: 계약 + 공개', body: '제26조 — 수탁자는 위탁자 지시 범위 내에서만 처리. 위탁 계약서 체결, 처리방침 공개, 연 1회 점검.' },
  { label: '국외 이전', body: '제28조의8 — 이전받는 자·국가·일시·방법·항목·목적·보호조치를 고지. 클라우드 한국 리전도 글로벌 접근 시 해당.' },
  { label: '제공 vs 위탁 vs 이전 비교', body: '판단 기준: "받는 자가 자기 목적으로 쓰는가?" — 예면 제공, 아니면 위탁. 혼동 시 법적 의무가 달라진다.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tps-arrow)" />;
}

export default function ThirdPartySharingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tps-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 제3자 제공 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={130} h={45} label="VASP (처리자)" sub="개인정보 수집" color={C.provide} />

              {/* 동의 → 제공 */}
              <Arrow x1={140} y1={32} x2={175} y2={32} color={C.provide} />
              <ActionBox x={178} y={14} w={100} h={36} label="별도 동의" sub="제17조" color={C.provide} />
              <Arrow x1={278} y1={32} x2={310} y2={32} color={C.provide} />

              {/* 제공 대상 3건 */}
              <DataBox x={313} y={8} w={150} h={24} label="상대 VASP (Travel Rule)" color={C.provide} />
              <DataBox x={313} y={38} w={150} h={24} label="FIU (의심거래 보고)" color={C.provide} />
              <DataBox x={313} y={68} w={150} h={24} label="수사기관 (영장)" color={C.provide} />

              {/* 고지 사항 */}
              <rect x={10} y={105} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={122} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">동의 시 필수 고지 사항 (5개)</text>

              <DataBox x={10} y={132} w={82} h={24} label="제공받는 자" color={C.provide} />
              <DataBox x={102} y={132} w={82} h={24} label="제공 목적" color={C.provide} />
              <DataBox x={194} y={132} w={82} h={24} label="제공 항목" color={C.provide} />
              <DataBox x={286} y={132} w={82} h={24} label="보유기간" color={C.provide} />
              <DataBox x={378} y={132} w={82} h={24} label="거부 권리" color={C.provide} />

              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                FIU 보고·영장 집행은 법률 근거로 동의 없이 제공 가능 (처리방침에 명시 필수)
              </text>
            </motion.g>
          )}

          {/* Step 1: 업무 위탁 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={130} h={45} label="VASP (위탁자)" sub="업무를 외부에 맡김" color={C.delegate} />

              <Arrow x1={140} y1={32} x2={175} y2={32} color={C.delegate} />
              <text x={155} y={26} fontSize={7} fill="var(--muted-foreground)" textAnchor="middle">계약</text>

              {/* 수탁자 4건 */}
              <DataBox x={178} y={5} w={145} h={22} label="KYC 인증 서비스 업체" color={C.delegate} />
              <DataBox x={178} y={32} w={145} h={22} label="AML 솔루션 업체" color={C.delegate} />
              <DataBox x={178} y={59} w={145} h={22} label="클라우드 서비스 업체" color={C.delegate} />
              <DataBox x={178} y={86} w={145} h={22} label="고객센터 대행 업체" color={C.delegate} />

              {/* 위탁자의 의무 */}
              <Arrow x1={323} y1={45} x2={350} y2={45} color={C.delegate} />
              <ModuleBox x={353} y={10} w={115} h={95} label="위탁자 의무" sub="계약서·공개·점검·재위탁제한" color={C.delegate} />

              {/* 하단: 핵심 차이 */}
              <rect x={10} y={120} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={138} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">위탁 vs 제공 핵심 차이</text>

              <ActionBox x={30} y={148} w={190} h={36} label="위탁: 위탁자 지시 범위 내" sub="수탁자가 자체 목적 사용 불가" color={C.delegate} />
              <ActionBox x={260} y={148} w={190} h={36} label="제공: 제3자 자체 목적" sub="받는 자가 독립적으로 이용" color={C.provide} />

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                위탁은 동의 불필요(공개 의무), 제공은 별도 동의 필수
              </text>
            </motion.g>
          )}

          {/* Step 2: 국외 이전 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.overseas}>제28조의8 — 국외 이전</text>

              {/* 한국 → 해외 */}
              <ModuleBox x={15} y={30} w={120} h={50} label="한국 VASP" sub="데이터 원천" color={C.provide} />

              {/* 전송 화살표 */}
              <motion.line x1={135} y1={55} x2={220} y2={55}
                stroke={C.overseas} strokeWidth={1.5} strokeDasharray="6 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                markerEnd="url(#tps-arrow)" />
              <text x={177} y={48} textAnchor="middle" fontSize={7} fill={C.overseas}>국외 전송</text>

              <ModuleBox x={223} y={30} w={120} h={50} label="해외 법인/서버" sub="이전받는 자" color={C.overseas} />

              {/* 고지 항목 6개 */}
              <rect x={15} y={95} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">고지 필수 사항 (6개)</text>

              <DataBox x={10} y={120} w={68} h={24} label="이전받는 자" color={C.overseas} />
              <DataBox x={88} y={120} w={68} h={24} label="이전 국가" color={C.overseas} />
              <DataBox x={166} y={120} w={68} h={24} label="일시·방법" color={C.overseas} />
              <DataBox x={244} y={120} w={68} h={24} label="이전 항목" color={C.overseas} />
              <DataBox x={322} y={120} w={68} h={24} label="이용 목적" color={C.overseas} />
              <DataBox x={400} y={120} w={68} h={24} label="보호조치" color={C.overseas} />

              {/* 클라우드 주의 */}
              <AlertBox x={80} y={160} w={320} h={36} label="한국 리전이라도 글로벌 관리 접근 시 해당" sub="클라우드 제공자와 접근 제한 계약 필요" color={C.warn} />
            </motion.g>
          )}

          {/* Step 3: 제공 vs 위탁 vs 이전 비교 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">제공 vs 위탁 vs 국외 이전</text>

              {/* 3열 비교 */}
              <ModuleBox x={10} y={28} w={140} h={38} label="제3자 제공" sub="제17조" color={C.provide} />
              <ModuleBox x={170} y={28} w={140} h={38} label="업무 위탁" sub="제26조" color={C.delegate} />
              <ModuleBox x={330} y={28} w={140} h={38} label="국외 이전" sub="제28조의8" color={C.overseas} />

              {/* 이용 목적 */}
              <text x={240} y={82} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">이용 목적</text>
              <DataBox x={20} y={88} w={120} h={22} label="제3자 자체 목적" color={C.provide} />
              <DataBox x={180} y={88} w={120} h={22} label="위탁자 업무 대행" color={C.delegate} />
              <DataBox x={340} y={88} w={120} h={22} label="제공 또는 위탁" color={C.overseas} />

              {/* 동의 */}
              <text x={240} y={126} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">동의 요건</text>
              <DataBox x={20} y={132} w={120} h={22} label="별도 동의 필수" color={C.provide} />
              <DataBox x={180} y={132} w={120} h={22} label="불필요 (공개)" color={C.delegate} />
              <DataBox x={340} y={132} w={120} h={22} label="유형에 따라 상이" color={C.overseas} />

              {/* 관리 책임 */}
              <text x={240} y={170} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">관리 책임</text>
              <DataBox x={20} y={176} w={120} h={22} label="받는 자 독립 책임" color={C.provide} />
              <DataBox x={180} y={176} w={120} h={22} label="위탁자 관리·감독" color={C.delegate} />
              <DataBox x={340} y={176} w={120} h={22} label="이전자 보호조치 확인" color={C.overseas} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
