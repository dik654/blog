import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  onchain: '#f59e0b',
  offchain: '#10b981',
  destroy: '#ef4444',
  link: '#6366f1',
};

const STEPS = [
  { label: '온체인 vs 오프체인 저장 원칙', body: '개인정보(성명·연락처·계좌)는 오프체인 DB에만 저장. 온체인에는 해시·지갑주소 등 식별불가 데이터만. 블록체인 불변성 때문에 온체인 삭제 불가.' },
  { label: '파기 대장과 증적 관리', body: '파기 일자, 대상(항목+건수), 방법, 수행자, 확인자(CPO), 증적(쿼리 로그·캡처)을 기록. 파기 대장 최소 3년 보관, ISMS-P 심사 시 제출.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#bd-inline-arrow)" />;
}

export default function BlockchainDeletionInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bd-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">온체인/오프체인 저장 원칙과 파기</text>

              {/* 오프체인 DB */}
              <ModuleBox x={15} y={28} w={200} h={50} label="오프체인 DB" sub="파기 가능" color={C.offchain} />
              <DataBox x={25} y={86} w={80} h={22} label="성명·연락처" color={C.offchain} />
              <DataBox x={115} y={86} w={90} h={22} label="계좌·신분증" color={C.offchain} />

              {/* 매핑 연결 */}
              <Arrow x1={215} y1={53} x2={260} y2={53} color={C.link} />
              <text x={238} y={45} fontSize={8} fontWeight={600} fill={C.link}>매핑</text>

              {/* 온체인 */}
              <ModuleBox x={263} y={28} w={200} h={50} label="온체인 (블록체인)" sub="삭제 불가 (불변성)" color={C.onchain} />
              <DataBox x={273} y={86} w={80} h={22} label="지갑주소" color={C.onchain} />
              <DataBox x={363} y={86} w={90} h={22} label="TX 해시" color={C.onchain} />

              {/* 파기 전략 */}
              <line x1={15} y1={120} x2={465} y2={120} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={138} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.destroy}>파기 전략: 매핑만 삭제</text>

              <ActionBox x={30} y={145} w={180} h={30} label="오프체인 매핑 파기" sub="지갑주소 ↔ 실명 삭제" color={C.destroy} />
              <Arrow x1={210} y1={160} x2={250} y2={160} color={C.destroy} />
              <StatusBox x={253} y={145} w={200} h={30} label="온체인 데이터 = 식별 불가" sub="개인 연결고리 제거 완료" color={C.offchain} />

              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                개인정보를 온체인에 직접 저장하면 파기 의무 이행 불가 → 반드시 오프체인
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.link}>파기 대장 기재 항목</text>

              <DataBox x={15} y={30} w={80} h={36} label="파기 일자" color={C.destroy} />
              <DataBox x={105} y={30} w={80} h={36} label="파기 대상" color={C.destroy} />
              <DataBox x={195} y={30} w={80} h={36} label="파기 방법" color={C.destroy} />
              <DataBox x={285} y={30} w={80} h={36} label="수행자" color={C.link} />
              <DataBox x={375} y={30} w={90} h={36} label="확인자(CPO)" color={C.offchain} />

              <Arrow x1={95} y1={48} x2={103} y2={48} color={C.destroy} />
              <Arrow x1={185} y1={48} x2={193} y2={48} color={C.destroy} />
              <Arrow x1={275} y1={48} x2={283} y2={48} color={C.destroy} />
              <Arrow x1={365} y1={48} x2={373} y2={48} color={C.link} />

              {/* 증적 */}
              <line x1={15} y1={80} x2={465} y2={80} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={98} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">필수 증적</text>

              <DataBox x={30} y={106} w={120} h={28} label="쿼리 실행 로그" color={C.link} />
              <DataBox x={170} y={106} w={140} h={28} label="파기 완료 화면 캡처" color={C.link} />
              <DataBox x={330} y={106} w={120} h={28} label="파기 확인증" color={C.offchain} />

              <text x={240} y={158} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                물리적 파기: 파기 현장 사진 + 업체 확인증 + 매체 파쇄 사진
              </text>

              <StatusBox x={130} y={165} w={220} h={30} label="파기 대장 최소 3년 보관" sub="ISMS-P 심사 시 제출 필수" color={C.offchain} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
