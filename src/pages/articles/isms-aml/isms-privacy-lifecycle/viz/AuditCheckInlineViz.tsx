import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  audit: '#6366f1',
  check: '#10b981',
  fail: '#ef4444',
  blockchain: '#f59e0b',
};

const STEPS = [
  { label: 'ISMS-P 심사 확인 5개 포인트', body: '보유기간 산정 근거, 분리보관 체계, 파기 절차 문서화, 파기 증적(대장), 휴면계정 처리 — 3.3 항목에서 심사원이 확인.' },
  { label: '블록체인 데이터의 파기 불가 문제', body: '블록체인 불변성 → 온체인 개인정보 삭제 불가. 해법: 개인정보는 오프체인 DB, 온체인에는 해시/지갑주소만. 매핑 파기로 연결고리 제거.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ac2-inline-arrow)" />;
}

export default function AuditCheckInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ac2-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.audit}>ISMS-P 3.3 심사 확인 포인트</text>

              <ActionBox x={15} y={30} w={140} h={34} label="보유기간 산정 근거" sub="항목별 문서화" color={C.audit} />
              <ActionBox x={170} y={30} w={140} h={34} label="분리보관 체계" sub="별도 DB/테이블" color={C.audit} />
              <ActionBox x={325} y={30} w={140} h={34} label="파기 절차 문서화" sub="방법·주기·담당자" color={C.audit} />

              <ActionBox x={80} y={80} w={150} h={34} label="파기 증적 (파기 대장)" sub="실행 로그·화면 캡처" color={C.check} />
              <ActionBox x={260} y={80} w={160} h={34} label="휴면계정 처리" sub="1년 미접속 분리보관" color={C.check} />

              <line x1={15} y1={130} x2={465} y2={130} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={100} y={140} w={280} h={36} label="5개 중 1개라도 미비 → 3.3 부적합 가능" sub="특히 파기 증적 누락이 가장 빈번한 지적 사항" color={C.fail} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.blockchain}>블록체인 데이터의 파기 불가 문제</text>

              {/* 온체인 vs 오프체인 */}
              <DataBox x={15} y={32} w={130} h={44} label="온체인 (블록체인)" color={C.blockchain} />
              <text x={80} y={90} textAnchor="middle" fontSize={8} fill={C.fail}>불변성 → 삭제 불가</text>
              <text x={80} y={103} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">해시, 지갑주소만</text>

              <DataBox x={170} y={32} w={130} h={44} label="오프체인 (DB)" color={C.check} />
              <text x={235} y={90} textAnchor="middle" fontSize={8} fill={C.check}>파기 가능</text>
              <text x={235} y={103} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개인정보 저장</text>

              {/* 매핑 */}
              <Arrow x1={145} y1={54} x2={168} y2={54} color={C.blockchain} />
              <text x={157} y={48} fontSize={7} fill={C.blockchain}>매핑</text>

              {/* 해법 */}
              <StatusBox x={325} y={32} w={140} h={44} label="연결고리 파기" sub="매핑 삭제로 식별 차단" color={C.check} />
              <Arrow x1={300} y1={54} x2={323} y2={54} color={C.check} />

              <line x1={15} y1={120} x2={465} y2={120} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={140} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">해법: 오프체인 매핑만 파기</text>
              <text x={240} y={158} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                지갑주소 ↔ 실명 매핑 삭제 → 온체인 데이터만으로 개인 식별 불가
              </text>
              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                개인정보를 온체인에 직접 저장하면 파기 의무 이행 불가
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
