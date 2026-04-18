import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  ops: '#6366f1',
  approve: '#f59e0b',
  sign: '#10b981',
  verify: '#ef4444',
};

const STEPS = [
  { label: '콜드 → 핫 전송 절차', body: '운영팀 요청 → CISO 승인 → Multi-sig 서명(분리된 장소) → 브로드캐스트 → 온체인 컨펌 → 잔고 대조.' },
  { label: '80% 콜드월렛 보관 규정', body: '경제적 가치의 80% 이상 콜드월렛 의무. 매월 초 5영업일 내 재산정. 시장 급등 시 비율 자동 모니터링 필수.' },
  { label: '이용자 자산 분리와 PoR', body: '이용자 자산과 회사 자산 별도 지갑. 혼합 보관 시 부도 리스크. Proof of Reserves로 Merkle Tree 검증.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cht-arrow)" />;
}

export default function ColdToHotTransferViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cht-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">콜드 → 핫 전송 프로세스</text>

              <ActionBox x={5} y={30} w={85} h={38} label="운영팀 요청" sub="전송 신청서" color={C.ops} />
              <Arrow x1={90} y1={49} x2={100} y2={49} color={C.ops} />

              <ActionBox x={102} y={30} w={85} h={38} label="CISO 승인" sub="검토·승인" color={C.approve} />
              <Arrow x1={187} y1={49} x2={197} y2={49} color={C.approve} />

              <ActionBox x={199} y={30} w={85} h={38} label="Multi-sig" sub="분리 장소 서명" color={C.sign} />
              <Arrow x1={284} y1={49} x2={294} y2={49} color={C.sign} />

              <ActionBox x={296} y={30} w={85} h={38} label="브로드캐스트" sub="네트워크 전파" color={C.ops} />
              <Arrow x1={381} y1={49} x2={391} y2={49} color={C.verify} />

              <ActionBox x={393} y={30} w={80} h={38} label="컨펌 확인" sub="잔고 대조" color={C.verify} />

              {/* Detail bar */}
              <rect x={20} y={88} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <DataBox x={20} y={100} w={200} h={30} label="물리적 분리된 키 소유자 각자 서명" color={C.sign} />
              <DataBox x={260} y={100} w={200} h={30} label="온체인 잔고와 내부 원장 정합성 검증" color={C.verify} />

              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">전 과정 로그 기록 → 월간 감사 검토 대상</text>

              <AlertBox x={100} y={168} w={280} h={30} label="절차 없는 임의 전송 = 내부자 유출과 구별 불가" sub="" color={C.verify} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">80% 콜드월렛 보관 의무</text>

              {/* Ratio bar */}
              <rect x={40} y={40} width={400} height={28} rx={6} fill="var(--border)" opacity={0.15} />
              <rect x={40} y={40} width={320} height={28} rx={6} fill={`${C.ops}30`} stroke={C.ops} strokeWidth={0.6} />
              <rect x={360} y={40} width={80} height={28} rx={6} fill={`${C.approve}30`} stroke={C.approve} strokeWidth={0.6} />

              <text x={200} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ops}>콜드월렛 80%+</text>
              <text x={400} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.approve}>핫 20%</text>

              {/* Calculation */}
              <rect x={40} y={85} width={400} height={48} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={50} y={103} fontSize={9} fontWeight={600} fill="var(--foreground)">경제적 가치 산정</text>
              <text x={50} y={118} fontSize={8} fill="var(--muted-foreground)">보유 수량 x 전월 말 기준 최근 1년 일평균 원화환산액</text>
              <text x={50} y={128} fontSize={8} fill="var(--muted-foreground)">예: 100 BTC x 5,000만원 = 50억원 → 콜드 40억원 이상 필수</text>

              <DataBox x={40} y={148} w={200} h={28} label="매월 초 5영업일 내 재산정" color={C.approve} />
              <AlertBox x={260} y={145} w={180} h={32} label="시장 급등 시 비율 깨짐" sub="자동 모니터링 필수" color={C.verify} />

              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">80% 미달 시 즉시 콜드월렛으로 이동하여 비율 충족</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">자산 분리 + Proof of Reserves</text>

              <ModuleBox x={30} y={35} w={150} h={40} label="이용자 자산 지갑" sub="별도 주소 관리" color={C.ops} />
              <ModuleBox x={300} y={35} w={150} h={40} label="회사 자산 지갑" sub="운영비 등" color={C.approve} />

              <text x={240} y={55} textAnchor="middle" fontSize={18} fill={C.verify}>{'|'}</text>
              <text x={240} y={65} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.verify}>분리</text>

              <Arrow x1={105} y1={75} x2={105} y2={100} color={C.sign} />

              <rect x={30} y={102} width={420} height={42} rx={6} fill={`${C.sign}08`} stroke={C.sign} strokeWidth={0.6} />
              <text x={40} y={120} fontSize={9} fontWeight={600} fill={C.sign}>Proof of Reserves (준비금 증명)</text>
              <text x={40} y={135} fontSize={8} fill="var(--muted-foreground)">이용자 자산 총합 + 온체인 잔고 → Merkle Tree 검증 → 개별 이용자가 독립 확인 가능</text>

              <DataBox x={30} y={158} w={200} h={28} label="월 1회+ 증명 공개" color={C.sign} />
              <AlertBox x={250} y={155} w={200} h={32} label="혼합 보관 금지" sub="부도 시 이용자 자산 귀속 위험" color={C.verify} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">온체인 잔고 조회로 실질 보유 확인 → 투명성 확보</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
