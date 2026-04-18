import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
};

const STEPS = [
  {
    label: 'PoR(준비금 증명) — 핵심 질문',
    body: '"거래소가 이용자 잔고 합계만큼의 자산을 정말 갖고 있는가?" 전통 금융의 지급준비율 감독이 없는 가상자산 시장에서 기술적으로 이 공백을 메우는 시도.',
  },
  {
    label: '머클 트리 기반 잔고 증명 — 5단계',
    body: '리프 노드(ID 해시+잔고) → 트리 구성 → 루트 해시 공개 → 개별 검증(머클 경로) → 온체인 대조. 수학적으로 포함 여부를 증명.',
  },
  {
    label: '외부 감사 + 온체인 주소 공개',
    body: '머클 트리만으로는 실제 보유를 증명 못함. 감사법인 교차 검증 + 소액 테스트 전송으로 통제권 확인. 주소 공개는 투명성 vs 보안 트레이드오프.',
  },
  {
    label: 'zk-SNARK 고급 PoR — 프라이버시 보호',
    body: '기본 머클 트리는 형제 노드로 다른 이용자 잔고 추론 가능. zk-SNARK로 "모든 이용자 포함 + 음수 잔고 없음 + 총량 불변"을 영지식 증명.',
  },
  {
    label: 'PoR의 한계 — 부채·스냅샷·완전성',
    body: '자산만 증명하고 부채는 미반영. 검증 직전 차입 후 반환하는 스냅샷 조작 가능. 검증 참여율이 낮으면 이용자 누락도 발각 어려움.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 4, ay = y2 - uy * 4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={color}
      />
    </g>
  );
}

export default function ProofOfReservesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>Proof of Reserves (PoR)</text>

              {/* 거래소 */}
              <ModuleBox x={170} y={35} w={140} h={48} label="거래소(VASP)" sub="자산 보관 주장" color={C.blue} />

              {/* 이용자 잔고 합계 */}
              <DataBox x={30} y={110} w={160} h={34} label="이용자 잔고 합계" sub="장부상 총량" color={C.amber} />
              <Arrow x1={110} y1={110} x2={210} y2={83} color={C.amber} />

              {/* 실제 보유량 */}
              <DataBox x={290} y={110} w={160} h={34} label="실제 보유량" sub="온체인 잔고" color={C.green} />
              <Arrow x1={370} y1={110} x2={270} y2={83} color={C.green} />

              {/* 핵심 질문 */}
              <rect x={100} y={165} width={280} height={36} rx={8} fill="var(--card)" stroke={C.purple} strokeWidth={1} />
              <text x={240} y={183} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.purple}>이용자 합계 {'<='} 실제 보유량?</text>
              <text x={240} y={196} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">제3자 검증 가능한 방식으로 증명</text>

              <Arrow x1={190} y1={144} x2={220} y2={165} color={C.amber} />
              <Arrow x1={290} y1={144} x2={260} y2={165} color={C.green} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>머클 트리 잔고 증명</text>

              {/* 리프 노드들 */}
              <DataBox x={10} y={160} w={72} h={28} label="User A" sub="1.5 BTC" color={C.blue} />
              <DataBox x={92} y={160} w={72} h={28} label="User B" sub="0.8 BTC" color={C.blue} />
              <DataBox x={215} y={160} w={72} h={28} label="User C" sub="2.0 BTC" color={C.blue} />
              <DataBox x={297} y={160} w={72} h={28} label="User D" sub="1.2 BTC" color={C.blue} />

              {/* 중간 노드 */}
              <ActionBox x={30} y={110} w={110} h={32} label="Hash(A+B)" sub="2.3 BTC" color={C.amber} />
              <ActionBox x={235} y={110} w={110} h={32} label="Hash(C+D)" sub="3.2 BTC" color={C.amber} />

              {/* 리프 → 중간 화살표 */}
              <Arrow x1={46} y1={160} x2={70} y2={142} color={C.blue} />
              <Arrow x1={128} y1={160} x2={100} y2={142} color={C.blue} />
              <Arrow x1={251} y1={160} x2={275} y2={142} color={C.blue} />
              <Arrow x1={333} y1={160} x2={310} y2={142} color={C.blue} />

              {/* 루트 */}
              <ModuleBox x={150} y={50} w={160} h={40} label="Merkle Root" sub="5.5 BTC 총합" color={C.green} />

              {/* 중간 → 루트 화살표 */}
              <Arrow x1={85} y1={110} x2={200} y2={90} color={C.amber} />
              <Arrow x1={290} y1={110} x2={260} y2={90} color={C.amber} />

              {/* 온체인 대조 */}
              <DataBox x={370} y={55} w={100} h={30} label="온체인 잔고" sub=">= 5.5 BTC" color={C.green} />
              <Arrow x1={370} y1={70} x2={310} y2={70} color={C.green} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>외부 감사 + 온체인 주소 공개</text>

              {/* 거래소 중앙 */}
              <ModuleBox x={180} y={30} w={120} h={44} label="거래소" sub="지갑 보유 주장" color={C.blue} />

              {/* 외부 감사 — 왼쪽 */}
              <ActionBox x={10} y={100} w={190} h={44} label="외부 감사법인" sub="지갑 잔고·장부·머클 트리 교차 검증" color={C.green} />
              <Arrow x1={150} y1={100} x2={210} y2={74} color={C.green} />

              {/* 소액 테스트 */}
              <DataBox x={20} y={158} w={170} h={30} label="소액 테스트 전송" sub="통제권 확인" color={C.green} />
              <Arrow x1={105} y1={144} x2={105} y2={158} color={C.green} />

              {/* 온체인 주소 공개 — 오른쪽 */}
              <ActionBox x={280} y={100} w={190} h={44} label="온체인 주소 공개" sub="블록체인 탐색기에서 실시간 확인" color={C.amber} />
              <Arrow x1={330} y1={100} x2={270} y2={74} color={C.amber} />

              {/* 트레이드오프 */}
              <AlertBox x={285} y={158} w={180} h={38} label="보안 위험 증가" sub="타깃 공격 표면 노출" color={C.red} />
              <Arrow x1={375} y1={144} x2={375} y2={158} color={C.red} />

              {/* 하단 비교 */}
              <rect x={120} y={200} width={240} height={18} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={213} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">투명성 {'<-->'} 보안: 두 장치의 트레이드오프</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.purple}>zk-SNARK 기반 PoR</text>

              {/* 기본 PoR 문제 */}
              <AlertBox x={10} y={30} w={180} h={40} label="기본 머클 트리 한계" sub="형제 노드로 타인 잔고 추론" color={C.red} />
              <Arrow x1={190} y1={50} x2={220} y2={50} color={C.purple} />

              {/* zk-SNARK 모듈 */}
              <ModuleBox x={225} y={28} w={160} h={44} label="zk-SNARK 증명" sub="영지식 증명 적용" color={C.purple} />

              {/* 3가지 조건 */}
              <StatusBox x={20} y={95} w={135} h={44} label="모든 이용자 포함" sub="누락 조작 방지" color={C.green} progress={1} />
              <StatusBox x={173} y={95} w={135} h={44} label="음수 잔고 없음" sub="가짜 계정 조작 방지" color={C.green} progress={1} />
              <StatusBox x={326} y={95} w={135} h={44} label="총량 불변" sub="업데이트 시 변조 방지" color={C.green} progress={1} />

              {/* 화살표 올라감 */}
              <Arrow x1={87} y1={95} x2={270} y2={72} color={C.green} />
              <Arrow x1={240} y1={95} x2={305} y2={72} color={C.green} />
              <Arrow x1={393} y1={95} x2={340} y2={72} color={C.green} />

              {/* 결과 */}
              <DataBox x={130} y={160} w={220} h={34} label="프라이버시 보호 + 건전성 검증" sub="개별 잔고 비공개 / 전체 준비금 증명" color={C.purple} />

              <Arrow x1={240} y1={145} x2={240} y2={160} color={C.purple} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>PoR의 구조적 한계</text>

              {/* 한계 3가지 */}
              <AlertBox x={10} y={35} w={140} h={52} label="부채 미반영" sub="자산 100, 부채 90이면 순자산 10이지만 '100 보유'로 표시" color={C.red} />

              <AlertBox x={170} y={35} w={140} h={52} label="스냅샷 조작" sub="검증 직전 차입 → 검증 후 반환으로 속임" color={C.amber} />

              <AlertBox x={330} y={35} w={140} h={52} label="완전성 문제" sub="검증 참여율 낮으면 이용자 누락 발각 어려움" color={C.amber} />

              {/* 대응책 */}
              <Arrow x1={80} y1={87} x2={80} y2={110} color={C.blue} />
              <ActionBox x={10} y={110} w={140} h={36} label="대응: 부채 공시" sub="Proof of Liabilities" color={C.blue} />

              <Arrow x1={240} y1={87} x2={240} y2={110} color={C.blue} />
              <ActionBox x={170} y={110} w={140} h={36} label="대응: 불시 검증" sub="사전 예고 없는 감사" color={C.blue} />

              <Arrow x1={400} y1={87} x2={400} y2={110} color={C.blue} />
              <ActionBox x={330} y={110} w={140} h={36} label="대응: 전원 검증" sub="참여율 제고 메커니즘" color={C.blue} />

              {/* 법적 의무 vs PoR */}
              <rect x={60} y={165} width={360} height={40} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={240} y={182} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>법적 의무(강제) + PoR(자발) = 보완 관계</text>
              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">모범 VASP: 법적 의무 + 기술적 PoR 모두 제공하여 신뢰 구축</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
