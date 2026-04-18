import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
  purple: '#a855f7',
};

const STEPS = [
  {
    label: 'zk-SNARK PoR — 프라이버시 + 검증 동시 달성',
    body: '영지식 증명으로 개별 잔고를 공개하지 않으면서도 3가지 조건(전원 포함, 음수 없음, 총량 불변)을 수학적으로 증명.',
  },
  {
    label: '기본 머클 트리 PoR의 프라이버시 문제',
    body: '형제 노드를 통해 다른 이용자 잔고를 부분 추론 가능. zk-SNARK는 이 정보 누출을 원천 차단.',
  },
  {
    label: 'PoR의 3대 한계 — 부채·스냅샷·완전성',
    body: '자산만 증명하고 부채 미반영. 검증 직전 차입으로 속일 수 있음. 검증 참여율 낮으면 누락 발각 어려움.',
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
      <polygon points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`} fill={color} />
    </g>
  );
}

export default function ZkSnarkPoRViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.purple}>zk-SNARK PoR 증명 구조</text>

              {/* 입력: 비공개 데이터 */}
              <ModuleBox x={10} y={30} w={130} h={44} label="비공개 입력" sub="전체 이용자 잔고 목록" color={C.slate} />
              <Arrow x1={140} y1={52} x2={180} y2={52} color={C.purple} />

              {/* zk-SNARK 회로 */}
              <rect x={185} y={24} width={110} height={58} rx={10} fill="var(--card)" stroke={C.purple} strokeWidth={1.5} />
              <text x={240} y={46} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.purple}>zk-SNARK</text>
              <text x={240} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">영지식 증명 생성</text>
              <text x={240} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정보 공개 없이 검증</text>

              {/* 출력: 증명 */}
              <Arrow x1={295} y1={52} x2={340} y2={52} color={C.purple} />
              <DataBox x={345} y={38} w={120} h={30} label="Proof(증명)" color={C.purple} />

              {/* 3가지 조건 */}
              <text x={240} y={102} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>동시 증명되는 3가지 조건</text>

              <ActionBox x={15} y={115} w={140} h={40} label="1. 전원 포함" sub="이용자 누락 조작 방지" color={C.green} />
              <ActionBox x={170} y={115} w={140} h={40} label="2. 음수 잔고 없음" sub="가짜 계정 조작 방지" color={C.green} />
              <ActionBox x={325} y={115} w={140} h={40} label="3. 총량 불변" sub="업데이트 시 합계 보존" color={C.green} />

              {/* 결과 */}
              <rect x={80} y={175} width={320} height={34} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={240} y={192} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>개별 잔고 비공개 + 전체 건전성 검증 = 프라이버시 보존 PoR</text>
              <text x={240} y={205} textAnchor="middle" fontSize={8} fill={C.purple}>Zero-Knowledge Succinct Non-Interactive Argument of Knowledge</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amber}>기본 머클 트리의 프라이버시 문제</text>

              {/* 기본 머클 트리 */}
              <rect x={20} y={30} width={200} height={100} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={1} />
              <text x={120} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>기본 머클 트리</text>

              {/* 내 리프 */}
              <rect x={35} y={60} width={80} height={24} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={75} y={76} textAnchor="middle" fontSize={8} fill={C.green}>내 리프</text>

              {/* 형제 노드 (문제) */}
              <rect x={125} y={60} width={80} height={24} rx={4} fill="var(--card)" stroke={C.red} strokeWidth={1} />
              <text x={165} y={76} textAnchor="middle" fontSize={8} fill={C.red}>형제 노드</text>

              <text x={120} y={105} textAnchor="middle" fontSize={8} fill={C.red}>형제 노드에서 타인 잔고 추론 가능</text>
              <text x={120} y={118} textAnchor="middle" fontSize={8} fill={C.red}>부분적 정보 누출</text>

              {/* 화살표 → zk 해결 */}
              <Arrow x1={220} y1={80} x2={260} y2={80} color={C.purple} />

              {/* zk-SNARK 해결 */}
              <rect x={265} y={30} width={200} height={100} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={365} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>zk-SNARK PoR</text>

              <rect x={280} y={60} width={170} height={24} rx={4} fill="var(--card)" stroke={C.purple} strokeWidth={1} />
              <text x={365} y={76} textAnchor="middle" fontSize={8} fill={C.purple}>증명만 전달, 잔고 비공개</text>

              <text x={365} y={105} textAnchor="middle" fontSize={8} fill={C.green}>타인 잔고 추론 불가</text>
              <text x={365} y={118} textAnchor="middle" fontSize={8} fill={C.green}>정보 누출 원천 차단</text>

              {/* 결론 */}
              <rect x={60} y={150} width={360} height={55} rx={8} fill="var(--card)" stroke={C.purple} strokeWidth={0.5} />
              <text x={240} y={168} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.purple}>zk-SNARK 장점</text>
              <text x={240} y={184} textAnchor="middle" fontSize={9} fill="var(--foreground)">검증자에게 "조건을 만족한다"는 사실만 전달</text>
              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">어떤 이용자가 얼마를 갖고 있는지는 절대 노출되지 않음</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>PoR의 3대 한계</text>

              {/* 한계 1: 부채 미반영 */}
              <AlertBox x={15} y={35} w={140} h={55} label="1. 부채 미반영" sub="" color={C.red} />
              <text x={85} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">자산 100 보유 표시</text>
              <text x={85} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">부채 90 미표시</text>

              {/* 한계 2: 스냅샷 조작 */}
              <AlertBox x={170} y={35} w={140} h={55} label="2. 스냅샷 시점 조작" sub="" color={C.amber} />
              <text x={240} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">검증 직전 차입</text>
              <text x={240} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">검증 후 반환</text>

              {/* 한계 3: 완전성 */}
              <AlertBox x={325} y={35} w={140} h={55} label="3. 완전성 문제" sub="" color={C.slate} />
              <text x={395} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">검증 참여율 낮음</text>
              <text x={395} y={85} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">누락 발각 어려움</text>

              {/* 대응 방안 */}
              <text x={240} y={115} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>대응 방안</text>

              <ActionBox x={15} y={128} w={140} h={34} label="부채 감사 병행" sub="PoL(Proof of Liabilities)" color={C.green} />
              <ActionBox x={170} y={128} w={140} h={34} label="불시 검증" sub="사전 예고 없는 감사" color={C.green} />
              <ActionBox x={325} y={128} w={140} h={34} label="zk 전수 검증" sub="전체 이용자 자동 포함" color={C.green} />

              {/* 결론 */}
              <rect x={40} y={178} width={400} height={30} rx={6} fill="var(--card)" stroke={C.blue} strokeWidth={0.5} />
              <text x={240} y={197} textAnchor="middle" fontSize={9} fill={C.blue}>PoR은 필요 조건이지 충분 조건이 아니다 → 법적 감독 + 외부 감사와 병행 필수</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
